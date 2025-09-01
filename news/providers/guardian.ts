import axios from 'axios';
import { BaseProvider } from './base';
import { newsConfig } from '../news.config';

export class GuardianProvider extends BaseProvider {
  name = 'The Guardian';
  supportsCategories = true;
  private apiKey = process.env.GUARDIAN_KEY;
  private baseUrl = newsConfig.providers.guardian?.baseUrl || 'https://content.guardianapis.com';

  protected async fetchFromSource(params: { 
    category?: string; 
    q?: string; 
    page?: number; 
    pageSize?: number 
  }): Promise<any[]> {
    if (!this.apiKey) {
      console.warn('Guardian API key not configured');
      return [];
    }

    const { category, q, page = 1, pageSize = 20 } = params;
    
    try {
      let section = 'news';
      let queryParams: any = {
        'api-key': this.apiKey,
        'page-size': Math.min(pageSize, 50), // Guardian max is 50
        'page': page,
        'show-fields': 'headline,trailText,byline,thumbnail,lastModified',
        'show-tags': 'contributor,section',
        'order-by': 'newest'
      };

      if (category && newsConfig.providers.guardian?.categories[category]) {
        section = newsConfig.providers.guardian.categories[category];
      }

      if (q) {
        queryParams.q = q;
      }

      const response = await axios.get(`${this.baseUrl}/search`, {
        params: {
          ...queryParams,
          'section': section
        },
        timeout: 10000,
        headers: {
          'User-Agent': 'Leizor-News-Feed/1.0'
        }
      });

      if (response.data.response && response.data.response.status === 'ok') {
        return response.data.response.results || [];
      } else {
        console.error('Guardian API error:', response.data.response?.message);
        return [];
      }
    } catch (error: any) {
      if (error.response?.status === 429) {
        console.warn('Guardian API rate limit exceeded');
      } else {
        console.error('Guardian API request failed:', error.message);
      }
      return [];
    }
  }

  protected transformItems(rawItems: any[]): any[] {
    return rawItems
      .filter(article => article.webTitle && article.webUrl)
      .map(article => {
        const category = this.detectCategory(article.webTitle, article.trailText);
        const tickers = this.extractTickers(article.webTitle, article.trailText);
        
        return this.createNewsItem(
          article.webTitle,
          article.webUrl,
          'The Guardian',
          this.sanitizeText(article.trailText || ''),
          article.fields?.thumbnail,
          article.webPublicationDate,
          article.fields?.byline,
          category,
          tickers
        );
      });
  }

  private detectCategory(title: string, description?: string): string | undefined {
    const text = `${title} ${description || ''}`.toLowerCase();
    
    const categoryKeywords: Record<string, string[]> = {
      world: ['world', 'global', 'international', 'politics', 'government', 'election', 'brexit'],
      business: ['business', 'economy', 'market', 'trade', 'corporate', 'company', 'banking'],
      tech: ['technology', 'tech', 'software', 'ai', 'artificial intelligence', 'startup', 'app', 'digital'],
      sports: ['sport', 'football', 'basketball', 'tennis', 'olympics', 'championship', 'league', 'premier league'],
      entertainment: ['entertainment', 'movie', 'film', 'music', 'celebrity', 'hollywood', 'actor', 'arts'],
      science: ['science', 'research', 'study', 'discovery', 'medical', 'health', 'covid', 'climate'],
      crypto: ['cryptocurrency', 'bitcoin', 'ethereum', 'blockchain', 'crypto', 'nft'],
      finance: ['finance', 'investment', 'stock', 'market', 'banking', 'trading', 'fed', 'economy']
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
