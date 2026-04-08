import { Activity, Calendar, ChevronRight, FileText, HeartPulse, ShieldAlert, Video } from "lucide-react";
import { useNavigate } from "react-router";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { QueueStatus } from "../components/dashboard/QueueStatus";
import { GreetingSection } from "../components/dashboard/GreetingSection";
import { RecentActivityCard } from "../components/dashboard/RecentActivityCard";
import { useAppointments } from "../hooks/useAppointments";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { useAuth } from "../context/AuthContext";
import { CareAssistantLogo } from "../components/icons/CareAssistantLogo";
import { DoctorSearchLogo } from "../components/icons/DoctorSearchLogo";

const careHighlights = [
  {
    title: "Keep reports ready for every visit",
    description: "Uploading lab reports and prescriptions before the appointment helps doctors review your case faster.",
  },
  {
    title: "Video for follow-ups, clinic for exams",
    description: "Use video consultations for routine follow-ups and in-person visits when a physical examination matters.",
  },
  {
    title: "Watch the queue before you travel",
    description: "Your dashboard now updates queue position and waiting time once a consultant appointment is booked.",
  },
];

const quickActions = [
  { name: "Book Appointment", icon: Calendar, path: "/dashboard/book-appointment", accent: "from-cyan-500 to-cyan-600" },
  { name: "Find Doctors", icon: DoctorSearchLogo, path: "/dashboard/doctor-directory", accent: "from-teal-500 to-emerald-500" },
  { name: "Reports", icon: FileText, path: "/dashboard/reports", accent: "from-blue-500 to-blue-600" },
  { name: "Care Guide", icon: CareAssistantLogo, path: "/dashboard/ai-doctor", accent: "from-sky-500 to-cyan-500" },
];

const getActivityIcon = (title: string) => {
  if (title.includes("Prescription")) return FileText;
  if (title.includes("Appointment")) return Calendar;
  return Activity;
};

const getActivityColor = (title: string) => {
  if (title.includes("Prescription")) return { color: "text-blue-500", bgColor: "bg-blue-100" };
  if (title.includes("Appointment")) return { color: "text-cyan-500", bgColor: "bg-cyan-100" };
  return { color: "text-teal-500", bgColor: "bg-teal-100" };
};

export function PatientDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { appointments, loading: appointmentsLoading } = useAppointments("patient");
  const { stats, loading: statsLoading } = useDashboardStats("patient");

  return (
    <div className="space-y-7 pb-8">
      <GreetingSection
        name={user?.name?.split(" ")[0] || "Rohan"}
        message="Track your queue, upcoming visits, and care guidance from one clear patient workspace."
      />

      <Card className="border-0 bg-white p-6 shadow-md dark:bg-slate-950">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950/40">
            <ShieldAlert className="h-5 w-5 text-blue-600 dark:text-blue-300" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-50">Patient Shortcuts</h3>
            <p className="text-sm text-gray-500 dark:text-slate-400">Quick access to the most-used workflows.</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.name}
                type="button"
                onClick={() => navigate(action.path)}
                className="group rounded-[1.5rem] border border-gray-200 bg-gray-50 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-950"
              >
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${action.accent} text-white shadow-sm transition-transform group-hover:scale-105`}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-4 text-sm font-semibold text-gray-900 dark:text-slate-50">{action.name}</p>
              </button>
            );
          })}
        </div>
      </Card>

      <section>
        <QueueStatus />
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card className="border-0 bg-white p-6 shadow-md dark:bg-slate-950">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-100 dark:bg-teal-950/50">
              <Activity className="h-5 w-5 text-teal-700 dark:text-teal-300" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-50">Recent Activity</h3>
              <p className="text-sm text-gray-500 dark:text-slate-400">Appointments, follow-ups, and your latest care events.</p>
            </div>
          </div>

          <div className="space-y-3">
            {statsLoading ? (
              Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-24 animate-pulse rounded-xl bg-gray-100 dark:bg-slate-900" />)
            ) : stats?.recentActivity?.length ? (
              stats.recentActivity.map((activity: any) => {
                const styles = getActivityColor(activity.title);
                return (
                  <RecentActivityCard
                    key={activity.id}
                    title={activity.title}
                    description={activity.description}
                    time={activity.time}
                    icon={getActivityIcon(activity.title)}
                    color={styles.color}
                    bgColor={styles.bgColor}
                  />
                );
              })
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-sm text-gray-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                Recent activity will appear here once you book appointments, use the queue, or review reports.
              </div>
            )}
          </div>
        </Card>

        <Card className="border-0 bg-white p-6 shadow-md dark:bg-slate-950">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-100 dark:bg-cyan-950/50">
                <Calendar className="h-5 w-5 text-cyan-700 dark:text-cyan-300" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-50">Upcoming Appointments</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400">See your next consultant sessions and join video visits.</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-cyan-600 hover:bg-cyan-50 hover:text-cyan-700"
              onClick={() => navigate("/dashboard/book-appointment")}
            >
              Book New
            </Button>
          </div>

          <div className="space-y-3.5">
            {appointmentsLoading ? (
              Array.from({ length: 2 }).map((_, index) => <div key={index} className="h-24 animate-pulse rounded-xl bg-gray-50 dark:bg-slate-900" />)
            ) : appointments.length ? (
              appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="rounded-[1.5rem] border border-gray-100 bg-gray-50 p-4 shadow-sm transition-all hover:border-cyan-200 hover:bg-cyan-50/40 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-base font-semibold text-gray-900 dark:text-slate-50">{appointment.doctor}</p>
                      <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">{appointment.specialty}</p>
                      <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
                        {appointment.date} • {appointment.time} • {appointment.mode}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        appointment.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : appointment.status === "ongoing"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-cyan-100 text-cyan-700"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    {appointment.mode === "Video" ? (
                      <Button
                        onClick={() => navigate(`/dashboard/consultation/${appointment.id}`)}
                        className="rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-500 px-4 text-white hover:from-cyan-700 hover:to-teal-600"
                      >
                        <Video className="h-4 w-4" />
                        Join Video Call
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => navigate("/dashboard/live-queue")}
                        className="rounded-2xl border-gray-200 px-4"
                      >
                        Track Queue
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="py-6 text-center text-gray-500 dark:text-slate-400">No upcoming appointments yet.</p>
            )}
          </div>
        </Card>
      </div>

      <Card className="border-0 bg-white p-6 shadow-md dark:bg-slate-950">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-950/40">
            <HeartPulse className="h-5 w-5 text-rose-600 dark:text-rose-300" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-50">Care Focus / Health Insights</h3>
            <p className="text-sm text-gray-500 dark:text-slate-400">Simple, practical ways to make the most of each visit.</p>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-3">
          {careHighlights.map((highlight) => (
            <div key={highlight.title} className="rounded-[1.5rem] border border-gray-200 bg-gray-50 px-4 py-4 transition-all duration-200 hover:border-cyan-200 hover:bg-cyan-50/70 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">{highlight.title}</p>
              <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-slate-400">{highlight.description}</p>
            </div>
          ))}
        </div>

        <Button
          variant="ghost"
          className="mt-4 w-full justify-between rounded-2xl border border-gray-200 px-4 py-5 text-gray-700 hover:bg-gray-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
          onClick={() => navigate("/dashboard/ai-doctor")}
        >
          Open Care Guide
          <ChevronRight className="h-4 w-4" />
        </Button>
      </Card>
    </div>
  );
}
