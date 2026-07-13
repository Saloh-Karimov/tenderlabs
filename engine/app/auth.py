"""Supabase JWT verification.

PyJWT against the project's JWKS endpoint (asymmetric signing keys).
PyJWKClient caches the fetched keys, so verification after the first
request is local — no network round-trip per call.
"""

import jwt
from jwt import PyJWKClient

from app.config import get_settings


class AuthError(Exception):
    pass


_jwk_client: PyJWKClient | None = None


def _get_jwk_client() -> PyJWKClient:
    global _jwk_client
    if _jwk_client is None:
        _jwk_client = PyJWKClient(
            get_settings().jwks_url, cache_keys=True, lifespan=3600
        )
    return _jwk_client


def verify_token(token: str) -> str:
    """Verify a Supabase access token; return the user id (sub claim)."""
    settings = get_settings()
    try:
        signing_key = _get_jwk_client().get_signing_key_from_jwt(token)
        claims = jwt.decode(
            token,
            signing_key.key,
            algorithms=["ES256", "RS256"],
            audience=settings.jwt_audience,
            options={"require": ["exp", "sub", "aud"]},
        )
    except (jwt.PyJWTError, jwt.PyJWKClientError) as exc:
        raise AuthError("Invalid or expired token") from exc

    return str(claims["sub"])
