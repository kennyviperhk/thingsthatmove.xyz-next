'use client';

import '@testing-library/jest-dom';
import { render, screen, waitFor, act } from '@testing-library/react';
import BigVerticalGallery from '../BigVerticalGallery';

// Mock test data
const singleImageData = {
  ID: '1',
  guid: 'https://example.com/test1.jpg',
  post_title: 'Test Image 1'
};

const multipleImagesData = [
  {
    ID: '1',
    guid: 'https://example.com/test1.jpg',
    post_title: 'Test Image 1'
  },
  {
    ID: '2',
    source_url: 'https://example.com/test2.jpg',
    post_title: 'Test Image 2'
  },
  {
    ID: '3',
    url: 'https://example.com/test3.mp4',
    post_title: 'Test Video 1',
    mime_type: 'video/mp4'
  }
];

describe('BigVerticalGallery', () => {
  beforeEach(() => {
    jest.useFakeTimers();

    // Mock Image loading
    global.Image = class {
      onload: () => void = () => {};
      constructor() {
        setTimeout(() => {
          this.onload();
        }, 100);
      }
    } as any;

    // Mock Video loading
    global.HTMLVideoElement = class {
      onloadeddata: () => void = () => {};
      constructor() {
        setTimeout(() => {
          this.onloadeddata();
        }, 100);
      }
    } as any;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders loading state initially', () => {
    render(<BigVerticalGallery data={singleImageData} />);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('renders single image with caption', async () => {
    render(<BigVerticalGallery data={singleImageData} />);
    
    await act(async () => {
      jest.advanceTimersByTime(1000);
      await Promise.resolve(); // Flush promises
    });

    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();

    const image = screen.getByAltText('Test Image 1');
    expect(image).toBeInTheDocument();
    expect(image.getAttribute('src')).toBe('https://example.com/test1.jpg');
    
    const caption = screen.getByRole('figure').querySelector('figcaption');
    expect(caption).toHaveTextContent('Test Image 1');
  });

  it('renders multiple images', async () => {
    const { container } = render(<BigVerticalGallery data={multipleImagesData} />);

    // Initial loading state
    expect(screen.getByTestId('loading')).toBeInTheDocument();

    // Wait for loading to complete
    await act(async () => {
      for (let i = 0; i < 10; i++) {
        jest.advanceTimersByTime(100);
        await Promise.resolve();
      }
    });

    // Verify loading is complete
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();

    // Verify images and captions
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2); // 2 images, 1 video

    const figures = screen.getAllByRole('figure');
    expect(figures).toHaveLength(3); // All items should be in figures

    // Check captions
    figures.forEach((figure, index) => {
      const caption = figure.querySelector('figcaption');
      if (caption) {
        expect(caption).toHaveTextContent(multipleImagesData[index].post_title || '');
      }
    });
  });

  it('handles missing data gracefully', () => {
    render(<BigVerticalGallery />);
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
}); 