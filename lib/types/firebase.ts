export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  role?: "customer" | "admin"; // Add this
  phone?: string; // Add this
  emailVerified?: boolean; // Add this
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  cloudinaryPublicId: string;
  category: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  stock?: number; // Add this if needed
  requiresPrescription?: boolean; // Add this if needed
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

// Additional types from your other file
export interface CartItem {
  productId: string
  product: Product
  quantity: number
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: "pending" | "processing" | "completed" | "cancelled"
  paymentStatus: "pending" | "paid" | "failed"
  paymentMethod: "mtn_momo"
  shippingAddress: Address
  prescriptionUrl?: string
  createdAt: Date
  updatedAt: Date
}

export interface Address {
  fullName: string
  phone: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface Prescription {
  id: string
  userId: string
  orderId?: string
  imageUrl: string
  status: "pending" | "approved" | "rejected"
  notes?: string
  createdAt: Date
  updatedAt: Date
}