import ZoneService from '@/services/zone-service'
import type { ZoneResponse } from '@/types/zone'
import { useCallback, useEffect, useState } from 'react'

const useZone = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [zones_, setZones] = useState<ZoneResponse[]>([])
  const zoneService = ZoneService.getInstance()

  // Fetch zones data initially
  const getAllZone = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await zoneService.getAllZones()
      if (response.success && response.result) {
        setZones(response.result.items)
      } else {
        setZones([])
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError(String(error))
      }
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Function to manually fetch zones data
  const fetchZones = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await zoneService.getAllZones()
      if (response.success && response.result) {
        setZones(response.result.items)
        return response.result.items
      } else {
        setZones([])
        return []
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError(String(error))
      }
      throw error
    } finally {
      setLoading(false)
    }
  }, [zoneService])

  useEffect(() => {
    getAllZone()
  }, [getAllZone])

  return { zones_, loading, error, fetchZones }
}

export default useZone
