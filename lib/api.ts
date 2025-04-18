// lib/api.ts
const WP_API_URL = 'https://blog.thingsthatmove.xyz/wp-json/wp/v2';

export async function getProjects() {
  const res = await fetch(`${WP_API_URL}/posts?categories=projects`);
  return res.json();
}

export async function getPage(slug: string) {
  const res = await fetch(`${WP_API_URL}/pages?slug=${slug}`);
  return res.json();
}