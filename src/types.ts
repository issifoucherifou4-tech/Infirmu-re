export interface CampaignData {
  id: string;
  title: string;
  shortUrl: string;
  originalUrl: string;
  videoUrl: string;
  videoUrlFallback?: string;
  thumbnailUrl: string;
  author: string;
  authorAvatar?: string;
  category: string;
  description: string;
  hashtags: string[];
  duration: number; // in seconds
  dimensions: { width: number; height: number };
  aspectRatio: string;
  specs: {
    codec: string;
    bitrate: string;
    audio: string;
    filesize: string;
  };
  metrics: {
    impressions: number;
    clicks: number;
    shares: number;
    completionRate: number;
    ctr: number;
  };
}

export type ComputerStyle = 'desktop' | 'laptop' | 'cinema';

export interface PlayerSettings {
  autoPlay: boolean;
  isMuted: boolean;
  loop: boolean;
  volume: number;
  ambientLight: boolean;
  fitMode: 'contain' | 'cover' | 'theater';
  playbackSpeed: number;
}
