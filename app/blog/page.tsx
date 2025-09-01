'use client'

import { useState, useEffect, useCallback } from 'react';
import { NewsFilterBar } from '@/components/feed/NewsFilterBar';
import { NewsCard } from '@/components/feed/NewsCard';
import { LoadMore } from '@/components/feed/LoadMore';
import { ChartWidget } from '@/components/ChartWidget';
import { ThemeToggle } from '@/components/ThemeToggle';
import { NewsItem, NewsResponse } from '@/news/types';
import Link from 'next/link';

export default function NewsFeedPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [sourceStats, setSourceStats] = useState<Record<string, number>>({});

  // Extract unique tickers from news items
  const allTickers = Array.from(
    new Set(
      news
        .flatMap(item => item.tickers || [])
        .filter(ticker => ticker.length >= 2 && ticker.length <= 6)
    )
  ).slice(0, 8); // Limit to 8 tickers

  const fetchNews = useCallback(async (page: number, append: boolean = false) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: '20'
      });

      if (selectedCategory) {
        params.append('category', selectedCategory);
      }

      if (searchQuery.trim()) {
        params.append('q', searchQuery.trim());
      }

      const response = await fetch(`/api/news?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }

      const data: NewsResponse = await response.json();
      
      if (append) {
        setNews(prev => [...prev, ...data.items]);
      } else {
        setNews(data.items);
      }
      
      setHasMore(!!data.nextPage);
      setTotalItems(data.totalItems);
      setSourceStats(data.sourceStats);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, searchQuery, isLoading]);

  // Initial load
  useEffect(() => {
    setCurrentPage(1);
    setNews([]);
    setHasMore(true);
    fetchNews(1, false);
  }, [selectedCategory, searchQuery]);

  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      fetchNews(currentPage + 1, true);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-primary">
                Leizor News Feed
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Home
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">News Feed</h1>
          <p className="text-muted-foreground">
            Stay informed with the latest news from multiple sources
          </p>
        </div>

        {/* Source Stats */}
        {Object.keys(sourceStats).length > 0 && (
          <div className="mb-6 p-4 bg-muted/30 rounded-lg">
            <h3 className="text-sm font-medium text-foreground mb-2">Sources</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(sourceStats).map(([source, count]) => (
                <span
                  key={source}
                  className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded"
                >
                  {source}: {count}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Filter Bar */}
            <NewsFilterBar
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              onSearchChange={handleSearchChange}
              searchQuery={searchQuery}
            />

            {/* News Grid */}
            {news.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {news.map((item) => (
                  <NewsCard key={item.id} item={item} />
                ))}
              </div>
            ) : !isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No news found. Try adjusting your filters or search terms.
                </p>
              </div>
            ) : null}

            {/* Load More */}
            <LoadMore
              hasMore={hasMore}
              isLoading={isLoading}
              onLoadMore={handleLoadMore}
              totalItems={totalItems}
              currentItems={news.length}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Chart Widget */}
              {allTickers.length > 0 && (
                <ChartWidget tickers={allTickers} />
              )}

              {/* Quick Stats */}
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="text-lg font-semibold text-foreground mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Articles</span>
                    <span className="font-medium">{totalItems}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current Page</span>
                    <span className="font-medium">{currentPage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sources</span>
                    <span className="font-medium">{Object.keys(sourceStats).length}</span>
                  </div>
                </div>
              </div>

              {/* Help */}
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="text-lg font-semibold text-foreground mb-2">Tips</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Use category filters to focus on specific topics</li>
                  <li>• Search for specific keywords or companies</li>
                  <li>• Click "Open at source" to read full articles</li>
                  <li>• Tickers show related stock/crypto symbols</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
