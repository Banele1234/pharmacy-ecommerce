// components/features/auth/RegistrationForm.tsx
'use client'

import { useState, useCallback, memo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Calendar,
  Shield,
  Pill
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { AuthService } from '@/lib/firebase/services/auth'

// Validation functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validatePassword = (password: string): boolean => {
  return password.length >= 6
}

const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s-()]{10,}$/
  return phoneRegex.test(phone)
}

// Memoized Input Component
const MemoizedInput = memo(({ 
  id, 
  name, 
  type, 
  value, 
  onChange, 
  placeholder = "", 
  className,
  required,
  disabled
}: {
  id: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
}) => (
  <Input
    id={id}
    name={name}
    type={type}
    required={required}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={className}
    disabled={disabled}
  />
));

MemoizedInput.displayName = 'MemoizedInput';

// Step Components with memo
const Step1 = memo(({ 
  formData, 
  onInputChange,
  errors
}: { 
  formData: { firstName: string; lastName: string; email: string; phone: string };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: { [key: string]: string };
}) => (
  <div className="space-y-4">
    <div className="text-center mb-4">
      <h3 className="text-xl font-bold">Personal Information</h3>
      <p className="text-muted-foreground">Tell us about yourself</p>
    </div>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="firstName">First Name *</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <MemoizedInput
            id="firstName"
            name="firstName"
            type="text"
            required
            value={formData.firstName}
            onChange={onInputChange}
            placeholder="Enter your first name"
            className="pl-10"
          />
        </div>
        {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="lastName">Last Name *</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <MemoizedInput
            id="lastName"
            name="lastName"
            type="text"
            required
            value={formData.lastName}
            onChange={onInputChange}
            placeholder="Enter your last name"
            className="pl-10"
          />
        </div>
        {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
      </div>
    </div>

    <div className="space-y-2">
      <Label htmlFor="email">Email Address *</Label>
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <MemoizedInput
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={onInputChange}
          placeholder="your.email@example.com"
          className="pl-10"
        />
      </div>
      {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      {!errors.email && formData.email && !validateEmail(formData.email) && (
        <p className="text-sm text-amber-500">Please enter a valid email address</p>
      )}
    </div>

    <div className="space-y-2">
      <Label htmlFor="phone">Phone Number *</Label>
      <div className="relative">
        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <MemoizedInput
          id="phone"
          name="phone"
          type="tel"
          required
          value={formData.phone}
          onChange={onInputChange}
          placeholder="+1 (555) 123-4567"
          className="pl-10"
        />
      </div>
      {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
    </div>
  </div>
));

Step1.displayName = 'Step1';

const Step2 = memo(({ 
  formData, 
  onInputChange,
  onGenderChange,
  errors
}: { 
  formData: { dateOfBirth: string; gender: string };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGenderChange: (value: string) => void;
  errors: { [key: string]: string };
}) => (
  <div className="space-y-4">
    <div className="text-center mb-4">
      <h3 className="text-xl font-bold">Additional Information</h3>
      <p className="text-muted-foreground">Help us serve you better</p>
    </div>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="dateOfBirth">Date of Birth *</Label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <MemoizedInput
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            required
            value={formData.dateOfBirth}
            onChange={onInputChange}
            placeholder="Select your date of birth"
            className="pl-10"
          />
        </div>
        {errors.dateOfBirth && <p className="text-sm text-red-500">{errors.dateOfBirth}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="gender">Gender</Label>
        <Select 
          value={formData.gender} 
          onValueChange={onGenderChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  </div>
));

Step2.displayName = 'Step2';

const Step3 = memo(({ 
  formData, 
  onInputChange,
  onCheckboxChange,
  showPassword,
  onTogglePassword,
  errors
}: { 
  formData: { password: string; confirmPassword: string; acceptTerms: boolean; healthUpdates: boolean };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCheckboxChange: (name: string, checked: boolean) => void;
  showPassword: boolean;
  onTogglePassword: () => void;
  errors: { [key: string]: string };
}) => (
  <div className="space-y-4">
    <div className="text-center mb-4">
      <h3 className="text-xl font-bold">Security Setup</h3>
      <p className="text-muted-foreground">Create a secure password</p>
    </div>

    <div className="space-y-2">
      <Label htmlFor="password">Password *</Label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <MemoizedInput
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          required
          value={formData.password}
          onChange={onInputChange}
          placeholder="Create a strong password"
          className="pl-10 pr-10"
        />
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
      {!errors.password && formData.password && !validatePassword(formData.password) && (
        <p className="text-sm text-amber-500">Password must be at least 6 characters long</p>
      )}
    </div>

    <div className="space-y-2">
      <Label htmlFor="confirmPassword">Confirm Password *</Label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <MemoizedInput
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          value={formData.confirmPassword}
          onChange={onInputChange}
          placeholder="Confirm your password"
          className="pl-10"
        />
      </div>
      {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
      {!errors.confirmPassword && formData.confirmPassword && formData.password !== formData.confirmPassword && (
        <p className="text-sm text-amber-500">Passwords do not match</p>
      )}
    </div>

    <div className="space-y-4">
      <div className="flex items-start space-x-2">
        <Checkbox
          id="acceptTerms"
          checked={formData.acceptTerms}
          onCheckedChange={(checked) => 
            onCheckboxChange('acceptTerms', checked as boolean)
          }
        />
        <Label htmlFor="acceptTerms" className="text-sm font-normal leading-relaxed">
          I agree to the{' '}
          <Link href="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
          *
        </Label>
      </div>
      {errors.acceptTerms && <p className="text-sm text-red-500">{errors.acceptTerms}</p>}

      <div className="flex items-start space-x-2">
        <Checkbox
          id="healthUpdates"
          checked={formData.healthUpdates}
          onCheckedChange={(checked) => 
            onCheckboxChange('healthUpdates', checked as boolean)
          }
        />
        <Label htmlFor="healthUpdates" className="text-sm font-normal leading-relaxed">
          Send me health tips, medication reminders, and promotional offers
        </Label>
      </div>
    </div>
  </div>
));

Step3.displayName = 'Step3';

const Step4 = memo(({ 
  email, 
  onResendVerification 
}: { 
  email: string;
  onResendVerification: () => Promise<void>;
}) => {
  const [isResending, setIsResending] = useState(false)
  
  const handleResend = async () => {
    setIsResending(true)
    await onResendVerification()
    setIsResending(false)
  }

  return (
    <div className="text-center space-y-4">
      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h3 className="text-2xl font-bold">Welcome to PharmaCare!</h3>
      <p className="text-muted-foreground">
        Your account has been created successfully
      </p>
      
      <div className="bg-muted/50 rounded-lg p-4 border">
        <p className="text-sm mb-2">
          We've sent a verification email to <strong>{email}</strong>
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Please check your inbox and verify your email to complete your registration.
        </p>
        
        <div className="text-xs text-muted-foreground space-y-2">
          <p>Didn't receive the email?</p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResend}
            disabled={isResending}
          >
            {isResending ? 'Sending...' : 'Resend Verification Email'}
          </Button>
        </div>
      </div>
    </div>
  )
});

Step4.displayName = 'Step4';

export function RegistrationForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    acceptTerms: false,
    healthUpdates: false
  })

  const validateStep = (step: number): boolean => {
    const newErrors: { [key: string]: string } = {}

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
      if (!formData.email.trim()) newErrors.email = 'Email is required'
      else if (!validateEmail(formData.email)) newErrors.email = 'Please enter a valid email address'
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
      else if (!validatePhone(formData.phone)) newErrors.phone = 'Please enter a valid phone number'
    }

    if (step === 2) {
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required'
    }

    if (step === 3) {
      if (!formData.password) newErrors.password = 'Password is required'
      else if (!validatePassword(formData.password)) newErrors.password = 'Password must be at least 6 characters long'
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password'
      else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
      if (!formData.acceptTerms) newErrors.acceptTerms = 'You must accept the terms and conditions'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = useCallback(() => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4))
    }
  }, [currentStep, formData])

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (currentStep === 3 && validateStep(3)) {
      setIsLoading(true)
      
      try {
        console.log('Starting REAL Firebase registration...');
        
        // Use REAL Firebase authentication
        const userData = await AuthService.signUp(
          formData.email,
          formData.password,
          `${formData.firstName} ${formData.lastName}`
        )
        
        console.log('Firebase registration successful:', userData);
        
        // Success - user is created in Firebase Auth and verification email is sent automatically
        toast.success('Registration successful! Redirecting to login...');

        setTimeout(() => {
          router.push('/login')
        }, 2000)
        
      } catch (error: any) {
        console.error('Firebase registration error:', error);
        toast.error(error.message || 'An error occurred during registration. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  }

  const handleResendVerification = async () => {
    try {
      await AuthService.sendVerificationEmail();
      toast.success('Verification email sent successfully! Check your inbox.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send verification email. Please try again.');
    }
  }

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }, [errors])

  const handleCheckboxChange = useCallback((name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }))
    // Clear error when user checks the box
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }, [errors])

  const handleGenderChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, gender: value }))
  }, [])

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev)
  }, [])

  const StepIndicator = () => (
    <div className="flex items-center justify-between mb-6">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-medium ${
            currentStep >= step 
              ? 'bg-primary border-primary text-primary-foreground' 
              : 'border-muted-foreground/30 text-muted-foreground'
          }`}>
            {step}
          </div>
          {step < 3 && (
            <div className={`w-12 h-0.5 mx-2 ${
              currentStep > step ? 'bg-primary' : 'bg-muted-foreground/20'
            }`} />
          )}
        </div>
      ))}
    </div>
  )

  // Render the current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1 
            formData={{
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              phone: formData.phone
            }}
            onInputChange={handleInputChange}
            errors={errors}
          />
        )
      case 2:
        return (
          <Step2 
            formData={{
              dateOfBirth: formData.dateOfBirth,
              gender: formData.gender
            }}
            onInputChange={handleInputChange}
            onGenderChange={handleGenderChange}
            errors={errors}
          />
        )
      case 3:
        return (
          <Step3 
            formData={{
              password: formData.password,
              confirmPassword: formData.confirmPassword,
              acceptTerms: formData.acceptTerms,
              healthUpdates: formData.healthUpdates
            }}
            onInputChange={handleInputChange}
            onCheckboxChange={handleCheckboxChange}
            showPassword={showPassword}
            onTogglePassword={togglePasswordVisibility}
            errors={errors}
          />
        )
      case 4:
        return (
          <Step4 
            email={formData.email}
            onResendVerification={handleResendVerification}
          />
        )
      default:
        return (
          <Step1 
            formData={{
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              phone: formData.phone
            }}
            onInputChange={handleInputChange}
            errors={errors}
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70">
              <Pill className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">PharmaCare</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl space-y-8">
          {/* Page Header */}
          <div className="space-y-2 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
            >
              ← Back to Home
            </Link>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-3xl font-bold">Join PharmaCare</h1>
            <p className="text-muted-foreground">
              Create your account in simple steps
            </p>
          </div>

          {/* Registration Card */}
          <Card className="border-2">
            <CardHeader>
              <StepIndicator />
              <CardTitle className="sr-only">Create Your Account</CardTitle>
              <CardDescription className="sr-only">
                Complete the following steps to create your PharmaCare account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                {renderCurrentStep()}

                {/* Navigation Buttons */}
                {currentStep < 4 && (
                  <div className={`flex ${currentStep > 1 ? 'justify-between' : 'justify-end'} mt-6 pt-6 border-t`}>
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        onClick={prevStep}
                        variant="outline"
                      >
                        Back
                      </Button>
                    )}
                    
                    {currentStep < 3 ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                      >
                        Continue
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="gap-2"
                      >
                        {isLoading ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            Creating Account...
                          </>
                        ) : (
                          'Create Account'
                        )}
                      </Button>
                    )}
                  </div>
                )}
              </form>
            </CardContent>

            {currentStep < 4 && (
              <CardFooter className="flex flex-col space-y-4 border-t pt-6">
                <div className="text-center text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link href="/login" className="text-primary hover:underline font-semibold">
                    Sign in here
                  </Link>
                </div>
                
                {/* Security Notice */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="h-3 w-3" />
                  Your health data is protected with enterprise-grade security
                </div>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}