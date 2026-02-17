import { useState, useEffect } from 'react';
import { DashboardData } from '@/types';
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
};

export function useDashboardData() {
  const [data, setData] = useState<DashboardData>(INITIAL_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const dashboardData = await RectifierAPI.getDashboardData();
      
      if (dashboardData) {
        setData(dashboardData);
        setError(null);
      } else {
        setError('No data available from backend');
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to fetch data from backend');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchData();

    // Poll for updates every 2 seconds
    const interval = setInterval(() => {
      fetchData();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return { data, isLoading, error };
}
