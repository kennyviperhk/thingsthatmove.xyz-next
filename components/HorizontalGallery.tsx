'use client';

import { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const GalleryContainer = styled.section`
  width: 100%;
  background: black;
  color: white;
  overflow: hidden;
  position: relative;
  padding: 4rem 0;
`;

const ScrollContainer = styled.div`
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const MediaItemContainer = styled.div`
  flex: 0 0 auto;
  width: 80vw;
  height: 60vh;
  margin-right: 2rem;
  scroll-snap-align: start;
  position: relative;
  
  &:first-child {
    margin-left: 2rem;
  }
  
  img, video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export interface MediaItem {
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
}

interface HorizontalGalleryProps {
  items: MediaItem[];
}

export default function HorizontalGallery({ items }: HorizontalGalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (scrollRef.current) {
        e.preventDefault();
        scrollRef.current.scrollLeft += e.deltaY;
      }
    };

    const element = scrollRef.current;
    if (element) {
      element.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (element) {
        element.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  return (
    <GalleryContainer>
      <ScrollContainer ref={scrollRef}>
        {items.map((item, index) => (
          <MediaItemContainer key={index}>
            {item.type === 'image' ? (
              <motion.img
                src={item.url}
                alt=""
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              />
            ) : (
              <motion.video
                autoPlay
                muted
                loop
                playsInline
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <source src={item.url} type="video/mp4" />
              </motion.video>
            )}
          </MediaItemContainer>
        ))}
      </ScrollContainer>
    </GalleryContainer>
  );
} 