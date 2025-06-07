import { supabase } from './supabase';
import { mockAuthService, USE_MOCK_AUTH } from './mockAuth';

export interface User {
  id: string;
  email?: string;
  role: string;
  access_code: string;
}

export const authService = {
  async signInWithAccessCode(accessCode: string): Promise<{ user: User | null; error: string | null }> {
    // Use mock auth if Supabase is not configured
    if (USE_MOCK_AUTH || !supabase) {
      return mockAuthService.signInWithAccessCode(accessCode);
    }

    try {
      // Query the users table for a matching access code
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('access_code', accessCode)
        .single();

      if (error || !data) {
        return { user: null, error: 'Invalid access code' };
      }

      // Create a session for the user
      const { data: sessionData, error: sessionError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: accessCode, // Using access code as password for simplicity
      });

      if (sessionError) {
        // If standard auth fails, we'll store the user data in AsyncStorage
        // This is a fallback for custom authentication
        return { 
          user: {
            id: data.id,
            email: data.email,
            role: data.role,
            access_code: data.access_code,
          }, 
          error: null 
        };
      }

      return { 
        user: {
          id: data.id,
          email: data.email,
          role: data.role,
          access_code: data.access_code,
        }, 
        error: null 
      };
    } catch (error) {
      return { user: null, error: 'Authentication failed' };
    }
  },

  async signOut() {
    if (USE_MOCK_AUTH || !supabase) {
      return mockAuthService.signOut();
    }
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser() {
    if (USE_MOCK_AUTH || !supabase) {
      return mockAuthService.getCurrentUser();
    }
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    if (!supabase) {
      // Return a dummy unsubscribe function
      return { data: null, error: null, unsubscribe: () => {} };
    }
    return supabase.auth.onAuthStateChange(callback);
  },
};