'use client'

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, ExternalLink } from 'lucide-react';

interface ChartWidgetProps {
  tickers: string[];
  className?: string;
}

interface TickerData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export function ChartWidget({ tickers, className = '' }: ChartWidgetProps) {
  const [tickerData, setTickerData] = useState<TickerData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (tickers.length === 0) {
      setIsLoading(false);
      return;
    }

    // Simulate fetching ticker data
    // In a real implementation, you would fetch from Alpha Vantage or similar API
    const fetchTickerData = async () => {
      try {
        // Mock data for demonstration
        const mockData: TickerData[] = tickers.slice(0, 5).map((ticker, index) => ({
          symbol: ticker,
          price: Math.random() * 1000 + 100,
          change: (Math.random() - 0.5) * 20,
          changePercent: (Math.random() - 0.5) * 10
        }));

        setTickerData(mockData);
      } catch (error) {
        console.error('Failed to fetch ticker data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickerData();
  }, [tickers]);

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getTrendColor = (change: number) => {
    if (change > 0) return 'text-green-500';
    if (change < 0) return 'text-red-500';
    return 'text-gray-500';
  };

  const openChart = (ticker: string) => {
    // Open external chart links
    const chartUrls = {
      'AAPL': 'https://www.tradingview.com/symbols/NASDAQ-AAPL/',
      'MSFT': 'https://www.tradingview.com/symbols/NASDAQ-MSFT/',
      'GOOGL': 'https://www.tradingview.com/symbols/NASDAQ-GOOGL/',
      'AMZN': 'https://www.tradingview.com/symbols/NASDAQ-AMZN/',
      'TSLA': 'https://www.tradingview.com/symbols/NASDAQ-TSLA/',
      'BTC-USD': 'https://www.tradingview.com/symbols/CRYPTOCAP-BTC/',
      'ETH-USD': 'https://www.tradingview.com/symbols/CRYPTOCAP-ETH/',
      'NVDA': 'https://www.tradingview.com/symbols/NASDAQ-NVDA/'
    };

    const url = chartUrls[ticker as keyof typeof chartUrls] || 
                `https://www.tradingview.com/symbols/search/?q=${ticker}`;
    
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (tickers.length === 0) {
    return null;
  }

  return (
    <div className={`bg-card border border-border rounded-lg p-4 ${className}`}>
      <h3 className="text-lg font-semibold text-foreground mb-4">Market Overview</h3>
      
      {isLoading ? (
        <div className="space-y-3">
          {tickers.slice(0, 5).map((ticker, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-4 bg-muted rounded w-20 mb-2"></div>
              <div className="h-3 bg-muted rounded w-16"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {tickerData.map((ticker) => (
            <div key={ticker.symbol} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
              <div className="flex items-center space-x-3">
                {getTrendIcon(ticker.change)}
                <div>
                  <div className="font-medium text-foreground">{ticker.symbol}</div>
                  <div className="text-sm text-muted-foreground">
                    ${ticker.price.toFixed(2)}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`font-medium ${getTrendColor(ticker.change)}`}>
                  {ticker.change > 0 ? '+' : ''}{ticker.change.toFixed(2)}
                </div>
                <div className={`text-sm ${getTrendColor(ticker.change)}`}>
                  {ticker.change > 0 ? '+' : ''}{ticker.changePercent.toFixed(2)}%
                </div>
              </div>
              
              <button
                onClick={() => openChart(ticker.symbol)}
                className="ml-2 p-1 text-muted-foreground hover:text-primary transition-colors"
                title="View chart"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          Data for demonstration. Click ticker to view live charts.
        </p>
      </div>
    </div>
  );
}
