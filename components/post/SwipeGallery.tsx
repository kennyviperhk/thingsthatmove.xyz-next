'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { getProxiedMediaUrl } from '@/lib/media';

// Debug logger that only runs in development
const debugLog = (message: string, ...args: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[SwipeGallery] ${message}`, ...args);
  }
};

interface GalleryData {
  ID?: string;
  guid?: string | { rendered: string };
  url?: string;
  source_url?: string;
  post_mime_type?: string;
  media_type?: string;
  mime_type?: string;
  post_title?: string;
}

interface SwipeGalleryProps {
  data?: GalleryData[] | GalleryData;
}

const GallerySection = styled.section`
  width: 100vw;
  margin: 0;
  padding: 0;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
`;

const MediaContainer = styled.div`
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
  display: block;
  background: #000;
`;

const GalleryVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  background: #000;
`;

const SwiperContainer = styled.div`
  width: 100%;
  background: #000;
  position: relative;

  .swiper {
    width: 100%;
    height: 100%;
  }

  .swiper-slide {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .swiper-button-prev,
  .swiper-button-next {
    color: white;
  }

  .swiper-pagination-bullet {
    background: white;
  }

  .swiper-pagination-bullet-active {
    background: white;
  }
`;

const VideoComponent = ({ url }: { url: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      debugLog(`Video ready to play: ${url}`);
      setIsLoading(false);
      setHasError(false);
    };

    const handleError = () => {
      const error = video.error;
      console.error('[SwipeGallery] Video error:', {
        url,
        error,
        networkState: video.networkState,
        readyState: video.readyState
      });
      setIsLoading(false);
      setHasError(true);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    debugLog(`Initializing video: ${url}`);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, [url]);

  return (
    <GalleryVideo
      ref={videoRef}
      playsInline
      autoPlay
      muted
      loop
      data-webkit-playsinline="true"
      data-x5-playsinline="true"
      data-x5-video-player-type="h5"
      data-x5-video-player-fullscreen="true"
    >
      <source src={getProxiedMediaUrl(url)} type="video/mp4" />
    </GalleryVideo>
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
    <MediaContainer>
      {isVideo ? (
        <VideoComponent url={mediaUrl} />
      ) : (
        <GalleryImage 
          src={getProxiedMediaUrl(mediaUrl)}
          alt={typeof item.post_title === 'string' ? item.post_title : ''}
          loading="lazy"
        />
      )}
    </MediaContainer>
  );
};

export default function SwipeGallery({ data }: SwipeGalleryProps) {
  if (!data) return null;

  const items = Array.isArray(data) ? data : [data];
  if (items.length === 0) return null;

  debugLog(`Initializing gallery with ${items.length} items`);

  return (
    <GallerySection>
      <SwiperContainer>
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          loop={true}
          slidesPerView={1}
        >
          {items.map((item, index) => (
            <SwiperSlide key={item.ID || index}>
              <MediaItem item={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </SwiperContainer>
    </GallerySection>
  );
} 