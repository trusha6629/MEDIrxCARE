import { useState } from "react";
import { Ambulance, PhoneCall, ShieldAlert } from "lucide-react";
import { Button } from "../common/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../common/DropdownMenu";
import { emergencyService } from "../../services/EmergencyService";

function EmergencyResponseMark({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" aria-hidden="true" className={className}>
      <path
        d="M5.5 8.75c1.06-1.47 2.53-2.6 4.27-3.26"
        fill="none"
        opacity="0.72"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <path
        d="M22.5 8.75c-1.06-1.47-2.53-2.6-4.27-3.26"
        fill="none"
        opacity="0.72"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <path
        d="M14 6.75c-3.84 0-6.95 3.11-6.95 6.95v4.6c0 1.07.88 1.95 1.95 1.95h10c1.07 0 1.95-.88 1.95-1.95v-4.6c0-3.84-3.11-6.95-6.95-6.95Z"
        fill="currentColor"
      />
      <path
        d="M13.15 10.1c0-.39.31-.7.7-.7h.3c.39 0 .7.31.7.7v1.96h1.96c.39 0 .7.31.7.7v.3c0 .39-.31.7-.7.7h-1.96v1.96c0 .39-.31.7-.7.7h-.3c-.39 0-.7-.31-.7-.7v-1.96h-1.96c-.39 0-.7-.31-.7-.7v-.3c0-.39.31-.7.7-.7h1.96V10.1Z"
        fill="#ef4444"
      />
      <path d="M12.15 5.35h3.7" fill="none" opacity="0.9" stroke="currentColor" strokeLinecap="round" strokeWidth="1.4" />
    </svg>
  );
}

function getCurrentLocation() {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return Promise.resolve(null);
  }

  return new Promise<{ latitude: number; longitude: number } | null>((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      () => resolve(null),
      {
        enableHighAccuracy: true,
        timeout: 5000,
      },
    );
  });
}

export function EmergencyAlertButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [response, setResponse] = useState<null | {
    alertId: string;
    message: string;
    eta: string;
    hospital: {
      name: string;
      hotline: string;
      address: string;
    };
  }>(null);

  const handleEmergencyAlert = async () => {
    try {
      setIsSending(true);
      setError("");
      setIsOpen(true);

      const coordinates = await getCurrentLocation();
      const nextResponse = await emergencyService.sendAlert(coordinates || undefined);
      setResponse(nextResponse);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to send emergency alert.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="group relative flex h-11 w-11 items-center justify-center rounded-2xl border border-red-200 bg-[linear-gradient(135deg,_#ef4444_0%,_#dc2626_55%,_#b91c1c_100%)] text-white shadow-lg shadow-red-500/20 transition-all hover:-translate-y-0.5 hover:shadow-red-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
          aria-label="Emergency alert"
        >
          <span className="pointer-events-none absolute inset-[5px] rounded-[1rem] border border-white/15 bg-white/8 transition-all group-hover:bg-white/12" />
          <span className="pointer-events-none absolute left-1 top-1/2 h-4 w-1.5 -translate-y-1/2 rounded-full bg-white/45 blur-[1px]" />
          <span className="pointer-events-none absolute right-1 top-1/2 h-4 w-1.5 -translate-y-1/2 rounded-full bg-red-100/80 blur-[1px]" />
          <EmergencyResponseMark className="relative h-5 w-5 animate-pulse" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="mt-2 w-[360px] rounded-[1.6rem] border border-red-100 bg-white p-0 shadow-2xl shadow-red-500/10 dark:border-red-950/50 dark:bg-slate-950"
      >
        <div className="overflow-hidden rounded-[1.6rem]">
          <div className="bg-[linear-gradient(135deg,_#ef4444_0%,_#dc2626_55%,_#b91c1c_100%)] px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                <EmergencyResponseMark className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-100">Emergency Response</p>
                <h3 className="mt-1 text-lg font-semibold">Ambulance Alert</h3>
              </div>
            </div>
          </div>

          <div className="space-y-4 p-5">
            {response ? (
              <>
                <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-950/40 dark:bg-red-950/20 dark:text-red-200">
                  <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
                  <div>
                    <p className="font-semibold">Ambulance coordination confirmed</p>
                    <p className="mt-1">{response.message}</p>
                  </div>
                </div>

                <div className="grid gap-3">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Assigned hospital</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-50">{response.hospital.name}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{response.hospital.address}</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Estimated arrival</p>
                      <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-50">{response.eta}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Hotline</p>
                      <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-50">{response.hospital.hotline}</p>
                    </div>
                  </div>
                </div>

                <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Alert ID: {response.alertId}</p>

                <Button
                  onClick={handleEmergencyAlert}
                  disabled={isSending}
                  className="h-11 w-full rounded-2xl bg-red-600 text-white hover:bg-red-700"
                >
                  <Ambulance className="h-4 w-4" />
                  {isSending ? "Updating emergency alert..." : "Send Another Alert"}
                </Button>
              </>
            ) : (
              <>
                <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700 dark:border-red-950/40 dark:bg-red-950/20 dark:text-red-200">
                  Use this only for urgent medical emergencies. Your location is shared with the nearest MEDIrxCARE emergency desk when available.
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Dispatch</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-50">Nearest ambulance desk</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Response mode</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-50">Immediate escalation</p>
                  </div>
                </div>

                <Button
                  onClick={handleEmergencyAlert}
                  disabled={isSending}
                  className="h-11 w-full rounded-2xl bg-red-600 text-white hover:bg-red-700"
                >
                  <Ambulance className="h-4 w-4" />
                  {isSending ? "Contacting ambulance desk..." : "Send Emergency Alert"}
                </Button>
              </>
            )}

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-950/50 dark:bg-red-950/30 dark:text-red-200">
                {error}
              </div>
            )}

            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              <PhoneCall className="h-3.5 w-3.5" />
              Emergency use only
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
