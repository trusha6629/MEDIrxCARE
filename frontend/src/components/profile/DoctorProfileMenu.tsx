import { useState } from "react";
import { Link } from "react-router";
import {
  User,
  Calendar,
  Stethoscope,
  Users,
  DollarSign,
  Lock,
  Sun,
  LogOut,
  ChevronRight,
} from "lucide-react";
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

export function DoctorProfileMenu() {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
    }
  };

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
  };

  const getInitials = () => {
    if (user?.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return "SM";
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-3 pl-4 border-l border-gray-200 hover:bg-gray-50 rounded-lg pr-3 py-1.5 transition-colors">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{user?.name || "Dr. Sarah Miller"}</p>
            <p className="text-xs text-gray-500">Cardiologist • ID: #DR7829</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-teal-500 rounded-xl flex items-center justify-center text-white font-semibold shadow-md shadow-cyan-500/20">
            {getInitials()}
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 p-0 mt-2 rounded-2xl shadow-xl border-gray-200">
        <div className="p-4 bg-gradient-to-br from-cyan-600 to-teal-500 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-cyan-600 font-bold text-lg shadow-lg">
              {getInitials()}
            </div>
            <div className="text-white">
              <h3 className="font-semibold text-base leading-tight">{user?.name || "Dr. Sarah Miller"}</h3>
              <p className="text-xs text-cyan-100 mt-0.5">Doctor Portal</p>
              <p className="text-xs text-cyan-100 mt-0.5">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="p-2">
          <DropdownMenuLabel className="text-xs text-gray-500 px-3 py-2 font-semibold">
            Clinical Tools
          </DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link
                to="/doctor/settings"
                className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-lg"
              >
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">Profile & Settings</span>
                <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                to="/doctor/appointments"
                className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-lg"
              >
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">My Schedule</span>
                <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                to="/doctor/patient-history"
                className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-lg"
              >
                <Stethoscope className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">Patient Records</span>
                <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                to="/doctor/earnings"
                className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-lg"
              >
                <DollarSign className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">Earnings</span>
                <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="my-2" />

          <DropdownMenuLabel className="text-xs text-gray-500 px-3 py-2 font-semibold">
            Account Settings
          </DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-lg">
              <Lock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">Security</span>
              <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleThemeChange("light")}
              className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-lg"
            >
              <Sun className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">Theme</span>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="text-[10px] text-gray-400 uppercase font-bold">{theme}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="my-2" />

          <DropdownMenuItem
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 focus:text-red-700 focus:bg-red-50 mb-1"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Logout</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
