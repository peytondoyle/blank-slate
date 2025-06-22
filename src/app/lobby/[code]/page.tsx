'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useGuestName } from '@/hooks/useGuestName'

export default function LobbyPage() {
  const { code } = useParams<{ code: string }>()
  const router = useRouter()
  const guestName = useGuestName()
  const [players, setPlayers] = useState<any[]>([])
  const [room, setRoom] = useState<any>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function fetchRoomAndPlayers() {
      const { data: roomData } = await supabase
        .from('rooms')
        .select()
        .eq('code', code)
        .single()

      if (roomData) {
        setRoom(roomData)

        const { data: playersData } = await supabase
          .from('players')
          .select()
          .eq('room_id', roomData.id)

        if (playersData) {
          setPlayers(playersData)
        }

        // Subscribe to real-time player updates
        const channel = supabase
          .channel('players-room-' + roomData.id)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'players',
              filter: `room_id=eq.${roomData.id}`
            },
            fetchRoomAndPlayers
          )
          .subscribe()

        return () => {
          supabase.removeChannel(channel)
        }
      }
    }

    fetchRoomAndPlayers()
  }, [code])

  const handleStartGame = () => {
    router.push(`/game/${code}`)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(`${window.location.origin}/lobby/${code}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-gray-50 shadow-xl rounded-xl p-6 space-y-6 text-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Lobby Code: {code}</h1>
          <p className="text-sm text-gray-600">
            You&apos;re signed in as <span className="font-semibold">{guestName}</span>
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="w-full max-w-xs bg-purple-600 text-white font-medium text-lg rounded-lg px-4 py-3 hover:bg-purple-700 transition"

        >
          {copied ? '✅ Copied!' : '📋 Copy Room Link'}
        </button>

        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Players in Room</h2>
          <ul className="space-y-2">
            {players.map((p) => (
              <li key={p.id} className="text-gray-800 text-sm">
                {p.name}
                {p.name === guestName && (
                  <span className="ml-1 text-purple-600 font-medium">(You)</span>
                )}
                {room?.host_name === p.name && (
                  <span className="ml-2 text-yellow-600 font-medium">👑 Host</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <button
        onClick={handleStartGame}
        disabled={players.length < 2}
        className={`w-full max-w-xs font-medium text-lg rounded-lg px-4 py-3 transition ${
            players.length < 2
            ? 'bg-gray-600 text-gray-500 cursor-not-allowed'
            : 'bg-purple-600 text-white hover:bg-purple-700'
        }`}
        >
        Start Game
        </button>
      </div>
    </main>
  )
}