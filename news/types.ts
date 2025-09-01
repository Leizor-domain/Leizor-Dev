export type NewsItem = {
  id: string;                // stable hash from title+url+publishedAt
  title: string;
  description?: string;
  url: string;
  imageUrl?: string;
  source: string;            // e.g., "The Guardian", "NYT", "RSS: BBC"
  category?: string;         // world, business, tech, sports, entertainment, science, crypto, finance
  publishedAt?: string;      // ISO
  author?: string;
  tickers?: string[];        // ["AAPL","MSFT","BTC-USD"] if applicable
};

export interface NewsProvider {
  name: string;
  supportsCategories: boolean;
  fetchItems(params: { category?: string; q?: string; page?: number; pageSize?: number }): Promise<NewsItem[]>;
}

export interface NewsResponse {
  items: NewsItem[];
  page: number;
  nextPage?: number;
  sourceStats: Record<string, number>;
  totalItems: number;
}

export interface NewsFilters {
  category?: string;
  q?: string;
  page?: number;
  pageSize?: number;
}

export type NewsCategory = 
  | 'world' 
  | 'business' 
  | 'tech' 
  | 'sports' 
  | 'entertainment' 
  | 'science' 
  | 'crypto' 
  | 'finance';

export const NEWS_CATEGORIES: NewsCategory[] = [
  'world',
  'business', 
  'tech',
  'sports',
  'entertainment',
  'science',
  'crypto',
  'finance'
];

export const CATEGORY_LABELS: Record<NewsCategory, string> = {
  world: 'World',
  business: 'Business',
  tech: 'Technology',
  sports: 'Sports',
  entertainment: 'Entertainment',
  science: 'Science',
  crypto: 'Cryptocurrency',
  finance: 'Finance'
};
