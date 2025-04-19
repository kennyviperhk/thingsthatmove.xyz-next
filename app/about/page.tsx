'use client';

import HorizontalGallery from '@/components/HorizontalGallery';
import AboutText from '@/components/AboutText';

const mediaItems = [
  {
    type: 'image',
    url: '/images/about/studio-1.jpg'
  },
  {
    type: 'video',
    url: '/videos/about/process-1.mp4'
  },
  {
    type: 'image',
    url: '/images/about/studio-2.jpg'
  },
  {
    type: 'video',
    url: '/videos/about/process-2.mp4'
  }
];

const aboutContent = {
  title: "About Things That Move",
  paragraphs: [
    "We are a creative studio specializing in motion design and visual storytelling. Our passion lies in bringing ideas to life through compelling animations and dynamic visuals.",
    "Founded in 2020, we've collaborated with brands and agencies worldwide, crafting unique visual experiences that captivate and engage audiences.",
    "Our approach combines technical expertise with artistic vision, ensuring each project we undertake pushes the boundaries of what's possible in motion design."
  ]
};

export default function AboutPage() {
  return (
    <main>
      <HorizontalGallery items={mediaItems} />
      <AboutText content={aboutContent} />
    </main>
  );
} 