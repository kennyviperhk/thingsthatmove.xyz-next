'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { getProxiedMediaUrl } from '@/lib/media';
import Loading from '@/components/Loading';

interface GalleryData {
  guid: string;
  url?: string;
  post_title?: string;
  caption?: string;
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

interface GalleryImageProps {
  item: GalleryData;
  index: number;
}

const GalleryImage = ({ item, index }: GalleryImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const imageUrl = item.guid || item.url;

  if (!imageUrl) return null;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <ImgDiv $isLoading={isLoading}>
      <Img 
        src={getProxiedMediaUrl(imageUrl)} 
        alt={item.caption || item.post_title || ''}
        crossOrigin="anonymous"
        $isLoading={isLoading}
        onLoad={() => setIsLoading(false)}
        onError={() => setError('Failed to load image')}
      />
      {isLoading && (
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
              <GalleryImage key={`${galleryIndex}-${index}`} item={item} index={index} />
            ))}
          </GalleryDiv>
        );
      })}
    </GallerySection>
  );
} 