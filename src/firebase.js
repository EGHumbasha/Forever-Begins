import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCIxzoCehAa4CP1pSwJcOnLk-5qmgSvWjI",
  authDomain: "forever-begins-e50d9.firebaseapp.com",
  projectId: "forever-begins-e50d9",
  storageBucket: "forever-begins-e50d9.firebasestorage.app",
  messagingSenderId: "801797575297",
  appId: "1:801797575297:web:cff6a51615158491c77380",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
