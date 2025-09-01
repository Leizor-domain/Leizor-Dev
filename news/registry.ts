import { NewsProvider, NewsItem, NewsResponse, NewsFilters } from './types';
import { NewsAPIProvider } from './providers/newsapi';
import { GuardianProvider } from './providers/guardian';
import { NYTProvider } from './providers/nyt';
import { RSSProvider } from './providers/rss';
import { NewsCache, generateCacheKey } from '@/lib/cache';
import { deduplicateNewsItems } from '@/lib/hash';

export class ProviderRegistry {
  private providers: NewsProvider[] = [];
  private cache: NewsCache;

  constructor() {
    this.cache = new NewsCache({ ttl: 1000 * 60 * 10 }); // 10 minutes
    this.initializeProviders();
  }

  private initializeProviders() {
    // Add providers based on configuration
    if (process.env.NEWSAPI_KEY) {
      this.providers.push(new NewsAPIProvider());
    }

    if (process.env.GUARDIAN_KEY) {
      this.providers.push(new GuardianProvider());
    }

    if (process.env.NYT_KEY) {
      this.providers.push(new NYTProvider());
    }

    // RSS provider is always available as fallback
    this.providers.push(new RSSProvider());

    console.log(`Initialized ${this.providers.length} news providers`);
  }

  async fetchAggregate(filters: NewsFilters): Promise<NewsResponse> {
    const cacheKey = generateCacheKey(filters);
    const cached = this.cache.get<NewsResponse>(cacheKey);
    
    if (cached) {
      console.log('Returning cached news results');
      return cached;
    }

    const { category, q, page = 1, pageSize = 20 } = filters;
    
    try {
      // Fetch from all providers in parallel
      const providerPromises = this.providers.map(provider => 
        provider.fetchItems({ category, q, page, pageSize })
          .catch(error => {
            console.error(`Provider ${provider.name} failed:`, error);
            return [];
          })
      );

      const results = await Promise.allSettled(providerPromises);
      const allItems: NewsItem[] = [];
      const sourceStats: Record<string, number> = {};

      // Process results and collect stats
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          const items = result.value;
          const providerName = this.providers[index].name;
          allItems.push(...items);
          sourceStats[providerName] = items.length;
        }
      });

      // Deduplicate, sort, and paginate
      const uniqueItems = deduplicateNewsItems(allItems);
      const sortedItems = uniqueItems.sort((a, b) => {
        if (!a.publishedAt || !b.publishedAt) return 0;
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      });

      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedItems = sortedItems.slice(startIndex, endIndex);

      const response: NewsResponse = {
        items: paginatedItems,
        page,
        nextPage: endIndex < sortedItems.length ? page + 1 : undefined,
        sourceStats,
        totalItems: sortedItems.length
      };

      // Cache the result
      this.cache.set(cacheKey, response);
      
      return response;
    } catch (error) {
      console.error('Error in fetchAggregate:', error);
      throw new Error('Failed to fetch news from providers');
    }
  }

  getProviderStats() {
    return {
      totalProviders: this.providers.length,
      providerNames: this.providers.map(p => p.name),
      cacheStats: this.cache.getStats()
    };
  }

  async searchNews(query: string, category?: string, page: number = 1, pageSize: number = 20): Promise<NewsResponse> {
    return this.fetchAggregate({ q: query, category, page, pageSize });
  }

  async getNewsByCategory(category: string, page: number = 1, pageSize: number = 20): Promise<NewsResponse> {
    return this.fetchAggregate({ category, page, pageSize });
  }

  async getLatestNews(page: number = 1, pageSize: number = 20): Promise<NewsResponse> {
    return this.fetchAggregate({ page, pageSize });
  }
}

// Export singleton instance
export const providerRegistry = new ProviderRegistry();
