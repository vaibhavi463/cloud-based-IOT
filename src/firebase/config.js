import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCSt_blqmNmFo7KjodhLiWEZcweobgShys",
  authDomain: "rfid-attendance-system-498216.firebaseapp.com",
  projectId: "rfid-attendance-system-498216",
  storageBucket: "rfid-attendance-system-498216.firebasestorage.app",
  messagingSenderId: "334528977659",
  appId: "1:334528977659:web:aca25845df45fba06cee5e",
  measurementId: "G-185804REZT"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;


