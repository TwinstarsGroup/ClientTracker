'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getUser, signOut } from '@/lib/clientService'
import { isSupabaseConfigured } from '@/lib/supabaseClient'

const IDLE_TIMEOUT_MS = 10 * 60 * 1000 // 10 minutes

export default function IdleLogout() {
  const router = useRouter()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured) return
    getUser().then((user) => setIsAuthenticated(!!user))
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured || !isAuthenticated) return

    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(async () => {
        try {
          await signOut()
        } catch {
          // ignore sign-out errors during idle logout
        }
        router.replace('/login')
      }, IDLE_TIMEOUT_MS)
    }

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'] as const

    events.forEach((event) => window.addEventListener(event, resetTimer, { passive: true }))
    resetTimer()

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer))
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [isAuthenticated, router])

  return null
}
