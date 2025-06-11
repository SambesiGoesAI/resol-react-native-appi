# Role-Based News Filtering Implementation Plan

## Problem Analysis

### Current Issue
All news items are being displayed to all users regardless of their housing company assignments. The database schema for role-based filtering exists, but the application code has not been updated to implement the filtering logic.

### Root Cause
1. **NewsService**: `fetchNews()` queries all news without filtering by housing companies
2. **Authentication**: User's housing company relationships are not being fetched during login
3. **News Hook**: `useNews()` doesn't receive or use user context for filtering
4. **UI Screen**: `UutisetScreen` doesn't pass user context to news hook

## Implementation Strategy

### Phase 1: Authentication Service Updates
**File**: [`src/services/auth.ts`](../src/services/auth.ts)

#### Changes Required:
1. **Update User Interface**:
```typescript
export interface User {
  id: string;
  email?: string;
  role: string;
  access_code: string;
  housing_companies: string[]; // Array of housing company IDs
}
```

2. **Modify signInWithAccessCode()**:
```typescript
// Query users with housing company relationships
const { data, error } = await supabase
  .from('users')
  .select(`
    *,
    user_housing_companies (
      housing_company_id
    )
  `)
  .eq('access_code', accessCode)
  .single();

// Extract housing company IDs
const housingCompanyIds = data.user_housing_companies?.map(
  (uhc: any) => uhc.housing_company_id
) || [];
```

3. **Update Mock Auth Service**:
```typescript
// Add housing_companies to mock users for testing
const mockUsers: MockUser[] = [
  {
    id: '1',
    email: 'admin@example.com',
    access_code: 'ADMIN123',
    role: 'admin',
    housing_companies: ['aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb']
  },
  // ... other mock users
];
```

### Phase 2: News Service Updates
**File**: [`src/services/newsService.ts`](../src/services/newsService.ts)

#### Changes Required:
1. **Update SupabaseNewsItem Interface**:
```typescript
interface SupabaseNewsItem {
  id: string;
  title: string;
  text: string;
  image_url: string | null;
  created_at: string;
  housing_company_id: string;
  housing_companies?: {
    name: string;
  };
}
```

