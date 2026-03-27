interface NotificationCardProps {
  message: string;
  time: string;
  isLast?: boolean;
}

/**
 * Reusable Notification Card component
 */
export function NotificationCard({ message, time, isLast }: NotificationCardProps) {
  return (
    <div className={`pb-4 ${!isLast ? 'border-b border-gray-100' : ''} last:pb-0`}>
      <p className="text-sm text-gray-900 mb-2 leading-relaxed font-medium">{message}</p>
      <p className="text-xs text-gray-500">{time}</p>
    </div>
  );
}
