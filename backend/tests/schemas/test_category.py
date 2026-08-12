import pytest
from pydantic import ValidationError

from app.schemas.category import CategoryCreate, CategoryUpdate


def test_category_create_accepts_valid_name():
    category = CategoryCreate(name="Work")

    assert category.name == "Work"


def test_category_create_rejects_empty_name():
    with pytest.raises(ValidationError):
        CategoryCreate(name="")


def test_category_create_rejects_name_longer_than_100_characters():
    with pytest.raises(ValidationError):
        CategoryCreate(name="A" * 101)


def test_category_update_accepts_valid_name():
    category = CategoryUpdate(name="Updated")

    assert category.name == "Updated"


def test_category_update_allows_name_to_be_omitted():
    category = CategoryUpdate()

    assert category.name is None