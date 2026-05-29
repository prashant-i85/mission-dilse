'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Heart,
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  Info,
  Phone,
  LogOut,
  Menu,
  X,
} from 'lucide-react'

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const supabase = createClient()

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Hero Editor', href: '/admin/hero', icon: Heart },
    { name: 'Copy Editor', href: '/admin/copy', icon: FileText },
    { name: 'Works Manager', href: '/admin/works', icon: FileText },
    { name: 'Gallery Manager', href: '/admin/gallery', icon: ImageIcon },
    { name: 'About Editor', href: '/admin/about', icon: Info },
    { name: 'Contact Editor', href: '/admin/contact', icon: Phone },
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
    router.push('/admin/login')
  }

  const toggleSidebar = () => setIsOpen(!isOpen)

  return (
    <>
      {/* Mobile Header */}
      <header className="bg-brand-charcoal-800 text-white lg:hidden flex items-center justify-between px-4 py-4 sticky top-0 z-30 border-b border-brand-charcoal-100/10 shadow-md">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-brand-orange-500 fill-brand-orange-500" />
          <span className="font-bold font-display text-lg">Mission Dilse Admin</span>
        </div>
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-md text-white/80 hover:text-white hover:bg-brand-charcoal-100/10 focus:outline-none"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-brand-charcoal-800 border-r border-brand-charcoal-100/10 text-white flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Logo */}
          <div className="hidden lg:flex items-center gap-2.5 px-6 py-6 border-b border-brand-charcoal-100/10">
            <Heart className="h-6 w-6 text-brand-orange-500 fill-brand-orange-500 animate-pulse" />
            <span className="font-bold font-display text-xl tracking-tight text-white">
              Dilse Admin
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-6 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              const Icon = item.icon

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-brand-orange-600 text-white shadow-lg shadow-brand-orange-600/10'
                      : 'text-brand-charcoal-100/70 hover:bg-brand-charcoal-100/5 hover:text-white'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-brand-charcoal-100/40'}`} />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="p-3 border-t border-brand-charcoal-100/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold tracking-wide text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all focus:outline-none"
          >
            <LogOut className="h-5 w-5 text-red-400/60" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}
