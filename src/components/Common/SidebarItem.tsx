'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LucideIcon, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

interface SubMenuItem {
  href: string
  label: string
  icon: LucideIcon
}

interface SidebarItemProps {
  href?: string
  label: string
  icon: LucideIcon
  isCollapsed: boolean
  onClick?: () => void // Click handler for closing mobile drawer or custom actions (like Logout)
  isDanger?: boolean
  children?: SubMenuItem[]
  onExpandRequest?: () => void // Request sidebar to expand on click
  transitionEnabled?: boolean
}

export default function SidebarItem({
  href,
  label,
  icon: Icon,
  isCollapsed,
  onClick,
  isDanger = false,
  children,
  onExpandRequest,
  transitionEnabled = false,
}: SidebarItemProps) {
  const pathname = usePathname()
  const hasSubmenu = children && children.length > 0

  // Determine if item or child is active
  const isItemActive = href ? pathname === href : false
  const isChildActive = hasSubmenu
    ? children.some((child) => pathname === child.href)
    : false
  const active = isItemActive || isChildActive

  // Local open state for submenu
  const [isOpen, setIsOpen] = useState(false)

  // Expand submenu if a child is active initially or pathname changes
  useEffect(() => {
    if (isChildActive) {
      setIsOpen(true)
    }
  }, [pathname, isChildActive])

  // Handle click on parent menu item
  const handleParentClick = (e: React.MouseEvent) => {
    if (hasSubmenu) {
      e.preventDefault()
      if (isCollapsed) {
        // Expand sidebar first, then open submenu
        if (onExpandRequest) {
          onExpandRequest()
        }
        setIsOpen(true)
      } else {
        setIsOpen(!isOpen)
      }
    } else {
      if (onClick) {
        onClick()
      }
    }
  }

  // Animation variants for submenus
  const submenuVariants = {
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        height: { duration: 0.2, ease: 'easeInOut' as const },
        opacity: { duration: 0.15 },
      },
    },
    open: {
      height: 'auto',
      opacity: 1,
      transition: {
        height: { duration: 0.2, ease: 'easeInOut' as const },
        opacity: { duration: 0.2, delay: 0.05 },
      },
    },
  }

  // Close submenu when sidebar collapses
  useEffect(() => {
    if (isCollapsed && isOpen) {
      setIsOpen(false)
    }
  }, [isCollapsed, isOpen])

  // Common inner content for link/button (no submenu)
  const renderInnerContent = () => (
    <>
      {active && !isCollapsed && (
        <span
          className={`absolute -right-3 top-1/2 -translate-y-1/2 h-8 w-1.5 rounded-l ${
            isDanger ? 'bg-red-600' : 'bg-blue-600'
          }`}
        />
      )}

      <Icon
        className={`h-5 w-5 shrink-0 ${
          active ? (isDanger ? 'text-red-600' : 'text-blue-600') : ''
        }`}
      />

      <span
        className={`whitespace-nowrap text-left flex-1 overflow-hidden transition-opacity duration-200 ${
          isCollapsed ? 'opacity-0 w-0 flex-none' : 'opacity-100'
        }`}
      >
        {label}
      </span>
    </>
  )

  const commonClasses = `relative flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 w-full h-11 ${
    active
      ? isDanger
        ? 'bg-red-50 text-red-700'
        : 'bg-blue-50 text-blue-700'
      : isDanger
      ? 'text-red-500 hover:bg-red-50 hover:text-red-700'
      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
  } ${isCollapsed ? 'justify-center px-0' : ''}`

  return (
    <div className="relative group w-full">
      {/* Main Item Link / Button */}
      {hasSubmenu ? (
        <button
          onClick={handleParentClick}
          className={`w-full relative flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer h-11 ${
            active
              ? 'bg-blue-50 text-blue-700'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          } ${isCollapsed ? 'justify-center px-0' : ''}`}
        >
          {active && !isCollapsed && (
            <span className="absolute -right-3 top-1/2 -translate-y-1/2 h-8 w-1.5 rounded-l bg-blue-600" />
          )}

          <Icon className={`h-5 w-5 shrink-0 ${active ? 'text-blue-600' : ''}`} />

          <span
            className={`flex-1 text-left whitespace-nowrap overflow-hidden transition-opacity duration-200 ${
              isCollapsed ? 'opacity-0 w-0 flex-none' : 'opacity-100'
            }`}
          >
            {label}
          </span>

          {!isCollapsed && (
            <ChevronRight
              className={`h-4 w-4 shrink-0 transition-transform duration-250 ${
                isOpen ? 'rotate-90 text-blue-600' : 'text-slate-400'
              }`}
            />
          )}
        </button>
      ) : href ? (
        <Link href={href} onClick={onClick} className={commonClasses}>
          {renderInnerContent()}
        </Link>
      ) : (
        <button onClick={onClick} className={`${commonClasses} cursor-pointer`}>
          {renderInnerContent()}
        </button>
      )}

      {/* Tooltip for collapsed state */}
      {isCollapsed && (
        <div className="absolute left-[calc(100%+8px)] top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-slate-950 text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 whitespace-nowrap shadow-lg scale-90 group-hover:scale-100 origin-left">
          {label}
        </div>
      )}

      {/* Collapsible Submenu — unmount instantly on sidebar collapse to avoid vertical jump */}
      {hasSubmenu && !isCollapsed && (
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={submenuVariants}
              transition={transitionEnabled ? undefined : { duration: 0 }}
              className="overflow-hidden"
            >
              <div className="ml-4 mt-1.5 space-y-0.5 border-l-2 border-slate-100 pl-3">
                {children.map((child) => {
                  const childActive = pathname === child.href
                  const CIcon = child.icon
                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={onClick}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors duration-150 ${
                        childActive
                          ? 'bg-blue-50/70 text-blue-700 font-medium shadow-xs'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                      }`}
                    >
                      <CIcon className={`h-4 w-4 shrink-0 ${childActive ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span className="whitespace-nowrap">{child.label}</span>
                    </Link>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}
