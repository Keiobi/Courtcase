'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { getAuthInstance } from '@/services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Define the shape of our context
interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  authInitialized: boolean;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isLoading: true,
  authInitialized: false
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    console.log('Setting up auth state listener');
    const auth = getAuthInstance();
    
    // Set up the Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user ? `User: ${user.email}` : 'No user');
      setCurrentUser(user);
      setIsLoading(false);
      setAuthInitialized(true);
    }, (error) => {
      console.error('Auth state change error:', error);
      setIsLoading(false);
      setAuthInitialized(true);
    });

    // Clean up the listener when the component unmounts
    return () => {
      console.log('Cleaning up auth state listener');
      unsubscribe();
    };
  }, []);

  const value = {
    currentUser,
    isLoading,
    authInitialized
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
