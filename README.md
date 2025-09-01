# Leizor Dev - Enterprise Solutions Architect

A modern, responsive portfolio website showcasing enterprise-level full-stack development and technology consulting services.

## 🚀 Features

### Core Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark/Light Theme**: Toggle between themes with persistent storage
- **Interactive Feed Panel**: Windows 11-style news & interests panel
- **Multi-API News System**: Real-time news from multiple sources
- **Professional Portfolio**: Showcase of projects and expertise

### Technical Stack
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS with custom animations
- **APIs**: NewsAPI, Guardian, NYT, RSS feeds
- **Performance**: Optimized loading and caching

### News Feed System
- **Real-time Content**: Live news from multiple APIs
- **Category Filtering**: Top Stories, Sports, Markets, Technology, Formula 1
- **Fallback System**: Graceful degradation when APIs are unavailable
- **Caching**: Intelligent caching for better performance

## 📁 Project Structure

```
leizor-dev/
├── main.html              # Main portfolio page
├── assets/                # Static assets
│   ├── images/           # Images and icons
│   ├── audio/            # Audio files
│   ├── css/              # Custom CSS
│   └── js/               # JavaScript files
├── components/           # React components (Next.js)
├── app/                  # Next.js app directory
├── news/                 # News API system
├── lib/                  # Utility libraries
└── README.md            # This file
```

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Leizor-domain/Leizor-Dev.git
   cd Leizor-Dev
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp env.example .env.local
   # Add your API keys to .env.local
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### API Keys (Optional)
The system works without API keys using fallback data, but for real-time content:

```env
NEWSAPI_KEY=your_newsapi_key_here
GUARDIAN_KEY=your_guardian_key_here
NYT_KEY=your_nyt_key_here
ALPHAVANTAGE_KEY=your_alphavantage_key_here
```

### Available APIs
- **NewsAPI**: General news content
- **Guardian**: International news
- **NYT**: New York Times content
- **Alpha Vantage**: Financial market data
- **RSS Feeds**: Fallback content sources

## 🎨 Customization

### Theme Colors
Modify the primary color scheme in `main.html`:
```css
colors: {
    'primary': {
        50: '#f0f9ff',
        500: '#0ea5e9',
        900: '#0c4a6e',
    }
}
```

### Content Updates
- **Portfolio**: Update project data in `data/projects.json`
- **News Sources**: Modify API endpoints in the feed system
- **Styling**: Customize Tailwind classes and CSS variables

## 📱 Responsive Design

The website is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🚀 Deployment

### Static Hosting
The main page (`main.html`) can be deployed to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3

### Next.js Deployment
For the full Next.js application:
```bash
npm run build
npm start
```

## 🔍 Performance Optimizations

- **Image Optimization**: Responsive images with proper sizing
- **Code Splitting**: Modular JavaScript loading
- **Caching**: API response caching
- **Minification**: Production-ready code

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

- **Website**: [leizor.dev](https://leizor.dev)
- **Email**: [Contact through website](https://leizor.dev/contact.html)
- **LinkedIn**: [Professional Profile](https://linkedin.com/in/leizor)

## 🙏 Acknowledgments

- **Tailwind CSS** for the utility-first CSS framework
- **Unsplash** for high-quality images
- **News APIs** for real-time content
- **Open Source Community** for inspiration and tools

---

Built with ❤️ by Leizor - Enterprise Solutions Architect
