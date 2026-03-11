"use client"

import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore/lite';
import { auth, db } from './firebase';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  login: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Set up global error handlers
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      event.preventDefault();
    };

    const handleError = (event: ErrorEvent) => {
      console.error('Unhandled error:', event.error);
      event.preventDefault();
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection as EventListener);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection as EventListener);
      window.removeEventListener('error', handleError);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout | null = null;

    // Set a timeout to ensure loading doesn't hang forever
    timeoutId = setTimeout(() => {
      if (isMounted) {
        console.warn('Auth state check timed out, setting loading to false');
        setLoading(false);
      }
    }, 5000); // 5 second timeout

    try {
      const unsubscribe = onAuthStateChanged(
        auth,
        async (user) => {
          if (!isMounted) return;
          
          try {
            setUser(user);
            
            // Check if user is admin
            if (user) {
              try {
                const adminDoc = await getDoc(doc(db, 'admins', user.uid));
                if (isMounted) {
                  setIsAdmin(adminDoc.exists());
                }
              } catch (error) {
                console.error('Error checking admin status:', error);
                if (isMounted) {
                  setIsAdmin(false);
                }
              }
            } else {
              if (isMounted) {
                setIsAdmin(false);
              }
            }
          } catch (error) {
            console.error('Error in auth state change:', error);
            if (isMounted) {
              setUser(null);
              setIsAdmin(false);
            }
          } finally {
            if (timeoutId) {
              clearTimeout(timeoutId);
              timeoutId = null;
            }
            if (isMounted) {
              setLoading(false);
            }
          }
        },
        (error) => {
          console.error('Auth state change error:', error);
          if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
          }
          if (isMounted) {
            setUser(null);
            setIsAdmin(false);
            setLoading(false);
          }
        }
      );

      return () => {
        isMounted = false;
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        unsubscribe();
      };
    } catch (error) {
      console.error('Error setting up auth listener:', error);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (isMounted) {
        setLoading(false);
      }
      return () => {
        isMounted = false;
      };
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Check admin status after login
      const adminDoc = await getDoc(doc(db, 'admins', result.user.uid));
      if (!adminDoc.exists()) {
        await signOut(auth);
        throw new Error('Access denied. This account does not have admin privileges.');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to login');
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setIsAdmin(false);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to logout');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
