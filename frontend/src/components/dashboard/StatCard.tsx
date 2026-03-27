import { LucideIcon } from "lucide-react";
import { Card } from "../common/Card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  bgColor?: string;
  trend?: string;
  unit?: string;
}

/**
 * Reusable StatCard component for dashboard statistics
 */
export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  iconColor = "text-cyan-600", 
  bgColor = "bg-cyan-100",
  trend,
  unit
}: StatCardProps) {
  return (
    <Card className="p-4 border-0 shadow-sm bg-white overflow-hidden relative">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 ${bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-0.5 font-medium">{title}</p>
          <div className="flex items-baseline gap-1">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {unit && <span className="text-sm font-medium text-gray-500">{unit}</span>}
          </div>
          {trend && (
            <p className="text-[10px] text-green-600 font-medium mt-0.5">{trend}</p>
          )}
        </div>
      </div>
    </Card>
  );
}
