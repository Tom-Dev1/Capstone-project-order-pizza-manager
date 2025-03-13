import { useState, useEffect, useCallback } from 'react'
import type { CategoryModel } from '@/types/category'
import CategoryService from '@/services/category-service'

const useCategories = () => {
  const [foodCategory, setFoodCategory] = useState<CategoryModel[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAllCategories = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const categoryService = CategoryService.getInstance()
      const response = await categoryService.getAllCategories()
      if (response.success && response.result.items && response.result.items.length > 0) {
        const categories = response.result.items

        setFoodCategory(categories)
      } else {
        setFoodCategory([])
      }
    } catch (err) {
      setError('Failed to fetch categories')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAllCategories()
  }, [fetchAllCategories])

  return { foodCategory, loading, error }
}

export default useCategories
