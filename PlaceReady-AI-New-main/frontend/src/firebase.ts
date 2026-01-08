import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCE4ZNA7n_9pFn2E8uHOKi2lXb3NzVMM2g",
  authDomain: "placeready-ai-new.firebaseapp.com",
  projectId: "placeready-ai-new",
  storageBucket: "placeready-ai-new.firebasestorage.app",
  messagingSenderId: "150492549778",
  appId: "1:150492549778:web:a1839888ea39c2b6b48c4b",
  measurementId: "G-YZ51MF6EZH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export default app;