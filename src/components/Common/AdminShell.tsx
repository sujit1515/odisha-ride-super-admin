'use client'

import { ReactNode, useEffect } from 'react'
import { useSidebar } from '@/components/Context/SidebarContext'

interface AdminShellProps {
  title?: string
  children: ReactNode
}

export default function AdminShell({ title, children }: AdminShellProps) {
  const { setTitle } = useSidebar()

  useEffect(() => {
    if (title !== undefined) {
      setTitle(title)
    }
  }, [title, setTitle])

  return <>{children}</>
}
