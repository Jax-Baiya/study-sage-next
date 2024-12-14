'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function VerifyEmail() {
  const [verificationStatus, setVerificationStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  useEffect(() => {
    if (token) {
      verifyEmail(token)
    }
  }, [token])

  const verifyEmail = async (token: string) => {
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })

      if (response.ok) {
        setVerificationStatus('success')
        setTimeout(() => router.push('/auth/signin'), 3000)
      } else {
        setVerificationStatus('error')
      }
    } catch (error) {
      console.error('Verification error:', error)
      setVerificationStatus('error')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
        </CardHeader>
        <CardContent>
          {verificationStatus === 'verifying' && <p>Verifying your email...</p>}
          {verificationStatus === 'success' && (
            <p>Your email has been successfully verified. Redirecting to login...</p>
          )}
          {verificationStatus === 'error' && (
            <p>There was an error verifying your email. Please try again or contact support.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

