// components/admin/ProductList.tsx
'use client'

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Edit, Trash2, Eye, Package } from 'lucide-react'
import { Product } from '@/lib/admin-services'
import Link from 'next/link'

interface ProductListProps {
  products: Product[]
  loading: boolean
  selectedProducts: string[]
  onProductSelection: (productIds: string[]) => void
  onProductUpdate: () => void
}

export function ProductList({ 
  products, 
  loading, 
  selectedProducts, 
  onProductSelection, 
  onProductUpdate 
}: ProductListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onProductSelection(products.map(p => p.id))
    } else {
      onProductSelection([])
    }
  }

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      onProductSelection([...selectedProducts, productId])
    } else {
      onProductSelection(selectedProducts.filter(id => id !== productId))
    }
  }

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    setDeletingId(productId)
    try {
      // await deleteProduct(productId)
      onProductUpdate()
    } catch (error) {
      console.error('Error deleting product:', error)
    } finally {
      setDeletingId(null)
    }
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', variant: 'destructive' as const }
    if (stock <= 10) return { label: 'Low Stock', variant: 'secondary' as const }
    return { label: 'In Stock', variant: 'default' as const }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground mb-4">
            No products match your current filters.
          </p>
          <Button asChild>
            <Link href="/admin/products/new">Add Your First Product</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedProducts.length === products.length && products.length > 0}
                onCheckedChange={handleSelectAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Prescription</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            const stockStatus = getStockStatus(product.stock)
            const isSelected = selectedProducts.includes(product.id)
            const isDeleting = deletingId === product.id

            return (
              <TableRow key={product.id} className={isSelected ? 'bg-muted/50' : ''}>
                <TableCell>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => 
                      handleSelectProduct(product.id, checked as boolean)
                    }
                    aria-label={`Select ${product.name}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={product.imageUrl || product.image || '/placeholder.jpg'}
                      alt={product.name}
                      className="h-10 w-10 rounded-lg object-cover"
                      onError={e => { e.currentTarget.src = '/placeholder.jpg'; }}
                    />
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {product.description}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{product.category}</Badge>
                </TableCell>
                <TableCell className="font-medium">
                  ${product.price.toFixed(2)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge variant={stockStatus.variant}>
                      {stockStatus.label}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      ({product.stock})
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={product.prescriptionRequired ? "default" : "outline"}>
                    {product.prescriptionRequired ? 'Required' : 'Not Required'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/products/${product.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}