"""In-memory multipart/form-data parsing.

FastAPI's UploadFile is banned here: Starlette spools any part larger than
~1 MB to a real on-disk temp file DURING parsing, before the handler can
read it — a zero-data-retention violation that cannot be configured away.
Instead the route buffers the raw (size-capped) body in RAM and this module
splits it into parts using the stdlib email parser, which never touches
the filesystem.
"""

from email import policy
from email.parser import BytesParser


class FormDataError(Exception):
    """Body is not parseable multipart/form-data."""


def parse_file_parts(content_type: str, body: bytes) -> list[tuple[str, bytes]]:
    """Extract (filename, bytes) for every file part in a multipart body.

    Non-file fields are ignored; order of parts is preserved.
    """
    if "multipart/form-data" not in content_type.lower():
        raise FormDataError("Expected a multipart/form-data body.")

    envelope = (
        f"Content-Type: {content_type}\r\nMIME-Version: 1.0\r\n\r\n".encode("latin-1")
    )
    try:
        msg = BytesParser(policy=policy.HTTP).parsebytes(envelope + body)
    except Exception as exc:
        raise FormDataError("Malformed multipart body.") from exc

    if not msg.is_multipart():
        raise FormDataError("Malformed multipart body (missing boundary?).")

    files: list[tuple[str, bytes]] = []
    for part in msg.iter_parts():
        filename = part.get_filename()
        if not filename:
            continue
        payload = part.get_payload(decode=True)
        if payload is None:
            payload = b""
        files.append((filename, payload))

    return files
