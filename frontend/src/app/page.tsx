'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Loader2 } from 'lucide-react'

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)

  // Handle client-side only code
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    // Only redirect after mounting on client and auth state is determined
    if (isMounted && !isLoading) {
      if (isAuthenticated) {
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
    }
  }, [isLoading, isAuthenticated, router, isMounted])

  return (
    <div className='min-h-screen flex flex-col items-center justify-center'>
      <div className='mb-8'>
        <h1 className='text-4xl font-bold text-center'>Waterloo Tinder</h1>
        <p className='text-center mt-2 text-muted-foreground'>
          Connect with other Waterloo students
        </p>
      </div>
      <Loader2 className='h-8 w-8 animate-spin' />
    </div>
  )
}
