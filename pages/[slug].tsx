// pages/[slug].tsx
import { GetStaticProps, GetStaticPaths } from 'next';
import { getPage } from '../lib/api';
import { Page } from '@/lib/types';

interface PageProps {
  page: Page;
}

interface StaticProps {
  params: {
    slug: string;
  };
}

export const getStaticProps: GetStaticProps<PageProps, StaticProps['params']> = async ({ params }) => {
  if (!params?.slug) {
    return {
      notFound: true,
    };
  }

  const page = await getPage(params.slug);
  
  if (!page || !page[0]) {
    return {
      notFound: true,
    };
  }

  return {
    props: { 
      page: page[0]
    },
    revalidate: 60
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  // Generate paths for static pages
  return {
    paths: [],
    fallback: 'blocking'
  };
};

export default function DynamicPage({ page }: PageProps) {
  return (
    <article className="page-content">
      <h1 dangerouslySetInnerHTML={{ __html: page.title.rendered }} />
      <div 
        className="content"
        dangerouslySetInnerHTML={{ __html: page.content.rendered }}
      />
    </article>
  );
}