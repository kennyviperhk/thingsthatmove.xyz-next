// lib/api.ts
import useSWR from 'swr'
import axios from 'axios'

const WP_API_URL = 'https://blog.thingsthatmove.xyz/wp-json/wp/v2';

const fetcher = async (url: string) => {
  const res = await axios.get(url)
  return res.data
}

// Reusable SWR hook for WordPress API calls
export function useWordPressData(endpoint: string, options = {}) {
  const { data, error, isLoading, mutate } = useSWR(
    `${process.env.WORDPRESS_API_URL}${endpoint}`,
    fetcher,
    {
      revalidateOnFocus: false, // Don't revalidate on tab focus
      revalidateOnReconnect: true, // Revalidate when browser regains connection
      dedupingInterval: 60000, // Dedupe requests within 1 minute
      ...options,
    }
  )

  return {
    data,
    error,
    isLoading,
    mutate, // Function to manually revalidate data
  }
}

// Cache-first fetcher for static data
export async function fetchWithCache(endpoint: string) {
  const cacheKey = `wp_cache_${endpoint}`
  
  // Check if data exists in localStorage
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      const { data, timestamp } = JSON.parse(cached)
      // Return cached data if it's less than 1 hour old
      if (Date.now() - timestamp < 3600000) {
        return data
      }
    }
  }

  // If no cache or expired, fetch fresh data
  const response = await axios.get(`${process.env.WORDPRESS_API_URL}${endpoint}`)
  const data = response.data

  // Save to cache
  if (typeof window !== 'undefined') {
    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        data,
        timestamp: Date.now(),
      })
    )
  }

  return data
}

export async function getProjects() {
  const res = await fetch(`${WP_API_URL}/posts?categories=projects`);
  return res.json();
}

export async function getPage(slug: string) {
  const res = await fetch(`${WP_API_URL}/pages?slug=${slug}`);
  return res.json();
}

export async function getPost(slug: string) {
  // Request ACF fields explicitly
  const res = await fetch(`${WP_API_URL}/posts?slug=${slug}&_embed&_fields=id,title,content,acf,meta,custom_fields`);
  const posts = await res.json();
  
  if (!posts || posts.length === 0) return null;
  
  const post = posts[0];
  
  // Log raw post data
  console.log('Raw post data:', {
    acf: post.acf,
    meta: post.meta,
    custom_fields: post.custom_fields
  });
  
  // Get ACF fields
  const acfFields = post.acf || {};
  
  // Merge ACF fields and ensure gallery data is properly structured
  const processedPost = {
    ...post,
    ...acfFields,
    is_secondary_two_column: acfFields.is_secondary_two_column || post.meta?.is_secondary_two_column || "0",
    secondary_two_column_gallery: acfFields.secondary_two_column_gallery || post.meta?.secondary_two_column_gallery || [],
    two_column_gallery: acfFields.two_column_gallery || post.meta?.two_column_gallery || []
  };

  // Log processed data
  console.log('Processed post data:', {
    is_secondary_two_column: processedPost.is_secondary_two_column,
    has_secondary_gallery: Array.isArray(processedPost.secondary_two_column_gallery),
    secondary_gallery_length: processedPost.secondary_two_column_gallery?.length,
    secondary_gallery_data: processedPost.secondary_two_column_gallery,
    meta_fields: post.meta,
    acf_fields: acfFields
  });

  return processedPost;
}