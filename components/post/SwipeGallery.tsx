'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import Loading from '@/components/Loading';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { getProxiedMediaUrl } from '@/lib/media';

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

interface SwipeGalleryProps {
  data?: GalleryData[];
}

const GallerySection = styled.section`
  width: 100%;
  max-width: 100%;
  margin: 4rem auto;
  padding: 0 1rem;
  position: relative;

  @media (min-width: 768px) {
    padding: 0 2rem;
  }

  .swiper {
    width: 100%;
    height: 100%;
    overflow: visible;
    padding-bottom: 3rem; /* Add padding for pagination */
    .swiper-wrapper {
      pointer-events: auto;
    }
  }

  .swiper-slide {
    text-align: center;
    background: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60vh;
    width: 40%;

    @media (max-width: 768px) {
      width: 80%;
    }
  }

  .swiper-button-next,
  .swiper-button-prev {
    display: none;
  }

  .swiper-pagination {
    bottom: 0 !important;
    mix-blend-mode: difference;
  }

  .swiper-pagination-bullet {
    background: transparent;
    margin: 0 6px;
    width: 12px;
    height: 12px;
    position: relative;
    opacity: 1;
    mix-blend-mode: difference;

    &:before {
      content: '';
      position: absolute;
      width: 0;
      height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-bottom: 10px solid rgba(255, 255, 255, 0.5);
      left: 0;
      top: 0;
      transition: border-bottom-color 0.3s ease;
    }
  }

  .swiper-pagination-bullet-active {
    background: transparent;
    
    &:before {
      border-bottom-color: white;
    }
  }
`;

const MediaContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background: transparent;
`;

const GalleryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: #000;
  
  @media (max-width: 768px) {
    height: auto;
    aspect-ratio: 16/9;
  }
`;

const GalleryVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  
  @media (max-width: 768px) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

// Add debug logging function
const debugLog = (message: string, ...args: any[]) => {
  console.log(`[SwipeGallery] ${message}`, ...args);
};

const VideoComponent = ({ url }: { url: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isError, setIsError] = useState(false);
  const [loadingState, setLoadingState] = useState<'initial' | 'loading' | 'playing' | 'error'>('initial');

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      console.log('[SwipeGallery] Video can play:', url);
      setLoadingState('playing');
    };

    const handleError = (e: Event) => {
      const videoEl = e.target as HTMLVideoElement;
      console.error('[SwipeGallery] Video error:', {
        url,
        error: videoEl.error,
        networkState: videoEl.networkState,
        readyState: videoEl.readyState,
        currentSrc: videoEl.currentSrc
      });
      setIsError(true);
      setLoadingState('error');
    };

    const handleLoadStart = () => {
      console.log('[SwipeGallery] Video load started:', url);
    };

    const handleLoadedMetadata = () => {
      console.log('[SwipeGallery] Video metadata loaded:', url);
    };

    const handleLoadedData = () => {
      console.log('[SwipeGallery] Video data loaded:', url);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('loadeddata', handleLoadedData);

    // Force load the video
    video.load();
    setLoadingState('loading');

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('loadeddata', handleLoadedData);
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
        preload="auto"
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

export default function SwipeGallery({ data }: SwipeGalleryProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadedItems, setLoadedItems] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    if (!data || data.length === 0) {
      setIsLoading(false);
      return;
    }

    const totalItems = data.length;
    setLoadedItems(new Set());

    // Mark items without URLs as loaded immediately
    data.forEach(item => {
      const url = item.guid || item.url || item.source_url;
      if (!url) {
        setLoadedItems(prev => {
          const newSet = new Set(prev);
          newSet.add('no-url');
          return newSet;
        });
      }
    });

    // Update progress whenever loadedItems changes
    const updateProgress = () => {
      const loadedCount = loadedItems.size;
      const progress = (loadedCount / totalItems) * 100;
      setLoadingProgress(progress);
      
      if (loadedCount >= totalItems) {
        console.log('[SwipeGallery] All items loaded');
        setIsLoading(false);
      }
    };

    // Initial progress update
    updateProgress();

  }, [data, loadedItems]);

  const handleMediaLoaded = (url: string) => {
    setLoadedItems(prev => {
      const newSet = new Set(prev);
      newSet.add(url);
      return newSet;
    });
  };

  if (!data || data.length === 0) {
    console.log('[SwipeGallery] No gallery data provided');
    return null;
  }

  if (isLoading) {
    return <Loading progress={loadingProgress} />;
  }

  const renderMedia = (item: GalleryData) => {
    const url = item.guid || item.url || item.source_url;
    if (!url) {
      console.log('[SwipeGallery] No media URL found');
      return null;
    }

    const isVideo = url.match(/\.(mp4|webm|mov)$/i) || 
                   item.mime_type?.startsWith('video/') ||
                   item.post_mime_type?.startsWith('video/');

    console.log('[SwipeGallery] Media type determined:', { isVideo, url });

    return (
      <MediaContainer>
        {isVideo ? (
          <VideoComponent url={url} />
        ) : (
          <GalleryImage 
            src={getProxiedMediaUrl(url)} 
            alt={item.post_title || ''} 
            onLoad={() => handleMediaLoaded(url)}
            onError={() => handleMediaLoaded(url)} // Count errors as loaded to prevent infinite loading
          />
        )}
      </MediaContainer>
    );
  };

  return (
    <GallerySection>
      <Swiper
        modules={[Navigation, Pagination]}
        pagination={{ clickable: true }}
        loop={true}
        slidesPerView="auto"
        spaceBetween={20}
        centeredSlides={true}
        initialSlide={1}
        breakpoints={{
          320: {
            slidesPerView: "auto",
            spaceBetween: 10
          },
          768: {
            slidesPerView: "auto",
            spaceBetween: 20
          }
        }}
      >
        {data.map((item, index) => (
          <SwiperSlide key={index}>
            {renderMedia(item)}
          </SwiperSlide>
        ))}
      </Swiper>
    </GallerySection>
  );
} 