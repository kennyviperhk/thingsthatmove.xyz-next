import { getPageBySlug } from '@/lib/wordpress';

export const revalidate = 3600; // Revalidate every hour

export default async function BioPage() {
  const page = await getPageBySlug('bio');

  if (!page) {
    return <div>Loading...</div>;
  }

  return (
    <article className="bio-page">
      <h1 dangerouslySetInnerHTML={{ __html: page.title.rendered }} />
      <div 
        className="content"
        dangerouslySetInnerHTML={{ __html: page.content.rendered }}
      />
    </article>
  );
} 