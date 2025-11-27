'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Pill, 
  Truck,
  Store,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Home,
  Navigation,
  Clock,
  Loader2,
  Smartphone,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCart } from "@/lib/hooks/use-cart"
import { OrderService } from '@/lib/firebase/services/orders'
import { CartService } from '@/lib/firebase/services/cart'
import { toast } from "sonner"

type DeliveryMethod = 'delivery' | 'pickup'
type PaymentStatus = 'idle' | 'processing' | 'waiting_approval' | 'approved' | 'failed' | 'expired'

const STORE_LOCATIONS = [
  {
    id: 'mbabane',
    name: 'PharmaCare Mbabane',
    address: '123 Health Street, Medical District',
    city: 'Mbabane',
    region: 'Hhohho',
    phone: '+268 76 123 456',
    hours: 'Mon-Sat: 8AM-8PM, Sun: 9AM-4PM'
  }
]

// Currency configuration for Eswatini
const CURRENCY = {
  code: 'SZL',
  symbol: 'E',
  name: 'Lilangeni'
}

// Realistic MTN Mobile Money Simulation
class RealMTNMobileMoneySimulation {
  private static payments = new Map()

  static async initiateRealPayment(phoneNumber: string, amount: number, orderId: string) {
    const cleanNumber = phoneNumber.replace(/\s/g, '').replace('+268', '')
    
    if (!/^(76|77|78|79)\d{6}$/.test(cleanNumber)) {
      throw new Error('Invalid MTN Mobile Money number. Please use a valid Eswatini MTN number starting with 76, 77, 78, or 79.')
    }

    const transactionId = `MTN${Date.now()}${Math.random().toString(36).substr(2, 9)}`.toUpperCase()
    
    this.payments.set(transactionId, {
      phoneNumber: cleanNumber,
      amount,
      orderId,
      status: 'pending',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes expiry
    })

    console.log(`🔔 Payment request sent to +268 ${cleanNumber} for ${CURRENCY.symbol} ${amount}`)

    await new Promise(resolve => setTimeout(resolve, 2000))

    return {
      success: true,
      transactionId,
      status: 'pending',
      message: `Payment request successfully sent to +268 ${cleanNumber}. Please check your phone.`
    }
  }

  static async simulateUserApproval(transactionId: string): Promise<boolean> {
    const payment = this.payments.get(transactionId)
    if (!payment) {
      throw new Error('Payment request not found')
    }

    if (new Date() > payment.expiresAt) {
      payment.status = 'expired'
      this.payments.set(transactionId, payment)
      return false
    }

    console.log(`📱 User +268 ${payment.phoneNumber} is reviewing payment of ${CURRENCY.symbol} ${payment.amount}...`)
    
    // Simulate user taking time to approve (3-8 seconds)
    const approvalTime = 3000 + Math.random() * 5000
    await new Promise(resolve => setTimeout(resolve, approvalTime))

    // 85% success rate
    const isApproved = Math.random() > 0.15
    
    if (isApproved) {
      payment.status = 'completed'
      payment.completedAt = new Date()
      this.payments.set(transactionId, payment)
      console.log(`✅ Payment APPROVED by user +268 ${payment.phoneNumber}`)
      return true
    } else {
      payment.status = 'declined'
      this.payments.set(transactionId, payment)
      console.log(`❌ Payment DECLINED by user +268 ${payment.phoneNumber}`)
      return false
    }
  }
}

