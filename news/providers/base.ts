import { NewsItem, NewsProvider } from '../types';
import { generateNewsId } from '@/lib/hash';

export abstract class BaseProvider implements NewsProvider {
  abstract name: string;
  abstract supportsCategories: boolean;

  protected abstract fetchFromSource(params: { 
    category?: string; 
    q?: string; 
    page?: number; 
    pageSize?: number 
  }): Promise<any[]>;

  async fetchItems(params: { 
    category?: string; 
    q?: string; 
    page?: number; 
    pageSize?: number 
  }): Promise<NewsItem[]> {
    try {
      const rawItems = await this.fetchFromSource(params);
      return this.transformItems(rawItems);
    } catch (error) {
      console.error(`Error fetching from ${this.name}:`, error);
      return [];
    }
  }

  protected abstract transformItems(rawItems: any[]): NewsItem[];

  protected createNewsItem(
    title: string,
    url: string,
    source: string,
    description?: string,
    imageUrl?: string,
    publishedAt?: string,
    author?: string,
    category?: string,
    tickers?: string[]
  ): NewsItem {
    return {
      id: generateNewsId(title, url, publishedAt),
      title,
      description,
      url,
      imageUrl,
      source,
      category,
      publishedAt,
      author,
      tickers
    };
  }

  protected sanitizeText(text: string): string {
    if (!text) return '';
    return text
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&[a-zA-Z]+;/g, ' ') // Replace HTML entities
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
      .substring(0, 200); // Limit length
  }

  protected extractImageUrl(content: string): string | undefined {
    const imgMatch = content.match(/<img[^>]+src="([^"]+)"/);
    return imgMatch ? imgMatch[1] : undefined;
  }
}
