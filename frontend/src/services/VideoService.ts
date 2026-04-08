import { api } from "./ApiService";

export const videoService = {
  async join(appointmentId: string) {
    return api.post<{
      role: "doctor" | "patient";
      appointment: any;
      rtcConfiguration: RTCConfiguration;
    }>(`/video/${appointmentId}/join`, {});
  },

  async getEvents(appointmentId: string, after = 0) {
    return api.get<{ events: Array<{ id: number; type: string; payload: any; createdAt: string }> }>(
      `/video/${appointmentId}/events?after=${after}`,
    );
  },

  async postEvent(appointmentId: string, type: string, payload: any = {}) {
    return api.post<{ success: boolean }>(`/video/${appointmentId}/events`, {
      type,
      payload,
    });
  },
};
