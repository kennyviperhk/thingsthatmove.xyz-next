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
  guid?: string;
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

// Add debug logging function
const debugLog = (message: string, ...args: any[]) => {
  console.log(`[FullWidthGallery] ${message}`, ...args);
};

const VideoComponent = ({ url }: { url: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isError, setIsError] = useState(false);
  const [loadingState, setLoadingState] = useState<'initial' | 'loading' | 'playing' | 'error'>('initial');

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      console.log('[FullWidthGallery] Video can play:', url);
      setLoadingState('playing');
    };

    const handleError = (e: Event) => {
      const videoEl = e.target as HTMLVideoElement;
      console.error('[FullWidthGallery] Video error:', {
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

export default function FullWidthGallery({ data }: FullWidthGalleryProps) {
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
      const url = item.guid || item.url || item.source_url;
      return url || '';
    }).filter(url => url !== '');

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

  const galleryItems = Array.isArray(data) ? data : Object.values(data);
  if (galleryItems.length === 0) return null;

  const renderMedia = (item: any) => {
    console.log('[FullWidthGallery] Rendering media:', item);

    let mediaUrl = null;
    if (item.guid?.rendered) {
      mediaUrl = item.guid.rendered;
    } else if (item.guid) {
      mediaUrl = item.guid;
    } else if (item.source_url) {
      mediaUrl = item.source_url;
    } else if (item.url) {
      mediaUrl = item.url;
    }

    if (!mediaUrl) {
      console.log('[FullWidthGallery] No media URL found');
      return null;
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

    console.log('[FullWidthGallery] Media type determined:', { isVideo, mediaUrl });

    return isVideo ? (
      <VideoComponent url={mediaUrl} />
    ) : (
      <GalleryImage 
        src={getProxiedMediaUrl(mediaUrl)}
      />
    );
  };

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