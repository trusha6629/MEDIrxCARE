import { api } from "./ApiService";

export const dashboardService = {
  async getPatientDashboardData() {
    return api.get("/dashboard/patient");
  },

  async getDoctorDashboardData() {
    return api.get("/dashboard/doctor");
  },

  async getAdminStats() {
    return api.get("/dashboard/admin");
  }
};
