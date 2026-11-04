"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  ChevronLeft,
  Menu,
  X,
  Image as ImageIcon,
  Grid
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AdminLayoutClientProps {
  children: React.ReactNode
  session: any
}

const adminNavItems = [
  { label: 'Panel', icon: LayoutDashboard, href: '/admin' },
  { label: 'Bannerlar', icon: ImageIcon, href: '/admin/banners' },
  { label: 'Koleksiyonlar', icon: Grid, href: '/admin/home-categories' },
  { label: 'Ürünler', icon: Package, href: '/admin/products' },
  { label: 'Siparişler', icon: ShoppingCart, href: '/admin/orders' },
  { label: 'Kullanıcılar', icon: Users, href: '/admin/users' },
];

export default function AdminLayoutClient({ children, session }: AdminLayoutClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname();

  // Close menu when path changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <div className="flex min-h-screen bg-neutral-50 overflow-hidden">
      
      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-[90] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <aside className={cn(
        "w-72 bg-white border-r border-neutral-100 flex flex-col fixed inset-y-0 z-[100] transition-transform duration-300 ease-in-out md:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
         <div className="p-8 flex items-center justify-between md:block">
          <Link href="/" className="flex items-center gap-3 text-neutral-900 group">
             <div className="w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center text-white group-hover:rotate-12 transition-all flex-shrink-0">QH</div>
             <span className="font-black text-xs tracking-[0.3em] uppercase">Qiens Home Admin</span>
          </Link>
          <button 
             onClick={() => setIsMobileMenuOpen(false)}
             className="md:hidden p-2 text-neutral-400 hover:text-neutral-900 transition-colors"
          >
             <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {adminNavItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin');
            return (
              <Link 
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all",
                  isActive 
                    ? "bg-neutral-900 text-white shadow-lg" 
                    : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                )}
              >
                <item.icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-neutral-100">
           <Link 
             href="/"
             className="flex items-center gap-4 px-6 py-4 text-xs font-bold text-neutral-400 hover:text-neutral-900 transition-all"
           >
             <ChevronLeft size={16} />
             Siteye Dön
           </Link>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col w-full md:ml-72 min-h-screen transition-all duration-300">
        <header className="h-20 md:h-24 bg-white border-b border-neutral-100 flex items-center justify-between px-6 md:px-12 sticky top-0 z-40 shadow-sm md:shadow-none">
          <div className="flex items-center gap-4">
             <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 -ml-2 text-neutral-600 hover:bg-neutral-50 rounded-lg transition-colors"
             >
                <Menu size={24} />
             </button>
             <h2 className="text-xs md:text-sm font-black uppercase tracking-widest text-neutral-400 hidden sm:block">Yönetim Paneli</h2>
          </div>
          
          <div className="flex items-center gap-4 md:gap-6 ml-auto">
             <div className="text-right">
                <p className="text-xs md:text-sm font-bold text-neutral-900 truncate max-w-[120px] md:max-w-none">{session?.user?.name || "Admin"}</p>
                <p className="text-[9px] md:text-[10px] font-bold text-accent uppercase tracking-widest">Süper Yetkili</p>
             </div>
             <div className="w-8 h-8 md:w-10 md:h-10 bg-neutral-100 rounded-full border-2 border-white shadow-sm flex-shrink-0" />
          </div>
        </header>
        <div className="flex-1 p-6 md:p-12 overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  )
}
