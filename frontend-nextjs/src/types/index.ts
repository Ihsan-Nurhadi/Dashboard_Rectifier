export interface SiteOverview {
  siteName: string;
  projectId: string;
  ladder: string;
  sla: string;
  statusRealtime: 'Normal' | 'Alarm' | 'Warning';
  statusLadder: 'Over' | 'Normal' | 'Under';
  latitude: number;
  longitude: number;
  lastData: string;
  temperature: number;
  humidity: number;
  vdcOutput: number;
  loadCurrent: number;
  batteryStatus: string;
  socAvg: number;
  fuelLiter?: number;
  gensetStatus?: string;
  plnVoltage?: number;
  solarVoltage?: number;
}

export interface SiteInfo {
  siteName: string;
  projectId: string;
  ladder: string;
  sla: string;
  statusRealtime: 'Normal' | 'Alarm' | 'Warning';
  statusLadder: 'Over' | 'Normal' | 'Under';
  lastData: string; // ISO Date string
  location: {
    lat: number;
    lng: number;
  };
}

export interface EnvironmentStatus {
  doorCabinet: 'Close' | 'Open';
  batteryStolen: 'Close' | 'Open';
  temperature: number;
  humidity: number;
}

export type ModuleStatus = 'Fault' | 'Protect' | 'AC Off' | 'Normal';

export interface RectifierModule {
  id: number;
  status: ModuleStatus;
  value: string; // e.g., LK23290... or serial number
}

export interface RectifierStatus {
  vacInputL1: number;
  vacInputL2: number;
  vacInputL3: number | null; // null if no data like in image
  vdcOutput: number;
  batteryCurrent: number;
  iacInputL1: number | null;
  iacInputL2: number | null;
  iacInputL3: number | null;
  loadCurrent: number;
  loadPower: number;
  pacLoadL1: number;
  pacLoadL2: number;
  pacLoadL3: number;
  rectifierCurrent: number;
  totalPower: number;
}

export interface BatteryBank {
  id: number;
  voltage: number;
  current: number;
  soc: number;
  soh: number;
}

export interface BatteryStatus {
  banks: BatteryBank[];
  backupDuration: number | null; // minutes or null
  timeRemaining: number | null; // minutes or null
  status: 'Standby' | 'Discharging' | 'Charging';
  startBackup: string | 'No data';
  socAvg: number;
}

export interface PowerMeterPLN {
  voltage: number;     // Tegangan (V AC)
  current: number;     // Arus (A AC)
  frequency: number;   // Frekuensi (Hz)
  status: 'Normal' | 'Unstable' | 'Blackout';
}

export interface GensetStatus {
  status: 'Hidup' | 'Mati' | 'Standby'; // Hidup atau Mati
  voltage: number;     // Tegangan (V AC)
  current: number;     // Arus (A AC)
  frequency: number;   // Frekuensi (Hz)
  fuelLiter: number;   // Level fuel dalam liter
  fuelCapacity: number;// Kapasitas tangki fuel (liter)
  fuelPercentage: number; // Persentase (%)
}

export interface SolarMPPT {
  pvVoltage: number;   // Tegangan DC dari Solar Panel (V DC)
  pvCurrent: number;   // Arus Solar Panel (A DC)
  pvPower: number;     // Daya Solar Panel (W)
  dailyEnergy: number; // Energi Harian (kWh)
  status: 'Charging' | 'Standby' | 'Offline';
}

export interface PowerSources {
  pln: PowerMeterPLN;
  genset: GensetStatus;
  solarMppt: SolarMPPT;
}

export interface DashboardData {
  siteInfo: SiteInfo;
  environment: EnvironmentStatus;
  modules: RectifierModule[];
  rectifier: RectifierStatus;
  battery: BatteryStatus;
  powerSources: PowerSources;
}
