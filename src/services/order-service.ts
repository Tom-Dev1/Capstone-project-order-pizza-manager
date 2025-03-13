import type ApiResponse from '@/apis/apiUtils'
import { get, post } from '@/apis/apiUtils'
import type { AddFoodResponse, CreateOrderResponse, OrdersResult, OrderItemsResult } from '@/types/order'

class OrderService {
  private static instance: OrderService

  private constructor() {}

  public static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService()
    }
    return OrderService.instance
  }

  public async getAllOrders(): Promise<ApiResponse<OrdersResult>> {
    try {
      return await get<OrdersResult>('/orders?TakeCount=200&SortBy=startTime desc')
    } catch (error) {
      console.error('Error fetching orders:', error)
      throw error
    }
  }

  public async createOrder(tableIdJson: string): Promise<ApiResponse<CreateOrderResponse>> {
    try {
      const { tableId } = JSON.parse(tableIdJson)
      return await post<CreateOrderResponse>('/orders', { tableId })
    } catch (error) {
      console.error('Error creating new order:', error)
      throw error
    }
  }

  public async addFoodToOrder(orderDataJson: string): Promise<ApiResponse<AddFoodResponse>> {
    try {
      const orderData = JSON.parse(orderDataJson)
      const response = await post<AddFoodResponse>('/orders/add-food-to-order', orderData)
      return response
    } catch (error) {
      console.error('Error adding food to existing order:', error)
      throw error
    }
  }

  public async getOrderById(orderId: string): Promise<ApiResponse<OrderItemsResult>> {
    try {
      return await get<OrderItemsResult>(`order-items?=OrderId=${orderId}`)
    } catch (error) {
      console.error(`Error fetching order items with order id ${orderId}:`, error)
      throw error
    }
  }
}

export default OrderService
