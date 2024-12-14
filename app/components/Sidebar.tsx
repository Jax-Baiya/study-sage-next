'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Book, Zap, Palette, Settings, LogIn, LogOut } from 'lucide-react'
import ThemeSwitcher from './ThemeSwitcher'
import { useSession, signOut } from 'next-auth/react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'

const Sidebar = () => {
  const { data: session } = useSession()
  const pathname = usePathname()

  const navItems = [
    { href: '/', icon: Home, label: 'Dashboard' },
    { href: '/flashcards', icon: Book, label: 'Flashcards' },
    { href: '/ai-generator', icon: Zap, label: 'AI Generator' },
    { href: '/themes', icon: Palette, label: 'Themes' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <aside className="w-64 bg-card text-card-foreground shadow-md flex flex-col">
      <div className="p-4">
        <h1 className="text-2xl font-bold">StudySage</h1>
      </div>
      <nav className="flex-1 mt-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center px-4 py-2 text-foreground hover:bg-accent hover:text-accent-foreground",
              pathname === item.href && "bg-accent text-accent-foreground"
            )}
          >
            <item.icon className="mr-2" size={20} />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4">
        {session ? (
          <Button onClick={() => signOut()} className="w-full">
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        ) : (
          <Link href="/auth/signin">
            <Button className="w-full">
              <LogIn className="mr-2 h-4 w-4" /> Sign In
            </Button>
          </Link>
        )}
      </div>
      <div className="p-4">
        <ThemeSwitcher />
      </div>
    </aside>
  )
}

export default Sidebar

