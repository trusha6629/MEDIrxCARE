import { Calendar, FileText, Users, Brain, Activity, CheckCircle2 } from "lucide-react";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { useNavigate } from "react-router";
import { QueueStatus } from "../components/dashboard/QueueStatus";
import { GreetingSection } from "../components/dashboard/GreetingSection";
import { StatCard } from "../components/dashboard/StatCard";
import { AppointmentCard } from "../components/dashboard/AppointmentCard";
import { NotificationCard } from "../components/dashboard/NotificationCard";
import { RecentActivityCard } from "../components/dashboard/RecentActivityCard";
import { useAppointments } from "../hooks/useAppointments";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { useAuth } from "../context/AuthContext";

const quickActions = [
  { name: "Book Appointment", icon: Calendar, path: "/dashboard/book-appointment", color: "from-cyan-500 to-cyan-600" },
  { name: "AI Doctor", icon: Brain, path: "/dashboard/ai-doctor", color: "from-teal-500 to-teal-600" },
  { name: "View Reports", icon: FileText, path: "/dashboard/preventive-health", color: "from-blue-500 to-blue-600" },
  { name: "Find Doctors", icon: StethoscopeIcon, path: "/dashboard/doctor-directory" },
];

function StethoscopeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.8 2.3A.3.3 0 1 0 5 2a.3.3 0 0 0-.2.3Z" />
      <path d="M10 22v-2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2" />
      <path d="M14 22v-2a2 2 0 0 0 2-2h4a2 2 0 0 0 2 2v2" />
      <path d="M12 18V4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2" />
    </svg>
  );
}

const getActivityIcon = (title: string) => {
  if (title.includes('Lab')) return CheckCircle2;
  if (title.includes('Prescription')) return FileText;
  if (title.includes('Appointment')) return Calendar;
  return Activity;
};

const getActivityColor = (title: string) => {
  if (title.includes('Lab')) return { color: "text-green-500", bgColor: "bg-green-100" };
  if (title.includes('Prescription')) return { color: "text-blue-500", bgColor: "bg-blue-100" };
  if (title.includes('Appointment')) return { color: "text-cyan-500", bgColor: "bg-cyan-100" };
  return { color: "text-teal-500", bgColor: "bg-teal-100" };
};

export function PatientDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { appointments, loading: appointmentsLoading } = useAppointments('patient');
  const { stats, loading: statsLoading } = useDashboardStats('patient');

  return (
    <div className="space-y-7 pb-8">
      {/* Greeting Section */}
      <GreetingSection 
        name={user?.name?.split(' ')[0] || "John"} 
        message="Hope you're having a healthy day. Here's your health summary." 
      />

      {/* Quick Actions */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card 
                key={action.name}
                className="p-6 border-0 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer group bg-white flex flex-col items-center text-center"
                onClick={() => navigate(action.path)}
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-sm`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-medium text-gray-900 text-sm md:text-base">{action.name}</h3>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Main Grid: Queue & Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Queue Status */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Queue Status</h2>
          <QueueStatus />
        </div>

        {/* Recent Activity */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {statsLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-xl" />
              ))
            ) : (
              stats?.recentActivity?.map((activity: any) => {
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
            )}
          </div>
        </section>
      </div>

      {/* Appointments & Notifications */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <Card className="lg:col-span-2 p-6 border-0 shadow-md bg-white">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-cyan-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-cyan-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50"
              onClick={() => navigate("/dashboard/book-appointment")}
            >
              Book New
            </Button>
          </div>

          <div className="space-y-3.5">
            {appointmentsLoading ? (
              Array(2).fill(0).map((_, i) => (
                <div key={i} className="h-24 bg-gray-50 animate-pulse rounded-xl" />
              ))
            ) : (
              appointments.map((appointment) => (
                <AppointmentCard 
                  key={appointment.id}
                  doctor={appointment.doctor}
                  specialty={appointment.specialty}
                  date={appointment.date}
                  time={appointment.time}
                  status={appointment.status}
                />
              ))
            )}
            {!appointmentsLoading && appointments.length === 0 && (
              <p className="text-center text-gray-500 py-6">No upcoming appointments</p>
            )}
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6 border-0 shadow-md bg-white">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 bg-orange-100 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          </div>

          <div className="space-y-4">
            {statsLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-16 bg-gray-50 animate-pulse rounded-lg" />
              ))
            ) : (
              stats?.notifications?.map((notification: any, index: number) => (
                <NotificationCard
                  key={notification.id}
                  message={notification.message}
                  time={notification.time}
                  isLast={index === stats.notifications.length - 1}
                />
              ))
            )}
          </div>

          <Button variant="ghost" className="w-full mt-4 text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50">
            View All
          </Button>
        </Card>
      </div>
    </div>
  );
}

