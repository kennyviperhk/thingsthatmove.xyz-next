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

export async function getPost(slug: string) {
  // Request ACF fields explicitly
  const res = await fetch(`${WP_API_URL}/posts?slug=${slug}&_embed&_fields=id,title,content,acf,meta,custom_fields`);
  const posts = await res.json();
  
  if (!posts || posts.length === 0) return null;
  
  const post = posts[0];
  
  // Log raw post data
  console.log('Raw post data:', {
    acf: post.acf,
    meta: post.meta,
    custom_fields: post.custom_fields
  });
  
  // Get ACF fields
  const acfFields = post.acf || {};
  
  // Merge ACF fields and ensure gallery data is properly structured
  const processedPost = {
    ...post,
    ...acfFields,
    is_secondary_two_column: acfFields.is_secondary_two_column || post.meta?.is_secondary_two_column || "0",
    secondary_two_column_gallery: acfFields.secondary_two_column_gallery || post.meta?.secondary_two_column_gallery || [],
    two_column_gallery: acfFields.two_column_gallery || post.meta?.two_column_gallery || []
  };

  // Log processed data
  console.log('Processed post data:', {
    is_secondary_two_column: processedPost.is_secondary_two_column,
    has_secondary_gallery: Array.isArray(processedPost.secondary_two_column_gallery),
    secondary_gallery_length: processedPost.secondary_two_column_gallery?.length,
    secondary_gallery_data: processedPost.secondary_two_column_gallery,
    meta_fields: post.meta,
    acf_fields: acfFields
  });

  return processedPost;
}