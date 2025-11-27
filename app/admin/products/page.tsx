// app/admin/products/page.tsx
'use client'

import { AdminLayout } from '@/components/admin/AdminLayout'
import { ProductList } from '@/components/admin/ProductList'
import { ProductFilter } from '@/components/admin/ProductFilters'
import { BulkActions } from '@/components/admin/BulkActions'
import { ImportExport } from '@/components/admin/ImportExport'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Package } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getProducts, getCategories, Product } from '@/lib/admin-services'
import Link from 'next/link'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [filters, setFilters] = useState({
    category: 'all',
    stockStatus: 'all',
    search: ''
  })

  useEffect(() => {
    loadProducts()
    loadCategories()
  }, [filters])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const productsData = await getProducts(filters)
      setProducts(productsData)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const categoriesData = await getCategories()
      setCategories(categoriesData)
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters)
  }

  const handleProductSelection = (productIds: string[]) => {
    setSelectedProducts(productIds)
  }

  const handleBulkAction = async (action: string, data?: any) => {
    try {
      switch (action) {
        case 'delete':
          if (confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) {
            // await bulkDeleteProducts(selectedProducts)
            await loadProducts()
            setSelectedProducts([])
          }
          break
        case 'update':
          // await bulkUpdateProducts(selectedProducts, data)
          await loadProducts()
          setSelectedProducts([])
          break
      }
    } catch (error) {
      console.error('Error performing bulk action:', error)
    }
  }

  return (
    <AdminLayout activePage="/admin/products">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Products</h1>
            <p className="text-muted-foreground">
              Manage your pharmacy products and inventory
            </p>
          </div>
          <div className="flex gap-2">
            <ImportExport onImportComplete={loadProducts} />
            <Link href="/admin/products/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                  <p className="text-2xl font-bold">{products.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">In Stock</p>
                  <p className="text-2xl font-bold">
                    {products.filter(p => p.stock > 0).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Package className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Low Stock</p>
                  <p className="text-2xl font-bold">
                    {products.filter(p => p.stock > 0 && p.stock <= 10).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Package className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Out of Stock</p>
                  <p className="text-2xl font-bold">
                    {products.filter(p => p.stock === 0).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Bulk Actions */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <ProductFilter 
              categories={categories}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>
          <div className="lg:w-80">
            <BulkActions 
              selectedCount={selectedProducts.length}
              onBulkAction={handleBulkAction}
            />
          </div>
        </div>

        {/* Products List */}
        <Card>
          <CardHeader>
            <CardTitle>Product List</CardTitle>
            <CardDescription>
              {selectedProducts.length > 0 
                ? `${selectedProducts.length} product(s) selected`
                : `Showing ${products.length} product(s)`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProductList 
              products={products}
              loading={loading}
              selectedProducts={selectedProducts}
              onProductSelection={handleProductSelection}
              onProductUpdate={loadProducts}
            />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}