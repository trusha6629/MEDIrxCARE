import { Outlet, useLocation } from "react-router";
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  ClipboardList, 
  Settings,
  UserCheck
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Sidebar } from "../components/layout/Sidebar";
import { Header } from "../components/layout/Header";

const doctorNavigation = [
  { name: "Overview", path: "/doctor", icon: LayoutDashboard },
  { name: "Appointments", path: "/doctor/appointments", icon: Calendar },
  { name: "Live Queue", path: "/doctor/queue", icon: UserCheck },
  { name: "Patient History", path: "/doctor/patient-history", icon: Users },
  { name: "Prescriptions", path: "/doctor/write-prescription", icon: ClipboardList },
  { name: "Profile", path: "/doctor/settings", icon: Settings },
];

/**
 * Main layout for Doctor Dashboard
 */
export function DoctorDashboardLayout() {
  const { logout } = useAuth();
  const location = useLocation();
  const isConsultationRoute = location.pathname.includes("/consultation/");

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
    }
  };

  if (isConsultationRoute) {
    return (
      <div className="h-screen overflow-hidden bg-slate-950">
        <main className="h-full overflow-hidden">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-slate-950">
      <Sidebar 
        navigation={doctorNavigation} 
        onLogout={handleLogout} 
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userRole="doctor" />

        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
