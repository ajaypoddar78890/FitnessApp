import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Runtime-safe initializer: require the JSON config (bundler will include it)
let firebaseConfig = null;
try {
  // google-services.json is at project root; require will be handled by Metro bundler
  // when this file is bundled. This avoids using Node fs APIs at runtime.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const googleServices = require('../google-services.json');
  const client = (googleServices && googleServices.client && googleServices.client[0]) || null;
  const apiKey = client && client.api_key && client.api_key[0] && client.api_key[0].current_key;
  const appId = client && client.client_info && client.client_info.mobilesdk_app_id;
  const projectId = googleServices && googleServices.project_info && googleServices.project_info.project_id;
  const storageBucket = googleServices && googleServices.project_info && googleServices.project_info.storage_bucket;
  const messagingSenderId = googleServices && googleServices.project_info && googleServices.project_info.project_number;

  if (apiKey && appId && projectId) {
    firebaseConfig = {
      apiKey,
      authDomain: `${projectId}.firebaseapp.com`,
      projectId,
      storageBucket,
      messagingSenderId,
      appId,
    };
  }
} catch (e) {
  // ignore: file may not exist in some environments
}

// Fallback: use env vars or placeholders
if (!firebaseConfig) {
  firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY || '<YOUR_API_KEY>',
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || '<YOUR_AUTH_DOMAIN>',
    projectId: process.env.FIREBASE_PROJECT_ID || '<YOUR_PROJECT_ID>',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '<YOUR_STORAGE_BUCKET>',
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '<YOUR_SENDER_ID>',
    appId: process.env.FIREBASE_APP_ID || '<YOUR_APP_ID>',
  };
}

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

export const auth = getAuth();
export const db = getFirestore();
export default firebaseConfig;
