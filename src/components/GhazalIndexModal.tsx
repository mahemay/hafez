import React, { useState } from 'react';
import { X, Search, Bookmark, BookOpen, Sparkles } from 'lucide-react';
import { HAFEZ_GHAZALS, HafezPoem } from '../data/hafezData';

interface GhazalIndexModalProps {
  onClose: () => void;
  onSelectGhazal: (poem: HafezPoem) => void;
  bookmarkedIds: number[];
  onToggleBookmark: (id: number) => void;
}

export const GhazalIndexModal: React.FC<GhazalIndexModalProps> = ({
  onClose,
  onSelectGhazal,
  bookmarkedIds,
  onToggleBookmark,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'bookmarks'>('all');

  const filteredGhazals = HAFEZ_GHAZALS.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.poem.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ghazal_number.toString().includes(searchQuery);

    if (filterMode === 'bookmarks') {
      return matchesSearch && bookmarkedIds.includes(item.ghazal_number);
    }
    return matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#09111C] border border-amber-500/35 rounded-2xl p-6 shadow-2xl text-slate-100 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-amber-200">فهرست غزلیات دیوان حافظ</h3>
              <p className="text-xs text-slate-400">جستجو در اشعار، مضامین و تعابیر آفلاین</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="py-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="جستجوی شماره غزل، مطلع شعر، کلمات کلیدی..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#101F33] border border-slate-700/80 focus:border-amber-400/70 rounded-xl py-2.5 pr-10 pl-4 text-sm text-slate-100 placeholder-slate-400 outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterMode === 'all'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              همه غزلیات ({HAFEZ_GHAZALS.length})
            </button>
            <button
              onClick={() => setFilterMode('bookmarks')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                filterMode === 'bookmarks'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>نشان‌شده‌ها ({bookmarkedIds.length})</span>
            </button>
          </div>
        </div>

        {/* Ghazals List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {filteredGhazals.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <Sparkles className="w-8 h-8 mx-auto text-slate-600 mb-2" />
              <p className="text-sm">شعری با این مشخصات یافت نشد.</p>
            </div>
          ) : (
            filteredGhazals.map((item) => {
              const isFav = bookmarkedIds.includes(item.ghazal_number);
              const firstCouplet = item.verses[0];
              return (
                <div
                  key={item.ghazal_number}
                  className="p-3.5 rounded-xl bg-[#0E1B2D] hover:bg-[#14263F] border border-slate-800 hover:border-amber-500/30 transition-all flex items-center justify-between gap-4 group"
                >
                  <div
                    onClick={() => {
                      onSelectGhazal(item);
                      onClose();
                    }}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
                        غزل {item.ghazal_number}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {item.theme}
                      </span>
                    </div>
                    <p className="text-sm text-slate-200 font-amiri group-hover:text-amber-200 transition-colors">
                      {firstCouplet.mesra1} ... {firstCouplet.mesra2}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => onToggleBookmark(item.ghazal_number)}
                      className={`p-2 rounded-lg transition-colors ${
                        isFav
                          ? 'text-amber-400 bg-amber-500/10'
                          : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                      }`}
                      title={isFav ? 'حذف از نشان‌شده‌ها' : 'نشان کردن'}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                    <button
                      onClick={() => {
                        onSelectGhazal(item);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-teal-600/20 hover:bg-teal-600/30 border border-teal-500/40 text-teal-300 text-xs font-medium"
                    >
                      مشاهده فال
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
