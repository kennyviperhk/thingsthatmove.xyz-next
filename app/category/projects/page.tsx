'use client';

import { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import axios from 'axios';

interface Project {
  id: number;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
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
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const ProjectCard = styled.article`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  
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
  padding: 1rem;
`;

const ProjectTitle = styled.h2`
  margin: 0 0 1rem;
  font-size: 1.25rem;
  color: #333;
`;

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        const categoriesResponse = await axios.get(`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp/v2/categories`, {
          params: {
            slug: 'projects'
          }
        });
        
        if (!categoriesResponse.data || categoriesResponse.data.length === 0) {
          throw new Error('Projects category not found');
        }

        const projectsCategoryId = categoriesResponse.data[0].id;

        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp/v2/posts`, {
          params: {
            categories: projectsCategoryId,
            _embed: true,
            per_page: 50
          }
        });
        setProjects(data);
        setError(null);
      } catch (error) {
        console.error('Error loading projects:', error);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  if (error) {
    return (
      <ProjectsContainer>
        <h1>Projects</h1>
        <p style={{ color: 'red' }}>{error}</p>
      </ProjectsContainer>
    );
  }

  return (
    <>
      <GlobalStyle />
      <ProjectsContainer>
        <h1>Projects</h1>
        {loading ? (
          <p>Loading projects...</p>
        ) : (
          <ProjectsGrid>
            {projects.map((project) => (
              <ProjectCard key={project.id}>
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
                  <div 
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