'use client';

import styled from 'styled-components';
import TriangleLanding from '@/components/TriangleLanding';
import HorizontalGallery, { type MediaItem } from '@/components/HorizontalGallery';

const BioContainer = styled.article`
  max-width: 800px;
  margin: 0 auto;
  padding: 8rem 2rem;
  background: white;
  color: black;
  
  h1 {
    font-size: clamp(2rem, 4vw, 3rem);
    margin-bottom: 2rem;
    font-weight: 500;
  }
  
  .content {
    font-size: 1.125rem;
    line-height: 1.6;
    
    p {
      margin-bottom: 1.5rem;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
`;

const mediaItems: MediaItem[] = [
  {
    type: 'image',
    url: '/images/bio/studio-1.jpg'
  },
  {
    type: 'video',
    url: '/videos/bio/process-1.mp4'
  },
  {
    type: 'image',
    url: '/images/bio/studio-2.jpg'
  },
  {
    type: 'video',
    url: '/videos/bio/process-2.mp4'
  }
];

export default function BioPage() {
  return (
    <>
      <TriangleLanding title="ABOUT" backgroundColor="black" />
      <BioContainer>
        <h1>Bio</h1>
        <div className="content">
          <p>Kenny Wong was born in 1987 in Hong Kong. Wong's works explore the delicate relationship between daily experiences and perceptual stimulations. His research-based practice combines everyday objects with contemporary digital technology, creating artworks that reflect on our experience of living in the current techno-centric era.</p>
          <p>Wong received his Master of Fine Arts from the School of Creative Media, City University of Hong Kong. His works have been shown internationally at museums, galleries and festivals including Today Art Museum (Beijing), Art Basel Hong Kong, Ars Electronica Festival (Linz), and more.</p>
          <p>He is currently based in Hong Kong, working as an artist and creative technologist.</p>
        </div>
      </BioContainer>
      <HorizontalGallery items={mediaItems} />
    </>
  );
} 