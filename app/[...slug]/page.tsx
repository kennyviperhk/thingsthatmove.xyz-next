'use client';

import { useEffect, useState } from 'react';
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
  tech_info?: any;
  full_width_gallery?: any;
  big_vertical_gallery?: any;
  two_column_gallery?: any;
  secondary_two_column_gallery?: any;
  swipe_gallery?: any;
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

export default function PostPage({ params }: { params: { slug: string[] } }) {
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPost() {
      try {
        // Remove 'post' from the beginning of the path if it exists
        const pathParts = params.slug.filter(part => part !== 'post');
        const slug = pathParts.join('/');
        
        console.log('Attempting to load post...');
        console.log('Original path:', params.slug);
        console.log('Processed slug:', slug);
        console.log('Full API URL:', `${WORDPRESS_API_BASE}/wp/v2/posts?slug=${slug}&_embed=true`);
        
        const { data } = await axios.get(`${WORDPRESS_API_BASE}/wp/v2/posts`, {
          params: {
            slug,
            _embed: true
          }
        });

        console.log('API Response:', data);

        if (data && data.length > 0) {
          console.log('Post found:', data[0]);
          console.log('Post fields:', {
            hasContent: !!data[0].content,
            hasConcept: !!data[0].concept,
            hasMainVideo: !!data[0].main_documentation_video,
            hasTechInfo: !!data[0].tech_info,
            hasFullWidthGallery: !!data[0].full_width_gallery,
          });
          setPost(data[0]);
          setError(null);
        } else {
          console.log('No post found with slug:', slug);
          throw new Error('Post not found');
        }
      } catch (error: any) {
        console.error('Error loading post:', error);
        console.error('Error response:', error.response?.data);
        setError(error.message || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [params.slug]);

  useEffect(() => {
    if (post) {
      // Log rendering of components
      if (post.is_tech === "1") {
        console.log('Rendering TechInfo:', post.tech_info);
      }
      console.log('Rendering PostVideoText:', { concept: post.concept, video: post.main_documentation_video });
      console.log('Rendering FullWidthGallery:', post.full_width_gallery);
      if (post.is_secondary_desc === "1") {
        console.log('Rendering secondary PostVideoText:', { concept: post.secondary_desc, video: post.secondary_documentation_video });
      }
      console.log('Rendering BigVerticalGallery:', post.big_vertical_gallery);
      console.log('Rendering TwoColumnGallery:', post.two_column_gallery);
      if (post.is_swipe === "1") {
        console.log('Rendering SwipeGallery:', post.swipe_gallery);
      }
      if (post.is_acknowledgment === "1") {
        console.log('Rendering Acknowledgment:', post.acknowledgment);
      }
      if (post.is_3d_model === "1") {
        console.log('Rendering ModelViewer:', { model: post.model_viewer, height: post.model_height, ground: post.distance_between_the_ground });
      }
    }
  }, [post]);

  if (loading) return <Loading />;
  if (error) return <ErrorDisplay>{error}</ErrorDisplay>;
  if (!post) return <ErrorDisplay>Post not found</ErrorDisplay>;

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
      <TwoColumnGallery data={post.two_column_gallery} />
      
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