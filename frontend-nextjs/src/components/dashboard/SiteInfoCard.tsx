'use client';

import { Card, CardHeader } from "@/components/ui/Card";
import { Info, MapPin } from "lucide-react";
import { SiteInfo } from "@/types";

interface SiteInfoCardProps {
  data: SiteInfo;
}

export function SiteInfoCard({ data }: SiteInfoCardProps) {
  const isNormal = data.statusRealtime === 'Normal';
  const isAlarm = data.statusRealtime === 'Alarm';

  return (
    <Card className="col-span-12 border border-slate-200 shadow-sm p-6 bg-white">
      <CardHeader title="Detail Informasi Site Terpilih" icon={<Info className="w-4 h-4 text-slate-700" />} />
      
      <div className="grid grid-cols-12 gap-6">
        {/* Left Info Column */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-xs font-semibold text-slate-400 uppercase">Site Name</span>
              <span className="text-sm font-bold text-slate-900">{data.siteName}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-xs font-semibold text-slate-400 uppercase">Project ID</span>
              <span className="text-sm font-bold text-slate-900 font-mono">{data.projectId}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-xs font-semibold text-slate-400 uppercase">Ladder</span>
              <span className="text-sm font-bold text-slate-900">{data.ladder}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-400 uppercase">SLA</span>
              <span className="text-sm font-bold text-slate-900">{data.sla}</span>
            </div>
          </div>
        </div>

        {/* Middle Status Column */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4 flex flex-col gap-3">
          <div className={`p-3.5 rounded-xl border ${
            isAlarm ? 'border-red-200 bg-red-50 text-red-800' :
            !isNormal ? 'border-amber-200 bg-amber-50 text-amber-800' :
            'border-emerald-200 bg-emerald-50 text-emerald-800'
          }`}>
            <span className="text-xs font-semibold uppercase block mb-0.5 opacity-80">Status Realtime</span>
            <span className="text-lg font-bold font-mono tracking-tight">{data.statusRealtime}</span>
          </div>
          
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800">
            <span className="text-xs font-semibold text-slate-500 uppercase block mb-0.5">Status Ladder</span>
            <span className="text-lg font-bold font-mono tracking-tight">{data.statusLadder}</span>
          </div>
        </div>

        {/* Right Coordinates & Time Column */}
        <div className="col-span-12 lg:col-span-4 flex flex-col justify-between gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase mb-1">
              <MapPin className="w-3.5 h-3.5 text-slate-600" />
              <span>Koordinat Lokasi</span>
            </div>
            <div className="font-mono text-sm font-bold text-slate-800">
              {data.location.lat.toFixed(6)}, {data.location.lng.toFixed(6)}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200">
            <span className="text-xs font-semibold text-slate-400 uppercase block mb-0.5">Waktu Data Terakhir</span>
            <span className="text-xs font-mono text-slate-700 font-medium">{data.lastData}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
