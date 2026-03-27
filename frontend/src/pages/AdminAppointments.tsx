import { Calendar, Clock, User, UserCheck, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";

const appointments = [
  {
    id: 1,
    patientName: "John Doe",
    doctorName: "Dr. Sarah Miller",
    time: "09:00 AM",
    type: "Consultation",
    status: "completed",
    date: "2024-02-26"
  },
  {
    id: 2,
    patientName: "Emma Wilson",
    doctorName: "Dr. Michael Chen",
    time: "10:30 AM",
    type: "Follow-up",
    status: "in-progress",
    date: "2024-02-26"
  },
  {
    id: 3,
    patientName: "Michael Brown",
    doctorName: "Dr. Emily Johnson",
    time: "11:00 AM",
    type: "Check-up",
    status: "scheduled",
    date: "2024-02-26"
  },
  {
    id: 4,
    patientName: "Sarah Davis",
    doctorName: "Dr. Lisa Anderson",
    time: "02:00 PM",
    type: "Consultation",
    status: "scheduled",
    date: "2024-02-26"
  },
  {
    id: 5,
    patientName: "James Martinez",
    doctorName: "Dr. Robert Williams",
    time: "03:30 PM",
    type: "Surgery Follow-up",
    status: "cancelled",
    date: "2024-02-26"
  },
];

export function AdminAppointments() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Appointments</h1>
        <p className="text-sm text-gray-500 mt-1">Monitor and manage all appointments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-cyan-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Today</p>
              <p className="text-2xl font-bold text-gray-900">89</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-gray-900">45</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Scheduled</p>
              <p className="text-2xl font-bold text-gray-900">38</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Cancelled</p>
              <p className="text-2xl font-bold text-gray-900">6</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Appointments List */}
      {appointments.length > 0 ? (
        <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Today's Appointments</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-cyan-100 to-cyan-50 rounded-xl flex items-center justify-center">
                        <Clock className="w-6 h-6 text-cyan-600" />
                      </div>
                      <p className="text-sm font-semibold text-gray-900 mt-2">{appointment.time}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <p className="text-sm font-semibold text-gray-900">{appointment.patientName}</p>
                      </div>
                      <div className="flex items-center gap-3 mb-2">
                        <UserCheck className="w-4 h-4 text-gray-400" />
                        <p className="text-sm text-gray-600">{appointment.doctorName}</p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium">
                        {appointment.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${
                      appointment.status === "completed" 
                        ? "bg-green-50 text-green-700" 
                        : appointment.status === "in-progress"
                        ? "bg-blue-50 text-blue-700"
                        : appointment.status === "scheduled"
                        ? "bg-cyan-50 text-cyan-700"
                        : "bg-red-50 text-red-700"
                    }`}>
                      {appointment.status === "completed" && <CheckCircle className="w-4 h-4" />}
                      {appointment.status === "in-progress" && <Clock className="w-4 h-4" />}
                      {appointment.status === "scheduled" && <Calendar className="w-4 h-4" />}
                      {appointment.status === "cancelled" && <XCircle className="w-4 h-4" />}
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1).replace('-', ' ')}
                    </span>
                    <Button variant="outline" size="sm" className="rounded-xl">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card className="p-12 bg-white border border-gray-200 rounded-2xl shadow-sm text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No appointments found</h3>
          <p className="text-gray-500">There are no appointments scheduled for the selected period.</p>
        </Card>
      )}
    </div>
  );
}

