'use client';

import { MapPin } from "lucide-react";
import { SiteOverview } from "@/types";
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('@/components/ui/Map'), { 
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-slate-100 flex flex-col items-center justify-center text-slate-500 text-sm">
      <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin mb-2"></div>
      <span className="font-medium">Memuat peta seluruh site...</span>
    </div>
  )
});

interface SitesOverviewMapProps {
  sites: SiteOverview[];
  selectedSiteName: string | null;
  onSelectSite: (siteName: string) => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export function SitesOverviewMap({ 
  sites, 
  selectedSiteName, 
  onSelectSite, 
  isFullscreen = false,
  onToggleFullscreen
}: SitesOverviewMapProps) {
  const normalCount = sites.filter(s => s.statusRealtime === 'Normal').length;
  const onProgressCount = sites.filter(s => s.statusRealtime !== 'Normal').length;

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Floating Top-Left Stats Badge Bar */}
      <div className="absolute top-5 left-5 z-[400] flex items-center gap-2 bg-white/95 backdrop-blur-sm px-3.5 py-2 rounded-xl shadow-sm border border-slate-200 pointer-events-auto">
        <div className="flex items-center gap-2 pr-2 border-r border-slate-200">
          <MapPin className="w-4 h-4 text-slate-700" />
          <span className="text-xs font-bold text-slate-800">Peta Sebaran Site</span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-semibold text-[11px]">
            {sites.length} Titik
          </span>
          <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>Done ({normalCount})</span>
          </div>
          {onProgressCount > 0 && (
            <div className="flex items-center gap-1.5 text-amber-700 font-semibold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-amber-600"></span>
              <span>On Progress ({onProgressCount})</span>
            </div>
          )}
        </div>
      </div>

      {/* Edge-to-Edge Fullscreen Map */}
      <Map 
        sites={sites}
        selectedSiteName={selectedSiteName}
        onSelectSite={onSelectSite}
        center={[-6.5, 108.5]}
        zoom={7}
        isFullscreen={isFullscreen}
        onToggleFullscreen={onToggleFullscreen}
      />
    </div>
  );
}
