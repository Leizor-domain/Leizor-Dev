import axios from 'axios';
import { BaseProvider } from './base';
import { newsConfig } from '../news.config';

export class NYTProvider extends BaseProvider {
  name = 'The New York Times';
  supportsCategories = true;
  private apiKey = process.env.NYT_KEY;
  private baseUrl = newsConfig.providers.nyt?.baseUrl || 'https://api.nytimes.com/svc';

  protected async fetchFromSource(params: { 
    category?: string; 
    q?: string; 
    page?: number; 
    pageSize?: number 
  }): Promise<any[]> {
    if (!this.apiKey) {
      console.warn('NYT API key not configured');
      return [];
    }

    const { category, q, page = 1, pageSize = 20 } = params;
    
    try {
      let endpoint = '/search/v2/articlesearch.json';
      let queryParams: any = {
        'api-key': this.apiKey,
        'page': Math.max(0, page - 1), // NYT uses 0-based pagination
        'sort': 'newest'
      };

      if (category && newsConfig.providers.nyt?.categories[category]) {
        const section = newsConfig.providers.nyt.categories[category];
        queryParams.fq = `news_desk:("${section}")`;
      }

      if (q) {
        queryParams.q = q;
      }

      const response = await axios.get(`${this.baseUrl}${endpoint}`, {
        params: queryParams,
        timeout: 10000,
        headers: {
          'User-Agent': 'Leizor-News-Feed/1.0'
        }
      });

      if (response.data.status === 'OK') {
        return response.data.response.docs || [];
      } else {
        console.error('NYT API error:', response.data.fault?.faultstring);
        return [];
      }
    } catch (error: any) {
      if (error.response?.status === 429) {
        console.warn('NYT API rate limit exceeded');
      } else {
        console.error('NYT API request failed:', error.message);
      }
      return [];
    }
  }

  protected transformItems(rawItems: any[]): any[] {
    return rawItems
      .filter(article => article.headline?.main && article.web_url)
      .map(article => {
        const category = this.detectCategory(article.headline.main, article.abstract);
        const tickers = this.extractTickers(article.headline.main, article.abstract);
        
        // Extract image URL from multimedia array
        let imageUrl: string | undefined;
        if (article.multimedia && article.multimedia.length > 0) {
          const image = article.multimedia.find((m: any) => m.subtype === 'photo' && m.url);
          if (image) {
            imageUrl = `https://www.nytimes.com/${image.url}`;
          }
        }
        
        return this.createNewsItem(
          article.headline.main,
          article.web_url,
          'The New York Times',
          this.sanitizeText(article.abstract || ''),
          imageUrl,
          article.pub_date,
          article.byline?.original,
          category,
          tickers
        );
      });
  }

  private detectCategory(title: string, description?: string): string | undefined {
    const text = `${title} ${description || ''}`.toLowerCase();
    
    const categoryKeywords: Record<string, string[]> = {
      world: ['world', 'global', 'international', 'politics', 'government', 'election', 'foreign'],
      business: ['business', 'economy', 'market', 'trade', 'corporate', 'company', 'banking'],
      tech: ['technology', 'tech', 'software', 'ai', 'artificial intelligence', 'startup', 'app', 'digital'],
      sports: ['sport', 'football', 'basketball', 'tennis', 'olympics', 'championship', 'league', 'baseball'],
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
