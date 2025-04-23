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
import Marquee from "react-fast-marquee";
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
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  height: 40vh;
  overflow: visible;
  margin-bottom:50px;
`;

const ContentWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: block;
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
  z-index: 1;
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
  z-index: 1;
`;

const SwiperContainer = styled.div`
  width: 100%;
  background: transparent;
  position: relative;
  height: 100%;
  display: block;
  z-index: 1;

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
    z-index: 2;
  }
`;

const PaginationContainer = styled.div`
  width: 100%;
  background: transparent;
  padding: 1rem 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  mix-blend-mode: difference;
  margin-top:10px;
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

const BgH1 = styled.h1`
  font-size: 7.5vw;
  text-align: center;
  letter-spacing: 0.3vw;
  padding: 0 50px;
  color: white;
  mix-blend-mode: difference;
  margin: 0;
  white-space: nowrap;
  font-weight: bold;
`;

const MarqueeContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  z-index: 3;
  mix-blend-mode: difference;
  pointer-events: none;

  & > div {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
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
    <>

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
    </>
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
  const messages = ["Craftmanship", "Making-of", "Thought Process"];
  return (
    <GallerySection>       
       <MarqueeContainer>
    <Marquee speed={50} gradient={false} pauseOnHover>
      {messages.map((msg, index) => (
        <BgH1 key={index}>
          {msg}
        </BgH1>
      ))}
    </Marquee>
  </MarqueeContainer>
      <ContentWrapper>

        <SwiperContainer>
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{
              clickable: true,
              el: '.swiper-custom-pagination',
            }}
            loop={true}
            spaceBetween={10}
            breakpoints={{
              // when window width is >= 768px (desktop)
              768: {
                slidesPerView: 2.5,
                spaceBetween: 10
              },
              // when window width is < 768px (mobile)
              0: {
                slidesPerView: 1.5,
                spaceBetween: 10
              }
            }}
          >
            {items.map((item, index) => (
              <SwiperSlide key={item.ID || index}>
                <MediaItem item={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        </SwiperContainer>
      </ContentWrapper>
      <PaginationContainer>
        <div className="swiper-custom-pagination" ref={paginationRef} />
      </PaginationContainer>
    </GallerySection>
  );
} 