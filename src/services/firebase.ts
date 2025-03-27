/**
 * Firebase configuration for Courtcase frontend (Next.js version)
 * 
 * This module initializes Firebase and provides functions for Firebase Authentication.
 */

import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  User,
  UserCredential
} from 'firebase/auth';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCUFAO-KcL1ExaHRWRM0QQLVy8rzDI0Kf4",
  authDomain: "courtcase-1d089.firebaseapp.com",
  projectId: "courtcase-1d089",
  storageBucket: "courtcase-1d089.appspot.com",
  messagingSenderId: "218742692557",
  appId: "1:218742692557:web:2d35e88c857486fa776784"
};

// Initialize Firebase
let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const functions = getFunctions(app);

// Connect to local emulator when running locally
const connectToEmulator = () => {
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    console.log('Running on localhost, connecting to Firebase emulators');
    connectFunctionsEmulator(functions, 'localhost', 5001);
  }
};

// Call connectToEmulator on the client side only
if (typeof window !== 'undefined') {
  connectToEmulator();
}

/**
 * Sign in with email and password
 * @param email - User email
 * @param password - User password
 * @returns User credential
 */
export const signInWithEmail = async (email: string, password: string): Promise<UserCredential> => {
  try {
    console.log(`Attempting to sign in with email: ${email}`);
    
    // Validate inputs
    if (!email || !password) {
      console.error('Email and password are required');
      throw new Error('Email and password are required');
    }
    
    // Attempt to sign in
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Sign in successful');
    
    return userCredential;
  } catch (error: any) {
    console.error('Error signing in with email and password:', error);
    
    // Log specific error information
    if (error.code) {
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      // Log additional information for debugging
      if (error.code === 'auth/user-not-found') {
        console.error('User not found in Firebase Authentication');
      } else if (error.code === 'auth/wrong-password') {
        console.error('Wrong password provided');
      } else if (error.code === 'auth/invalid-credential') {
        console.error('Invalid credentials provided');
      } else if (error.code === 'auth/network-request-failed') {
        console.error('Network request failed - check internet connection');
      }
    }
    
    throw error;
  }
};

/**
 * Create a new user with email and password
 * @param email - User email
 * @param password - User password
 * @returns User credential
 */
export const createUserWithEmail = async (email: string, password: string): Promise<UserCredential> => {
  try {
    console.log(`Attempting to create user with email: ${email}`);
    
    // Validate inputs
    if (!email || !password) {
      console.error('Email and password are required');
      throw new Error('Email and password are required');
    }
    
    // Attempt to create user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('User creation successful');
    
    return userCredential;
  } catch (error: any) {
    console.error('Error creating user with email and password:', error);
    
    // Log specific error information
    if (error.code) {
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      // Log additional information for debugging
      if (error.code === 'auth/email-already-in-use') {
        console.error('Email is already in use');
      } else if (error.code === 'auth/invalid-email') {
        console.error('Invalid email format');
      } else if (error.code === 'auth/weak-password') {
        console.error('Password is too weak');
      } else if (error.code === 'auth/network-request-failed') {
        console.error('Network request failed - check internet connection');
      }
    }
    
    throw error;
  }
};

/**
 * Sign out the current user
 */
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

/**
 * Get the current user
 * @returns The current user or null if not signed in
 */
export const getCurrentUser = (): User | null => {
  try {
    return auth.currentUser;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Get the auth instance
 * @returns The Firebase Auth instance
 */
export const getAuthInstance = () => {
  return auth;
};

/**
 * Get the functions instance
 * @returns The Firebase Functions instance
 */
export const getFunctionsInstance = () => {
  return functions;
};

export default {
  auth,
  functions,
  signInWithEmail,
  createUserWithEmail,
  signOutUser,
  getCurrentUser,
  getAuthInstance,
  getFunctionsInstance
};
