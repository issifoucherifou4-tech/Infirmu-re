import React, { useState } from 'react';
import {
  Sparkles,
  ExternalLink,
  Film,
  Activity,
  Layers,
  Clock,
  HardDrive,
  Eye,
  MousePointerClick,
  Share2,
  TrendingUp,
  Tag,
  Copy,
  Check,
  Award,
  Video,
} from 'lucide-react';
import { CampaignData } from '../types';

interface CampaignDetailsProps {
  campaign: CampaignData;
  onOpenCustomUrlModal: () => void;
}

export const CampaignDetails: React.FC<CampaignDetailsProps> = ({
  campaign,
  onOpenCustomUrlModal,
}) => {
  const [copiedTag, setCopiedTag] = useState<string | null>(null);

  const handleCopyTag = (tag: string) => {
    navigator.clipboard.writeText(tag);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 1500);
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Campaign Story & Presentation (2 cols) */}
      <div className="lg:col-span-2 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 shadow-xl backdrop-blur-md flex flex-col justify-between">
        <div>
          {/* Header Tag & Author */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">
                Campagne Publicitaire Officielle
              </span>
              <span className="text-zinc-600">·</span>
              <span className="text-xs text-zinc-400">ID Épingle : {campaign.id}</span>
            </div>

            <button
              onClick={onOpenCustomUrlModal}
              className="text-xs text-zinc-400 hover:text-white border border-zinc-700/80 px-2.5 py-1 rounded-md bg-zinc-800/60 hover:bg-zinc-800 transition-colors"
            >
              Changer d'URL d'annonce
            </button>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
            {campaign.title}
          </h1>

          {/* Subtitle / Creator */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 p-0.5">
              <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center font-bold text-xs text-white">
                K
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold text-zinc-200">
                {campaign.author}
              </div>
              <div className="text-xs text-zinc-400">
                Créateur de contenu & Production Digitale IA
              </div>
            </div>
          </div>

          {/* Narrative Description */}
          <p className="text-sm text-zinc-300 leading-relaxed mb-6">
            {campaign.description} Ce spot vidéo publicitaire a été conçu avec une esthétique cinématographique moderne pour capter l’attention immédiate du spectateur dès les 3 premières secondes. Idéal pour les diffusions sur réseaux sociaux, bannières interactives et sites web vitrines.
          </p>

          {/* Hashtags list */}
          <div className="mb-6">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-2 font-medium">
              <Tag className="w-3.5 h-3.5" />
              <span>Mots-clés & Tags Publicitaires (cliquez pour copier) :</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {campaign.hashtags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleCopyTag(tag)}
                  className={`text-xs px-2.5 py-1 rounded-md border transition-all flex items-center gap-1 ${
                    copiedTag === tag
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                      : 'bg-zinc-950/80 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white'
                  }`}
                  title="Cliquer pour copier le tag"
                >
                  <span>{tag}</span>
                  {copiedTag === tag ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3 text-zinc-500 opacity-60" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
            <span>Flux MP4 haute disponibilité prêt pour intégration</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={campaign.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-lg shadow-md transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Ouvrir sur Pinterest (pin.it/7w8K3yQJf)</span>
            </a>
          </div>
        </div>
      </div>

      {/* Campaign Technical Specs & Metrics Card (1 col) */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 shadow-xl backdrop-blur-md flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <HardDrive className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Spécifications Techniques Vidéo
            </h3>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/70">
              <span className="text-[11px] text-zinc-400 block mb-0.5">Résolution</span>
              <span className="text-sm font-semibold text-zinc-100">
                {campaign.dimensions.width} × {campaign.dimensions.height} px
              </span>
              <span className="text-[10px] text-zinc-500 block">720p Vertical HD</span>
            </div>

            <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/70">
              <span className="text-[11px] text-zinc-400 block mb-0.5">Format / Codec</span>
              <span className="text-sm font-semibold text-zinc-100">
                MP4 (H.264 / AVC)
              </span>
              <span className="text-[10px] text-emerald-400 block">Compatibilité 100%</span>
            </div>

            <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/70">
              <span className="text-[11px] text-zinc-400 block mb-0.5">Taille Fichier</span>
              <span className="text-sm font-semibold text-zinc-100">
                {campaign.specs.filesize}
              </span>
              <span className="text-[10px] text-zinc-500 block">Chargement instantané</span>
            </div>

            <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/70">
              <span className="text-[11px] text-zinc-400 block mb-0.5">Format Audio</span>
              <span className="text-sm font-semibold text-zinc-100">
                AAC Stéréo
              </span>
              <span className="text-[10px] text-zinc-500 block">48 kHz · 128 kbps</span>
            </div>
          </div>

          {/* Campaign Performance Highlight */}
          <div className="p-4 bg-gradient-to-br from-rose-950/40 via-zinc-950 to-zinc-950 rounded-xl border border-rose-900/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-bold text-zinc-200">Performances de la Campagne</span>
              </div>
              <span className="text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full">
                CTR +4.9%
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-zinc-300">
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <Eye className="w-3.5 h-3.5" /> Impressions
                </span>
                <span className="font-semibold font-mono">148 520+</span>
              </div>
              <div className="flex justify-between items-center text-zinc-300">
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <MousePointerClick className="w-3.5 h-3.5" /> Clics générés
                </span>
                <span className="font-semibold font-mono">7 280</span>
              </div>
              <div className="flex justify-between items-center text-zinc-300">
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <Activity className="w-3.5 h-3.5" /> Taux de complétion
                </span>
                <span className="font-semibold font-mono text-emerald-400">78.4%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-800 text-[11px] text-zinc-500 text-center">
          Diffuseur agréé Réseaux Sociaux & Écrans d'Ordinateur
        </div>
      </div>
    </div>
  );
};
