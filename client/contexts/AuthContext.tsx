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

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url, created_at, is_host')
        .eq('id', sessionUser.id)
        .single();
      if (profileError) throw profileError;

      const authUser: User = {
        id: sessionUser.id,
        email: sessionUser.email || '',
        firstName: profile?.first_name || '',
        lastName: profile?.last_name || '',
        avatar: profile?.avatar_url || undefined,
        joinDate: profile?.created_at || '',
        isHost: profile?.is_host || false
      };

      setUser(authUser);
      localStorage.setItem('user', JSON.stringify(authUser));
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
        password: data.password
      });
      if (signUpError) throw signUpError;
      const newUser = signUpData.user;
      if (!newUser) throw new Error('No user returned');

      const { error: profileError } = await supabase.from('profiles').upsert({
        id: newUser.id,
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName
      });
      if (profileError) throw profileError;

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
