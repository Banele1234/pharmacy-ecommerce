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
    DocumentData
  } from 'firebase/firestore'
  import { db } from '../config'
  
  export interface CartItem {
    id: string
    userId: string
    productId: string
    quantity: number
    product: {
      name: string
      price: number
      imageUrl: string
      requiresPrescription: boolean
      stock: number
    }
    addedAt: Date
  }
  
  class CartService {
    private collectionName = 'cartItems'
  
    // Get user's cart items
    async getUserCart(userId: string): Promise<CartItem[]> {
      try {
        const cartQuery = query(
          collection(db, this.collectionName),
          where('userId', '==', userId)
        )
        
        const querySnapshot = await getDocs(cartQuery)
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as CartItem))
        
      } catch (error: any) {
        console.error('Error fetching user cart:', error)
        
        // Fallback to empty array if Firestore is unavailable
        if (error.code === 'unavailable' || error.code === 'failed-precondition') {
          console.warn('Firestore unavailable, returning empty cart')
          return []
        }
        
        throw new Error(`Failed to fetch cart: ${error.message}`)
      }
    }
  
    // Add item to cart
    async addToCart(userId: string, productId: string, quantity: number, productData: any): Promise<string> {
      try {
        const cartItem = {
          userId,
          productId,
          quantity,
          product: {
            name: productData.name,
            price: productData.price,
            imageUrl: productData.imageUrl,
            requiresPrescription: productData.requiresPrescription,
            stock: productData.stock
          },
          addedAt: new Date()
        }
  
        const docRef = await addDoc(collection(db, this.collectionName), cartItem)
        return docRef.id
        
      } catch (error: any) {
        console.error('Error adding to cart:', error)
        throw new Error(`Failed to add to cart: ${error.message}`)
      }
    }
  
    // Update cart item quantity
    async updateCartItemQuantity(cartItemId: string, quantity: number): Promise<void> {
      try {
        const cartItemRef = doc(db, this.collectionName, cartItemId)
        await updateDoc(cartItemRef, {
          quantity,
          addedAt: new Date()
        })
      } catch (error: any) {
        console.error('Error updating cart item:', error)
        throw new Error(`Failed to update cart item: ${error.message}`)
      }
    }
  
    // Remove item from cart
    async removeFromCart(cartItemId: string): Promise<void> {
      try {
        const cartItemRef = doc(db, this.collectionName, cartItemId)
        await deleteDoc(cartItemRef)
      } catch (error: any) {
        console.error('Error removing from cart:', error)
        throw new Error(`Failed to remove from cart: ${error.message}`)
      }
    }
  
    // Clear user's cart
    async clearUserCart(userId: string): Promise<void> {
      try {
        const userCart = await this.getUserCart(userId)
        const deletePromises = userCart.map(item => 
          deleteDoc(doc(db, this.collectionName, item.id))
        )
        
        await Promise.all(deletePromises)
      } catch (error: any) {
        console.error('Error clearing cart:', error)
        throw new Error(`Failed to clear cart: ${error.message}`)
      }
    }
  }
  
  export const cartService = new CartService()
  export default CartService