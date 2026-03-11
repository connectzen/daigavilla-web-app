import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extracts YouTube video ID from various YouTube URL formats
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  
  try {
    const u = new URL(url);
    // Standard watch URL: https://www.youtube.com/watch?v=VIDEO_ID
    const v = u.searchParams.get("v");
    if (v && v.length === 11) return v;
    
    // youtu.be short links: https://youtu.be/VIDEO_ID
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.split("/").filter(Boolean)[0];
      if (id && id.length === 11) return id;
    }
    
    // embed and shorts paths: /embed/VIDEO_ID or /shorts/VIDEO_ID or /v/VIDEO_ID
    const parts = u.pathname.split("/").filter(Boolean);
    const idx = parts.findIndex(p => p === "embed" || p === "shorts" || p === "v");
    if (idx >= 0 && parts[idx + 1] && parts[idx + 1].length === 11) {
      return parts[idx + 1];
    }
  } catch {
    // Fallback regex for malformed URLs
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2] && match[2].length === 11) {
      return match[2];
    }
  }
  
  return null;
}

/**
 * Generates YouTube thumbnail URL from video ID
 */
export function getYouTubeThumbnail(videoId: string | null, quality: 'default' | 'medium' | 'high' | 'maxres' = 'maxres'): string {
  if (!videoId || videoId.length !== 11) {
    return '/placeholder.svg';
  }
  
  const qualityMap = {
    default: 'default.jpg',
    medium: 'mqdefault.jpg',
    high: 'hqdefault.jpg',
    maxres: 'maxresdefault.jpg'
  };
  
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}`;
}

/**
 * Generates YouTube embed URL from video ID
 */
export function getYouTubeEmbedUrl(videoId: string | null): string {
  if (!videoId || videoId.length !== 11) {
    return '';
  }
  return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&controls=1`;
}
