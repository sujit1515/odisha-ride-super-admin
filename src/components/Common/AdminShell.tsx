'use client'

import { ReactNode } from 'react'
import DashboardLayout from './DashboardLayout'

interface AdminShellProps {
  title?: string
  children: ReactNode
}

export default function AdminShell({ title, children }: AdminShellProps) {
  return (
    <DashboardLayout title={title}>
      {children}
    </DashboardLayout>
  )
}
