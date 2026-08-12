from unittest.mock import Mock, patch

from app.services.auth import authenticate_user


def test_authenticate_user_returns_none_for_unknown_user():
    db = Mock()

    with patch(
        "app.services.auth.get_user_by_email",
        return_value=None,
    ):
        result = authenticate_user(
            db,
            "unknown@example.com",
            "TestPassword123!",
        )

    assert result is None