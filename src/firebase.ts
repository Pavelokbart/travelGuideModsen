// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAzJRVHHCBXefWanmgpqi9HUcHHT2TE3IY',
  authDomain: 'travelguidemodsen.firebaseapp.com',
  projectId: 'travelguidemodsen',
  storageBucket: 'travelguidemodsen.appspot.com',
  messagingSenderId: '701986009381',
  appId: '1:701986009381:web:ce71f777e47d1d422a6acc',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);
