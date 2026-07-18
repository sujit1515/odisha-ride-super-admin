import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/components/Context/AuthContext'
import { SidebarProvider } from '@/components/Context/SidebarContext'
import AppLayout from '@/components/Common/AppLayout'
import { cookies } from 'next/headers'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Odisha Ride - Super Admin Panel',
  description: 'Admin dashboard for Odisha Ride platform',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const isCollapsed = cookieStore.get('sidebar-collapsed')?.value === 'true'

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <SidebarProvider initialCollapsed={isCollapsed}>
            <AppLayout>
              {children}
            </AppLayout>
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  )
}