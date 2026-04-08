import { Activity, CalendarClock, CheckCircle2, Clock3, Hash, RefreshCw, Route, Users } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "../common/Button";
import { Card } from "../common/Card";
import { useQueue } from "../../hooks/useQueue";
import { LoadingSpinner } from "../common/LoadingSpinner";

export function QueueStatus() {
  const navigate = useNavigate();
  const { queue, loading, error, refresh } = useQueue();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Card className="rounded-[1.8rem] border border-red-200 bg-red-50 p-6 shadow-sm">
        <p className="text-sm font-medium text-red-700">{error}</p>
      </Card>
    );
  }

  if (!queue?.patientToken) {
    return (
      <Card className="rounded-[1.8rem] border-0 bg-white p-6 shadow-md dark:bg-slate-950">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-600">Queue Status</p>
            <h3 className="mt-2 text-xl font-semibold text-gray-900 dark:text-slate-50">No consultant queue booked yet</h3>
            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500 dark:text-slate-400">
              Once you book an in-person consultant appointment, your queue position and estimated waiting time will appear here automatically.
            </p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300">
            <Users className="h-6 w-6" />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            onClick={() => navigate("/dashboard/book-appointment")}
            className="rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-500 px-5 text-white hover:from-cyan-700 hover:to-teal-600"
          >
            Book Consultant Visit
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard/doctor-directory")}
            className="rounded-2xl border-gray-200 px-5"
          >
            Browse Doctors
          </Button>
        </div>
      </Card>
    );
  }

  const patientsAhead = queue.patientsAhead ?? 0;
  const queueProgress = Math.min(100, ((queue.patientToken - patientsAhead) / Math.max(queue.patientToken, 1)) * 100);
  const statusHeadline =
    queue.patientStatus === "serving"
      ? "It is your turn now"
      : queue.isToday
        ? `${patientsAhead} patient${patientsAhead === 1 ? "" : "s"} ahead of you`
        : `Position ${queue.patientToken} reserved for ${queue.queueDateLabel}`;

  return (
    <Card className="overflow-hidden rounded-[1.9rem] border-0 bg-white p-0 shadow-lg dark:bg-slate-950">
      <div className="bg-[linear-gradient(135deg,_#0f172a_0%,_#155e75_45%,_#0f766e_100%)] px-6 py-5 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100">Queue Status</p>
            <h3 className="mt-2 text-2xl font-semibold">{statusHeadline}</h3>
            <p className="mt-2 text-sm text-cyan-50/80">
              {queue.doctorName || "Consultant appointment"} • {queue.appointmentReason || "Consultation"} • {queue.appointmentTime || "Scheduled slot"}
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() => refresh()}
            className="rounded-2xl border border-white/15 bg-white/10 px-4 text-white hover:bg-white/15 hover:text-white"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Your Position",
              value: `#${queue.patientToken}`,
              hint: queue.queueDateLabel,
              icon: Hash,
              accent: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300",
            },
            {
              label: "Patients Ahead",
              value: String(patientsAhead),
              hint: queue.isToday ? "Live queue" : "Before your slot begins",
              icon: Users,
              accent: "bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300",
            },
            {
              label: "Estimated Wait",
              value: queue.estimatedWaitTime,
              hint: queue.isToday ? "Based on live movement" : "Expected once clinic opens",
              icon: Clock3,
              accent: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
            },
            {
              label: "Current Queue",
              value: queue.isToday && queue.currentServing ? `#${queue.currentServing}` : "Opening soon",
              hint: queue.isToday ? "Now serving" : queue.appointmentTime || "Scheduled slot",
              icon: Activity,
              accent: "bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-[1.5rem] border border-gray-100 bg-gray-50 p-5 dark:border-slate-800 dark:bg-slate-900">
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${item.accent}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-slate-400">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-slate-50">{item.value}</p>
                <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">{item.hint}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 rounded-[1.6rem] border border-cyan-100 bg-cyan-50 p-5 dark:border-cyan-950/60 dark:bg-cyan-950/20">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-cyan-900 dark:text-cyan-200">Queue progress</p>
              <p className="mt-1 text-sm text-cyan-700 dark:text-cyan-300">
                {queue.isToday
                  ? "Live progress updates reflect the active consultation queue."
                  : "Your place is already reserved. Live movement starts on the day of your visit."}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-cyan-900 dark:text-cyan-200">
              <CalendarClock className="h-4 w-4" />
              {queue.queueDateLabel} • {queue.appointmentTime}
            </div>
          </div>

          <div className="mt-4">
            <div className="h-3 overflow-hidden rounded-full bg-white/80 dark:bg-slate-900">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-600 to-teal-500 transition-all duration-500"
                style={{ width: `${queueProgress}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-xs font-medium text-cyan-800 dark:text-cyan-300">
              <span>Queue opens</span>
              <span>Your slot #{queue.patientToken}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            onClick={() => navigate("/dashboard/live-queue")}
            className="rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-500 px-5 text-white hover:from-cyan-700 hover:to-teal-600"
          >
            <Route className="h-4 w-4" />
            Open Full Queue
          </Button>
          {queue.patientStatus === "serving" && (
            <Button
              variant="outline"
              onClick={() => navigate("/dashboard/book-appointment")}
              className="rounded-2xl border-green-200 bg-green-50 px-5 text-green-700 hover:bg-green-100"
            >
              <CheckCircle2 className="h-4 w-4" />
              Consultation Ready
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
