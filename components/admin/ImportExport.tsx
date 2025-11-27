// components/admin/ImportExport.tsx
'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Download, Upload, FileText } from 'lucide-react'

interface ImportExportProps {
  onImportComplete: () => void
}

export function ImportExport({ onImportComplete }: ImportExportProps) {
  const [importing, setImporting] = useState(false)

  const handleExport = (format: 'csv' | 'json') => {
    // Implement export logic
    console.log(`Exporting as ${format}`)
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setImporting(true)
    try {
      // Implement import logic
      console.log('Importing file:', file)
      // Simulate import process
      await new Promise(resolve => setTimeout(resolve, 2000))
      onImportComplete()
    } catch (error) {
      console.error('Import error:', error)
    } finally {
      setImporting(false)
      // Reset file input
      event.target.value = ''
    }
  }

  return (
    <div className="flex gap-2">
      {/* Export Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleExport('csv')}>
            <FileText className="h-4 w-4 mr-2" />
            Export as CSV
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport('json')}>
            <FileText className="h-4 w-4 mr-2" />
            Export as JSON
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Import Button */}
      <div>
        <input
          type="file"
          id="import-file"
          accept=".csv,.json"
          onChange={handleImport}
          className="hidden"
          disabled={importing}
        />
        <Button 
          variant="outline" 
          className="gap-2"
          disabled={importing}
          onClick={() => document.getElementById('import-file')?.click()}
        >
          {importing ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Importing...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Import
            </>
          )}
        </Button>
      </div>
    </div>
  )
}