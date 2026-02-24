// src/hooks/useEmployees.js
// Custom hook — fetches employees and exposes loading/error state.
// Also surfaces the data "source" so the List page can show a banner
// when mock data is being used instead of the real API.

import { useState, useEffect, useCallback } from 'react'
import { fetchEmployees } from '../services/api'

export function useEmployees() {
  const [employees, setEmployees] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState(null)
  const [source,    setSource]    = useState(null) // 'api' | 'mock'

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchEmployees()
      setEmployees(result.employees)
      setSource(result.source)
    } catch (err) {
      setError(err?.message ?? 'Failed to load employees.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  return { employees, loading, error, source, refetch: load }
}
