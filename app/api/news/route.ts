import { NextRequest, NextResponse } from 'next/server';
import { providerRegistry } from '@/news/registry';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const category = searchParams.get('category') || undefined;
    const q = searchParams.get('q') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') || '20', 10), 100);

    // Validate parameters
    if (page < 1 || pageSize < 1 || pageSize > 100) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }

    // Fetch news from registry
    const newsResponse = await providerRegistry.fetchAggregate({
      category,
      q,
      page,
      pageSize
    });

    // Add cache headers for better performance
    const response = NextResponse.json(newsResponse);
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    
    return response;

  } catch (error) {
    console.error('News API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch news',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function HEAD(request: NextRequest) {
  // Health check endpoint
  try {
    const stats = providerRegistry.getProviderStats();
    return NextResponse.json({ 
      status: 'healthy',
      providers: stats.totalProviders,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'unhealthy', error: 'Provider registry error' },
      { status: 500 }
    );
  }
}
