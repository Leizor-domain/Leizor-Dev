'use client'

import { NewsItem } from '@/news/types';
import { formatTimeAgo } from '@/lib/time';
import Image from 'next/image';
import { ExternalLink, Calendar, User } from 'lucide-react';

interface NewsCardProps {
  item: NewsItem;
}

export function NewsCard({ item }: NewsCardProps) {
  const {
    title,
    description,
    url,
    imageUrl,
    source,
    category,
    publishedAt,
    author,
    tickers
  } = item;

  const handleOpenSource = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <article className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Image */}
      {imageUrl && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {category && (
            <span className="absolute top-2 left-2 px-2 py-1 bg-primary/90 text-primary-foreground text-xs font-medium rounded">
              {category}
            </span>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 hover:text-primary transition-colors">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-muted-foreground text-sm mb-3 line-clamp-3">
            {description}
          </p>
        )}

        {/* Meta information */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <div className="flex items-center space-x-3">
            {publishedAt && (
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{formatTimeAgo(publishedAt)}</span>
              </div>
            )}
            {author && (
              <div className="flex items-center space-x-1">
                <User className="w-3 h-3" />
                <span className="truncate max-w-24">{author}</span>
              </div>
            )}
          </div>
          <span className="font-medium text-primary">{source}</span>
        </div>

        {/* Tickers */}
        {tickers && tickers.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tickers.slice(0, 5).map((ticker, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded font-mono"
              >
                {ticker}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleOpenSource}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open at source</span>
          </button>
        </div>
      </div>
    </article>
  );
}
