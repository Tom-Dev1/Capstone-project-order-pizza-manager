export interface OrderItem {
  id: string
  tableCode: string
  name: string
  note: string
  quantity: number
  price: number
  totalPrice: number
  startTime: string
  orderId: string
  productId: string
  orderItemStatus: 'Pending' | 'Serving' | 'Done'
  order: null
  product: null
  orderItemDetails: []
}

export interface GetOrderByIdResponse {
  orderId: string
  orderItems: OrderItem[]
}

export interface Order {
  id: string
  tableCode: string
  totalPrice: number
  orderCode: string
  startTime: string
  endTime: string | null
  status: string
  tableId: string
  table: string
}

// Response
export interface CreateOrderResponse {
  success: boolean
  result: OrderIdResponse
  message: string
  statusCode: number
}

export interface OrderItemsResult {
  items: OrderItem[]
  totalCount: number
}

export interface OrderIdResponse {
  id: string
  items: Order[]
  totalCount: number
}

export interface AddFoodResponse {
  success: boolean
  result: null
  message: string
  statusCode: number
}

export const PAYMENT_STATUS = {
  PAID: 'Paid',
  CHECKOUT: 'CheckedOut',
  UNPAID: 'Unpaid'
} as const

export interface OrdersResult {
  items: Order[]
  totalCount: number
}

export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS]
