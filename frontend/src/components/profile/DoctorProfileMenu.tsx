import { Link } from "react-router";
import { User, Calendar, Stethoscope, Lock, LogOut, ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "../common/DropdownMenu";
import { useAuth } from "../../context/AuthContext";
import { ThemeModeSelector } from "../theme/ThemeModeSelector";
import { APP_NAME } from "../../utils/brand";

export function DoctorProfileMenu() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
    }
  };

  const getInitials = () => {
    if (user?.name) {
      return user.name
        .split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase();
    }
    return "AM";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-3 rounded-xl border-l border-gray-200 py-1.5 pl-4 pr-3 transition-all hover:bg-gray-50 dark:border-slate-800 dark:hover:bg-slate-900">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900 dark:text-slate-100">{user?.name || "Dr. Aarav Mehta"}</p>
            <p className="text-xs text-gray-500 dark:text-slate-400">Cardiologist</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-600 to-teal-500 text-white shadow-md shadow-cyan-500/20">
            {getInitials()}
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="mt-2 w-72 rounded-2xl border-gray-200 p-0 shadow-xl dark:border-slate-800 dark:bg-slate-950">
        <div className="rounded-t-2xl bg-gradient-to-br from-cyan-600 to-teal-500 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white text-lg font-bold text-cyan-600 shadow-lg">
              {getInitials()}
            </div>
            <div className="text-white">
              <h3 className="text-base font-semibold leading-tight">{user?.name || "Dr. Aarav Mehta"}</h3>
              <p className="mt-0.5 text-xs text-cyan-100">Doctor Portal</p>
              <p className="mt-0.5 text-xs text-cyan-100">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="p-2">
          <DropdownMenuLabel className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-slate-400">
            Clinical Tools
          </DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link to="/doctor/settings" className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-slate-200">Profile & Settings</span>
                <ChevronRight className="ml-auto w-4 h-4 text-gray-400" />
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/doctor/appointments" className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-slate-200">My Schedule</span>
                <ChevronRight className="ml-auto w-4 h-4 text-gray-400" />
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                to="/doctor/patient-history"
                className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5"
              >
                <Stethoscope className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-slate-200">Patient Records</span>
                <ChevronRight className="ml-auto w-4 h-4 text-gray-400" />
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="my-2" />

          <DropdownMenuLabel className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-slate-400">
            Account Settings
          </DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5">
              <Lock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700 dark:text-slate-200">Security</span>
              <ChevronRight className="ml-auto w-4 h-4 text-gray-400" />
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <ThemeModeSelector label={`${APP_NAME} Theme`} />

          <DropdownMenuSeparator className="my-2" />

          <DropdownMenuItem
            onClick={handleLogout}
            className="mb-1 flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-red-600 hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Logout</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
