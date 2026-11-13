// API Service for connecting to Django backend
import { DashboardData, SiteOverview } from '@/types';
import { getMockSites, getMockDashboardData } from './mockData';

// Dynamic API Base URL resolver that works both in local dev and on VPS
export const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    if (process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL;
    }
    // If running locally in development (Next.js typically on port 3000)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      if (window.location.port === '3000') {
        return 'http://localhost:8000/api';
      }
    }
    // On production VPS (behind Nginx reverse proxy routing /api -> Django)
    return `${window.location.origin}/api`;
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
};

export class RectifierAPI {
  static backendAvailable: boolean = true;

  /**
   * Fetch all monitored sites overview
   */
  static async getSites(): Promise<SiteOverview[]> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const response = await fetch(`${getApiBaseUrl()}/rectifier/sites/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn('Backend returned non-OK for sites list, using simulated data');
        this.backendAvailable = false;
        return getMockSites();
      }

      const sites = (await response.json()) as SiteOverview[];
      if (!sites || sites.length === 0) {
        return getMockSites();
      }

      this.backendAvailable = true;
      return sites;
    } catch (error) {
      console.warn('Backend unreachable (Django offline), falling back to realistic simulation mode');
      this.backendAvailable = false;
      return getMockSites();
    }
  }

  /**
   * Fetch latest dashboard data for a specific site or overall latest
   */
  static async getDashboardData(siteName?: string): Promise<DashboardData> {
    try {
      const baseUrl = getApiBaseUrl();
      const url = siteName
        ? `${baseUrl}/rectifier/dashboard/?site_name=${encodeURIComponent(siteName)}`
        : `${baseUrl}/rectifier/dashboard/`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        this.backendAvailable = false;
        return getMockDashboardData(siteName);
      }

      const data = await response.json();
      if (!data || !data.siteInfo) {
        return getMockDashboardData(siteName);
      }

      this.backendAvailable = true;
      return data as DashboardData;
    } catch (error) {
      this.backendAvailable = false;
      return getMockDashboardData(siteName);
    }
  }

  /**
   * Fetch latest single record
   */
  static async getLatest() {
    try {
      const response = await fetch(`${getApiBaseUrl()}/rectifier/latest/`, {
        cache: 'no-store',
      });

      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      return null;
    }
  }

  /**
   * Fetch statistics
   */
  static async getStats() {
    try {
      const response = await fetch(`${getApiBaseUrl()}/rectifier/stats/`, {
        cache: 'no-store',
      });

      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      return null;
    }
  }

  /**
   * Fetch chart data
   */
  static async getChartData(limit: number = 50) {
    try {
      const response = await fetch(
        `${getApiBaseUrl()}/rectifier/chart_data/?limit=${limit}`,
        {
          cache: 'no-store',
        }
      );

      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      return null;
    }
  }

  /**
   * Fetch all data with limit
   */
  static async getAllData(limit: number = 100) {
    try {
      const response = await fetch(
        `${getApiBaseUrl()}/rectifier/?limit=${limit}`,
        {
          cache: 'no-store',
        }
      );

      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      return null;
    }
  }
}

export default RectifierAPI;
