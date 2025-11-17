/**
 * UserService Tests with Vitest
 * Demonstrates: Mocking with Vitest, async testing, vi utility
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { UserService, ValidationError, type DatabaseClient } from '../../../src/services/UserService';

/**
 * Vitest Mocking: Use 'vi' instead of 'jest'
 * - vi.fn() instead of jest.fn()
 * - vi.spyOn() instead of jest.spyOn()
 * - vi.mock() instead of jest.mock()
 */

describe('UserService with Vitest', () => {
  let userService: UserService;
  let mockDb: DatabaseClient;

  beforeEach(() => {
    // Create mocks using vi.fn()
    mockDb = {
      users: {
        create: vi.fn(),
        findByEmail: vi.fn(),
        findById: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    };

    userService = new UserService(mockDb);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('createUser', () => {
    const validUserData = {
      email: 'test@example.com',
      name: 'Test User',
      password: 'password123',
    };

    it('should create user with valid data', async () => {
      // Arrange
      const expectedUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(mockDb.users.findByEmail).mockResolvedValue(null);
      vi.mocked(mockDb.users.create).mockResolvedValue(expectedUser);

      // Act
      const user = await userService.createUser(validUserData);

      // Assert
      expect(user.id).toBe('1');
      expect(user.email).toBe('test@example.com');
      expect(mockDb.users.findByEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should normalize email to lowercase', async () => {
      // Arrange
      vi.mocked(mockDb.users.findByEmail).mockResolvedValue(null);
      vi.mocked(mockDb.users.create).mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        name: 'Test',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Act
      await userService.createUser({
        ...validUserData,
        email: 'TEST@EXAMPLE.COM',
      });

      // Assert
      expect(mockDb.users.findByEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should throw ValidationError for invalid email', async () => {
      // Act & Assert
      await expect(
        userService.createUser({
          ...validUserData,
          email: 'invalid-email',
        })
      ).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError when email exists', async () => {
      // Arrange
      vi.mocked(mockDb.users.findByEmail).mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        name: 'Existing',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Act & Assert
      await expect(userService.createUser(validUserData)).rejects.toThrow(
        'Email already exists'
      );
      expect(mockDb.users.create).not.toHaveBeenCalled();
    });
  });

  describe('getUserByEmail', () => {
    it('should return user when found', async () => {
      // Arrange
      const expectedUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(mockDb.users.findByEmail).mockResolvedValue(expectedUser);

      // Act
      const user = await userService.getUserByEmail('test@example.com');

      // Assert
      expect(user).toEqual(expectedUser);
    });

    it('should return null when not found', async () => {
      // Arrange
      vi.mocked(mockDb.users.findByEmail).mockResolvedValue(null);

      // Act
      const user = await userService.getUserByEmail('none@example.com');

      // Assert
      expect(user).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update user name', async () => {
      // Arrange
      const existing = {
        id: '1',
        email: 'test@example.com',
        name: 'Old Name',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(mockDb.users.findById).mockResolvedValue(existing);
      vi.mocked(mockDb.users.update).mockResolvedValue({
        ...existing,
        name: 'New Name',
      });

      // Act
      const updated = await userService.updateUser('1', { name: 'New Name' });

      // Assert
      expect(updated.name).toBe('New Name');
    });

    it('should throw when user not found', async () => {
      // Arrange
      vi.mocked(mockDb.users.findById).mockResolvedValue(null);

      // Act & Assert
      await expect(userService.updateUser('999', { name: 'Test' })).rejects.toThrow(
        'User not found'
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete existing user', async () => {
      // Arrange
      vi.mocked(mockDb.users.findById).mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        name: 'Test',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Act
      await userService.deleteUser('1');

      // Assert
      expect(mockDb.users.delete).toHaveBeenCalledWith('1');
    });
  });
});
