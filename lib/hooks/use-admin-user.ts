'use client'

import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { useAuth } from '@/lib/hooks/use-auth'
import type { User } from '@/lib/types/firebase'

export function useAdminUser() {
  const { user, loading } = useAuth()
  const [adminUser, setAdminUser] = useState<User | null>(null)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    let active = true

    if (!user) {
      setAdminUser(null)
      setFetching(false)
      return
    }

    setFetching(true)

    const fetchAdminData = async () => {
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
            typeof rawRole === 'string' && rawRole.toLowerCase() === 'admin'
              ? 'admin'
              : 'customer'

          setAdminUser({
            ...(data as User),
            uid: user.uid,
            createdAt,
            role: normalizedRole,
          })
        } else {
          setAdminUser(null)
        }
      } catch (error) {
        console.error('Failed to fetch admin user data:', error)
        if (active) {
          setAdminUser(null)
        }
      } finally {
        if (active) {
          setFetching(false)
        }
      }
    }

    fetchAdminData()

    return () => {
      active = false
    }
  }, [user])

  return { adminUser, loading: loading || fetching }
}

