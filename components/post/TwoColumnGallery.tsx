'use client';

import styled from 'styled-components';

interface GalleryData {
  url: string;
  caption?: string;
}

interface TwoColumnGalleryProps {
  data?: GalleryData[];
}

const GallerySection = styled.section`
  width: 100%;
  max-width: 1400px;
  margin: 2rem auto;
  padding: 0 1rem;

  @media (min-width: 768px) {
    padding: 0 2rem;
  }
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const GalleryImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

const ImageCaption = styled.figcaption`
  text-align: center;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  opacity: 0.8;
`;

const Figure = styled.figure`
  margin: 0;
  padding: 0;
`;

export default function TwoColumnGallery({ data }: TwoColumnGalleryProps) {
  if (!data || data.length === 0) return null;

  return (
    <GallerySection>
      <GalleryGrid>
        {data.map((item, index) => (
          <Figure key={index}>
            <GalleryImage src={item.url} alt={item.caption || ''} />
            {item.caption && <ImageCaption>{item.caption}</ImageCaption>}
          </Figure>
        ))}
      </GalleryGrid>
    </GallerySection>
  );
} 