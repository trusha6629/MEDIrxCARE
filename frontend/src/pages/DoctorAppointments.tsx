import { Calendar, Clock, Video, Users } from "lucide-react";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";

const appointments = [
  {
    id: 1,
    patient: "John Smith",
    time: "9:00 AM",
    mode: "Video",
    status: "completed",
    reason: "Follow-up Consultation"
  },
  {
    id: 2,
    patient: "Sarah Johnson",
    time: "10:00 AM",
    mode: "Video",
    status: "ongoing",
    reason: "Cardiac Check-up"
  },
  {
    id: 3,
    patient: "Michael Chen",
    time: "11:00 AM",
    mode: "In-Person",
    status: "upcoming",
    reason: "General Check-up"
  },
  {
    id: 4,
    patient: "Emily Davis",
    time: "2:00 PM",
    mode: "Video",
    status: "upcoming",
    reason: "Diabetes Management"
  },
  {
    id: 5,
    patient: "Robert Wilson",
    time: "3:30 PM",
    mode: "In-Person",
    status: "upcoming",
    reason: "Blood Pressure Review"
  },
  {
    id: 6,
    patient: "Lisa Anderson",
    time: "4:30 PM",
    mode: "Video",
    status: "upcoming",
    reason: "Nutrition Consultation"
  }
];

export function DoctorAppointments() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Today's Appointments</h1>
        <p className="text-gray-600 mt-1">Manage and view all scheduled appointments</p>
      </div>

      <Card className="p-6 border-0 shadow-md bg-white">
        <div className="space-y-3">
          {appointments.map((appointment) => (
            <div 
              key={appointment.id} 
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-11 h-11 bg-gradient-to-br from-cyan-600 to-teal-500 rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-sm flex-shrink-0">
                  {appointment.patient.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">{appointment.patient}</p>
                  <p className="text-xs text-gray-600 truncate">{appointment.reason}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                <div className="text-right">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-0.5">
                    <Clock className="w-4 h-4 text-gray-500" />
                    {appointment.time}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    {appointment.mode === "Video" ? (
                      <><Video className="w-3.5 h-3.5" /> Video Call</>
                    ) : (
                      <><Users className="w-3.5 h-3.5" /> In-Person</>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
                    appointment.status === 'completed' 
                      ? 'bg-green-100 text-green-700' 
                      : appointment.status === 'ongoing'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                  
                  {appointment.status === 'ongoing' && appointment.mode === 'Video' && (
                    <Button size="sm" className="bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-700 hover:to-teal-600 text-white h-9 px-4 shadow-sm">
                      Join
                    </Button>
                  )}
                  
                  {appointment.status === 'upcoming' && (
                    <Button size="sm" className="bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-700 hover:to-teal-600 text-white h-9 px-4 shadow-sm">
                      Start
                    </Button>
                  )}

                  {appointment.status === 'completed' && (
                    <Button variant="outline" size="sm" className="border-gray-300 h-9 px-4">
                      View
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

