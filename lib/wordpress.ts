import { Post, Page, CustomPost } from './types';

const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://blog.thingsthatmove.xyz/wp-json';

async function fetchAPI(endpoint: string, params: Record<string, string> = {}) {
  const queryString = new URLSearchParams(params).toString();
  const url = `${API_URL}${endpoint}${queryString ? '?' + queryString : ''}`;
  
  const res = await fetch(url);
  
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}`);
  }
  
  return res.json();
}

export async function getPosts(page = 1, perPage = 50) {
  return fetchAPI('/wp/v2/posts', {
    page: page.toString(),
    per_page: perPage.toString(),
  });
}

export async function getPages() {
  return fetchAPI('/wp/v2/pages');
}

export async function getProjects() {
  return fetchAPI('/wp/v2/projects');
}

export async function getLandings() {
  return fetchAPI('/wp/v2/landings');
}

export async function getPostBySlug(slug: string) {
  const posts = await fetchAPI('/wp/v2/posts', {
    slug,
  });
  return posts[0];
}

export async function getPageBySlug(slug: string) {
  const pages = await fetchAPI('/wp/v2/pages', {
    slug,
  });
  return pages[0];
} 