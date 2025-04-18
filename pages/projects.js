
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useEffect, useState } from 'react';
import { fetchPosts } from '../lib/api';

export default function Projects() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts().then(setPosts).catch(console.error);
  }, []);

  return (
    <>
      <Header />
      <main style={{ padding: '2rem', color: 'white' }}>
        <h1>Projects</h1>
        {posts.map((post) => (
          <div key={post.id}>
            <h2 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
            <div dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
          </div>
        ))}
      </main>
      <Footer />
    </>
  );
}
