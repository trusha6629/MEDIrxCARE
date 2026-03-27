import { Link, useLocation } from "react-router";
import { 
  LogOut,
} from "lucide-react";
import { Button } from "../common/Button";
import { PulseLogo } from "./PulseLogo";

interface NavItem {
  name: string;
  path: string;
  icon: any;
}

interface SidebarProps {
  navigation: NavItem[];
  onLogout: () => void;
}

/**
 * Shared Sidebar component
 */
export function Sidebar({ navigation, onLogout }: SidebarProps) {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden lg:flex lg:flex-col shrink-0">
      <div className="flex items-center gap-3 p-6 border-b border-gray-200">
        <div className="w-11 h-11 bg-gradient-to-br from-cyan-600 to-teal-500 rounded-xl flex items-center justify-center shadow-md shadow-cyan-500/20">
          <PulseLogo className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-gray-900">MediSense</h1>
          <p className="text-xs text-gray-500">Smart Hospital</p>
        </div>
      </div>

      <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? "bg-gradient-to-r from-cyan-600 to-teal-500 text-white shadow-md" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 bg-white">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          onClick={onLogout}
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  );
}
