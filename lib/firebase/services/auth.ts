import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config';
import { User } from '../../types/firebase';

export class AuthService {
  // Sign up new user
  static async signUp(email: string, password: string, displayName: string): Promise<User> {
    try {
      console.log('Creating user in Firebase Auth:', { email, displayName });
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      console.log('Firebase user created:', firebaseUser.uid);

      // Update profile with display name
      await updateProfile(firebaseUser, {
        displayName: displayName
      });

      // Send email verification
      await sendEmailVerification(firebaseUser);
      console.log('Verification email sent');

      // Create user document in Firestore
      const userData: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        displayName: displayName,
        photoURL: firebaseUser.photoURL || '',
        createdAt: new Date(),
        role: 'customer', // Default role for new signups
        phone: '',
        emailVerified: false
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      console.log('User document created in Firestore');

      return userData;
    } catch (error: any) {
      console.error('Firebase signup error:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Sign in existing user - FIXED VERSION
  static async signIn(email: string, password: string): Promise<User> {
    try {
      console.log('🔄 Starting sign in process for:', email);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      console.log('✅ Firebase Auth successful');
      console.log('👤 User UID:', firebaseUser.uid);

      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('📄 Firestore document found:', userData);
        
        // Normalize role with better logging
        const rawRole = userData?.role;
        console.log('🎯 Raw role from Firestore:', rawRole);
        
        const normalizedRole = 
          typeof rawRole === 'string' && rawRole.toLowerCase() === 'admin' 
            ? 'admin' 
            : 'customer';
            
        console.log('✅ Normalized role:', normalizedRole);

        const formattedUser: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: userData.displayName || firebaseUser.displayName || '',
          photoURL: userData.photoURL || firebaseUser.photoURL || '',
          createdAt: userData.createdAt?.toDate() || new Date(),
          role: normalizedRole,
          phone: userData.phone || '',
          emailVerified: firebaseUser.emailVerified
        };

        console.log('👤 Final user object with role:', formattedUser);
        return formattedUser;
        
      } else {
        console.log('❌ No user document found in Firestore, creating one...');
        
        // Create user document if it doesn't exist
        const userData: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName || '',
          photoURL: firebaseUser.photoURL || '',
          createdAt: new Date(),
          role: 'customer', // Default role
          phone: '',
          emailVerified: firebaseUser.emailVerified
        };
        
        await setDoc(doc(db, 'users', firebaseUser.uid), userData);
        console.log('✅ Created new user document with customer role');
        
        return userData;
      }
    } catch (error: any) {
      console.error('❌ Firebase signin error:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Sign out user
  static async signOutUser(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error('Firebase signout error:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Reset password
  static async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      console.error('Firebase reset password error:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Send email verification
  static async sendVerificationEmail(): Promise<void> {
    try {
      const user = auth.currentUser;
      if (user) {
        await sendEmailVerification(user);
        console.log('Verification email sent successfully');
      } else {
        throw new Error('No user is currently signed in');
      }
    } catch (error: any) {
      console.error('Firebase send verification email error:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Convert Firebase user to our User type
  static formatUser(firebaseUser: FirebaseUser): User {
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email!,
      displayName: firebaseUser.displayName || '',
      photoURL: firebaseUser.photoURL || '',
      createdAt: new Date(),
      role: 'customer',
      phone: '',
      emailVerified: firebaseUser.emailVerified
    };
  }

  // Get user-friendly error messages
  private static getErrorMessage(errorCode: string): string {
    const errorMessages: { [key: string]: string } = {
      'auth/email-already-in-use': 'This email is already registered. Please use a different email or try logging in.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/operation-not-allowed': 'Email/password accounts are not enabled. Please contact support.',
      'auth/weak-password': 'Password is too weak. Please use at least 6 characters.',
      'auth/user-disabled': 'This account has been disabled. Please contact support.',
      'auth/user-not-found': 'No account found with this email address.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/too-many-requests': 'Too many unsuccessful login attempts. Please try again later.',
      'auth/network-request-failed': 'Network error. Please check your internet connection and try again.',
    };

    return errorMessages[errorCode] || 'An unexpected error occurred. Please try again.';
  }
}