import { Search } from "lucide-react";
import { Input } from "../common/Input";
import { useAuth } from "../../context/AuthContext";
import { PatientNotifications } from "../notifications/PatientNotifications";
import { DoctorNotifications } from "../notifications/DoctorNotifications";
import { AdminNotifications } from "../notifications/AdminNotifications";
import { PatientProfileMenu } from "../profile/PatientProfileMenu";
import { DoctorProfileMenu } from "../profile/DoctorProfileMenu";
import { AdminProfileMenu } from "../profile/AdminProfileMenu";

interface HeaderProps {
  userRole?: "patient" | "doctor" | "admin";
}

/**
 * Shared Header component with role-based features
 */
export function Header({ userRole }: HeaderProps) {
  const { user } = useAuth();
  
  // Use the role from props or fallback to auth context
  const role = userRole || user?.role || "patient";

  const renderNotifications = () => {
    switch (role) {
      case "doctor":
        return <DoctorNotifications />;
      case "admin":
        return <AdminNotifications />;
      case "patient":
      default:
        return <PatientNotifications />;
    }
  };

  const renderProfileMenu = () => {
    switch (role) {
      case "doctor":
        return <DoctorProfileMenu />;
      case "admin":
        return <AdminProfileMenu />;
      case "patient":
      default:
        return <PatientProfileMenu />;
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between gap-6">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search doctors, tests, reports..."
              className="pl-10 h-10 bg-gray-50 border-gray-200 focus:bg-white"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          {renderNotifications()}
          {renderProfileMenu()}
        </div>
      </div>
    </header>
  );
}
