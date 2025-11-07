export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  imageUrl: string
  stock: number
  requiresPrescription: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CartItem {
  productId: string
  product: Product
  quantity: number
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: "pending" | "processing" | "completed" | "cancelled"
  paymentStatus: "pending" | "paid" | "failed"
  paymentMethod: "mtn_momo"
  shippingAddress: Address
  prescriptionUrl?: string
  createdAt: Date
  updatedAt: Date
}

export interface Address {
  fullName: string
  phone: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface User {
  id: string
  email: string
  displayName: string
  phone?: string
  role: "customer" | "admin"
  createdAt: Date
}

export interface Prescription {
  id: string
  userId: string
  orderId?: string
  imageUrl: string
  status: "pending" | "approved" | "rejected"
  notes?: string
  createdAt: Date
  updatedAt: Date
}
