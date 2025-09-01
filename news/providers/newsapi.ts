import axios from 'axios';
import { BaseProvider } from './base';
import { newsConfig } from '../news.config';

export class NewsAPIProvider extends BaseProvider {
  name = 'NewsAPI';
  supportsCategories = true;
  private apiKey = process.env.NEWSAPI_KEY;
  private baseUrl = newsConfig.providers.newsAPI?.baseUrl || 'https://newsapi.org/v2';

  protected async fetchFromSource(params: { 
    category?: string; 
    q?: string; 
    page?: number; 
    pageSize?: number 
  }): Promise<any[]> {
    if (!this.apiKey) {
      console.warn('NewsAPI key not configured');
      return [];
    }

    const { category, q, page = 1, pageSize = 20 } = params;
    
    try {
      let endpoint = '/everything';
      let queryParams: any = {
        apiKey: this.apiKey,
        pageSize: Math.min(pageSize, 100), // NewsAPI max is 100
        page,
        language: 'en',
        sortBy: 'publishedAt'
      };

      if (category && newsConfig.providers.newsAPI?.categories[category]) {
        endpoint = '/top-headlines';
        queryParams.category = newsConfig.providers.newsAPI.categories[category];
        queryParams.country = 'us';
      } else if (q) {
        queryParams.q = q;
      } else {
        // Default to general news if no category or query
        queryParams.q = 'news';
      }

      const response = await axios.get(`${this.baseUrl}${endpoint}`, {
        params: queryParams,
        timeout: 10000,
        headers: {
          'User-Agent': 'Leizor-News-Feed/1.0'
        }
      });

      if (response.data.status === 'ok') {
        return response.data.articles || [];
      } else {
        console.error('NewsAPI error:', response.data.message);
        return [];
      }
    } catch (error: any) {
      if (error.response?.status === 429) {
        console.warn('NewsAPI rate limit exceeded');
      } else {
        console.error('NewsAPI request failed:', error.message);
      }
      return [];
    }
  }

  protected transformItems(rawItems: any[]): any[] {
    return rawItems
      .filter(article => article.title && article.url)
      .map(article => {
        const category = this.detectCategory(article.title, article.description);
        const tickers = this.extractTickers(article.title, article.description);
        
        return this.createNewsItem(
          article.title,
          article.url,
          article.source?.name || 'NewsAPI',
          this.sanitizeText(article.description || ''),
          article.urlToImage,
          article.publishedAt,
          article.author,
          category,
          tickers
        );
      });
  }

  private detectCategory(title: string, description?: string): string | undefined {
    const text = `${title} ${description || ''}`.toLowerCase();
    
    const categoryKeywords: Record<string, string[]> = {
      world: ['world', 'global', 'international', 'politics', 'government', 'election'],
      business: ['business', 'economy', 'market', 'trade', 'corporate', 'company'],
      tech: ['technology', 'tech', 'software', 'ai', 'artificial intelligence', 'startup', 'app'],
      sports: ['sport', 'football', 'basketball', 'tennis', 'olympics', 'championship', 'league'],
      entertainment: ['entertainment', 'movie', 'film', 'music', 'celebrity', 'hollywood', 'actor'],
      science: ['science', 'research', 'study', 'discovery', 'medical', 'health', 'covid'],
      crypto: ['cryptocurrency', 'bitcoin', 'ethereum', 'blockchain', 'crypto', 'nft'],
      finance: ['finance', 'investment', 'stock', 'market', 'banking', 'trading', 'fed']
    };

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return category;
      }
    }

    return undefined;
  }

  private extractTickers(title: string, description?: string): string[] {
    const text = `${title} ${description || ''}`;
    const tickerPattern = /\b[A-Z]{1,5}(?:-[A-Z]{1,5})?\b/g;
    const matches = text.match(tickerPattern) || [];
    
    // Filter out common words that might match the pattern
    const commonWords = ['THE', 'AND', 'FOR', 'ARE', 'BUT', 'NOT', 'YOU', 'ALL', 'CAN', 'HER', 'WAS', 'ONE', 'OUR', 'OUT', 'DAY', 'GET', 'HAS', 'HIM', 'HIS', 'HOW', 'MAN', 'NEW', 'NOW', 'OLD', 'SEE', 'TWO', 'WAY', 'WHO', 'BOY', 'DID', 'ITS', 'LET', 'PUT', 'SAY', 'SHE', 'TOO', 'USE'];
    
    return matches.filter(ticker => 
      !commonWords.includes(ticker) && 
      ticker.length >= 2 && 
      ticker.length <= 6
    );
  }
}
