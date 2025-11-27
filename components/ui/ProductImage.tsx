'use client'

import { useState } from 'react'
import { Pill } from 'lucide-react'

interface ProductImageProps {
  src?: string
  alt: string
  className?: string
}

export function ProductImage({ src, alt, className = '' }: ProductImageProps) {
  const [imageError, setImageError] = useState(false)

  // If no src or image failed to load, show fallback
  if (!src || imageError) {
    return (
      <div className={`bg-muted flex items-center justify-center ${className}`}>
        <Pill className="h-12 w-12 text-muted-foreground" />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setImageError(true)}
    />
  )
}