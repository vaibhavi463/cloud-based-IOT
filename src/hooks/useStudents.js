import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Real-time hook for the `students` Firestore collection.
 * Returns { students, loading, error, addStudent, updateStudent, deleteStudent }
 */
export function useStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'students'), orderBy('name'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStudents(data);
        setLoading(false);
      },
      (err) => {
        console.error('Students listener error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addStudent = async (uid, studentData) => {
    try {
      await setDoc(doc(db, 'students', uid), studentData);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateStudent = async (uid, studentData) => {
    try {
      await setDoc(doc(db, 'students', uid), studentData, { merge: true });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const removeStudent = async (uid) => {
    try {
      await deleteDoc(doc(db, 'students', uid));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return { students, loading, error, addStudent, updateStudent, removeStudent };
}
