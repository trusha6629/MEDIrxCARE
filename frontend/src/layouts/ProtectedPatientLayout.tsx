import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";
import { PatientDashboardLayout } from "./PatientDashboardLayout";

export function ProtectedPatientLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user || user.role !== "patient") {
    return <Navigate to="/" replace />;
  }

  return (
    <PatientDashboardLayout>
      <Outlet />
    </PatientDashboardLayout>
  );
}
