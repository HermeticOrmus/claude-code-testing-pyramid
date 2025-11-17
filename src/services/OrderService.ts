/**
 * OrderService - Business logic for order management
 * Demonstrates complex service with multiple dependencies
 * Used to show integration testing and test doubles
 */

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  transactionId?: string;
  reservationId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  FAILED = 'failed',
}

export interface CreateOrderData {
  userId: string;
  items: OrderItem[];
  total: number;
}

export interface PaymentGateway {
  charge(params: { amount: number; userId: string }): Promise<{ status: string; transactionId: string }>;
  refund(transactionId: string, amount: number): Promise<{ status: string }>;
}

export interface InventoryService {
  checkAvailability(items: OrderItem[]): Promise<boolean>;
  reserve(items: OrderItem[]): Promise<{ reservationId: string }>;
  releaseReservation(reservationId: string): Promise<void>;
}

export class OrderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OrderError';
  }
}

export class OrderService {
  constructor(
    private paymentGateway: PaymentGateway,
    private inventoryService: InventoryService
  ) {}

  async placeOrder(orderData: CreateOrderData): Promise<Order> {
    // Validate order
    this.validateOrder(orderData);

    // Check inventory availability
    const available = await this.inventoryService.checkAvailability(orderData.items);
    if (!available) {
      throw new OrderError('Insufficient inventory');
    }

    // Reserve inventory
    let reservationId: string;
    try {
      const reservation = await this.inventoryService.reserve(orderData.items);
      reservationId = reservation.reservationId;
    } catch (error) {
      throw new OrderError('Failed to reserve inventory');
    }

    // Process payment
    let transactionId: string;
    try {
      const payment = await this.paymentGateway.charge({
        amount: orderData.total,
        userId: orderData.userId,
      });
      transactionId = payment.transactionId;
    } catch (error) {
      // Compensate: Release inventory reservation
      await this.inventoryService.releaseReservation(reservationId);
      throw new OrderError('Payment declined');
    }

    // Create order
    const order: Order = {
      id: this.generateOrderId(),
      userId: orderData.userId,
      items: orderData.items,
      total: orderData.total,
      status: OrderStatus.CONFIRMED,
      transactionId,
      reservationId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return order;
  }

  async cancelOrder(orderId: string): Promise<void> {
    // In a real app, fetch order from database
    const order = await this.getOrder(orderId);

    if (!order) {
      throw new OrderError('Order not found');
    }

    if (order.status === OrderStatus.CANCELLED) {
      throw new OrderError('Order already cancelled');
    }

    // Refund payment
    if (order.transactionId) {
      await this.paymentGateway.refund(order.transactionId, order.total);
    }

    // Release inventory
    if (order.reservationId) {
      await this.inventoryService.releaseReservation(order.reservationId);
    }

    order.status = OrderStatus.CANCELLED;
    order.updatedAt = new Date();
  }

  private validateOrder(orderData: CreateOrderData): void {
    if (!orderData.userId) {
      throw new OrderError('User ID is required');
    }

    if (!orderData.items || orderData.items.length === 0) {
      throw new OrderError('Order must contain at least one item');
    }

    if (!orderData.total || orderData.total <= 0) {
      throw new OrderError('Order total must be greater than zero');
    }

    // Validate each item
    for (const item of orderData.items) {
      if (!item.productId) {
        throw new OrderError('Product ID is required');
      }
      if (!item.quantity || item.quantity <= 0) {
        throw new OrderError('Quantity must be greater than zero');
      }
      if (!item.price || item.price < 0) {
        throw new OrderError('Price must be non-negative');
      }
    }
  }

  private generateOrderId(): string {
    return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private async getOrder(orderId: string): Promise<Order | null> {
    // Mock implementation for testing
    // In production, fetch from database
    return null;
  }
}
