import { useState, useEffect, useRef } from 'react';
import { NewsService } from './newsService';
import { BackgroundSyncManager, SyncConfig } from './backgroundSync';

export interface NewsItem {
  id: string;
  title: string;
  text: string;
  imagePath?: string;
  image_url?: string;
  created_at?: string;
}

interface UseNewsConfig {
  useMockData?: boolean;
  syncInterval?: number; // milliseconds, default 5 minutes
  enableBackgroundSync?: boolean;
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
    title: 'Uutinen 1',
    text: 'Tämä on lyhyt uutinen, joka mahtuu alle kolmeen riviin.',
    imagePath: '../assets/icon1.png',
  },
  {
    id: '2',
    title: 'Uutinen 2',
    text: 'Tämä uutinen on hieman pidempi ja sen pitäisi katkaista kolmeen riviin, jotta "Lue lisää" -linkki tulee näkyviin. Tämä teksti jatkuu vielä hieman pidemmälle, jotta voimme testata leikkaamista.',
    imagePath: '../assets/icon2.png',
  },
  {
    id: '3',
    title: 'Uutinen 3',
    text: 'Tämä on todella pitkä uutinen, joka ylittää selvästi kolme riviä. Sen tarkoituksena on testata, että uutisen tekstin katkaisu ja laajennus toimivat oikein. Käyttäjä voi klikata "Lue lisää" nähdäksesi koko tekstin ja "Näytä vähemmän" piilottaakseen sen uudelleen.',
    imagePath: '../assets/icon3.png',
  },
];

export function useNews(config: UseNewsConfig = {}): UseNewsReturn {
  const {
    useMockData = false,
    syncInterval = 5 * 60 * 1000, // 5 minutes
    enableBackgroundSync = true,
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
      // Use mock data
      setNews(mockNewsData);
      setLoading(false);
      return;
    }

    // Initialize services
    newsServiceRef.current = new NewsService();
    
    const syncConfig: SyncConfig = {
      interval: syncInterval,
      enabled: enableBackgroundSync,
      onUpdate: (updatedNews) => {
        setNews(updatedNews);
        setLastSyncTime(new Date());
        setSyncStatus('idle');
      },
      onError: (syncError) => {
        console.error('Background sync error:', syncError);
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
  }, [useMockData, syncInterval, enableBackgroundSync]);

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
      const fetchedNews = await newsServiceRef.current!.fetchNews();
      newsServiceRef.current!.updateCache(fetchedNews);
      setNews(fetchedNews);
      setLastSyncTime(new Date());
      setSyncStatus('idle');
    } catch (loadError) {
      console.error('Failed to load news:', loadError);
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