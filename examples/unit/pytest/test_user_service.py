"""
UserService Tests with Pytest
Demonstrates: Fixtures, async testing, mocking with pytest-mock, parametrized tests
"""

import pytest
from datetime import datetime
from unittest.mock import AsyncMock, Mock
from src.services.user_service import UserService, ValidationError, User


@pytest.fixture
def mock_db():
    """Create mock database client"""
    db = Mock()
    db.create_user = AsyncMock()
    db.find_by_email = AsyncMock()
    db.find_by_id = AsyncMock()
    db.update_user = AsyncMock()
    db.delete_user = AsyncMock()
    return db


@pytest.fixture
def user_service(mock_db):
    """Create user service with mocked database"""
    return UserService(mock_db)


@pytest.fixture
def valid_user_data():
    """Valid user data for testing"""
    return {
        "email": "test@example.com",
        "name": "Test User",
        "password": "password123"
    }


class TestCreateUser:
    """Tests for create_user method"""

    @pytest.mark.asyncio
    async def test_create_user_with_valid_data(self, user_service, mock_db, valid_user_data):
        """Should create user with valid data"""
        # Arrange
        expected_user = User(
            id="1",
            email="test@example.com",
            name="Test User",
            created_at=datetime.now(),
            updated_at=datetime.now()
        )

        mock_db.find_by_email.return_value = None
        mock_db.create_user.return_value = expected_user

        # Act
        user = await user_service.create_user(**valid_user_data)

        # Assert
        assert user.id == "1"
        assert user.email == "test@example.com"
        mock_db.find_by_email.assert_called_once_with("test@example.com")
        mock_db.create_user.assert_called_once()

    @pytest.mark.asyncio
    async def test_normalize_email_to_lowercase(self, user_service, mock_db):
        """Should normalize email to lowercase"""
        # Arrange
        mock_db.find_by_email.return_value = None
        mock_db.create_user.return_value = User(
            id="1",
            email="test@example.com",
            name="Test",
            created_at=datetime.now(),
            updated_at=datetime.now()
        )

        # Act
        await user_service.create_user(
            email="TEST@EXAMPLE.COM",
            name="Test User",
            password="password123"
        )

        # Assert
        mock_db.find_by_email.assert_called_with("test@example.com")

    @pytest.mark.asyncio
    async def test_trim_name_whitespace(self, user_service, mock_db):
        """Should trim whitespace from name"""
        # Arrange
        mock_db.find_by_email.return_value = None
        mock_db.create_user.return_value = User(
            id="1",
            email="test@example.com",
            name="Test User",
            created_at=datetime.now(),
            updated_at=datetime.now()
        )

        # Act
        await user_service.create_user(
            email="test@example.com",
            name="  Test User  ",
            password="password123"
        )

        # Assert
        call_args = mock_db.create_user.call_args[0][0]
        assert call_args["name"] == "Test User"

    @pytest.mark.asyncio
    @pytest.mark.parametrize("invalid_email", [
        "invalid",
        "invalid@",
        "@example.com",
        "invalid.email",
        ""
    ])
    async def test_invalid_email_raises_error(self, user_service, invalid_email):
        """Should raise ValidationError for invalid email"""
        with pytest.raises(ValidationError, match="Invalid email address"):
            await user_service.create_user(
                email=invalid_email,
                name="Test User",
                password="password123"
            )

    @pytest.mark.asyncio
    @pytest.mark.parametrize("invalid_name", ["", "A", " "])
    async def test_short_name_raises_error(self, user_service, invalid_name):
        """Should raise ValidationError for short name"""
        with pytest.raises(ValidationError, match="Name must be at least 2 characters"):
            await user_service.create_user(
                email="test@example.com",
                name=invalid_name,
                password="password123"
            )

    @pytest.mark.asyncio
    @pytest.mark.parametrize("invalid_password", ["", "short", "1234567"])
    async def test_short_password_raises_error(self, user_service, invalid_password):
        """Should raise ValidationError for short password"""
        with pytest.raises(ValidationError, match="Password must be at least 8 characters"):
            await user_service.create_user(
                email="test@example.com",
                name="Test User",
                password=invalid_password
            )

    @pytest.mark.asyncio
    async def test_existing_email_raises_error(self, user_service, mock_db):
        """Should raise ValidationError when email already exists"""
        # Arrange
        mock_db.find_by_email.return_value = User(
            id="1",
            email="test@example.com",
            name="Existing",
            created_at=datetime.now(),
            updated_at=datetime.now()
        )

        # Act & Assert
        with pytest.raises(ValidationError, match="Email already exists"):
            await user_service.create_user(
                email="test@example.com",
                name="New User",
                password="password123"
            )

        mock_db.create_user.assert_not_called()


class TestGetUserByEmail:
    """Tests for get_user_by_email method"""

    @pytest.mark.asyncio
    async def test_return_user_when_found(self, user_service, mock_db):
        """Should return user when found"""
        # Arrange
        expected_user = User(
            id="1",
            email="test@example.com",
            name="Test",
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        mock_db.find_by_email.return_value = expected_user

        # Act
        user = await user_service.get_user_by_email("test@example.com")

        # Assert
        assert user == expected_user

    @pytest.mark.asyncio
    async def test_return_none_when_not_found(self, user_service, mock_db):
        """Should return None when user not found"""
        # Arrange
        mock_db.find_by_email.return_value = None

        # Act
        user = await user_service.get_user_by_email("none@example.com")

        # Assert
        assert user is None


class TestUpdateUser:
    """Tests for update_user method"""

    @pytest.mark.asyncio
    async def test_update_user_name(self, user_service, mock_db):
        """Should update user name"""
        # Arrange
        existing_user = User(
            id="1",
            email="test@example.com",
            name="Old Name",
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        updated_user = User(
            id="1",
            email="test@example.com",
            name="New Name",
            created_at=existing_user.created_at,
            updated_at=datetime.now()
        )

        mock_db.find_by_id.return_value = existing_user
        mock_db.update_user.return_value = updated_user

        # Act
        user = await user_service.update_user("1", name="New Name")

        # Assert
        assert user.name == "New Name"
        mock_db.update_user.assert_called_once_with("1", {"name": "New Name"})

    @pytest.mark.asyncio
    async def test_user_not_found_raises_error(self, user_service, mock_db):
        """Should raise ValidationError when user not found"""
        # Arrange
        mock_db.find_by_id.return_value = None

        # Act & Assert
        with pytest.raises(ValidationError, match="User not found"):
            await user_service.update_user("999", name="Test")


class TestDeleteUser:
    """Tests for delete_user method"""

    @pytest.mark.asyncio
    async def test_delete_existing_user(self, user_service, mock_db):
        """Should delete existing user"""
        # Arrange
        mock_db.find_by_id.return_value = User(
            id="1",
            email="test@example.com",
            name="Test",
            created_at=datetime.now(),
            updated_at=datetime.now()
        )

        # Act
        await user_service.delete_user("1")

        # Assert
        mock_db.delete_user.assert_called_once_with("1")

    @pytest.mark.asyncio
    async def test_delete_nonexistent_user_raises_error(self, user_service, mock_db):
        """Should raise ValidationError when user not found"""
        # Arrange
        mock_db.find_by_id.return_value = None

        # Act & Assert
        with pytest.raises(ValidationError, match="User not found"):
            await user_service.delete_user("999")

        mock_db.delete_user.assert_not_called()
