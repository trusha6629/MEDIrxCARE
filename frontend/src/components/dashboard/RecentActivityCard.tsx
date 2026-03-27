import { LucideIcon } from "lucide-react";
import { Card } from "../common/Card";

interface RecentActivityCardProps {
  title: string;
  description: string;
  time: string;
  icon: LucideIcon;
  color?: string;
  bgColor?: string;
}

/**
 * Reusable Recent Activity Card component
 */
export function RecentActivityCard({ 
  title, 
  description, 
  time, 
  icon: Icon, 
  color = "text-cyan-600", 
  bgColor = "bg-cyan-50" 
}: RecentActivityCardProps) {
  return (
    <Card className="p-4 border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-white">
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 ${bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 mb-0.5">{title}</p>
          <p className="text-xs text-gray-600 mb-1 leading-relaxed">{description}</p>
          <p className="text-xs text-gray-500 font-medium">{time}</p>
        </div>
      </div>
    </Card>
  );
}
