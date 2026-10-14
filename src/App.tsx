import React, { useState } from 'react';
import {
  Smartphone,
  Code2,
  Columns,
  Sparkles,
  BookOpen,
  Volume2,
  VolumeX,
  Download,
  Flame,
  Palette
} from 'lucide-react';
import { AndroidSimulator } from './components/AndroidSimulator';
import { CodeExplorer } from './components/CodeExplorer';
import { HAFEZ_JSON_STRING } from './data/hafezData';
import { persianAmbience } from './audio/persianAmbience';

type ViewMode = 'split' | 'simulator' | 'code';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [fontChoice, setFontChoice] = useState<'vazir' | 'amiri'>('vazir');
  const [themePreset, setThemePreset] = useState<'navy_gold' | 'shiraz_night'>('navy_gold');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const toggleNeyAudio = () => {
    const active = persianAmbience.toggle();
    setIsPlayingAudio(active);
  };

  const handleDownloadHafezJson = () => {
    const blob = new Blob([HAFEZ_JSON_STRING], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hafez.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#060A12] text-slate-100 flex flex-col font-vazir antialiased">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#09111D]/95 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand Lockup */}
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-amber-400/40 shadow-md shadow-amber-500/10">
            <img
              src="/src/assets/images/tazhib_ornament_gold_1791116559633.jpg"
              alt="Hafez Tazhib Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base md:text-lg font-bold text-amber-200">
                فال حافظ • Android Compose Studio
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono bg-teal-500/15 border border-teal-500/30 text-teal-300">
                Kotlin 2.0 • MVVM • Offline
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden md:block">
              طراحی و توسعه اپلیکیشن تفأل به حافظ با معماری تمیز اندروید و جت‌پک کامپوز
            </p>
          </div>
        </div>

        {/* Center / Right Controls */}
        <div className="flex items-center gap-2">
          {/* Audio Synthesizer Toggle */}
          <button
            onClick={toggleNeyAudio}
            className={`p-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors ${
              isPlayingAudio
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-700/60'
            }`}
            title={isPlayingAudio ? 'قطع نوای سنتی نی' : 'پخش نوای نی عرفانی (Dastgah Shur)'}
          >
            {isPlayingAudio ? (
              <>
                <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="text-[11px] hidden sm:inline">نوای نی در حال پخش</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-400" />
                <span className="text-[11px] hidden sm:inline">نوای نی</span>
              </>
            )}
          </button>

          {/* Font Toggle */}
          <div className="hidden lg:flex items-center bg-slate-900/80 border border-slate-700/60 rounded-xl p-1 text-xs">
            <button
              onClick={() => setFontChoice('vazir')}
              className={`px-2.5 py-1 rounded-lg transition-colors font-vazir ${
                fontChoice === 'vazir' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-slate-400'
              }`}
            >
              قلم وزیرمتن
            </button>
            <button
              onClick={() => setFontChoice('amiri')}
              className={`px-2.5 py-1 rounded-lg transition-colors font-amiri ${
                fontChoice === 'amiri' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-slate-400'
              }`}
            >
              قلم امیری (نستعلیق)
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-900/80 border border-slate-700/60 rounded-xl p-1 text-xs">
            <button
              onClick={() => setViewMode('split')}
              className={`p-1.5 md:px-2.5 md:py-1 rounded-lg flex items-center gap-1 transition-colors ${
                viewMode === 'split' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-slate-400'
              }`}
              title="نمای دوتایی همزمان"
            >
              <Columns className="w-4 h-4" />
              <span className="hidden md:inline">نمای دوتایی</span>
            </button>
            <button
              onClick={() => setViewMode('simulator')}
              className={`p-1.5 md:px-2.5 md:py-1 rounded-lg flex items-center gap-1 transition-colors ${
                viewMode === 'simulator' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-slate-400'
              }`}
              title="شبیه‌ساز موبایل"
            >
              <Smartphone className="w-4 h-4" />
              <span className="hidden md:inline">موبایل</span>
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`p-1.5 md:px-2.5 md:py-1 rounded-lg flex items-center gap-1 transition-colors ${
                viewMode === 'code' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-slate-400'
              }`}
              title="استودیو کد کاتلین"
            >
              <Code2 className="w-4 h-4" />
              <span className="hidden md:inline">کدها</span>
            </button>
          </div>

          {/* Quick Download JSON Button */}
          <button
            onClick={handleDownloadHafezJson}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-teal-600/20 hover:bg-teal-600/30 border border-teal-500/40 text-teal-300 text-xs font-medium rounded-xl transition-colors"
            title="دانلود فایل دیتابیس hafez.json برای assets پروژه"
          >
            <Download className="w-3.5 h-3.5" />
            <span>دانلود hafez.json</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-2 md:p-4 max-w-[1720px] w-full mx-auto flex flex-col min-h-0">
        {viewMode === 'split' && (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
            {/* Left/Middle Column on RTL: Android Device Simulator (5 cols) */}
            <div className="lg:col-span-5 flex items-center justify-center min-h-[700px] overflow-hidden bg-[#0A121E]/60 rounded-2xl border border-slate-800/80 p-2">
              <AndroidSimulator
                fontChoice={fontChoice}
                themePreset={themePreset}
              />
            </div>

            {/* Right Column on RTL: Kotlin Code & Architecture Explorer (7 cols) */}
            <div className="lg:col-span-7 flex flex-col min-h-[700px] overflow-hidden">
              <CodeExplorer />
            </div>
          </div>
        )}

        {viewMode === 'simulator' && (
          <div className="flex-1 flex items-center justify-center p-4">
            <AndroidSimulator
              fontChoice={fontChoice}
              themePreset={themePreset}
            />
          </div>
        )}

        {viewMode === 'code' && (
          <div className="flex-1 flex flex-col h-[85vh]">
            <CodeExplorer />
          </div>
        )}
      </main>

      {/* Subtle Footer Bar */}
      <footer className="bg-[#070C15] border-t border-slate-800/80 px-4 py-2.5 text-center text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span>فال حافظ (Fal-e Hafez) • معماری مدرن اندروید بر پایه Kotlin و Jetpack Compose</span>
          <span className="text-slate-600">•</span>
          <span className="text-amber-400/80">پوشش کامل گام‌های ۱ تا ۵ درخواستی</span>
        </div>
        <div className="text-slate-500 font-mono text-[11px]">
          100% Offline • Moshi / Gson Ready • Material 3 RTL
        </div>
      </footer>
    </div>
  );
}
