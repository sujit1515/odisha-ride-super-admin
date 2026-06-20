'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { getRegistrationStats } from '@/api/user'
import type { RegistrationStats } from '@/api/user'

export function useRegistrationStats(pollInterval = 30_000) {
  const [data,    setData   ] = useState<RegistrationStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError  ] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      const stats = await getRegistrationStats()
      setData(stats)
      setError(false)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
    intervalRef.current = setInterval(fetchStats, pollInterval)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [fetchStats, pollInterval])

  return { data, loading, error, refetch: fetchStats }
}