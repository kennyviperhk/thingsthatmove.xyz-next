'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { getProxiedMediaUrl } from '@/lib/media';
import { Swiper as SwiperType } from 'swiper';

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
  height: 40vh;
  overflow: visible;
`;

const MediaContainer = styled.div`
  width: 100%;
  position: relative;
  height: 40vh;
  background: transparent;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const GalleryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  background: transparent;
`;

const GalleryVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  background: transparent;
`;

const SwiperContainer = styled.div`
  width: 100%;
  background: transparent;
  position: relative;
  height: 100%;

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
    background: transparent;
  }

  .swiper-button-prev,
  .swiper-button-next {
    color: white;
  }
`;

const PaginationContainer = styled.div`
  width: 100%;
  background: transparent;
  padding: 1rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  mix-blend-mode: difference;

  .swiper-custom-pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  .swiper-pagination-bullet {
    background: transparent;
    opacity: 1;
    margin: 0 5px;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 10px solid #808080;
    border-radius: 0;
    mix-blend-mode: difference;
  }

  .swiper-pagination-bullet-active {
    opacity: 1;
    border-bottom-color: white;
  }

  .swiper-button-prev,
  .swiper-button-next {
    mix-blend-mode: difference;
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

  const paginationRef = useRef<HTMLDivElement>(null);

  return (
    <GallerySection>
      <SwiperContainer>
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{
            clickable: true,
            el: '.swiper-custom-pagination',
          }}
          loop={true}
          slidesPerView={2.5}
          spaceBetween={20}
        >
          {items.map((item, index) => (
            <SwiperSlide key={item.ID || index}>
              <MediaItem item={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </SwiperContainer>
      <PaginationContainer>
        <div className="swiper-custom-pagination" ref={paginationRef} />
      </PaginationContainer>
    </GallerySection>
  );
} 