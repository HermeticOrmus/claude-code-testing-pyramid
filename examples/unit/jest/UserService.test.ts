/**
 * UserService Unit Tests with Jest
 * Demonstrates: Mocking, async/await, error handling, test doubles
 */

import { UserService, ValidationError, DatabaseClient } from '../../../src/services/UserService';

// Mock the database client
jest.mock('../../../src/services/UserService', () => {
  const actual = jest.requireActual('../../../src/services/UserService');
  return {
    ...actual,
    // We'll create a manual mock of DatabaseClient
  };
});

describe('UserService', () => {
  let userService: UserService;
  let mockDb: jest.Mocked<DatabaseClient>;

  beforeEach(() => {
    // Create a fresh mock for each test
    mockDb = {
      users: {
        create: jest.fn(),
        findByEmail: jest.fn(),
        findById: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    userService = new UserService(mockDb);
  });

  afterEach(() => {
    jest.clearAllMocks();
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

      mockDb.users.findByEmail.mockResolvedValue(null);
      mockDb.users.create.mockResolvedValue(expectedUser);

      // Act
      const user = await userService.createUser(validUserData);

      // Assert
      expect(user.id).toBe('1');
      expect(user.email).toBe('test@example.com');
      expect(mockDb.users.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockDb.users.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        name: 'Test User',
        passwordHash: 'hashed_password123',
      });
    });

    it('should normalize email to lowercase', async () => {
      // Arrange
      const userData = {
        ...validUserData,
        email: 'TEST@EXAMPLE.COM',
      };

      mockDb.users.findByEmail.mockResolvedValue(null);
      mockDb.users.create.mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Act
      await userService.createUser(userData);

      // Assert
      expect(mockDb.users.findByEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should trim name whitespace', async () => {
      // Arrange
      const userData = {
        ...validUserData,
        name: '  Test User  ',
      };

      mockDb.users.findByEmail.mockResolvedValue(null);
      mockDb.users.create.mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Act
      await userService.createUser(userData);

      // Assert
      expect(mockDb.users.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test User',
        })
      );
    });

    it('should throw ValidationError for invalid email', async () => {
      // Arrange
      const userData = {
        ...validUserData,
        email: 'invalid-email',
      };

      // Act & Assert
      await expect(userService.createUser(userData)).rejects.toThrow(ValidationError);
      await expect(userService.createUser(userData)).rejects.toThrow('Invalid email address');
      expect(mockDb.users.create).not.toHaveBeenCalled();
    });

    it('should throw ValidationError for short name', async () => {
      // Arrange
      const userData = {
        ...validUserData,
        name: 'A',
      };

      // Act & Assert
      await expect(userService.createUser(userData)).rejects.toThrow(
        'Name must be at least 2 characters'
      );
    });

    it('should throw ValidationError for short password', async () => {
      // Arrange
      const userData = {
        ...validUserData,
        password: 'short',
      };

      // Act & Assert
      await expect(userService.createUser(userData)).rejects.toThrow(
        'Password must be at least 8 characters'
      );
    });

    it('should throw ValidationError when email already exists', async () => {
      // Arrange
      mockDb.users.findByEmail.mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        name: 'Existing User',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Act & Assert
      await expect(userService.createUser(validUserData)).rejects.toThrow('Email already exists');
      expect(mockDb.users.create).not.toHaveBeenCalled();
    });
  });

  describe('getUserByEmail', () => {
    it('should return user when found', async () => {
      // Arrange
      const expectedUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockDb.users.findByEmail.mockResolvedValue(expectedUser);

      // Act
      const user = await userService.getUserByEmail('test@example.com');

      // Assert
      expect(user).toEqual(expectedUser);
      expect(mockDb.users.findByEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should return null when user not found', async () => {
      // Arrange
      mockDb.users.findByEmail.mockResolvedValue(null);

      // Act
      const user = await userService.getUserByEmail('nonexistent@example.com');

      // Assert
      expect(user).toBeNull();
    });

    it('should throw ValidationError for invalid email', async () => {
      // Act & Assert
      await expect(userService.getUserByEmail('invalid-email')).rejects.toThrow(
        'Invalid email address'
      );
    });
  });

  describe('updateUser', () => {
    const existingUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should update user name', async () => {
      // Arrange
      mockDb.users.findById.mockResolvedValue(existingUser);
      mockDb.users.update.mockResolvedValue({
        ...existingUser,
        name: 'Updated Name',
        updatedAt: new Date(),
      });

      // Act
      const updated = await userService.updateUser('1', { name: 'Updated Name' });

      // Assert
      expect(updated.name).toBe('Updated Name');
      expect(mockDb.users.update).toHaveBeenCalledWith('1', { name: 'Updated Name' });
    });

    it('should throw ValidationError when user not found', async () => {
      // Arrange
      mockDb.users.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(userService.updateUser('999', { name: 'New Name' })).rejects.toThrow(
        'User not found'
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete existing user', async () => {
      // Arrange
      mockDb.users.findById.mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      mockDb.users.delete.mockResolvedValue(undefined);

      // Act
      await userService.deleteUser('1');

      // Assert
      expect(mockDb.users.delete).toHaveBeenCalledWith('1');
    });

    it('should throw ValidationError when user not found', async () => {
      // Arrange
      mockDb.users.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(userService.deleteUser('999')).rejects.toThrow('User not found');
      expect(mockDb.users.delete).not.toHaveBeenCalled();
    });
  });
});
