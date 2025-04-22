'use client';

import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import Loading from '@/components/Loading';

interface GalleryData {
  url: string;
  caption?: string;
}

interface MediaLoadingState {
  isLoading: boolean;
  failed: boolean;
}

interface TwoColumnGalleryProps {
  data?: GalleryData[];
}

const GallerySection = styled.section`
  width: 100%;
  max-width: 1400px;
  margin: 2rem auto;
  padding: 0 1rem;

  @media (min-width: 768px) {
    padding: 0 2rem;
  }
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const GalleryImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

const ImageCaption = styled.figcaption`
  text-align: center;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  opacity: 0.8;
`;

const Figure = styled.figure`
  margin: 0;
  padding: 0;
`;

const LoadingContainer = styled.div`
  width: 100%;
  aspect-ratio: 16/9;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function TwoColumnGallery({ data }: TwoColumnGalleryProps) {
  const [mediaStates, setMediaStates] = useState<Record<string, MediaLoadingState>>({});

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
    if (!data) return;

    // Initialize loading states
    const initialStates: Record<string, MediaLoadingState> = {};
    data.forEach(item => {
      initialStates[item.url] = { isLoading: true, failed: false };
    });
    setMediaStates(initialStates);

    // Load each media item
    data.forEach(item => {
      loadMediaItem(item.url);
    });
  }, [data, loadMediaItem]);

  if (!data || data.length === 0) return null;

  return (
    <GallerySection>
      <GalleryGrid>
        {data.map((item, index) => {
          const state = mediaStates[item.url] || { isLoading: true, failed: false };

          if (state.isLoading) {
            return (
              <Figure key={index}>
                <LoadingContainer>
                  <Loading />
                </LoadingContainer>
              </Figure>
            );
          }

          if (state.failed) {
            return (
              <Figure key={index}>
                <LoadingContainer>
                  <div style={{ color: 'white', textAlign: 'center' }}>
                    Failed to load media
                    <br />
                    <button onClick={() => loadMediaItem(item.url)}>Retry</button>
                  </div>
                </LoadingContainer>
              </Figure>
            );
          }

          return (
            <Figure key={index}>
              <GalleryImage src={item.url} alt={item.caption || ''} />
              {item.caption && <ImageCaption>{item.caption}</ImageCaption>}
            </Figure>
          );
        })}
      </GalleryGrid>
    </GallerySection>
  );
} 