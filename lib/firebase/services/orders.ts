import { collection, addDoc, getDocs, getDoc, doc, query, where, orderBy, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config';
import { Order, CartItem, Address } from '../../types/firebase';

export class OrderService {
  // Create a new order
  static async createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'orders'), {
        ...orderData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      
      console.log('Order created with ID:', docRef.id);
      return docRef.id;
    } catch (error: any) {
      console.error('Error creating order:', error);
      throw new Error('Failed to create order');
    }
  }

  // Get orders by user ID
  static async getOrdersByUser(userId: string): Promise<Order[]> {
    try {
      const q = query(
        collection(db, 'orders'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const orders: Order[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        orders.push({
          id: doc.id,
          userId: data.userId,
          items: data.items,
          total: data.total,
          status: data.status,
          paymentStatus: data.paymentStatus,
          paymentMethod: data.paymentMethod,
          shippingAddress: data.shippingAddress,
          prescriptionUrl: data.prescriptionUrl,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate()
        } as Order);
      });
      
      return orders;
    } catch (error: any) {
      console.error('Error getting orders:', error);
      throw new Error('Failed to load orders');
    }
  }

  // Get order by ID
  static async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const docRef = doc(db, 'orders', orderId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          userId: data.userId,
          items: data.items,
          total: data.total,
          status: data.status,
          paymentStatus: data.paymentStatus,
          paymentMethod: data.paymentMethod,
          shippingAddress: data.shippingAddress,
          prescriptionUrl: data.prescriptionUrl,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate()
        } as Order;
      }
      return null;
    } catch (error: any) {
      console.error('Error getting order:', error);
      throw new Error('Failed to load order');
    }
  }

  // Update order status
  static async updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status,
        updatedAt: Timestamp.now()
      });
    } catch (error: any) {
      console.error('Error updating order status:', error);
      throw new Error('Failed to update order status');
    }
  }

  // Update payment status
  static async updatePaymentStatus(orderId: string, paymentStatus: Order['paymentStatus']): Promise<void> {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        paymentStatus,
        updatedAt: Timestamp.now()
      });
    } catch (error: any) {
      console.error('Error updating payment status:', error);
      throw new Error('Failed to update payment status');
    }
  }
}