2. **Add Housing Company Filtering Method**:
```typescript
async fetchNewsForHousingCompanies(housingCompanyIds: string[]): Promise<NewsItem[]> {
  if (!supabase) {
    throw new Error('Supabase not available');
  }

  if (housingCompanyIds.length === 0) {
    return []; // No housing companies = no news
  }

  const { data, error } = await supabase
    .from('news')
    .select(`
      *,
      housing_companies (
        name
      )
    `)
    .in('housing_company_id', housingCompanyIds)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch news: ${error.message}`);
  }

  return this.transformSupabaseData(data || []);
}
```

3. **Update transformSupabaseData()**:
```typescript
private transformSupabaseData(data: SupabaseNewsItem[]): NewsItem[] {
  return data.map(item => ({
    id: item.id,
    title: item.title,
    text: item.text,
    image_url: item.image_url || undefined,
    imagePath: item.image_url || undefined, // Backward compatibility
    created_at: item.created_at,
    housing_company_id: item.housing_company_id,
    housing_company_name: item.housing_companies?.name,
  }));
}
```

### Phase 3: News Hook Updates
**File**: [`src/services/useNews.ts`](../src/services/useNews.ts)

#### Changes Required:
1. **Update NewsItem Interface**:
```typescript
export interface NewsItem {
  id: string;
  title: string;
  text: string;
  imagePath?: string;
  image_url?: string;
  created_at?: string;
  housing_company_id: string;
  housing_company_name?: string;
}
```

2. **Add User Context to Config**:
```typescript
interface UseNewsConfig {
  useMockData?: boolean;
  syncInterval?: number;
  enableBackgroundSync?: boolean;
  user?: User; // Add user context
}
```

3. **Update loadNews() Logic**:
```typescript
const loadNews = async (): Promise<void> => {
  if (useMockData) {
    setNews(mockNewsData);
    setLoading(false);
    return;
  }

  setLoading(true);
  setSyncStatus('syncing');
  setError(null);

  try {
    let fetchedNews: NewsItem[];
    
    if (user?.housing_companies && user.housing_companies.length > 0) {
      // Fetch news for user's housing companies
      fetchedNews = await newsServiceRef.current!.fetchNewsForHousingCompanies(
        user.housing_companies
      );
    } else {
      // No housing companies = no news
      fetchedNews = [];
      setError('No housing companies assigned to your account');
    }

    newsServiceRef.current!.updateCache(fetchedNews);
    setNews(fetchedNews);
    setLastSyncTime(new Date());
    setSyncStatus('idle');
  } catch (loadError) {
    console.error('Failed to load news:', loadError);
    setError((loadError as Error).message);
    setSyncStatus('error');
    
    // Fallback logic remains the same
  } finally {
    setLoading(false);
  }
};
```

### Phase 4: Background Sync Updates
**File**: [`src/services/backgroundSync.ts`](../src/services/backgroundSync.ts)

#### Changes Required:
1. **Add User to SyncConfig**:
```typescript
export interface SyncConfig {
  interval: number;
  enabled: boolean;
  onUpdate: (news: NewsItem[]) => void;
  onError: (error: Error) => void;
  user?: User; // Add user context
}
```

2. **Update performSync() Method**:
```typescript
private async performSync(): Promise<void> {
  try {
    const { lastSyncTime } = this.newsService.getCache();
    let newNews: NewsItem[];

    if (lastSyncTime) {
      // Incremental sync with user's housing companies
      if (this.config.user?.housing_companies && this.config.user.housing_companies.length > 0) {
        newNews = await this.newsService.fetchNewsSince(
          lastSyncTime, 
          this.config.user.housing_companies
        );
      } else {
        newNews = [];
      }
    } else {
      // Full sync with user's housing companies
      if (this.config.user?.housing_companies && this.config.user.housing_companies.length > 0) {
        newNews = await this.newsService.fetchNewsForHousingCompanies(
          this.config.user.housing_companies
        );
      } else {
        newNews = [];
      }
    }

    if (newNews.length > 0) {
      const { news: cachedNews } = this.newsService.getCache();
      const updatedNews = this.mergeNews(cachedNews, newNews);
      this.newsService.updateCache(updatedNews);
      this.config.onUpdate(updatedNews);
    }
  } catch (error) {
    this.config.onError(error as Error);
  }
}
```

### Phase 5: UI Screen Updates
**File**: [`src/screens/UutisetScreen.tsx`](../src/screens/UutisetScreen.tsx)

#### Changes Required:
1. **Add User State Management**:
```typescript
import React, { useContext, useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { useNews } from '../services/useNews';
import { NewsCard } from '../components/NewsCard';
import { User } from '../services/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UutisetScreen: React.FC = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        setUserLoading(false);
      }
    };
    
    loadUser();
  }, []);

  const { news, loading, error } = useNews({ user: user || undefined });

  if (userLoading) {
    return (
      <View style={[styles.container, styles.centered, isDarkMode ? styles.containerDark : null]}>
        <ActivityIndicator size="large" color={isDarkMode ? '#FFF' : '#333'} />
        <Text style={[styles.text, isDarkMode ? styles.textDark : null]}>
          Loading user data...
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, isDarkMode ? styles.containerDark : null]}>
        <ActivityIndicator size="large" color={isDarkMode ? '#FFF' : '#333'} />
        <Text style={[styles.text, isDarkMode ? styles.textDark : null]}>
          Loading news...
        </Text>
      </View>
    );
  }

  if (error && news.length === 0) {
    return (
      <View style={[styles.container, styles.centered, isDarkMode ? styles.containerDark : null]}>
        <Text style={[styles.text, isDarkMode ? styles.textDark : null]}>
          {error}
        </Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.container, styles.centered, isDarkMode ? styles.containerDark : null]}>
        <Text style={[styles.text, isDarkMode ? styles.textDark : null]}>
          Please log in to view news
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, isDarkMode ? styles.containerDark : null]}>
      {news.length === 0 ? (
        <View style={styles.centered}>
          <Text style={[styles.text, isDarkMode ? styles.textDark : null]}>
            No news available for your housing companies
          </Text>
        </View>
      ) : (
        news.map((item) => (
          <NewsCard key={item.id} news={item} />
        ))
      )}
    </ScrollView>
  );
};
```

## Implementation Sequence

### Step 1: Authentication Service
- Update User interface
- Modify signInWithAccessCode to fetch housing companies
- Update mock auth service for testing

### Step 2: News Service  
- Add fetchNewsForHousingCompanies method
- Update interfaces and data transformation
- Modify fetchNewsSince to support filtering

### Step 3: News Hook
- Add user parameter to config
- Update loadNews logic for filtering
- Handle edge cases (no housing companies)

### Step 4: Background Sync
- Add user context to sync configuration
- Update sync logic to use housing company filtering

### Step 5: UI Screen
- Add user state management
- Implement proper loading states
- Handle authentication edge cases

## Testing Scenarios

### Test Cases to Verify:
1. **User with Single Housing Company**: Should see only news from that company
2. **User with Multiple Housing Companies**: Should see news from all assigned companies  
3. **User with No Housing Companies**: Should see appropriate empty state message
4. **Unauthenticated User**: Should see login prompt
5. **Network Errors**: Should handle gracefully with cached data fallback
6. **Background Sync**: Should only sync news for user's housing companies

### Test Data Available:
- User 1 (ACCESSCODE1): Has access to Keskuskatu 1 and Puistotie 5
- User 2 (ACCESSCODE2): Has access to Puistotie 5 only
- User 3 (ACCESSCODE3): Has access to Rantakatu 10 only

## Security Considerations

1. **Database-Level Filtering**: All filtering happens at the database query level using `WHERE housing_company_id IN (...)`
2. **User Validation**: Always validate user authentication before fetching news
3. **Access Control**: Users can only see news from housing companies they're explicitly assigned to
4. **Data Integrity**: Foreign key constraints ensure data consistency

## Performance Optimizations

1. **Existing Indexes**: Leverage existing indexes on user_housing_companies and news tables
2. **Efficient Queries**: Use JOIN queries to fetch related data in single requests
3. **Caching**: Maintain existing news caching mechanism
4. **Background Sync**: Only sync news relevant to the user

## Rollback Plan

If issues arise during implementation:
1. **Phase-by-Phase Rollback**: Each phase can be independently reverted
2. **Feature Flag**: Could add a feature flag to toggle between old and new behavior
3. **Mock Data Fallback**: Existing mock data system provides fallback option

## Questions for Review

1. **Error Handling**: Should we show mock news data when a user has no housing companies, or show an empty state?
2. **Loading States**: Are the proposed loading states sufficient, or do you want more granular feedback?
3. **Caching Strategy**: Should we cache news per user, or maintain global cache with filtering?
4. **Background Sync**: Should background sync be disabled for users with no housing companies?
5. **Authentication Flow**: Do you want to handle the case where user data becomes stale (housing companies changed)?

## Next Steps

Please review this plan and let me know:
1. Any modifications you'd like to make to the approach
2. Which phases you'd like to prioritize
3. Any additional considerations or edge cases
4. Whether you'd like me to proceed with implementation