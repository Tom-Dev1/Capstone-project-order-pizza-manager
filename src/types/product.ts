import { CategoryModel } from './category'
import { ProductOption } from './product-option'

export interface ProductModel {
  id: string
  name: string
  price: number
  image: string
  description: string
  categoryId: string
  productType: number
  category: CategoryModel
  productOptions: ProductOption[]
}
export interface ProductsResult {
  items: ProductModel[]
  totalCount: number
}

export interface ProductFormData {
  name: string
  price: number
  description: string
  categoryId: string
  productType?: number
  image?: string
}

export interface ProductResponse {
  success: boolean
  result: null
  message: string
  statusCode: number
}
