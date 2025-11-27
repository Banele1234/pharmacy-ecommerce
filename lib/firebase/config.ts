import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

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

if (!getApps().length) {
  app = initializeApp(firebaseConfig)
} else {
  app = getApps()[0]
}

// Initialize Firebase services
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)

// Enable offline persistence
export const enablePersistence = () => {
  if (typeof window !== 'undefined') {
    enableIndexedDbPersistence(db).catch((err) => {
      if (err.code == 'failed-precondition') {
        console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.')
      } else if (err.code == 'unimplemented') {
        console.warn('The current browser doesn\'t support persistence.')
      }
    })
  }
}

export default app