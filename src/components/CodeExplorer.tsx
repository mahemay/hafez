import React, { useState } from 'react';
import {
  FileCode,
  Copy,
  Check,
  Download,
  FolderTree,
  Layers,
  Sparkles,
  Cpu,
  BookOpen,
  Code2,
  Terminal,
  ExternalLink
} from 'lucide-react';
import { CODE_FILES, PROJECT_STRUCTURE, CodeFile } from '../data/androidCodeSnippets';
import { HAFEZ_JSON_STRING } from '../data/hafezData';

export const CodeExplorer: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'step1' | 'step2' | 'step3' | 'step4' | 'step5'>('step1');
  const [selectedFileId, setSelectedFileId] = useState<string>('hafez-poem-model');
  const [copied, setCopied] = useState(false);
  const [copiedProjectTree, setCopiedProjectTree] = useState(false);

  const categoryFiles = CODE_FILES.filter(f => f.category === activeCategory);
  const activeFile = CODE_FILES.find(f => f.id === selectedFileId) || categoryFiles[0] || CODE_FILES[0];

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleCopyTree = async () => {
    try {
      await navigator.clipboard.writeText(PROJECT_STRUCTURE);
      setCopiedProjectTree(true);
      setTimeout(() => setCopiedProjectTree(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDownloadSingleFile = (file: CodeFile) => {
    const blob = new Blob([file.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAllJson = () => {
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
    <div className="flex-1 flex flex-col h-full bg-[#080E18] text-slate-100 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Top Bar with Step Switcher */}
      <div className="bg-[#0C1524] px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100">Android Clean Architecture & Kotlin Studio</h2>
            <span className="text-[11px] text-slate-400">Jetpack Compose • MVVM • StateFlow • Offline Assets</span>
          </div>
        </div>

        {/* Step Selector Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <button
            onClick={() => {
              setActiveCategory('step1');
              setSelectedFileId('hafez-poem-model');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeCategory === 'step1'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            گام ۱: Data Models
          </button>
          <button
            onClick={() => {
              setActiveCategory('step2');
              setSelectedFileId('viewmodel');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeCategory === 'step2'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            گام ۲: Repository & ViewModel
          </button>
          <button
            onClick={() => {
              setActiveCategory('step3');
              setSelectedFileId('theme-main');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeCategory === 'step3'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            گام ۳: Theme & RTL
          </button>
          <button
            onClick={() => {
              setActiveCategory('step4');
              setSelectedFileId('home-screen');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeCategory === 'step4'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            گام ۴: Compose UI
          </button>
          <button
            onClick={() => {
              setActiveCategory('step5');
              setSelectedFileId('build-gradle');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeCategory === 'step5'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            گام ۵: Assets & Gradle
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left/Right Sidebar: File Tree & Project Specs */}
        <div className="w-full lg:w-72 bg-[#0A121F] border-b lg:border-b-0 lg:border-l border-slate-800 flex flex-col shrink-0 overflow-y-auto">
          {/* Category Files List */}
          <div className="p-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 px-1">
              فایل‌های این مرحله:
            </span>
            <div className="space-y-1">
              {categoryFiles.map((file) => (
                <button
                  key={file.id}
                  onClick={() => setSelectedFileId(file.id)}
                  className={`w-full text-right p-2.5 rounded-xl text-xs font-mono flex items-center justify-between transition-all ${
                    activeFile.id === file.id
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      : 'text-slate-300 hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                    <span className="truncate">{file.filename}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 uppercase shrink-0">
                    {file.language}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Project Structure Accordion */}
          <div className="p-3 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FolderTree className="w-3.5 h-3.5 text-teal-400" />
                <span>ساختار پروژه Android</span>
              </span>
              <button
                onClick={handleCopyTree}
                className="text-[11px] text-teal-300 hover:text-teal-200 flex items-center gap-1"
                title="کپی ساختار درختی پروژه"
              >
                {copiedProjectTree ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedProjectTree ? 'کپی شد' : 'کپی'}</span>
              </button>
            </div>
            <pre className="text-[10px] font-mono text-slate-400 bg-[#070D16] p-2.5 rounded-xl border border-slate-800/80 overflow-x-auto leading-relaxed max-h-48 scrollbar-thin">
              {PROJECT_STRUCTURE}
            </pre>
          </div>

          {/* Quick Downloads */}
          <div className="p-3 border-t border-slate-800 mt-auto">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 px-1">
              دانلود مستقیم فایل‌ها:
            </span>
            <div className="space-y-1.5">
              <button
                onClick={handleDownloadAllJson}
                className="w-full py-2 px-3 rounded-xl bg-teal-600/20 hover:bg-teal-600/30 border border-teal-500/30 text-teal-300 text-xs font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>دانلود دیتابیس hafez.json</span>
              </button>
              <button
                onClick={() => handleDownloadSingleFile(activeFile)}
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-slate-200 text-xs font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>دانلود {activeFile.filename}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Code Content Display Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#070D16]">
          {/* File Header Bar */}
          <div className="bg-[#0A121F] px-4 py-2.5 border-b border-slate-800 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-300 font-mono">
                  {activeFile.filename}
                </span>
                <span className="text-[11px] text-slate-400 truncate">
                  ({activeFile.path})
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">
                {activeFile.description}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleCopyCode(activeFile.code)}
                className="py-1.5 px-3 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all active:scale-95"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'کد کپی شد!' : 'کپی سورس'}</span>
              </button>
            </div>
          </div>

          {/* Architecture Insights Card */}
          <div className="px-4 py-2.5 bg-[#091424] border-b border-slate-800/80 text-xs text-slate-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              {activeCategory === 'step1' && (
                <><b>نکته معماری Step 1:</b> دیتاکلاس <code className="text-amber-300 font-mono">HafezPoem</code> با دو انوتیشن Moshi و Gson تطبیق داده شده تا بدون هیچ باگی آبجکت‌های JSON موجود در <code className="text-teal-300 font-mono">assets/hafez.json</code> را پارس کند.</>
              )}
              {activeCategory === 'step2' && (
                <><b>نکته معماری Step 2:</b> کلاس <code className="text-amber-300 font-mono">HafezRepositoryImpl</code> از یک صف Ring-Buffer حافظه‌ای (Memory Queue) برای نگهداری آی‌دی ۵ فال اخیر استفاده می‌کند تا از تکرار پشت‌سر‌هم فال جلوگیری شود.</>
              )}
              {activeCategory === 'step3' && (
                <><b>نکته معماری Step 3:</b> استفاده از <code className="text-amber-300 font-mono">CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl)</code> تضمین می‌کند رابط کاربری در زبان فارسی ۱۰۰٪ راست‌به‌چپ نمایش یابد.</>
              )}
              {activeCategory === 'step4' && (
                <><b>نکته معماری Step 4:</b> کامپوزبل‌های <code className="text-amber-300 font-mono">HomeScreen</code> و <code className="text-amber-300 font-mono">ResultScreen</code> بر پایه اصول متریال ۳، انیمیشن‌های تنفسی Pulse و سیستم ابیات و مصرع‌ها کدنویسی شده‌اند.</>
              )}
              {activeCategory === 'step5' && (
                <><b>نکته معماری Step 5:</b> وابستگی‌های رسمی Jetpack Compose BOM 2024+، ناوبری Compose و Moshi KSP در فایل <code className="text-amber-300 font-mono">build.gradle.kts</code> درج شده است.</>
              )}
            </span>
          </div>

          {/* Code Viewer with Line Numbers */}
          <div className="flex-1 overflow-auto p-4 text-xs font-mono leading-relaxed select-text">
            <pre className="text-slate-200">
              <code>{activeFile.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
