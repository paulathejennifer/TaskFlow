from app.models.task import TaskPriority, TaskStatus
from app.schemas.task import TaskCreate, TaskUpdate
from app.services.task import (
    create_task,
    delete_task,
    get_task,
    get_tasks,
    update_task,
)


def test_create_task(db_session, create_test_user):
    user = create_test_user()

    task_data = TaskCreate(
        title="Test task",
        description="Test description",
        status=TaskStatus.TODO,
        priority=TaskPriority.MEDIUM,
    )

    task = create_task(
        db=db_session,
        user_id=user.id,
        data=task_data,
    )

    assert task.id is not None
    assert task.user_id == user.id
    assert task.title == "Test task"
    assert task.description == "Test description"
    assert task.status == TaskStatus.TODO
    assert task.priority == TaskPriority.MEDIUM


def test_get_task(db_session, create_test_user):
    user = create_test_user()

    created_task = create_task(
        db=db_session,
        user_id=user.id,
        data=TaskCreate(title="Find me"),
    )

    task = get_task(
        db=db_session,
        user_id=user.id,
        task_id=created_task.id,
    )

    assert task is not None
    assert task.id == created_task.id


def test_get_task_does_not_return_another_users_task(
    db_session,
    create_test_user,
):
    owner = create_test_user()
    another_user = create_test_user()

    task = create_task(
        db=db_session,
        user_id=owner.id,
        data=TaskCreate(title="Private task"),
    )

    result = get_task(
        db=db_session,
        user_id=another_user.id,
        task_id=task.id,
    )

    assert result is None


def test_get_tasks(db_session, create_test_user):
    user = create_test_user()

    create_task(
        db=db_session,
        user_id=user.id,
        data=TaskCreate(title="Task one"),
    )

    create_task(
        db=db_session,
        user_id=user.id,
        data=TaskCreate(title="Task two"),
    )

    tasks = get_tasks(
        db=db_session,
        user_id=user.id,
    )

    assert len(tasks) == 2
    assert all(
        task.user_id == user.id
        for task in tasks
    )


def test_get_tasks_only_returns_current_users_tasks(
    db_session,
    create_test_user,
):
    user = create_test_user()
    another_user = create_test_user()

    create_task(
        db=db_session,
        user_id=user.id,
        data=TaskCreate(title="My task"),
    )

    create_task(
        db=db_session,
        user_id=another_user.id,
        data=TaskCreate(
            title="Someone else's task"
        ),
    )

    tasks = get_tasks(
        db=db_session,
        user_id=user.id,
    )

    assert len(tasks) == 1
    assert tasks[0].title == "My task"


def test_update_task(db_session, create_test_user):
    user = create_test_user()

    task = create_task(
        db=db_session,
        user_id=user.id,
        data=TaskCreate(title="Old title"),
    )

    updated_task = update_task(
        db=db_session,
        user_id=user.id,
        task_id=task.id,
        data=TaskUpdate(
            title="New title",
            priority=TaskPriority.HIGH,
        ),
    )

    assert updated_task is not None
    assert updated_task.title == "New title"
    assert updated_task.priority == TaskPriority.HIGH


def test_update_task_returns_none_for_wrong_user(
    db_session,
    create_test_user,
):
    owner = create_test_user()
    another_user = create_test_user()

    task = create_task(
        db=db_session,
        user_id=owner.id,
        data=TaskCreate(title="Private task"),
    )

    result = update_task(
        db=db_session,
        user_id=another_user.id,
        task_id=task.id,
        data=TaskUpdate(title="Hacked"),
    )

    assert result is None


def test_delete_task(db_session, create_test_user):
    user = create_test_user()

    task = create_task(
        db=db_session,
        user_id=user.id,
        data=TaskCreate(title="Delete me"),
    )

    task_id = task.id

    result = delete_task(
        db=db_session,
        user_id=user.id,
        task_id=task_id,
    )

    assert result is True

    deleted_task = get_task(
        db=db_session,
        user_id=user.id,
        task_id=task_id,
    )

    assert deleted_task is None


def test_delete_task_returns_false_for_wrong_user(
    db_session,
    create_test_user,
):
    owner = create_test_user()
    another_user = create_test_user()

    task = create_task(
        db=db_session,
        user_id=owner.id,
        data=TaskCreate(title="Private task"),
    )

    result = delete_task(
        db=db_session,
        user_id=another_user.id,
        task_id=task.id,
    )

    assert result is False