import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";
import { DoctorDashboardLayout } from "./DoctorDashboardLayout";

export function ProtectedDoctorLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user || user.role !== "doctor") {
    return <Navigate to="/" replace />;
  }

  return (
    <DoctorDashboardLayout>
      <Outlet />
    </DoctorDashboardLayout>
  );
}
