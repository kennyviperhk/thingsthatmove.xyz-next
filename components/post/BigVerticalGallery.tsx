'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import Loading from '@/components/Loading';
import { getProxiedMediaUrl, getMediaType } from '@/lib/media';

interface GalleryData {
  ID?: string;
  guid?: string;
  url?: string;
  source_url?: string;
  post_mime_type?: string;
  media_type?: string;
  mime_type?: string;
  post_title?: string;
  title?: {
    rendered: string;
  };
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
  display: block;
  width: 100%;
  overflow: hidden;
  object-fit: cover;
  background: #000;
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
const RETRY_DELAY = 1000; // 1 second

const isVideoUrl = (url: string) => {
  return /\.(mp4|webm|mov)$/i.test(url);
};

// Add debug logging function
const debugLog = (message: string, ...args: any[]) => {
  console.log(`[BigVerticalGallery] ${message}`, ...args);
};

const VideoComponent = ({ url }: { url: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isError, setIsError] = useState(false);
  const [loadingState, setLoadingState] = useState<'initial' | 'loading' | 'playing' | 'error'>('initial');

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      console.log('[BigVerticalGallery] Video can play:', url);
      setLoadingState('playing');
    };

    const handleError = (e: Event) => {
      const videoEl = e.target as HTMLVideoElement;
      console.error('[BigVerticalGallery] Video error:', {
        url,
        error: videoEl.error,
        networkState: videoEl.networkState,
        readyState: videoEl.readyState,
        currentSrc: videoEl.currentSrc
      });
      setIsError(true);
      setLoadingState('error');
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    // Force load the video
    video.load();
    setLoadingState('loading');

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, [url]);

  if (isError) {
    return (
      <div style={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#000',
        color: '#fff',
        padding: '20px',
        textAlign: 'center'
      }}>
        <div>
          Error loading video
          <button 
            onClick={() => {
              setIsError(false);
              setLoadingState('initial');
              const video = videoRef.current;
              if (video) {
                video.load();
              }
            }}
            style={{
              marginLeft: '10px',
              padding: '5px 10px',
              background: '#fff',
              color: '#000',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <GalleryVideo
        ref={videoRef}
        playsInline={true}
        autoPlay={true}
        muted={true}
        loop={true}
        controls={false}
        webkit-playsinline="true"
        x5-playsinline="true"
        x5-video-player-type="h5"
        x5-video-player-fullscreen="true"
      >
        <source 
          src={`${getProxiedMediaUrl(url)}#t=0.1`} 
          type="video/mp4"
        />
      </GalleryVideo>
      {loadingState === 'loading' && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white'
        }}>
          Loading...
        </div>
      )}
    </div>
  );
};

export default function BigVerticalGallery({ data }: BigVerticalGalleryProps) {
  const [mediaStates, setMediaStates] = useState<Record<string, MediaLoadingState>>({});

  const loadMediaItem = useCallback(async (url: string): Promise<boolean> => {
    const proxiedUrl = getProxiedMediaUrl(url);
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
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
            video.crossOrigin = "anonymous";
            video.onloadeddata = () => {
              clearTimeout(timeoutId);
              resolve();
            };
            video.onerror = (error) => {
              clearTimeout(timeoutId);
              reject(error);
            };
            video.src = proxiedUrl;
          } else {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
              clearTimeout(timeoutId);
              resolve();
            };
            img.onerror = (error) => {
              clearTimeout(timeoutId);
              reject(error);
            };
            img.src = proxiedUrl;
          }
        });
        
        setMediaStates(prev => ({
          ...prev,
          [url]: { isLoading: false, failed: false }
        }));
        return true;
      } catch (error) {
        console.error(`Error loading media ${url} (attempt ${attempt + 1}/${MAX_RETRIES}):`, error);
        
        if (attempt < MAX_RETRIES - 1) {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          continue;
        }
        
        setMediaStates(prev => ({
          ...prev,
          [url]: { isLoading: false, failed: true }
        }));
        return false;
      }
    }
    return false;
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

  const renderMedia = (item: GalleryData) => {
    const url = item.guid || item.url || item.source_url;
    if (!url) {
      console.log('[BigVerticalGallery] No media URL found');
      return null;
    }

    const isVideo = url.match(/\.(mp4|webm|mov)$/i) || 
                   item.mime_type?.startsWith('video/') ||
                   item.post_mime_type?.startsWith('video/');

    console.log('[BigVerticalGallery] Media type determined:', { isVideo, url });

    return isVideo ? (
      <VideoComponent url={url} />
    ) : (
      <GalleryImage 
        src={getProxiedMediaUrl(url)}
        alt={item.title?.rendered || item.post_title || ''}
      />
    );
  };

  return (
    <GallerySection>
      {items.map((item: GalleryData, index: number) => (
        <Figure key={index}>
          {renderMedia(item)}
        </Figure>
      ))}
    </GallerySection>
  );
} 