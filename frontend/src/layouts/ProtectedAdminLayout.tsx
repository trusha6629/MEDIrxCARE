import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";
import { AdminDashboardLayout } from "./AdminDashboardLayout";

export function ProtectedAdminLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <AdminDashboardLayout>
      <Outlet />
    </AdminDashboardLayout>
  );
}
