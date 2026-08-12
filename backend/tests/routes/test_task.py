import pytest
from fastapi.testclient import TestClient

from app.auth.dependencies import get_current_user
from app.db.dependencies import get_db
from app.main import app
from app.models.category import Category
from app.models.task import Task, TaskPriority, TaskStatus


@pytest.fixture
def authenticated_task_client(db_session, create_test_user):
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


def test_create_task(authenticated_task_client):
    client, user = authenticated_task_client

    response = client.post(
        "/tasks",
        json={
            "title": "Build TaskFlow API",
            "description": "Implement task endpoints",
            "status": "TODO",
            "priority": "HIGH",
        },
    )

    assert response.status_code == 201

    data = response.json()

    assert data["title"] == "Build TaskFlow API"
    assert data["description"] == "Implement task endpoints"
    assert data["status"] == "TODO"
    assert data["priority"] == "HIGH"
    assert data["user_id"] == str(user.id)
    assert data["category_id"] is None
    assert "id" in data
    assert "created_at" in data
    assert "updated_at" in data


def test_create_task_with_category(
    authenticated_task_client,
    db_session,
):
    client, user = authenticated_task_client

    category = Category(
        user_id=user.id,
        name="Work",
    )

    db_session.add(category)
    db_session.commit()
    db_session.refresh(category)

    response = client.post(
        "/tasks",
        json={
            "title": "Task with category",
            "category_id": str(category.id),
        },
    )

    assert response.status_code == 201

    data = response.json()

    assert data["title"] == "Task with category"
    assert data["category_id"] == str(category.id)
    assert data["user_id"] == str(user.id)


def test_list_tasks(authenticated_task_client, db_session):
    client, user = authenticated_task_client

    db_session.add(
        Task(
            user_id=user.id,
            title="Task one",
            status=TaskStatus.TODO,
            priority=TaskPriority.MEDIUM,
        )
    )

    db_session.add(
        Task(
            user_id=user.id,
            title="Task two",
            status=TaskStatus.TODO,
            priority=TaskPriority.HIGH,
        )
    )

    db_session.commit()

    response = client.get("/tasks")

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 2
    assert {task["title"] for task in data} == {
        "Task one",
        "Task two",
    }


def test_list_tasks_only_returns_current_users_tasks(
    authenticated_task_client,
    db_session,
    create_test_user,
):
    client, user = authenticated_task_client

    another_user = create_test_user()

    db_session.add(
        Task(
            user_id=user.id,
            title="My task",
            status=TaskStatus.TODO,
            priority=TaskPriority.MEDIUM,
        )
    )

    db_session.add(
        Task(
            user_id=another_user.id,
            title="Someone else's task",
            status=TaskStatus.TODO,
            priority=TaskPriority.MEDIUM,
        )
    )

    db_session.commit()

    response = client.get("/tasks")

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 1
    assert data[0]["title"] == "My task"
    assert data[0]["user_id"] == str(user.id)


def test_get_task(authenticated_task_client, db_session):
    client, user = authenticated_task_client

    task = Task(
        user_id=user.id,
        title="Find me",
        status=TaskStatus.TODO,
        priority=TaskPriority.MEDIUM,
    )

    db_session.add(task)
    db_session.commit()
    db_session.refresh(task)

    response = client.get(f"/tasks/{task.id}")

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == str(task.id)
    assert data["title"] == "Find me"
    assert data["user_id"] == str(user.id)


def test_get_task_returns_404_for_nonexistent_task(
    authenticated_task_client,
):
    client, _ = authenticated_task_client

    task_id = "00000000-0000-0000-0000-000000000000"

    response = client.get(f"/tasks/{task_id}")

    assert response.status_code == 404
    assert response.json()["detail"] == "Task not found."


def test_get_task_does_not_allow_another_user(
    authenticated_task_client,
    db_session,
    create_test_user,
):
    client, _ = authenticated_task_client

    another_user = create_test_user()

    task = Task(
        user_id=another_user.id,
        title="Private task",
        status=TaskStatus.TODO,
        priority=TaskPriority.MEDIUM,
    )

    db_session.add(task)
    db_session.commit()
    db_session.refresh(task)

    response = client.get(f"/tasks/{task.id}")

    assert response.status_code == 404
    assert response.json()["detail"] == "Task not found."


def test_update_task(authenticated_task_client, db_session):
    client, user = authenticated_task_client

    task = Task(
        user_id=user.id,
        title="Old title",
        status=TaskStatus.TODO,
        priority=TaskPriority.MEDIUM,
    )

    db_session.add(task)
    db_session.commit()
    db_session.refresh(task)

    response = client.patch(
        f"/tasks/{task.id}",
        json={
            "title": "New title",
            "priority": "HIGH",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == str(task.id)
    assert data["title"] == "New title"
    assert data["priority"] == "HIGH"
    assert data["user_id"] == str(user.id)


def test_update_task_does_not_allow_another_user(
    authenticated_task_client,
    db_session,
    create_test_user,
):
    client, _ = authenticated_task_client

    another_user = create_test_user()

    task = Task(
        user_id=another_user.id,
        title="Private task",
        status=TaskStatus.TODO,
        priority=TaskPriority.MEDIUM,
    )

    db_session.add(task)
    db_session.commit()
    db_session.refresh(task)

    response = client.patch(
        f"/tasks/{task.id}",
        json={
            "title": "Hacked",
        },
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Task not found."


def test_delete_task(authenticated_task_client, db_session):
    client, user = authenticated_task_client

    task = Task(
        user_id=user.id,
        title="Delete me",
        status=TaskStatus.TODO,
        priority=TaskPriority.MEDIUM,
    )

    db_session.add(task)
    db_session.commit()
    db_session.refresh(task)

    response = client.delete(f"/tasks/{task.id}")

    assert response.status_code == 204
    assert response.content == b""

    deleted_task = db_session.get(Task, task.id)

    assert deleted_task is None


def test_delete_task_does_not_allow_another_user(
    authenticated_task_client,
    db_session,
    create_test_user,
):
    client, _ = authenticated_task_client

    another_user = create_test_user()

    task = Task(
        user_id=another_user.id,
        title="Private task",
        status=TaskStatus.TODO,
        priority=TaskPriority.MEDIUM,
    )

    db_session.add(task)
    db_session.commit()
    db_session.refresh(task)

    response = client.delete(f"/tasks/{task.id}")

    assert response.status_code == 404
    assert response.json()["detail"] == "Task not found."