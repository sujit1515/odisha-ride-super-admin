import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

export function useSosSocket({
  onNew,
  onResolved,
}: {
  onNew?: (alert: any) => void
  onResolved?: (alertId: string) => void
}) {
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const token = localStorage.getItem('adminToken')
    if (!token) {
      console.warn('Socket connection deferred: No adminToken in localStorage')
      return
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000/api/v1'
    // Extract base server URL (e.g. http://localhost:8000) from the api base url
    const socketUrl = baseUrl.replace('/api/v1', '')

    const socket = io(`${socketUrl}/admin`, {
      auth: {
        token,
      },
      transports: ['websocket'],
    })

    socketRef.current = socket

    socket.on('connect', () => {
      console.log('Connected to admin live socket namespace (/admin)')
    })

    socket.on('sos:new', (alert) => {
      try {
        const audio = new Audio('/sounds/sos-alert.mp3')
        audio.volume = 1.0
        audio.play().catch(() => {}) // catch browser autoplay policy silently
      } catch {}
      if (onNew) {
        onNew(alert)
      }
    })

    socket.on('sos:resolved', (alertId) => {
      if (onResolved) {
        onResolved(alertId)
      }
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from admin live socket namespace (/admin)')
    })

    return () => {
      socket.disconnect()
    }
  }, [onNew, onResolved])
}
