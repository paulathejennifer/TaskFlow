import pytest
from fastapi.testclient import TestClient

from app.db.dependencies import get_db
from app.main import app


@pytest.fixture
def auth_client(db_session):
    def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db

    client = TestClient(app)

    yield client

    app.dependency_overrides.clear()


def test_register_user(auth_client):
    response = auth_client.post(
        "/auth/register",
        json={
            "full_name": "Test User",
            "email": "test@example.com",
            "password": "TestPassword123!",
        },
    )

    assert response.status_code == 201

    data = response.json()

    assert data["full_name"] == "Test User"
    assert data["email"] == "test@example.com"
    assert "id" in data

    assert "password" not in data
    assert "password_hash" not in data


def test_register_rejects_duplicate_email(auth_client):
    payload = {
        "full_name": "Test User",
        "email": "duplicate@example.com",
        "password": "TestPassword123!",
    }

    first_response = auth_client.post(
        "/auth/register",
        json=payload,
    )

    assert first_response.status_code == 201

    second_response = auth_client.post(
        "/auth/register",
        json=payload,
    )

    assert second_response.status_code == 409
    assert (
        second_response.json()["detail"]
        == "A user with this email already exists."
    )


def test_register_rejects_invalid_email(auth_client):
    response = auth_client.post(
        "/auth/register",
        json={
            "full_name": "Test User",
            "email": "not-an-email",
            "password": "TestPassword123!",
        },
    )

    assert response.status_code == 422


def test_register_rejects_short_password(auth_client):
    response = auth_client.post(
        "/auth/register",
        json={
            "full_name": "Test User",
            "email": "short@example.com",
            "password": "short",
        },
    )

    assert response.status_code == 422


def test_login_returns_access_token(auth_client):
    register_response = auth_client.post(
        "/auth/register",
        json={
            "full_name": "Login User",
            "email": "login@example.com",
            "password": "TestPassword123!",
        },
    )

    assert register_response.status_code == 201

    response = auth_client.post(
        "/auth/login",
        json={
            "email": "login@example.com",
            "password": "TestPassword123!",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "access_token" in data
    assert data["access_token"]
    assert data["token_type"] == "bearer"


def test_login_rejects_wrong_password(auth_client):
    auth_client.post(
        "/auth/register",
        json={
            "full_name": "Wrong Password User",
            "email": "wrongpassword@example.com",
            "password": "CorrectPassword123!",
        },
    )

    response = auth_client.post(
        "/auth/login",
        json={
            "email": "wrongpassword@example.com",
            "password": "WrongPassword123!",
        },
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password."


def test_login_rejects_unknown_user(auth_client):
    response = auth_client.post(
        "/auth/login",
        json={
            "email": "unknown@example.com",
            "password": "TestPassword123!",
        },
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password."


def test_get_me_returns_current_user(auth_client):
    register_response = auth_client.post(
        "/auth/register",
        json={
            "full_name": "Current User",
            "email": "current@example.com",
            "password": "TestPassword123!",
        },
    )

    assert register_response.status_code == 201

    login_response = auth_client.post(
        "/auth/login",
        json={
            "email": "current@example.com",
            "password": "TestPassword123!",
        },
    )

    assert login_response.status_code == 200

    token = login_response.json()["access_token"]

    response = auth_client.get(
        "/auth/me",
        headers={
            "Authorization": f"Bearer {token}",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["full_name"] == "Current User"
    assert data["email"] == "current@example.com"
    assert "id" in data


def test_get_me_requires_authentication(auth_client):
    response = auth_client.get("/auth/me")

    assert response.status_code == 401