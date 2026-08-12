from app.core.config import settings


def test_settings_load():
    assert settings.database_url
    assert settings.secret_key
    assert settings.algorithm == "HS256"
    assert settings.access_token_expire_minutes == 30