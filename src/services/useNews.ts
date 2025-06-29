import { useState, useEffect, useRef } from 'react';
import { NewsService } from './newsService';
import { BackgroundSyncManager, SyncConfig } from './backgroundSync';
import { User } from './auth';

export interface NewsItem {
  id: string;
  title: string;
  text: string;
  imagePath?: string;
  image_url?: string;
  thumbnail?: string; // Local asset file name stored in Supabase
  created_at?: string;
  housing_company_id: string;
  housing_company_name?: string;
}

interface UseNewsConfig {
  useMockData?: boolean;
  syncInterval?: number; // milliseconds, default 5 minutes
  enableBackgroundSync?: boolean;
  user?: User; // Add user context
}

interface UseNewsReturn {
  news: NewsItem[];
  loading: boolean;
  error: string | null;
  lastSyncTime: Date | null;
  syncStatus: 'idle' | 'syncing' | 'error';
  refetch: () => Promise<void>;
}

// Mock data (existing)
const mockNewsData: NewsItem[] = [
  {
    id: '1',
    title: 'Uutinen 1 - Keskuskatu 1',
    text: 'Tämä on lyhyt uutinen, joka mahtuu alle kolmeen riviin.',
    imagePath: '../assets/icon1.png',
    housing_company_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    housing_company_name: 'Keskuskatu 1'
  },
  {
    id: '2',
    title: 'Uutinen 2 - Puistotie 5',
    text: 'Tämä uutinen on hieman pidempi ja sen pitäisi katkaista kolmeen riviin, jotta "Lue lisää" -linkki tulee näkyviin. Tämä teksti jatkuu vielä hieman pidemmälle, jotta voimme testata leikkaamista.',
    imagePath: '../assets/icon2.png',
    housing_company_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    housing_company_name: 'Puistotie 5'
  },
  {
    id: '3',
    title: 'Uutinen 3 - Rantakatu 10',
    text: 'Tämä on todella pitkä uutinen, joka ylittää selvästi kolme riviä. Sen tarkoituksena on testata, että uutisen tekstin katkaisu ja laajennus toimivat oikein. Käyttäjä voi klikata "Lue lisää" nähdäksesi koko tekstin ja "Näytä vähemmän" piilottaakseen sen uudelleen.',
    imagePath: '../assets/icon3.png',
    housing_company_id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    housing_company_name: 'Rantakatu 10'
  },
];

export function useNews(config: UseNewsConfig = {}): UseNewsReturn {
  const {
    useMockData = false,
    syncInterval = 5 * 60 * 1000, // 5 minutes
    enableBackgroundSync = true,
    user,
  } = config;

  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error'>('idle');

  const newsServiceRef = useRef<NewsService | null>(null);
  const syncManagerRef = useRef<BackgroundSyncManager | null>(null);

  useEffect(() => {
    if (useMockData) {
      // Filter mock data based on user's housing companies
      let filteredMockData = mockNewsData;
      if (user?.housing_companies && user.housing_companies.length > 0) {
        filteredMockData = mockNewsData.filter(item =>
          user.housing_companies!.includes(item.housing_company_id)
        );
      }
      setNews(filteredMockData);
      setLoading(false);
      return;
    }

    // Initialize services
    newsServiceRef.current = new NewsService();
    
    const syncConfig: SyncConfig = {
      interval: syncInterval,
      enabled: enableBackgroundSync,
      user: user || undefined, // Pass user context to sync manager
      onUpdate: (updatedNews) => {
        setNews(updatedNews);
        setLastSyncTime(new Date());
        setSyncStatus('idle');
      },
      onError: (syncError) => {
        setSyncStatus('error');
        // Fallback to mock data on error
        if (news.length === 0) {
          setNews(mockNewsData);
          setError('Failed to load news from server, showing offline content');
        }
      },
    };

    syncManagerRef.current = new BackgroundSyncManager(
      newsServiceRef.current,
      syncConfig
    );

    // Initial load
    loadNews();

    // Start background sync
    if (enableBackgroundSync) {
      syncManagerRef.current.start();
    }

    return () => {
      syncManagerRef.current?.stop();
    };
  }, [useMockData, syncInterval, enableBackgroundSync, user?.id]);

  const loadNews = async (): Promise<void> => {
    if (useMockData) {
      // Filter mock data based on user's housing companies
      let filteredMockData = mockNewsData;
      if (user?.housing_companies && user.housing_companies.length > 0) {
        filteredMockData = mockNewsData.filter(item =>
          user.housing_companies!.includes(item.housing_company_id)
        );
      }
      setNews(filteredMockData);
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
      setError((loadError as Error).message);
      setSyncStatus('error');
      
      // Fallback to cached data or mock data
      const { news: cachedNews } = newsServiceRef.current!.getCache();
      if (cachedNews.length > 0) {
        setNews(cachedNews);
        setError('Using cached news data');
      } else {
        setNews(mockNewsData);
        setError('Failed to load news, showing offline content');
      }
    } finally {
      setLoading(false);
    }
  };

  const refetch = async (): Promise<void> => {
    await loadNews();
  };

  return {
    news,
    loading,
    error,
    lastSyncTime,
    syncStatus,
    refetch,
  };
}