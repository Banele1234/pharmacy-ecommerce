'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { productService } from '@/lib/firebase/services/products'
import { Loader2, CheckCircle, AlertCircle, RefreshCw, Database } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function FixImagesPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [currentStep, setCurrentStep] = useState('')
  const router = useRouter()

  const fixProductImages = async () => {
    setIsLoading(true)
    setStatus('idle')
    setMessage('')
    
    try {
      setCurrentStep('Clearing existing products...')
      await productService.clearAllProducts()
      
      setCurrentStep('Adding new products with external images...')
      await productService.initializeSampleProducts()
      
      setStatus('success')
      setMessage('✅ All products have been updated with working images!')
      setCurrentStep('')
      
      // Redirect to shop after 2 seconds
      setTimeout(() => {
        router.push('/shop')
      }, 2000)
      
    } catch (error: any) {
      setStatus('error')
      setMessage(`❌ Error: ${error.message}`)
      setCurrentStep('')
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-fix on page load
  useEffect(() => {
    fixProductImages()
  }, [])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Fixing Product Images
          </CardTitle>
          <CardDescription>
            Automatically replacing products with broken images...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center py-4">
            {isLoading ? (
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">{currentStep}</p>
              </div>
            ) : status === 'success' ? (
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto" />
            ) : status === 'error' ? (
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto" />
            ) : null}
          </div>

          {status !== 'idle' && (
            <div className={`flex items-center gap-2 p-3 rounded-md ${
              status === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {status === 'success' ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <span className="text-sm">{message}</span>
            </div>
          )}

          {status === 'error' && (
            <Button
              onClick={fixProductImages}
              disabled={isLoading}
              className="w-full gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          )}

          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Deleting products with broken images</p>
            <p>• Creating new products with working images</p>
            <p>• Using external image URLs from Unsplash</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}