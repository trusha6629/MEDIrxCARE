import { api } from "./ApiService";

export const PatientService = {
  async getAllPatients() {
    return api.get<any[]>("/patients");
  },

  async addPatient(patientData: any) {
    return api.post<{ patient: any; temporaryPassword: string }>("/patients", patientData);
  }
};
