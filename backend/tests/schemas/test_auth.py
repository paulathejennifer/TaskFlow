import pytest
from pydantic import ValidationError

from app.schemas.auth import UserRegister


def test_valid_user_registration():
    user = UserRegister(
        full_name="Test User",
        email="test@example.com",
        password="TestPassword123!",
    )

    assert user.full_name == "Test User"
    assert user.email == "test@example.com"


def test_invalid_email():
    with pytest.raises(ValidationError):
        UserRegister(
            full_name="Test User",
            email="not-an-email",
            password="TestPassword123!",
        )


def test_short_password():
    with pytest.raises(ValidationError):
        UserRegister(
            full_name="Test User",
            email="test@example.com",
            password="short",
        )