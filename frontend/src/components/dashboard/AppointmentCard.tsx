import { Calendar, Clock } from "lucide-react";

interface AppointmentCardProps {
  doctor?: string;
  patient?: string;
  specialty?: string;
  date: string;
  time: string;
  status: string;
  type?: string;
  showDoctor?: boolean;
}

/**
 * Reusable Appointment Card component
 */
export function AppointmentCard({ 
  doctor, 
  patient, 
  specialty, 
  date, 
  time, 
  status,
  showDoctor = true
}: AppointmentCardProps) {
  const name = showDoctor ? doctor : patient;
  const initial = name ? name.split(' ').pop()?.[0] : '?';

  return (
    <div className="flex items-center justify-between p-5 bg-gray-50 rounded-xl hover:shadow-sm transition-all duration-200 border border-transparent hover:border-gray-200">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-teal-500 rounded-xl flex items-center justify-center text-white font-semibold shadow-sm">
          {initial}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{name}</p>
          {specialty && <p className="text-sm text-gray-600">{specialty}</p>}
        </div>
      </div>
      <div className="text-right">
        <div className="flex items-center gap-2 text-sm text-gray-900 mb-1 font-medium">
          <Calendar className="w-4 h-4" />
          {date}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          {time}
        </div>
      </div>
      <div>
        <span className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold ${
          status === 'confirmed' || status === 'completed'
            ? 'bg-green-100 text-green-700' 
            : 'bg-yellow-100 text-yellow-700'
        }`}>
          {status}
        </span>
      </div>
    </div>
  );
}
