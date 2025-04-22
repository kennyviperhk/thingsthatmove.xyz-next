'use client';

import { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Loading from '@/components/Loading';

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
  tech_info?: {
    title?: string;
    content?: string;
  };
  full_width_gallery?: Array<{
    url: string;
    caption?: string;
  }>;
  big_vertical_gallery?: Array<{
    url: string;
    caption?: string;
  }>;
  two_column_gallery?: Array<{
    url: string;
    caption?: string;
  }>;
  secondary_two_column_gallery?: Array<{
    url: string;
    caption?: string;
  }>;
  swipe_gallery?: Array<{
    url: string;
    caption?: string;
  }>;
  acknowledgment?: {
    title?: string;
    content?: string;
  };
  is_tech?: string;
  is_secondary_vid?: string;
  is_secondary_desc?: string;
  is_swipe?: string;
  is_acknowledgment?: string;
  is_exhibition_record?: string;
  is_related_post?: string;
  is_3d_model?: string;
  is_secondary_two_column_gallery?: string;
  model_viewer?: string;
  model_height?: string;
  distance_between_the_ground?: string;
  secondary_desc?: string;
  secondary_documentation_video?: string;
}

const PostArticle = styled.article`
  padding-top: 0 !important;
  min-height: 100vh;
  color: white;
  background: #000;
  padding: 2rem;
  contain: content;
  will-change: transform;
`;

const PostTitle = styled.h1`
  font-size: 2.5rem;
  margin: 2rem auto;
  text-align: center;
  max-width: 1200px;
  color: white;
  transform: translateZ(0);
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: white;
  contain: content;

  p {
    color: white;
    font-size: 1.8rem;
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }

  h1, h2, h3, h4, h5, h6 {
    color: white;
    margin: 2rem 0 1rem;
  }

  img {
    max-width: 100%;
    height: auto;
    margin: 2rem 0;
    aspect-ratio: attr(width) / attr(height);
    contain: size layout;
  }
`;

const ErrorDisplay = styled.div`
  padding: 2rem;
  color: red;
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 0, 0, 0.1);
  border-radius: 8px;
`;

export default function PostPage({ params }: { params: { slug: string[] } }) {
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadPost() {
      try {
        const pathParts = params.slug.filter(part => part !== 'post');
        const slug = pathParts.join('/');
        
        const response = await axios.get(`${WORDPRESS_API_BASE}/wp/v2/posts`, {
          params: {
            slug,
            _embed: true
          }
        });
        
        const data = response.data;

        if (data && data.length > 0 && mounted) {
          setPost(data[0]);
          setError(null);
        } else if (mounted) {
          throw new Error('Post not found');
        }
      } catch (error: any) {
        if (mounted) {
          console.error('Error loading post:', error);
          setError(error.message || 'Failed to load post');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadPost();
    return () => {
      mounted = false;
    };
  }, [params.slug]);

  const memoizedContent = useMemo(() => {
    if (!post) return null;

    return (
      <>
        {post.is_tech === "1" && post.tech_info && (
          <TechInfo data={post.tech_info} />
        )}
        
        {(post.concept || post.main_documentation_video) && (
          <PostVideoText 
            concept={post.concept} 
            video={post.main_documentation_video} 
          />
        )}
        
        {Array.isArray(post.full_width_gallery) && post.full_width_gallery.length > 0 && (
          <FullWidthGallery data={post.full_width_gallery} />
        )}
        
        {post.is_secondary_desc === "1" && (post.secondary_desc || post.secondary_documentation_video) && (
          <PostVideoText 
            isSecondary={true} 
            concept={post.secondary_desc} 
            video={post.secondary_documentation_video} 
          />
        )}
        
        {Array.isArray(post.big_vertical_gallery) && post.big_vertical_gallery.length > 0 && (
          <BigVerticalGallery data={post.big_vertical_gallery} />
        )}

        {Array.isArray(post.two_column_gallery) && post.two_column_gallery.length > 0 && (
          <TwoColumnGallery data={post.two_column_gallery} />
        )}

        {post.is_secondary_two_column_gallery && Array.isArray(post.secondary_two_column_gallery) && (
          <TwoColumnGallery data={post.secondary_two_column_gallery} />
        )}
        
        {post.is_swipe === "1" && Array.isArray(post.swipe_gallery) && post.swipe_gallery.length > 0 && (
          <SwipeGallery data={post.swipe_gallery} />
        )}
        
        {post.is_acknowledgment === "1" && post.acknowledgment && (
          <Acknowledgment data={post.acknowledgment} />
        )}
        
        {post.is_3d_model === "1" && post.model_viewer && (
          <ModelViewer 
            data1={post.model_viewer} 
            data2={post.model_height} 
            data3={post.distance_between_the_ground}
          />
        )}
      </>
    );
  }, [post]);

  if (loading) return <Loading />;
  if (error) return <ErrorDisplay>{error}</ErrorDisplay>;
  if (!post) return <ErrorDisplay>Post not found</ErrorDisplay>;

  return (
    <PostArticle>
      <PostTitle dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
      <ContentWrapper>
        {memoizedContent}
      </ContentWrapper>
    </PostArticle>
  );
} 