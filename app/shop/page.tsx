"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Pill, Search, ShoppingCart, Star, ArrowLeft, Plus, Check, 
  Package, Heart, AlertCircle, Upload, RefreshCw, Info, 
  Shield, Truck, Clock, ChevronRight, X, Eye, Users,
  Pill as PillIcon, Calendar, Scale, Droplets, Activity
} from "lucide-react"
import { useCart } from "@/lib/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/lib/types"
import { productService } from '@/lib/firebase/services/products'
import { ProductImage } from "@/components/ui/ProductImage"
import { UserNavActions } from "@/components/layout/UserNavActions"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [addedToCart, setAddedToCart] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [cartItemCount, setCartItemCount] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { addItem, getItemCount } = useCart()
  const { toast } = useToast()

  // Set mounted state when component mounts
  useEffect(() => {
    setMounted(true)
  }, [])

  // Update cart count when component mounts
  useEffect(() => {
    if (mounted) {
      setCartItemCount(getItemCount())
    }
  }, [mounted, getItemCount])

  // Load products from Firebase
  useEffect(() => {
    const loadProducts = async () => {
      try {
        console.log('🔄 Loading products...')
        setLoading(true)
        const productsData = await productService.getProducts()
        console.log('✅ Products loaded:', productsData?.length || 0)
        setProducts(productsData || [])
        setFilteredProducts(productsData || [])
      } catch (error: any) {
        console.error('❌ Error loading products:', error)
        toast({
          title: "Error",
          description: "Failed to load products. Please try again.",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [toast])

  useEffect(() => {
    let filtered = products

    // Filter by category
    if (selectedCategory !== "all") {
      const categoryMap: { [key: string]: string } = {
        'pain-relief': 'Pain Relief',
        'antibiotics': 'Antibiotics',
        'vitamins': 'Vitamins',
        'respiratory': 'Cold & Flu',
        'digestive-health': 'Digestive Health',
        'diabetes': 'Diabetes'
      }
      
      const actualCategory = categoryMap[selectedCategory] || selectedCategory
      filtered = filtered.filter((p) => 
        p.category?.toLowerCase() === actualCategory.toLowerCase()
      )
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredProducts(filtered)
  }, [searchQuery, selectedCategory, products])

  const handleAddToCart = (product: Product) => {
    if (product.requiresPrescription) {
      // Store product in session storage and redirect to prescription page
      sessionStorage.setItem('prescriptionProduct', JSON.stringify(product))
      window.location.href = '/prescription'
      return
    }

    if (product.stock === 0) {
      toast({
        title: "Out of Stock",
        description: `${product.name} is currently out of stock.`,
        variant: "destructive"
      })
      return
    }

    addItem(product, 1)
    setAddedToCart(product.id)
    setCartItemCount(getItemCount())
    setTimeout(() => setAddedToCart(null), 2000)

    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const handleViewProductDetails = (product: Product) => {
    setSelectedProduct(product)
    setIsDialogOpen(true)
  }

  const handleRetry = () => {
    setLoading(true)
    productService.getProducts()
      .then(data => {
        setProducts(data || [])
        setFilteredProducts(data || [])
      })
      .catch(err => {
        toast({
          title: "Error",
          description: "Failed to load products. Please check your connection.",
          variant: "destructive"
        })
      })
      .finally(() => setLoading(false))
  }

  // Format price in Emalangeni
  const formatPrice = (price: number) => {
    return `E${price?.toFixed(2) || '0.00'}`
  }

  const categories = [
    { id: "all", label: "All Products", icon: Package },
    { id: "pain-relief", label: "Pain Relief", icon: Pill },
    { id: "antibiotics", label: "Antibiotics", icon: Heart },
    { id: "vitamins", label: "Vitamins", icon: Star },
    { id: "respiratory", label: "Cold & Flu", icon: AlertCircle },
    { id: "digestive-health", label: "Digestive Health", icon: Heart },
    { id: "diabetes", label: "Diabetes", icon: Heart },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70">
                <Pill className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">PharmaCare</span>
            </Link>
            <nav className="flex items-center gap-2">
              <Link href="/cart">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <ShoppingCart className="h-4 w-4" />
                  <span className="hidden sm:inline">Cart</span>
                </Button>
              </Link>
              <UserNavActions />
            </nav>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
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
              <Link href="/cart">
                <Button variant="outline" className="relative gap-2 bg-transparent">
                  <ShoppingCart className="h-4 w-4" />
                  <span className="hidden sm:inline">Cart</span>
                  {mounted && cartItemCount > 0 && (
                    <Badge className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                      {cartItemCount}
                    </Badge>
                  )}
                </Button>
              </Link>
              <UserNavActions />
            </nav>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Link
            href="/"
            className="group mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-4xl font-bold">Shop Products</h1>
            <p className="text-muted-foreground">Browse our wide selection of quality medications and health products</p>
          </div>

          {/* Search and Filter Bar */}
          <div className="mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for medications, supplements, or health products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.id)}
                    className="gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {category.label}
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredProducts.length}</span> products
            </p>
            {products.length === 0 && !loading && (
              <Button variant="outline" size="sm" onClick={handleRetry} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            )}
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <Card className="py-16 text-center">
              <CardContent>
                <Package className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                <h3 className="mb-2 text-xl font-semibold">No products found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("all")
                  }}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="group flex flex-col overflow-hidden transition-all hover:shadow-xl hover:border-primary/50 cursor-pointer"
                  onClick={() => handleViewProductDetails(product)}
                >
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <ProductImage
                      src={product.imageUrl || (product as any).image || null}
                      alt={product.name}
                      className="h-full w-full transition-transform duration-300 group-hover:scale-110 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                    {product.requiresPrescription && (
                      <Badge className="absolute left-3 top-3 gap-1 bg-destructive/90 backdrop-blur">
                        <AlertCircle className="h-3 w-3" />
                        Prescription Required
                      </Badge>
                    )}
                    {product.stock < 20 && product.stock > 0 && (
                      <Badge variant="secondary" className="absolute right-3 top-3 backdrop-blur">
                        Low Stock
                      </Badge>
                    )}
                    {product.stock === 0 && (
                      <Badge variant="destructive" className="absolute right-3 top-3 backdrop-blur">
                        Out of Stock
                      </Badge>
                    )}
                    <Badge variant="outline" className="absolute left-3 bottom-3 backdrop-blur">
                      {product.category}
                    </Badge>
                    {/* View Details Badge */}
                    <div className="absolute right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Badge variant="secondary" className="gap-1">
                        <Eye className="h-3 w-3" />
                        View Details
                      </Badge>
                    </div>
                  </div>

                  {/* Product Info */}
                  <CardHeader className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="line-clamp-2 text-lg leading-tight">{product.name}</CardTitle>
                    </div>
                    <CardDescription className="line-clamp-2 text-sm leading-relaxed">
                      {product.description}
                    </CardDescription>
                  </CardHeader>

                  {/* Product Footer */}
                  <CardFooter className="flex-col gap-3 border-t pt-4">
                    <div className="flex w-full items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-primary">{formatPrice(product.price)}</p>
                        <p className="text-xs text-muted-foreground">
                          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">4.8</span>
                      </div>
                    </div>
                    
                    {/* Prescription Upload Button */}
                    {product.requiresPrescription ? (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAddToCart(product)
                        }}
                        className="w-full gap-2 transition-all bg-amber-500 hover:bg-amber-600 text-white"
                      >
                        <Upload className="h-4 w-4" />
                        Upload Prescription
                      </Button>
                    ) : (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAddToCart(product)
                        }}
                        disabled={product.stock === 0 || addedToCart === product.id}
                        className="w-full gap-2 transition-all"
                        variant={addedToCart === product.id ? "secondary" : "default"}
                      >
                        {addedToCart === product.id ? (
                          <>
                            <Check className="h-4 w-4" />
                            Added to Cart!
                          </>
                        ) : product.stock === 0 ? (
                          "Out of Stock"
                        ) : (
                          <>
                            <Plus className="h-4 w-4" />
                            Add to Cart
                          </>
                        )}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl flex items-center gap-2">
                  <PillIcon className="h-6 w-6 text-primary" />
                  {selectedProduct.name}
                </DialogTitle>
                <DialogDescription className="text-base">
                  {selectedProduct.category} • {selectedProduct.requiresPrescription ? 'Prescription Required' : 'Over-the-Counter'}
                </DialogDescription>
              </DialogHeader>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Product Image & Basic Info */}
                <div className="space-y-6">
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                    <ProductImage
                      src={selectedProduct.imageUrl || (selectedProduct as any).image || null}
                      alt={selectedProduct.name}
                      className="h-full w-full object-cover"
                    />
                    {selectedProduct.requiresPrescription && (
                      <Badge className="absolute left-3 top-3 gap-1 bg-destructive/90 backdrop-blur">
                        <AlertCircle className="h-3 w-3" />
                        Prescription Required
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-3xl font-bold text-primary">{formatPrice(selectedProduct.price)}</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedProduct.stock > 0 ? (
                            <span className="text-green-600">✓ {selectedProduct.stock} in stock</span>
                          ) : (
                            <span className="text-destructive">Out of stock</span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <div>
                          <p className="font-medium">4.8</p>
                          <p className="text-xs text-muted-foreground">(128 reviews)</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1 p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground">Category</p>
                        <p className="font-medium">{selectedProduct.category}</p>
                      </div>
                      <div className="space-y-1 p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground">Product ID</p>
                        <p className="font-medium">{selectedProduct.id || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Details & Actions */}
                <div className="space-y-6">
                  <Tabs defaultValue="details" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="details">Details</TabsTrigger>
                      <TabsTrigger value="usage">Usage</TabsTrigger>
                      <TabsTrigger value="safety">Safety</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="details" className="space-y-4 mt-4">
                      <div>
                        <h4 className="font-semibold mb-2">Description</h4>
                        <p className="text-muted-foreground">{selectedProduct.description}</p>
                      </div>
                      
                      {selectedProduct.requiresPrescription && (
                        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                          <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                            <div>
                              <h4 className="font-semibold text-amber-800">Prescription Required</h4>
                              <p className="text-sm text-amber-700 mt-1">
                                This medication requires a valid prescription from a licensed healthcare provider.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="space-y-3">
                        <h4 className="font-semibold">Key Features</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Shield className="h-4 w-4 text-green-600" />
                            <span>Quality Guaranteed</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-blue-600" />
                            <span>Fast-Acting</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="h-4 w-4 text-purple-600" />
                            <span>Doctor Recommended</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Truck className="h-4 w-4 text-amber-600" />
                            <span>Free Delivery</span>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="usage" className="space-y-4 mt-4">
                      <div className="space-y-3">
                        <h4 className="font-semibold">Dosage Instructions</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <ChevronRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>Take as directed by your healthcare provider</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <ChevronRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>Store at room temperature away from moisture and heat</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <ChevronRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>Keep out of reach of children</span>
                          </li>
                        </ul>
                      </div>
                    </TabsContent>

                    <TabsContent value="safety" className="space-y-4 mt-4">
                      <div className="space-y-3">
                        <h4 className="font-semibold">Safety Information</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                            <span>Consult your doctor before use if pregnant or breastfeeding</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                            <span>Do not exceed recommended dosage</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                            <span>Discontinue use and consult doctor if adverse reactions occur</span>
                          </li>
                        </ul>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <Separator />

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      {selectedProduct.requiresPrescription ? (
                        <Button
                          onClick={() => {
                            setIsDialogOpen(false)
                            handleAddToCart(selectedProduct)
                          }}
                          className="flex-1 gap-2 bg-amber-500 hover:bg-amber-600 text-white"
                        >
                          <Upload className="h-4 w-4" />
                          Upload Prescription
                        </Button>
                      ) : (
                        <Button
                          onClick={() => {
                            setIsDialogOpen(false)
                            handleAddToCart(selectedProduct)
                          }}
                          disabled={selectedProduct.stock === 0 || addedToCart === selectedProduct.id}
                          className="flex-1 gap-2"
                        >
                          {addedToCart === selectedProduct.id ? (
                            <>
                              <Check className="h-4 w-4" />
                              Added to Cart
                            </>
                          ) : selectedProduct.stock === 0 ? (
                            "Out of Stock"
                          ) : (
                            <>
                              <ShoppingCart className="h-4 w-4" />
                              Add to Cart
                            </>
                          )}
                        </Button>
                      )}
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-center text-muted-foreground">
                      Free delivery on orders over E200 • 30-day return policy
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}