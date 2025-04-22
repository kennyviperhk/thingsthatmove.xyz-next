'use client';

import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import Loading from '@/components/Loading';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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
  }

  .swiper-slide {
    text-align: center;
    background: #000;
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
    color: white;
    &:after {
      font-size: 24px;
    }
    @media (max-width: 768px) {
      display: none;
    }
  }

  .swiper-pagination-bullet {
    background: white;
  }

  .swiper-pagination-bullet-active {
    background: white;
  }
`;

const MediaContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
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

export default function SwipeGallery({ data }: SwipeGalleryProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  useEffect(() => {
    if (data) {
      let loadedCount = 0;
      const totalItems = data.length;

      // Simulate checking if all media is loaded
      Promise.all(
        data.map(item => {
          const url = item.guid || item.url || item.source_url;
          if (!url) {
            loadedCount++;
            setLoadingProgress((loadedCount / totalItems) * 100);
            return Promise.resolve(undefined);
          }
          
          return new Promise<void>((resolve) => {
            if (url.match(/\.(mp4|webm|mov)$/i)) {
              // For videos
              const video = document.createElement('video');
              video.onloadeddata = () => {
                loadedCount++;
                setLoadingProgress((loadedCount / totalItems) * 100);
                resolve();
              };
              video.onerror = () => {
                loadedCount++;
                setLoadingProgress((loadedCount / totalItems) * 100);
                resolve();
              };
              video.src = url;
            } else {
              // For images
              const img = new Image();
              img.onload = () => {
                loadedCount++;
                setLoadingProgress((loadedCount / totalItems) * 100);
                resolve();
              };
              img.onerror = () => {
                loadedCount++;
                setLoadingProgress((loadedCount / totalItems) * 100);
                resolve();
              };
              img.src = url;
            }
          });
        })
      ).then(() => {
        setIsLoading(false);
      });
    }
  }, [data]);

  if (!data || data.length === 0) {
    console.log('No gallery data provided');
    return null;
  }

  if (isLoading) {
    return <Loading progress={loadingProgress} />;
  }

  const renderMedia = (item: GalleryData) => {
    console.log('Rendering media item:', item);
    
    const url = item.guid || item.url || item.source_url;
    if (!url) {
      console.log('No URL found for media item');
      return null;
    }

    const isVideo = url.match(/\.(mp4|webm|mov)$/i) || 
                   item.mime_type?.startsWith('video/') ||
                   item.post_mime_type?.startsWith('video/');

    if (isVideo) {
      return (
        <GalleryVideo
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={url} type="video/mp4" />
        </GalleryVideo>
      );
    }

    return (
      <GalleryImage 
        src={url} 
        alt={item.post_title || ''} 
      />
    );
  };

  return (
    <GallerySection>
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
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
            <MediaContainer>
              {renderMedia(item)}
            </MediaContainer>
          </SwiperSlide>
        ))}
      </Swiper>
    </GallerySection>
  );
} 