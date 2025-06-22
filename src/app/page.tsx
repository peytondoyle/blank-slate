// src/app/page.tsx
'use client'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white p-8 text-center">
      <h1 className="text-4xl font-bold mb-6">🟪 Blank Slate</h1>
      <p className="text-lg text-gray-700 mb-12">How do you want to play?</p>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button
          onClick={() => router.push('/auth/signup')}
          className="bg-purple-600 text-white rounded-lg px-4 py-3 hover:bg-purple-700 transition"
        >
          📱 Make an Account
        </button>
        <button
          onClick={() => router.push('/auth/login')}
          className="bg-gray-200 text-gray-800 rounded-lg px-4 py-3 hover:bg-gray-300 transition"
        >
          🔐 Login
        </button>
        <button
          onClick={() => router.push('/guest')}
          className="bg-blue-100 text-blue-900 rounded-lg px-4 py-3 hover:bg-blue-200 transition"
        >
          👤 Continue as Guest
        </button>
      </div>
    </main>
  )
}