'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { getSosStats } from '@/api/sos'
import type { SosStats } from '@/api/types/types'

export function useSosStats(pollInterval = 10_000) {
  const [data,    setData   ] = useState<SosStats | null>(null)
  const [loading, setLoading] = useState(true)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      const stats = await getSosStats()
      setData(stats)
    } catch {
      // keep last known value on error
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
    intervalRef.current = setInterval(fetchStats, pollInterval)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [fetchStats, pollInterval])

  return { data, loading, refetch: fetchStats }
}