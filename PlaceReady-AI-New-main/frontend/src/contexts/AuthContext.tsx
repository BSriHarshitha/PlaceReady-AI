import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebase';
import { apiService } from '../services/apiService';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, userData: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
  college?: string;
  branch?: string;
  year?: number;
  createdAt: Date;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const signup = async (email: string, password: string, userData: Partial<UserProfile>) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      await updateProfile(user, {
        displayName: userData.name || ''
      });

      const profile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        name: userData.name || '',
        role: userData.role || 'student',
        college: userData.college,
        branch: userData.branch,
        year: userData.year,
        createdAt: new Date(),
      };

      // Save to backend
      await apiService.saveUserProfile(user.uid, profile);
      
      // Keep localStorage as backup
      localStorage.setItem(`profile_${user.uid}`, JSON.stringify(profile));
      setUserProfile(profile);
    } catch (error: any) {
      console.error('Signup error:', error);
      throw new Error(error.message);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
    } catch (error: any) {
      console.error('Logout error:', error);
      throw new Error(error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          // Try to get profile from backend first
          let profile = await apiService.getUserProfile(user.uid);
          
          if (!profile) {
            // Fallback to localStorage
            const storedProfile = localStorage.getItem(`profile_${user.uid}`);
            if (storedProfile) {
              profile = JSON.parse(storedProfile);
              // Save to backend for future use
              await apiService.saveUserProfile(user.uid, profile);
            } else {
              // Create basic profile
              profile = {
                uid: user.uid,
                email: user.email!,
                name: user.displayName || user.email!.split('@')[0],
                role: user.email!.includes('admin') ? 'admin' : 'student',
                createdAt: new Date(),
              };
              await apiService.saveUserProfile(user.uid, profile);
              localStorage.setItem(`profile_${user.uid}`, JSON.stringify(profile));
            }
          }
          
          setUserProfile(profile);
        } catch (error) {
          console.error('Error loading user profile:', error);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    userProfile,
    login,
    signup,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};