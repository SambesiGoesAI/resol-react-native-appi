// Mock authentication service for testing without Supabase
// This file can be used when Supabase is not configured

export interface MockUser {
  id: string;
  email: string;
  role: string;
  access_code: string;
}

// Mock users database
const mockUsers: MockUser[] = [
  {
    id: '1',
    email: 'admin@example.com',
    access_code: 'ADMIN123',
    role: 'admin',
  },
  {
    id: '2',
    email: 'user@example.com',
    access_code: 'USER456',
    role: 'user',
  },
  {
    id: '3',
    email: 'guest@example.com',
    access_code: 'GUEST789',
    role: 'guest',
  },
];

export const mockAuthService = {
  async signInWithAccessCode(accessCode: string): Promise<{ user: MockUser | null; error: string | null }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(u => u.access_code === accessCode);
    
    if (user) {
      return { user, error: null };
    }
    
    return { user: null, error: 'Invalid access code' };
  },

  async signOut() {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return { error: null };
  },

  async getCurrentUser() {
    // In a real implementation, this would check stored session
    return null;
  },
};

// Export a flag to indicate if we're using mock auth
export const USE_MOCK_AUTH = !process.env.EXPO_PUBLIC_SUPABASE_URL || 
                             process.env.EXPO_PUBLIC_SUPABASE_URL === 'YOUR_SUPABASE_URL';