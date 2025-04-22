'use client';

import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { getProxiedMediaUrl } from '@/lib/media';
import Loading from '@/components/Loading';

interface GalleryData {
  ID?: string;
  guid?: string | { rendered: string };
  url?: string;
  source_url?: string;
  post_mime_type?: string;
  media_type?: string;
  mime_type?: string;
  post_title?: string;
  title?: { rendered: string };
}

interface BigVerticalGalleryProps {
  data?: GalleryData[] | GalleryData;
}

// Development-only debug logger
const debugLog = (message: string, ...args: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[BigVerticalGallery] ${message}`, ...args);
  }
};

const GallerySection = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem 0;
`;

const Figure = styled.figure`
  margin: 0;
  padding: 0;
  width: 100%;
  position: relative;
  aspect-ratio: 16/9;
  background: #000;
  overflow: hidden;
`;

const GalleryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const GalleryVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const VideoComponent = ({ url }: { url: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setIsLoading(false);
      setHasError(false);
    };

    const handleError = () => {
      console.error('[BigVerticalGallery] Video failed to load:', url);
      setIsLoading(false);
      setHasError(true);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, [url]);

  if (hasError) {
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
              setHasError(false);
              setIsLoading(true);
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
        data-webkit-playsinline="true"
        data-x5-playsinline="true"
        data-x5-video-player-type="h5"
        data-x5-video-player-fullscreen="true"
      >
        <source src={getProxiedMediaUrl(url)} type="video/mp4" />
      </GalleryVideo>
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000'
        }}>
          <Loading />
        </div>
      )}
    </div>
  );
};

const MediaItem = ({ item }: { item: GalleryData }) => {
  const mediaUrl = item.source_url || item.url || (typeof item.guid === 'string' ? item.guid : item.guid?.rendered);
  if (!mediaUrl) {
    debugLog('No media URL found for item:', item);
    return null;
  }

  const isVideo = item.post_mime_type?.startsWith('video/') || 
                 item.media_type === 'video' || 
                 item.mime_type?.startsWith('video/') ||
                 mediaUrl.toLowerCase().match(/\.(mp4|webm|mov|avi)$/i) !== null;

  debugLog(`Rendering media item: ${mediaUrl} (${isVideo ? 'video' : 'image'})`);

  return (
    <Figure>
      {isVideo ? (
        <VideoComponent url={mediaUrl} />
      ) : (
        <GalleryImage 
          src={getProxiedMediaUrl(mediaUrl)}
          alt={item.title?.rendered || item.post_title || ''}
          loading="lazy"
        />
      )}
    </Figure>
  );
};

export default function BigVerticalGallery({ data }: BigVerticalGalleryProps) {
  if (!data) return null;

  const items = Array.isArray(data) ? data : [data];
  if (items.length === 0) return null;

  debugLog(`Initializing gallery with ${items.length} items`);

  return (
    <GallerySection>
      {items.map((item, index) => (
        <MediaItem key={item.ID || index} item={item} />
      ))}
    </GallerySection>
  );
} 