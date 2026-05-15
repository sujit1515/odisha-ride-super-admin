'use client'
import { Search, Bell, HelpCircle, Menu } from 'lucide-react'

interface NavbarProps {
  title?: string
  onMenuClick: () => void
}

export default function Navbar({ title = 'Odisha Ride Admin', onMenuClick }: NavbarProps) {
  return (
    <header className="sticky top-0 z-20 bg-slate-50/80 backdrop-blur border-b border-slate-200">
      <div className="flex items-center gap-3 md:gap-6 px-4 md:px-8 py-4">
        <button onClick={onMenuClick} className="lg:hidden p-2 rounded-md hover:bg-slate-100">
          <Menu className="h-5 w-5" />
        </button>
        <h2 className="text-lg md:text-2xl font-bold text-blue-600 leading-tight whitespace-pre-line">{title}</h2>
        <div className="flex-1 max-w-xl hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>
        <div className="ml-auto flex items-center gap-3 md:gap-5">
          <button className="relative p-2 rounded-full hover:bg-slate-100">
            <Bell className="h-5 w-5 text-slate-600" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full" />
          </button>
          <button className="p-2 rounded-full hover:bg-slate-100 hidden sm:block">
            <HelpCircle className="h-5 w-5 text-slate-600" />
          </button>
          <div className="h-8 w-px bg-slate-200 hidden md:block" />
          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <div className="text-sm font-semibold text-slate-800">Admin Profile</div>
              <div className="text-xs text-slate-500">Super Admin</div>
            </div>
            <img
              src="https://i.pravatar.cc/80?img=12"
              alt="admin"
              className="h-9 w-9 rounded-full object-cover ring-2 ring-white shadow"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
