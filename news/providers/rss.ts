import Parser from 'rss-parser';
import { BaseProvider } from './base';
import { newsConfig } from '../news.config';

export class RSSProvider extends BaseProvider {
  name = 'RSS';
  supportsCategories = true;
  private parser = new Parser({
    timeout: 10000,
    headers: {
      'User-Agent': 'Leizor-News-Feed/1.0'
    }
  });

  protected async fetchFromSource(params: { 
    category?: string; 
    q?: string; 
    page?: number; 
    pageSize?: number 
  }): Promise<any[]> {
    const { category } = params;
    const sources = category ? newsConfig.providers.rss.sources[category] || [] : [];
    
    if (sources.length === 0) {
      // If no specific category, fetch from all sources
      const allSources = Object.values(newsConfig.providers.rss.sources).flat();
      return this.fetchFromMultipleSources(allSources);
    }

    return this.fetchFromMultipleSources(sources);
  }

  private async fetchFromMultipleSources(sources: string[]): Promise<any[]> {
    const fetchPromises = sources.map(source => this.fetchSingleSource(source));
    const results = await Promise.allSettled(fetchPromises);
    
    const allItems: any[] = [];
    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        allItems.push(...result.value);
      } else {
        console.warn(`Failed to fetch from RSS source ${sources[index]}:`, result.status === 'rejected' ? result.reason : 'Unknown error');
      }
    });

    return allItems;
  }

  private async fetchSingleSource(source: string): Promise<any[]> {
    try {
      const feed = await this.parser.parseURL(source);
      return feed.items || [];
    } catch (error) {
      console.error(`Error fetching RSS from ${source}:`, error);
      return [];
    }
  }

  protected transformItems(rawItems: any[]): any[] {
    return rawItems
      .filter(item => item.title && item.link)
      .map(item => {
        const sourceName = this.extractSourceName(item.link || '');
        const category = this.detectCategory(item.title, item.content);
        
        return this.createNewsItem(
          item.title || '',
          item.link || '',
          `RSS: ${sourceName}`,
          this.sanitizeText(item.contentSnippet || item.content || ''),
          item.enclosure?.url || this.extractImageUrl(item.content || ''),
          item.pubDate || item.isoDate,
          item.creator || item.author,
          category
        );
      });
  }

  private extractSourceName(url: string): string {
    try {
      const hostname = new URL(url).hostname;
      return hostname.replace(/^www\./, '').split('.')[0];
    } catch {
      return 'Unknown';
    }
  }

  private detectCategory(title: string, content?: string): string | undefined {
    const text = `${title} ${content || ''}`.toLowerCase();
    
    const categoryKeywords: Record<string, string[]> = {
      world: ['world', 'global', 'international', 'politics', 'government'],
      business: ['business', 'economy', 'market', 'trade', 'finance', 'corporate'],
      tech: ['technology', 'tech', 'software', 'ai', 'artificial intelligence', 'startup'],
      sports: ['sport', 'football', 'basketball', 'tennis', 'olympics', 'championship'],
      entertainment: ['entertainment', 'movie', 'film', 'music', 'celebrity', 'hollywood'],
      science: ['science', 'research', 'study', 'discovery', 'medical', 'health'],
      crypto: ['cryptocurrency', 'bitcoin', 'ethereum', 'blockchain', 'crypto'],
      finance: ['finance', 'investment', 'stock', 'market', 'banking', 'trading']
    };

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return category;
      }
    }

    return undefined;
  }
}
