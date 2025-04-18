const API_URL = 'https://blog.thingsthatmove.xyz/wp-json/wp/v2';

export async function fetchPosts() {
  const res = await fetch(`${API_URL}/posts?_embed`);
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

export async function fetchPages() {
  const res = await fetch(`${API_URL}/pages?_embed`);
  if (!res.ok) throw new Error('Failed to fetch pages');
  return res.json();
}

export async function fetchPage(slug) {
  const res = await fetch(`${API_URL}/pages?slug=${slug}&_embed`);
  if (!res.ok) throw new Error('Failed to fetch page');
  const pages = await res.json();
  return pages[0];
}
