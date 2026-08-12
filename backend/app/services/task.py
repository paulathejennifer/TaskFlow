from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.category import Category
from app.models.task import Task, TaskStatus
from app.schemas.task import TaskCreate, TaskUpdate


def _validate_category(
    db: Session,
    user_id: UUID,
    category_id: UUID | None,
) -> None:
    if category_id is None:
        return

    statement = select(Category.id).where(
        Category.id == category_id,
        Category.user_id == user_id,
    )

    category_exists = db.scalar(statement)

    if category_exists is None:
        raise ValueError(
            "Category does not exist or does not belong to the current user"
        )


def _apply_completion_state(
    task: Task,
) -> None:
    if task.status == TaskStatus.DONE:
        if task.completed_at is None:
            from datetime import datetime, timezone

            task.completed_at = datetime.now(timezone.utc)

    else:
        task.completed_at = None


def create_task(
    db: Session,
    user_id: UUID,
    data: TaskCreate,
) -> Task:
    _validate_category(
        db=db,
        user_id=user_id,
        category_id=data.category_id,
    )

    task = Task(
        user_id=user_id,
        **data.model_dump(),
    )

    _apply_completion_state(task)

    db.add(task)
    db.commit()
    db.refresh(task)

    return task


def get_tasks(
    db: Session,
    user_id: UUID,
) -> list[Task]:
    statement = (
        select(Task)
        .where(Task.user_id == user_id)
        .order_by(Task.created_at.desc())
    )

    return list(db.scalars(statement).all())


def get_task(
    db: Session,
    user_id: UUID,
    task_id: UUID,
) -> Task | None:
    statement = select(Task).where(
        Task.id == task_id,
        Task.user_id == user_id,
    )

    return db.scalar(statement)


def update_task(
    db: Session,
    user_id: UUID,
    task_id: UUID,
    data: TaskUpdate,
) -> Task | None:
    task = get_task(
        db=db,
        user_id=user_id,
        task_id=task_id,
    )

    if task is None:
        return None

    updates = data.model_dump(
        exclude_unset=True,
    )

    if "category_id" in updates:
        _validate_category(
            db=db,
            user_id=user_id,
            category_id=updates["category_id"],
        )

    for field, value in updates.items():
        setattr(task, field, value)

    _apply_completion_state(task)

    db.commit()
    db.refresh(task)

    return task


def delete_task(
    db: Session,
    user_id: UUID,
    task_id: UUID,
) -> bool:
    task = get_task(
        db=db,
        user_id=user_id,
        task_id=task_id,
    )

    if task is None:
        return False

    db.delete(task)
    db.commit()

    return True