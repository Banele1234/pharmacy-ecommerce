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

// Custom error class for better error handling
export class AuthError extends Error {
  code: string;
  
  constructor(code: string, message: string) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
  }
}

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
      
      // Check if error has code property (Firebase error)
      if (error?.code) {
        throw new AuthError(error.code, this.getErrorMessage(error.code));
      } 
      // Check if it's our custom AuthError
      else if (error instanceof AuthError) {
        throw error;
      }
      // Generic error
      else {
        throw new AuthError('auth/unknown-error', error?.message || 'An unexpected error occurred. Please try again.');
      }
    }
  }

  // Sign in existing user - IMPROVED ERROR HANDLING
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
      
      // Check if error has code property (Firebase error)
      if (error?.code) {
        // Log the actual error for debugging
        console.error('Firebase error details:', {
          code: error.code,
          message: error.message,
          fullError: error
        });
        
        throw new AuthError(error.code, this.getErrorMessage(error.code));
      } 
      // Check if it's our custom AuthError
      else if (error instanceof AuthError) {
        throw error;
      }
      // Generic error
      else {
        console.error('Unknown error type:', error);
        throw new AuthError('auth/unknown-error', error?.message || 'An unexpected error occurred. Please try again.');
      }
    }
  }

  // Sign out user
  static async signOutUser(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error('Firebase signout error:', error);
      
      if (error?.code) {
        throw new AuthError(error.code, this.getErrorMessage(error.code));
      } else {
        throw new AuthError('auth/unknown-error', error?.message || 'An unexpected error occurred during sign out.');
      }
    }
  }

  // Reset password
  static async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      console.error('Firebase reset password error:', error);
      
      if (error?.code) {
        throw new AuthError(error.code, this.getErrorMessage(error.code));
      } else {
        throw new AuthError('auth/unknown-error', error?.message || 'An unexpected error occurred while resetting password.');
      }
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
        throw new AuthError('auth/no-user', 'No user is currently signed in');
      }
    } catch (error: any) {
      console.error('Firebase send verification email error:', error);
      
      if (error instanceof AuthError) {
        throw error;
      } else if (error?.code) {
        throw new AuthError(error.code, this.getErrorMessage(error.code));
      } else {
        throw new AuthError('auth/unknown-error', error?.message || 'An unexpected error occurred while sending verification email.');
      }
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

  // Get user-friendly error messages - UPDATED WITH MORE ERROR CODES
  private static getErrorMessage(errorCode: string): string {
    const errorMessages: { [key: string]: string } = {
      // Common authentication errors
      'auth/invalid-credential': 'Invalid email or password. Please try again.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/user-disabled': 'This account has been disabled. Please contact support.',
      'auth/user-not-found': 'No account found with this email address.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/email-already-in-use': 'This email is already registered. Please use a different email or try logging in.',
      'auth/operation-not-allowed': 'Email/password accounts are not enabled. Please contact support.',
      'auth/weak-password': 'Password is too weak. Please use at least 6 characters.',
      'auth/too-many-requests': 'Too many unsuccessful login attempts. Please try again later.',
      'auth/network-request-failed': 'Network error. Please check your internet connection and try again.',
      'auth/popup-closed-by-user': 'Login popup was closed before completing authentication.',
      'auth/popup-blocked': 'Login popup was blocked by your browser. Please allow popups for this site.',
      'auth/unauthorized-domain': 'This domain is not authorized for Firebase Authentication.',
      'auth/cancelled-popup-request': 'Only one popup request is allowed at a time.',
      'auth/account-exists-with-different-credential': 'An account already exists with the same email address but different sign-in credentials.',
      'auth/credential-already-in-use': 'This credential is already associated with a different user account.',
      'auth/requires-recent-login': 'This operation requires recent authentication. Please log out and log back in.',
      'auth/provider-already-linked': 'This provider is already linked to your account.',
      'auth/no-such-provider': 'This provider is not linked to your account.',
      
      // Email verification errors
      'auth/email-not-verified': 'Please verify your email address before signing in.',
      
      // Custom errors
      'auth/no-user': 'No user is currently signed in.',
      'auth/unknown-error': 'An unexpected error occurred. Please try again.',
      
      // Password reset errors
      'auth/expired-action-code': 'The password reset code has expired. Please request a new one.',
      'auth/invalid-action-code': 'The password reset code is invalid. Please request a new one.',
    };

    // Default message for unknown error codes
    return errorMessages[errorCode] || 'An authentication error occurred. Please try again.';
  }

  // Get current user
  static getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return !!auth.currentUser;
  }

  // Get authentication state changes
  static onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    return auth.onAuthStateChanged(callback);
  }
}