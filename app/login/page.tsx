// app/login/page.tsx
import { LoginForm } from '@/components/features/auth/LoginForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login - PharmaCare',
  description: 'Secure login to your PharmaCare account. Access your prescriptions, orders, and healthcare services.',
}

export default function LoginPage() {
  return <LoginForm />
}