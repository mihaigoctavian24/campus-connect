'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 bg-[#001f3f] shadow-lg">
      <div className="mx-auto max-w-7xl px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-[gold]">
              <span className="font-medium text-[#001f3f]">CC</span>
            </div>
            <span className="text-2xl font-medium text-white">CampusConnect</span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className={
                pathname === '/'
                  ? 'font-medium text-[gold]'
                  : 'text-white/80 transition hover:text-white'
              }
            >
              Home
            </Link>
            <Link
              href="/explore"
              className={
                pathname === '/explore'
                  ? 'font-medium text-[gold]'
                  : 'text-white/80 transition hover:text-white'
              }
            >
              Explore
            </Link>
            <Link
              href="/profile"
              className={
                pathname === '/profile'
                  ? 'font-medium text-[gold]'
                  : 'text-white/80 transition hover:text-white'
              }
            >
              Profile
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
