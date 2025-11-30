import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCmKTA_xY419YxvdghC6ZZsn36NtOyHWSA",
    authDomain: "insuranceapp-71633.firebaseapp.com",
    projectId: "insuranceapp-71633",
    storageBucket: "insuranceapp-71633.firebasestorage.app",
    messagingSenderId: "993996645787",
    appId: "1:993996645787:web:332113affff3c50f6e6d3e"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
