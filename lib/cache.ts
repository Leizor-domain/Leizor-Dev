import { LRUCache } from 'lru-cache';

export interface CacheOptions {
  max?: number;
  ttl?: number;
}

export class NewsCache {
  private cache: LRUCache<string, any>;

  constructor(options: CacheOptions = {}) {
    this.cache = new LRUCache({
      max: options.max || 500,
      ttl: options.ttl || 1000 * 60 * 10, // 10 minutes default
      updateAgeOnGet: true,
    });
  }

  get<T>(key: string): T | undefined {
    return this.cache.get(key);
  }

  set<T>(key: string, value: T, ttl?: number): void {
    this.cache.set(key, value, { ttl });
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  getStats() {
    return {
      size: this.cache.size,
      max: this.cache.max,
      // Note: LRU cache v10 doesn't expose hit/miss stats
      // These would need to be tracked manually if needed
    };
  }
}

export function generateCacheKey(filters: {
  category?: string;
  q?: string;
  page?: number;
  pageSize?: number;
}): string {
  const { category, q, page, pageSize } = filters;
  return `news:${category || 'all'}:${q || 'none'}:${page || 1}:${pageSize || 20}`;
}
