import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  
  apiKey: "AIzaSyDjFXubOhOTPJgBiN_VnvKYVqbjsvKQVyA",
  authDomain: "snackspot-cd9c4.firebaseapp.com",
  projectId: "snackspot-cd9c4",
  storageBucket: "snackspot-cd9c4.firebasestorage.app",
  messagingSenderId: "739785021225",
  appId: "1:739785021225:web:6f28d4ac388eefcc500938",
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getDatabase(app)

