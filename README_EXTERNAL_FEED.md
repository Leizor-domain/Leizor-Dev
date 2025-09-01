# 🧠 External Content Recommender System

A fully functional and lightweight personalized external project & content recommender system for `leizor.dev`.

## ✨ Features

- **Smart Behavior Tracking**: Detects user interactions (clicks, hovers, scrolls, time-on-section)
- **Personalized Recommendations**: Maps user behavior to interest tags
- **Multi-Source Content**: Fetches from NewsAPI, Dev.to, Product Hunt, Currents API, and Reddit
- **Real-time Updates**: Content refreshes every 10 minutes
- **No Login Required**: Works entirely with localStorage and cookies
- **Responsive Design**: Matches your site's dark theme and design language

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in your project root:

```env
# Required API Keys
NEWS_API_KEY=your_news_api_key_here
CURRENTS_KEY=your_currents_api_key_here
PH_TOKEN=your_product_hunt_token_here

# Optional
DEV_TO_API_KEY=optional_dev_to_api_key

# Server Configuration
PORT=3000
NODE_ENV=production
```

### 3. Get API Keys

#### NewsAPI.org (Free tier available)
- Visit: https://newsapi.org/
- Sign up for free account
- Copy your API key

#### Currents API (Free tier available)
- Visit: https://currentsapi.services/
- Sign up for free account
- Copy your API key

#### Product Hunt (Free tier available)
- Visit: https://api.producthunt.com/
- Create app and get access token
- Copy your token

#### Dev.to & Reddit
- No API keys required (public APIs)

### 4. Start the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

## 📁 File Structure

```
leizor-dev/
├── server.js                 # Backend Express server
├── package.json             # Dependencies and scripts
├── .env                     # Environment variables (create this)
├── env.example             # Environment template
├── assets/
│   ├── js/
│   │   └── feed-widget.js  # Frontend behavior tracking & widget
│   └── css/
│       └── feed-widget.css # Widget styling
├── projects/
│   └── index.html          # Projects page with integrated widget
└── index.html              # Main page with behavior tracking
```

## 🔧 How It Works

### Backend (server.js)
- **Express server** with CORS enabled
- **Multiple API integrations** fetching content in parallel
- **Smart error handling** with fallbacks
- **Content aggregation** and shuffling for variety
- **Health check endpoint** for monitoring

### Frontend (feed-widget.js)
- **Behavior tracking** on all pages
- **Interest mapping** to relevant tags
- **localStorage management** for user preferences
- **Dynamic feed rendering** with smooth animations
- **Responsive grid layout** for all devices

### Content Sources
1. **NewsAPI**: Trending articles by keywords
2. **Dev.to**: Developer articles by tag
3. **Product Hunt**: Trending product launches
4. **Currents API**: Broad news coverage
5. **Reddit**: Community discussions and trends

## 🎯 User Behavior Tracking

The system automatically tracks:

- **Project interactions**: Clicks on project cards
- **Tech tag interest**: Hovering over technology tags
- **Scroll behavior**: Time spent on different sections
- **Form interactions**: Input fields related to projects/tech
- **Section engagement**: Headings and content areas

## 🎨 Customization

### Styling
- Edit `assets/css/feed-widget.css` to match your brand
- Colors, fonts, and animations are easily customizable
- Responsive breakpoints for mobile optimization

### Content Sources
- Add/remove APIs in `server.js`
- Modify content processing in individual fetch functions
- Adjust content limits and filtering logic

### Behavior Tracking
- Customize interest detection in `feed-widget.js`
- Add new tracking methods for specific interactions
- Modify tag generation and storage logic

## 🚀 Deployment

### Render.com
1. Connect your GitHub repository
2. Set environment variables in dashboard
3. Build command: `npm install`
4. Start command: `npm start`

### Fly.io
1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Login: `fly auth login`
3. Deploy: `fly deploy`

### Vercel
1. Import your repository
2. Set environment variables
3. Deploy automatically

### Environment Variables for Production
```env
NEWS_API_KEY=your_production_key
CURRENTS_KEY=your_production_key
PH_TOKEN=your_production_token
PORT=3000
NODE_ENV=production
```

## 📊 Monitoring & Health

### Health Check Endpoint
```
GET /api/health
```

Returns server status and API key availability:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "sources": {
    "newsAPI": true,
    "currents": true,
    "productHunt": true,
    "devTo": true,
    "reddit": true
  }
}
```

### API Endpoint
```
GET /api/external-feed?tags=AI,Finance
```

Returns personalized content:
```json
{
  "success": true,
  "data": [
    {
      "title": "AI Detects Fraud in Real-Time",
      "url": "https://example.com/article",
      "source": "NewsAPI",
      "description": "Advanced machine learning...",
      "publishedAt": "2024-01-15T10:00:00Z"
    }
  ],
  "sources": {
    "newsAPI": 3,
    "devTo": 3,
    "productHunt": 3,
    "currents": 3,
    "reddit": 3
  }
}
```

## 🔒 Security & Privacy

- **No user data stored** on server
- **All tracking is client-side** via localStorage
- **CORS enabled** for cross-origin requests
- **API rate limiting** built into external APIs
- **Error handling** prevents data leakage

## 🐛 Troubleshooting

### Common Issues

1. **"Failed to fetch" errors**
   - Check API keys in `.env`
   - Verify internet connection
   - Check API rate limits

2. **No content showing**
   - Check browser console for errors
   - Verify server is running
   - Check `/api/health` endpoint

3. **Styling issues**
   - Ensure CSS file is loaded
   - Check for CSS conflicts
   - Verify Tailwind CSS is available

### Debug Mode
Enable debug logging by setting:
```env
NODE_ENV=development
DEBUG=true
```

## 📈 Performance Optimization

- **Content caching** (5 minutes)
- **Parallel API calls** for faster loading
- **Lazy loading** of feed content
- **Optimized images** and assets
- **CDN-ready** for global distribution

## 🔄 Updates & Maintenance

### Regular Tasks
- Monitor API rate limits
- Update API endpoints if needed
- Check for new content sources
- Review user feedback and analytics

### Version Updates
- Keep dependencies updated: `npm update`
- Monitor API changes from providers
- Test new features in development

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API provider documentation
3. Check server logs for errors
4. Test endpoints individually

## 🎉 What You Get

✅ **Fully functional** external content recommender  
✅ **Professional design** matching your site theme  
✅ **Smart behavior tracking** without login  
✅ **Multiple content sources** for variety  
✅ **Real-time updates** and caching  
✅ **Responsive design** for all devices  
✅ **Easy deployment** to any platform  
✅ **Comprehensive documentation**  

Your visitors will now see personalized, trending content that keeps them engaged and coming back for more! 🚀
