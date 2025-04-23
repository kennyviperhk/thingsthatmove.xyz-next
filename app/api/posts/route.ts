import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Enable Edge Runtime
export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    // Get cache tag from request header or default to 'posts'
    const cacheTag = request.headers.get('x-cache-tag') || 'posts'
    
    // Create cache key based on URL and cache tag
    const cacheKey = new Request(request.url, {
      headers: { 'x-cache-tag': cacheTag }
    })
    
    // Try to get response from cache
    const cache = await caches.open('wordpress-cache')
    const cachedResponse = await cache.match(cacheKey)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    // If not in cache, fetch from WordPress
    const wpResponse = await fetch(`${process.env.WORDPRESS_API_URL}/posts?per_page=10`, {
      headers: {
        'Accept': 'application/json',
      },
    })
    
    if (!wpResponse.ok) {
      throw new Error('Failed to fetch posts')
    }
    
    const posts = await wpResponse.json()
    
    // Create response with CORS and cache headers
    const response = new NextResponse(JSON.stringify(posts), {
      headers: {
        'content-type': 'application/json',
        'cache-control': 'public, s-maxage=60, stale-while-revalidate=300',
        'Access-Control-Allow-Origin': '*',
      },
    })
    
    // Store in cache
    await cache.put(cacheKey, response.clone())
    
    return response
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch posts' }),
      {
        status: 500,
        headers: {
          'content-type': 'application/json',
        },
      }
    )
  }
} 