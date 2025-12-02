"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge" // ADD THIS IMPORT
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Upload, FileText, Check, Package, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/lib/types"
import { useCart } from "@/lib/hooks/use-cart"

export default function UploadPrescriptionPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { addItem } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [notes, setNotes] = useState("")

  useEffect(() => {
    // Get the product from session storage
    const productData = sessionStorage.getItem('prescriptionProduct')
    if (productData) {
      setProduct(JSON.parse(productData))
    } else {
      // If no product, redirect back to shop
      router.push('/shop')
    }
  }, [router])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      setFiles(selectedFiles)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!product) return
    
    if (files.length === 0) {
      toast({
        title: "No file selected",
        description: "Please select a prescription file to upload.",
        variant: "destructive"
      })
      return
    }

    setUploading(true)

    try {
      // Here you would upload to Firebase Storage or your backend
      // For now, we'll simulate an upload
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Add to cart after successful upload
      addItem(product, 1)
      
      toast({
        title: "Prescription uploaded successfully!",
        description: `${product.name} has been added to your cart. Our pharmacist will review your prescription.`,
      })
      
      // Clear session storage
      sessionStorage.removeItem('prescriptionProduct')
      
      // Redirect to cart
      setTimeout(() => {
        router.push('/cart')
      }, 1000)
      
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload prescription. Please try again.",
        variant: "destructive"
      })
    } finally {
      setUploading(false)
    }
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/shop"
          className="group mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Shop
        </Link>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Upload Prescription</h1>
          <p className="text-muted-foreground">Upload your prescription for {product.name}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Product Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                <AlertCircle className="h-6 w-6 text-amber-500" />
                <div>
                  <p className="font-medium text-gray-900">Prescription Required</p>
                  <p className="text-sm text-gray-600">This medication requires a valid prescription</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm text-muted-foreground">{product.description}</p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-2xl font-bold text-primary">E{product.price.toFixed(2)}</span>
                  <Badge variant="outline">{product.category}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upload Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                Upload Prescription
              </CardTitle>
              <CardDescription>
                Upload a clear photo or scan of your valid prescription
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* File Upload */}
                <div className="space-y-2">
                  <Label htmlFor="prescription">Prescription File</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag & drop your prescription file here, or click to browse
                    </p>
                    <Input
                      id="prescription"
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                      multiple
                    />
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => document.getElementById('prescription')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Select Files
                    </Button>
                  </div>
                  {files.length > 0 && (
                    <div className="mt-2 space-y-2">
                      <p className="text-sm font-medium">Selected files:</p>
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <FileText className="h-4 w-4" />
                          <span>{file.name}</span>
                          <span className="text-xs">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Additional Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional information for the pharmacist..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Requirements */}
                <div className="rounded-lg bg-muted p-4 space-y-2">
                  <p className="text-sm font-medium">Requirements:</p>
                  <ul className="text-sm text-muted-foreground space-y-1 pl-5 list-disc">
                    <li>Prescription must be from a licensed healthcare provider</li>
                    <li>Clear and readable image or scan</li>
                    <li>Must include your name and date</li>
                    <li>Medication name and dosage must match</li>
                    <li>Maximum file size: 10MB per file</li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={uploading || files.length === 0}
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Upload Prescription & Add to Cart
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}