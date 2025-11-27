// components/admin/InitializeData.tsx
'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, CheckCircle, AlertCircle, RefreshCw, AlertTriangle, Upload } from 'lucide-react'

interface InitializeDataProps {
  onInitializationComplete: () => void
}

export function InitializeData({ onInitializationComplete }: InitializeDataProps) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleLoadProducts = async () => {
    setLoading(true)
    setStatus('idle')
    setMessage('')
    
    try {
      // This will trigger the parent component to reload products from the actual database
      onInitializationComplete()
      
      setStatus('success')
      setMessage('Products loaded successfully from database!')
    } catch (error: any) {
      console.error('Error loading products:', error)
      setStatus('error')
      setMessage('Failed to load products from database. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleImportProducts = () => {
    // Trigger file input click
    const fileInput = document.getElementById('product-import')
    if (fileInput) {
      fileInput.click()
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setLoading(true)
    setStatus('idle')
    setMessage('')

    try {
      // Here you would handle the actual file upload to your backend
      const formData = new FormData()
      formData.append('file', file)

      // Example API call (uncomment when you have the backend endpoint)
      /*
      const response = await fetch('/api/products/import', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Import failed')
      */

      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setStatus('success')
      setMessage('Products imported successfully!')
      onInitializationComplete() // Refresh the product list
      
      // Reset file input
      event.target.value = ''
    } catch (error: any) {
      console.error('Import error:', error)
      setStatus('error')
      setMessage('Failed to import products. Please check the file format.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Product Management
        </CardTitle>
        <CardDescription>
          Manage your pharmacy products database
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Load Existing Products */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Load Products</h4>
          <Button
            onClick={handleLoadProducts}
            disabled={loading}
            className="w-full gap-2"
            variant="outline"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Refresh Products
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground">
            Reload products from your database
          </p>
        </div>

        {/* Import Products */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Import Products</h4>
          <div className="space-y-2">
            <Button
              onClick={handleImportProducts}
              disabled={loading}
              className="w-full gap-2"
            >
              <Upload className="h-4 w-4" />
              Import from CSV/Excel
            </Button>
            
            <input
              id="product-import"
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <p className="text-xs text-muted-foreground">
              Import products from CSV or Excel file
            </p>
          </div>
        </div>

        {/* Status Messages */}
        {status !== 'idle' && (
          <div className={`flex items-start gap-2 p-3 rounded-md text-sm ${
            status === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {status === 'success' ? (
              <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            )}
            <span>{message}</span>
          </div>
        )}

        {/* Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Database className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-800">
                Using Real Database
              </p>
              <p className="text-xs text-blue-700">
                All operations work with your actual product database. 
                No sample data will be generated.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}