// lib/firebase/config.ts
import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getFirestore, Firestore, enableIndexedDbPersistence } from 'firebase/firestore'
import { getAuth, Auth } from 'firebase/auth'
import { getStorage, FirebaseStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyBS2nFdjAU9x8l3M-uI7WjflXovL8hSk7A",
  authDomain: "pharmacare-10111.firebaseapp.com",
  projectId: "pharmacare-10111",
  storageBucket: "pharmacare-10111.firebasestorage.app",
  messagingSenderId: "767186939808",
  appId: "1:767186939808:web:17b9055f844c134aa43ec5",
  measurementId: "G-BMC4VV5YTR"
}

// Initialize Firebase
let app: FirebaseApp
let db: Firestore
let auth: Auth
let storage: FirebaseStorage

try {
  console.log('🔄 Initializing Firebase...')
  
  if (!getApps().length) {
    app = initializeApp(firebaseConfig)
    console.log('✅ Firebase app initialized')
  } else {
    app = getApps()[0]
    console.log('✅ Using existing Firebase app')
  }

  // Initialize services
  db = getFirestore(app)
  auth = getAuth(app)
  storage = getStorage(app)
  
  console.log('✅ Firebase services initialized')
  console.log('📊 Project ID:', firebaseConfig.projectId)
  
} catch (error) {
  console.error('❌ Firebase initialization error:', error)
  throw new Error('Firebase initialization failed: ' + error)
}

// Enable offline persistence
export const enablePersistence = () => {
  if (typeof window !== 'undefined' && db) {
    enableIndexedDbPersistence(db).catch((err) => {
      if (err.code == 'failed-precondition') {
        console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.')
      } else if (err.code == 'unimplemented') {
        console.warn('The current browser doesn\'t support persistence.')
      }
    }).then(() => {
      console.log('✅ Firebase persistence enabled')
    })
  }
}

// Export initialized services
export { app, db, auth, storage }