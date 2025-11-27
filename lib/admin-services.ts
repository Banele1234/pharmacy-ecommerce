// lib/admin-services.ts
import { 
    collection, 
    doc, 
    getDocs, 
    addDoc, 
    updateDoc, 
    deleteDoc,
    query, 
    where, 
    orderBy, 
    writeBatch,
    getCountFromServer,
    DocumentData
  } from 'firebase/firestore'
  import { db } from '@/lib/firebase/config' // Correct import path
  
  // Types
  export interface Product {
    id: string
    name: string
    description: string
    price: number
    category: string
    stock: number
    image?: string
    prescriptionRequired: boolean
    createdAt: Date
    updatedAt: Date
  }
  
  export interface Order {
    id: string
    customerName: string
    customerEmail: string
    customerPhone?: string
    items: OrderItem[]
    total: number
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
    shippingAddress?: {
      street: string
      city: string
      state: string
      zipCode: string
      country: string
    }
    createdAt: Date
    updatedAt: Date
  }
  
  export interface OrderItem {
    productId: string
    productName: string
    quantity: number
    price: number
  }
  
  export interface Customer {
    id: string
    name: string
    email: string
    phone?: string
    createdAt: Date
    totalOrders: number
    totalSpent: number
    lastOrderDate?: Date
  }
  
  export interface DashboardStats {
    totalProducts: number
    totalOrders: number
    totalCustomers: number
    lowStockItems: number
    pendingOrders: number
    revenueThisMonth: number
  }
  
  // Database Status
  export const checkDatabaseConnection = async (): Promise<{ connected: boolean; productCount: number }> => {
    try {
      const productsCount = await getCountFromServer(collection(db, 'products'))
      return {
        connected: true,
        productCount: productsCount.data().count
      }
    } catch (error) {
      console.error('Database connection check failed:', error)
      return {
        connected: false,
        productCount: 0
      }
    }
  }
  
  // Product Management
  export const getProducts = async (filters?: {
    category?: string
    stockStatus?: 'all' | 'low' | 'out' | 'in'
    search?: string
  }): Promise<Product[]> => {
    try {
      let q = query(collection(db, 'products'))
  
      if (filters?.category && filters.category !== 'all') {
        q = query(q, where('category', '==', filters.category))
      }
  
      if (filters?.stockStatus === 'low') {
        q = query(q, where('stock', '<=', 10))
      } else if (filters?.stockStatus === 'out') {
        q = query(q, where('stock', '==', 0))
      } else if (filters?.stockStatus === 'in') {
        q = query(q, where('stock', '>', 0))
      }
  
      if (filters?.search) {
        q = query(q, where('name', '>=', filters.search), where('name', '<=', filters.search + '\uf8ff'))
      }
  
      q = query(q, orderBy('name'))
  
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Product[]
    } catch (error) {
      console.error('Error fetching products:', error)
      throw error
    }
  }
  
  export const getProduct = async (productId: string): Promise<Product | null> => {
    try {
      const productDoc = await getDocs(collection(db, 'products'))
      const product = productDoc.docs.find(d => d.id === productId)
      
      if (product?.exists()) {
        return {
          id: product.id,
          ...product.data(),
          createdAt: product.data().createdAt?.toDate(),
          updatedAt: product.data().updatedAt?.toDate()
        } as Product
      }
      return null
    } catch (error) {
      console.error('Error fetching product:', error)
      throw error
    }
  }
  
  export const createProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, 'products'), {
        ...productData,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      return docRef.id
    } catch (error) {
      console.error('Error creating product:', error)
      throw error
    }
  }
  
  export const updateProduct = async (productId: string, productData: Partial<Product>): Promise<void> => {
    try {
      await updateDoc(doc(db, 'products', productId), {
        ...productData,
        updatedAt: new Date()
      })
    } catch (error) {
      console.error('Error updating product:', error)
      throw error
    }
  }
  
  export const deleteProduct = async (productId: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'products', productId))
    } catch (error) {
      console.error('Error deleting product:', error)
      throw error
    }
  }
  
  // Bulk Operations
  export const bulkUpdateProducts = async (productIds: string[], updates: Partial<Product>): Promise<void> => {
    try {
      const batch = writeBatch(db)
      
      productIds.forEach(productId => {
        const productRef = doc(db, 'products', productId)
        batch.update(productRef, {
          ...updates,
          updatedAt: new Date()
        })
      })
      
      await batch.commit()
    } catch (error) {
      console.error('Error in bulk update:', error)
      throw error
    }
  }
  
  export const bulkDeleteProducts = async (productIds: string[]): Promise<void> => {
    try {
      const batch = writeBatch(db)
      
      productIds.forEach(productId => {
        const productRef = doc(db, 'products', productId)
        batch.delete(productRef)
      })
      
      await batch.commit()
    } catch (error) {
      console.error('Error in bulk delete:', error)
      throw error
    }
  }
  
  // Inventory Management
  export const getLowStockProducts = async (threshold: number = 10): Promise<Product[]> => {
    try {
      const q = query(
        collection(db, 'products'), 
        where('stock', '<=', threshold),
        orderBy('stock', 'asc')
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Product[]
    } catch (error) {
      console.error('Error fetching low stock products:', error)
      throw error
    }
  }
  
  export const updateStock = async (productId: string, newStock: number): Promise<void> => {
    try {
      await updateDoc(doc(db, 'products', productId), {
        stock: newStock,
        updatedAt: new Date()
      })
    } catch (error) {
      console.error('Error updating stock:', error)
      throw error
    }
  }
  
  // Categories
  export const getCategories = async (): Promise<string[]> => {
    try {
      const snapshot = await getDocs(collection(db, 'products'))
      const categories = new Set<string>()
      
      snapshot.docs.forEach(doc => {
        const category = doc.data().category
        if (category) {
          categories.add(category)
        }
      })
      
      return Array.from(categories).sort()
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw error
    }
  }
  
  // Orders Management
  export const getOrders = async (status?: string): Promise<Order[]> => {
    try {
      let q = query(collection(db, 'orders'))
      
      if (status && status !== 'all') {
        q = query(q, where('status', '==', status))
      }
      
      q = query(q, orderBy('createdAt', 'desc'))
      
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Order[]
    } catch (error) {
      console.error('Error fetching orders:', error)
      throw error
    }
  }
  
  export const getOrder = async (orderId: string): Promise<Order | null> => {
    try {
      const ordersSnapshot = await getDocs(collection(db, 'orders'))
      const orderDoc = ordersSnapshot.docs.find(doc => doc.id === orderId)
      
      if (orderDoc?.exists()) {
        return {
          id: orderDoc.id,
          ...orderDoc.data(),
          createdAt: orderDoc.data().createdAt?.toDate(),
          updatedAt: orderDoc.data().updatedAt?.toDate()
        } as Order
      }
      return null
    } catch (error) {
      console.error('Error fetching order:', error)
      throw error
    }
  }
  
  export const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<void> => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { 
        status,
        updatedAt: new Date()
      })
    } catch (error) {
      console.error('Error updating order status:', error)
      throw error
    }
  }
  
  // Customers Management
  export const getCustomers = async (): Promise<Customer[]> => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'))
      const customers: Customer[] = []
      
      // Get all orders to calculate customer stats
      const ordersSnapshot = await getDocs(collection(db, 'orders'))
      const ordersByCustomer: { [email: string]: { count: number, total: number, lastOrder: Date } } = {}
      
      ordersSnapshot.docs.forEach(doc => {
        const order = doc.data()
        const email = order.customerEmail
        if (!ordersByCustomer[email]) {
          ordersByCustomer[email] = { count: 0, total: 0, lastOrder: new Date(0) }
        }
        ordersByCustomer[email].count += 1
        ordersByCustomer[email].total += order.total || 0
        
        const orderDate = order.createdAt?.toDate() || new Date()
        if (orderDate > ordersByCustomer[email].lastOrder) {
          ordersByCustomer[email].lastOrder = orderDate
        }
      })
      
      usersSnapshot.docs.forEach(doc => {
        const userData = doc.data()
        const customerStats = ordersByCustomer[userData.email] || { count: 0, total: 0, lastOrder: undefined }
        
        customers.push({
          id: doc.id,
          name: userData.displayName || userData.email,
          email: userData.email,
          phone: userData.phone || '',
          createdAt: userData.createdAt?.toDate() || new Date(),
          totalOrders: customerStats.count,
          totalSpent: customerStats.total,
          lastOrderDate: customerStats.lastOrder
        })
      })
      
      return customers.sort((a, b) => b.totalSpent - a.totalSpent)
    } catch (error) {
      console.error('Error fetching customers:', error)
      throw error
    }
  }
  
  // Dashboard Stats
  export const getDashboardStats = async (): Promise<DashboardStats> => {
    try {
      const [
        productsCount,
        ordersCount,
        customersCount,
        lowStockCount,
        pendingOrdersCount
      ] = await Promise.all([
        getCountFromServer(collection(db, 'products')),
        getCountFromServer(collection(db, 'orders')),
        getCountFromServer(collection(db, 'users')),
        getCountFromServer(query(collection(db, 'products'), where('stock', '<=', 10))),
        getCountFromServer(query(collection(db, 'orders'), where('status', '==', 'pending')))
      ])
  
      // Calculate revenue for current month
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const ordersThisMonthQuery = query(
        collection(db, 'orders'),
        where('createdAt', '>=', startOfMonth),
        where('status', 'in', ['confirmed', 'shipped', 'delivered'])
      )
      
      const ordersThisMonthSnapshot = await getDocs(ordersThisMonthQuery)
      let revenueThisMonth = 0
      ordersThisMonthSnapshot.docs.forEach(doc => {
        revenueThisMonth += doc.data().total || 0
      })
  
      return {
        totalProducts: productsCount.data().count,
        totalOrders: ordersCount.data().count,
        totalCustomers: customersCount.data().count,
        lowStockItems: lowStockCount.data().count,
        pendingOrders: pendingOrdersCount.data().count,
        revenueThisMonth
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      // Return default stats if there's an error
      return {
        totalProducts: 0,
        totalOrders: 0,
        totalCustomers: 0,
        lowStockItems: 0,
        pendingOrders: 0,
        revenueThisMonth: 0
      }
    }
  }
  
  // Utility Functions
  export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }
  
  export const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
  }
  
  export const getStockStatus = (stock: number): { label: string; variant: 'default' | 'secondary' | 'destructive'; color: string } => {
    if (stock === 0) {
      return { label: 'Out of Stock', variant: 'destructive', color: 'text-red-600' }
    }
    if (stock <= 10) {
      return { label: 'Low Stock', variant: 'secondary', color: 'text-amber-600' }
    }
    return { label: 'In Stock', variant: 'default', color: 'text-green-600' }
  }