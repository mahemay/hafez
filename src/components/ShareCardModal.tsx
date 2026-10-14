import React, { useState } from 'react';
import { X, Copy, Check, Share2 } from 'lucide-react';
import { HafezPoem } from '../data/hafezData';

interface ShareCardModalProps {
  poem: HafezPoem;
  onClose: () => void;
}

export const ShareCardModal: React.FC<ShareCardModalProps> = ({ poem, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyText = async () => {
    const fullText = `فال حافظ - ${poem.title}

${poem.poem}

✦ تعبیر و پیام فال:
${poem.tafsir}

✦ پند حکیمانه:
${poem.advice}`;

    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0A1320] border border-amber-500/40 rounded-2xl p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 text-slate-400 hover:text-amber-300 rounded-full hover:bg-slate-800/60 transition-colors"
          title="بستن"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6 pt-2">
          <span className="text-xs text-amber-400/80 tracking-widest block mb-1">
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </span>
          <h3 className="text-xl font-bold font-amiri text-amber-200">
            کارت اشتراک فال حافظ
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            آماده برای اشتراک‌گذاری در شبکه‌های اجتماعی و پیام‌رسان‌ها
          </p>
        </div>

        {/* Shareable Card Frame (Tazhib Aesthetic) */}
        <div className="relative p-6 bg-gradient-to-b from-[#0D1D30] to-[#08111D] border-2 border-amber-500/50 rounded-xl shadow-inner my-2">
          {/* Ornate corner accents */}
          <div className="absolute top-2 right-2 text-amber-400/60 text-xs">✤</div>
          <div className="absolute top-2 left-2 text-amber-400/60 text-xs">✤</div>
          <div className="absolute bottom-2 right-2 text-amber-400/60 text-xs">✤</div>
          <div className="absolute bottom-2 left-2 text-amber-400/60 text-xs">✤</div>

          <div className="text-center mb-4">
            <span className="inline-block px-3 py-1 bg-amber-500/10 border border-amber-400/30 rounded-full text-xs text-amber-300 font-medium">
              غزل شماره {poem.ghazal_number}
            </span>
          </div>

          {/* Verses Preview (First 2 Couplets) */}
          <div className="space-y-3 text-center my-4 font-amiri text-base md:text-lg leading-relaxed text-amber-50">
            {poem.verses.slice(0, 3).map((verse, idx) => (
              <div key={idx} className="border-b border-amber-500/15 pb-2.5">
                <p>{verse.mesra1}</p>
                <p className="mt-1">{verse.mesra2}</p>
              </div>
            ))}
          </div>

          {/* Tafsir Summary */}
          <div className="mt-5 pt-3 border-t border-amber-500/30 bg-teal-950/20 p-3.5 rounded-lg border border-teal-500/20">
            <h4 className="text-xs font-bold text-teal-300 mb-1.5 flex items-center gap-1.5">
              <span>✦</span> تعبیر فال شما:
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed text-justify">
              {poem.tafsir}
            </p>
          </div>

          <div className="mt-4 text-center">
            <span className="text-[11px] text-amber-300/70 font-amiri">
              دیوان خواجه شمس‌الدین محمد حافظ شیرازی
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={handleCopyText}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 text-sm shadow-lg shadow-amber-500/20 transition-all active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-950" />
                <span>متن کپی شد!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-950" />
                <span>کپی متن فال و تعبیر</span>
              </>
            )}
          </button>

          <button
            onClick={handleCopyText}
            className="py-3 px-4 bg-[#142436] hover:bg-[#1A3048] border border-teal-500/40 text-teal-300 font-medium rounded-xl flex items-center gap-2 text-sm transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>اشتراک‌گذاری</span>
          </button>
        </div>
      </div>
    </div>
  );
};
