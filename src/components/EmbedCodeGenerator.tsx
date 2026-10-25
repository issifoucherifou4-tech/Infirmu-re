import React, { useState } from 'react';
import {
  Code2,
  Copy,
  Check,
  Globe,
  Sliders,
  Laptop,
  Video,
  FileCode,
  Layers,
  Sparkles,
} from 'lucide-react';
import { CampaignData } from '../types';

interface EmbedCodeGeneratorProps {
  campaign: CampaignData;
}

export const EmbedCodeGenerator: React.FC<EmbedCodeGeneratorProps> = ({ campaign }) => {
  const [activeTab, setActiveTab] = useState<'computer' | 'html5' | 'react' | 'banner'>('computer');
  const [copied, setCopied] = useState(false);

  // Embed options
  const [autoplay, setAutoplay] = useState(true);
  const [muted, setMuted] = useState(true);
  const [loop, setLoop] = useState(true);
  const [controls, setControls] = useState(true);
  const [responsive, setResponsive] = useState(true);
  const [showAmbilight, setShowAmbilight] = useState(true);

  // Generate code according to tab and options
  const getEmbedCode = () => {
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://mon-site.com';
    const embedUrl = `${currentOrigin}?embed=true&url=${encodeURIComponent(campaign.shortUrl)}`;

    if (activeTab === 'computer') {
      return `<!-- VisionAd : Lecteur Publicitaire sous forme Ordinateur -->
<div style="max-width: 900px; margin: 0 auto; padding: 20px 10px; font-family: system-ui, -apple-system, sans-serif;">
  <div style="background: #09090b; border: 1px solid #27272a; border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.7); overflow: hidden;">
    <!-- Barre de navigateur d'ordinateur -->
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; background: #18181b; border-bottom: 1px solid #27272a;">
      <div style="display: flex; gap: 6px;">
        <span style="width: 10px; height: 10px; border-radius: 50%; background: #ef4444; display: inline-block;"></span>
        <span style="width: 10px; height: 10px; border-radius: 50%; background: #f59e0b; display: inline-block;"></span>
        <span style="width: 10px; height: 10px; border-radius: 50%; background: #10b981; display: inline-block;"></span>
      </div>
      <div style="font-size: 11px; color: #a1a1aa; font-family: monospace; background: #09090b; padding: 4px 12px; border-radius: 6px; border: 1px solid #27272a;">
        🔒 ${campaign.shortUrl}
      </div>
      <div style="font-size: 11px; color: #f43f5e; font-weight: 600;">Publicité</div>
    </div>
    
    <!-- Conteneur Vidéo -->
    <div style="position: relative; width: 100%; aspect-ratio: 16/9; background: #000; display: flex; align-items: center; justify-content: center; overflow: hidden;">
      <video
        src="${campaign.videoUrl}"
        poster="${campaign.thumbnailUrl}"
        ${autoplay ? 'autoplay' : ''}
        ${muted ? 'muted' : ''}
        ${loop ? 'loop' : ''}
        ${controls ? 'controls' : ''}
        playsinline
        style="max-height: 100%; max-width: 100%; object-fit: contain;"
      >
        <source src="${campaign.videoUrl}" type="video/mp4" />
      </video>
    </div>
  </div>
  <!-- Pied d'ordinateur de bureau -->
  <div style="width: 100px; height: 35px; background: #27272a; margin: 0 auto; border-left: 1px solid #3f3f46; border-right: 1px solid #3f3f46;"></div>
  <div style="width: 220px; height: 10px; background: #3f3f46; margin: 0 auto; border-radius: 0 0 10px 10px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.5);"></div>
</div>`;
    }

    if (activeTab === 'html5') {
      return `<!-- VisionAd : Lecteur Vidéo HTML5 Standard -->
<div class="ad-video-container" style="max-width: 640px; margin: 0 auto; position: relative;">
  <video
    id="ad-video-${campaign.id}"
    width="100%"
    height="auto"
    poster="${campaign.thumbnailUrl}"
    ${autoplay ? 'autoplay' : ''}
    ${muted ? 'muted' : ''}
    ${loop ? 'loop' : ''}
    ${controls ? 'controls' : ''}
    playsinline
    preload="metadata"
    style="border-radius: 12px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4); display: block;"
  >
    <source src="${campaign.videoUrl}" type="video/mp4" />
    Votre navigateur ne prend pas en charge la vidéo.
  </video>
  <div style="margin-top: 8px; font-size: 12px; color: #71717a; text-align: right;">
    Annonce par <a href="${campaign.originalUrl}" target="_blank" style="color: #e11d48; text-decoration: none;">${campaign.author}</a>
  </div>
</div>`;
    }

    if (activeTab === 'react') {
      return `import React from 'react';

export const AdVideoPlayer: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 bg-zinc-950 rounded-2xl border border-zinc-800 shadow-2xl">
      {/* Barre Ordinateur */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-xs text-zinc-400">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
        </div>
        <span className="font-mono bg-zinc-900 px-3 py-1 rounded text-zinc-300 border border-zinc-800">
          ${campaign.shortUrl}
        </span>
        <span className="text-rose-500 font-semibold">Annonce Vidéo</span>
      </div>

      {/* Lecteur Vidéo */}
      <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden mt-3 rounded-lg">
        <video
          src="${campaign.videoUrl}"
          poster="${campaign.thumbnailUrl}"
          autoPlay={${autoplay}}
          muted={${muted}}
          loop={${loop}}
          controls={${controls}}
          playsInline
          className="max-h-full max-w-full object-contain"
        />
      </div>
    </div>
  );
};

export default AdVideoPlayer;`;
    }

    // Banner link with video preview
    return `<!-- VisionAd : Bannière Publicitaire Cliquable avec Vidéo -->
<a href="${campaign.originalUrl}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; display: block; max-width: 480px; margin: 0 auto; background: #09090b; border: 1px solid #27272a; border-radius: 12px; overflow: hidden; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
  <div style="position: relative; width: 100%; aspect-ratio: 9/16; max-height: 500px; background: #000; overflow: hidden;">
    <video
      src="${campaign.videoUrl}"
      autoplay
      muted
      loop
      playsinline
      style="width: 100%; height: 100%; object-fit: cover;"
    ></video>
    <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 16px; background: linear-gradient(to top, rgba(0,0,0,0.9), transparent); color: #fff;">
      <span style="display: inline-block; font-size: 10px; background: #e11d48; padding: 2px 8px; border-radius: 4px; font-weight: bold; text-transform: uppercase;">Sponsorisé</span>
      <h4 style="margin: 6px 0 0; font-size: 16px; font-weight: 600;">${campaign.title}</h4>
      <p style="margin: 4px 0 0; font-size: 12px; color: #d4d4d8;">${campaign.author}</p>
    </div>
  </div>
</a>`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getEmbedCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="w-full bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md">
      {/* Title & Description */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-rose-500" />
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Code d’Intégration pour Votre Site Web
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Copiez ce code prêt à l'emploi et collez-le dans le code source de votre site web, WordPress, Shopify, ou Webflow.
          </p>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            copied
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
              : 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/40'
          }`}
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Code copié avec succès !' : 'Copier le code'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-800 pb-3 mb-4">
        <button
          onClick={() => setActiveTab('computer')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            activeTab === 'computer'
              ? 'bg-zinc-800 text-white border border-zinc-700'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
          }`}
        >
          <Laptop className="w-4 h-4 text-rose-400" />
          <span>Format Ordinateur Complet (Recommandé)</span>
        </button>
        <button
          onClick={() => setActiveTab('html5')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            activeTab === 'html5'
              ? 'bg-zinc-800 text-white border border-zinc-700'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
          }`}
        >
          <Video className="w-4 h-4 text-blue-400" />
          <span>HTML5 Pur (Universel)</span>
        </button>
        <button
          onClick={() => setActiveTab('react')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            activeTab === 'react'
              ? 'bg-zinc-800 text-white border border-zinc-700'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
          }`}
        >
          <FileCode className="w-4 h-4 text-emerald-400" />
          <span>React / Tailwind Component</span>
        </button>
        <button
          onClick={() => setActiveTab('banner')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            activeTab === 'banner'
              ? 'bg-zinc-800 text-white border border-zinc-700'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
          }`}
        >
          <Layers className="w-4 h-4 text-purple-400" />
          <span>Bannière Publicitaire Cliquable</span>
        </button>
      </div>

      {/* Options Bar */}
      <div className="flex flex-wrap items-center gap-4 py-2 px-3 bg-zinc-950/70 rounded-lg border border-zinc-800/80 mb-4 text-xs">
        <span className="text-zinc-400 font-medium flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5" /> Options du code :
        </span>
        <label className="flex items-center gap-1.5 text-zinc-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={autoplay}
            onChange={(e) => setAutoplay(e.target.checked)}
            className="rounded bg-zinc-800 border-zinc-700 text-rose-500 focus:ring-0"
          />
          <span>Lecture automatique (Autoplay)</span>
        </label>
        <label className="flex items-center gap-1.5 text-zinc-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={muted}
            onChange={(e) => setMuted(e.target.checked)}
            className="rounded bg-zinc-800 border-zinc-700 text-rose-500 focus:ring-0"
          />
          <span>Muet initial (requis pour autoplay web)</span>
        </label>
        <label className="flex items-center gap-1.5 text-zinc-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={loop}
            onChange={(e) => setLoop(e.target.checked)}
            className="rounded bg-zinc-800 border-zinc-700 text-rose-500 focus:ring-0"
          />
          <span>Boucle infinie</span>
        </label>
        <label className="flex items-center gap-1.5 text-zinc-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={controls}
            onChange={(e) => setControls(e.target.checked)}
            className="rounded bg-zinc-800 border-zinc-700 text-rose-500 focus:ring-0"
          />
          <span>Contrôles vidéo</span>
        </label>
      </div>

      {/* Code Display Area */}
      <div className="relative">
        <pre className="w-full bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-[11px] sm:text-xs text-zinc-300 font-mono overflow-x-auto max-h-72 leading-relaxed">
          <code>{getEmbedCode()}</code>
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-md border border-zinc-700 text-xs flex items-center gap-1 transition-colors"
          title="Copier le code"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copié' : 'Copier'}</span>
        </button>
      </div>

      {/* Quick Integration Guidance */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-zinc-400">
        <div className="p-3 bg-zinc-950/50 rounded-lg border border-zinc-800/60">
          <div className="font-semibold text-zinc-200 mb-1">1. Copiez le code</div>
          <span>Cliquez sur le bouton « Copier le code » en haut à droite.</span>
        </div>
        <div className="p-3 bg-zinc-950/50 rounded-lg border border-zinc-800/60">
          <div className="font-semibold text-zinc-200 mb-1">2. Collez sur votre site</div>
          <span>Insérez-le dans un bloc HTML personnalisé ou dans le fichier de votre page.</span>
        </div>
        <div className="p-3 bg-zinc-950/50 rounded-lg border border-zinc-800/60">
          <div className="font-semibold text-zinc-200 mb-1">3. Diffusion instantanée</div>
          <span>La vidéo se lance dans son superbe cadre ordinateur sans configuration requise.</span>
        </div>
      </div>
    </div>
  );
};
