from uuid import uuid4

import pytest
from pydantic import ValidationError

from app.models.task import TaskPriority, TaskStatus
from app.schemas.task import TaskCreate, TaskUpdate


def test_task_create_defaults():
    task = TaskCreate(title="Test task")

    assert task.title == "Test task"
    assert task.status == TaskStatus.TODO
    assert task.priority == TaskPriority.MEDIUM


def test_task_create_accepts_valid_data():
    category_id = uuid4()

    task = TaskCreate(
        title="Complete TaskFlow",
        description="Finish the backend",
        category_id=category_id,
        status=TaskStatus.IN_PROGRESS,
        priority=TaskPriority.HIGH,
    )

    assert task.category_id == category_id
    assert task.status == TaskStatus.IN_PROGRESS
    assert task.priority == TaskPriority.HIGH


def test_task_create_rejects_empty_title():
    with pytest.raises(ValidationError):
        TaskCreate(title="")


def test_task_create_rejects_title_over_200_characters():
    with pytest.raises(ValidationError):
        TaskCreate(title="x" * 201)


def test_task_update_allows_partial_updates():
    task = TaskUpdate(status=TaskStatus.DONE)

    assert task.status == TaskStatus.DONE
    assert task.title is None
    assert task.priority is None