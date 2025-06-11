import { supabase } from './supabase';
import { mockAuthService, USE_MOCK_AUTH } from './mockAuth';

export interface User {
  id: string;
  email?: string;
  role: string;
  access_code: string;
  housing_companies?: string[]; // Array of housing company IDs
}

export const authService = {
  async signInWithAccessCode(accessCode: string): Promise<{ user: User | null; error: string | null }> {
    // Use mock auth if Supabase is not configured
    if (USE_MOCK_AUTH || !supabase) {
      return mockAuthService.signInWithAccessCode(accessCode);
    }

    try {
      // First, query the users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('access_code', accessCode)
        .single();

      if (userError || !userData) {
        return { user: null, error: 'Invalid access code' };
      }

      // Then, query the user_housing_companies table separately
      const { data: housingCompaniesData, error: housingError } = await supabase
        .from('user_housing_companies')
        .select('housing_company_id')
        .eq('user_id', userData.id);

      if (housingError) {
        // Silent fail - housing companies fetch error
      }

      const housingCompanyIds = housingCompaniesData?.map(
        (uhc: any) => uhc.housing_company_id
      ) || [];

      // Return the user data directly without attempting Supabase auth
      // This app uses custom access code authentication, not Supabase auth
      return {
        user: {
          id: userData.id,
          email: userData.email,
          role: userData.role,
          access_code: userData.access_code,
          housing_companies: housingCompanyIds,
        },
        error: null
      };
    } catch (error) {
      return { user: null, error: 'Authentication failed' };
    }
  },

  async signOut() {
    // Since we're using custom auth, just return success
    // The actual logout is handled by clearing AsyncStorage in the app
    if (USE_MOCK_AUTH || !supabase) {
      return mockAuthService.signOut();
    }
    return { error: null };
  },

  async getCurrentUser() {
    // Since we're using custom auth, this should be handled by AsyncStorage
    // Return null as we don't maintain a Supabase session
    if (USE_MOCK_AUTH || !supabase) {
      return mockAuthService.getCurrentUser();
    }
    return null;
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    // Return a dummy implementation since we're not using Supabase auth
    return {
      data: { subscription: null },
      error: null,
      unsubscribe: () => {}
    };
  },
};