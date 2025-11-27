'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/lib/hooks/use-auth'
import { useAdminUser } from '@/lib/hooks/use-admin-user'
import { AuthService } from '@/lib/firebase/services/auth'

export default function ProfilePage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const { adminUser, loading: adminLoading } = useAdminUser()
  const [signingOut, setSigningOut] = useState(false)

  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      await AuthService.signOutUser()
      router.push('/login')
    } finally {
      setSigningOut(false)
    }
  }

  if (loading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 bg-white/90 px-6 py-8 shadow">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <p className="text-sm text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background px-4 py-8 text-center">
        <p className="text-lg font-semibold">You need to be signed in to view your profile.</p>
        <Link href="/login">
          <Button>Go to login</Button>
        </Link>
      </div>
    )
  }

  const profileRole = adminUser?.role ?? 'user'

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="mx-auto max-w-3xl px-4">
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>Manage your account and security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="text-lg font-semibold">{user.displayName || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-lg font-semibold">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Account ID</p>
                <p className="text-lg font-semibold">{user.uid}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <p className="text-lg font-semibold">
                  <Badge
                    variant={profileRole === 'admin' ? 'secondary' : 'outline'}
                    className="text-sm font-semibold"
                  >
                    {profileRole === 'admin' ? 'Admin' : 'Customer'}
                  </Badge>
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <p>
                Firebase UID: <span className="font-mono text-xs text-foreground">{user.uid}</span>
              </p>
              <p>
                Email verified: {user.emailVerified ? 'Yes' : 'Not yet'}.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Link href="/">
                <Button variant="outline" className="w-full">Back to Shop</Button>
              </Link>
              <Button
                variant="destructive"
                onClick={handleSignOut}
                className="w-full"
                disabled={signingOut}
              >
                {signingOut ? 'Signing out...' : 'Sign Out'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

