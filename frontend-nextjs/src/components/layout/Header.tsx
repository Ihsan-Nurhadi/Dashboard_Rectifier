'use client';

import { RefreshCw, Zap, Maximize2, Minimize2, PanelLeftClose, PanelLeft } from "lucide-react";

interface HeaderProps {
  onRefresh?: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  sitesCount?: number;
  isBackendOnline?: boolean;
}

export function Header({ 
  onRefresh, 
  isFullscreen = false, 
  onToggleFullscreen,
  isSidebarOpen = true,
  onToggleSidebar,
  sitesCount = 0,
  isBackendOnline = true
}: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-slate-200 z-[600] shrink-0">
      {/* Left: Sidebar Toggle + Brand & Logo */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            title={isSidebarOpen ? "Sembunyikan Sidebar" : "Tampilkan Sidebar"}
            className={`p-2 rounded-lg border transition-colors ${
              isSidebarOpen 
                ? 'bg-slate-100 text-slate-800 border-slate-300' 
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
          </button>
        )}

        <div className="flex items-center gap-2.5">
          <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 text-white">
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-none">
                IPLH Monitoring System
              </h1>
              <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200 font-semibold leading-none">
                v2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium leading-none mt-1 hidden sm:block">
              Integrated Power & Load Health Monitoring
            </p>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Solid Live Badge - NO animate-ping or glowing effect */}
        {isBackendOnline ? (
          <div 
            title="Terhubung ke Backend Django"
            className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span className="text-[11px] font-bold text-emerald-800 tracking-wide uppercase">Live Django</span>
          </div>
        ) : (
          <div 
            title="Backend Django belum berjalan. Menggunakan data simulasi lokal otomatis."
            className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200"
          >
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span className="text-[11px] font-bold text-amber-800 tracking-wide uppercase">Mode Simulasi</span>
          </div>
        )}

        {onToggleFullscreen && (
          <button 
            onClick={onToggleFullscreen}
            aria-label={isFullscreen ? "Keluar Fullscreen" : "Fullscreen Layar Penuh"}
            title={isFullscreen ? "Keluar Fullscreen" : "Fullscreen Layar Penuh"}
            className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        )}

        <button 
          onClick={onRefresh}
          title="Refresh Data"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-xs font-semibold transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>
    </header>
  );
}
