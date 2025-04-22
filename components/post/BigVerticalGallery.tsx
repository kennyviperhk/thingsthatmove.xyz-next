'use client';

import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import Loading from '@/components/Loading';

interface GalleryData {
  ID?: string;
  guid?: string;
  url?: string;
  source_url?: string;
  post_mime_type?: string;
  media_type?: string;
  mime_type?: string;
  post_title?: string;
}

interface BigVerticalGalleryProps {
  data?: GalleryData[] | GalleryData;
}

interface MediaLoadingState {
  isLoading: boolean;
  failed: boolean;
}

const GallerySection = styled.section`
  width: 100%;
  max-width: 1200px;
  margin: 4rem auto;
  padding: 0 1rem;

  @media (min-width: 768px) {
    padding: 0 2rem;
  }
`;

const GalleryImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
  margin-bottom: 1rem;
`;

const GalleryVideo = styled.video`
  width: 100%;
  height: auto;
  display: block;
  margin-bottom: 1rem;
  background: #000;
  cursor: pointer;
`;

const Figure = styled.figure`
  margin: 0;
  padding: 0;
  margin-bottom: 4rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const LoadingContainer = styled.div`
  width: 100%;
  aspect-ratio: 16/9;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
`;

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

const isVideoUrl = (url: string) => {
  return /\.(mp4|webm|mov)$/i.test(url);
};

export default function BigVerticalGallery({ data }: BigVerticalGalleryProps) {
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

        if (isVideoUrl(url)) {
          const video = document.createElement('video');
          video.onloadeddata = () => {
            clearTimeout(timeoutId);
            resolve();
          };
          video.onerror = (error) => {
            clearTimeout(timeoutId);
            reject(error);
          };
          video.src = url;
        } else {
          const img = new Image();
          img.onload = () => {
            clearTimeout(timeoutId);
            resolve();
          };
          img.onerror = (error) => {
            clearTimeout(timeoutId);
            reject(error);
          };
          img.src = url;
        }
      });
      
      setMediaStates(prev => ({
        ...prev,
        [url]: { isLoading: false, failed: false }
      }));
      return true;
    } catch (error) {
      console.error(`Error loading media ${url}:`, error);
      setMediaStates(prev => ({
        ...prev,
        [url]: { isLoading: false, failed: true }
      }));
      return false;
    }
  }, []);

  useEffect(() => {
    if (!data) return;

    const items = Array.isArray(data) ? data : [data];
    const urls = items
      .map(item => item.guid || item.url || item.source_url)
      .filter((url): url is string => url !== undefined);

    // Initialize loading states
    const initialStates: Record<string, MediaLoadingState> = {};
    urls.forEach(url => {
      initialStates[url] = { isLoading: true, failed: false };
    });
    setMediaStates(initialStates);

    // Load each media item
    urls.forEach(url => {
      loadMediaItem(url);
    });
  }, [data, loadMediaItem]);

  if (!data) return null;

  const items = Array.isArray(data) ? data : [data];

  return (
    <GallerySection>
      {items.map((item: GalleryData, index: number) => {
        const url = item.url || item.guid || item.source_url || '';
        const state = mediaStates[url] || { isLoading: true, failed: false };

        if (state.failed) {
          return (
            <Figure key={index}>
              <div style={{ 
                padding: '2rem', 
                textAlign: 'center', 
                background: 'rgba(255,0,0,0.1)',
                color: 'white' 
              }}>
                Failed to load media. <button onClick={() => loadMediaItem(url)}>Retry</button>
              </div>
            </Figure>
          );
        }

        if (state.isLoading) {
          return (
            <Figure key={index}>
              <LoadingContainer>
                <Loading />
              </LoadingContainer>
            </Figure>
          );
        }

        return (
          <Figure key={index}>
            {isVideoUrl(url) ? (
              <GalleryVideo 
                src={url} 
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                onClick={(e) => {
                  if (e.currentTarget.paused) {
                    e.currentTarget.play();
                  } else {
                    e.currentTarget.pause();
                  }
                }}
              />
            ) : (
              <GalleryImage src={url} />
            )}
          </Figure>
        );
      })}
    </GallerySection>
  );
} 