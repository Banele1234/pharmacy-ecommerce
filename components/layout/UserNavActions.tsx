'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Loader2, LogOut, User as UserIcon, LayoutDashboard } from 'lucide-react'
import { useAuth } from '@/lib/hooks/use-auth'
import { useUserProfile } from '@/lib/hooks/use-user-profile'
import { AuthService } from '@/lib/firebase/services/auth'
import { toast } from 'sonner'

export function UserNavActions() {
  const router = useRouter()
  const { user } = useAuth()
  const { profile, loading } = useUserProfile()
  const [signingOut, setSigningOut] = useState(false)

  const handleLogout = async () => {
    setSigningOut(true)
    try {
      await AuthService.signOutUser()
      toast.success('Signed out successfully')
      router.push('/login')
      router.refresh()
    } catch (error: any) {
      toast.error(error?.message || 'Failed to sign out. Please try again.')
    } finally {
      setSigningOut(false)
    }
  }

  if (loading) {
    return (
      <Button variant="ghost" size="sm" className="gap-2" disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading...
      </Button>
    )
  }

  if (!user) {
    return (
      <>
        <Link href="/login">
          <Button variant="ghost">Login</Button>
        </Link>
        <Link href="/signup">
          <Button className="gap-2">Sign Up</Button>
        </Link>
      </>
    )
  }

  const displayName = profile?.displayName || user.displayName || 'PharmaCare user'
  const email = user.email ?? profile?.email ?? ''
  const initials = displayName
    .split(' ')
    .map((name) => name[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || (email ? email[0]?.toUpperCase() : 'U')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus-visible:outline-none">
        <Avatar className="h-9 w-9 border border-border">
          {profile?.photoURL && (
            <AvatarImage src={profile.photoURL} alt={displayName} />
          )}
          <AvatarFallback className="text-sm font-medium">{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold leading-tight">{displayName}</span>
            {email && <span className="text-xs text-muted-foreground">{email}</span>}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        {profile?.role === 'admin' && (
          <DropdownMenuItem asChild>
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Admin Dashboard
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          {signingOut ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing out...
            </>
          ) : (
            <>
              <LogOut className="h-4 w-4" />
              Sign out
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

