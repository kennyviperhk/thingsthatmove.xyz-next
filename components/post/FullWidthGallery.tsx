'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import Loading from '@/components/Loading';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { getProxiedMediaUrl, getMediaType } from '@/lib/media';

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

interface FullWidthGalleryProps {
  data?: GalleryData[] | GalleryData;
}

interface MediaLoadingState {
  isLoading: boolean;
  failed: boolean;
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
  display: block;
  width: 100%;
  overflow: hidden;
  object-fit: cover;
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

const Figure = styled.figure`
  margin: 0;
  padding: 0;
  width: 100%;
`;

const LoadingContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
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
      console.error('[FullWidthGallery] Video failed to load:', url);
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
  if (!mediaUrl) return null;

  const isVideo = item.post_mime_type?.startsWith('video/') || 
                 item.media_type === 'video' || 
                 item.mime_type?.startsWith('video/') ||
                 mediaUrl.toLowerCase().match(/\.(mp4|webm|mov|avi)$/i) !== null;

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

export default function FullWidthGallery({ data }: FullWidthGalleryProps) {
  const [mediaStates, setMediaStates] = useState<Record<string, MediaLoadingState>>({});
  const mediaTypeCache = useRef<Record<string, { isVideo: boolean, mediaUrl: string }>>({});

  const determineMediaType = useCallback((item: GalleryData) => {
    const getMediaUrl = (item: GalleryData) => {
      if (typeof item.guid === 'object' && item.guid?.rendered) {
        return item.guid.rendered;
      }
      if (typeof item.guid === 'string') {
        return item.guid;
      }
      return item.source_url || item.url;
    };

    const mediaUrl = getMediaUrl(item);
    if (!mediaUrl) return null;

    // Check cache first
    if (mediaTypeCache.current[mediaUrl]) {
      return mediaTypeCache.current[mediaUrl];
    }

    let isVideo = false;
    if (item.post_mime_type) {
      isVideo = item.post_mime_type.startsWith('video/');
    } else if (item.media_type) {
      isVideo = item.media_type === 'video';
    } else if (item.mime_type) {
      isVideo = item.mime_type.startsWith('video/');
    } else {
      isVideo = mediaUrl.toLowerCase().match(/\.(mp4|webm|mov|avi)$/i) !== null;
    }

    const result = { isVideo, mediaUrl };
    mediaTypeCache.current[mediaUrl] = result;
    return result;
  }, []);

  const renderMedia = useCallback((item: GalleryData) => {
    const mediaType = determineMediaType(item);
    if (!mediaType) {
      return null;
    }

    const { isVideo, mediaUrl } = mediaType;

    return isVideo ? (
      <VideoComponent url={mediaUrl} />
    ) : (
      <GalleryImage 
        src={getProxiedMediaUrl(mediaUrl)}
        alt={typeof item.post_title === 'string' ? item.post_title : ''}
      />
    );
  }, [determineMediaType]);

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

        if (url.match(/\.(mp4|webm|mov)$/i)) {
          const video = document.createElement('video');
          video.crossOrigin = "anonymous";
          video.onloadeddata = () => {
            clearTimeout(timeoutId);
            resolve();
          };
          video.onerror = () => {
            clearTimeout(timeoutId);
            reject();
          };
          video.src = getProxiedMediaUrl(url);
        } else {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            clearTimeout(timeoutId);
            resolve();
          };
          img.onerror = () => {
            clearTimeout(timeoutId);
            reject();
          };
          img.src = getProxiedMediaUrl(url);
        }
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

    const items = Array.isArray(data) ? data : [data];
    const urls = items.map(item => {
      const mediaType = determineMediaType(item);
      return mediaType?.mediaUrl;
    }).filter((url): url is string => typeof url === 'string');

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
  }, [data, loadMediaItem, determineMediaType]);

  if (!data) return null;

  const galleryItems = Array.isArray(data) ? data : Object.values(data);
  if (galleryItems.length === 0) return null;

  return (
    <GallerySection>
      {galleryItems.map((item: any, index: number) => (
        <Figure key={index}>
          {galleryItems.length > 1 ? (
            <SwiperContainer>
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                loop={true}
              >
                <SwiperSlide>
                  <MediaContainer>
                    {renderMedia(item)}
                  </MediaContainer>
                </SwiperSlide>
              </Swiper>
            </SwiperContainer>
          ) : (
            <MediaContainer>
              {renderMedia(item)}
            </MediaContainer>
          )}
        </Figure>
      ))}
    </GallerySection>
  );
} 