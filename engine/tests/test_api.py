"""HTTP surface tests for the convert endpoint (auth mocked at the
verify_token seam; real JWT verification is covered by Supabase's JWKS)."""

import io
import zipfile

import pytest
from fastapi.testclient import TestClient

import main
from tests.test_processor import SAMPLE_ROWS, make_csv

client = TestClient(main.app)


@pytest.fixture
def as_user(monkeypatch):
    monkeypatch.setattr(main, "verify_token", lambda token: "user-123")


def test_convert_requires_bearer_token():
    res = client.post("/api/v1/convert?tender_name=T", content=b"x")
    assert res.status_code == 401

    res = client.post(
        "/api/v1/convert?tender_name=T",
        content=b"x",
        headers={"Authorization": "Bearer not-a-real-jwt"},
    )
    assert res.status_code == 401


def test_convert_happy_path(as_user):
    res = client.post(
        "/api/v1/convert",
        params={"tender_name": "Tower A", "lump_mode": "false",
                "filename": "Tower A - CHW.csv"},
        content=make_csv(SAMPLE_ROWS),
        headers={"Authorization": "Bearer x"},
    )
    assert res.status_code == 200
    assert res.headers["content-type"] == "application/zip"
    assert 'filename="Tower A - CAVSOFT IMPORT.zip"' in res.headers["content-disposition"]

    zf = zipfile.ZipFile(io.BytesIO(res.content))
    assert "Tower A - SUMMARY.xlsx" in zf.namelist()
    assert "CHW/Tower A - LEVEL 1 - CHW.xlsx" in zf.namelist()


def test_convert_rejects_oversize_declared(as_user):
    res = client.post(
        "/api/v1/convert?tender_name=T",
        content=b"x",
        headers={"Authorization": "Bearer x",
                 "Content-Length": str(30 * 1024 * 1024)},
    )
    assert res.status_code == 413


def test_convert_unparseable_is_422_with_no_row_data(as_user):
    res = client.post(
        "/api/v1/convert?tender_name=T&filename=chw.csv",
        content=make_csv([["SecretSubject", "", "", "5", "L1", "", "", "", ""]]),
        headers={"Authorization": "Bearer x"},
    )
    assert res.status_code == 422
    assert "SecretSubject" not in res.text  # never echo cell values


def test_convert_empty_body_is_422(as_user):
    res = client.post(
        "/api/v1/convert?tender_name=T",
        headers={"Authorization": "Bearer x"},
    )
    assert res.status_code == 422
