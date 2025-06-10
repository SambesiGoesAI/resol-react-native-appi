import { NewsService } from './newsService';
import { NewsItem } from './useNews';

export interface SyncConfig {
  interval: number; // milliseconds
  enabled: boolean;
  onUpdate?: (news: NewsItem[]) => void;
  onError?: (error: Error) => void;
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
      
      let news: NewsItem[];
      if (lastSyncTime) {
        // Fetch only new news since last sync
        const newNews = await this.newsService.fetchNewsSince(lastSyncTime);
        if (newNews.length > 0) {
          const { news: cachedNews } = this.newsService.getCache();
          news = [...newNews, ...cachedNews];
        } else {
          return; // No new news
        }
      } else {
        // First sync - fetch all news
        news = await this.newsService.fetchNews();
      }

      this.newsService.updateCache(news);
      this.config.onUpdate?.(news);
    } catch (error) {
      this.config.onError?.(error as Error);
    }
  }

  updateConfig(newConfig: Partial<SyncConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    if (this.intervalId && newConfig.interval) {
      this.stop();
      this.start();
    }
  }
}