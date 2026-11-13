'use client';

import { Card, CardHeader } from "@/components/ui/Card";
import { Zap, Fuel, Sun, Power, Activity } from "lucide-react";
import { PowerSources } from "@/types";

interface PowerSourcesCardProps {
  data: PowerSources;
}

export function PowerSourcesCard({ data }: PowerSourcesCardProps) {
  const { pln, genset, solarMppt } = data;
  const isGensetRunning = genset.status === 'Hidup';
  const isPlnNormal = pln.status === 'Normal';

  return (
    <div className="col-span-12 grid grid-cols-12 gap-6">
      {/* 1. POWER METER PLN (AC) */}
      <Card className="col-span-12 lg:col-span-4 border border-slate-200 shadow-sm p-5 bg-white flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-slate-100 rounded-lg text-slate-800">
                <Zap className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Power Meter PLN</h3>
                <span className="text-[10px] text-slate-400">Main AC Grid Power</span>
              </div>
            </div>

            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
              isPlnNormal 
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {pln.status}
            </span>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            {/* Tegangan AC */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex flex-col justify-between">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Tegangan</span>
              <div className="mt-1">
                <span className="text-lg font-bold font-mono text-slate-900">{pln.voltage}</span>
                <span className="text-[10px] text-slate-500 ml-1">V</span>
              </div>
            </div>

            {/* Arus AC */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex flex-col justify-between">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Arus</span>
              <div className="mt-1">
                <span className="text-lg font-bold font-mono text-slate-900">{pln.current}</span>
                <span className="text-[10px] text-slate-500 ml-1">A</span>
              </div>
            </div>

            {/* Frekuensi AC */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex flex-col justify-between">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Frekuensi</span>
              <div className="mt-1">
                <span className="text-lg font-bold font-mono text-slate-900">{pln.frequency}</span>
                <span className="text-[10px] text-slate-500 ml-1">Hz</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Sumber: PLN AC Grid (50 Hz)</span>
          <span className="font-mono font-medium text-slate-700">1 Phase / 3 Phase</span>
        </div>
      </Card>

      {/* 2. GENSET & FUEL LEVEL */}
      <Card className="col-span-12 lg:col-span-4 border border-slate-200 shadow-sm p-5 bg-white flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-slate-100 rounded-lg text-slate-800">
                <Power className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Genset & Fuel Tank</h3>
                <span className="text-[10px] text-slate-400">Auxiliary Backup Generator</span>
              </div>
            </div>

            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
              isGensetRunning 
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                : 'bg-slate-100 text-slate-700 border border-slate-200'
            }`}>
              {genset.status}
            </span>
          </div>

          {/* Genset Voltage, Current & Fuel */}
          <div className="grid grid-cols-3 gap-2 text-xs mb-3">
            {/* Status Genset */}
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">Status</span>
              <span className={`text-sm font-bold font-mono ${
                isGensetRunning ? 'text-emerald-700' : 'text-slate-700'
              }`}>
                {genset.status}
              </span>
            </div>

            {/* Tegangan Genset */}
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">Tegangan</span>
              <div className="font-mono font-bold text-slate-900 text-sm">
                {genset.voltage} <span className="text-[10px] text-slate-500 font-normal">V</span>
              </div>
            </div>

            {/* Arus Genset */}
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">Arus</span>
              <div className="font-mono font-bold text-slate-900 text-sm">
                {genset.current} <span className="text-[10px] text-slate-500 font-normal">A</span>
              </div>
            </div>
          </div>

          {/* Fuel Level Container */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                <Fuel className="w-3.5 h-3.5 text-amber-600" />
                <span>Level Fuel:</span>
              </div>
              <div className="font-mono font-bold text-slate-900">
                <span>{genset.fuelLiter}</span>
                <span className="text-[10px] text-slate-500 font-normal ml-1">/ {genset.fuelCapacity} Liter</span>
                <span className="text-[10px] text-slate-500 font-normal ml-1.5">({genset.fuelPercentage}%)</span>
              </div>
            </div>

            {/* Fuel Progress Bar */}
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 rounded-full ${
                  genset.fuelPercentage < 25 
                    ? 'bg-red-500' 
                    : genset.fuelPercentage < 50 
                    ? 'bg-amber-500' 
                    : 'bg-emerald-600'
                }`}
                style={{ width: `${Math.min(genset.fuelPercentage, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Frekuensi: {genset.frequency} Hz</span>
          <span>Bahan Bakar: Solar Diesel</span>
        </div>
      </Card>

      {/* 3. MPPT SOLAR PANEL (DC) */}
      <Card className="col-span-12 lg:col-span-4 border border-slate-200 shadow-sm p-5 bg-white flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-slate-100 rounded-lg text-slate-800">
                <Sun className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">MPPT Solar Panel</h3>
                <span className="text-[10px] text-slate-400">Photovoltaic DC Input</span>
              </div>
            </div>

            <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
              {solarMppt.status}
            </span>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* Tegangan DC dari Solar Panel - PARAMETER UTAMA */}
            <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-200/80 flex flex-col justify-between col-span-2">
              <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wide">
                Tegangan DC Solar Panel
              </span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold font-mono text-slate-900">{solarMppt.pvVoltage}</span>
                <span className="text-xs font-bold text-amber-700">V DC</span>
              </div>
            </div>

            {/* Arus Solar Panel */}
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">Arus Solar</span>
              <div className="font-mono font-bold text-slate-900 text-sm">
                {solarMppt.pvCurrent} <span className="text-[10px] text-slate-500 font-normal">A</span>
              </div>
            </div>

            {/* Daya Solar Panel */}
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">Daya PV</span>
              <div className="font-mono font-bold text-slate-900 text-sm">
                {solarMppt.pvPower} <span className="text-[10px] text-slate-500 font-normal">W</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Energi Harian: <strong className="text-slate-800 font-mono">{solarMppt.dailyEnergy} kWh</strong></span>
          <span className="text-emerald-700 font-medium">MPPT Active</span>
        </div>
      </Card>
    </div>
  );
}

