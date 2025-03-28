'use client';

import { RegisterForm } from '@/components/register-form';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-900">
      <h1 className="text-4xl font-bold mb-8 text-center">Waterloo Tinder</h1>
      <RegisterForm />
    </div>
  );
} 