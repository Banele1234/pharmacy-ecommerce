'use client'

import { useEffect, useState } from 'react'

const DEFAULT_FALLBACK = '/placeholder.jpg'

interface ProductImageProps {
  src?: string | null
  alt: string
  className?: string
  fallbackSrc?: string
}

export function ProductImage({
  src,
  alt,
  className = '',
  fallbackSrc = DEFAULT_FALLBACK,
}: ProductImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc)

  useEffect(() => {
    setCurrentSrc(src || fallbackSrc)
  }, [src, fallbackSrc])

  const handleError = () => {
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc)
    }
  }

  return (
    <img
      src={currentSrc ?? fallbackSrc}
      alt={alt}
      className={className}
      onError={handleError}
    />
  )
}