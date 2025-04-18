import { getLandings } from '@/lib/wordpress';
import Navigation from '@/components/Navigation';
import { CustomPost } from '@/lib/types';

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  const landings = await getLandings();

  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Things That Move Ltd.</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {landings.map((landing: CustomPost) => (
            <article key={landing.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <h2 
                className="text-2xl font-semibold mb-4"
                dangerouslySetInnerHTML={{ __html: landing.title.rendered }}
              />
              <div 
                className="prose"
                dangerouslySetInnerHTML={{ __html: landing.excerpt?.rendered || '' }}
              />
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
