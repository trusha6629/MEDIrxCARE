export const CONSULTATION_PRICE_CAPS = {
  online: 499,
  offline: 799,
} as const;

export const PLATFORM_FEE = 19;

export function getConsultationFee(
  doctor: { onlineFee?: number; offlineFee?: number } | null | undefined,
  mode: "online" | "offline",
) {
  if (mode === "online") {
    return Math.min(doctor?.onlineFee ?? CONSULTATION_PRICE_CAPS.online, CONSULTATION_PRICE_CAPS.online);
  }

  return Math.min(doctor?.offlineFee ?? CONSULTATION_PRICE_CAPS.offline, CONSULTATION_PRICE_CAPS.offline);
}
