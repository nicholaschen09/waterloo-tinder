'use client'

import { useRouter, usePathname } from 'next/navigation'
import { User, Heart, MessageCircle, Settings, LogOut } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export function Navigation() {
  const router = useRouter()
  const pathname = usePathname()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  const isActive = (path: string) => pathname === path

  return (
    <nav className='fixed bottom-0 left-0 right-0 bg-background border-t p-2 z-40'>
      <div className='max-w-md mx-auto flex justify-around items-center'>
        <button
          onClick={() => router.push('/dashboard')}
          className={`flex flex-col items-center p-2 rounded-md ${
            isActive('/dashboard')
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Heart className='h-5 w-5' />
          <span className='text-xs mt-1'>Swipe</span>
        </button>

        <button
          onClick={() => router.push('/matches')}
          className={`flex flex-col items-center p-2 rounded-md ${
            isActive('/matches')
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <MessageCircle className='h-5 w-5' />
          <span className='text-xs mt-1'>Matches</span>
        </button>

        <button
          onClick={() => router.push('/profile')}
          className={`flex flex-col items-center p-2 rounded-md ${
            isActive('/profile')
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <User className='h-5 w-5' />
          <span className='text-xs mt-1'>Profile</span>
        </button>

        <button
          onClick={handleLogout}
          className='flex flex-col items-center p-2 rounded-md text-muted-foreground hover:text-foreground'
        >
          <LogOut className='h-5 w-5' />
          <span className='text-xs mt-1'>Logout</span>
        </button>
      </div>
    </nav>
  )
}
