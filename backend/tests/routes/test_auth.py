from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_register_route():
    response = client.post("/auth/register")

    assert response.status_code == 200
    assert response.json() == {"message": "Registration endpoint"}


def test_login_route():
    response = client.post("/auth/login")

    assert response.status_code == 200
    assert response.json() == {"message": "Login endpoint"}