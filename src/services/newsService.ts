import { supabase } from './supabase';
import { NewsItem } from './useNews';

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

export class NewsService {
  private cache: NewsItem[] = [];
  private lastSyncTime: Date | null = null;

  async fetchNews(): Promise<NewsItem[]> {
    if (!supabase) {
      throw new Error('Supabase not available');
    }

    const { data, error } = await supabase
      .from('news')
      .select(`
        *,
        housing_companies (
          name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch news: ${error.message}`);
    }

    return this.transformSupabaseData(data || []);
  }

  async fetchNewsSince(timestamp: Date, housingCompanyIds?: string[]): Promise<NewsItem[]> {
    if (!supabase) {
      throw new Error('Supabase not available');
    }

    let query = supabase
      .from('news')
      .select(`
        *,
        housing_companies (
          name
        )
      `)
      .gt('created_at', timestamp.toISOString())
      .order('created_at', { ascending: false });

    // Apply housing company filter if provided
    if (housingCompanyIds && housingCompanyIds.length > 0) {
      query = query.in('housing_company_id', housingCompanyIds);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch new news: ${error.message}`);
    }

    return this.transformSupabaseData(data || []);
  }

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

  updateCache(news: NewsItem[]): void {
    this.cache = news;
    this.lastSyncTime = new Date();
  }

  getCache(): { news: NewsItem[]; lastSyncTime: Date | null } {
    return { news: this.cache, lastSyncTime: this.lastSyncTime };
  }

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
}