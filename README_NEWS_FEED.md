# Leizor News Feed

A modern, multi-source news aggregation system built with Next.js 14, TypeScript, and Tailwind CSS. Features include theme toggle, category filtering, search, and integration with multiple news APIs and RSS feeds.

## Features

### 🎨 Theme System
- **Light/Dark Theme Toggle**: Persistent theme switching with no FOUC
- **System Preference Detection**: Automatically detects user's preferred color scheme
- **Smooth Transitions**: Elegant theme switching animations

### 📰 Multi-Source News
- **API Integration**: NewsAPI, The Guardian, New York Times (when keys provided)
- **RSS Fallback**: Comprehensive RSS feed support as reliable fallback
- **Smart Categorization**: 8 categories (world, business, tech, sports, entertainment, science, crypto, finance)
- **Automatic Deduplication**: Removes duplicate articles across sources

### 🔍 Advanced Filtering
- **Category Tabs**: Quick category switching
- **Search Functionality**: Full-text search across all sources
- **Pagination**: Load more functionality with infinite scroll support
- **Source Attribution**: Clear indication of news source

### 📊 Market Data
- **Ticker Detection**: Automatically identifies stock/crypto symbols
- **Chart Links**: Direct links to TradingView charts
- **Market Overview**: Real-time ticker information (when API available)

### ⚡ Performance
- **LRU Caching**: In-memory caching with TTL
- **Parallel Fetching**: Concurrent API requests for faster loading
- **Error Isolation**: Individual provider failures don't break the system
- **Rate Limit Handling**: Graceful degradation on API limits

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with CSS variables
- **State Management**: React hooks with context
- **HTTP Client**: Axios with timeout handling
- **Caching**: LRU cache with TTL
- **RSS Parsing**: RSS Parser library
- **Date Handling**: date-fns

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy `env.example` to `.env.local` and add your API keys:

```bash
cp env.example .env.local
```

**Optional API Keys** (RSS will be used as fallback):
- `NEWSAPI_KEY`: Get from [NewsAPI.org](https://newsapi.org/)
- `GUARDIAN_KEY`: Get from [The Guardian](https://open-platform.theguardian.com/)
- `NYT_KEY`: Get from [NYT Developer](https://developer.nytimes.com/)
- `ALPHAVANTAGE_KEY`: Get from [Alpha Vantage](https://www.alphavantage.co/)

### 3. Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build & Deploy

```bash
npm run build
npm start
```

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/news/          # News API endpoint
│   ├── blog/              # News feed page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/             # React components
│   ├── feed/              # News feed components
│   ├── ThemeToggle.tsx    # Theme switcher
│   └── ThemeProvider.tsx  # Theme context
├── lib/                    # Utility functions
│   ├── cache.ts           # Caching utilities
│   ├── hash.ts            # Hash generation
│   └── time.ts            # Time formatting
├── news/                   # News system
│   ├── providers/         # News providers
│   ├── types.ts           # TypeScript types
│   ├── registry.ts        # Provider management
│   └── news.config.ts     # Configuration
└── public/                 # Static assets
```

## News Providers

### 1. NewsAPI Provider
- **Endpoint**: `/everything` and `/top-headlines`
- **Categories**: Full category support
- **Rate Limit**: 1000 requests/day (free tier)
- **Features**: Image URLs, author information

### 2. Guardian Provider
- **Endpoint**: `/search`
- **Categories**: Section-based filtering
- **Rate Limit**: 500 requests/day (free tier)
- **Features**: Rich metadata, thumbnails

### 3. NYT Provider
- **Endpoint**: `/search/v2/articlesearch.json`
- **Categories**: News desk filtering
- **Rate Limit**: 1000 requests/day (free tier)
- **Features**: Multimedia support, bylines

### 4. RSS Provider
- **Sources**: BBC, CNN, Reuters, TechCrunch, etc.
- **Categories**: Keyword-based detection
- **Rate Limit**: None (RSS feeds)
- **Features**: Always available, reliable fallback

## Configuration

### RSS Sources

Edit `news/news.config.ts` to customize RSS sources:

```typescript
rss: {
  enabled: true,
  sources: {
    world: [
      'https://feeds.bbci.co.uk/news/world/rss.xml',
      'https://rss.cnn.com/rss/edition_world.rss'
    ],
    tech: [
      'https://feeds.feedburner.com/TechCrunch/',
      'https://feeds.arstechnica.com/arstechnica/index'
    ]
    // ... more categories
  }
}
```

### Cache Settings

Adjust cache TTL in `news/registry.ts`:

```typescript
this.cache = new NewsCache({ 
  ttl: 1000 * 60 * 10, // 10 minutes
  max: 500 // Maximum cached items
});
```

## API Endpoints

### GET /api/news
Fetch news with filtering and pagination.

**Query Parameters:**
- `category`: News category (optional)
- `q`: Search query (optional)
- `page`: Page number (default: 1)
- `pageSize`: Items per page (default: 20, max: 100)

**Response:**
```json
{
  "items": [...],
  "page": 1,
  "nextPage": 2,
  "sourceStats": {
    "NewsAPI": 15,
    "RSS: BBC": 8
  },
  "totalItems": 45
}
```

### HEAD /api/news
Health check endpoint.

## Customization

### Adding New Providers

1. Create a new provider class extending `BaseProvider`
2. Implement `fetchFromSource` and `transformItems` methods
3. Add to `ProviderRegistry.initializeProviders()`

### Styling

The system uses Tailwind CSS with CSS variables for theming. Customize colors in `app/globals.css`:

```css
:root {
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  /* ... more variables */
}
```

### Categories

Add new categories in `news/types.ts`:

```typescript
export type NewsCategory = 
  | 'world' 
  | 'business' 
  | 'tech'
  | 'health' // New category
  // ... existing categories
```

## Performance Considerations

### Caching Strategy
- **Memory Cache**: LRU cache with 10-minute TTL
- **API Caching**: HTTP cache headers for CDN optimization
- **Deduplication**: Prevents duplicate content across sources

### Error Handling
- **Graceful Degradation**: RSS fallback when APIs fail
- **Rate Limit Awareness**: Automatic provider skipping on 429 responses
- **Timeout Handling**: 10-second request timeouts

### Loading States
- **Skeleton Loading**: Smooth loading animations
- **Progressive Enhancement**: Content loads progressively
- **Error Boundaries**: Graceful error handling

## Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+
- **Mobile**: Responsive design with touch-friendly interactions
- **Accessibility**: WCAG 2.1 AA compliant

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
1. Check the existing issues
2. Create a new issue with detailed description
3. Include browser and environment information

## Roadmap

- [ ] Real-time news updates
- [ ] User preferences and saved articles
- [ ] Advanced search filters
- [ ] Social sharing integration
- [ ] Newsletter subscriptions
- [ ] Mobile app (React Native)
- [ ] Analytics dashboard
- [ ] Multi-language support
