import uuid

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.db.base import Base
from app.models.user import User


TEST_DATABASE_URL = (
    "postgresql+psycopg://postgres:postgres@localhost:5432/taskflow_test"
)


engine = create_engine(
    TEST_DATABASE_URL,
    pool_pre_ping=True,
)


TestingSessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
    expire_on_commit=False,
)


@pytest.fixture
def db_session():
    Base.metadata.create_all(bind=engine)

    db = TestingSessionLocal()

    try:
        yield db
    finally:
        db.rollback()
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture
def create_test_user(db_session):
    def _create_test_user(
        email: str | None = None,
    ) -> User:
        user = User(
            id=uuid.uuid4(),
            full_name="Test User",
            email=email or f"{uuid.uuid4()}@example.com",
            password_hash="test-password-hash",
        )

        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)

        return user

    return _create_test_user