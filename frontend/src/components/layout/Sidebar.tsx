import { Link, useLocation } from "react-router";
import { 
  LogOut,
} from "lucide-react";
import { Button } from "../common/Button";
import { PulseLogo } from "./PulseLogo";
import { APP_NAME, APP_TAGLINE } from "../../utils/brand";

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
    <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white/95 backdrop-blur lg:flex lg:flex-col dark:border-slate-800 dark:bg-slate-950/90">
      <div className="border-b border-gray-200 p-6 dark:border-slate-800">
        <Link to="/" className="group flex items-center gap-3 rounded-2xl transition-transform duration-200 hover:translate-x-0.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-transform duration-200 group-hover:scale-105 dark:bg-slate-900 dark:ring-slate-700">
            <PulseLogo className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-slate-50">{APP_NAME}</h1>
            <p className="text-xs uppercase tracking-[0.18em] text-gray-500 dark:text-slate-400">{APP_TAGLINE}</p>
          </div>
        </Link>
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
                  ? "bg-gradient-to-r from-cyan-600 to-teal-500 text-white shadow-md shadow-cyan-500/20" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-1 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/90">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100"
          onClick={onLogout}
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  );
}
