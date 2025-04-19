import { getPageBySlug } from '@/lib/wordpress';
import StyledBioContent from './StyledBioContent';

export const revalidate = 3600; // Revalidate every hour

export default async function BioPage() {
  const page = await getPageBySlug('bio');

  if (!page) {
    return <div>Loading...</div>;
  }

  return (
    <StyledBioContent 
      title={page.title.rendered}
      content={page.content.rendered}
    />
  );
} 