import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

export function getDb() {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID
  const appId = import.meta.env.VITE_FIREBASE_APP_ID
  const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN
  const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET
  const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID

  if (!apiKey || !projectId || !appId) {
    return null
  }

  if (getApps().length === 0) {
    initializeApp({
      apiKey,
      authDomain,
      projectId,
      storageBucket,
      messagingSenderId,
      appId,
    })
  }

  return getFirestore()
}


