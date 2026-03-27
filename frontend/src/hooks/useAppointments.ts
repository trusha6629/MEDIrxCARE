import { useState, useEffect } from 'react';
import { appointmentService } from '../services/AppointmentService';

/**
 * Hook for managing upcoming appointments
 */
export function useAppointments(role: 'patient' | 'doctor' = 'patient') {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = role === 'doctor' 
        ? await appointmentService.getTodaysDoctorAppointments()
        : await appointmentService.getUpcoming();
      setAppointments(data as any[]);
    } catch (err) {
      setError('Failed to fetch appointments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [role]);

  return { appointments, loading, error, refresh: fetchAppointments };
}
