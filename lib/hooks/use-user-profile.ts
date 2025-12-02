'use client'

import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { useAuth } from '@/lib/hooks/use-auth'
import type { User } from '@/lib/types/firebase'

export function useUserProfile() {
  const { user, loading } = useAuth()
  const [profile, setProfile] = useState<User | null>(null)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    let active = true

    if (!user) {
      setProfile(null)
      setFetching(false)
      return
    }

    setFetching(true)

    const fetchProfile = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (!active) return

        if (userDoc.exists()) {
          const data = userDoc.data()
          const rawCreatedAt = (data as any)?.createdAt
          const createdAt = rawCreatedAt?.toDate
            ? rawCreatedAt.toDate()
            : rawCreatedAt
              ? new Date(rawCreatedAt)
              : new Date()
          const rawRole = (data as any)?.role
          const normalizedRole =
            typeof rawRole === 'string'
              ? rawRole.toLowerCase()
              : 'customer'

          setProfile({
            ...(data as User),
            uid: user.uid,
            createdAt,
            role: normalizedRole as User['role'],
          })
        } else {
          setProfile(null)
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error)
        if (active) {
          setProfile(null)
        }
      } finally {
        if (active) {
          setFetching(false)
        }
      }
    }

    fetchProfile()

    return () => {
      active = false
    }
  }, [user])

  return { profile, loading: loading || fetching }
}

