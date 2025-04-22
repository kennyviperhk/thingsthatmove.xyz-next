'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Loading from '@/components/Loading';
import { notFound } from 'next/navigation';
import { getPost } from '@/lib/api';

// Import all the post components
import PostVideoText from '@/components/post/PostVideoText';
import FullWidthGallery from '@/components/post/FullWidthGallery';
import BigVerticalGallery from '@/components/post/BigVerticalGallery';
import TwoColumnGallery from '@/components/post/TwoColumnGallery';
import Acknowledgment from '@/components/post/Acknowledgment';
import TechInfo from '@/components/post/TechInfo';
import ModelViewer from '@/components/post/ModelViewer';
import SwipeGallery from '@/components/post/SwipeGallery';

const WORDPRESS_API_BASE = 'https://blog.thingsthatmove.xyz/wp-json';

interface GalleryItem {
  guid?: string;
  guid_rendered?: string;
  url: string;
  post_title?: string;
  caption?: string;
}

interface PostData {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  concept?: string;
  main_documentation_video?: string;
  tech_info?: any;
  full_width_gallery?: GalleryItem[];
  big_vertical_gallery?: GalleryItem[];
  two_column_gallery?: GalleryItem[];
  secondary_two_column_gallery?: GalleryItem[];
  swipe_gallery?: GalleryItem[];
  acknowledgment?: any;
  is_tech?: string;
  is_secondary_vid?: string;
  is_secondary_desc?: string;
  is_swipe?: string;
  is_acknowledgment?: string;
  is_exhibition_record?: string;
  is_related_post?: string;
  is_3d_model?: string;
  model_viewer?: any;
  model_height?: string;
  distance_between_the_ground?: string;
  secondary_desc?: string;
  secondary_documentation_video?: string;
  is_secondary_two_column?: string;
}

const PostArticle = styled.article`
  padding-top: 0 !important;
  min-height: 100vh;
`;

const ErrorDisplay = styled.div`
  padding: 2rem;
  color: red;
  max-width: 1200px;
  margin: 0 auto;
`;

// Helper function to normalize gallery data
function normalizeGalleryData(gallery: any[]): GalleryItem[] {
  if (!gallery || !Array.isArray(gallery)) return [];
  return gallery.map(item => ({
    guid: item.guid,
    guid_rendered: item.guid?.rendered,
    url: item.url || item.guid?.rendered || item.guid,
    post_title: item.post_title,
    caption: item.caption
  }));
}

export default async function PostPage({ params }: { params: { slug: string[] } }) {
  const slug = params.slug.join('/');
  console.log('Fetching post for slug:', slug);

  const post = await getPost(slug);
  console.log('Raw post data:', {
    is_secondary_two_column: post?.is_secondary_two_column,
    secondary_two_column_gallery: post?.secondary_two_column_gallery,
    acf: post?.acf,
    custom_fields: post?.custom_fields,
    meta: post?.meta
  });

  if (!post) {
    notFound();
  }

  // Transform all gallery data
  const galleries = [];

  // Add primary gallery if it exists
  if (post.two_column_gallery && Array.isArray(post.two_column_gallery)) {
    const normalizedPrimaryGallery = normalizeGalleryData(post.two_column_gallery);
    if (normalizedPrimaryGallery.length > 0) {
      galleries.push(normalizedPrimaryGallery);
    }
  }

  // Add secondary gallery if it exists and is enabled
  if (post.is_secondary_two_column === "1" && post.secondary_two_column_gallery && Array.isArray(post.secondary_two_column_gallery)) {
    const normalizedSecondaryGallery = normalizeGalleryData(post.secondary_two_column_gallery);
    if (normalizedSecondaryGallery.length > 0) {
      galleries.push(normalizedSecondaryGallery);
    }
  }

  console.log('Processed gallery data:', {
    total_galleries: galleries.length,
    galleries: galleries
  });

  return (
    <PostArticle>
      {post.is_tech === "1" && (
        <TechInfo data={post.tech_info} />
      )}
      
      <PostVideoText 
        concept={post.concept} 
        video={post.main_documentation_video} 
      />
      
      <FullWidthGallery data={post.full_width_gallery} />
      
      {post.is_secondary_desc === "1" && (
        <PostVideoText 
          isSecondary={true} 
          concept={post.secondary_desc} 
          video={post.secondary_documentation_video} 
        />
      )}
      
      <BigVerticalGallery data={post.big_vertical_gallery} />
      
      {galleries.length > 0 && (
        <TwoColumnGallery data={galleries} />
      )}
      
      {post.is_swipe === "1" && (
        <SwipeGallery data={post.swipe_gallery} />
      )}
      
      {post.is_acknowledgment === "1" && (
        <Acknowledgment data={post.acknowledgment} />
      )}
      
      {post.is_3d_model === "1" && (
        <ModelViewer 
          data1={post.model_viewer} 
          data2={post.model_height} 
          data3={post.distance_between_the_ground}
        />
      )}
    </PostArticle>
  );
} 