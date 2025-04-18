import { getPageBySlug } from '@/lib/wordpress';

export const revalidate = 3600; // Revalidate every hour

export default async function InteractiveDigitalPage() {
  const page = await getPageBySlug('interactive-digital');

  if (!page) {
    return <div>Loading...</div>;
  }

  return (
    <article className="interactive-digital-page">
      <h1 dangerouslySetInnerHTML={{ __html: page.title.rendered }} />
      <div 
        className="content"
        dangerouslySetInnerHTML={{ __html: page.content.rendered }}
      />
    </article>
  );
} 