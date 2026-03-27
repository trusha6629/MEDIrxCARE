import { useState, useEffect } from 'react';
import { dashboardService } from '../services/DashboardService';

/**
 * Hook for managing dashboard statistics based on role
 */
export function useDashboardStats(role: 'patient' | 'doctor' | 'admin') {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      let data;
      if (role === 'patient') {
        data = await dashboardService.getPatientDashboardData();
      } else if (role === 'doctor') {
        data = await dashboardService.getDoctorDashboardData();
      } else {
        data = await dashboardService.getAdminStats();
      }
      setStats(data);
    } catch (err) {
      setError('Failed to fetch dashboard statistics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [role]);

  return { stats, loading, error, refresh: fetchStats };
}
