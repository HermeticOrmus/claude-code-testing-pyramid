/**
 * OrderService Unit Tests with Jest
 * Demonstrates: Multiple mocks, complex scenarios, compensation logic, test organization
 */

import {
  OrderService,
  OrderError,
  OrderStatus,
  PaymentGateway,
  InventoryService,
  CreateOrderData,
} from '../../../src/services/OrderService';

describe('OrderService', () => {
  let orderService: OrderService;
  let mockPaymentGateway: jest.Mocked<PaymentGateway>;
  let mockInventoryService: jest.Mocked<InventoryService>;

  beforeEach(() => {
    // Create fresh mocks for each test
    mockPaymentGateway = {
      charge: jest.fn(),
      refund: jest.fn(),
    };

    mockInventoryService = {
      checkAvailability: jest.fn(),
      reserve: jest.fn(),
      releaseReservation: jest.fn(),
    };

    orderService = new OrderService(mockPaymentGateway, mockInventoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('placeOrder', () => {
    const validOrderData: CreateOrderData = {
      userId: 'user-123',
      items: [
        { productId: 'prod-1', quantity: 2, price: 24.99 },
        { productId: 'prod-2', quantity: 1, price: 15.00 },
      ],
      total: 64.98,
    };

    it('should successfully place order when all services succeed', async () => {
      // Arrange
      mockInventoryService.checkAvailability.mockResolvedValue(true);
      mockInventoryService.reserve.mockResolvedValue({ reservationId: 'res-1' });
      mockPaymentGateway.charge.mockResolvedValue({
        status: 'success',
        transactionId: 'txn-1',
      });

      // Act
      const order = await orderService.placeOrder(validOrderData);

      // Assert
      expect(order.status).toBe(OrderStatus.CONFIRMED);
      expect(order.transactionId).toBe('txn-1');
      expect(order.reservationId).toBe('res-1');
      expect(order.userId).toBe('user-123');
      expect(order.items).toEqual(validOrderData.items);
      expect(order.total).toBe(64.98);

      // Verify service calls in correct order
      expect(mockInventoryService.checkAvailability).toHaveBeenCalledWith(validOrderData.items);
      expect(mockInventoryService.reserve).toHaveBeenCalledWith(validOrderData.items);
      expect(mockPaymentGateway.charge).toHaveBeenCalledWith({
        amount: 64.98,
        userId: 'user-123',
      });
    });

    it('should throw OrderError when inventory unavailable', async () => {
      // Arrange
      mockInventoryService.checkAvailability.mockResolvedValue(false);

      // Act & Assert
      await expect(orderService.placeOrder(validOrderData)).rejects.toThrow(
        'Insufficient inventory'
      );

      // Verify payment was never attempted
      expect(mockPaymentGateway.charge).not.toHaveBeenCalled();
      expect(mockInventoryService.reserve).not.toHaveBeenCalled();
    });

    it('should release inventory reservation when payment fails', async () => {
      // Arrange
      mockInventoryService.checkAvailability.mockResolvedValue(true);
      mockInventoryService.reserve.mockResolvedValue({ reservationId: 'res-1' });
      mockPaymentGateway.charge.mockRejectedValue(new Error('Payment declined'));

      // Act & Assert
      await expect(orderService.placeOrder(validOrderData)).rejects.toThrow('Payment declined');

      // Verify compensation: inventory was reserved then released
      expect(mockInventoryService.reserve).toHaveBeenCalled();
      expect(mockInventoryService.releaseReservation).toHaveBeenCalledWith('res-1');
    });

    it('should throw OrderError when inventory reservation fails', async () => {
      // Arrange
      mockInventoryService.checkAvailability.mockResolvedValue(true);
      mockInventoryService.reserve.mockRejectedValue(new Error('Reservation failed'));

      // Act & Assert
      await expect(orderService.placeOrder(validOrderData)).rejects.toThrow(
        'Failed to reserve inventory'
      );

      // Payment should never be attempted
      expect(mockPaymentGateway.charge).not.toHaveBeenCalled();
    });
  });

  describe('validation', () => {
    it('should throw OrderError when userId is missing', async () => {
      const invalidData = {
        userId: '',
        items: [{ productId: 'prod-1', quantity: 1, price: 10 }],
        total: 10,
      };

      await expect(orderService.placeOrder(invalidData)).rejects.toThrow('User ID is required');
    });

    it('should throw OrderError when items array is empty', async () => {
      const invalidData = {
        userId: 'user-123',
        items: [],
        total: 0,
      };

      await expect(orderService.placeOrder(invalidData)).rejects.toThrow(
        'Order must contain at least one item'
      );
    });

    it('should throw OrderError when total is zero', async () => {
      const invalidData = {
        userId: 'user-123',
        items: [{ productId: 'prod-1', quantity: 1, price: 0 }],
        total: 0,
      };

      await expect(orderService.placeOrder(invalidData)).rejects.toThrow(
        'Order total must be greater than zero'
      );
    });

    it('should throw OrderError when item has invalid quantity', async () => {
      const invalidData = {
        userId: 'user-123',
        items: [{ productId: 'prod-1', quantity: 0, price: 10 }],
        total: 10,
      };

      await expect(orderService.placeOrder(invalidData)).rejects.toThrow(
        'Quantity must be greater than zero'
      );
    });
  });

  describe('cancelOrder', () => {
    beforeEach(() => {
      // Mock the private getOrder method
      jest.spyOn(orderService as any, 'getOrder').mockResolvedValue({
        id: 'order-123',
        userId: 'user-123',
        items: [{ productId: 'prod-1', quantity: 1, price: 29.99 }],
        total: 29.99,
        status: OrderStatus.CONFIRMED,
        transactionId: 'txn-1',
        reservationId: 'res-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    it('should refund payment and release inventory', async () => {
      // Arrange
      mockPaymentGateway.refund.mockResolvedValue({ status: 'refunded' });
      mockInventoryService.releaseReservation.mockResolvedValue(undefined);

      // Act
      await orderService.cancelOrder('order-123');

      // Assert
      expect(mockPaymentGateway.refund).toHaveBeenCalledWith('txn-1', 29.99);
      expect(mockInventoryService.releaseReservation).toHaveBeenCalledWith('res-1');
    });

    it('should throw OrderError when order not found', async () => {
      // Arrange
      jest.spyOn(orderService as any, 'getOrder').mockResolvedValue(null);

      // Act & Assert
      await expect(orderService.cancelOrder('nonexistent')).rejects.toThrow('Order not found');
    });

    it('should throw OrderError when order already cancelled', async () => {
      // Arrange
      jest.spyOn(orderService as any, 'getOrder').mockResolvedValue({
        id: 'order-123',
        status: OrderStatus.CANCELLED,
      });

      // Act & Assert
      await expect(orderService.cancelOrder('order-123')).rejects.toThrow(
        'Order already cancelled'
      );
    });
  });
});
