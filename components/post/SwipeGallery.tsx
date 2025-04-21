'use client';

import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface GalleryData {
  url: string;
  caption?: string;
}

interface SwipeGalleryProps {
  data?: GalleryData[];
}

const GallerySection = styled.section`
  width: 100%;
  max-width: 1400px;
  margin: 4rem auto;
  padding: 0 1rem;
  position: relative;

  @media (min-width: 768px) {
    padding: 0 2rem;
  }

  .swiper {
    width: 100%;
    height: 100%;
  }

  .swiper-slide {
    text-align: center;
    background: #000;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .swiper-button-next,
  .swiper-button-prev {
    color: white;
  }

  .swiper-pagination-bullet {
    background: white;
  }

  .swiper-pagination-bullet-active {
    background: white;
  }
`;

const GalleryImage = styled.img`
  max-width: 100%;
  height: auto;
  display: block;
`;

const ImageCaption = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 1rem;
  text-align: center;
  font-size: 0.9rem;
`;

export default function SwipeGallery({ data }: SwipeGalleryProps) {
  const swiperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!swiperRef.current || !data) return;

    const swiper = new Swiper(swiperRef.current, {
      modules: [Navigation, Pagination],
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });

    return () => {
      swiper.destroy();
    };
  }, [data]);

  if (!data || data.length === 0) return null;

  return (
    <GallerySection>
      <div className="swiper" ref={swiperRef}>
        <div className="swiper-wrapper">
          {data.map((item, index) => (
            <div key={index} className="swiper-slide">
              <GalleryImage src={item.url} alt={item.caption || ''} />
              {item.caption && <ImageCaption>{item.caption}</ImageCaption>}
            </div>
          ))}
        </div>
        <div className="swiper-pagination"></div>
        <div className="swiper-button-prev"></div>
        <div className="swiper-button-next"></div>
      </div>
    </GallerySection>
  );
} 