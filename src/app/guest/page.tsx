'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const randomAdjectives = ['Zebra', 'Sunbeam', 'Tulip', 'Raccoon', 'Pebble']
const randomNumbers = () => Math.floor(Math.random() * 100)

function generateGuestName() {
  const adj = randomAdjectives[Math.floor(Math.random() * randomAdjectives.length)]
  return `Guest_${adj}${randomNumbers()}`
}

export default function GuestPage() {
  const router = useRouter()

  useEffect(() => {
    const guestName = generateGuestName()
    localStorage.setItem('guestName', guestName)
    router.push('/lobby/new')
  }, [router])

  return (
    <main className="flex h-screen items-center justify-center">
      <p className="text-lg text-gray-700">Creating guest profile…</p>
    </main>
  )
}