/**
 * Test Doubles Examples with Jest
 * Demonstrates: Mocks vs Stubs vs Spies vs Fakes
 */

describe('Test Doubles Patterns', () => {
  describe('Mocks - Verify behavior (interactions)', () => {
    interface EmailService {
      sendEmail(to: string, subject: string, body: string): Promise<void>;
    }

    class UserRegistration {
      constructor(private emailService: EmailService) {}

      async register(email: string): Promise<void> {
        // Registration logic...
        await this.emailService.sendEmail(
          email,
          'Welcome!',
          'Thanks for registering'
        );
      }
    }

    it('should verify email was sent with correct parameters', async () => {
      // Arrange: Create mock
      const mockEmailService: jest.Mocked<EmailService> = {
        sendEmail: jest.fn().mockResolvedValue(undefined),
      };

      const registration = new UserRegistration(mockEmailService);

      // Act
      await registration.register('user@example.com');

      // Assert: Verify interaction
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(1);
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        'user@example.com',
        'Welcome!',
        'Thanks for registering'
      );
    });
  });

  describe('Stubs - Provide canned responses', () => {
    interface WeatherAPI {
      getCurrentTemperature(city: string): Promise<number>;
    }

    class WeatherAlert {
      constructor(private weatherAPI: WeatherAPI) {}

      async shouldSendAlert(city: string): Promise<boolean> {
        const temp = await this.weatherAPI.getCurrentTemperature(city);
        return temp > 35; // Alert if temperature above 35°C
      }
    }

    it('should return true when temperature is high', async () => {
      // Arrange: Stub returns fixed value
      const stubWeatherAPI: jest.Mocked<WeatherAPI> = {
        getCurrentTemperature: jest.fn().mockResolvedValue(40),
      };

      const alert = new WeatherAlert(stubWeatherAPI);

      // Act
      const result = await alert.shouldSendAlert('Phoenix');

      // Assert: We don't care about interactions, only the result
      expect(result).toBe(true);
    });

    it('should return false when temperature is normal', async () => {
      // Arrange: Stub returns different fixed value
      const stubWeatherAPI: jest.Mocked<WeatherAPI> = {
        getCurrentTemperature: jest.fn().mockResolvedValue(25),
      };

      const alert = new WeatherAlert(stubWeatherAPI);

      // Act
      const result = await alert.shouldSendAlert('Seattle');

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('Spies - Real object with observation', () => {
    class Logger {
      log(message: string): void {
        console.log(`[LOG] ${message}`);
      }

      error(message: string): void {
        console.error(`[ERROR] ${message}`);
      }
    }

    class DataProcessor {
      constructor(private logger: Logger) {}

      process(data: string[]): number {
        this.logger.log('Starting processing');

        if (data.length === 0) {
          this.logger.error('No data provided');
          return 0;
        }

        this.logger.log(`Processing ${data.length} items`);
        return data.length;
      }
    }

    it('should log processing messages', () => {
      // Arrange: Spy on real object
      const logger = new Logger();
      const logSpy = jest.spyOn(logger, 'log');
      const errorSpy = jest.spyOn(logger, 'error');

      const processor = new DataProcessor(logger);

      // Act
      processor.process(['item1', 'item2']);

      // Assert: Verify calls while using real implementation
      expect(logSpy).toHaveBeenCalledWith('Starting processing');
      expect(logSpy).toHaveBeenCalledWith('Processing 2 items');
      expect(errorSpy).not.toHaveBeenCalled();

      // Cleanup
      logSpy.mockRestore();
      errorSpy.mockRestore();
    });
  });

  describe('Fakes - Simplified working implementation', () => {
    interface Database {
      save(key: string, value: any): Promise<void>;
      get(key: string): Promise<any>;
      delete(key: string): Promise<void>;
    }

    // Fake: In-memory database for testing
    class InMemoryDatabase implements Database {
      private data: Map<string, any> = new Map();

      async save(key: string, value: any): Promise<void> {
        this.data.set(key, value);
      }

      async get(key: string): Promise<any> {
        return this.data.get(key);
      }

      async delete(key: string): Promise<void> {
        this.data.delete(key);
      }
    }

    class UserRepository {
      constructor(private db: Database) {}

      async saveUser(id: string, user: any): Promise<void> {
        await this.db.save(`user:${id}`, user);
      }

      async getUser(id: string): Promise<any> {
        return await this.db.get(`user:${id}`);
      }
    }

    it('should save and retrieve user using fake database', async () => {
      // Arrange: Use fake database
      const fakeDb = new InMemoryDatabase();
      const repository = new UserRepository(fakeDb);
      const user = { name: 'John Doe', email: 'john@example.com' };

      // Act
      await repository.saveUser('123', user);
      const retrieved = await repository.getUser('123');

      // Assert: Fake database actually works!
      expect(retrieved).toEqual(user);
    });

    it('should return undefined for non-existent user', async () => {
      // Arrange
      const fakeDb = new InMemoryDatabase();
      const repository = new UserRepository(fakeDb);

      // Act
      const result = await repository.getUser('999');

      // Assert
      expect(result).toBeUndefined();
    });
  });

  describe('Choosing the right test double', () => {
    /**
     * Guidelines:
     *
     * 1. Use MOCKS when:
     *    - You need to verify interactions
     *    - Testing side effects (emails, logging, events)
     *    - Example: "Was the email sent?"
     *
     * 2. Use STUBS when:
     *    - You need to control return values
     *    - Testing different scenarios
     *    - Example: "What happens when API returns error?"
     *
     * 3. Use SPIES when:
     *    - You want to use real implementation
     *    - But also verify it was called
     *    - Example: "Did the logger actually log this?"
     *
     * 4. Use FAKES when:
     *    - You need a simplified working implementation
     *    - Too complex to mock
     *    - Example: In-memory database, fake file system
     */

    it('demonstrates choosing the right double', () => {
      // This test exists for documentation purposes
      expect(true).toBe(true);
    });
  });
});
