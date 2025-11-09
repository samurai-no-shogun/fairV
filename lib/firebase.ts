/**
 * Firebase Configuration and Initialization
 * 
 * Initializes Firebase services for the TCG Price Scout app.
 * Uses environment variables for configuration.
 * 
 * @module lib/firebase
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

/**
 * Firebase configuration from environment variables
 * All values are public and safe to expose in client code
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/**
 * Initialize Firebase app
 * Ensures only one instance is created (important for hot reload)
 * 
 * @returns Initialized Firebase app instance
 */
function initializeFirebase(): FirebaseApp {
  // Check if Firebase is already initialized
  if (getApps().length > 0) {
    return getApps()[0];
  }
  
  // Validate configuration
  const missingVars: string[] = [];
  Object.entries(firebaseConfig).forEach(([key, value]) => {
    if (!value) {
      missingVars.push(key);
    }
  });
  
  if (missingVars.length > 0) {
    throw new Error(
      `Missing Firebase configuration variables: ${missingVars.join(', ')}. ` +
      'Please check your .env.local file.'
    );
  }
  
  // Initialize and return app
  return initializeApp(firebaseConfig);
}

// Initialize Firebase
const app = initializeFirebase();

// Export Firebase services
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);

// Export app for cases where direct app reference is needed
export default app;

/**
 * Firebase initialization status
 * Useful for debugging and health checks
 */
export function getFirebaseStatus(): {
  initialized: boolean;
  projectId: string;
  services: {
    auth: boolean;
    firestore: boolean;
    storage: boolean;
  };
} {
  return {
    initialized: getApps().length > 0,
    projectId: firebaseConfig.projectId || 'unknown',
    services: {
      auth: !!auth,
      firestore: !!db,
      storage: !!storage,
    },
  };
}

/**
 * Log Firebase initialization status (development only)
 */
if (process.env.NODE_ENV === 'development') {
  const status = getFirebaseStatus();
  console.log('🔥 Firebase initialized:', status);
}
