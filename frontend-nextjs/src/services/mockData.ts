import { DashboardData, SiteOverview } from '@/types';
import { format } from 'date-fns';

interface RawSiteData {
  siteName: string;
  projectId: string;
  ladder: string;
  sla: string;
  statusRealtime: 'Normal' | 'Alarm' | 'Warning';
  statusLadder: 'Over' | 'Normal' | 'Under';
  latitude: number;
  longitude: number;
  temperature: number;
  humidity: number;
  vacInputL1: number;
  vacInputL2: number;
  vdcOutput: number;
  loadCurrent: number;
  totalPower: number;
  batteryStatus: 'Standby' | 'Discharging' | 'Charging';
  socAvg: number;
  b1: number;
  b2: number;
  b3: number;
  plnVoltage: number;
  plnCurrent: number;
  plnFrequency: number;
  plnStatus: 'Normal' | 'Unstable' | 'Blackout';
  gensetStatus: 'Hidup' | 'Mati' | 'Standby';
  fuelLiter: number;
  fuelCapacity: number;
  solarPvVoltage: number;
  solarPvCurrent: number;
  solarPvPower: number;
  solarDailyEnergy: number;
}

const RAW_SITES: RawSiteData[] = [
  {
    siteName: 'NYK_SERANG_01',
    projectId: '23XL05C0008',
    ladder: 'Ladder-1',
    sla: '2 Hour',
    statusRealtime: 'Normal',
    statusLadder: 'Normal',
    latitude: -6.115286,
    longitude: 106.154228,
    temperature: 31.4,
    humidity: 65.0,
    vacInputL1: 220.0,
    vacInputL2: 221.5,
    vdcOutput: 53.9,
    loadCurrent: 48.5,
    totalPower: 2.61,
    batteryStatus: 'Standby',
    socAvg: 98.2,
    b1: 53.40,
    b2: 53.45,
    b3: 53.30,
    plnVoltage: 220.5,
    plnCurrent: 14.8,
    plnFrequency: 50.0,
    plnStatus: 'Normal',
    gensetStatus: 'Mati',
    fuelLiter: 140.0,
    fuelCapacity: 200.0,
    solarPvVoltage: 66.5,
    solarPvCurrent: 12.5,
    solarPvPower: 831.0,
    solarDailyEnergy: 5.4,
  },
  {
    siteName: 'NYK_WORKSHOP',
    projectId: '23XL05C0027',
    ladder: 'Ladder-1',
    sla: '2 Hour',
    statusRealtime: 'Normal',
    statusLadder: 'Over',
    latitude: -6.305489,
    longitude: 106.958651,
    temperature: 33.6,
    humidity: 62.2,
    vacInputL1: 203.20,
    vacInputL2: 225.10,
    vdcOutput: 54.0,
    loadCurrent: 63.7,
    totalPower: 3.44,
    batteryStatus: 'Standby',
    socAvg: 97.5,
    b1: 53.34,
    b2: 53.42,
    b3: 52.90,
    plnVoltage: 221.4,
    plnCurrent: 15.2,
    plnFrequency: 50.1,
    plnStatus: 'Normal',
    gensetStatus: 'Mati',
    fuelLiter: 145.0,
    fuelCapacity: 200.0,
    solarPvVoltage: 68.5,
    solarPvCurrent: 14.2,
    solarPvPower: 972.7,
    solarDailyEnergy: 6.2,
  },
  {
    siteName: 'NYK_CENTRAL_JKT',
    projectId: '23XL05C0012',
    ladder: 'Ladder-2',
    sla: '4 Hour',
    statusRealtime: 'Normal',
    statusLadder: 'Normal',
    latitude: -6.182341,
    longitude: 106.828452,
    temperature: 28.4,
    humidity: 58.1,
    vacInputL1: 218.40,
    vacInputL2: 220.30,
    vdcOutput: 53.8,
    loadCurrent: 45.2,
    totalPower: 2.43,
    batteryStatus: 'Standby',
    socAvg: 99.0,
    b1: 53.50,
    b2: 53.60,
    b3: 53.40,
    plnVoltage: 219.0,
    plnCurrent: 12.8,
    plnFrequency: 49.9,
    plnStatus: 'Normal',
    gensetStatus: 'Mati',
    fuelLiter: 160.0,
    fuelCapacity: 200.0,
    solarPvVoltage: 64.2,
    solarPvCurrent: 11.5,
    solarPvPower: 738.3,
    solarDailyEnergy: 4.9,
  },
  {
    siteName: 'NYK_SUBANG_NODE',
    projectId: '23XL05C0019',
    ladder: 'Ladder-1',
    sla: '2 Hour',
    statusRealtime: 'Normal',
    statusLadder: 'Normal',
    latitude: -6.571589,
    longitude: 107.758736,
    temperature: 30.1,
    humidity: 67.4,
    vacInputL1: 219.0,
    vacInputL2: 218.0,
    vdcOutput: 54.2,
    loadCurrent: 55.0,
    totalPower: 2.98,
    batteryStatus: 'Standby',
    socAvg: 96.8,
    b1: 53.60,
    b2: 53.55,
    b3: 53.62,
    plnVoltage: 220.2,
    plnCurrent: 13.9,
    plnFrequency: 50.0,
    plnStatus: 'Normal',
    gensetStatus: 'Mati',
    fuelLiter: 135.0,
    fuelCapacity: 200.0,
    solarPvVoltage: 67.0,
    solarPvCurrent: 13.0,
    solarPvPower: 871.0,
    solarDailyEnergy: 5.8,
  },
  {
    siteName: 'NYK_BANDUNG_HUB',
    projectId: '23XL05C0035',
    ladder: 'Ladder-1',
    sla: '2 Hour',
    statusRealtime: 'Warning',
    statusLadder: 'Over',
    latitude: -6.914744,
    longitude: 107.609810,
    temperature: 36.8,
    humidity: 72.0,
    vacInputL1: 198.50,
    vacInputL2: 202.10,
    vdcOutput: 53.2,
    loadCurrent: 78.4,
    totalPower: 4.17,
    batteryStatus: 'Discharging',
    socAvg: 88.4,
    b1: 52.40,
    b2: 52.80,
    b3: 52.10,
    plnVoltage: 202.0,
    plnCurrent: 18.4,
    plnFrequency: 49.6,
    plnStatus: 'Unstable',
    gensetStatus: 'Standby',
    fuelLiter: 65.0,
    fuelCapacity: 200.0,
    solarPvVoltage: 58.0,
    solarPvCurrent: 8.4,
    solarPvPower: 487.2,
    solarDailyEnergy: 3.1,
  },
  {
    siteName: 'NYK_SEMARANG_SITE',
    projectId: '23XL05C0051',
    ladder: 'Ladder-2',
    sla: '2 Hour',
    statusRealtime: 'Normal',
    statusLadder: 'Under',
    latitude: -6.993200,
    longitude: 110.420300,
    temperature: 29.8,
    humidity: 60.3,
    vacInputL1: 215.30,
    vacInputL2: 219.00,
    vdcOutput: 53.9,
    loadCurrent: 58.6,
    totalPower: 3.16,
    batteryStatus: 'Standby',
    socAvg: 97.8,
    b1: 53.40,
    b2: 53.50,
    b3: 53.30,
    plnVoltage: 221.0,
    plnCurrent: 14.5,
    plnFrequency: 50.0,
    plnStatus: 'Normal',
    gensetStatus: 'Mati',
    fuelLiter: 150.0,
    fuelCapacity: 200.0,
    solarPvVoltage: 69.2,
    solarPvCurrent: 13.8,
    solarPvPower: 955.0,
    solarDailyEnergy: 6.4,
  },
  {
    siteName: 'NYK_SURABAYA_NODE',
    projectId: '23XL05C0044',
    ladder: 'Ladder-3',
    sla: '4 Hour',
    statusRealtime: 'Normal',
    statusLadder: 'Normal',
    latitude: -7.257472,
    longitude: 112.752088,
    temperature: 31.2,
    humidity: 64.5,
    vacInputL1: 222.10,
    vacInputL2: 224.00,
    vdcOutput: 54.1,
    loadCurrent: 52.0,
    totalPower: 2.81,
    batteryStatus: 'Standby',
    socAvg: 99.2,
    b1: 53.70,
    b2: 53.65,
    b3: 53.72,
    plnVoltage: 222.5,
    plnCurrent: 13.2,
    plnFrequency: 50.1,
    plnStatus: 'Normal',
    gensetStatus: 'Mati',
    fuelLiter: 175.0,
    fuelCapacity: 200.0,
    solarPvVoltage: 70.4,
    solarPvCurrent: 14.5,
    solarPvPower: 1020.8,
    solarDailyEnergy: 7.1,
  },
];

