import { useState } from "react";
import { Bell, Calendar, Users, Activity, X } from "lucide-react";
import { Button } from "../common/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../common/DropdownMenu";

interface Notification {
  id: number;
  type: "appointment" | "queue" | "consultation" | "reminder";
  icon: any;
  iconColor: string;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
}

const doctorNotifications: Notification[] = [
  {
    id: 1,
    type: "appointment",
    icon: Calendar,
    iconColor: "text-blue-600 bg-blue-50",
    title: "New Appointment Booked",
    description: "Sarah Johnson for Cardiac Check-up at 2:00 PM",
    time: "10 min ago",
    isRead: false,
  },
  {
    id: 2,
    type: "queue",
    icon: Users,
    iconColor: "text-orange-600 bg-orange-50",
    title: "Patient in Queue",
    description: "3 patients waiting in your live queue",
    time: "25 min ago",
    isRead: false,
  },
  {
    id: 3,
    type: "consultation",
    icon: Activity,
    iconColor: "text-teal-600 bg-teal-50",
    title: "Consultation Request",
    description: "Urgent review requested for lab results - Room 4",
    time: "1 hour ago",
    isRead: true,
  },
];

export function DoctorNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(doctorNotifications);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })));
  };

  const clearNotification = (id: number) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button className="relative p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-ping" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
              <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-semibold rounded-full flex items-center justify-center ring-2 ring-white">
                {unreadCount}
              </span>
            </>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 p-0 mt-2 rounded-2xl shadow-xl border-gray-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div>
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {unreadCount > 0 ? `${unreadCount} unread notifications` : "All caught up!"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 h-7"
            >
              Mark all read
            </Button>
          )}
        </div>

        <div className="max-h-[420px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-900">No notifications</p>
              <p className="text-xs text-gray-500 mt-1">You're all caught up!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => {
                const Icon = notification.icon;
                return (
                  <div
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer group relative ${
                      !notification.isRead ? "bg-cyan-50/30" : ""
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className={`w-10 h-10 rounded-xl ${notification.iconColor} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="text-sm font-semibold text-gray-900 leading-tight">
                            {notification.title}
                          </h4>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              clearNotification(notification.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded-lg"
                          >
                            <X className="w-3.5 h-3.5 text-gray-500" />
                          </button>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed mb-1.5">
                          {notification.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">{notification.time}</span>
                          {!notification.isRead && (
                            <span className="w-1.5 h-1.5 bg-cyan-600 rounded-full" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="p-3 border-t border-gray-100 bg-gray-50/50">
            <Button
              variant="ghost"
              className="w-full text-sm text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 h-9 rounded-lg"
            >
              View all notifications
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
