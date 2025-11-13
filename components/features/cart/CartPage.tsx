// components/features/cart/CartPage.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  Pill, 
  Shield,
  Truck,
  Clock,
  AlertCircle,
  Heart,
  Package
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"

export function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotal, getItemCount } = useCart()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Calculate prices using your actual hook functions
  const subtotal = getTotal()
  const shippingFee = subtotal > 50000 ? 0 : 2500 // Free shipping over 50,000 FCFA
  const tax = subtotal * 0.18 // 18% VAT
  const total = subtotal + shippingFee + tax
  const itemCount = getItemCount()

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    updateQuantity(productId, newQuantity)
  }

  const handleRemoveItem = (productId: string, productName: string) => {
    removeItem(productId)
    toast({
      title: "Item removed",
      description: `${productName} has been removed from your cart.`,
    })
  }

  const handleClearCart = () => {
    if (items.length === 0) return
    
    clearCart()
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    })
  }

  const handleCheckout = async () => {
    setIsLoading(true)
    try {
      // Simulate checkout process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // TODO: Integrate with payment system
      console.log('Proceeding to checkout with items:', items)
      
      toast({
        title: "Proceeding to checkout",
        description: "Redirecting to secure payment...",
      })
    } catch (error) {
      toast({
        title: "Checkout failed",
        description: "Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const TrustBadges = () => (
    <div className="flex flex-wrap items-center justify-center gap-6 py-4 text-muted-foreground">
      <div className="flex items-center gap-2">
        <Shield className="h-4 w-4 text-green-600" />
        <span className="text-xs">Secure Payment</span>
      </div>
      <div className="flex items-center gap-2">
        <Truck className="h-4 w-4 text-blue-600" />
        <span className="text-xs">Fast Delivery</span>
      </div>
      <div className="flex items-center gap-2">
        <Package className="h-4 w-4 text-purple-600" />
        <span className="text-xs">Genuine Products</span>
      </div>
    </div>
  )

  if (items.length === 0) {
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
              <Link href="/shop">
                <Button variant="outline">Continue Shopping</Button>
              </Link>
            </nav>
          </div>
        </header>

        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-md text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                <ShoppingCart className="h-12 w-12 text-muted-foreground" />
              </div>
            </div>
            
            <h1 className="mb-4 text-3xl font-bold">Your cart is empty</h1>
            <p className="mb-8 text-muted-foreground">
              Looks like you haven't added any products to your cart yet.
            </p>
            
            <div className="space-y-4">
              <Link href="/shop">
                <Button size="lg" className="w-full gap-2">
                  <Package className="h-5 w-5" />
                  Start Shopping
                </Button>
              </Link>
              
              <Link href="/">
                <Button variant="outline" className="w-full gap-2">
                  <ArrowLeft className="h-5 w-5" />
                  Back to Home
                </Button>
              </Link>
            </div>

            <TrustBadges />
          </div>
        </div>
      </div>
    )
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
            <Link href="/shop">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-6xl">
          {/* Page Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Shopping Cart</h1>
              <p className="text-muted-foreground">
                Review your items and proceed to checkout
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="gap-2">
                <ShoppingCart className="h-3 w-3" />
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </Badge>
              {items.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearCart}
                  className="gap-2 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear Cart
                </Button>
              )}
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Cart Items
                  </CardTitle>
                  <CardDescription>
                    Manage your selected products
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {items.map((item) => (
                      <div key={item.productId} className="flex gap-4 p-6">
                        {/* Product Image */}
                        <div className="relative flex-shrink-0">
                          <div className="h-20 w-20 overflow-hidden rounded-lg border bg-muted">
                            <img
                              src={item.product.imageUrl || "/placeholder.svg"}
                              alt={item.product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          {item.product.requiresPrescription && (
                            <Badge className="absolute -left-1 -top-1 gap-1 bg-destructive/90 text-xs">
                              <AlertCircle className="h-2 w-2" />
                              RX
                            </Badge>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex flex-1 flex-col gap-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold leading-tight">{item.product.name}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {item.product.description}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveItem(item.productId, item.product.name)}
                              className="h-8 w-8 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              {/* Quantity Controls */}
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center text-sm font-medium">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                                  disabled={item.quantity >= item.product.stock}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>

                              {item.product.stock < 10 && item.quantity < item.product.stock && (
                                <Badge variant="outline" className="text-xs text-amber-600">
                                  Only {item.product.stock} left
                                </Badge>
                              )}
                            </div>

                            <div className="text-right">
                              <p className="text-lg font-bold text-primary">
                                {(item.product.price * item.quantity).toLocaleString()} FCFA
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {item.product.price.toLocaleString()} FCFA each
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Trust Features */}
              <Card className="mt-6">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                        <Shield className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Secure & Trusted</h4>
                        <p className="text-sm text-muted-foreground">HIPAA compliant</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                        <Truck className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Fast Delivery</h4>
                        <p className="text-sm text-muted-foreground">Same-day available</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                        <Clock className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">24/7 Support</h4>
                        <p className="text-sm text-muted-foreground">Expert pharmacists</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order Summary
                  </CardTitle>
                  <CardDescription>
                    Review your order details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Details */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
                      <span className="font-medium">{subtotal.toLocaleString()} FCFA</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">
                        {shippingFee === 0 ? (
                          <Badge variant="secondary" className="text-green-600">
                            FREE
                          </Badge>
                        ) : (
                          `${shippingFee.toLocaleString()} FCFA`
                        )}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax (VAT 18%)</span>
                      <span className="font-medium">{tax.toLocaleString()} FCFA</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">{total.toLocaleString()} FCFA</span>
                    </div>

                    {shippingFee > 0 && (
                      <div className="rounded-lg bg-muted p-3 text-center">
                        <p className="text-sm">
                          Add {(50000 - subtotal).toLocaleString()} FCFA more for{' '}
                          <strong className="text-green-600">FREE shipping</strong>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Prescription Warning */}
                  {items.some(item => item.product.requiresPrescription) && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-amber-800">Prescription Required</h4>
                          <p className="text-sm text-amber-700">
                            Some items in your cart require a valid prescription. 
                            You'll need to upload your prescription during checkout.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Checkout Button */}
                  <Button
                    onClick={handleCheckout}
                    disabled={isLoading}
                    size="lg"
                    className="w-full gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-5 w-5" />
                        Proceed to Checkout
                      </>
                    )}
                  </Button>

                  {/* Security Notice */}
                  <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                    <div className="flex items-center gap-2 text-sm text-green-800">
                      <Shield className="h-4 w-4" />
                      <span>Your payment is secure and encrypted</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Continue Shopping */}
              <Card className="mt-6">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Need more items?</h4>
                    <Link href="/shop">
                      <Button variant="outline" className="w-full gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Continue Shopping
                      </Button>
                    </Link>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Heart className="h-3 w-3" />
                      <span>Trusted by 50,000+ customers</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <TrustBadges />
        </div>
      </div>
    </div>
  )
}