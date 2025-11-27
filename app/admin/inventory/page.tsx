// app/admin/inventory/page.tsx
'use client'

import { AdminLayout } from '@/components/admin/AdminLayout'
import { StockSync } from '@/components/admin/StockSyncDashboard'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Package, AlertTriangle, RefreshCw, Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getProducts, getLowStockProducts, updateStock, Product } from '@/lib/admin-services'

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [updatingStocks, setUpdatingStocks] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    loadInventory()
  }, [])

  const loadInventory = async () => {
    try {
      setLoading(true)
      const [productsData, lowStockData] = await Promise.all([
        getProducts(),
        getLowStockProducts()
      ])
      setProducts(productsData)
      setLowStockProducts(lowStockData)
    } catch (error) {
      console.error('Error loading inventory:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStockUpdate = async (productId: string, newStock: number) => {
    setUpdatingStocks(prev => ({ ...prev, [productId]: true }))
    try {
      await updateStock(productId, newStock)
      await loadInventory() // Refresh data
    } catch (error) {
      console.error('Error updating stock:', error)
    } finally {
      setUpdatingStocks(prev => ({ ...prev, [productId]: false }))
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', variant: 'destructive' as const, color: 'text-red-600' }
    if (stock <= 10) return { label: 'Low Stock', variant: 'secondary' as const, color: 'text-amber-600' }
    return { label: 'In Stock', variant: 'default' as const, color: 'text-green-600' }
  }

  return (
    <AdminLayout activePage="/admin/inventory">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
            <p className="text-muted-foreground">
              Monitor and manage product stock levels
            </p>
          </div>
          <div className="flex gap-2">
            <StockSync onSyncComplete={loadInventory} />
            <Button variant="outline" onClick={loadInventory} disabled={loading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Low Stock Alerts */}
        {lowStockProducts.length > 0 && (
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="flex items-center text-amber-800">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Low Stock Alerts ({lowStockProducts.length})
              </CardTitle>
              <CardDescription className="text-amber-700">
                These products are running low and may need restocking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lowStockProducts.slice(0, 6).map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-sm text-amber-600">
                        {product.stock} units remaining
                      </p>
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => handleStockUpdate(product.id, product.stock + 50)}
                      disabled={updatingStocks[product.id]}
                    >
                      {updatingStocks[product.id] ? '...' : 'Restock'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>

        {/* Inventory Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Products</CardTitle>
            <CardDescription>
              Current stock levels for all products
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading inventory...</p>
                </div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No products found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm ? 'No products match your search.' : 'No products in inventory.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Quick Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => {
                      const stockStatus = getStockStatus(product.stock)
                      const isUpdating = updatingStocks[product.id]

                      return (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                                <Package className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <div>
                                <div className="font-medium">{product.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  SKU: {product.id.slice(-8)}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{product.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className={`font-medium ${stockStatus.color}`}>
                                {product.stock}
                              </span>
                              <span className="text-sm text-muted-foreground">units</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={stockStatus.variant}>
                              {stockStatus.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStockUpdate(product.id, product.stock + 10)}
                                disabled={isUpdating}
                              >
                                +10
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStockUpdate(product.id, product.stock + 25)}
                                disabled={isUpdating}
                              >
                                +25
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleStockUpdate(product.id, product.stock + 50)}
                                disabled={isUpdating}
                              >
                                {isUpdating ? '...' : '+50'}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}