import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Share2,
  Bookmark,
  RefreshCw,
  Sparkles,
  ArrowRight,
  BookOpen,
  Wifi,
  Battery,
  Flame,
  Search,
  CheckCircle2,
  Maximize2,
  Smartphone
} from 'lucide-react';
import { HAFEZ_GHAZALS, HafezPoem } from '../data/hafezData';
import { persianAmbience } from '../audio/persianAmbience';
import { ShareCardModal } from './ShareCardModal';
import { GhazalIndexModal } from './GhazalIndexModal';

type Screen = 'splash' | 'home' | 'niyat' | 'loading' | 'result';

interface AndroidSimulatorProps {
  onStateChangeForCodeViewer?: (stateName: string) => void;
  fontChoice: 'vazir' | 'amiri';
  themePreset: 'navy_gold' | 'shiraz_night';
}

export const AndroidSimulator: React.FC<AndroidSimulatorProps> = ({
  fontChoice,
  themePreset,
}) => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [currentPoem, setCurrentPoem] = useState<HafezPoem>(HAFEZ_GHAZALS[0]);
  const [historyIds, setHistoryIds] = useState<number[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([1, 255]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showIndexModal, setShowIndexModal] = useState(false);
  const [currentTime, setCurrentTime] = useState('۱۲:۰۰');
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Loading animation quote index
  const [loadingQuoteIndex, setLoadingQuoteIndex] = useState(0);

  const loadingQuotes = [
    "در حال گشودن دیوان لسان‌الغیب...",
    "تفأل با نیت پاک به روح پرفتوح خواجه شیراز...",
    "ای هدهد صبا به سبا می‌فرستمت...",
    "شاهدی از غیب در آستانه تجلی است..."
  ];

  // System time updates
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, '0');
      const m = now.getMinutes().toString().padStart(2, '0');
      // Convert to Persian numerals
      const persianDigits = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
      const persianTime = `${h}:${m}`.replace(/[0-9]/g, d => persianDigits[parseInt(d, 10)]);
      setCurrentTime(persianTime);
    };
    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);

  // Non-repeating random selection algorithm (matching Kotlin repository implementation)
  const getRandomFal = () => {
    const historyLimit = 3;
    const availablePool = HAFEZ_GHAZALS.length > historyLimit
      ? HAFEZ_GHAZALS.filter(g => !historyIds.slice(-historyLimit).includes(g.ghazal_number))
      : HAFEZ_GHAZALS;

    const pool = availablePool.length > 0 ? availablePool : HAFEZ_GHAZALS;
    const randomIndex = Math.floor(Math.random() * pool.length);
    const selected = pool[randomIndex];

    setHistoryIds(prev => [...prev.slice(-historyLimit), selected.ghazal_number]);
    return selected;
  };

  const handleStartFal = () => {
    setCurrentScreen('niyat');
  };

  const handleOpenBookAndReveal = () => {
    setCurrentScreen('loading');
    setLoadingQuoteIndex(Math.floor(Math.random() * loadingQuotes.length));

    // Simulate 2.4s opening transition
    setTimeout(() => {
      const selected = getRandomFal();
      setCurrentPoem(selected);
      setCurrentScreen('result');
    }, 2400);
  };

  const handleRepeatFal = () => {
    setCurrentScreen('loading');
    setLoadingQuoteIndex(Math.floor(Math.random() * loadingQuotes.length));
    setTimeout(() => {
      const selected = getRandomFal();
      setCurrentPoem(selected);
      setCurrentScreen('result');
    }, 2000);
  };

  const toggleBookmark = (id: number) => {
    setBookmarkedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleNeyAudio = () => {
    const active = persianAmbience.toggle();
    setIsPlayingAudio(active);
  };

  // Font family helper
  const fontClass = fontChoice === 'amiri' ? 'font-amiri' : 'font-vazir';

  // Palette styling based on themePreset
  const themeBg = themePreset === 'shiraz_night'
    ? 'bg-gradient-to-b from-[#110B22] via-[#0E1528] to-[#070B14]'
    : 'bg-gradient-to-b from-[#080E18] via-[#0D1B2A] to-[#050A12]';

  return (
    <div className={`relative flex items-center justify-center ${isFullScreen ? 'w-full h-full' : 'p-2 md:p-4'}`}>
      {/* Device Bezel Frame */}
      <div
        className={`relative ${
          isFullScreen
            ? 'w-full h-[88vh] rounded-2xl max-w-xl'
            : 'w-[360px] sm:w-[390px] h-[780px] rounded-[48px]'
        } bg-[#050811] p-3 shadow-2xl border-[6px] border-[#1C2C42] ring-1 ring-amber-500/20 flex flex-col overflow-hidden transition-all duration-300`}
      >
        {/* Device Top Speaker & Camera Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2">
          <div className="w-14 h-3.5 bg-black rounded-full flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-[#111] ring-1 ring-slate-800"></div>
          </div>
        </div>

        {/* Screen Container */}
        <div
          className={`relative flex-1 ${
            isFullScreen ? 'rounded-xl' : 'rounded-[38px]'
          } overflow-hidden ${themeBg} text-slate-100 flex flex-col select-none`}
        >
          {/* Android Status Bar */}
          <div className="h-10 px-6 pt-2 flex items-center justify-between text-xs text-slate-300 font-mono z-30 shrink-0">
            <span className="font-semibold text-[13px]">{currentTime}</span>
            <div className="flex items-center gap-2">
              <Wifi className="w-3.5 h-3.5 text-slate-300" />
              <div className="flex items-center gap-1">
                <span className="text-[10px]">۹۲٪</span>
                <Battery className="w-3.5 h-3.5 text-slate-300" />
              </div>
            </div>
          </div>

          {/* SCREEN 1: SPLASH */}
          {currentScreen === 'splash' && (
            <div className="flex-1 flex flex-col items-center justify-between p-6 text-center animate-fadeIn">
              <div className="pt-10">
                <span className="text-xs text-amber-400/80 font-mono tracking-widest">
                  بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                </span>
              </div>

              <div className="flex flex-col items-center">
                <div className="relative w-44 h-44 mb-6 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-amber-500/30 animate-pulse"></div>
                  <img
                    src="/src/assets/images/tazhib_ornament_gold_1791116559633.jpg"
                    alt="Tazhib Persian Ornament"
                    className="w-36 h-36 rounded-full object-cover shadow-2xl border-2 border-amber-400/60"
                  />
                </div>
                <h1 className="text-2xl font-bold font-amiri text-amber-200">
                  فال دیوان حافظ
                </h1>
                <p className="text-xs text-teal-300/80 mt-1 font-vazir">
                  تفأل به لسان‌الغیب شیرازی
                </p>
                <span className="text-[11px] text-slate-400 mt-4 px-3 py-1 bg-slate-900/60 rounded-full border border-slate-700/60">
                  کاملاً آفلاین • Jetpack Compose M3
                </span>
              </div>

              <div className="w-full pb-8">
                <button
                  onClick={() => setCurrentScreen('home')}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold rounded-2xl shadow-lg shadow-amber-500/25 transition-transform active:scale-95 text-sm flex items-center justify-center gap-2"
                >
                  <span>ورود به دیوان</span>
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 2: HOME */}
          {currentScreen === 'home' && (
            <div className="flex-1 flex flex-col justify-between p-5 overflow-y-auto animate-fadeIn">
              {/* App Bar */}
              <div className="flex items-center justify-between pt-1 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/src/assets/images/tazhib_ornament_gold_1791116559633.jpg"
                    alt="Logo"
                    className="w-8 h-8 rounded-full border border-amber-400/40 object-cover"
                  />
                  <div>
                    <h2 className="text-sm font-bold text-amber-200">دیوان حافظ</h2>
                    <span className="text-[10px] text-teal-400 block -mt-0.5">تفأل و حکمت</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setShowIndexModal(true)}
                    className="p-2 rounded-xl bg-slate-900/60 border border-slate-700/60 text-slate-300 hover:text-amber-300 transition-colors"
                    title="فهرست و جستجو"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentScreen('splash')}
                    className="px-2.5 py-1 text-[11px] rounded-xl bg-slate-900/60 border border-slate-700/60 text-slate-400 hover:text-slate-200"
                  >
                    پیش‌نمایش
                  </button>
                </div>
              </div>

              {/* Center Artwork & CTA */}
              <div className="my-auto py-6 flex flex-col items-center text-center">
                {/* Book Cover Frame */}
                <div className="relative group mb-6">
                  <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500/20 via-teal-500/20 to-amber-500/20 rounded-2xl blur-sm group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative w-44 h-60 rounded-xl overflow-hidden border-2 border-amber-500/50 shadow-2xl bg-[#091322]">
                    <img
                      src="/src/assets/images/hafez_divan_book_cover_1791116571875.jpg"
                      alt="Hafez Divan Book"
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end justify-center p-3">
                      <span className="text-xs font-amiri text-amber-200">دیوان خواجه شمس‌الدین</span>
                    </div>
                  </div>
                </div>

                {/* Main Pulsing "نیت و فال" Button */}
                <button
                  onClick={handleStartFal}
                  className="relative group p-0.5 rounded-full overflow-hidden focus:outline-none transition-transform active:scale-95"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-amber-400 via-teal-300 to-amber-500 animate-spin" style={{ animationDuration: '4s' }}></span>
                  <span className="relative flex items-center gap-3 px-8 py-4 bg-[#0A1626] rounded-full text-amber-200 font-bold text-base shadow-2xl group-hover:bg-[#0E1E34] transition-colors border border-amber-400/40">
                    <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                    <span>نیت و گرفتن فال</span>
                  </span>
                </button>

                <p className="text-xs text-slate-400 mt-4 max-w-[260px] leading-relaxed">
                  چشم دل باز کن و با خلوص نیت، دکمه را لمس فرمایید
                </p>
              </div>

              {/* Bottom Quote & Stats Card */}
              <div className="bg-[#0A1626]/80 border border-slate-800 rounded-2xl p-3.5 backdrop-blur-sm">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="flex items-center gap-1.5 text-teal-300">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>بانک اشعار آفلاین (JSON)</span>
                  </span>
                  <span className="font-mono text-[11px] text-amber-400">
                    {HAFEZ_GHAZALS.length} غزل کامل
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-amiri leading-relaxed text-center">
                  «هر آن که جانب اهل خدا نگه دارد / خداش در همه حال از بلا نگه دارد»
                </p>
              </div>
            </div>
          )}

          {/* SCREEN 3: NIYAT (INTENTION & PRAYER) */}
          {currentScreen === 'niyat' && (
            <div className="flex-1 flex flex-col justify-between p-6 animate-fadeIn">
              {/* Top Navigation */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <button
                  onClick={() => setCurrentScreen('home')}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors flex items-center gap-1 text-xs"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>بازگشت</span>
                </button>
                <span className="text-xs font-semibold text-amber-300">مرحله نیت</span>
                <div className="w-8"></div>
              </div>

              {/* Prayer & Contemplation */}
              <div className="flex-1 flex flex-col items-center justify-center text-center my-4">
                {/* Breathing Contemplation Circle */}
                <div className="relative w-40 h-40 flex items-center justify-center mb-6">
                  <div className="absolute inset-0 rounded-full border-2 border-teal-400/30 animate-ping opacity-40"></div>
                  <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-amber-500/10 via-teal-500/20 to-amber-500/20 border-2 border-amber-400/50 flex flex-col items-center justify-center p-4 shadow-xl">
                    <Flame className="w-7 h-7 text-amber-400 mb-1 animate-pulse" />
                    <span className="text-xs font-bold text-amber-200">تمرکز نیت</span>
                    <span className="text-[9px] text-teal-300">فاتحه و صلوات</span>
                  </div>
                </div>

                {/* Invocation Text */}
                <div className="bg-[#0A1628] border border-amber-500/30 rounded-2xl p-5 shadow-lg max-w-sm">
                  <h3 className="text-sm font-bold text-amber-300 mb-2">سوگند به لسان‌الغیب:</h3>
                  <p className="font-amiri text-base leading-relaxed text-amber-100">
                    «ای حافظ شیرازی، تو کاشف هر رازی، بر ما نظر اندازی، قسم به شاخ نباتت که رازم بگشایی...»
                  </p>
                  <p className="text-xs text-slate-400 mt-3 border-t border-slate-800 pt-2 leading-relaxed">
                    نیت خود را در دل مرور کنید؛ سپس با آرامش کتاب دیوان را بگشایید.
                  </p>
                </div>
              </div>

              {/* Action Button: Open the Book */}
              <div className="pb-4">
                <button
                  onClick={handleOpenBookAndReveal}
                  className="w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-bold rounded-2xl shadow-lg shadow-teal-500/25 transition-transform active:scale-95 text-sm flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-5 h-5 text-slate-950" />
                  <span>گشودن دیوان و مشاهده فال</span>
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 4: LOADING (OPENING BOOK ANIMATION) */}
          {currentScreen === 'loading' && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-fadeIn bg-[#070D18]">
              {/* 3D Animated Book Simulation */}
              <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-amber-500/10 filter blur-xl animate-pulse"></div>
                {/* Rotating astrolabe Tazhib */}
                <img
                  src="/src/assets/images/tazhib_ornament_gold_1791116559633.jpg"
                  alt="Tazhib Loading"
                  className="w-36 h-36 rounded-full object-cover border-2 border-amber-400/60 animate-spin"
                  style={{ animationDuration: '8s' }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-slate-950/80 backdrop-blur-md flex items-center justify-center border border-amber-400/50">
                    <BookOpen className="w-7 h-7 text-amber-300 animate-bounce" />
                  </div>
                </div>
              </div>

              <h3 className="text-base font-bold text-amber-200 mb-2">
                {loadingQuotes[loadingQuoteIndex]}
              </h3>
              <p className="text-xs text-slate-400 max-w-[260px] leading-relaxed">
                صفحات دیوان بر حسب تقدیر شما ورق می‌خورد...
              </p>

              {/* Progress bar shimmer */}
              <div className="w-48 h-1.5 bg-slate-800 rounded-full mt-6 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-400 via-teal-400 to-amber-400 rounded-full animate-pulse w-3/4 mx-auto"></div>
              </div>
            </div>
          )}

          {/* SCREEN 5: RESULT SCREEN */}
          {currentScreen === 'result' && (
            <div className="flex-1 flex flex-col overflow-y-auto animate-fadeIn">
              {/* App Bar */}
              <div className="sticky top-0 bg-[#080E18]/90 backdrop-blur-md px-5 py-3 border-b border-slate-800/80 flex items-center justify-between z-20 shrink-0">
                <button
                  onClick={() => setCurrentScreen('home')}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>خانه</span>
                </button>

                <div className="text-center">
                  <span className="text-xs font-bold text-amber-300 block">
                    غزل شماره {currentPoem.ghazal_number}
                  </span>
                  <span className="text-[10px] text-teal-400">{currentPoem.theme}</span>
                </div>

                <div className="flex items-center gap-1">
                  {/* Persian Ambient Ney Flute toggle */}
                  <button
                    onClick={toggleNeyAudio}
                    className={`p-2 rounded-lg transition-colors ${
                      isPlayingAudio
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
                    }`}
                    title={isPlayingAudio ? 'قطع نوای نی' : 'پخش نوای نی سنتی'}
                  >
                    {isPlayingAudio ? (
                      <Volume2 className="w-4 h-4 animate-pulse" />
                    ) : (
                      <VolumeX className="w-4 h-4" />
                    )}
                  </button>

                  {/* Bookmark Button */}
                  <button
                    onClick={() => toggleBookmark(currentPoem.ghazal_number)}
                    className={`p-2 rounded-lg transition-colors ${
                      bookmarkedIds.includes(currentPoem.ghazal_number)
                        ? 'text-amber-400 bg-amber-500/15'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Bookmark className="w-4 h-4 fill-current" />
                  </button>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-5 space-y-5">
                {/* Audio Status Toast */}
                {isPlayingAudio && (
                  <div className="px-3 py-1.5 bg-amber-500/10 border border-amber-400/30 rounded-xl text-[11px] text-amber-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                      در حال پخش نوای آرام‌بخش نی در دستگاه شور
                    </span>
                    <button onClick={toggleNeyAudio} className="text-xs hover:underline">
                      قطع
                    </button>
                  </div>
                )}

                {/* Poem Verses Card with Tazhib Ornamental Styling */}
                <div className="relative p-5 bg-[#0C1726] border border-amber-500/40 rounded-2xl shadow-xl overflow-hidden">
                  <div className="absolute top-2 right-2 text-amber-400/40 text-xs">✦</div>
                  <div className="absolute top-2 left-2 text-amber-400/40 text-xs">✦</div>
                  <div className="absolute bottom-2 right-2 text-amber-400/40 text-xs">✦</div>
                  <div className="absolute bottom-2 left-2 text-amber-400/40 text-xs">✦</div>

                  <div className="text-center mb-4">
                    <h3 className="text-base font-bold text-amber-200 font-amiri">
                      {currentPoem.title}
                    </h3>
                  </div>

                  <div className={`space-y-4 text-center ${fontClass} text-base md:text-lg leading-loose text-slate-100`}>
                    {currentPoem.verses.map((couplet, idx) => (
                      <div key={idx} className="border-b border-slate-800/60 pb-3 last:border-b-0">
                        <p className="hover:text-amber-200 transition-colors">{couplet.mesra1}</p>
                        <p className="mt-1 hover:text-amber-200 transition-colors">{couplet.mesra2}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tafsir (Interpretation) Card */}
                <div className="p-4 bg-[#0F2033] border border-teal-500/35 rounded-2xl shadow-lg">
                  <div className="flex items-center gap-2 mb-2 text-teal-300">
                    <Sparkles className="w-4 h-4" />
                    <h4 className="text-sm font-bold">تعبیر و تفسیر فال شما:</h4>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed text-justify font-vazir">
                    {currentPoem.tafsir}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-teal-500/20 text-[11px] text-amber-300/90 flex items-start gap-1.5">
                    <span className="font-bold text-amber-400">✦ پند:</span>
                    <span>{currentPoem.advice}</span>
                  </div>
                </div>

                {/* Actions: Repeat & Share */}
                <div className="grid grid-cols-2 gap-3 pt-2 pb-6">
                  <button
                    onClick={handleRepeatFal}
                    className="py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
                  >
                    <RefreshCw className="w-4 h-4 text-slate-950" />
                    <span>فال مجدد</span>
                  </button>

                  <button
                    onClick={() => setShowShareModal(true)}
                    className="py-3.5 bg-[#14263B] hover:bg-[#1A324E] border border-teal-400/40 text-teal-200 font-semibold rounded-xl flex items-center justify-center gap-2 text-xs active:scale-95 transition-all"
                  >
                    <Share2 className="w-4 h-4 text-teal-300" />
                    <span>اشتراک‌گذاری</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Android Bottom Navigation Pill */}
          <div className="h-6 flex items-center justify-center shrink-0 bg-transparent pb-1">
            <div className="w-28 h-1 bg-slate-600/70 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Screen Modals */}
      {showShareModal && (
        <ShareCardModal
          poem={currentPoem}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {showIndexModal && (
        <GhazalIndexModal
          onClose={() => setShowIndexModal(false)}
          onSelectGhazal={(poem) => {
            setCurrentPoem(poem);
            setCurrentScreen('result');
          }}
          bookmarkedIds={bookmarkedIds}
          onToggleBookmark={toggleBookmark}
        />
      )}
    </div>
  );
};
