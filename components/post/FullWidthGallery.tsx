'use client';

import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
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
}

interface FullWidthGalleryProps {
  data?: GalleryData[] | any;
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

const Figure = styled.figure`
  margin: 0;
  padding: 0;
  width: 100%;
`;

export default function FullWidthGallery({ data }: FullWidthGalleryProps) {
  if (!data) return null;

  // Handle both array and object formats
  const galleryItems = Array.isArray(data) ? data : Object.values(data);

  if (galleryItems.length === 0) return null;

  const renderMedia = (item: any) => {
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

    if (!mediaUrl) return null;

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

    return isVideo ? (
      <GalleryVideo 
        autoPlay
        loop
        muted
        playsInline
        src={mediaUrl}
        preload="metadata"
      />
    ) : (
      <GalleryImage 
        src={mediaUrl} 
        loading="lazy"
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