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
  signup: (data: SignupData) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  isLoading: boolean;
  signUpMessage: string | null;
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
  const [signUpMessage, setSignUpMessage] = useState<string | null>(null);

  // Listen for auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        
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
          } else {
            // If no profile exists, create one
            if (session.user.email_confirmed_at) {
              const { error: profileError } = await supabase
                .from('profiles')
                .insert([
                  {
                    id: session.user.id,
                    email: session.user.email,
                    first_name: '',
                    last_name: '',
                    created_at: new Date().toISOString(),
                    is_host: false
                  }
                ]);

              if (!profileError) {
                setUser({
                  id: session.user.id,
                  email: session.user.email!,
                  firstName: '',
                  lastName: '',
                  joinDate: new Date().toISOString(),
                  isHost: false
                });
              }
            }
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

      // Check if email is confirmed
      if (!data.user.email_confirmed_at) {
        throw new Error('Please confirm your email before logging in');
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
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName
          }
        }
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
          console.error('Profile creation error:', profileError);
          // Don't throw error here as user is created
        }

        setSignUpMessage('Please check your email to confirm your account before logging in.');
        return { success: true, message: 'Registration successful! Please check your email to confirm your account.' };
      }

      return { success: false, message: 'Registration failed' };
    } catch (error) {
      setIsLoading(false);
      const message = error instanceof Error ? error.message : 'Registration failed';
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error(error.message);
      }
      setUser(null);
      setSignUpMessage(null);
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
    isLoading,
    signUpMessage
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
