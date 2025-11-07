"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Pill, Search, ShoppingCart, Star, ArrowLeft, Plus, Check, Package, Heart, AlertCircle } from "lucide-react"
import { useCart } from "@/lib/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/lib/types"

// Mock products data - replace with Firebase fetch
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Paracetamol 500mg",
    description: "Effective pain relief and fever reducer. Safe for adults and children over 12 years.",
    price: 2500,
    category: "otc",
    imageUrl: "/paracetamol-medicine-box-white-background.jpg",
    stock: 150,
    requiresPrescription: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Amoxicillin 250mg",
    description: "Antibiotic for bacterial infections. Prescription required for purchase.",
    price: 8500,
    category: "prescription",
    imageUrl: "/antibiotic-medicine-capsules-box.jpg",
    stock: 80,
    requiresPrescription: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Vitamin C 1000mg",
    description: "Immune system support with high-potency vitamin C. 60 tablets per bottle.",
    price: 5500,
    category: "supplements",
    imageUrl: "/vitamin-c-supplement-bottle-orange.jpg",
    stock: 200,
    requiresPrescription: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    name: "Ibuprofen 400mg",
    description: "Anti-inflammatory pain reliever for headaches, muscle pain, and arthritis.",
    price: 3200,
    category: "otc",
    imageUrl: "/ibuprofen-pain-relief-tablets.jpg",
    stock: 120,
    requiresPrescription: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "5",
    name: "Multivitamin Complex",
    description: "Complete daily multivitamin with essential minerals. 30-day supply.",
    price: 7800,
    category: "supplements",
    imageUrl: "/multivitamin-supplement-bottle-colorful.jpg",
    stock: 95,
    requiresPrescription: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "6",
    name: "Omeprazole 20mg",
    description: "Treats acid reflux and stomach ulcers. Prescription medication.",
    price: 6500,
    category: "prescription",
    imageUrl: "/omeprazole-medicine-capsules.jpg",
    stock: 15,
    requiresPrescription: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [addedToCart, setAddedToCart] = useState<string | null>(null)

  const { addItem, getItemCount } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    let filtered = products

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredProducts(filtered)
  }, [searchQuery, selectedCategory, products])

  const handleAddToCart = (product: Product) => {
    addItem(product, 1)
    setAddedToCart(product.id)
    setTimeout(() => setAddedToCart(null), 2000)

    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const categories = [
    { id: "all", label: "All Products", icon: Package },
    { id: "prescription", label: "Prescription", icon: Pill },
    { id: "otc", label: "Over-the-Counter", icon: Heart },
    { id: "supplements", label: "Supplements", icon: Star },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70">
              <Pill className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">PharmaCare</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link href="/cart">
              <Button variant="outline" className="relative gap-2 bg-transparent">
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline">Cart</span>
                {getItemCount() > 0 && (
                  <Badge className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 text-xs">{getItemCount()}</Badge>
                )}
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/"
          className="group mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">Shop Products</h1>
          <p className="text-muted-foreground">Browse our wide selection of quality medications and health products</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for medications, supplements, or health products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {category.label}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredProducts.length}</span> products
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <Card className="py-16 text-center">
            <CardContent>
              <Package className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
              <h3 className="mb-2 text-xl font-semibold">No products found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="group flex flex-col overflow-hidden transition-all hover:shadow-xl hover:border-primary/50"
              >
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <img
                    src={product.imageUrl || "/placeholder.svg"}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {product.requiresPrescription && (
                    <Badge className="absolute left-3 top-3 gap-1 bg-destructive/90 backdrop-blur">
                      <AlertCircle className="h-3 w-3" />
                      Prescription Required
                    </Badge>
                  )}
                  {product.stock < 20 && (
                    <Badge className="absolute right-3 top-3 bg-warning text-warning-foreground backdrop-blur">
                      Low Stock
                    </Badge>
                  )}
                </div>

                {/* Product Info */}
                <CardHeader className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-2 text-lg leading-tight">{product.name}</CardTitle>
                  </div>
                  <CardDescription className="line-clamp-2 text-sm leading-relaxed">
                    {product.description}
                  </CardDescription>
                </CardHeader>

                {/* Product Footer */}
                <CardFooter className="flex-col gap-3 border-t pt-4">
                  <div className="flex w-full items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-primary">{product.price.toLocaleString()} FCFA</p>
                      <p className="text-xs text-muted-foreground">In stock: {product.stock}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">4.8</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0 || addedToCart === product.id}
                    className="w-full gap-2 transition-all"
                    variant={addedToCart === product.id ? "secondary" : "default"}
                  >
                    {addedToCart === product.id ? (
                      <>
                        <Check className="h-4 w-4" />
                        Added to Cart!
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
