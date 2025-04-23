'use client';

import { useEffect, useState, useCallback } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import axios from 'axios';
import Link from 'next/link';
import Loading from '@/components/Loading';

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
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
      slug: string;
    }>>;
  };
}

interface MediaLoadingState {
  isLoading: boolean;
  failed: boolean;
}

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;

const ProjectsContainer = styled.div`
  padding: 2rem;
  min-height: 100vh;
  background: black;
  color: white;
`;

const CategoryButton = styled.button<{ $isActive: boolean }>`
  padding: 0.75rem 1.5rem;
  background: ${props => props.$isActive ? 'white' : 'transparent'};
  color: ${props => props.$isActive ? 'black' : 'white'};
  border: 1px solid white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  
  &:hover {
    background: ${props => props.$isActive ? 'white' : 'rgba(255, 255, 255, 0.1)'};
  }
`;

const CategoryFilters = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    display: grid;
    grid-template-rows: auto auto;
    gap: 1rem;
    width: 100%;
  }
`;

const CategoryButtonsContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    grid-row: 2;
    width: 100%;
  }
`;

const AllProjectsButton = styled(CategoryButton)`
  @media (max-width: 768px) {
    grid-row: 1;
    width: fit-content;
    margin: 0 auto;
  }
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
  position: relative;
`;

const fadeInScale = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.7);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
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
  animation: ${fadeInScale} 0.7s cubic-bezier(0.215, 0.61, 0.355, 1) forwards;
  animation-delay: var(--random-delay);
  opacity: 0;
  
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

const LoadingContainer = styled.div`
  width: 100%;
  height: 200px;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
`;

const ProgressBar = styled.div<{ width: number }>`
  width: ${props => props.width}%;
  height: 100%;
  background: white;
  transition: width 0.3s ease;
`;

