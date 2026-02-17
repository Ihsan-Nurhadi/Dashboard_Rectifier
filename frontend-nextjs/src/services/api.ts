// API Service for connecting to Django backend
import { DashboardData } from '@/types';

// Backend API URL - change this to your Django server URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export class RectifierAPI {
  /**
   * Fetch latest dashboard data
   */
  static async getDashboardData(): Promise<DashboardData | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/rectifier/dashboard/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store', // Always fetch fresh data
      });

      if (!response.ok) {
        console.error('Failed to fetch dashboard data:', response.statusText);
        return null;
      }

      const data = await response.json();
      return data as DashboardData;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      return null;
    }
  }

  /**
   * Fetch latest single record
   */
  static async getLatest() {
    try {
      const response = await fetch(`${API_BASE_URL}/rectifier/latest/`, {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch latest data');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching latest data:', error);
      return null;
    }
  }

  /**
   * Fetch statistics
   */
  static async getStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/rectifier/stats/`, {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching stats:', error);
      return null;
    }
  }

  /**
   * Fetch chart data
   */
  static async getChartData(limit: number = 50) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/rectifier/chart_data/?limit=${limit}`,
        {
          cache: 'no-store',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch chart data');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching chart data:', error);
      return null;
    }
  }

  /**
   * Fetch all data with limit
   */
  static async getAllData(limit: number = 100) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/rectifier/?limit=${limit}`,
        {
          cache: 'no-store',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch all data');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching all data:', error);
      return null;
    }
  }
}

export default RectifierAPI;
