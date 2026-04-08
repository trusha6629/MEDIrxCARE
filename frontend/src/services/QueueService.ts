import { api } from "./ApiService";

export const queueService = {
  async getQueueStatus(doctorId?: string) {
    const query = doctorId ? `?doctorId=${encodeURIComponent(doctorId)}` : "";
    return api.get(`/queue/status${query}`);
  },

  async nextPatient() {
    return api.post("/queue/next", {});
  }
};
