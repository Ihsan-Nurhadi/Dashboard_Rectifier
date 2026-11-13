'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { SiteOverview } from '@/types';
import { X, MapPin, Maximize2, Minimize2, RotateCcw, ExternalLink } from 'lucide-react';

// Helper component to center and zoom map dynamically
function ChangeView({ center, zoom }: { center: [number, number]; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom || map.getZoom(), {
      duration: 1.2,
      easeLinearity: 0.25
    });
  }, [center, zoom, map]);
  return null;
}

// Flat matte circular dot marker matching user reference image
const createDotMarkerIcon = (status: string, isSelected: boolean) => {
  const isDone = status === 'Normal' || status === 'Done';
  const color = isDone ? '#16a34a' : '#d97706'; // Green for Done, Amber for On Progress
  const size = isSelected ? 18 : 14;
  const border = isSelected ? '#0f172a' : '#ffffff';
  const borderWidth = isSelected ? 3 : 2;

  return L.divIcon({
    className: 'custom-dot-marker',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border: ${borderWidth}px solid ${border};
        border-radius: 50%;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
        cursor: pointer;
        transition: transform 0.1s ease;
      "></div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

interface MapProps {
  sites: SiteOverview[];
  selectedSiteName?: string | null;
  onSelectSite?: (siteName: string) => void;
  onOpenSiteDetail?: (siteName: string) => void;
  center?: [number, number];
  zoom?: number;
  className?: string;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

const DEFAULT_CENTER: [number, number] = [-6.5, 108.5];
const DEFAULT_ZOOM = 7;

export default function Map({ 
  sites,
  selectedSiteName,
  onSelectSite,
  onOpenSiteDetail,
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  className = "w-full h-full z-0",
  isFullscreen = false,
  onToggleFullscreen
}: MapProps) {
  // Currently inspected site for the overlay card
  const [inspectedSite, setInspectedSite] = useState<SiteOverview | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(center);
  const [mapZoom, setMapZoom] = useState<number>(zoom);

  // Sync inspected site with selectedSiteName if changed externally
  useEffect(() => {
    if (selectedSiteName) {
      const match = sites.find(s => s.siteName === selectedSiteName);
      if (match) {
        setInspectedSite(match);
        setMapCenter([match.latitude, match.longitude]);
        setMapZoom(11);
      }
    }
  }, [selectedSiteName, sites]);

  const handleResetView = () => {
    setMapCenter(DEFAULT_CENTER);
    setMapZoom(DEFAULT_ZOOM);
    setInspectedSite(null);
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      <MapContainer 
        center={mapCenter} 
        zoom={mapZoom} 
        scrollWheelZoom={true} 
        className={className}
        style={{ minHeight: '100%', height: '100%', width: '100%' }}
      >
        <ChangeView center={mapCenter} zoom={mapZoom} />
        {/* Official OpenStreetMap free tiles - NO API KEY REQUIRED */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Monitored Site Point Markers */}
        {sites.map((site) => {
          const isSelected = inspectedSite?.siteName === site.siteName;
          const status = site.statusRealtime === 'Normal' ? 'Done' : 'On Progress';

          return (
            <Marker 
              key={site.siteName}
              position={[site.latitude, site.longitude]} 
              icon={createDotMarkerIcon(status, isSelected)}
              eventHandlers={{
                click: () => {
                  setInspectedSite(site);
                  setMapCenter([site.latitude, site.longitude]);
                  setMapZoom(11);
                  if (onSelectSite) onSelectSite(site.siteName);
                }
              }}
            />
          );
        })}
      </MapContainer>

      {/* 1. Bottom-Left Legend Box - matching user reference image */}
      <div className="absolute bottom-5 left-5 z-[400] bg-white px-3.5 py-2 rounded-lg shadow-sm border border-slate-200 flex items-center gap-4 text-xs font-medium text-slate-700 pointer-events-auto">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
          <span className="font-semibold text-slate-800">Done</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block"></span>
          <span className="font-semibold text-slate-800">On Progress</span>
        </div>
      </div>

      {/* 2. Bottom-Right Quick Controls: Reset View + Fullscreen Toggle */}
      <div className="absolute bottom-5 right-5 z-[400] flex items-center gap-2 pointer-events-auto">
        <button
          onClick={handleResetView}
          title="Reset Tampilan Peta ke Seluruh Jawa/Indonesia"
          className="bg-white px-3 py-2 rounded-lg shadow-sm border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors text-xs font-semibold flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Peta</span>
        </button>

        {onToggleFullscreen && (
          <button
            onClick={onToggleFullscreen}
            title={isFullscreen ? "Keluar dari Fullscreen" : "Layar Penuh (Fullscreen)"}
            className="bg-white p-2.5 rounded-lg shadow-sm border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* 3. Top-Right Floating Summary Overlay Card (Kartu Overlay Ringkasan) */}
      {inspectedSite && (
        <div className="absolute top-5 right-5 z-[500] w-88 max-w-[calc(100vw-2.5rem)] bg-white rounded-xl shadow-lg border border-slate-200 p-4.5 pointer-events-auto font-sans animate-in fade-in duration-150">
          {/* Card Header */}
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 tracking-tight">
                  {inspectedSite.siteName}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  inspectedSite.statusRealtime === 'Normal'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}>
                  {inspectedSite.statusRealtime === 'Normal' ? 'Done' : 'On Progress'}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                Project ID: {inspectedSite.projectId} | SLA: {inspectedSite.sla}
              </div>
            </div>

            <button 
              onClick={() => setInspectedSite(null)}
              className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Tutup Ringkasan"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-2.5 my-3 text-xs">
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">Tegangan DC</span>
              <div className="font-mono font-bold text-slate-900 text-sm">
                {inspectedSite.vdcOutput} <span className="text-[10px] text-slate-400 font-normal">V</span>
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">Beban DC</span>
              <div className="font-mono font-bold text-slate-900 text-sm">
                {inspectedSite.loadCurrent} <span className="text-[10px] text-slate-400 font-normal">A</span>
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">Suhu Ruang</span>
              <div className="font-mono font-bold text-slate-900 text-sm">
                {inspectedSite.temperature} <span className="text-[10px] text-slate-400 font-normal">°C</span>
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">Status Baterai</span>
              <div className="font-mono font-bold text-slate-900 text-sm truncate">
                {inspectedSite.batteryStatus}
              </div>
            </div>
          </div>

          {/* Additional Parameters Info */}
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-[11px] text-slate-600 space-y-1 mb-3">
            <div className="flex justify-between">
              <span className="text-slate-400">Status Ladder:</span>
              <span className="font-semibold text-slate-800">{inspectedSite.statusLadder}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Kelembaban:</span>
              <span className="font-semibold text-slate-800">{inspectedSite.humidity}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Waktu Data:</span>
              <span className="font-mono text-slate-700 text-[10px]">{inspectedSite.lastData}</span>
            </div>
          </div>

          {/* Coordinates info */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 py-1.5 px-2 bg-slate-50/70 rounded-md border border-slate-100 mb-3">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>Koordinat:</span>
            </div>
            <span className="font-mono text-slate-800 text-[10px] font-medium">
              {inspectedSite.latitude.toFixed(5)}, {inspectedSite.longitude.toFixed(5)}
            </span>
          </div>

          {/* Site Detail Button */}
          <button 
            onClick={() => {
              if (onOpenSiteDetail) onOpenSiteDetail(inspectedSite.siteName);
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
          >
            <span>Site Detail</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
