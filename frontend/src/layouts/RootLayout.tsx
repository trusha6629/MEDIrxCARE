import { Outlet } from "react-router";
import { AuthProvider } from "../context/AuthContext";
import { Toaster } from "../components/common/Sonner";

export function RootLayout() {
  return (
    <AuthProvider>
      <Outlet />
      <Toaster />
    </AuthProvider>
  );
}
