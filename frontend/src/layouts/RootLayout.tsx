import { Outlet } from "react-router";
import { AuthProvider } from "../context/AuthContext";
import { Toaster } from "../components/common/Sonner";
import { ThemeProvider } from "../components/theme/ThemeProvider";

export function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Outlet />
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}
