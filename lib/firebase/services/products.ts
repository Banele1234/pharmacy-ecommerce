import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  limit,
  writeBatch
} from 'firebase/firestore'
import { db } from '../config'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  imageUrl: string
  stock: number
  requiresPrescription: boolean
  brand: string
  dosage: string
  form: string
  packSize: string
  ingredients: string[]
  sideEffects: string[]
  usage: string
  warnings: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

class ProductService {
  private collectionName = 'products'

  // Clear all existing products
  async clearAllProducts(): Promise<void> {
    try {
      console.log('🗑️ Clearing all existing products...')
      const querySnapshot = await getDocs(collection(db, this.collectionName))
      
      // Use batch delete for efficiency
      const batch = writeBatch(db)
      querySnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref)
      })
      
      await batch.commit()
      console.log('✅ All products cleared from Firestore')
    } catch (error: any) {
      console.error('❌ Error clearing products:', error)
      throw new Error(`Failed to clear products: ${error.message}`)
    }
  }

  // Get products directly from Firestore - simplified query to avoid index requirements
  private async getProductsFromFirestore(): Promise<Product[]> {
    try {
      console.log('🔄 Fetching products from Firestore...')
      
      // Get all products first, then filter client-side
      const productsQuery = query(collection(db, this.collectionName))
      
      const querySnapshot = await getDocs(productsQuery)
      let products = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product))
      
      // Filter active products and sort by name on client side
      products = products
        .filter(product => product.isActive !== false) // Default to true if undefined
        .sort((a, b) => a.name.localeCompare(b.name))
      
      console.log(`✅ Found ${products.length} products in Firestore`)
      return products
      
    } catch (error: any) {
      console.error('❌ Error fetching products from Firestore:', error)
      throw error
    }
  }

  // Public method to get products - with auto-initialization if empty
  async getProducts(): Promise<Product[]> {
    try {
      const products = await this.getProductsFromFirestore()
      
      // If no products found, automatically initialize with sample data
      if (products.length === 0) {
        console.log('📝 No products found, auto-initializing with sample data...')
        await this.initializeSampleProducts()
        
        // Try to get products again after initialization
        const newProducts = await this.getProductsFromFirestore()
        return newProducts
      }
      
      return products
    } catch (error: any) {
      console.error('❌ Error in getProducts:', error)
      
      // If Firestore is unavailable or index error, return empty array
      if (error.code === 'unavailable' || error.code === 'failed-precondition' || error.code?.includes?.('index')) {
        console.warn('⚠️ Firestore query requires index or is unavailable, returning empty array')
        return []
      }
      
      throw new Error(`Failed to fetch products: ${error.message}`)
    }
  }

  // Get product by ID from Firestore
  async getProductById(id: string): Promise<Product | null> {
    try {
      console.log(`🔄 Fetching product from Firestore: ${id}`)
      
      const docRef = doc(db, this.collectionName, id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const productData = docSnap.data()
        // Check if product is active (default to true if undefined)
        if (productData.isActive === false) {
          console.warn(`⚠️ Product found but inactive: ${id}`)
          return null
        }
        
        const product = {
          id: docSnap.id,
          ...productData
        } as Product
        
        console.log(`✅ Found product in Firestore: ${product.name}`)
        return product
      } else {
        console.warn(`⚠️ Product not found in Firestore: ${id}`)
        return null
      }
      
    } catch (error: any) {
      console.error(`❌ Error fetching product ${id} from Firestore:`, error)
      throw new Error(`Failed to fetch product: ${error.message}`)
    }
  }

  // Get products by category from Firestore
  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      console.log(`🔄 Fetching products in category: ${category}`)
      
      const allProducts = await this.getProducts()
      const filteredProducts = allProducts.filter(product => product.category === category)
      
      console.log(`✅ Found ${filteredProducts.length} products in ${category}`)
      return filteredProducts
      
    } catch (error: any) {
      console.error(`❌ Error fetching products for category ${category}:`, error)
      throw new Error(`Failed to fetch products by category: ${error.message}`)
    }
  }

  // Search products in Firestore
  async searchProducts(searchTerm: string): Promise<Product[]> {
    try {
      console.log(`🔄 Searching products for: ${searchTerm}`)
      
      // Get all products and filter client-side since Firestore doesn't support full-text search easily
      const allProducts = await this.getProducts()
      const searchLower = searchTerm.toLowerCase()
      
      const filteredProducts = allProducts.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.brand.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower)
      )
      
      console.log(`✅ Found ${filteredProducts.length} products matching "${searchTerm}"`)
      return filteredProducts
      
    } catch (error: any) {
      console.error(`❌ Error searching products in Firestore:`, error)
      throw new Error(`Failed to search products: ${error.message}`)
    }
  }

  // Get featured products from Firestore
  async getFeaturedProducts(count: number = 8): Promise<Product[]> {
    try {
      console.log(`🔄 Fetching ${count} featured products from Firestore`)
      
      const allProducts = await this.getProducts()
      
      // Sort by creation date (newest first) and take the first 'count' items
      const featuredProducts = allProducts
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, count)
      
      console.log(`✅ Found ${featuredProducts.length} featured products`)
      return featuredProducts
      
    } catch (error: any) {
      console.error('❌ Error fetching featured products from Firestore:', error)
      throw new Error(`Failed to fetch featured products: ${error.message}`)
    }
  }

  // Add a new product to Firestore
  async addProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      console.log(`🔄 Adding new product to Firestore: ${productData.name}`)
      
      const productWithTimestamps = {
        ...productData,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      const docRef = await addDoc(collection(db, this.collectionName), productWithTimestamps)
      console.log(`✅ Product added to Firestore with ID: ${docRef.id}`)
      return docRef.id
      
    } catch (error: any) {
      console.error('❌ Error adding product to Firestore:', error)
      throw new Error(`Failed to add product: ${error.message}`)
    }
  }

  // Update product in Firestore
  async updateProduct(productId: string, updates: Partial<Product>): Promise<void> {
    try {
      console.log(`🔄 Updating product in Firestore: ${productId}`)
      
      const productRef = doc(db, this.collectionName, productId)
      await updateDoc(productRef, {
        ...updates,
        updatedAt: new Date()
      })
      
      console.log(`✅ Product updated in Firestore: ${productId}`)
      
    } catch (error: any) {
      console.error(`❌ Error updating product ${productId} in Firestore:`, error)
      throw new Error(`Failed to update product: ${error.message}`)
    }
  }

  // Update product stock in Firestore
  async updateProductStock(productId: string, newStock: number): Promise<void> {
    try {
      console.log(`🔄 Updating stock for product ${productId} to ${newStock} in Firestore`)
      
      const productRef = doc(db, this.collectionName, productId)
      await updateDoc(productRef, {
        stock: newStock,
        updatedAt: new Date()
      })
      
      console.log(`✅ Stock updated for product ${productId} in Firestore`)
      
    } catch (error: any) {
      console.error(`❌ Error updating stock for product ${productId} in Firestore:`, error)
      throw new Error(`Failed to update product stock: ${error.message}`)
    }
  }

  // Delete product from Firestore (soft delete)
  async deleteProduct(productId: string): Promise<void> {
    try {
      console.log(`🔄 Soft deleting product from Firestore: ${productId}`)
      
      const productRef = doc(db, this.collectionName, productId)
      await updateDoc(productRef, {
        isActive: false,
        updatedAt: new Date()
      })
      
      console.log(`✅ Product soft deleted from Firestore: ${productId}`)
      
    } catch (error: any) {
      console.error(`❌ Error deleting product ${productId} from Firestore:`, error)
      throw new Error(`Failed to delete product: ${error.message}`)
    }
  }

  // Check if Firestore connection is working and has data
  async checkDatabaseConnection(): Promise<{ connected: boolean; productCount: number }> {
    try {
      const products = await this.getProductsFromFirestore()
      return {
        connected: true,
        productCount: products.length
      }
    } catch (error) {
      console.error('❌ Database connection check failed:', error)
      return {
        connected: false,
        productCount: 0
      }
    }
  }

  // Initialize sample products (optional - for admin to manually initialize)
  async initializeSampleProducts(): Promise<void> {
    try {
      console.log('🔄 Initializing sample products...')
      
      // Check if products already exist
      const existingProducts = await this.getProductsFromFirestore()
      if (existingProducts.length > 0) {
        console.log('✅ Products already exist in database')
        return
      }

      console.log('📦 Adding sample products to Firestore...')
      
      // Define sample products inline instead of importing
      const sampleProducts = [
        {
          name: 'Panadol Extra',
          description: 'Effective pain relief for headaches, muscle pain, and fever. Contains paracetamol and caffeine for enhanced effect.',
          price: 25.99,
          category: 'pain-relief',
          imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop',
          stock: 150,
          requiresPrescription: false,
          brand: 'GSK',
          dosage: '500mg',
          form: 'Tablets',
          packSize: '24 tablets',
          ingredients: ['Paracetamol', 'Caffeine'],
          sideEffects: ['Rare: allergic reactions'],
          usage: 'Take 1-2 tablets every 4-6 hours as needed',
          warnings: 'Do not exceed 8 tablets in 24 hours',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Ventolin Inhaler',
          description: 'Relief from asthma symptoms and bronchospasm. Fast-acting bronchodilator.',
          price: 89.99,
          category: 'respiratory',
          imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop',
          stock: 45,
          requiresPrescription: true,
          brand: 'GSK',
          dosage: '100mcg/dose',
          form: 'Inhaler',
          packSize: '200 doses',
          ingredients: ['Salbutamol'],
          sideEffects: ['Tremors', 'Headache', 'Tachycardia'],
          usage: '1-2 puffs as needed for relief of symptoms',
          warnings: 'Not for regular use, consult doctor if using more than 3 times weekly',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Amoxicillin 500mg',
          description: 'Broad-spectrum antibiotic for bacterial infections. Effective against various infections.',
          price: 45.50,
          category: 'antibiotics',
          imageUrl: 'https://images.unsplash.com/photo-1550572017-ee6ac4b243a3?w=400&h=400&fit=crop',
          stock: 80,
          requiresPrescription: true,
          brand: 'Generic',
          dosage: '500mg',
          form: 'Capsules',
          packSize: '21 capsules',
          ingredients: ['Amoxicillin Trihydrate'],
          sideEffects: ['Diarrhea', 'Nausea', 'Skin rash'],
          usage: 'Take one capsule three times daily for 7 days',
          warnings: 'Complete the full course even if you feel better',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Vitamin C 1000mg',
          description: 'High-potency Vitamin C supplements for immune support and antioxidant protection.',
          price: 35.75,
          category: 'vitamins',
          imageUrl: 'https://images.unsplash.com/photo-1570194065650-2f016f5a86d3?w=400&h=400&fit=crop',
          stock: 200,
          requiresPrescription: false,
          brand: 'Nature\'s Best',
          dosage: '1000mg',
          form: 'Tablets',
          packSize: '60 tablets',
          ingredients: ['Ascorbic Acid'],
          sideEffects: ['Mild stomach upset in high doses'],
          usage: 'Take one tablet daily with food',
          warnings: 'Consult doctor if pregnant or breastfeeding',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Ibuprofen 400mg',
          description: 'Anti-inflammatory pain reliever for arthritis, menstrual pain, and inflammation.',
          price: 28.25,
          category: 'pain-relief',
          imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop',
          stock: 120,
          requiresPrescription: false,
          brand: 'Generic',
          dosage: '400mg',
          form: 'Tablets',
          packSize: '30 tablets',
          ingredients: ['Ibuprofen'],
          sideEffects: ['Stomach upset', 'Heartburn'],
          usage: 'Take one tablet every 6-8 hours as needed',
          warnings: 'Take with food to avoid stomach upset',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Omeprazole 20mg',
          description: 'Proton pump inhibitor for acid reflux, heartburn, and stomach ulcers.',
          price: 52.99,
          category: 'digestive-health',
          imageUrl: 'https://images.unsplash.com/photo-1550572017-ee6ac4b243a3?w=400&h=400&fit=crop',
          stock: 95,
          requiresPrescription: false,
          brand: 'Generic',
          dosage: '20mg',
          form: 'Capsules',
          packSize: '28 capsules',
          ingredients: ['Omeprazole'],
          sideEffects: ['Headache', 'Nausea', 'Diarrhea'],
          usage: 'Take one capsule daily before breakfast',
          warnings: 'Do not crush or chew capsules',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Metformin 500mg',
          description: 'Oral medication for type 2 diabetes management.',
          price: 38.75,
          category: 'diabetes',
          imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop',
          stock: 65,
          requiresPrescription: true,
          brand: 'Generic',
          dosage: '500mg',
          form: 'Tablets',
          packSize: '84 tablets',
          ingredients: ['Metformin Hydrochloride'],
          sideEffects: ['Nausea', 'Diarrhea', 'Metallic taste'],
          usage: 'Take as directed by your doctor, usually 2-3 times daily',
          warnings: 'Regular blood sugar monitoring required',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Complete Multivitamin',
          description: 'Comprehensive daily multivitamin with essential vitamins and minerals.',
          price: 67.50,
          category: 'vitamins',
          imageUrl: 'https://images.unsplash.com/photo-1570194065650-2f016f5a86d3?w=400&h=400&fit=crop',
          stock: 180,
          requiresPrescription: false,
          brand: 'Centrum',
          dosage: 'Once daily',
          form: 'Tablets',
          packSize: '90 tablets',
          ingredients: ['Multiple vitamins and minerals'],
          sideEffects: ['Mild nausea if taken on empty stomach'],
          usage: 'Take one tablet daily with food',
          warnings: 'Keep out of reach of children',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]

      // Add products one by one to avoid batch limits
      for (const product of sampleProducts) {
        await addDoc(collection(db, this.collectionName), product)
        console.log(`✅ Added product: ${product.name}`)
      }
      
      console.log('🎉 All sample products added to Firestore successfully!')
      
    } catch (error: any) {
      console.error('❌ Error initializing sample products:', error)
      throw new Error(`Failed to initialize products: ${error.message}`)
    }
  }
}

export const productService = new ProductService()
export default ProductService