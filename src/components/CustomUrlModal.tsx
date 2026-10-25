import React, { useState } from 'react';
import { X, Link2, AlertCircle, CheckCircle2, Video } from 'lucide-react';
import { CampaignData } from '../types';

interface CustomUrlModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCampaign: CampaignData;
  onUpdateCampaign: (updated: Partial<CampaignData>) => void;
}

export const CustomUrlModal: React.FC<CustomUrlModalProps> = ({
  isOpen,
  onClose,
  currentCampaign,
  onUpdateCampaign,
}) => {
  const [urlInput, setUrlInput] = useState(currentCampaign.shortUrl);
  const [titleInput, setTitleInput] = useState(currentCampaign.title);
  const [directVideoInput, setDirectVideoInput] = useState(currentCampaign.videoUrl);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directVideoInput.trim()) {
      setError('Veuillez fournir une URL de vidéo MP4 valide.');
      return;
    }

    onUpdateCampaign({
      title: titleInput.trim() || 'Spot Publicitaire',
      shortUrl: urlInput.trim() || currentCampaign.shortUrl,
      videoUrl: directVideoInput.trim(),
    });

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1200);
  };

  const handleResetToDefault = () => {
    setUrlInput('https://pin.it/7w8K3yQJf');
    setTitleInput('Le Destin d’Emma');
    setDirectVideoInput('https://v1.pinimg.com/videos/iht/expMp4/1f/df/11/1fdf115c49eb7ce2b824c5f49820ba61_720w.mp4');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-700/80 rounded-2xl p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <Link2 className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">
            Configurer la Publicité Vidéo
          </h3>
        </div>
        <p className="text-xs text-zinc-400 mb-5">
          Modifiez le lien de la campagne ou renseignez une autre source vidéo MP4 pour l'afficher dans l'ordinateur.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-950/50 border border-red-500/40 rounded-xl flex items-center gap-2 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-emerald-950/50 border border-emerald-500/40 rounded-xl flex items-center gap-2 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Publicité mise à jour avec succès !</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Titre du spot publicitaire
            </label>
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-rose-500"
              placeholder="Ex: Le Destin d’Emma"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Lien publicitaire / URL raccourcie
            </label>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-rose-500"
              placeholder="https://pin.it/7w8K3yQJf"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              URL directe du fichier vidéo (.mp4)
            </label>
            <input
              type="text"
              value={directVideoInput}
              onChange={(e) => setDirectVideoInput(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-rose-500 font-mono"
              placeholder="https://v1.pinimg.com/videos/...mp4"
            />
            <p className="text-[11px] text-zinc-500 mt-1">
              Ce flux est lu directement par le lecteur HTML5 dans l'écran d'ordinateur.
            </p>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="px-3 py-2 text-xs text-zinc-400 hover:text-white transition-colors"
            >
              Rétablir l'annonce par défaut
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-lg shadow-lg shadow-rose-900/40 transition-colors"
              >
                Appliquer la publicité
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
