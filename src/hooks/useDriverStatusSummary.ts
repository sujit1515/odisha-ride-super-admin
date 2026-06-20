'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { getDriverStatusSummary } from '@/api/driver'
import type { DriverStatusSummary } from '@/api/driver'

export function useDriverStatusSummary(pollInterval = 15_000) {
  const [data,    setData   ] = useState<DriverStatusSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError  ] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchSummary = useCallback(async () => {
    try {
      const summary = await getDriverStatusSummary()
      setData(summary)
      setError(false)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSummary()
    intervalRef.current = setInterval(fetchSummary, pollInterval)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [fetchSummary, pollInterval])

  return { data, loading, error, refetch: fetchSummary }
}