"use client";

import { Header } from "@/components/layout/Header";
import { SiteInfoCard } from "@/components/dashboard/SiteInfoCard";
import { EnvironmentStatusCard } from "@/components/dashboard/EnvironmentStatusCard";
import { RectifierModuleStatusCard } from "@/components/dashboard/RectifierModuleStatusCard";
import { RectifierStatusCard } from "@/components/dashboard/RectifierStatusCard";
import { BatteryStatusCard } from "@/components/dashboard/BatteryStatusCard";
import { useDashboardData } from "@/hooks/useDashboardData";

export default function Dashboard() {
  const { data, isLoading, error } = useDashboardData();

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-6 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl font-semibold mb-4">⚠️ Connection Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">
            Make sure Django backend is running at{' '}
            <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:8000</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <Header />
        
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        )}
        
        {!isLoading && (
          <>
            <div className="grid grid-cols-12 gap-6">
              {/* Row 1: Site Info */}
              <SiteInfoCard data={data.siteInfo} />
              
              {/* Row 2: Environment & Modules */}
              <EnvironmentStatusCard data={data.environment} />
              <RectifierModuleStatusCard data={data.modules} />
              
              {/* Row 3: Rectifier Status */}
              <RectifierStatusCard data={data.rectifier} />
              
              {/* Row 4: Battery Status */}
              <BatteryStatusCard data={data.battery} />
            </div>
            
            <footer className="text-center text-xs text-gray-400 mt-12 pb-4 font-mono">
              Last updated: {data.siteInfo.lastData} UTC
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