export function CheckoutPage() {
  const router = useRouter()
  const { items, clearCart, getTotal, getItemCount } = useCart()
  
  // Individual state fields for better performance
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('delivery')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [region, setRegion] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [deliveryInstructions, setDeliveryInstructions] = useState('')
  const [momoNumber, setMomoNumber] = useState('')
  
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle')
  const [transactionId, setTransactionId] = useState<string>('')
  const [countdown, setCountdown] = useState<number>(300) // 5 minutes

  // Calculate order summary
  const subtotal = getTotal()
  const shippingFee = deliveryMethod === 'delivery' ? (subtotal > 500 ? 0 : 25) : 0 // Adjusted for SZL
  const tax = subtotal * 0.15 // 15% VAT for Eswatini
  const total = subtotal + shippingFee + tax
  const itemCount = getItemCount()

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return `${CURRENCY.symbol} ${amount.toLocaleString()}`
  }

  const validateStep1 = (): boolean => {
    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !phone?.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required customer information.",
        variant: "destructive"
      })
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      })
      return false
    }

    return true
  }

  const validateStep2 = (): boolean => {
    if (!momoNumber?.trim()) {
      toast({
        title: "MTN Number Required",
        description: "Please enter your MTN Mobile Money number.",
        variant: "destructive"
      })
      return false
    }

    const cleanNumber = momoNumber.replace(/\s/g, '').replace('+268', '')
    const phoneRegex = /^(76|77|78|79)\d{6}$/
    
    if (!phoneRegex.test(cleanNumber)) {
      toast({
        title: "Invalid MTN Number",
        description: "Please enter a valid Eswatini MTN number (should be 8 digits starting with 76, 77, 78, or 79).",
        variant: "destructive"
      })
      return false
    }

    return true
  }

  // Process payment and wait for approval
  const processPaymentAndWaitForApproval = async (): Promise<boolean> => {
    try {
      setPaymentStatus('processing')
      
      // Step 1: Initiate payment
      const initiationResult = await RealMTNMobileMoneySimulation.initiateRealPayment(
        momoNumber,
        total,
        `PC-${Date.now()}`
      )

      if (!initiationResult.success) {
        throw new Error(initiationResult.message || 'Failed to initiate payment request')
      }

      setTransactionId(initiationResult.transactionId)
      setPaymentStatus('waiting_approval')
      setCountdown(300)

      toast({
        title: "📱 Payment Request Sent!",
        description: `We've sent a payment request to ${momoNumber}. Please check your phone now.`,
        duration: 5000,
      })

      // Step 2: Wait for user approval
      console.log('⏳ Waiting for user to approve payment...')
      
      const paymentApproved = await RealMTNMobileMoneySimulation.simulateUserApproval(initiationResult.transactionId)
      
      if (paymentApproved) {
        setPaymentStatus('approved')
        
        toast({
          title: "✅ Payment Approved!",
          description: "Thank you! Your payment has been confirmed via MTN Mobile Money.",
          duration: 4000,
        })
        
        return true
      } else {
        setPaymentStatus('failed')
        
        toast({
          title: "❌ Payment Not Completed",
          description: "Payment was declined or timed out. Please try again.",
          variant: "destructive"
        })
        
        return false
      }

    } catch (error: any) {
      console.error('Payment processing error:', error)
      setPaymentStatus('failed')
      
      toast({
        title: "Payment Failed",
        description: error.message || "There was an error processing your payment. Please try again.",
        variant: "destructive"
      })
      
      return false
    }
  }

  const handleSubmitOrder = async () => {
    if (!validateStep1() || !validateStep2()) {
      return
    }

    // For now, we'll use a mock user ID since auth might not be fully implemented
    // In production, you should get this from your auth context
    const mockUserId = 'user-' + Date.now()

    // Process payment and wait for approval
    const paymentSuccess = await processPaymentAndWaitForApproval()

    if (!paymentSuccess) {
      return
    }

    try {
      // Create order in Firebase
      const selectedStoreData = STORE_LOCATIONS.find(store => store.id === 'mbabane')
      const orderData = {
        userId: mockUserId,
        items: items,
        total: total,
        status: 'confirmed' as const,
        paymentStatus: 'completed' as const,
        paymentMethod: 'mtn_momo' as const,
        shippingAddress: deliveryMethod === 'delivery' ? {
          address,
          city,
          region,
          postalCode,
          instructions: deliveryInstructions
        } : undefined,
        pickupStore: deliveryMethod === 'pickup' ? selectedStoreData : undefined,
        customerInfo: {
          firstName,
          lastName,
          email,
          phone
        },
        momoNumber: momoNumber,
        transactionId: transactionId,
        subtotal: subtotal,
        shippingFee: shippingFee,
        tax: tax,
        currency: CURRENCY.code
      }

      // Create order in Firebase
      const orderId = await OrderService.createOrder(orderData)
      
      console.log('🎉 Order created in Firebase with ID:', orderId)

      // Clear cart from local storage
      clearCart()
      
      toast({
        title: "🎊 Order Confirmed!",
        description: `Your order has been placed successfully. Order ID: ${orderId}`,
      })

      // Redirect to confirmation page
      setTimeout(() => {
        router.push(`/order-confirmation?orderId=${orderId}&status=confirmed&amount=${total}`)
      }, 2000)

    } catch (error: any) {
      console.error('Error creating order:', error)
      toast({
        title: "Order Failed",
        description: error.message || "There was an error creating your order. Please try again.",
        variant: "destructive"
      })
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Countdown timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (paymentStatus === 'waiting_approval' && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval)
            setPaymentStatus('expired')
            
            toast({
              title: "⏰ Payment Expired",
              description: "The payment request has expired. Please try again.",
              variant: "destructive"
            })
            
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [paymentStatus, countdown])

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Add some products to your cart before checkout.</p>
          <Link href="/shop">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
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
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Cart
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">Checkout</h1>
            <p className="text-muted-foreground">Complete your purchase securely with MTN Mobile Money</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Complete Your Order</CardTitle>
                  <CardDescription>Enter your details and complete payment with MTN Mobile Money</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Delivery Method */}
                    <div>
                      <h3 className="text-xl font-bold mb-4">Delivery Method</h3>
                      <RadioGroup 
                        value={deliveryMethod} 
                        onValueChange={(value: DeliveryMethod) => setDeliveryMethod(value)}
                        className="grid grid-cols-1 gap-4 md:grid-cols-2"
                      >
                        <Card className={`cursor-pointer border-2 transition-all ${
                          deliveryMethod === 'delivery' ? 'border-primary bg-primary/5' : 'border-muted'
                        }`}>
                          <label htmlFor="delivery" className="cursor-pointer block">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3">
                                <RadioGroupItem value="delivery" id="delivery" className="sr-only" />
                                <Truck className="h-8 w-8 text-primary" />
                                <div className="flex-1">
                                  <div className="text-base font-semibold cursor-pointer">
                                    Home Delivery
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    Get your medications delivered to your doorstep
                                  </p>
                                  <div className="flex items-center gap-4 mt-2 text-sm">
                                    <span className="text-green-600 font-semibold">
                                      {shippingFee === 0 ? 'FREE' : formatCurrency(shippingFee)}
                                    </span>
                                    <span className="text-muted-foreground">1-2 business days</span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </label>
                        </Card>

                        <Card className={`cursor-pointer border-2 transition-all ${
                          deliveryMethod === 'pickup' ? 'border-primary bg-primary/5' : 'border-muted'
                        }`}>
                          <label htmlFor="pickup" className="cursor-pointer block">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3">
                                <RadioGroupItem value="pickup" id="pickup" className="sr-only" />
                                <Store className="h-8 w-8 text-primary" />
                                <div className="flex-1">
                                  <div className="text-base font-semibold cursor-pointer">
                                    Store Pickup
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    Pick up your order from our nearest pharmacy
                                  </p>
                                  <div className="flex items-center gap-4 mt-2 text-sm">
                                    <span className="text-green-600 font-semibold">FREE</span>
                                    <span className="text-muted-foreground">Ready in 2 hours</span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </label>
                        </Card>
                      </RadioGroup>
                    </div>

                    {/* Customer Information */}
                    <div>
                      <h3 className="text-xl font-bold mb-4">Customer Information</h3>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Enter your first name"
                            disabled={paymentStatus !== 'idle'}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Enter your last name"
                            disabled={paymentStatus !== 'idle'}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              id="email"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="your.email@example.com"
                              className="pl-10"
                              disabled={paymentStatus !== 'idle'}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number *</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              id="phone"
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="+268 76 123 456"
                              className="pl-10"
                              disabled={paymentStatus !== 'idle'}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Conditional Address Fields */}
                    {deliveryMethod === 'delivery' && (
                      <div>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                          <MapPin className="h-5 w-5" />
                          Delivery Address
                        </h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="address">Street Address *</Label>
                            <div className="relative">
                              <Home className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                              <Input
                                id="address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Enter your street address"
                                className="pl-10"
                                disabled={paymentStatus !== 'idle'}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="city">City *</Label>
                              <Input
                                id="city"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="City"
                                disabled={paymentStatus !== 'idle'}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="region">Region *</Label>
                              <Select 
                                value={region} 
                                onValueChange={setRegion}
                                disabled={paymentStatus !== 'idle'}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select region" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="hhohho">Hhohho</SelectItem>
                                  <SelectItem value="manzini">Manzini</SelectItem>
                                  <SelectItem value="shiselweni">Shiselweni</SelectItem>
                                  <SelectItem value="lubombo">Lubombo</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="deliveryInstructions">Delivery Instructions (Optional)</Label>
                            <Textarea
                              id="deliveryInstructions"
                              value={deliveryInstructions}
                              onChange={(e) => setDeliveryInstructions(e.target.value)}
                              placeholder="e.g., Leave at front desk, Call before delivery, etc."
                              rows={3}
                              disabled={paymentStatus !== 'idle'}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {deliveryMethod === 'pickup' && (
                      <div>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                          <Store className="h-5 w-5" />
                          Pickup Location
                        </h3>
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                <Navigation className="h-6 w-6 text-primary" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold">PharmaCare Mbabane</h4>
                                <p className="text-sm text-muted-foreground mb-2">
                                  123 Health Street, Medical District<br />
                                  Mbabane, Hhohho Region
                                </p>
                                <div className="flex items-center gap-4 text-sm">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span>Mon-Sat: 8AM-8PM</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span>+268 76 123 456</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}

                    {/* Payment Information */}
                    <div>
                      <h3 className="text-xl font-bold mb-4">Payment Information</h3>
                      <Card className="border-2 border-primary bg-primary/5">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                              <CreditCard className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold text-lg">MTN Mobile Money</h4>
                                <Badge className="bg-green-100 text-green-700">Live Simulation</Badge>
                              </div>
                              <p className="text-muted-foreground text-sm">
                                Realistic payment simulation - feels like real MTN Mobile Money
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="momoNumber">MTN Mobile Money Number *</Label>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                  id="momoNumber"
                                  value={momoNumber}
                                  onChange={(e) => setMomoNumber(e.target.value)}
                                  placeholder="76 123 456 or 7X XXX XXX"
                                  className="pl-10"
                                  disabled={paymentStatus !== 'idle'}
                                />
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Enter your MTN number (8 digits starting with 76, 77, 78, or 79)
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Payment Status Display */}
                    {paymentStatus === 'processing' && (
                      <Card className="border-blue-200 bg-blue-50">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                            <div>
                              <h4 className="font-bold text-blue-800 mb-2">Processing Payment Request</h4>
                              <p className="text-blue-700">
                                Preparing to send payment request to your phone...
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {paymentStatus === 'waiting_approval' && (
                      <Card className="border-blue-200 bg-blue-50">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                              <Smartphone className="h-6 w-6 text-blue-600 animate-pulse" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-blue-800 mb-2">📱 Waiting for Your Approval</h4>
                              <p className="text-blue-700 mb-3">
                                <strong>Payment request sent to {momoNumber}</strong>
                              </p>
                              
                              <div className="bg-white p-3 rounded border mb-3">
                                <p className="text-sm font-semibold text-gray-800">Payment Details:</p>
                                <div className="text-sm text-gray-700 mt-2 space-y-1">
                                  <div className="flex justify-between">
                                    <span>Amount:</span>
                                    <span className="font-semibold">{formatCurrency(total)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Merchant:</span>
                                    <span className="font-semibold">PharmaCare Eswatini</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                                  <span className="text-sm text-blue-600">Waiting for you to approve on your phone...</span>
                                </div>
                                <div className="text-sm text-orange-600 font-semibold">
                                  Expires in: {formatTime(countdown)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {paymentStatus === 'approved' && (
                      <Card className="border-green-200 bg-green-50">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                            <div>
                              <h4 className="font-bold text-green-800 mb-2">✅ Payment Approved!</h4>
                              <p className="text-green-700">
                                Thank you! Your payment has been confirmed. Your order is now being processed.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {paymentStatus === 'failed' && (
                      <Card className="border-red-200 bg-red-50">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <AlertCircle className="h-8 w-8 text-red-600" />
                            <div>
                              <h4 className="font-bold text-red-800 mb-2">❌ Payment Not Completed</h4>
                              <p className="text-red-700">
                                Payment was declined or not completed. Please try again.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {paymentStatus === 'expired' && (
                      <Card className="border-orange-200 bg-orange-50">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <AlertCircle className="h-8 w-8 text-orange-600" />
                            <div>
                              <h4 className="font-bold text-orange-800 mb-2">⏰ Payment Expired</h4>
                              <p className="text-orange-700">
                                The payment request has expired. Please initiate a new payment.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-6">
                  <Link href="/cart">
                    <Button variant="outline" disabled={paymentStatus !== 'idle' && paymentStatus !== 'failed' && paymentStatus !== 'expired'}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Cart
                    </Button>
                  </Link>
                  
                  <Button 
                    onClick={handleSubmitOrder}
                    disabled={
                      paymentStatus === 'processing' || 
                      paymentStatus === 'waiting_approval' || 
                      paymentStatus === 'approved'
                    }
                    className="gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                  >
                    {paymentStatus === 'processing' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending Request...
                      </>
                    ) : paymentStatus === 'waiting_approval' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Waiting for Approval...
                      </>
                    ) : paymentStatus === 'approved' ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Order Confirmed!
                      </>
                    ) : paymentStatus === 'failed' || paymentStatus === 'expired' ? (
                      <>
                        <CreditCard className="h-4 w-4" />
                        Try Again
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4" />
                        Pay with MTN Mobile Money
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
                      <span className="font-medium">{formatCurrency(subtotal)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">
                        {shippingFee === 0 ? 'FREE' : formatCurrency(shippingFee)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax (VAT 15%)</span>
                      <span className="font-medium">{formatCurrency(tax)}</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">{formatCurrency(total)}</span>
                    </div>
                  </div>

                  {/* Payment Status Badge */}
                  <div className="flex items-center gap-2 text-xs">
                    <div className={`flex h-6 w-6 items-center justify-center rounded-full ${
                      paymentStatus === 'approved' ? 'bg-green-100' : 
                      paymentStatus === 'waiting_approval' ? 'bg-blue-100' : 
                      paymentStatus === 'failed' || paymentStatus === 'expired' ? 'bg-red-100' : 'bg-yellow-100'
                    }`}>
                      {paymentStatus === 'approved' ? (
                        <CheckCircle2 className="h-3 w-3 text-green-600" />
                      ) : paymentStatus === 'waiting_approval' ? (
                        <Loader2 className="h-3 w-3 animate-spin text-blue-600" />
                      ) : paymentStatus === 'failed' || paymentStatus === 'expired' ? (
                        <AlertCircle className="h-3 w-3 text-red-600" />
                      ) : (
                        <CreditCard className="h-3 w-3 text-yellow-600" />
                      )}
                    </div>
                    <span className={
                      paymentStatus === 'approved' ? 'text-green-600' : 
                      paymentStatus === 'waiting_approval' ? 'text-blue-600' : 
                      paymentStatus === 'failed' || paymentStatus === 'expired' ? 'text-red-600' : 'text-muted-foreground'
                    }>
                      {paymentStatus === 'approved' ? 'Payment Approved' : 
                       paymentStatus === 'waiting_approval' ? 'Waiting for Approval' : 
                       paymentStatus === 'failed' ? 'Payment Failed' : 
                       paymentStatus === 'expired' ? 'Payment Expired' : 
                       'Ready for Payment'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}