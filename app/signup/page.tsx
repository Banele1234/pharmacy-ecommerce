// app/signup/page.tsx
import { RegistrationForm } from '@/components/features/auth/RegistrationForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up - PharmaCare',
  description: 'Create your PharmaCare account to access prescription services, health products, and exclusive offers.',
}

export default function SignUpPage() {
  return <RegistrationForm />
}