// pages/[slug].tsx
import { getPage } from '../lib/api'

export async function getStaticProps({ params }) {
  const page = await getPage(params.slug)
  return {
    props: { page },
    revalidate: 60
  }
}

export async function getStaticPaths() {
  // Generate paths for static pages
  return {
    paths: [],
    fallback: 'blocking'
  }
}