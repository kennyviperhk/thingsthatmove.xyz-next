import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import ReactPlayer to reduce initial bundle size
const ReactPlayer = dynamic(() => import('react-player/lazy'), {
  ssr: false, // Disable server-side rendering
  loading: () => <div className="aspect-video bg-gray-100 animate-pulse" />,
})

interface OptimizedVideoProps {
  url: string
  thumbnail?: string
  title?: string
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  className?: string
}

export default function OptimizedVideo({
  url,
  thumbnail,
  title,
  autoplay = false,
  loop = true,
  muted = true,
  className = '',
}: OptimizedVideoProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isPlaying, setIsPlaying] = useState(autoplay)
  const videoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Create intersection observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: '50px', // Start loading 50px before video comes into view
      }
    )

    if (videoRef.current) {
      observer.observe(videoRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  // Determine video type and format
  const isMP4 = url.toLowerCase().endsWith('.mp4')
  const videoConfig = {
    file: {
      attributes: {
        preload: 'metadata', // Only preload video metadata
      },
    },
  }

  return (
    <div
      ref={videoRef}
      className={`relative aspect-video w-full overflow-hidden ${className}`}
    >
      {isVisible ? (
        <ReactPlayer
          url={url}
          width="100%"
          height="100%"
          playing={isPlaying}
          loop={loop}
          muted={muted}
          playsinline
          config={videoConfig}
          light={thumbnail} // Show thumbnail until play
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          fallback={
            <div className="flex h-full w-full items-center justify-center bg-gray-100">
              <p>Loading video...</p>
            </div>
          }
        />
      ) : (
        // Placeholder while video is not in viewport
        <div className="h-full w-full bg-gray-100">
          {thumbnail && (
            <img
              src={thumbnail}
              alt={title || 'Video thumbnail'}
              className="h-full w-full object-cover"
            />
          )}
        </div>
      )}
    </div>
  )
} 