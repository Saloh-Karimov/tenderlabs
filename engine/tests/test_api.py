"""HTTP surface tests for the batch convert endpoint (auth mocked at the
verify_token seam; real JWT verification is covered by Supabase's JWKS)."""

import io
import zipfile

import pytest
from fastapi.testclient import TestClient

import main
from tests.test_processor import SAMPLE_ROWS, make_csv

client = TestClient(main.app)


def file_parts(*named):
    return [("files", (name, content, "text/csv")) for name, content in named]


@pytest.fixture
def as_user(monkeypatch):
    monkeypatch.setattr(main, "verify_token", lambda token: "user-123")


def test_convert_requires_bearer_token():
    res = client.post("/api/v1/convert?tender_name=T",
                      files=file_parts(("a - CHW.csv", make_csv(SAMPLE_ROWS))))
    assert res.status_code == 401

    res = client.post(
        "/api/v1/convert?tender_name=T",
        files=file_parts(("a - CHW.csv", make_csv(SAMPLE_ROWS))),
        headers={"Authorization": "Bearer not-a-real-jwt"},
    )
    assert res.status_code == 401


def test_convert_single_file_happy_path(as_user):
    res = client.post(
        "/api/v1/convert",
        params={"tender_name": "Tower A", "lump_mode": "false"},
        files=file_parts(("Tower A - CHW.csv", make_csv(SAMPLE_ROWS))),
        headers={"Authorization": "Bearer x"},
    )
    assert res.status_code == 200
    assert res.headers["content-type"] == "application/zip"
    assert 'filename="Tower A - CavSoft Import.zip"' in res.headers["content-disposition"]

    zf = zipfile.ZipFile(io.BytesIO(res.content))
    assert "Tower A - SUMMARY.xlsx" in zf.namelist()
    assert "CHW/Tower A - LEVEL 1 - CHW.xlsx" in zf.namelist()


def test_convert_batch_multi_system(as_user):
    chw = make_csv([["Pipe", "10", "m", "1", "LEVEL 1", "", "", "C1", "CHW Pipe"]])
    hw = make_csv([["Pipe", "4", "m", "1", "LEVEL 1", "", "", "H1", "HW Pipe"]])
    cw = make_csv([["Valve", "", "", "2", "ROOF", "", "", "W1", "CW Valve"]])

    res = client.post(
        "/api/v1/convert",
        params={"tender_name": "Job"},
        files=file_parts(("Job - CHW.csv", chw), ("Job - HW.csv", hw),
                         ("Job - CW.csv", cw)),
        headers={"Authorization": "Bearer x"},
    )
    assert res.status_code == 200

    zf = zipfile.ZipFile(io.BytesIO(res.content))
    assert sorted(zf.namelist()) == [
        "CHW/Job - LEVEL 1 - CHW.xlsx",
        "CW/Job - ROOF - CW.xlsx",
        "HW/Job - LEVEL 1 - HW.xlsx",
        "Job - SUMMARY.xlsx",
    ]


def test_convert_rejects_oversize_declared(as_user):
    res = client.post(
        "/api/v1/convert?tender_name=T",
        content=b"x",
        headers={"Authorization": "Bearer x",
                 "Content-Length": str(30 * 1024 * 1024)},
    )
    assert res.status_code == 413


def test_convert_non_multipart_body_is_422(as_user):
    res = client.post(
        "/api/v1/convert?tender_name=T",
        content=b"not,a,multipart",
        headers={"Authorization": "Bearer x", "Content-Type": "text/csv"},
    )
    assert res.status_code == 422


def test_convert_no_file_parts_is_422(as_user):
    res = client.post(
        "/api/v1/convert?tender_name=T",
        data={"note": "no files here"},
        headers={"Authorization": "Bearer x"},
    )
    assert res.status_code == 422


def test_convert_unparseable_is_422_with_no_row_data(as_user):
    res = client.post(
        "/api/v1/convert?tender_name=T",
        files=file_parts(
            ("chw.csv",
             make_csv([["SecretSubject", "", "", "5", "L1", "", "", "", ""]]))),
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
