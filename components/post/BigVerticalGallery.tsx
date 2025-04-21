'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Loading from '@/components/Loading';

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

interface BigVerticalGalleryProps {
  data?: GalleryData[] | GalleryData;
}

const GallerySection = styled.section`
  width: 100%;
  max-width: 1200px;
  margin: 4rem auto;
  padding: 0 1rem;

  @media (min-width: 768px) {
    padding: 0 2rem;
  }
`;

const GalleryImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
  margin-bottom: 1rem;
`;

const ImageCaption = styled.figcaption`
  text-align: center;
  font-size: 0.9rem;
  margin-top: 1rem;
  margin-bottom: 4rem;
  opacity: 0.8;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Figure = styled.figure`
  margin: 0;
  padding: 0;
  margin-bottom: 4rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

export default function BigVerticalGallery({ data }: BigVerticalGalleryProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    if (!data) {
      setIsLoading(false);
      return;
    }

    const items = Array.isArray(data) ? data : [data];
    const urls = items
      .map(item => item.guid || item.url || item.source_url)
      .filter((url): url is string => url !== undefined);

    if (urls.length === 0) {
      setIsLoading(false);
      return;
    }

    setTotalCount(urls.length);
    setLoadedCount(0);
    setIsLoading(true);

    const loadMedia = async () => {
      await Promise.all(
        urls.map(url => {
          return new Promise<void>((resolve) => {
            if (url.match(/\.(mp4|webm|mov)$/i)) {
              const video = document.createElement('video');
              video.onloadeddata = () => {
                setLoadedCount(count => count + 1);
                resolve();
              };
              video.onerror = () => {
                setLoadedCount(count => count + 1);
                resolve();
              };
              video.src = url;
            } else {
              const img = new Image();
              img.onload = () => {
                setLoadedCount(count => count + 1);
                resolve();
              };
              img.onerror = () => {
                setLoadedCount(count => count + 1);
                resolve();
              };
              img.src = url;
            }
          });
        })
      );
    };

    loadMedia();

    return () => {
      setLoadedCount(0);
      setTotalCount(0);
      setIsLoading(true);
    };
  }, [data]);

  useEffect(() => {
    if (loadedCount > 0 && loadedCount === totalCount) {
      setIsLoading(false);
    }
  }, [loadedCount, totalCount]);

  if (!data) return null;

  if (isLoading) {
    return <Loading />;
  }

  const items = Array.isArray(data) ? data : [data];

  return (
    <GallerySection>
      {items.map((item: GalleryData, index: number) => {
        const url = item.url || item.guid || item.source_url || '';
        return (
          <Figure key={index}>
            <GalleryImage src={url} alt={item.post_title || ''} />
            {item.post_title && <ImageCaption>{item.post_title}</ImageCaption>}
          </Figure>
        );
      })}
    </GallerySection>
  );
} 