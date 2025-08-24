"use client";

import { useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { LoginForm } from '@/components/login-form'

function LoginContent() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from') || '/dashboard'

  useEffect(() => {
    if (isAuthenticated) {
      router.push(from)
    }
  }, [isAuthenticated, router, from])

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen">
      <LoginForm isOpen={true} onOpenChange={() => {}} />
    </div>
  )
}

export default function LoginClient() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  )
}
