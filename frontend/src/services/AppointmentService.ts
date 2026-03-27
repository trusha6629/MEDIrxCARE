import { api } from "./ApiService";

export const appointmentService = {
  async getUpcoming() {
    return api.get<any[]>("/appointments/upcoming");
  },

  async getTodaysDoctorAppointments() {
    return api.get<any[]>("/appointments/doctor/today");
  },

  async book(data: any) {
    return api.post<{ success: boolean; appointment: any }>("/appointments", data);
  }
};
