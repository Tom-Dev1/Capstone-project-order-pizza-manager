import TableService from '@/services/table-service'
import type TableResponse from '@/types/tables'
import { useCallback, useEffect, useState } from 'react'

const useTable = () => {
  const [tables, setTables] = useState<TableResponse[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const tableService = TableService.getInstance()

  // get all tables
  const fetchAllTables = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await tableService.getAllTables()
      if (response.success && response.result.items) {
        setTables(response.result.items)
      } else {
        setTables([])
      }
    } catch (error) {
      setError('Failed to fetch all tables')
      console.error('Error fetching tables:', error)
    } finally {
      setLoading(false)
    }
  }, [tableService])

  useEffect(() => {
    fetchAllTables()
  }, [fetchAllTables])

  return { tables, loading, error, fetchAllTables }
}

export default useTable
