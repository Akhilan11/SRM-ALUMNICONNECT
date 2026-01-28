/**
 * Firebase service - Centralized Firebase operations
 */
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  writeBatch,
  serverTimestamp,
  getCountFromServer,
} from 'firebase/firestore';
import { db } from '../firebase';
import { COLLECTIONS } from '../config/constants';

/**
 * Generic Firestore CRUD operations
 */

// Get all documents from a collection
export const getCollection = async (collectionName, options = {}) => {
  try {
    const { orderByField, orderDirection = 'desc', limitCount, whereClause } = options;
    
    let q = collection(db, collectionName);
    
    if (whereClause) {
      q = query(q, where(whereClause.field, whereClause.operator, whereClause.value));
    }
    
    if (orderByField) {
      q = query(q, orderBy(orderByField, orderDirection));
    }
    
    if (limitCount) {
      q = query(q, limit(limitCount));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error(`Error fetching ${collectionName}:`, error);
    throw error;
  }
};

// Get single document by ID
export const getDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching document ${docId}:`, error);
    throw error;
  }
};

// Create or set a document
export const createDocument = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: docId, ...data };
  } catch (error) {
    console.error(`Error creating document:`, error);
    throw error;
  }
};

// Update a document
export const updateDocument = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return { id: docId, ...data };
  } catch (error) {
    console.error(`Error updating document ${docId}:`, error);
    throw error;
  }
};

// Delete a document
export const deleteDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    return docId;
  } catch (error) {
    console.error(`Error deleting document ${docId}:`, error);
    throw error;
  }
};

// Get collection count
export const getCollectionCount = async (collectionName) => {
  try {
    const snapshot = await getCountFromServer(collection(db, collectionName));
    return snapshot.data().count;
  } catch (error) {
    console.error(`Error counting ${collectionName}:`, error);
    throw error;
  }
};

// Batch write documents
export const batchCreate = async (collectionName, documents) => {
  try {
    const batch = writeBatch(db);
    
    documents.forEach((docData) => {
      const docRef = doc(db, collectionName, docData.id || Date.now().toString());
      batch.set(docRef, {
        ...docData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    });
    
    await batch.commit();
    return documents;
  } catch (error) {
    console.error(`Error batch creating documents:`, error);
    throw error;
  }
};

/**
 * Collection-specific services
 */

// Users
export const usersService = {
  getAll: () => getCollection(COLLECTIONS.USERS),
  getById: (id) => getDocument(COLLECTIONS.USERS, id),
  create: (id, data) => createDocument(COLLECTIONS.USERS, id, data),
  update: (id, data) => updateDocument(COLLECTIONS.USERS, id, data),
  delete: (id) => deleteDocument(COLLECTIONS.USERS, id),
  getCount: () => getCollectionCount(COLLECTIONS.USERS),
};

// Events
export const eventsService = {
  getAll: (options) => getCollection(COLLECTIONS.EVENTS, options),
  getById: (id) => getDocument(COLLECTIONS.EVENTS, id),
  create: (id, data) => createDocument(COLLECTIONS.EVENTS, id, data),
  update: (id, data) => updateDocument(COLLECTIONS.EVENTS, id, data),
  delete: (id) => deleteDocument(COLLECTIONS.EVENTS, id),
  getCount: () => getCollectionCount(COLLECTIONS.EVENTS),
  getUpcoming: (limit = 5) =>
    getCollection(COLLECTIONS.EVENTS, {
      orderByField: 'date',
      orderDirection: 'desc',
      limitCount: limit,
    }),
};

// Fundraising
export const fundraisingService = {
  getAll: (options) => getCollection(COLLECTIONS.FUNDRAISING, options),
  getById: (id) => getDocument(COLLECTIONS.FUNDRAISING, id),
  create: (id, data) => createDocument(COLLECTIONS.FUNDRAISING, id, data),
  update: (id, data) => updateDocument(COLLECTIONS.FUNDRAISING, id, data),
  delete: (id) => deleteDocument(COLLECTIONS.FUNDRAISING, id),
  getCount: () => getCollectionCount(COLLECTIONS.FUNDRAISING),
  getActive: (limit = 5) =>
    getCollection(COLLECTIONS.FUNDRAISING, {
      orderByField: 'createdAt',
      orderDirection: 'desc',
      limitCount: limit,
    }),
};

// Internships/Opportunities
export const opportunitiesService = {
  getAll: (options) => getCollection(COLLECTIONS.INTERNSHIPS, options),
  getById: (id) => getDocument(COLLECTIONS.INTERNSHIPS, id),
  create: (id, data) => createDocument(COLLECTIONS.INTERNSHIPS, id, data),
  update: (id, data) => updateDocument(COLLECTIONS.INTERNSHIPS, id, data),
  delete: (id) => deleteDocument(COLLECTIONS.INTERNSHIPS, id),
  getCount: () => getCollectionCount(COLLECTIONS.INTERNSHIPS),
  getRecent: (limit = 5) =>
    getCollection(COLLECTIONS.INTERNSHIPS, {
      orderByField: 'createdAt',
      orderDirection: 'desc',
      limitCount: limit,
    }),
};

// Notifications/Announcements
export const notificationsService = {
  getAll: (options) => getCollection(COLLECTIONS.NOTIFICATIONS, options),
  getById: (id) => getDocument(COLLECTIONS.NOTIFICATIONS, id),
  create: (id, data) => createDocument(COLLECTIONS.NOTIFICATIONS, id, data),
  update: (id, data) => updateDocument(COLLECTIONS.NOTIFICATIONS, id, data),
  delete: (id) => deleteDocument(COLLECTIONS.NOTIFICATIONS, id),
  getCount: () => getCollectionCount(COLLECTIONS.NOTIFICATIONS),
  getRecent: (limit = 5) =>
    getCollection(COLLECTIONS.NOTIFICATIONS, {
      orderByField: 'createdAt',
      orderDirection: 'desc',
      limitCount: limit,
    }),
};

// Mentorship
export const mentorshipService = {
  getAll: (options) => getCollection(COLLECTIONS.MENTORSHIP, options),
  getById: (id) => getDocument(COLLECTIONS.MENTORSHIP, id),
  create: (id, data) => createDocument(COLLECTIONS.MENTORSHIP, id, data),
  update: (id, data) => updateDocument(COLLECTIONS.MENTORSHIP, id, data),
  delete: (id) => deleteDocument(COLLECTIONS.MENTORSHIP, id),
  getCount: () => getCollectionCount(COLLECTIONS.MENTORSHIP),
};
