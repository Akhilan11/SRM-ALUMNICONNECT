/**
 * Custom hooks for Firestore operations
 */
import { useState, useEffect, useCallback } from 'react';
import {
  getCollection,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument,
} from '../services/firebase';

/**
 * Hook for fetching a collection with loading/error states
 */
export function useCollection(collectionName, options = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getCollection(collectionName, options);
      setData(result);
    } catch (err) {
      setError(err.message);
      console.error(`Error fetching ${collectionName}:`, err);
    } finally {
      setLoading(false);
    }
  }, [collectionName, JSON.stringify(options)]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Hook for fetching a single document
 */
export function useDocument(collectionName, docId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!docId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await getDocument(collectionName, docId);
      setData(result);
    } catch (err) {
      setError(err.message);
      console.error(`Error fetching document ${docId}:`, err);
    } finally {
      setLoading(false);
    }
  }, [collectionName, docId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Hook for CRUD operations on a collection
 */
export function useCRUD(collectionName) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const create = useCallback(
    async (id, data) => {
      try {
        setLoading(true);
        setError(null);
        const result = await createDocument(collectionName, id, data);
        return result;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [collectionName]
  );

  const update = useCallback(
    async (id, data) => {
      try {
        setLoading(true);
        setError(null);
        const result = await updateDocument(collectionName, id, data);
        return result;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [collectionName]
  );

  const remove = useCallback(
    async (id) => {
      try {
        setLoading(true);
        setError(null);
        await deleteDocument(collectionName, id);
        return id;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [collectionName]
  );

  return { create, update, remove, loading, error };
}

/**
 * Hook for filtered data with search and filters
 */
export function useFilteredData(data, searchTerm, filters = {}) {
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    let result = [...data];

    // Apply search
    if (searchTerm?.trim()) {
      const search = searchTerm.toLowerCase();
      result = result.filter((item) =>
        Object.values(item).some(
          (value) =>
            value && value.toString().toLowerCase().includes(search)
        )
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        result = result.filter(
          (item) => item[key]?.toLowerCase() === value.toLowerCase()
        );
      }
    });

    setFilteredData(result);
  }, [data, searchTerm, JSON.stringify(filters)]);

  return filteredData;
}
