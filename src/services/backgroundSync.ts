import { NewsService } from './newsService';
import { NewsItem } from './useNews';
import { User } from './auth';

export interface SyncConfig {
  interval: number; // milliseconds
  enabled: boolean;
  onUpdate?: (news: NewsItem[]) => void;
  onError?: (error: Error) => void;
  user?: User; // Add user context
}

export class BackgroundSyncManager {
  private newsService: NewsService;
  private config: SyncConfig;
  private intervalId: NodeJS.Timeout | null = null;
  private isActive = false;

  constructor(newsService: NewsService, config: SyncConfig) {
    this.newsService = newsService;
    this.config = config;
  }

  start(): void {
    if (!this.config.enabled || this.intervalId) return;

    this.isActive = true;
    this.intervalId = setInterval(() => {
      this.performSync();
    }, this.config.interval);

    // Perform initial sync
    this.performSync();
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isActive = false;
  }

  private async performSync(): Promise<void> {
    if (!this.isActive) return;

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
        this.config.onUpdate?.(updatedNews);
      }
    } catch (error) {
      this.config.onError?.(error as Error);
    }
  }

  private mergeNews(cachedNews: NewsItem[], newNews: NewsItem[]): NewsItem[] {
    // Create a map of existing news by ID for efficient lookup
    const existingNewsMap = new Map(cachedNews.map(item => [item.id, item]));
    
    // Add or update news items
    newNews.forEach(item => {
      existingNewsMap.set(item.id, item);
    });
    
    // Convert back to array and sort by created_at descending
    return Array.from(existingNewsMap.values()).sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      return dateB - dateA;
    });
  }

  updateConfig(newConfig: Partial<SyncConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    if (this.intervalId && newConfig.interval) {
      this.stop();
      this.start();
    }
  }
}