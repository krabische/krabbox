import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User as SupabaseUser } from '@supabase/supabase-js';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  avatar?: string;
  joinDate: string;
  isHost: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState(true);

  // Listen for auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Get user profile from profiles table
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            setUser({
              id: session.user.id,
              email: session.user.email!,
              firstName: profile.first_name || '',
              lastName: profile.last_name || '',
              phoneNumber: profile.phone_number,
              avatar: profile.avatar_url,
              joinDate: profile.created_at || new Date().toISOString(),
              isHost: profile.is_host || false
            });
          }
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error('Login failed');
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const signup = async (data: SignupData) => {
    setIsLoading(true);
    try {
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (authData.user) {
        // Create profile in profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              first_name: data.firstName,
              last_name: data.lastName,
              email: data.email,
              created_at: new Date().toISOString(),
              is_host: false
            }
          ]);

        if (profileError) {
          throw new Error(profileError.message);
        }
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    isLoading
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
