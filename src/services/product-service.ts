import ApiResponse, { get, post } from '@/apis/apiUtils'
import { ProductResponse, ProductsResult } from '@/types/product'

class ProductService {
  private static instance: ProductService

  private constructor() {}

  public static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService()
    }
    return ProductService.instance
  }
  public async getAllProductFood(): Promise<ApiResponse<ProductsResult>> {
    try {
      return await get<ProductsResult>(`/products`)
    } catch (error) {
      console.error('Error fetching all food products:', error)
      throw error
    }
  }
  public async getProductById(id: string): Promise<ApiResponse<ProductsResult>> {
    try {
      return await get<ProductsResult>(`/products/${id}`)
    } catch (error) {
      console.error(`Error fetching product with id ${id}:`, error)
      throw error
    }
  }
  public async getProductsByCategory(categoryId: string): Promise<ApiResponse<ProductsResult>> {
    try {
      return await get<ProductsResult>(`/products?categoryId=${categoryId}`)
    } catch (error) {
      console.error(`Error fetching products for category ${categoryId}:`, error)
      throw error
    }
  }
  public async getAllProducts(): Promise<ApiResponse<ProductsResult>> {
    try {
      return await get<ProductsResult>(`/products?IncludeProperties=ProductOptions.Option.OptionItems`)
    } catch (error) {
      console.error('Error fetching all products:', error)
      throw error
    }
  }
  public async createProduct(formData: string): Promise<ApiResponse<ProductResponse>> {
    try {
      const formDataJson = JSON.parse(formData)
      return await post<ProductResponse>(`/products`, formDataJson)
    } catch (error) {
      console.error('Error fetching all products:', error)
      throw error
    }
  }
}

export default ProductService
