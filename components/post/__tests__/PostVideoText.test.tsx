'use client';

import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import PostVideoText from '../PostVideoText';

// Mock react-player
jest.mock('react-player/lazy', () => {
  return {
    __esModule: true,
    default: function MockReactPlayer({ url }: { url: string }) {
      return <div data-testid="react-player" data-url={url}>Mock Player</div>;
    },
    canPlay: (url: string) => url.includes('youtube.com') || url.includes('vimeo.com'),
  };
});

describe('PostVideoText', () => {
  const sampleConcept = 'Test concept text';

  it('renders concept text correctly', () => {
    render(<PostVideoText concept={sampleConcept} />);
    expect(screen.getByText(sampleConcept)).toBeInTheDocument();
  });

  it('renders image correctly', () => {
    const imageUrl = 'test-image.jpg';
    render(<PostVideoText concept={sampleConcept} video={imageUrl} />);
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', imageUrl);
    expect(image).toHaveAttribute('alt', sampleConcept);
  });

  it('renders native video correctly', () => {
    const videoUrl = 'test-video.mp4';
    render(<PostVideoText concept={sampleConcept} video={videoUrl} />);
    const video = screen.getByRole('video');
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('playsInline');
    expect(video).toHaveAttribute('autoPlay');
    expect(video).toHaveAttribute('muted');
    expect(video).toHaveAttribute('loop');
    
    const source = video.querySelector('source');
    expect(source).toHaveAttribute('src', `${videoUrl}#t=0.1`);
    expect(source).toHaveAttribute('type', 'video/mp4');
  });

  it('renders YouTube video correctly', () => {
    const youtubeUrl = 'https://www.youtube.com/watch?v=test123';
    render(<PostVideoText concept={sampleConcept} video={youtubeUrl} />);
    const player = screen.getByTestId('react-player');
    expect(player).toBeInTheDocument();
    expect(player).toHaveAttribute('data-url', youtubeUrl);
  });

  it('renders Vimeo video correctly', () => {
    const vimeoUrl = 'https://vimeo.com/test123';
    render(<PostVideoText concept={sampleConcept} video={vimeoUrl} />);
    const player = screen.getByTestId('react-player');
    expect(player).toBeInTheDocument();
    expect(player).toHaveAttribute('data-url', vimeoUrl);
  });

  it('handles missing video prop', () => {
    render(<PostVideoText concept={sampleConcept} />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.queryByRole('video')).not.toBeInTheDocument();
    expect(screen.queryByTestId('react-player')).not.toBeInTheDocument();
  });

  it('handles missing concept prop', () => {
    const videoUrl = 'test-video.mp4';
    render(<PostVideoText video={videoUrl} />);
    expect(screen.queryByText(sampleConcept)).not.toBeInTheDocument();
  });

  it('renders with secondary layout', () => {
    render(<PostVideoText concept={sampleConcept} isSecondary />);
    const section = screen.getByRole('region');
    expect(section).toHaveStyle({ flexFlow: 'row-reverse' });
  });

  it('returns null when no props provided', () => {
    const { container } = render(<PostVideoText />);
    expect(container.firstChild).toBeNull();
  });
}); 