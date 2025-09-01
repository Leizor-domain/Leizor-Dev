export interface NewsConfig {
  providers: {
    newsAPI?: {
      enabled: boolean;
      envKey: string;
      baseUrl: string;
      categories: Record<string, string>;
    };
    guardian?: {
      enabled: boolean;
      envKey: string;
      baseUrl: string;
      categories: Record<string, string>;
    };
    nyt?: {
      enabled: boolean;
      envKey: string;
      baseUrl: string;
      categories: Record<string, string>;
    };
    rss: {
      enabled: boolean;
      sources: Record<string, string[]>;
    };
  };
  categories: string[];
  defaultPageSize: number;
  maxPageSize: number;
  cacheTTL: number;
}

export const newsConfig: NewsConfig = {
  providers: {
    newsAPI: {
      enabled: !!process.env.NEWSAPI_KEY,
      envKey: 'NEWSAPI_KEY',
      baseUrl: 'https://newsapi.org/v2',
      categories: {
        world: 'world',
        business: 'business',
        tech: 'technology',
        sports: 'sports',
        entertainment: 'entertainment',
        science: 'science',
        crypto: 'cryptocurrency',
        finance: 'business'
      }
    },
    guardian: {
      enabled: !!process.env.GUARDIAN_KEY,
      envKey: 'GUARDIAN_KEY',
      baseUrl: 'https://content.guardianapis.com',
      categories: {
        world: 'world',
        business: 'business',
        tech: 'technology',
        sports: 'sport',
        entertainment: 'culture',
        science: 'science',
        crypto: 'technology',
        finance: 'business'
      }
    },
    nyt: {
      enabled: !!process.env.NYT_KEY,
      envKey: 'NYT_KEY',
      baseUrl: 'https://api.nytimes.com/svc',
      categories: {
        world: 'world',
        business: 'business',
        tech: 'technology',
        sports: 'sports',
        entertainment: 'arts',
        science: 'science',
        crypto: 'technology',
        finance: 'business'
      }
    },
    rss: {
      enabled: true,
      sources: {
        world: [
          'https://feeds.bbci.co.uk/news/world/rss.xml',
          'https://rss.cnn.com/rss/edition_world.rss',
          'https://feeds.reuters.com/Reuters/worldNews'
        ],
        business: [
          'https://feeds.bbci.co.uk/news/business/rss.xml',
          'https://rss.cnn.com/rss/money_latest.rss',
          'https://feeds.reuters.com/reuters/businessNews'
        ],
        tech: [
          'https://feeds.feedburner.com/TechCrunch/',
          'https://rss.cnn.com/rss/edition_technology.rss',
          'https://feeds.arstechnica.com/arstechnica/index'
        ],
        sports: [
          'https://feeds.bbci.co.uk/sport/rss.xml',
          'https://rss.cnn.com/rss/edition_sport.rss',
          'https://feeds.reuters.com/reuters/sportsNews'
        ],
        entertainment: [
          'https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml',
          'https://rss.cnn.com/rss/edition_entertainment.rss'
        ],
        science: [
          'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml',
          'https://rss.cnn.com/rss/edition_space.rss'
        ],
        crypto: [
          'https://cointelegraph.com/rss',
          'https://cryptonews.com/news/feed'
        ],
        finance: [
          'https://feeds.reuters.com/reuters/businessNews',
          'https://www.ft.com/rss/home'
        ]
      }
    }
  },
  categories: ['world', 'business', 'tech', 'sports', 'entertainment', 'science', 'crypto', 'finance'],
  defaultPageSize: 20,
  maxPageSize: 100,
  cacheTTL: 1000 * 60 * 10 // 10 minutes
};
