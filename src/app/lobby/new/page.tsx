'use client'
import { useGuestName } from '@/hooks/useGuestName'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function LobbyNewPage() {
  const guestName = useGuestName()
  const [roomCode, setRoomCode] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!guestName) return

    async function createRoom() {
      const code = Math.random().toString(36).substring(2, 7).toUpperCase()

      const { data, error } = await supabase
        .from('rooms')
        .insert([{ code, host_name: guestName }])
        .select()
        .single()

      if (error) {
        console.error('Error creating room:', error.message)
        return
      }

      if (data) {
        setRoomCode(data.code)
        await supabase.from('players').insert([{ room_id: data.id, name: guestName }])
      }
    }

    createRoom()
  }, [guestName])

  const handleStartGame = () => {
    router.push(`/game/${roomCode}`)
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      {!roomCode ? (
        <p className="text-gray-500">Creating room…</p>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-4">Lobby Created</h1>
          <p className="text-gray-700 mb-2">Welcome, <span className="font-medium">{guestName}</span></p>
          <p className="text-gray-600 mb-6">Your room code is: <code className="font-mono">{roomCode}</code></p>
          <button
            onClick={handleStartGame}
            className="w-full max-w-xs bg-purple-600 text-white font-medium text-lg rounded-lg px-4 py-3 hover:bg-purple-700 transition"
          >
            Start Game
          </button>
        </>
      )}
    </main>
  )
}