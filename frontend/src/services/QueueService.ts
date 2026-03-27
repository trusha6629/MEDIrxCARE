import { api } from "./ApiService";

export const queueService = {
  async getQueueStatus() {
    return api.get("/queue/status");
  },

  async nextPatient() {
    return api.post("/queue/next", {});
  }
};
