"""
UserService - Python implementation for Pytest examples
Demonstrates same patterns as TypeScript version
"""

import re
from dataclasses import dataclass
from datetime import datetime
from typing import Optional, Protocol


@dataclass
class User:
    id: str
    email: str
    name: str
    created_at: datetime
    updated_at: datetime


class ValidationError(Exception):
    """Custom validation error"""
    pass


class DatabaseClient(Protocol):
    """Database client interface"""

    async def create_user(self, data: dict) -> User:
        ...

    async def find_by_email(self, email: str) -> Optional[User]:
        ...

    async def find_by_id(self, user_id: str) -> Optional[User]:
        ...

    async def update_user(self, user_id: str, data: dict) -> User:
        ...

    async def delete_user(self, user_id: str) -> None:
        ...


class UserService:
    """User service business logic"""

    def __init__(self, db: DatabaseClient):
        self.db = db

    async def create_user(self, email: str, name: str, password: str) -> User:
        """Create a new user with validation"""

        # Validation
        if not self._is_valid_email(email):
            raise ValidationError("Invalid email address")

        if not name or len(name.strip()) < 2:
            raise ValidationError("Name must be at least 2 characters")

        if not password or len(password) < 8:
            raise ValidationError("Password must be at least 8 characters")

        # Check if user exists
        existing_user = await self.db.find_by_email(email.lower())
        if existing_user:
            raise ValidationError("Email already exists")

        # Create user
        user_data = {
            "email": email.lower(),
            "name": name.strip(),
            "password_hash": self._hash_password(password),
        }

        return await self.db.create_user(user_data)

    async def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        if not self._is_valid_email(email):
            raise ValidationError("Invalid email address")

        return await self.db.find_by_email(email.lower())

    async def get_user_by_id(self, user_id: str) -> Optional[User]:
        """Get user by ID"""
        if not user_id:
            raise ValidationError("User ID is required")

        return await self.db.find_by_id(user_id)

    async def update_user(self, user_id: str, **kwargs) -> User:
        """Update user fields"""
        if not user_id:
            raise ValidationError("User ID is required")

        user = await self.db.find_by_id(user_id)
        if not user:
            raise ValidationError("User not found")

        update_data = {}

        if "email" in kwargs:
            if not self._is_valid_email(kwargs["email"]):
                raise ValidationError("Invalid email address")
            update_data["email"] = kwargs["email"].lower()

        if "name" in kwargs:
            if len(kwargs["name"].strip()) < 2:
                raise ValidationError("Name must be at least 2 characters")
            update_data["name"] = kwargs["name"].strip()

        if "password" in kwargs:
            if len(kwargs["password"]) < 8:
                raise ValidationError("Password must be at least 8 characters")
            update_data["password_hash"] = self._hash_password(kwargs["password"])

        return await self.db.update_user(user_id, update_data)

    async def delete_user(self, user_id: str) -> None:
        """Delete user"""
        if not user_id:
            raise ValidationError("User ID is required")

        user = await self.db.find_by_id(user_id)
        if not user:
            raise ValidationError("User not found")

        await self.db.delete_user(user_id)

    def _is_valid_email(self, email: str) -> bool:
        """Validate email format"""
        pattern = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
        return bool(re.match(pattern, email))

    def _hash_password(self, password: str) -> str:
        """Hash password (simplified for testing)"""
        return f"hashed_{password}"
