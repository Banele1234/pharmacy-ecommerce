// components/admin/BulkActions.tsx
'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Package, AlertTriangle } from 'lucide-react'

interface BulkActionsProps {
  selectedCount: number
  onBulkAction: (action: string, data?: any) => void
}

export function BulkActions({ selectedCount, onBulkAction }: BulkActionsProps) {
  const [action, setAction] = useState('')

  const handleExecute = () => {
    if (!action) return

    if (action === 'delete') {
      if (confirm(`Are you sure you want to delete ${selectedCount} products?`)) {
        onBulkAction('delete')
      }
    } else {
      onBulkAction('update', { action })
    }
    
    setAction('')
  }

  if (selectedCount === 0) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="text-center text-muted-foreground">
            <Package className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">Select products to perform bulk actions</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span className="font-medium">
              {selectedCount} product(s) selected
            </span>
          </div>

          <Select value={action} onValueChange={setAction}>
            <SelectTrigger>
              <SelectValue placeholder="Choose action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="restock">Restock to 50</SelectItem>
              <SelectItem value="outofstock">Mark as Out of Stock</SelectItem>
              <SelectItem value="prescription">Require Prescription</SelectItem>
              <SelectItem value="noprescription">No Prescription Required</SelectItem>
              <SelectItem value="delete" className="text-red-600">
                Delete Products
              </SelectItem>
            </SelectContent>
          </Select>

          <Button 
            onClick={handleExecute}
            disabled={!action}
            className="w-full"
            variant={action === 'delete' ? 'destructive' : 'default'}
          >
            {action === 'delete' ? (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </>
            ) : (
              'Apply Action'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}