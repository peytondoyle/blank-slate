'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [step, setStep] = useState<'phone' | 'code' | 'name'>('phone')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSendCode = async () => {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOtp({ phone })
    if (error) setError(error.message)
    else setStep('code')
    setLoading(false)
  }

  const handleVerifyCode = async () => {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.verifyOtp({
      phone,
      token: code,
      type: 'sms',
    })
    if (error) setError(error.message)
    else setStep('name')
    setLoading(false)
  }

  const handleSaveName = async () => {
    setLoading(true)
    setError('')
    const {
      data: { user },
      error: sessionError,
    } = await supabase.auth.getUser()

    if (sessionError || !user) {
      setError('Not logged in')
      setLoading(false)
      return
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({ id: user.id, profile_name: name })

    if (profileError) {
      setError(profileError.message)
    } else {
      router.push('/lobby/new') // go to create game screen next
    }

    setLoading(false)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">📱 Sign Up</h1>

      {step === 'phone' && (
        <>
          <input
            type="tel"
            placeholder="+1 555 555 1234"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border rounded p-2 mb-4 w-full max-w-xs"
          />
          <button
            onClick={handleSendCode}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Code'}
          </button>
        </>
      )}

      {step === 'code' && (
        <>
          <input
            type="text"
            placeholder="Enter 6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="border rounded p-2 mb-4 w-full max-w-xs"
          />
          <button
            onClick={handleVerifyCode}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>
        </>
      )}

      {step === 'name' && (
        <>
          <input
            type="text"
            placeholder="Enter your profile name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded p-2 mb-4 w-full max-w-xs"
          />
          <button
            onClick={handleSaveName}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save & Continue'
          }
          </button>
        </>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </main>
  )
}