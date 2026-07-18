'use client'

import { usePathname } from 'next/navigation'
import DashboardLayout from './DashboardLayout'
import { ReactNode } from 'react'

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  // Define routes that should not render the dashboard sidebar/navbar chrome (auth screens)
  const isAuthRoute =
    pathname === '/login' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password'

  if (isAuthRoute) {
    return <>{children}</>
  }

  return <DashboardLayout>{children}</DashboardLayout>
}
