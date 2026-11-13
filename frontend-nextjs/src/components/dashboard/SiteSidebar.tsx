'use client';

import { useState, useMemo } from 'react';
import { Search, X, MapPin, CheckCircle2, Clock, ChevronRight } from 'lucide-react';
import { SiteOverview } from '@/types';

interface SiteSidebarProps {
  sites: SiteOverview[];
  selectedSiteName: string | null;
  onSelectSite: (siteName: string) => void;
  isOpen: boolean;
  onClose?: () => void;
}

export function SiteSidebar({
  sites,
  selectedSiteName,
  onSelectSite,
  isOpen,
  onClose,
}: SiteSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'DONE' | 'PROGRESS'>('ALL');

  // Filtered sites based on search and status
  const filteredSites = useMemo(() => {
    return sites.filter((site) => {
      // Status filter
      const isDone = site.statusRealtime === 'Normal';
      if (statusFilter === 'DONE' && !isDone) return false;
      if (statusFilter === 'PROGRESS' && isDone) return false;

      // Search query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchName = site.siteName.toLowerCase().includes(q);
      const matchProject = site.projectId.toLowerCase().includes(q);
      const matchLadder = site.ladder.toLowerCase().includes(q);
      return matchName || matchProject || matchLadder;
    });
  }, [sites, searchQuery, statusFilter]);

  const doneCount = sites.filter(s => s.statusRealtime === 'Normal').length;
  const progressCount = sites.filter(s => s.statusRealtime !== 'Normal').length;

  if (!isOpen) return null;

  return (
    <aside className="w-80 sm:w-92 h-full bg-white border-r border-slate-200 flex flex-col z-[500] shrink-0 shadow-sm font-sans">
      {/* 1. Search Bar Header */}
      <div className="p-3.5 border-b border-slate-200 bg-white">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama site atau Project ID..."
            className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 mt-2.5">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
              statusFilter === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua ({sites.length})
          </button>

          <button
            onClick={() => setStatusFilter('DONE')}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold transition-colors ${
              statusFilter === 'DONE'
                ? 'bg-emerald-700 text-white'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Done ({doneCount})</span>
          </button>

          <button
            onClick={() => setStatusFilter('PROGRESS')}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold transition-colors ${
              statusFilter === 'PROGRESS'
                ? 'bg-amber-700 text-white'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>On Progress ({progressCount})</span>
          </button>
        </div>
      </div>

      {/* 2. Scrollable Site Cards List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1.5 scrollbar-thin">
        {filteredSites.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs px-4">
            <MapPin className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-medium text-slate-600">Tidak ada site yang cocok</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Coba cari dengan kata kunci lain
            </p>
          </div>
        ) : (
          filteredSites.map((site) => {
            const isSelected = site.siteName === selectedSiteName;
            const isDone = site.statusRealtime === 'Normal';

            return (
              <div
                key={site.siteName}
                onClick={() => onSelectSite(site.siteName)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                {/* Title & Status */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${
                      isDone ? 'bg-emerald-500' : 'bg-amber-500'
                    }`} />
                    <span className={`font-bold text-xs tracking-tight ${
                      isSelected ? 'text-white' : 'text-slate-900'
                    }`}>
                      {site.siteName}
                    </span>
                  </div>

                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                    isSelected
                      ? (isDone ? 'bg-emerald-900 text-emerald-200 border border-emerald-700' : 'bg-amber-900 text-amber-200 border border-amber-700')
                      : (isDone ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200')
                  }`}>
                    {isDone ? 'Done' : 'On Progress'}
                  </span>
                </div>

                {/* Subtitle / Project ID */}
                <div className={`text-[11px] font-mono mb-2 ${
                  isSelected ? 'text-slate-300' : 'text-slate-500'
                }`}>
                  Project: {site.projectId}
                </div>

                {/* Metrics Mini Grid */}
                <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-100/20 text-[10px]">
                  <div className={`p-1.5 rounded-md ${
                    isSelected ? 'bg-slate-800' : 'bg-slate-50'
                  }`}>
                    <span className={`block text-[9px] uppercase font-semibold ${
                      isSelected ? 'text-slate-400' : 'text-slate-400'
                    }`}>Tegangan</span>
                    <span className="font-mono font-bold">{site.vdcOutput} V</span>
                  </div>

                  <div className={`p-1.5 rounded-md ${
                    isSelected ? 'bg-slate-800' : 'bg-slate-50'
                  }`}>
                    <span className={`block text-[9px] uppercase font-semibold ${
                      isSelected ? 'text-slate-400' : 'text-slate-400'
                    }`}>Beban</span>
                    <span className="font-mono font-bold">{site.loadCurrent} A</span>
                  </div>

                  <div className={`p-1.5 rounded-md ${
                    isSelected ? 'bg-slate-800' : 'bg-slate-50'
                  }`}>
                    <span className={`block text-[9px] uppercase font-semibold ${
                      isSelected ? 'text-slate-400' : 'text-slate-400'
                    }`}>Suhu</span>
                    <span className="font-mono font-bold">{site.temperature} °C</span>
                  </div>
                </div>

                {/* Coordinates */}
                <div className={`flex items-center justify-between text-[10px] mt-2 pt-1 font-mono ${
                  isSelected ? 'text-slate-400' : 'text-slate-400'
                }`}>
                  <span>{site.latitude.toFixed(4)}, {site.longitude.toFixed(4)}</span>
                  <div className="flex items-center gap-0.5 text-xs">
                    <span>Lihat di Peta</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 3. Footer Counter */}
      <div className="p-2.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-[11px] text-slate-500 font-medium">
        <span>Menampilkan {filteredSites.length} dari {sites.length} site</span>
        <span className="text-[10px] font-mono text-slate-400">IPLH Map</span>
      </div>
    </aside>
  );
}
