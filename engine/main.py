"""TenderLabs conversion engine — FastAPI entrypoint.

ZERO DATA RETENTION: the request body is streamed straight into RAM with a
hard size cap (never FastAPI UploadFile — it spools to disk), processed by
the pure core, and the resulting ZIP streams back from memory. Only
metadata (user id, project name, mode, counts, duration) is ever logged.
"""

import io
import time

import structlog
from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.concurrency import run_in_threadpool
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from starlette.background import BackgroundTask

from app.auth import AuthError, verify_token
from app.config import get_settings
from app.core.processor import ParseError, convert, sanitise

structlog.configure(processors=[structlog.processors.TimeStamper(fmt="iso"),
                                structlog.processors.JSONRenderer()])
log = structlog.get_logger()

settings = get_settings()

app = FastAPI(title="TenderLabs Engine", docs_url=None, redoc_url=None)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.allowed_origin],
    allow_methods=["POST"],
    allow_headers=["Authorization", "Content-Type"],
    expose_headers=["Content-Disposition"],
)


@app.get("/healthz")
async def healthz():
    return {"status": "ok"}


def _authenticate(request: Request) -> str:
    auth_header = request.headers.get("Authorization", "")
    scheme, _, token = auth_header.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise HTTPException(status_code=401, detail="Missing bearer token",
                            headers={"WWW-Authenticate": "Bearer"})
    try:
        return verify_token(token.strip())
    except AuthError:
        raise HTTPException(status_code=401, detail="Invalid or expired token",
                            headers={"WWW-Authenticate": "Bearer"})


async def _read_body_capped(request: Request) -> bytes:
    """Stream the raw body into RAM, aborting before buffering past the cap."""
    cap = settings.max_upload_bytes

    declared = request.headers.get("Content-Length")
    if declared and declared.isdigit() and int(declared) > cap:
        raise HTTPException(status_code=413, detail="File exceeds 25 MB limit")

    buf = io.BytesIO()
    received = 0
    async for chunk in request.stream():
        received += len(chunk)
        if received > cap:
            raise HTTPException(status_code=413, detail="File exceeds 25 MB limit")
        buf.write(chunk)
    return buf.getvalue()


@app.post("/api/v1/convert")
async def convert_endpoint(
    request: Request,
    tender_name: str = Query(min_length=1, max_length=120),
    lump_mode: bool = Query(False),
    filename: str = Query("", max_length=255),
):
    user_id = _authenticate(request)
    started = time.monotonic()

    csv_bytes = await _read_body_capped(request)
    if not csv_bytes:
        raise HTTPException(status_code=422, detail="Empty request body")

    try:
        result = await run_in_threadpool(
            convert, csv_bytes, tender_name, lump_mode, filename
        )
    except ParseError as exc:
        # ParseError messages reference column headers/structure only.
        raise HTTPException(status_code=422, detail=str(exc))
    except Exception:
        log.error("conversion_failed", user_id=user_id)
        raise HTTPException(status_code=500, detail="Conversion failed")

    duration_ms = round((time.monotonic() - started) * 1000)
    download_name = f"{sanitise(tender_name)} - CAVSOFT IMPORT.zip"

    def log_metadata():
        log.info(
            "conversion_complete",
            user_id=user_id,
            project=sanitise(tender_name),
            mode="lump_sum" if lump_mode else "level_by_level",
            row_count=result.row_count,
            file_count=result.file_count,
            warning_count=result.warning_count,
            duration_ms=duration_ms,
        )

    return StreamingResponse(
        io.BytesIO(result.zip_bytes),
        media_type="application/zip",
        headers={
            "Content-Disposition":
                f'attachment; filename="{download_name.encode("ascii", "replace").decode()}"',
            "Content-Length": str(len(result.zip_bytes)),
        },
        background=BackgroundTask(log_metadata),
    )
