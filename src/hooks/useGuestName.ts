// src/hooks/useGuestName.ts
'use client'
import { useState, useEffect } from 'react'

export function useGuestName() {
  const [name, setName] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('guestName')
    setName(stored)
  }, [])

  return name
}