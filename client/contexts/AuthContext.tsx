import React, { createContext, useContext, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phoneNumber?: string;
  joinDate: string;
  isHost: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      const sessionUser = data.user;
      if (!sessionUser) throw new Error('No user returned');

      // Create user object from session data
      const authUser: User = {
        id: sessionUser.id,
        email: sessionUser.email || '',
        firstName: sessionUser.user_metadata?.first_name || '',
        lastName: sessionUser.user_metadata?.last_name || '',
        avatar: sessionUser.user_metadata?.avatar_url || undefined,
        joinDate: sessionUser.created_at || new Date().toISOString(),
        isHost: false
      };

      setUser(authUser);
      localStorage.setItem('user', JSON.stringify(authUser));
      console.log('AuthContext: User logged in with ID:', authUser.id);
    } catch (err: any) {
      const message = err?.message || 'Login failed';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: SignupData) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName
          }
        }
      });
      if (signUpError) throw signUpError;
      const newUser = signUpData.user;
      if (!newUser) throw new Error('No user returned');

      const authUser: User = {
        id: newUser.id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        joinDate: new Date().toISOString(),
        isHost: false
      };

      setUser(authUser);
      localStorage.setItem('user', JSON.stringify(authUser));
    } catch (err: any) {
      const message = err?.message || 'Signup failed';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('user');
    setError(null);
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    
    try {
      // Update user metadata in Supabase
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: updates.firstName || user.firstName,
          last_name: updates.lastName || user.lastName,
          phone_number: updates.phoneNumber || user.phoneNumber
        }
      });

      if (error) throw error;

      // Update local user state
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err: any) {
      const message = err?.message || 'Failed to update profile';
      setError(message);
      throw new Error(message);
    }
  };

  // Initialize user from localStorage on mount
  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    updateUser,
    isLoading,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
