import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Share2,
  Heart,
  Laptop,
  Monitor,
  PictureInPicture2,
  Check,
  Layers,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { CampaignData, ComputerStyle, PlayerSettings } from '../types';

interface ComputerMockupProps {
  campaign: CampaignData;
  style: ComputerStyle;
  onStyleChange: (style: ComputerStyle) => void;
  settings: PlayerSettings;
  onUpdateSettings: (partial: Partial<PlayerSettings>) => void;
  onOpenEmbedModal?: () => void;
}

export const ComputerMockup: React.FC<ComputerMockupProps> = ({
  campaign,
  style,
  onStyleChange,
  settings,
  onUpdateSettings,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(campaign.duration || 45);
  const [buffered, setBuffered] = useState<number>(0);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [likes, setLikes] = useState<number>(1420);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [showCopiedToast, setShowCopiedToast] = useState<boolean>(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [needsSoundInteraction, setNeedsSoundInteraction] = useState<boolean>(false);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 2500);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = settings.isMuted;
    video.volume = settings.volume;
    video.playbackRate = settings.playbackSpeed;
    video.loop = settings.loop;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          if (settings.isMuted) {
            setNeedsSoundInteraction(true);
          }
        })
        .catch(() => {
          video.muted = true;
          onUpdateSettings({ isMuted: true });
          video
            .play()
            .then(() => {
              setIsPlaying(true);
              setNeedsSoundInteraction(true);
            })
            .catch(() => {
              setIsPlaying(false);
            });
        });
    }
  }, [campaign.videoUrl]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = settings.isMuted;
      videoRef.current.volume = settings.volume;
      videoRef.current.playbackRate = settings.playbackSpeed;
      videoRef.current.loop = settings.loop;
    }
  }, [settings]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const nextMuted = !settings.isMuted;
    onUpdateSettings({ isMuted: nextMuted });
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
    }
    setNeedsSoundInteraction(false);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onUpdateSettings({ volume: val, isMuted: val === 0 });
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
    }
    setNeedsSoundInteraction(false);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);

    if (videoRef.current.buffered.length > 0) {
      const bufferedEnd = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
      const bufPct = (bufferedEnd / (videoRef.current.duration || 1)) * 100;
      setBuffered(Math.min(bufPct, 100));
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || campaign.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  };

  const handleSpeedSelect = (speed: number) => {
    onUpdateSettings({ playbackSpeed: speed });
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSpeedMenu(false);
  };

  const togglePiP = async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (videoRef.current) {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (err) {
      console.warn('PiP not supported', err);
    }
  };

  const toggleMockupFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleShareClick = () => {
    navigator.clipboard.writeText(campaign.shortUrl);
    setShowCopiedToast(true);
    setTimeout(() => setShowCopiedToast(false), 2000);
  };

  const handleLikeClick = () => {
    if (!hasLiked) {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    } else {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    }
  };

  const reloadVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center w-full px-2 sm:px-4">
      {/* Clean, discreet top controls */}
      <div className="w-full max-w-6xl xl:max-w-7xl flex flex-wrap items-center justify-between gap-3 mb-3 text-xs">
        {/* Style selector */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-900/90 border border-zinc-800 rounded-lg">
          <button
            onClick={() => onStyleChange('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all font-medium ${
              style === 'desktop'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Bureau Studio</span>
          </button>
          <button
            onClick={() => onStyleChange('laptop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all font-medium ${
              style === 'laptop'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>Portable MacBook</span>
          </button>
        </div>

        {/* Clean right tools: Ambilight + Zoom + Pinterest */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
              isZoomed
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
            title="Agrandir au maximum l'écran"
          >
            {isZoomed ? <ZoomOut className="w-3.5 h-3.5" /> : <ZoomIn className="w-3.5 h-3.5" />}
            <span>{isZoomed ? 'Format Normal' : 'Agrandir Écran'}</span>
          </button>

          <button
            onClick={() => onUpdateSettings({ ambientLight: !settings.ambientLight })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
              settings.ambientLight
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
            title="Halo lumineux d'ambiance"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lumière</span>
          </button>

          <a
            href={campaign.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-lg transition-all"
            title="Ouvrir le lien source"
          >
            <ExternalLink className="w-3.5 h-3.5 text-rose-500" />
            <span>Pinterest</span>
          </a>
        </div>
      </div>

      {/* Main Computer Frame (Magnified & Large) */}
      <div
        ref={containerRef}
        className={`relative w-full transition-all duration-300 flex flex-col items-center justify-center ${
          isFullscreen
            ? 'fixed inset-0 z-50 bg-black p-4 max-w-none h-screen'
            : isZoomed
            ? 'max-w-[1500px]'
            : 'max-w-6xl xl:max-w-7xl'
        }`}
      >
        {/* Dynamic Ambilight Backlight */}
        {settings.ambientLight && (
          <div
            className="absolute -inset-8 -z-10 blur-3xl opacity-50 transition-opacity duration-700 pointer-events-none rounded-3xl"
            style={{
              background: isPlaying
                ? 'radial-gradient(circle at 50% 50%, rgba(225, 29, 72, 0.4), rgba(147, 51, 234, 0.3), rgba(37, 99, 235, 0.25), transparent 70%)'
                : 'radial-gradient(circle at 50% 50%, rgba(71, 85, 105, 0.3), transparent 70%)',
            }}
          />
        )}

        {/* Chassis */}
        <div
          className={`relative w-full bg-zinc-950 rounded-2xl shadow-2xl transition-all border border-zinc-700/60 ${
            style === 'laptop' ? 'p-2 sm:p-3 rounded-b-none' : 'p-3 sm:p-4'
          }`}
          style={{
            boxShadow:
              '0 30px 80px -20px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.08) inset',
          }}
        >
          {/* Top Bezel: Camera + Green LED */}
          <div className="relative flex items-center justify-center pb-2">
            <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-zinc-900/90 border border-zinc-800 shadow-inner">
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 border border-zinc-700 relative flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-blue-950/90" />
              </div>
              <div
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  isPlaying ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-zinc-700'
                }`}
              />
            </div>
          </div>

          {/* Screen Inner Display */}
          <div className="relative w-full rounded-xl overflow-hidden bg-black border border-zinc-800 shadow-2xl">
            {/* macOS Browser Bar */}
            <div className="w-full bg-zinc-900/95 border-b border-zinc-800 px-3 py-2 flex items-center justify-between text-xs text-zinc-300 select-none">
              <div className="flex items-center gap-1.5 w-16">
                <button
                  onClick={reloadVideo}
                  title="Réinitialiser"
                  className="w-3 h-3 rounded-full bg-rose-500 hover:bg-rose-600 transition-colors cursor-pointer"
                />
                <button
                  onClick={toggleMute}
                  title="Son"
                  className="w-3 h-3 rounded-full bg-amber-500 hover:bg-amber-600 transition-colors cursor-pointer"
                />
                <button
                  onClick={toggleMockupFullscreen}
                  title="Plein écran"
                  className="w-3 h-3 rounded-full bg-emerald-500 hover:bg-emerald-600 transition-colors cursor-pointer"
                />
              </div>

              {/* Minimalist address bar */}
              <div className="flex items-center gap-2 flex-1 max-w-sm mx-auto bg-zinc-950 border border-zinc-800 rounded-md px-3 py-1 text-zinc-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate font-mono text-[11px] text-zinc-300">
                  {campaign.shortUrl}
                </span>
                <button
                  onClick={reloadVideo}
                  className="ml-auto hover:text-white transition-colors"
                  title="Actualiser"
                >
                  <RefreshCw className="w-3 h-3" />
                </button>
              </div>

              <div className="w-16 flex justify-end">
                <span className="text-[11px] font-semibold text-rose-400">HD 720p</span>
              </div>
            </div>

            {/* SCREEN VIEWPORT: Generous Large Height & Prominent Video */}
            <div
              className={`relative w-full bg-zinc-950 flex items-center justify-center overflow-hidden cursor-pointer group transition-all duration-300 ${
                isZoomed
                  ? 'h-[75vh] sm:h-[84vh] min-h-[580px]'
                  : 'h-[62vh] sm:h-[72vh] min-h-[500px]'
              }`}
              onMouseMove={handleMouseMove}
              onClick={togglePlay}
            >
              {/* Blurred Ambient Video Backdrop */}
              <video
                src={campaign.videoUrl}
                muted
                loop
                playsInline
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-40 scale-125 pointer-events-none select-none"
              />

              {/* Main Video Element - Magnified to fill height prominently */}
              <video
                ref={videoRef}
                src={campaign.videoUrl}
                poster={campaign.thumbnailUrl}
                playsInline
                preload="auto"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => {
                  if (!settings.loop) setIsPlaying(false);
                }}
                className={`relative z-10 rounded shadow-2xl transition-all duration-300 ${
                  settings.fitMode === 'cover'
                    ? 'w-full h-full object-cover'
                    : 'h-full w-auto max-w-full object-contain'
                }`}
              >
                <source src={campaign.videoUrl} type="video/mp4" />
                {campaign.videoUrlFallback && (
                  <source src={campaign.videoUrlFallback} type="video/mp4" />
                )}
              </video>

              {/* Unmute Prompt Button */}
              {needsSoundInteraction && settings.isMuted && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMute();
                  }}
                  className="absolute top-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 backdrop-blur-md text-white rounded-full shadow-2xl border border-rose-400/40 text-xs font-semibold animate-bounce cursor-pointer transition-transform hover:scale-105"
                >
                  <Volume2 className="w-4 h-4 text-white animate-pulse" />
                  <span>Activer le son</span>
                </div>
              )}

              {/* Center Play/Pause Overlay */}
              {(!isPlaying || showControls) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay();
                  }}
                  className={`absolute z-20 w-16 h-16 rounded-full flex items-center justify-center transition-all transform duration-200 ${
                    !isPlaying
                      ? 'bg-rose-600 text-white scale-110 shadow-2xl shadow-rose-900/60 ring-4 ring-rose-500/30'
                      : 'bg-black/40 backdrop-blur-md text-white/80 opacity-0 group-hover:opacity-100 hover:bg-black/60'
                  }`}
                  aria-label={isPlaying ? 'Pause' : 'Lecture'}
                >
                  {isPlaying ? (
                    <Pause className="w-7 h-7" />
                  ) : (
                    <Play className="w-7 h-7 translate-x-0.5 fill-current" />
                  )}
                </button>
              )}

              {/* Discreet Side Action Buttons */}
              <div
                className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2.5 transition-opacity duration-300 pointer-events-auto ${
                  showControls ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={handleLikeClick}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-full backdrop-blur-md transition-all ${
                    hasLiked
                      ? 'bg-rose-600 text-white'
                      : 'bg-black/60 hover:bg-black/80 text-zinc-200'
                  }`}
                  title="J'aime"
                >
                  <Heart className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} />
                  <span className="text-[10px] font-semibold mt-0.5">{likes}</span>
                </button>

                <button
                  onClick={handleShareClick}
                  className="flex flex-col items-center justify-center p-2.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-zinc-200 transition-all"
                  title="Partager"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Toast */}
              {showCopiedToast && (
                <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-700 text-white text-xs rounded-md shadow-2xl">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Lien copié !</span>
                </div>
              )}

              {/* Clean Bottom Controls Bar */}
              <div
                className={`absolute bottom-0 inset-x-0 z-20 px-4 py-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 pointer-events-auto ${
                  showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Scrubber */}
                <div className="relative w-full group/seek mb-2">
                  <div
                    className="absolute top-1/2 -translate-y-1/2 left-0 h-1 bg-zinc-600/50 rounded-full pointer-events-none"
                    style={{ width: `${buffered}%` }}
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 left-0 h-1 bg-rose-500 rounded-full pointer-events-none"
                    style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                  />
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    step={0.1}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1.5 appearance-none bg-zinc-700/60 rounded-full cursor-pointer accent-rose-500 hover:h-2 transition-all focus:outline-none"
                    aria-label="Position"
                  />
                </div>

                {/* Controls row */}
                <div className="flex items-center justify-between text-xs text-white">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={togglePlay}
                      className="p-1 hover:text-rose-400 transition-colors"
                      title={isPlaying ? 'Pause' : 'Lecture'}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                    </button>

                    <button
                      onClick={reloadVideo}
                      className="p-1 hover:text-zinc-300 transition-colors"
                      title="Recommencer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={toggleMute}
                        className="p-1 hover:text-rose-400 transition-colors"
                        title={settings.isMuted ? 'Activer le son' : 'Couper le son'}
                      >
                        {settings.isMuted || settings.volume === 0 ? (
                          <VolumeX className="w-4 h-4 text-rose-400" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </button>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={settings.isMuted ? 0 : settings.volume}
                        onChange={handleVolumeChange}
                        className="w-14 sm:w-20 h-1 appearance-none bg-zinc-700 rounded-full cursor-pointer accent-rose-500 focus:outline-none"
                        aria-label="Volume"
                      />
                    </div>

                    <div className="text-[11px] font-mono text-zinc-300">
                      <span>{formatTime(currentTime)}</span>
                      <span className="text-zinc-500 mx-1">/</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Speed menu */}
                    <div className="relative">
                      <button
                        onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                        className="px-2 py-0.5 rounded bg-zinc-800/80 hover:bg-zinc-700 text-[11px] font-medium transition-colors"
                      >
                        {settings.playbackSpeed}x
                      </button>
                      {showSpeedMenu && (
                        <div className="absolute bottom-8 right-0 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl p-1 z-40 flex flex-col gap-0.5 min-w-[70px]">
                          {[0.5, 0.75, 1, 1.25, 1.5, 2].map((s) => (
                            <button
                              key={s}
                              onClick={() => handleSpeedSelect(s)}
                              className={`px-2 py-1 text-left text-xs rounded hover:bg-zinc-800 ${
                                settings.playbackSpeed === s
                                  ? 'text-rose-400 font-bold bg-zinc-800'
                                  : 'text-zinc-300'
                              }`}
                            >
                              {s}x
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Loop */}
                    <button
                      onClick={() => onUpdateSettings({ loop: !settings.loop })}
                      className={`p-1.5 rounded transition-colors ${
                        settings.loop ? 'text-rose-400 bg-rose-500/10' : 'text-zinc-400 hover:text-white'
                      }`}
                      title={settings.loop ? 'Boucle active' : 'Boucle désactivée'}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>

                    {/* Fit mode */}
                    <button
                      onClick={() =>
                        onUpdateSettings({
                          fitMode: settings.fitMode === 'contain' ? 'cover' : 'contain',
                        })
                      }
                      className={`p-1.5 rounded transition-colors ${
                        settings.fitMode === 'cover' ? 'text-rose-400 bg-rose-500/10' : 'text-zinc-400 hover:text-white'
                      }`}
                      title={settings.fitMode === 'cover' ? 'Plein écran cadre' : 'Centré natif'}
                    >
                      <Layers className="w-3.5 h-3.5" />
                    </button>

                    {/* Picture in picture */}
                    {document.pictureInPictureEnabled && (
                      <button
                        onClick={togglePiP}
                        className="p-1.5 text-zinc-400 hover:text-white transition-colors"
                        title="Mini-lecteur"
                      >
                        <PictureInPicture2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Fullscreen */}
                    <button
                      onClick={toggleMockupFullscreen}
                      className="p-1.5 text-zinc-400 hover:text-white transition-colors"
                      title="Plein écran"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Physical Stand */}
        {style === 'desktop' && (
          <div className="flex flex-col items-center w-full">
            <div className="w-28 h-12 bg-gradient-to-b from-zinc-800 via-zinc-700 to-zinc-800 border-x border-zinc-700 shadow-inner" />
            <div className="w-64 h-3.5 bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900 rounded-b-xl border border-zinc-700 shadow-2xl" />
            <div className="w-96 h-3 bg-black/60 blur-md -mt-1 rounded-full" />
          </div>
        )}

        {style === 'laptop' && (
          <div className="w-full flex flex-col items-center">
            <div className="w-[104%] -mt-1 bg-gradient-to-b from-zinc-800 via-zinc-900 to-zinc-950 p-3 rounded-b-2xl border-x border-b border-zinc-700 shadow-2xl">
              <div className="w-20 h-1.5 mx-auto bg-zinc-950 rounded-full mb-2 border border-zinc-800" />
              <div className="w-full bg-zinc-950/80 p-2 rounded-lg border border-zinc-800/80 mb-2">
                <div className="grid grid-cols-12 gap-1 mb-1">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={`fn-${i}`} className="h-2 rounded bg-zinc-900 border border-zinc-800" />
                  ))}
                </div>
                <div className="grid grid-cols-12 gap-1 mb-1">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={`r1-${i}`} className="h-2.5 rounded bg-zinc-900 border border-zinc-800" />
                  ))}
                </div>
                <div className="flex gap-1 justify-center">
                  <div className="w-10 h-2.5 rounded bg-zinc-900 border border-zinc-800" />
                  <div className="w-36 h-2.5 rounded bg-zinc-900 border border-zinc-800" />
                  <div className="w-10 h-2.5 rounded bg-zinc-900 border border-zinc-800" />
                </div>
              </div>
              <div className="w-40 h-8 mx-auto bg-zinc-900/90 rounded-md border border-zinc-800/90 shadow-inner" />
            </div>
            <div className="w-[102%] h-4 bg-black/70 blur-md -mt-1 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
};
