import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Real-time hook for the `attendance` Firestore collection.
 * Returns { records, loading, error }
 * @param {number} [maxRecords] - Optional limit on records fetched
 */
export function useAttendance(maxRecords = 500) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, 'attendance'),
      orderBy('timestamp', 'desc'),
      limit(maxRecords)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecords(data);
        setLoading(false);
      },
      (err) => {
        console.error('Attendance listener error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [maxRecords]);

  return { records, loading, error };
}