// Helper for safe jitter within safe bounds
function jitter(val: number, delta: number, minVal: number, maxVal: number, decimals: number = 1): number {
  const change = (Math.random() * 2 - 1) * delta;
  const clamped = Math.max(minVal, Math.min(maxVal, val + change));
  return Number(clamped.toFixed(decimals));
}

export function getMockSites(): SiteOverview[] {
  const nowStr = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  return RAW_SITES.map((s) => ({
    siteName: s.siteName,
    projectId: s.projectId,
    ladder: s.ladder,
    sla: s.sla,
    statusRealtime: s.statusRealtime,
    statusLadder: s.statusLadder,
    latitude: s.latitude,
    longitude: s.longitude,
    lastData: nowStr,
    temperature: jitter(s.temperature, 0.4, 25.0, 42.0),
    humidity: jitter(s.humidity, 0.6, 40.0, 85.0),
    vdcOutput: jitter(s.vdcOutput, 0.1, 52.0, 56.0),
    loadCurrent: jitter(s.loadCurrent, 0.8, 30.0, 95.0),
    batteryStatus: s.batteryStatus,
    socAvg: jitter(s.socAvg, 0.2, 70.0, 100.0),
    plnVoltage: s.plnVoltage,
    gensetStatus: s.gensetStatus,
    fuelLiter: s.fuelLiter,
    solarVoltage: s.solarPvVoltage,
  }));
}

