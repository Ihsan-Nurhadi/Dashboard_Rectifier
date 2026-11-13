import { useState, useEffect, useRef } from 'react';
import { DashboardData, SiteOverview } from '@/types';
import { RectifierAPI } from '@/services/api';
import { format } from 'date-fns';

const INITIAL_DATA: DashboardData = {
  siteInfo: {
    siteName: 'Loading...',
    projectId: '',
    ladder: '',
    sla: '',
    statusRealtime: 'Normal',
    statusLadder: 'Normal',
    lastData: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    location: { lat: 0, lng: 0 },
  },
  environment: {
    doorCabinet: 'Close',
    batteryStolen: 'Close',
    temperature: 0,
    humidity: 0,
  },
  modules: [],
  rectifier: {
    vacInputL1: 0,
    vacInputL2: 0,
    vacInputL3: null,
    vdcOutput: 0,
    batteryCurrent: 0,
    iacInputL1: null,
    iacInputL2: null,
    iacInputL3: null,
    loadCurrent: 0,
    loadPower: 0,
    pacLoadL1: 0,
    pacLoadL2: 0,
    pacLoadL3: 0,
    rectifierCurrent: 0,
    totalPower: 0,
  },
  battery: {
    banks: [],
    backupDuration: null,
    timeRemaining: null,
    status: 'Standby',
    startBackup: 'No data',
    socAvg: 0,
  },
  powerSources: {
    pln: {
      voltage: 220.0,
      current: 15.0,
      frequency: 50.0,
      status: 'Normal',
    },
    genset: {
      status: 'Mati',
      voltage: 0.0,
      current: 0.0,
      frequency: 0.0,
      fuelLiter: 120.0,
      fuelCapacity: 200.0,
      fuelPercentage: 60.0,
    },
    solarMppt: {
      pvVoltage: 65.0,
      pvCurrent: 12.0,
      pvPower: 780.0,
      dailyEnergy: 4.8,
      status: 'Charging',
    },
  },
};

export function useDashboardData() {
  const [data, setData] = useState<DashboardData>(INITIAL_DATA);
  const [sites, setSites] = useState<SiteOverview[]>([]);
  const [selectedSite, setSelectedSite] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBackendOnline, setIsBackendOnline] = useState(true);
  const selectedSiteRef = useRef<string | null>(null);
  selectedSiteRef.current = selectedSite;

  const fetchData = async () => {
    try {
      // Fetch sites list and current dashboard data
      const [sitesData, dashboardData] = await Promise.all([
        RectifierAPI.getSites(),
        RectifierAPI.getDashboardData(selectedSiteRef.current || undefined)
      ]);

      setIsBackendOnline(RectifierAPI.backendAvailable);

      if (sitesData && sitesData.length > 0) {
        setSites(sitesData);
        if (!selectedSiteRef.current) {
          setSelectedSite(sitesData[0].siteName);
        }
      }

      if (dashboardData) {
        dashboardData.powerSources = dashboardData.powerSources || INITIAL_DATA.powerSources;
        setData(dashboardData);
        setError(null);
      }
    } catch (err) {
      console.warn('Dashboard fetch error handled gracefully:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Re-fetch immediately when selectedSite changes
  useEffect(() => {
    if (selectedSite) {
      RectifierAPI.getDashboardData(selectedSite).then((dashboardData) => {
        if (dashboardData) {
          dashboardData.powerSources = dashboardData.powerSources || INITIAL_DATA.powerSources;
          setData(dashboardData);
        }
      });
    }
  }, [selectedSite]);

  useEffect(() => {
    // Initial fetch
    fetchData();

    // Poll for updates every 2 seconds
    const interval = setInterval(() => {
      fetchData();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return { 
    data, 
    sites, 
    selectedSite, 
    setSelectedSite, 
    isLoading, 
    error, 
    isBackendOnline,
    refetch: fetchData 
  };
}
