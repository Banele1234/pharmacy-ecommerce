'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { productService } from '@/lib/firebase/services/products'
import { Loader2, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function FixProductsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const fixProducts = async () => {
    setIsLoading(true)
    setStatus('idle')
    setMessage('')
    
    try {
      // Clear all existing products first
      await productService.clearAllProducts()
      
      // Then initialize with new products that have external images
      await productService.initializeSampleProducts()
      
      setStatus('success')
      setMessage('✅ All products have been updated with working images!')
      
      // Redirect to shop after 2 seconds
      setTimeout(() => {
        router.push('/shop')
      }, 2000)
      
    } catch (error: any) {
      setStatus('error')
      setMessage(`❌ Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Fix Product Images</CardTitle>
          <CardDescription>
            This will clear all existing products and create new ones with working images
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={fixProducts}
            disabled={isLoading}
            className="w-full gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Fixing Products...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Fix Product Images
              </>
            )}
          </Button>

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

          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Deletes all existing products</p>
            <p>• Creates 8 new products with external images</p>
            <p>• Fixes broken image URLs</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}