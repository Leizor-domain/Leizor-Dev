'use client'

interface LoadMoreProps {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  totalItems: number;
  currentItems: number;
}

export function LoadMore({ 
  hasMore, 
  isLoading, 
  onLoadMore, 
  totalItems, 
  currentItems 
}: LoadMoreProps) {
  if (!hasMore && currentItems === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No news found. Try adjusting your filters.</p>
      </div>
    );
  }

  if (!hasMore) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Showing {currentItems} of {totalItems} news items
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-8">
      <button
        onClick={onLoadMore}
        disabled={isLoading}
        className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
            <span>Loading...</span>
          </div>
        ) : (
          <span>Load More News</span>
        )}
      </button>
      <p className="text-sm text-muted-foreground mt-2">
        Showing {currentItems} of {totalItems} news items
      </p>
    </div>
  );
}
