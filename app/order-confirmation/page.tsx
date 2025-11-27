'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Package, Truck, Clock } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OrderService } from '@/lib/firebase/services/orders'
import { Order } from '@/lib/types/firebase'

function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  const orderId = searchParams?.get('orderId')
  const status = searchParams?.get('status')
  const amount = searchParams?.get('amount')

  useEffect(() => {
    const loadOrder = async () => {
      if (orderId) {
        try {
          const orderData = await OrderService.getOrderById(orderId)
          setOrder(orderData)
        } catch (error) {
          console.error('Error loading order:', error)
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }

    loadOrder()
  }, [orderId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-lg text-gray-600">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
            <CardDescription>
              Your order information and next steps
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-500">Order ID:</span>
                <p className="font-semibold">{order?.id || orderId || 'N/A'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Status:</span>
                <p className="font-semibold text-green-600 capitalize">
                  {order?.status || status || 'confirmed'}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Amount Paid:</span>
                <p className="font-semibold">
                  {order ? `GH₵ ${order.total.toFixed(2)}` : amount ? `GH₵ ${parseFloat(amount).toFixed(2)}` : 'N/A'}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Order Date:</span>
                <p className="font-semibold">
                  {order?.createdAt.toLocaleDateString() || new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Order Items */}
            {order?.items && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Order Items:</h4>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.product.name} x {item.quantity}</span>
                      <span>GH₵ {(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Order Processed</h3>
              <p className="text-sm text-gray-600">
                Your order is being prepared for shipment
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Truck className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Shipping Updates</h3>
              <p className="text-sm text-gray-600">
                You'll receive tracking information via email
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Delivery</h3>
              <p className="text-sm text-gray-600">
                Expected within 3-5 business days
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <a href="/">
              Continue Shopping
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/orders">
              View Order History
            </a>
          </Button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Need help? <a href="/contact" className="text-blue-600 hover:underline">Contact our support team</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  )
}