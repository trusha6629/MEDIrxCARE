import { api } from "./ApiService";

export const emergencyService = {
  async sendAlert(location?: { latitude?: number; longitude?: number }) {
    return api.post<{
      success: boolean;
      alertId: string;
      message: string;
      eta: string;
      hospital: {
        name: string;
        hotline: string;
        address: string;
      };
    }>("/emergency/alert", location || {});
  },
};
