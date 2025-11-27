'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { productService } from '@/lib/firebase/services/products'
import { Loader2, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ReinitializePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const reinitializeProducts = async () => {
    setIsLoading(true)
    setStatus('idle')
    setMessage('')
    
    try {
      await productService.initializeSampleProducts()
      setStatus('success')
      setMessage('Products reinitialized successfully! Images should now display correctly.')
      
      setTimeout(() => {
        router.push('/shop')
      }, 2000)
    } catch (error: any) {
      setStatus('error')
      setMessage(`Error: ${error.message}`)
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
            This will replace all products with new ones that have working images
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={reinitializeProducts}
            disabled={isLoading}
            className="w-full gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Fixing Images...
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
            <p>• Adds 8 new products with working images</p>
            <p>• Fixes the 404 image errors</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}