"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Header } from "@/components/layout/Header";
import { SiteSidebar } from "@/components/dashboard/SiteSidebar";
import { DeviceDetailSection } from "@/components/dashboard/DeviceDetailSection";
import { useDashboardData } from "@/hooks/useDashboardData";

// Dynamically import Map with ssr: false to avoid window errors in Next.js
const Map = dynamic(() => import("@/components/ui/Map"), { 
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-slate-100 flex flex-col items-center justify-center text-slate-500 text-sm">
      <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin mb-2"></div>
      <span className="font-medium">Memuat peta seluruh site...</span>
    </div>
  )
});

export default function Dashboard() {
  const { data, sites, selectedSite, setSelectedSite, isLoading, error, isBackendOnline, refetch } = useDashboardData();
  const [currentView, setCurrentView] = useState<'map' | 'detail'>('map');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Monitor native browser fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (typeof document === 'undefined') return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const handleSelectSite = (siteName: string) => {
    setSelectedSite(siteName);
  };

  const handleOpenSiteDetail = (siteName: string) => {
    setSelectedSite(siteName);
    setCurrentView('detail');
  };

  const handleBackToMap = () => {
    setCurrentView('map');
  };

  // Loading state before first data arrives
  if (isLoading && sites.length === 0) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-100">
        <div className="w-9 h-9 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin mb-3"></div>
        <p className="text-slate-700 text-sm font-semibold">Memuat IPLH Monitoring System...</p>
      </div>
    );
  }

  // 1. FULLSCREEN MAP VIEW WITH SIDEBAR
  if (currentView === 'map') {
    return (
      <div className="h-screen w-screen overflow-hidden flex flex-col bg-slate-100">
        {/* Sleek Top Header Navigation */}
        <Header 
          onRefresh={refetch} 
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          sitesCount={sites.length}
          isBackendOnline={isBackendOnline}
        />

        {/* Main Area: Sidebar + Fullscreen Map */}
        <div className="flex-1 w-full h-[calc(100vh-3.25rem)] flex relative overflow-hidden">
          {/* Left Sidebar: Site Explorer with Search Bar */}
          <SiteSidebar 
            sites={sites}
            selectedSiteName={selectedSite}
            onSelectSite={handleSelectSite}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          {/* Fullscreen Map Area */}
          <main className="flex-1 h-full w-full relative overflow-hidden">
            <Map 
              sites={sites}
              selectedSiteName={selectedSite}
              onSelectSite={handleSelectSite}
              onOpenSiteDetail={handleOpenSiteDetail}
              isFullscreen={isFullscreen}
              onToggleFullscreen={toggleFullscreen}
            />
          </main>
        </div>
      </div>
    );
  }

  // 2. DEVICE DETAIL PAGE (Opened via "Site Detail" button)
  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col">
      <Header 
        onRefresh={refetch} 
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        isSidebarOpen={false}
        sitesCount={sites.length}
        isBackendOnline={isBackendOnline}
      />

      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 md:p-8 space-y-6">
        <DeviceDetailSection 
          data={data}
          onBackToMap={handleBackToMap}
          onRefresh={refetch}
        />
        
        <footer className="text-center text-xs text-slate-400 mt-8 pb-4 font-mono">
          IPLH Monitoring System • Waktu data: {data.siteInfo.lastData} • Solid Matte UI
        </footer>
      </main>
    </div>
  );
}
