export function getProxiedMediaUrl(url: string): string {
  // Only proxy external URLs
  if (url.startsWith('http')) {
    return `/api/media?url=${encodeURIComponent(url)}`;
  }
  return url;
}

export function isVideoUrl(url: string): boolean {
  return url.match(/\.(mp4|webm|mov)$/i) !== null;
}

export function getMediaType(url: string, mimeType?: string): 'video' | 'image' {
  if (mimeType?.startsWith('video/') || isVideoUrl(url)) {
    return 'video';
  }
  return 'image';
} 