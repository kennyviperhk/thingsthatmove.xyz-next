// pages/index.js or app/page.js

import { fetchPosts } from '../lib/api';

export default async function HomePage() {
  const posts = await fetchPosts();

  return (
    <div>
      <h1>Latest Posts</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>{post.title.rendered}</li>
        ))}
      </ul>
    </div>
  );
}
