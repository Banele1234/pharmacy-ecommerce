import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pill, ShieldCheck, Truck, Clock, Star, ArrowRight, Heart, Package } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
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
            <Link href="/shop">
              <Button variant="ghost" className="gap-2">
                <Package className="h-4 w-4" />
                Shop Now
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button className="gap-2">
                Sign Up
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section with Image */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left Content */}
            <div className="space-y-8">
              <Badge className="inline-flex items-center gap-2 px-4 py-2 text-sm" variant="secondary">
                <ShieldCheck className="h-4 w-4" />
                Trusted Healthcare Partner in Cameroon
              </Badge>
              <div className="space-y-4">
                <h1 className="text-5xl font-bold leading-tight tracking-tight text-balance md:text-6xl lg:text-7xl">
                  Your Health,
                  <span className="block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Our Priority
                  </span>
                </h1>
                <p className="text-lg leading-relaxed text-muted-foreground text-pretty md:text-xl">
                  Experience professional pharmacy services with quality medications, expert prescription handling, and
                  reliable delivery across Cameroon. Your wellness journey starts here.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/shop" className="group">
                  <Button size="lg" className="w-full gap-2 sm:w-auto">
                    Browse Products
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/prescription">
                  <Button size="lg" variant="outline" className="w-full gap-2 sm:w-auto bg-transparent">
                    <Heart className="h-4 w-4" />
                    Upload Prescription
                  </Button>
                </Link>
              </div>
              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm font-medium">5.0 Rating</span>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="text-sm">
                  <span className="font-bold text-primary">10,000+</span>
                  <span className="text-muted-foreground"> Happy Customers</span>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 blur-3xl" />
              <div className="relative overflow-hidden rounded-2xl border-2 border-primary/20 shadow-2xl">
                <img
                  src="/professional-pharmacist-helping-customer-in-modern.jpg"
                  alt="Professional pharmacist helping customer in modern pharmacy"
                  className="h-full w-full object-cover"
                />
              </div>
              {/* Floating Cards */}
              <div className="absolute -bottom-6 -left-6 rounded-xl border bg-background p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Truck className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Fast Delivery</p>
                    <p className="text-xs text-muted-foreground">24-48 hours</p>
                  </div>
                </div>
              </div>
              <div className="absolute -right-6 -top-6 rounded-xl border bg-background p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
                    <ShieldCheck className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">100% Verified</p>
                    <p className="text-xs text-muted-foreground">Licensed Products</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <Badge className="mb-4" variant="outline">
              Why Choose Us
            </Badge>
            <h2 className="text-3xl font-bold text-balance md:text-4xl">Everything You Need for Better Health</h2>
            <p className="mt-4 text-muted-foreground text-pretty">
              Professional pharmacy services designed with your wellness in mind
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="group transition-all hover:shadow-lg hover:border-primary/50">
              <CardHeader>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-transform group-hover:scale-110">
                  <ShieldCheck className="h-7 w-7 text-primary" />
                </div>
                <CardTitle>Verified Products</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="leading-relaxed">
                  Every medication is sourced from licensed suppliers and verified for authenticity. Your safety is our
                  guarantee.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group transition-all hover:shadow-lg hover:border-primary/50">
              <CardHeader>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-secondary/10 transition-transform group-hover:scale-110">
                  <Truck className="h-7 w-7 text-secondary" />
                </div>
                <CardTitle>Fast Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="leading-relaxed">
                  Quick and reliable delivery across Cameroon with real-time tracking. Get your medications when you
                  need them.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group transition-all hover:shadow-lg hover:border-primary/50">
              <CardHeader>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-success/10 transition-transform group-hover:scale-110">
                  <Pill className="h-7 w-7 text-success" />
                </div>
                <CardTitle>Wide Selection</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="leading-relaxed">
                  Comprehensive range of medications, supplements, and healthcare products. Everything you need in one
                  place.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group transition-all hover:shadow-lg hover:border-primary/50">
              <CardHeader>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 transition-transform group-hover:scale-110">
                  <Clock className="h-7 w-7 text-accent" />
                </div>
                <CardTitle>24/7 Support</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="leading-relaxed">
                  Professional pharmacist support available around the clock. Get expert answers to your health
                  questions anytime.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="border-t bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <Badge className="mb-4" variant="outline">
              Product Categories
            </Badge>
            <h2 className="text-3xl font-bold text-balance md:text-4xl">Shop by Category</h2>
            <p className="mt-4 text-muted-foreground text-pretty">Find exactly what you need for your health</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/shop?category=prescription" className="group">
              <Card className="h-full transition-all hover:shadow-xl hover:border-primary hover:-translate-y-1">
                <CardHeader className="space-y-4">
                  <div className="relative h-48 overflow-hidden rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
                    <img
                      src="/prescription-medication-bottles-and-pills-on-pharm.jpg"
                      alt="Prescription Medications"
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary shadow-lg">
                      <Pill className="h-6 w-6 text-primary-foreground" />
                    </div>
                  </div>
                  <div>
                    <CardTitle className="flex items-center justify-between">
                      Prescription Medications
                      <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                    </CardTitle>
                    <CardDescription className="mt-2 leading-relaxed">
                      Doctor-prescribed medicines with secure verification and professional handling
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/shop?category=otc" className="group">
              <Card className="h-full transition-all hover:shadow-xl hover:border-secondary hover:-translate-y-1">
                <CardHeader className="space-y-4">
                  <div className="relative h-48 overflow-hidden rounded-lg bg-gradient-to-br from-secondary/10 to-secondary/5">
                    <img
                      src="/over-the-counter-medicine-display-in-modern-pharma.jpg"
                      alt="Over-the-Counter Medications"
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary shadow-lg">
                      <Package className="h-6 w-6 text-secondary-foreground" />
                    </div>
                  </div>
                  <div>
                    <CardTitle className="flex items-center justify-between">
                      Over-the-Counter
                      <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-secondary" />
                    </CardTitle>
                    <CardDescription className="mt-2 leading-relaxed">
                      Common medications available without prescription for everyday health needs
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/shop?category=supplements" className="group">
              <Card className="h-full transition-all hover:shadow-xl hover:border-success hover:-translate-y-1">
                <CardHeader className="space-y-4">
                  <div className="relative h-48 overflow-hidden rounded-lg bg-gradient-to-br from-success/10 to-success/5">
                    <img
                      src="/vitamins-and-supplements-bottles-healthy-lifestyle.jpg"
                      alt="Vitamins & Supplements"
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-lg bg-success shadow-lg">
                      <Heart className="h-6 w-6 text-success-foreground" />
                    </div>
                  </div>
                  <div>
                    <CardTitle className="flex items-center justify-between">
                      Vitamins & Supplements
                      <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-success" />
                    </CardTitle>
                    <CardDescription className="mt-2 leading-relaxed">
                      Health supplements and nutritional products to support your wellness journey
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-gradient-to-br from-primary via-primary to-primary/80 py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-6 bg-primary-foreground/20 text-primary-foreground" variant="secondary">
            Get Started Today
          </Badge>
          <h2 className="mb-4 text-3xl font-bold text-balance md:text-4xl">Ready for Better Healthcare?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-primary-foreground/90 text-pretty">
            Join thousands of satisfied customers who trust PharmaCare for their health needs. Create your free account
            and experience professional pharmacy services.
          </p>
          <Link href="/signup" className="group inline-block">
            <Button size="lg" variant="secondary" className="gap-2 shadow-lg">
              Create Free Account
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Pill className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold">PharmaCare</span>
            </div>
            <div className="text-center text-sm text-muted-foreground md:text-left">
              <p>&copy; {new Date().getFullYear()} PharmaCare. All rights reserved.</p>
              <p className="mt-1">Professional pharmacy services in Cameroon</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
