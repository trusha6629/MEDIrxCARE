import { useEffect, useMemo, useState } from "react";
import { Calendar, Clock, User, UserCheck, CheckCircle, XCircle } from "lucide-react";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { appointmentService } from "../services/AppointmentService";
import { LoadingSpinner } from "../components/common/LoadingSpinner";

export function AdminAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const data = await appointmentService.getUpcoming();
        setAppointments(data as any[]);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const stats = useMemo(() => {
    const completed = appointments.filter((appointment) => appointment.status === "completed").length;
    const confirmed = appointments.filter((appointment) => appointment.status === "confirmed").length;
    const pending = appointments.filter((appointment) => appointment.status === "pending").length;

    return {
      total: appointments.length,
      completed,
      confirmed,
      pending,
    };
  }, [appointments]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Appointments</h1>
        <p className="mt-1 text-sm text-gray-500">Monitor and manage all appointments</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {[
              { label: "Total Upcoming", value: stats.total, icon: Calendar, classes: "bg-cyan-100 text-cyan-600" },
              { label: "Completed", value: stats.completed, icon: CheckCircle, classes: "bg-green-100 text-green-600" },
              { label: "Confirmed", value: stats.confirmed, icon: Clock, classes: "bg-blue-100 text-blue-600" },
              { label: "Pending", value: stats.pending, icon: XCircle, classes: "bg-amber-100 text-amber-600" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.label} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:bg-slate-950">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.classes}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{item.label}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-slate-50">{item.value}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {appointments.length ? (
            <Card className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:bg-slate-950">
              <div className="border-b border-gray-200 p-6 dark:border-slate-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-50">Upcoming Appointments</h3>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-slate-800">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="p-6 transition-colors hover:bg-gray-50 dark:hover:bg-slate-900">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-100 to-cyan-50">
                            <Clock className="h-6 w-6 text-cyan-600" />
                          </div>
                          <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-slate-50">{appointment.time}</p>
                        </div>
                        <div>
                          <div className="mb-2 flex items-center gap-3">
                            <User className="h-4 w-4 text-gray-400" />
                            <p className="text-sm font-semibold text-gray-900 dark:text-slate-50">{appointment.patient || "Patient"}</p>
                          </div>
                          <div className="mb-2 flex items-center gap-3">
                            <UserCheck className="h-4 w-4 text-gray-400" />
                            <p className="text-sm text-gray-600 dark:text-slate-400">{appointment.doctor || "Doctor"}</p>
                          </div>
                          <span className="inline-flex items-center rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 dark:bg-slate-900 dark:text-slate-300">
                            {appointment.reason}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium ${
                            appointment.status === "completed"
                              ? "bg-green-50 text-green-700"
                              : appointment.status === "confirmed"
                                ? "bg-cyan-50 text-cyan-700"
                                : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {appointment.status === "completed" && <CheckCircle className="h-4 w-4" />}
                          {appointment.status === "confirmed" && <Calendar className="h-4 w-4" />}
                          {appointment.status === "pending" && <Clock className="h-4 w-4" />}
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                        <Button variant="outline" size="sm" className="rounded-xl">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <Card className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm dark:bg-slate-950">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 dark:bg-slate-900">
                <Calendar className="h-8 w-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-50">No appointments found</h3>
              <p className="text-gray-500 dark:text-slate-400">There are no appointments scheduled right now.</p>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
