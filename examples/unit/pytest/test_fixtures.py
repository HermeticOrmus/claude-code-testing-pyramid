"""
Pytest Fixtures Demonstration
Shows: Fixture scopes, autouse, parametrize fixtures, yield fixtures
"""

import pytest
from typing import Generator


# Module-scope fixture (setup once per module)
@pytest.fixture(scope="module")
def database_connection():
    """Simulate database connection - expensive setup"""
    print("\n🔌 Connecting to database...")
    connection = {"connected": True, "data": {}}
    yield connection
    print("\n🔌 Closing database connection...")


# Function-scope fixture (default - setup for each test)
@pytest.fixture
def user_data():
    """Provide fresh user data for each test"""
    return {
        "id": "1",
        "name": "Test User",
        "email": "test@example.com"
    }


# Parametrized fixture (creates multiple versions)
@pytest.fixture(params=["admin", "user", "guest"])
def user_role(request):
    """Provide different user roles"""
    return request.param


# Autouse fixture (runs automatically for all tests in scope)
@pytest.fixture(autouse=True)
def reset_state():
    """Automatically reset state before each test"""
    print("\n🔄 Resetting state...")
    yield
    print("\n🧹 Cleaning up...")


# Fixture that depends on another fixture
@pytest.fixture
def authenticated_user(database_connection, user_data):
    """Create authenticated user using other fixtures"""
    database_connection["data"]["current_user"] = user_data
    return {**user_data, "authenticated": True}


# Yield fixture for setup/teardown
@pytest.fixture
def temp_file() -> Generator[str, None, None]:
    """Create temporary file and clean up"""
    filename = "/tmp/test_file.txt"
    print(f"\n📝 Creating {filename}")

    with open(filename, "w") as f:
        f.write("test content")

    yield filename

    # Cleanup
    import os
    os.remove(filename)
    print(f"\n🗑️ Removed {filename}")


class TestFixtureScopes:
    """Demonstrate different fixture scopes"""

    def test_module_fixture_1(self, database_connection):
        """First test using module-scoped fixture"""
        assert database_connection["connected"] is True
        database_connection["data"]["test1"] = "data"

    def test_module_fixture_2(self, database_connection):
        """Second test - same fixture instance"""
        # Data from test1 is still there!
        assert "test1" in database_connection["data"]

    def test_function_fixture_1(self, user_data):
        """First test using function-scoped fixture"""
        user_data["modified"] = True
        assert user_data["modified"] is True

    def test_function_fixture_2(self, user_data):
        """Second test - new fixture instance"""
        # Modification from test1 is not here
        assert "modified" not in user_data


class TestParametrizedFixtures:
    """Demonstrate parametrized fixtures"""

    def test_different_user_roles(self, user_role):
        """Test runs 3 times with different roles"""
        assert user_role in ["admin", "user", "guest"]
        print(f"\n👤 Testing with role: {user_role}")


class TestDependentFixtures:
    """Demonstrate fixture dependencies"""

    def test_authenticated_user(self, authenticated_user, database_connection):
        """Test using fixture that depends on other fixtures"""
        assert authenticated_user["authenticated"] is True
        assert database_connection["data"]["current_user"] == {
            "id": "1",
            "name": "Test User",
            "email": "test@example.com"
        }


class TestYieldFixtures:
    """Demonstrate yield fixtures for cleanup"""

    def test_temp_file(self, temp_file):
        """Test with temporary file"""
        with open(temp_file, "r") as f:
            content = f.read()
        assert content == "test content"
        # File will be deleted after test


# Conftest-style fixtures (normally in conftest.py)
@pytest.fixture
def mock_api_response():
    """Mock API response"""
    return {
        "status": 200,
        "data": {
            "users": [
                {"id": "1", "name": "Alice"},
                {"id": "2", "name": "Bob"}
            ]
        }
    }


class TestMockFixtures:
    """Demonstrate mock fixtures"""

    def test_api_response(self, mock_api_response):
        """Test with mocked API response"""
        assert mock_api_response["status"] == 200
        assert len(mock_api_response["data"]["users"]) == 2


# Factory fixtures
@pytest.fixture
def user_factory():
    """Factory to create multiple users"""
    def _create_user(name: str, email: str):
        return {
            "id": str(hash(email)),
            "name": name,
            "email": email
        }
    return _create_user


class TestFactoryFixtures:
    """Demonstrate factory fixtures"""

    def test_create_multiple_users(self, user_factory):
        """Create multiple users in one test"""
        user1 = user_factory("Alice", "alice@example.com")
        user2 = user_factory("Bob", "bob@example.com")

        assert user1["name"] == "Alice"
        assert user2["name"] == "Bob"
        assert user1["id"] != user2["id"]
