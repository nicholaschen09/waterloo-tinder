'use client'

import { LoginForm } from '@/components/login-form'

export default function LoginPage() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center p-4 bg-white'>
      <h1 className='text-4xl font-bold mb-8 text-center'>Match</h1>
      <LoginForm />
    </div>
  )
}
