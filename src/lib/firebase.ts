import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDataConnect } from 'firebase/data-connect';
import { getFirestore } from 'firebase/firestore';
import { connectorConfig } from '@dataconnect/generated';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const hasFirebaseConfig = Object.values(firebaseConfig).every((value) => typeof value === 'string' && value.trim().length > 0);

export const isFirebaseConfigured = hasFirebaseConfig;

export const firebaseApp = hasFirebaseConfig
  ? (getApps().length > 0 ? getApp() : initializeApp(firebaseConfig))
  : null;

export const firebaseAuth = firebaseApp ? getAuth(firebaseApp) : null;
export const firebaseDb = firebaseApp ? getFirestore(firebaseApp) : null;
export const firebaseDataConnect = firebaseApp ? getDataConnect(connectorConfig) : null;

export const firebaseClientConfig = firebaseConfig;
