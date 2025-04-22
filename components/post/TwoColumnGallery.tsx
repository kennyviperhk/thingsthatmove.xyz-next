'use client';

import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { getProxiedMediaUrl } from '@/lib/media';
import Loading from '@/components/Loading';

interface GalleryData {
  guid?: string;
  url: string;
  post_title?: string;
  caption?: string;
  guid_rendered?: string;
  post_mime_type?: string;
  mime_type?: string;
}

interface TwoColumnGalleryProps {
  data?: GalleryData[] | GalleryData[][];
}

const GallerySection = styled.section`
  background: transparent;
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem 0;
`;

const GalleryDiv = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row;
  align-items: center;
  padding: 0;
  gap: 2px;

  @media (orientation: portrait) {
    padding: 0;
  }
`;

interface StyledDivProps {
  $isLoading: boolean;
}

const ImgDiv = styled.div<StyledDivProps>`
  width: 50%;
  line-height: 0;
  position: relative;
  background-color: ${props => props.$isLoading ? '#f0f0f0' : 'transparent'};
  transition: background-color 0.3s ease;

  &::before {
    content: '';
    display: block;
    padding-top: 100%;
  }
`;

const Img = styled.img<StyledDivProps>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${props => props.$isLoading ? 0 : 1};
  transition: opacity 0.3s ease;
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  text-align: center;
  padding: 1rem;
  background-color: #fff5f5;
  border: 1px solid #ffc9c9;
  margin: 1rem 0;
  border-radius: 4px;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
`;

const VideoWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000;
`;

const GalleryVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const VideoComponent = ({ url }: { url: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isError, setIsError] = useState(false);
  const [loadingState, setLoadingState] = useState<'initial' | 'loading' | 'playing' | 'error'>('initial');

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      console.log('[TwoColumnGallery] Video can play:', url);
      setLoadingState('playing');
    };

    const handleError = (e: Event) => {
      const videoEl = e.target as HTMLVideoElement;
      console.error('[TwoColumnGallery] Video error:', {
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
    <VideoWrapper>
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
    </VideoWrapper>
  );
};

interface GalleryMediaProps {
  item: GalleryData;
  index: number;
}

const GalleryMedia = ({ item, index }: GalleryMediaProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const imageUrl = item.guid_rendered || item.guid || item.url;

  if (!imageUrl) return null;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  const isVideo = imageUrl.match(/\.(mp4|webm|mov)$/i) || 
                 item.mime_type?.startsWith('video/') ||
                 item.post_mime_type?.startsWith('video/');

  console.log('[TwoColumnGallery] Media type determined:', { isVideo, imageUrl });

  return (
    <ImgDiv $isLoading={isLoading}>
      {isVideo ? (
        <VideoComponent url={imageUrl} />
      ) : (
        <Img 
          src={getProxiedMediaUrl(imageUrl)} 
          alt={item.caption || item.post_title || ''}
          crossOrigin="anonymous"
          $isLoading={isLoading}
          onLoad={() => setIsLoading(false)}
          onError={() => setError('Failed to load image')}
        />
      )}
      {isLoading && !isVideo && (
        <LoadingOverlay>
          <Loading />
        </LoadingOverlay>
      )}
    </ImgDiv>
  );
};

export default function TwoColumnGallery({ data }: TwoColumnGalleryProps) {
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return null;
  }

  // Handle both single gallery and multiple galleries
  const galleries = Array.isArray(data[0]) ? data as GalleryData[][] : [data] as GalleryData[][];

  return (
    <GallerySection>
      {galleries.map((gallery: GalleryData[], galleryIndex: number) => {
        // Skip empty galleries
        if (!gallery || gallery.length === 0) return null;

        return (
          <GalleryDiv key={galleryIndex}>
            {gallery.map((item: GalleryData, index: number) => (
              <GalleryMedia key={`${galleryIndex}-${index}`} item={item} index={index} />
            ))}
          </GalleryDiv>
        );
      })}
    </GallerySection>
  );
} 