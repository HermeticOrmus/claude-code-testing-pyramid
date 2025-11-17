/**
 * UserService - Business logic for user management
 * Used to demonstrate unit testing with mocks and stubs
 */

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  email: string;
  name: string;
  password: string;
}

export interface DatabaseClient {
  users: {
    create(data: any): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    update(id: string, data: any): Promise<User>;
    delete(id: string): Promise<void>;
  };
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class UserService {
  constructor(private db: DatabaseClient) {}

  async createUser(data: CreateUserData): Promise<User> {
    // Validation
    if (!data.email || !this.isValidEmail(data.email)) {
      throw new ValidationError('Invalid email address');
    }

    if (!data.name || data.name.trim().length < 2) {
      throw new ValidationError('Name must be at least 2 characters');
    }

    if (!data.password || data.password.length < 8) {
      throw new ValidationError('Password must be at least 8 characters');
    }

    // Check if user already exists
    const existingUser = await this.db.users.findByEmail(data.email);
    if (existingUser) {
      throw new ValidationError('Email already exists');
    }

    // Create user
    const user = await this.db.users.create({
      email: data.email.toLowerCase(),
      name: data.name.trim(),
      passwordHash: await this.hashPassword(data.password),
    });

    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    if (!email || !this.isValidEmail(email)) {
      throw new ValidationError('Invalid email address');
    }

    return await this.db.users.findByEmail(email.toLowerCase());
  }

  async getUserById(id: string): Promise<User | null> {
    if (!id) {
      throw new ValidationError('User ID is required');
    }

    return await this.db.users.findById(id);
  }

  async updateUser(id: string, data: Partial<CreateUserData>): Promise<User> {
    if (!id) {
      throw new ValidationError('User ID is required');
    }

    const user = await this.db.users.findById(id);
    if (!user) {
      throw new ValidationError('User not found');
    }

    const updateData: any = {};

    if (data.email) {
      if (!this.isValidEmail(data.email)) {
        throw new ValidationError('Invalid email address');
      }
      updateData.email = data.email.toLowerCase();
    }

    if (data.name) {
      if (data.name.trim().length < 2) {
        throw new ValidationError('Name must be at least 2 characters');
      }
      updateData.name = data.name.trim();
    }

    if (data.password) {
      if (data.password.length < 8) {
        throw new ValidationError('Password must be at least 8 characters');
      }
      updateData.passwordHash = await this.hashPassword(data.password);
    }

    return await this.db.users.update(id, updateData);
  }

  async deleteUser(id: string): Promise<void> {
    if (!id) {
      throw new ValidationError('User ID is required');
    }

    const user = await this.db.users.findById(id);
    if (!user) {
      throw new ValidationError('User not found');
    }

    await this.db.users.delete(id);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private async hashPassword(password: string): Promise<string> {
    // In production, use bcrypt or similar
    // Simplified for testing purposes
    return `hashed_${password}`;
  }
}
