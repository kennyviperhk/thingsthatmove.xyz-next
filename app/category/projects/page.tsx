'use client';

import { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import axios from 'axios';
import Link from 'next/link';

const WORDPRESS_API_BASE = 'https://blog.thingsthatmove.xyz/wp-json';

interface Project {
  id: number;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  slug: string;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
    }>;
  };
}

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;

const ProjectsContainer = styled.div`
  padding: 120px 2rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
  position: relative;
  z-index: 1;
  
  h1 {
    font-size: clamp(2rem, 4vw, 3rem);
    margin-bottom: 2rem;
  }
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const ProjectCard = styled(Link)`
  text-decoration: none;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  backdrop-filter: blur(10px);
  display: block;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const ProjectImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ProjectContent = styled.div`
  padding: 1.5rem;
  color: inherit;
`;

const ProjectTitle = styled.h2`
  margin: 0 0 1rem;
  font-size: 1.25rem;
  color: inherit;
`;

const ProjectExcerpt = styled.div`
  color: inherit;
  font-size: 0.9rem;
  line-height: 1.5;
  
  p {
    margin: 0;
  }
`;

const ErrorMessage = styled.p`
  color: #ff4444;
  font-size: 1.125rem;
  margin: 2rem 0;
`;

const LoadingMessage = styled.p`
  font-size: 1.125rem;
  margin: 2rem 0;
`;

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        console.log('Fetching categories from:', `${WORDPRESS_API_BASE}/wp/v2/categories`);
        
        const categoriesResponse = await axios.get(`${WORDPRESS_API_BASE}/wp/v2/categories`, {
          params: {
            slug: 'projects'
          }
        });
        
        console.log('Categories response:', categoriesResponse.data);
        
        if (!categoriesResponse.data || categoriesResponse.data.length === 0) {
          throw new Error('Projects category not found');
        }

        const projectsCategoryId = categoriesResponse.data[0].id;
        console.log('Projects category ID:', projectsCategoryId);

        console.log('Fetching posts from:', `${WORDPRESS_API_BASE}/wp/v2/posts`);
        const { data } = await axios.get(`${WORDPRESS_API_BASE}/wp/v2/posts`, {
          params: {
            categories: projectsCategoryId,
            _embed: true,
            per_page: 50
          }
        });
        
        console.log('Posts response:', data);
        setProjects(data);
        setError(null);
      } catch (error: any) {
        console.error('Error loading projects:', error);
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          config: error.config
        });
        setError(error.response?.data?.message || 'Failed to load projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  return (
    <>
      <GlobalStyle />
      <ProjectsContainer>
        <h1>Projects</h1>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {loading ? (
          <LoadingMessage>Loading projects...</LoadingMessage>
        ) : (
          <ProjectsGrid>
            {projects.map((project) => (
              <ProjectCard key={project.id} href={`/post/${project.slug}`}>
                {project._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
                  <ProjectImage 
                    src={project._embedded['wp:featuredmedia'][0].source_url}
                    alt={project.title.rendered}
                  />
                )}
                <ProjectContent>
                  <ProjectTitle 
                    dangerouslySetInnerHTML={{ __html: project.title.rendered }} 
                  />
                  <ProjectExcerpt
                    dangerouslySetInnerHTML={{ __html: project.excerpt.rendered }}
                  />
                </ProjectContent>
              </ProjectCard>
            ))}
          </ProjectsGrid>
        )}
      </ProjectsContainer>
    </>
  );
} 