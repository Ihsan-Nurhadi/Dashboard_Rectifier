'use client';

import { ArrowLeft, Cpu, RefreshCw } from "lucide-react";
import { SiteInfoCard } from "./SiteInfoCard";
import { EnvironmentStatusCard } from "./EnvironmentStatusCard";
import { RectifierModuleStatusCard } from "./RectifierModuleStatusCard";
import { PowerSourcesCard } from "./PowerSourcesCard";
import { RectifierStatusCard } from "./RectifierStatusCard";
import { BatteryStatusCard } from "./BatteryStatusCard";
import { DashboardData } from "@/types";

interface DeviceDetailSectionProps {
  data: DashboardData;
  onBackToMap: () => void;
  onRefresh?: () => void;
}

export function DeviceDetailSection({ data, onBackToMap, onRefresh }: DeviceDetailSectionProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Detail Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToMap}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Peta</span>
          </button>

          <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>

          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-slate-700" />
            <span className="text-sm font-bold text-slate-900">
              Detail Perangkat: {data.siteInfo.siteName}
            </span>
            <span className="text-xs font-mono text-slate-500">
              ({data.siteInfo.projectId})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className={`text-xs font-bold px-2.5 py-1 rounded uppercase ${
            data.siteInfo.statusRealtime === 'Normal'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-amber-50 text-amber-800 border border-amber-200'
          }`}>
            {data.siteInfo.statusRealtime === 'Normal' ? 'Done / Normal' : 'On Progress / Alert'}
          </span>

          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              title="Perbarui Data Perangkat"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Grid of Device Parameters */}
      <div className="grid grid-cols-12 gap-6">
        {/* Row 1: Site Info */}
        <SiteInfoCard data={data.siteInfo} />
        
        {/* Row 2: Environment & Modules */}
        <EnvironmentStatusCard data={data.environment} />
        <RectifierModuleStatusCard data={data.modules} />

        {/* Row 3: Power Sources (PLN, Genset & Fuel, MPPT Solar Panel) */}
        <PowerSourcesCard data={data.powerSources} />
        
        {/* Row 4: Rectifier Status */}
        <RectifierStatusCard data={data.rectifier} />
        
        {/* Row 4: Battery Status */}
        <BatteryStatusCard data={data.battery} />
      </div>
    </div>
  );
}

