'use client'

import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { NewsCategory, NEWS_CATEGORIES, CATEGORY_LABELS } from '@/news/types';

interface NewsFilterBarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onSearchChange: (query: string) => void;
  searchQuery: string;
}

export function NewsFilterBar({
  selectedCategory,
  onCategoryChange,
  onSearchChange,
  searchQuery
}: NewsFilterBarProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange('')}
          className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            selectedCategory === ''
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          All
        </button>
        
        {NEWS_CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              selectedCategory === category
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {CATEGORY_LABELS[category]}
          </button>
        ))}
      </div>

      {/* Active Filters Display */}
      {(selectedCategory || searchQuery) && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Filter className="w-4 h-4" />
            <span>Active filters:</span>
            {selectedCategory && (
              <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded">
                {CATEGORY_LABELS[selectedCategory as NewsCategory]}
              </span>
            )}
            {searchQuery && (
              <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded">
                Search: "{searchQuery}"
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
