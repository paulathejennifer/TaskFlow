import pytest
from fastapi.testclient import TestClient

from app.auth.dependencies import get_current_user
from app.db.dependencies import get_db
from app.main import app
from app.models.category import Category


@pytest.fixture
def authenticated_category_client(db_session, create_test_user):
    user = create_test_user()

    def override_get_db():
        yield db_session

    def override_get_current_user():
        return user

    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_current_user] = override_get_current_user

    client = TestClient(app)

    yield client, user

    app.dependency_overrides.clear()


def test_create_category(authenticated_category_client):
    client, user = authenticated_category_client

    response = client.post(
        "/categories",
        json={
            "name": "Work",
        },
    )

    assert response.status_code == 201

    data = response.json()

    assert data["name"] == "Work"
    assert data["user_id"] == str(user.id)
    assert "id" in data
    assert "created_at" in data
    assert "updated_at" in data


def test_list_categories(authenticated_category_client, db_session):
    client, user = authenticated_category_client

    db_session.add(
        Category(
            user_id=user.id,
            name="Work",
        )
    )

    db_session.add(
        Category(
            user_id=user.id,
            name="Personal",
        )
    )

    db_session.commit()

    response = client.get("/categories")

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 2
    assert {category["name"] for category in data} == {
        "Work",
        "Personal",
    }


def test_list_categories_only_returns_current_users_categories(
    authenticated_category_client,
    db_session,
    create_test_user,
):
    client, user = authenticated_category_client

    another_user = create_test_user()

    db_session.add(
        Category(
            user_id=user.id,
            name="My category",
        )
    )

    db_session.add(
        Category(
            user_id=another_user.id,
            name="Private category",
        )
    )

    db_session.commit()

    response = client.get("/categories")

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 1
    assert data[0]["name"] == "My category"
    assert data[0]["user_id"] == str(user.id)


def test_get_category(authenticated_category_client, db_session):
    client, user = authenticated_category_client

    category = Category(
        user_id=user.id,
        name="Work",
    )

    db_session.add(category)
    db_session.commit()
    db_session.refresh(category)

    response = client.get(f"/categories/{category.id}")

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == str(category.id)
    assert data["name"] == "Work"
    assert data["user_id"] == str(user.id)


def test_get_category_returns_404_for_nonexistent_category(
    authenticated_category_client,
):
    client, _ = authenticated_category_client

    category_id = "00000000-0000-0000-0000-000000000000"

    response = client.get(f"/categories/{category_id}")

    assert response.status_code == 404
    assert response.json()["detail"] == "Category not found."


def test_get_category_does_not_allow_another_user(
    authenticated_category_client,
    db_session,
    create_test_user,
):
    client, _ = authenticated_category_client

    another_user = create_test_user()

    category = Category(
        user_id=another_user.id,
        name="Private category",
    )

    db_session.add(category)
    db_session.commit()
    db_session.refresh(category)

    response = client.get(f"/categories/{category.id}")

    assert response.status_code == 404
    assert response.json()["detail"] == "Category not found."


def test_update_category(authenticated_category_client, db_session):
    client, user = authenticated_category_client

    category = Category(
        user_id=user.id,
        name="Old name",
    )

    db_session.add(category)
    db_session.commit()
    db_session.refresh(category)

    response = client.patch(
        f"/categories/{category.id}",
        json={
            "name": "New name",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == str(category.id)
    assert data["name"] == "New name"
    assert data["user_id"] == str(user.id)


def test_update_category_does_not_allow_another_user(
    authenticated_category_client,
    db_session,
    create_test_user,
):
    client, _ = authenticated_category_client

    another_user = create_test_user()

    category = Category(
        user_id=another_user.id,
        name="Private category",
    )

    db_session.add(category)
    db_session.commit()
    db_session.refresh(category)

    response = client.patch(
        f"/categories/{category.id}",
        json={
            "name": "Hacked",
        },
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Category not found."


def test_delete_category(authenticated_category_client, db_session):
    client, user = authenticated_category_client

    category = Category(
        user_id=user.id,
        name="Delete me",
    )

    db_session.add(category)
    db_session.commit()
    db_session.refresh(category)

    response = client.delete(f"/categories/{category.id}")

    assert response.status_code == 204
    assert response.content == b""

    deleted_category = db_session.get(Category, category.id)

    assert deleted_category is None


def test_delete_category_does_not_allow_another_user(
    authenticated_category_client,
    db_session,
    create_test_user,
):
    client, _ = authenticated_category_client

    another_user = create_test_user()

    category = Category(
        user_id=another_user.id,
        name="Private category",
    )

    db_session.add(category)
    db_session.commit()
    db_session.refresh(category)

    response = client.delete(f"/categories/{category.id}")

    assert response.status_code == 404
    assert response.json()["detail"] == "Category not found."