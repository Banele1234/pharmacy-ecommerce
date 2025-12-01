// app/admin/products/new/page.tsx
'use client'

import { AdminLayout } from '@/components/admin/AdminLayout'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, Package, AlertCircle, Database } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { toast } from 'sonner'

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [firebaseReady, setFirebaseReady] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    sku: '',
    supplier: '',
    prescriptionRequired: false,
    image: ''
  })

  // Check if Firebase is initialized
  useEffect(() => {
    console.log('🔄 Checking Firebase Firestore initialization...')
    
    if (db) {
      setFirebaseReady(true)
      console.log('✅ Firebase Firestore is ready')
    } else {
      console.error('❌ Firebase Firestore is not initialized')
      toast.error('Firebase Firestore not initialized. Please check your configuration.')
    }
  }, [])

  const categories = [
    'Antibiotics',
    'Pain Relief',
    'Vitamins',
    'First Aid',
    'Cold & Flu',
    'Skin Care',
    'Digestive Health',
    'Allergy'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('🔄 Submit button clicked')
    console.log('✅ Firebase ready:', firebaseReady)
    console.log('✅ DB exists:', !!db)
    
    // Check if Firebase is ready
    if (!firebaseReady || !db) {
      toast.error('Firebase Firestore is not initialized. Please refresh the page.')
      console.error('❌ Firebase not ready, cannot submit')
      return
    }
    
    // Validate required fields
    if (!formData.name || !formData.category || !formData.price || !formData.stock) {
      toast.error('Please fill in all required fields.')
      return
    }

    // Validate numeric fields
    const price = parseFloat(formData.price)
    const stock = parseInt(formData.stock)
    
    if (isNaN(price) || price < 0) {
      toast.error('Please enter a valid price.')
      return
    }
    
    if (isNaN(stock) || stock < 0) {
      toast.error('Please enter a valid stock quantity.')
      return
    }

    setLoading(true)

    try {
      // Create the product data for Firestore
      const productData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        sku: formData.sku || `SKU-${Date.now()}`,
        supplier: formData.supplier,
        prescriptionRequired: formData.prescriptionRequired,
        imageUrl: formData.image || '',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      console.log('🔄 Saving product to Firestore:', productData)
      
      // Save to Firestore using db directly
      const docRef = await addDoc(collection(db, 'products'), productData);
      
      console.log('✅ Product created with ID:', docRef.id)
      
      // Show success message
      toast.success(`Product "${formData.name}" created successfully!`)
      
      // Redirect to products list
      setTimeout(() => {
        router.push('/admin/products')
        router.refresh() // Refresh the page data
      }, 1500)
      
    } catch (error: any) {
      console.error('❌ Error creating product:')
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      console.error('Error code:', error.code)
      console.error('Error stack:', error.stack)
      
      // More specific error handling
      if (error.code === 'permission-denied') {
        toast.error(
          <div className="space-y-2">
            <p className="font-semibold">Permission Denied</p>
            <p className="text-sm">Check your Firestore security rules in Firebase Console.</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.open('https://console.firebase.google.com/project/pharmacare-10111/firestore/rules', '_blank')}
              className="mt-2"
            >
              <Database className="h-4 w-4 mr-2" />
              Open Firestore Rules
            </Button>
          </div>
        )
      } else if (error.code === 'unavailable') {
        toast.error('Network error: Please check your internet connection.')
      } else if (error.code === 'failed-precondition') {
        toast.error('Firestore not initialized properly. Please refresh the page.')
      } else if (error.name === 'FirebaseError') {
        toast.error(`Firebase Error (${error.code}): ${error.message}`)
      } else {
        toast.error(`Failed to create product: ${error.message || 'Unknown error occurred'}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Test Firestore connection
  const testConnection = async () => {
    try {
      console.log('🔍 Testing Firestore connection...')
      
      if (!db) {
        toast.error('Firestore is not initialized')
        return
      }
      
      // Try to write a test document
      const testData = {
        test: true,
        timestamp: serverTimestamp(),
        message: 'Test connection'
      }
      
      const testRef = await addDoc(collection(db, 'test_collection'), testData)
      console.log('✅ Test document created with ID:', testRef.id)
      toast.success('Firestore connection test successful!')
      
      // Clean up test document (optional)
      setTimeout(async () => {
        try {
          // You might need to import deleteDoc if you want to clean up
          // await deleteDoc(doc(db, 'test_collection', testRef.id))
        } catch (e) {
          console.log('Test document cleanup not needed')
        }
      }, 5000)
      
    } catch (error: any) {
      console.error('❌ Firestore test failed:', error)
      toast.error(`Firestore test failed: ${error.code || error.message}`)
    }
  }

  // Show error if Firebase is not ready
  if (!firebaseReady) {
    return (
      <AdminLayout activePage="/admin/products">
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-amber-500 mx-auto" />
            <h2 className="text-xl font-semibold">Firebase Firestore Not Initialized</h2>
            <p className="text-muted-foreground">
              Firestore database connection failed. Please check your Firebase configuration.
            </p>
            <div className="space-y-2">
              <Button onClick={() => window.location.reload()}>
                Refresh Page
              </Button>
              <Button 
                variant="outline" 
                onClick={testConnection}
              >
                Test Firestore Connection
              </Button>
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout activePage="/admin/products">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
            <p className="text-muted-foreground">
              Create a new product in your pharmacy inventory
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={testConnection}
            className="ml-auto gap-2"
          >
            <Database className="h-4 w-4" />
            Test Connection
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Enter the basic details of the product
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="e.g., Amoxicillin 500mg"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      placeholder="Product description and usage instructions"
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select 
                        value={formData.category} 
                        onValueChange={(value) => handleChange('category', value)}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="supplier">Supplier</Label>
                      <Input
                        id="supplier"
                        value={formData.supplier}
                        onChange={(e) => handleChange('supplier', e.target.value)}
                        placeholder="Supplier name"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pricing & Inventory */}
              <Card>
                <CardHeader>
                  <CardTitle>Pricing & Inventory</CardTitle>
                  <CardDescription>
                    Set pricing and stock information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price ($) *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) => handleChange('price', e.target.value)}
                        placeholder="0.00"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock Quantity *</Label>
                      <Input
                        id="stock"
                        type="number"
                        min="0"
                        value={formData.stock}
                        onChange={(e) => handleChange('stock', e.target.value)}
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
                    <Input
                      id="sku"
                      value={formData.sku}
                      onChange={(e) => handleChange('sku', e.target.value)}
                      placeholder="e.g., AMOX-500-30"
                    />
                    <p className="text-xs text-muted-foreground">
                      Unique identifier for this product
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    type="submit" 
                    className="w-full gap-2"
                    disabled={loading || !formData.name || !formData.category || !formData.price || !formData.stock}
                  >
                    {loading ? (
                      <>
                        <Package className="h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Create Product
                      </>
                    )}
                  </Button>
                  
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/admin/products">
                      Cancel
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Product Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="prescription">Prescription Required</Label>
                      <p className="text-sm text-muted-foreground">
                        This product requires a prescription
                      </p>
                    </div>
                    <Switch
                      id="prescription"
                      checked={formData.prescriptionRequired}
                      onCheckedChange={(checked) => handleChange('prescriptionRequired', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Image Upload */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Image</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Package className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Upload product image
                    </p>
                    <Button variant="outline" size="sm" type="button" onClick={() => document.getElementById('image-upload')?.click()}>
                      Choose File
                    </Button>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          // Create a temporary URL for the image
                          const url = URL.createObjectURL(file)
                          handleChange('image', url)
                        }
                      }}
                    />
                  </div>
                  {formData.image && (
                    <div className="mt-2">
                      <img 
                        src={formData.image || '/placeholder.jpg'} 
                        onError={e => e.currentTarget.src = '/placeholder.jpg'}
                        alt="Product preview"
                        className="h-20 w-20 object-cover rounded-lg mx-auto"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="image-url">Or enter image URL</Label>
                    <Input
                      id="image-url"
                      type="url"
                      value={formData.image}
                      onChange={(e) => handleChange('image', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}