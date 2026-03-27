import { Outlet } from "react-router";
import { 
  LayoutDashboard, 
  Calendar, 
  Settings,
  Stethoscope,
  Brain,
  Heart,
  TestTube,
  FileText,
  ClipboardList
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { AIChatbot } from "../components/chatbot/AIChatbot";
import { Sidebar } from "../components/layout/Sidebar";
import { Header } from "../components/layout/Header";

const patientNavigation = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Book Appointment", path: "/dashboard/book-appointment", icon: Calendar },
  { name: "Find Doctors", path: "/dashboard/doctor-directory", icon: Stethoscope },
  { name: "AI Doctor", path: "/dashboard/ai-doctor", icon: Brain },
  { name: "Prescriptions", path: "/dashboard/prescriptions", icon: FileText },
  { name: "Reports", path: "/dashboard/reports", icon: ClipboardList },
  { name: "Health Checkups", path: "/dashboard/health-checkups", icon: Heart },
  { name: "Tests & Services", path: "/dashboard/tests-services", icon: TestTube },
  { name: "Profile", path: "/dashboard/settings", icon: Settings },
];

/**
 * Main layout for Patient Dashboard
 */
export function PatientDashboardLayout() {
  const { logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar 
        navigation={patientNavigation} 
        onLogout={handleLogout} 
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userRole="patient" />

        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>

      <AIChatbot />
    </div>
  );
}
