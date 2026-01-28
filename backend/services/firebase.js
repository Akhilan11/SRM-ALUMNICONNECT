/**
 * Firebase Admin Service
 * Centralized database operations
 */
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from '../config/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db;

/**
 * Initialize Firebase Admin SDK
 */
export const initializeFirebase = () => {
  if (getApps().length === 0) {
    const serviceAccountPath = path.resolve(__dirname, '../serviceAccountKey.json');
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath));
    
    initializeApp({
      credential: cert(serviceAccount),
    });
  }
  db = getFirestore();
  return db;
};

/**
 * Get Firestore instance
 */
export const getFirestoreDb = () => {
  if (!db) {
    return initializeFirebase();
  }
  return db;
};

/**
 * Fetch all documents from a collection
 */
export const fetchCollection = async (collectionName) => {
  try {
    const snapshot = await getFirestoreDb().collection(collectionName).get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error(`Error fetching ${collectionName}:`, error);
    return [];
  }
};

/**
 * Fetch all data needed for chatbot context
 */
export const fetchAllChatbotData = async () => {
  const collections = config.collections;

  const [events, fundraising, internships, notifications, users, mentorships] =
    await Promise.all([
      fetchCollection(collections.events),
      fetchCollection(collections.fundraising),
      fetchCollection(collections.internships),
      fetchCollection(collections.notifications),
      fetchCollection(collections.users),
      fetchCollection(collections.mentorship),
    ]);

  return {
    events,
    fundraising,
    internships,
    notifications,
    users,
    mentorships,
  };
};

export default {
  initializeFirebase,
  getFirestoreDb,
  fetchCollection,
  fetchAllChatbotData,
};
