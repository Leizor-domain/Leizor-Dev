import Link from 'next/link'
import { ThemeToggle } from '@/components/ThemeToggle'

export default function HomePage() {
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
                href="/blog" 
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                News Feed
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Multi-Source News
            <span className="block text-primary">Aggregation</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
            Stay informed with curated news from multiple sources including APIs and RSS feeds. 
            Browse by category, search topics, and toggle between light and dark themes.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/blog"
              className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Explore News Feed
            </Link>
            <Link
              href="/about"
              className="text-sm font-semibold leading-6 text-muted-foreground hover:text-primary transition-colors"
            >
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Multiple Sources</h3>
            <p className="text-muted-foreground">Aggregate news from NewsAPI, Guardian, NYT, and RSS feeds with automatic fallbacks.</p>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Smart Categorization</h3>
            <p className="text-muted-foreground">Organized by world, business, tech, sports, entertainment, science, crypto, and finance.</p>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Theme Toggle</h3>
            <p className="text-muted-foreground">Switch between light and dark themes with persistent preferences and no flash of unstyled content.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
