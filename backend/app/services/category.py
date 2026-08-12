from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryUpdate


def create_category(
    db: Session,
    user_id: UUID,
    data: CategoryCreate,
) -> Category:
    category = Category(
        user_id=user_id,
        **data.model_dump(),
    )

    db.add(category)
    db.commit()
    db.refresh(category)

    return category


def get_categories(
    db: Session,
    user_id: UUID,
) -> list[Category]:
    statement = (
        select(Category)
        .where(Category.user_id == user_id)
        .order_by(Category.created_at.desc())
    )

    return list(db.scalars(statement).all())


def get_category(
    db: Session,
    user_id: UUID,
    category_id: UUID,
) -> Category | None:
    statement = select(Category).where(
        Category.id == category_id,
        Category.user_id == user_id,
    )

    return db.scalar(statement)


def update_category(
    db: Session,
    user_id: UUID,
    category_id: UUID,
    data: CategoryUpdate,
) -> Category | None:
    category = get_category(
        db=db,
        user_id=user_id,
        category_id=category_id,
    )

    if category is None:
        return None

    updates = data.model_dump(exclude_unset=True)

    for field, value in updates.items():
        setattr(category, field, value)

    db.commit()
    db.refresh(category)

    return category


def delete_category(
    db: Session,
    user_id: UUID,
    category_id: UUID,
) -> bool:
    category = get_category(
        db=db,
        user_id=user_id,
        category_id=category_id,
    )

    if category is None:
        return False

    db.delete(category)
    db.commit()

    return True