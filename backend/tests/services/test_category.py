import uuid

from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryUpdate
from app.services.category import (
    create_category,
    delete_category,
    get_category,
    get_categories,
    update_category,
)


def test_create_category(db_session, create_test_user):
    user = create_test_user()

    category = create_category(
        db=db_session,
        user_id=user.id,
        data=CategoryCreate(name="Work"),
    )

    assert category.id is not None
    assert category.user_id == user.id
    assert category.name == "Work"


def test_get_categories_only_returns_current_users_categories(
    db_session,
    create_test_user,
):
    user = create_test_user()
    another_user = create_test_user()

    create_category(
        db=db_session,
        user_id=user.id,
        data=CategoryCreate(name="Work"),
    )

    create_category(
        db=db_session,
        user_id=another_user.id,
        data=CategoryCreate(name="Private"),
    )

    categories = get_categories(
        db=db_session,
        user_id=user.id,
    )

    assert len(categories) == 1
    assert categories[0].name == "Work"
    assert categories[0].user_id == user.id


def test_get_category(
    db_session,
    create_test_user,
):
    user = create_test_user()

    category = create_category(
        db=db_session,
        user_id=user.id,
        data=CategoryCreate(name="Work"),
    )

    result = get_category(
        db=db_session,
        user_id=user.id,
        category_id=category.id,
    )

    assert result is not None
    assert result.id == category.id
    assert result.name == "Work"


def test_get_category_does_not_return_another_users_category(
    db_session,
    create_test_user,
):
    owner = create_test_user()
    another_user = create_test_user()

    category = create_category(
        db=db_session,
        user_id=owner.id,
        data=CategoryCreate(name="Private"),
    )

    result = get_category(
        db=db_session,
        user_id=another_user.id,
        category_id=category.id,
    )

    assert result is None


def test_update_category(
    db_session,
    create_test_user,
):
    user = create_test_user()

    category = create_category(
        db=db_session,
        user_id=user.id,
        data=CategoryCreate(name="Old name"),
    )

    updated = update_category(
        db=db_session,
        user_id=user.id,
        category_id=category.id,
        data=CategoryUpdate(name="New name"),
    )

    assert updated is not None
    assert updated.name == "New name"


def test_update_category_does_not_allow_another_user(
    db_session,
    create_test_user,
):
    owner = create_test_user()
    another_user = create_test_user()

    category = create_category(
        db=db_session,
        user_id=owner.id,
        data=CategoryCreate(name="Private"),
    )

    result = update_category(
        db=db_session,
        user_id=another_user.id,
        category_id=category.id,
        data=CategoryUpdate(name="Hacked"),
    )

    assert result is None


def test_delete_category(
    db_session,
    create_test_user,
):
    user = create_test_user()

    category = create_category(
        db=db_session,
        user_id=user.id,
        data=CategoryCreate(name="Delete me"),
    )

    category_id = category.id

    result = delete_category(
        db=db_session,
        user_id=user.id,
        category_id=category_id,
    )

    assert result is True

    deleted = get_category(
        db=db_session,
        user_id=user.id,
        category_id=category_id,
    )

    assert deleted is None


def test_delete_category_does_not_allow_another_user(
    db_session,
    create_test_user,
):
    owner = create_test_user()
    another_user = create_test_user()

    category = create_category(
        db=db_session,
        user_id=owner.id,
        data=CategoryCreate(name="Private"),
    )

    result = delete_category(
        db=db_session,
        user_id=another_user.id,
        category_id=category.id,
    )

    assert result is False