import { Clock, Video, Users } from "lucide-react";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { useAppointments } from "../hooks/useAppointments";
import { useNavigate } from "react-router";

export function DoctorAppointments() {
  const navigate = useNavigate();
  const { appointments, loading } = useAppointments("doctor");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Today's Appointments</h1>
        <p className="mt-1 text-gray-600">Manage and view all scheduled appointments</p>
      </div>

      <Card className="border-0 bg-white p-6 shadow-md dark:bg-slate-950">
        <div className="space-y-3">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-20 animate-pulse rounded-xl bg-gray-50 dark:bg-slate-900" />)
          ) : appointments.length ? (
            appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4 transition-colors hover:border-gray-200 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="min-w-0 flex flex-1 items-center gap-4">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-600 to-teal-500 text-sm font-semibold text-white shadow-sm">
                    {appointment.patient.split(" ").map((name: string) => name[0]).join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900 dark:text-slate-50">{appointment.patient}</p>
                    <p className="truncate text-xs text-gray-600 dark:text-slate-400">{appointment.reason}</p>
                  </div>
                </div>

                <div className="ml-4 flex flex-shrink-0 items-center gap-4">
                  <div className="text-right">
                    <div className="mb-0.5 flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-slate-50">
                      <Clock className="h-4 w-4 text-gray-500" />
                      {appointment.time}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-slate-400">
                      {appointment.mode === "Video" ? (
                        <>
                          <Video className="h-3.5 w-3.5" /> Video Call
                        </>
                      ) : (
                        <>
                          <Users className="h-3.5 w-3.5" /> In-Person
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold ${
                        appointment.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : appointment.status === "confirmed"
                            ? "bg-cyan-100 text-cyan-700"
                            : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                    {appointment.mode === "Video" && appointment.status !== "completed" && (
                      <Button
                        size="sm"
                        onClick={() => navigate(`/doctor/consultation/${appointment.id}`)}
                        className="h-9 px-4 bg-gradient-to-r from-cyan-600 to-teal-500 text-white shadow-sm hover:from-cyan-700 hover:to-teal-600"
                      >
                        {appointment.status === "ongoing" ? "Join" : "Start"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="py-10 text-center text-gray-500 dark:text-slate-400">No appointments scheduled for today.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