export function getMockDashboardData(siteName?: string): DashboardData {
  const targetName = siteName || RAW_SITES[0].siteName;
  const s = RAW_SITES.find((x) => x.siteName === targetName) || RAW_SITES[0];
  const nowStr = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

  const vdc = jitter(s.vdcOutput, 0.1, 52.0, 56.0);
  const loadCur = jitter(s.loadCurrent, 0.8, 30.0, 95.0);
  const temp = jitter(s.temperature, 0.3, 26.0, 40.0);
  const hum = jitter(s.humidity, 0.5, 45.0, 80.0);
  const plnV = jitter(s.plnVoltage, 1.2, 205.0, 235.0);
  const plnI = jitter(s.plnCurrent, 0.4, 10.0, 25.0);
  const plnF = jitter(s.plnFrequency, 0.05, 49.8, 50.2, 2);
  const pvV = jitter(s.solarPvVoltage, 0.6, 55.0, 75.0);
  const pvI = jitter(s.solarPvCurrent, 0.3, 8.0, 18.0);
  const pvP = Number((pvV * pvI).toFixed(1));
  const fuelLit = jitter(s.fuelLiter, 0.1, 20.0, s.fuelCapacity);

  return {
    siteInfo: {
      siteName: s.siteName,
      projectId: s.projectId,
      ladder: s.ladder,
      sla: s.sla,
      statusRealtime: s.statusRealtime,
      statusLadder: s.statusLadder,
      lastData: nowStr,
      location: {
        lat: s.latitude,
        lng: s.longitude,
      },
    },
    environment: {
      doorCabinet: 'Close',
      batteryStolen: 'Close',
      temperature: temp,
      humidity: hum,
    },
    modules: [
      { id: 1, status: s.statusRealtime === 'Normal' ? 'Normal' : 'Fault', value: 'LK23290001' },
      { id: 2, status: s.statusRealtime === 'Normal' ? 'Normal' : 'Protect', value: 'LK23140002' },
      { id: 3, status: 'Normal', value: 'LK23140003' },
      { id: 4, status: 'Normal', value: 'LK23140004' },
      { id: 5, status: 'Normal', value: 'LK23140005' },
    ],
    rectifier: {
      vacInputL1: jitter(s.vacInputL1, 1.5, 195.0, 235.0),
      vacInputL2: jitter(s.vacInputL2, 1.5, 195.0, 235.0),
      vacInputL3: null,
      vdcOutput: vdc,
      batteryCurrent: 0.0,
      iacInputL1: null,
      iacInputL2: null,
      iacInputL3: null,
      loadCurrent: loadCur,
      loadPower: Number(((vdc * loadCur) / 1000).toFixed(2)),
      pacLoadL1: Number((s.totalPower * 0.52).toFixed(2)),
      pacLoadL2: Number((s.totalPower * 0.48).toFixed(2)),
      pacLoadL3: 0,
      rectifierCurrent: loadCur,
      totalPower: Number(((vdc * loadCur) / 1000).toFixed(2)),
    },
    battery: {
      banks: [
        { id: 1, voltage: jitter(s.b1, 0.05, 52.0, 54.5, 2), current: 0.0, soc: 98, soh: 100 },
        { id: 2, voltage: jitter(s.b2, 0.05, 52.0, 54.5, 2), current: 0.0, soc: 97, soh: 100 },
        { id: 3, voltage: jitter(s.b3, 0.05, 52.0, 54.5, 2), current: 0.0, soc: 98, soh: 100 },
      ],
      backupDuration: null,
      timeRemaining: null,
      status: s.batteryStatus,
      startBackup: 'No data',
      socAvg: jitter(s.socAvg, 0.2, 75.0, 100.0),
    },
    powerSources: {
      pln: {
        voltage: plnV,
        current: plnI,
        frequency: plnF,
        status: s.plnStatus,
      },
      genset: {
        status: s.gensetStatus,
        voltage: s.gensetStatus === 'Mati' ? 0.0 : 220.0,
        current: s.gensetStatus === 'Mati' ? 0.0 : 15.0,
        frequency: s.gensetStatus === 'Mati' ? 0.0 : 50.0,
        fuelLiter: fuelLit,
        fuelCapacity: s.fuelCapacity,
        fuelPercentage: Number(((fuelLit / s.fuelCapacity) * 100).toFixed(1)),
      },
      solarMppt: {
        pvVoltage: pvV,
        pvCurrent: pvI,
        pvPower: pvP,
        dailyEnergy: s.solarDailyEnergy,
        status: 'Charging',
      },
    },
  };
}
