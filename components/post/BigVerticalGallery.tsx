'use client';

import styled from 'styled-components';

interface GalleryData {
  url: string;
  caption?: string;
}

interface BigVerticalGalleryProps {
  data?: GalleryData[];
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
  margin-bottom: 4rem;

  &:last-child {
    margin-bottom: 0;
  }
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
`;

export default function BigVerticalGallery({ data }: BigVerticalGalleryProps) {
  if (!data || data.length === 0) return null;

  return (
    <GallerySection>
      {data.map((item, index) => (
        <Figure key={index}>
          <GalleryImage src={item.url} alt={item.caption || ''} />
          {item.caption && <ImageCaption>{item.caption}</ImageCaption>}
        </Figure>
      ))}
    </GallerySection>
  );
} 