const InitialLoadingContainer = styled.div`
  width: 100%;
  height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
`;

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mediaStates, setMediaStates] = useState<Record<string, MediaLoadingState>>({});
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = [
    { id: 'interactive-digital', label: 'Interactive & Digital' },
    { id: 'kinetics-robotics', label: 'Kinetics & Robotics' },
    { id: 'tech-research', label: 'Art, Tech & Research' }
  ];

  const filterProjects = useCallback((category: string | null) => {
    if (!category) {
      setFilteredProjects(projects);
      return;
    }

    const filtered = projects.filter(project => {
      const projectCategories = project._embedded?.['wp:term']?.[0] || [];
      return projectCategories.some((cat: any) => cat.slug === category);
    });
    setFilteredProjects(filtered);
  }, [projects]);

  useEffect(() => {
    filterProjects(activeCategory);
  }, [activeCategory, filterProjects]);

  const loadMediaItem = useCallback(async (url: string): Promise<boolean> => {
    try {
      setMediaStates(prev => ({
        ...prev,
        [url]: { isLoading: true, failed: false }
      }));

      await new Promise<void>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error('Loading timeout'));
        }, 30000);

        const img = new Image();
        img.onload = () => {
          clearTimeout(timeoutId);
          resolve();
        };
        img.onerror = () => {
          clearTimeout(timeoutId);
          reject();
        };
        img.src = url;
      });

      setMediaStates(prev => ({
        ...prev,
        [url]: { isLoading: false, failed: false }
      }));
      return true;
    } catch (error) {
      setMediaStates(prev => ({
        ...prev,
        [url]: { isLoading: false, failed: true }
      }));
      return false;
    }
  }, []);

  useEffect(() => {
    async function loadProjects() {
      try {
        setLoadingProgress(10);
        const categoriesResponse = await axios.get(`${WORDPRESS_API_BASE}/wp/v2/categories`, {
          params: {
            slug: 'projects'
          }
        });
        
        setLoadingProgress(30);
        
        if (!categoriesResponse.data || categoriesResponse.data.length === 0) {
          throw new Error('Projects category not found');
        }

        const projectsCategoryId = categoriesResponse.data[0].id;
        
        setLoadingProgress(50);
        const { data } = await axios.get<Project[]>(`${WORDPRESS_API_BASE}/wp/v2/posts`, {
          params: {
            categories: projectsCategoryId,
            _embed: true,
            per_page: 50
          }
        });
        
        setLoadingProgress(70);
        setProjects(data);
        setFilteredProjects(data);

        // Initialize media loading states
        const mediaUrls = data
          .map((project: Project) => project._embedded?.['wp:featuredmedia']?.[0]?.source_url)
          .filter((url: string | undefined): url is string => !!url);

        const initialStates: Record<string, MediaLoadingState> = {};
        mediaUrls.forEach((url: string) => {
          initialStates[url] = { isLoading: true, failed: false };
        });
        setMediaStates(initialStates);

        // Start loading media
        let loadedCount = 0;
        const totalMedia = mediaUrls.length;
        
        for (const url of mediaUrls) {
          await loadMediaItem(url);
          loadedCount++;
          setLoadingProgress(70 + (loadedCount / totalMedia) * 30);
        }

        setError(null);
      } catch (error: any) {
        console.error('Error loading projects:', error);
        setError(error.response?.data?.message || 'Failed to load projects. Please try again later.');
      } finally {
        setLoading(false);
        setTimeout(() => setLoadingProgress(100), 500);
      }
    }

    loadProjects();
  }, [loadMediaItem]);

  return (
    <>
      <GlobalStyle />
      <ProgressBarContainer>
        <ProgressBar width={loadingProgress} />
      </ProgressBarContainer>
      <ProjectsContainer>
        <h1>Projects</h1>
        <CategoryFilters>
          <AllProjectsButton
            $isActive={!activeCategory}
            onClick={() => {
              setActiveCategory(null);
              filterProjects(null);
            }}
          >
            All Projects
          </AllProjectsButton>
          <CategoryButtonsContainer>
            {categories.map(category => (
              <CategoryButton
                key={category.id}
                $isActive={activeCategory === category.id}
                onClick={() => {
                  setActiveCategory(category.id);
                  filterProjects(category.id);
                }}
              >
                {category.label}
              </CategoryButton>
            ))}
          </CategoryButtonsContainer>
        </CategoryFilters>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {loading && projects.length === 0 ? (
          <InitialLoadingContainer>
            <Loading />
          </InitialLoadingContainer>
        ) : (
          <ProjectsGrid>
            {filteredProjects.map((project, index) => {
              const imageUrl = project._embedded?.['wp:featuredmedia']?.[0]?.source_url;
              const mediaState = imageUrl ? mediaStates[imageUrl] : null;
              const randomDelay = Math.random() * 0.5; // Random delay between 0 and 0.3 seconds

              return (
                <ProjectCard 
                  key={`${activeCategory || 'all'}-${project.id}`} 
                  href={`/post/${project.slug}`}
                  style={{ '--random-delay': `${randomDelay}s` } as React.CSSProperties}
                >
                  {imageUrl ? (
                    mediaState?.isLoading ? (
                      <LoadingContainer>
                        <Loading />
                      </LoadingContainer>
                    ) : mediaState?.failed ? (
                      <LoadingContainer>
                        <div style={{ color: 'white', textAlign: 'center' }}>
                          Failed to load image
                          <br />
                          <button onClick={(e) => {
                            e.preventDefault();
                            loadMediaItem(imageUrl);
                          }}>Retry</button>
                        </div>
                      </LoadingContainer>
                    ) : (
                      <ProjectImage 
                        src={imageUrl}
                      />
                    )
                  ) : null}
                  <ProjectContent>
                    <ProjectTitle 
                      dangerouslySetInnerHTML={{ __html: project.title.rendered }} 
                    />

                  </ProjectContent>
                </ProjectCard>
              );
            })}
          </ProjectsGrid>
        )}
      </ProjectsContainer>
    </>
  );
} 