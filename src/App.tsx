import React, { useState } from 'react';
import {
  Film,
  Code2,
  X,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { DEFAULT_CAMPAIGN } from './data/campaign';
import { CampaignData, ComputerStyle, PlayerSettings } from './types';
import { ComputerMockup } from './components/ComputerMockup';
import { EmbedCodeGenerator } from './components/EmbedCodeGenerator';

export default function App() {
  const [campaign, setCampaign] = useState<CampaignData>(DEFAULT_CAMPAIGN);
  const [computerStyle, setComputerStyle] = useState<ComputerStyle>('desktop');
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState<boolean>(false);

  const [playerSettings, setPlayerSettings] = useState<PlayerSettings>({
    autoPlay: true,
    isMuted: false, // User requested play exactly as it should, with sound ready
    loop: true,
    volume: 0.9,
    ambientLight: true,
    fitMode: 'contain',
    playbackSpeed: 1,
  });

  const handleUpdateSettings = (partial: Partial<PlayerSettings>) => {
    setPlayerSettings((prev) => ({ ...prev, ...partial }));
  };

  // If embedded in external iframe (?embed=true), render purely the computer mockup
  const isEmbedMode =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('embed') === 'true';

  if (isEmbedMode) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-2 sm:p-4">
        <ComputerMockup
          campaign={campaign}
          style={computerStyle}
          onStyleChange={setComputerStyle}
          settings={playerSettings}
          onUpdateSettings={handleUpdateSettings}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between selection:bg-rose-500 selection:text-white">
      {/* Background radial atmosphere */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1100px] h-[600px] bg-gradient-to-b from-rose-950/20 via-purple-950/10 to-transparent blur-3xl opacity-60" />
      </div>

      {/* ULTRA-MINIMAL TOP BAR */}
      <header className="w-full border-b border-zinc-800/60 bg-zinc-950/90 backdrop-blur-md px-4 sm:px-8 py-3 flex items-center justify-between">
        {/* Brand & Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-600 to-amber-500 flex items-center justify-center shadow-md shadow-rose-950/40">
            <Film className="w-4 h-4 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-tight text-white">
              {campaign.title}
            </span>
            <span className="text-zinc-600 hidden sm:inline">·</span>
            <span className="text-[11px] text-zinc-400 hidden sm:inline">
              Spot Vidéo
            </span>
          </div>
        </div>

        {/* Quick Clean Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() =>
              handleUpdateSettings({ isMuted: !playerSettings.isMuted })
            }
            className={`p-2 rounded-lg border transition-all text-xs flex items-center gap-1.5 ${
              !playerSettings.isMuted
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
            title={playerSettings.isMuted ? 'Activer le son' : 'Couper le son'}
          >
            {playerSettings.isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4 text-rose-400" />
            )}
            <span className="hidden sm:inline font-medium">
              {playerSettings.isMuted ? 'Son coupé' : 'Son actif'}
            </span>
          </button>

          <button
            onClick={() => setIsEmbedModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white px-3.5 py-2 rounded-lg shadow-md shadow-rose-950/50 transition-all hover:scale-[1.02]"
          >
            <Code2 className="w-4 h-4" />
            <span>Code pour mon site</span>
          </button>
        </div>
      </header>

      {/* MAIN VIEWPORT: THE ENLARGED COMPUTER SCREEN (Clean, zero text clutter) */}
      <main className="flex-1 w-full flex items-center justify-center py-4 sm:py-6">
        <ComputerMockup
          campaign={campaign}
          style={computerStyle}
          onStyleChange={setComputerStyle}
          settings={playerSettings}
          onUpdateSettings={handleUpdateSettings}
        />
      </main>

      {/* DISCREET ULTRA-MINIMAL FOOTER */}
      <footer className="w-full py-2.5 px-4 text-center border-t border-zinc-900/60 text-[11px] text-zinc-600">
        <span>{campaign.title} · {campaign.shortUrl}</span>
      </footer>

      {/* CLEAN MODAL FOR EMBED CODE (Opened on demand, keeps main screen clean) */}
      {isEmbedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-4 sm:p-6">
            <button
              onClick={() => setIsEmbedModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors z-10"
              title="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
            <EmbedCodeGenerator campaign={campaign} />
          </div>
        </div>
      )}
    </div>
  );
}
