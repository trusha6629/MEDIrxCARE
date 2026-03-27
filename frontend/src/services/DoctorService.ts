import { api } from "./ApiService";

export const DoctorService = {
  async getAllDoctors() {
    return api.get<any[]>("/doctors");
  },

  async addDoctor(doctorData: any) {
    return api.post<{ doctor: any; temporaryPassword: string }>("/doctors", doctorData);
  }
};
