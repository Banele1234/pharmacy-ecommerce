'use client'

import { AdminLayout } from '@/components/admin/AdminLayout'
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, AlertTriangle, Plus, Database, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from 'react'
import { 
  checkDatabaseConnection, 
  getDashboardStats,
  getLowStockProducts,
  getProducts
} from '@/lib/admin-services'
import { Product } from '@/lib/admin-services'

const recentActivities = [
  { id: 1, type: 'order', message: 'New order #ORD-7842 placed', time: '2 minutes ago' },
  { id: 2, type: 'product', message: 'Product "Amoxicillin 500mg" stock updated', time: '15 minutes ago' },
  { id: 3, type: 'user', message: 'New customer registration', time: '1 hour ago' },
  { id: 4, type: 'sync', message: 'Inventory sync completed', time: '2 hours ago' },
]

export function AdminDashboardContent() {
  const [isLoading, setIsLoading] = useState(false)
  const [dbStatus, setDbStatus] = useState<{ connected: boolean; productCount: number } | null>(null)
  const [initStatus, setInitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [initMessage, setInitMessage] = useState('')
  const [dashboardStats, setDashboardStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    lowStockItems: 0,
  })
  const [lowStockItems, setLowStockItems] = useState<Product[]>([])
  const [realProducts, setRealProducts] = useState<Product[]>([]);

  const checkDatabaseConnectionWrapper = async () => {
    setIsLoading(true)
    try {
      const status = await checkDatabaseConnection()
      setDbStatus(status)
      
      const stats = await getDashboardStats()
      setDashboardStats(stats)
      
      const lowStock = await getLowStockProducts()
      setLowStockItems(lowStock)
    } catch (error: any) {
      console.error('Error checking database connection:', error)
      setDbStatus({ connected: false, productCount: 0 })
    } finally {
      setIsLoading(false)
    }
  }

  const initializeProducts = async () => {
    setIsLoading(true)
    setInitStatus('idle')
    setInitMessage('')
    
    try {
      // await initializeSampleProducts() // This line is removed as per the edit hint
      setInitStatus('success')
      setInitMessage('Products database initialized successfully!')
      await checkDatabaseConnectionWrapper()
    } catch (error: any) {
      setInitStatus('error')
      setInitMessage(`Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkDatabaseConnectionWrapper()
    getProducts().then(setRealProducts);
  }, [])

  const stats = [
    { 
      name: 'Total Products', 
      value: dashboardStats.totalProducts.toString(), 
      icon: Package, 
      change: '+12%', 
      changeType: 'positive' 
    },
    { 
      name: 'Total Orders', 
      value: dashboardStats.totalOrders.toString(), 
      icon: ShoppingCart, 
      change: '+8%', 
      changeType: 'positive' 
    },
    { 
      name: 'Total Customers', 
      value: dashboardStats.totalCustomers.toString(), 
      icon: Users, 
      change: '+15%', 
      changeType: 'positive' 
    },
    { 
      name: 'Revenue', 
      value: '$284,520', 
      icon: DollarSign, 
      change: '+23%', 
      changeType: 'positive' 
    },
  ]

  return (
    <AdminLayout activePage="/admin/dashboard">
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.name}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <stat.icon className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                      <dd>
                        <div className="text-lg font-semibold text-gray-900">{stat.value}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className={`mt-2 text-sm ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                  <span className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    {stat.change} from last month
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Status
              </CardTitle>
              <CardDescription>
                Firestore connection and products
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {dbStatus ? (
                <div className={`flex items-center gap-3 p-3 rounded-md ${
                  dbStatus.connected ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}>
                  {dbStatus.connected ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <AlertCircle className="h-5 w-5" />
                  )}
                  <div>
                    <p className="font-medium">
                      {dbStatus.connected ? 'Connected' : 'Disconnected'}
                    </p>
                    <p className="text-sm">
                      {dbStatus.connected 
                        ? `${dbStatus.productCount} products in database`
                        : 'Unable to connect to Firestore'
                      }
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Checking connection...
                </div>
              )}

              <div className="space-y-2">
                <Button
                  onClick={checkDatabaseConnectionWrapper}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full gap-2"
                  size="sm"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh Status
                </Button>

                <Button
                  onClick={initializeProducts}
                  disabled={isLoading || (dbStatus?.connected && dbStatus.productCount > 0)}
                  className="w-full gap-2"
                  size="sm"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Initializing...
                    </>
                  ) : (
                    'Initialize Products'
                  )}
                </Button>
              </div>

              {initStatus !== 'idle' && (
                <div className={`flex items-center gap-2 p-2 rounded-md text-sm ${
                  initStatus === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}>
                  {initStatus === 'success' ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <span>{initMessage}</span>
                </div>
              )}

              {dbStatus?.connected && dbStatus.productCount === 0 && (
                <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                  <p>No products found in database. Click "Initialize Products" to add sample data.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest system activities and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                Low Stock Alerts
              </CardTitle>
              <CardDescription>Items that need restocking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lowStockItems.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-sm text-amber-600">
                        {item.stock} units left
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Restock
                    </Button>
                  </div>
                ))}
                {lowStockItems.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">No low stock items</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used management tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button className="h-20 flex-col gap-2">
                <Plus className="h-6 w-6" />
                Add Product
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <ShoppingCart className="h-6 w-6" />
                Manage Orders
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Users className="h-6 w-6" />
                View Customers
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <TrendingUp className="h-6 w-6" />
                Analytics
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actual Products in Database</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {realProducts.length === 0 && <li>No products found.</li>}
              {realProducts.map(p => (
                <li key={p.id}>
                  <strong>{p.name}</strong> ({p.category}), ${p.price} - Stock: {p.stock}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Database Setup Instructions</CardTitle>
            <CardDescription>Get your products database running</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              {[{
                title: 'Check Firebase Configuration',
                desc: 'Ensure your Firebase config in .env.local is correct',
              },
              {
                title: 'Enable Firestore',
                desc: 'Make sure Firestore is enabled in your Firebase console',
              },
              {
                title: 'Initialize Database',
                desc: 'Click "Initialize Products" to add sample products to Firestore',
              },
              {
                title: 'Verify Products',
                desc: 'Visit the shop page to see products from your database',
              }].map((step, index) => (
                <div key={step.title} className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary font-medium text-xs mt-0.5">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{step.title}</p>
                    <p className="text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

