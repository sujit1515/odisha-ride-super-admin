'use client'
import { ReactNode, useState } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

interface AdminShellProps {
  title?: string
  children: ReactNode
}

export default function AdminShell({ title, children }: AdminShellProps) {
  const [open, setOpen] = useState<boolean>(false)
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="lg:pl-64">
        <Navbar title={title} onMenuClick={() => setOpen(true)} />
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}
