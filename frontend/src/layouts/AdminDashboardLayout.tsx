import { Outlet } from "react-router";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  BarChart3, 
  Settings,
  Activity,
  CreditCard,
  ShieldCheck
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Sidebar } from "../components/layout/Sidebar";
import { Header } from "../components/layout/Header";

const adminNavigation = [
  { name: "Overview", path: "/admin", icon: LayoutDashboard },
  { name: "Manage Doctors", path: "/admin/doctors", icon: ShieldCheck },
  { name: "Manage Patients", path: "/admin/patients", icon: Users },
  { name: "All Appointments", path: "/admin/appointments", icon: Calendar },
  { name: "Queue Monitoring", path: "/admin/queue-monitoring", icon: Activity },
  { name: "Analytics", path: "/admin/analytics", icon: BarChart3 },
  { name: "Payments", path: "/admin/payments", icon: CreditCard },
  { name: "Profile", path: "/admin/settings", icon: Settings },
];

/**
 * Main layout for Admin Dashboard
 */
export function AdminDashboardLayout() {
  const { logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar 
        navigation={adminNavigation} 
        onLogout={handleLogout} 
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userRole="admin" />

        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
