import { useState, useCallback, useEffect } from 'react'
import type { Order, OrderItemsResult } from '@/types/order'
import OrderService from '@/services/order-service'
import type ApiResponse from '@/apis/apiUtils'

const useOrderService = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAllOrders = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const orderService = OrderService.getInstance()
      const response = await orderService.getAllOrders()
      if (response.success && response.result.items) {
        setOrders(response.result.items)
      } else {
        setOrders([])
      }
    } catch (error) {
      setError('Failed to fetch products')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [])
  useEffect(() => {
    fetchAllOrders()
  }, [fetchAllOrders])
  const getOrderById = useCallback(async (orderId: string): Promise<ApiResponse<OrderItemsResult> | null> => {
    if (!orderId) {
      return null
    }

    setLoading(true)
    setError(null)

    try {
      const orderService = OrderService.getInstance()
      const response = await orderService.getOrderById(orderId)
      return response
    } catch (error) {
      setError('Failed to fetch order details')
      console.error(error)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { orders, loading, error, fetchAllOrders, getOrderById }
}

export default useOrderService
