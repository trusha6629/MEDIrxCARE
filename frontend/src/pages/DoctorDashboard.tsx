import { Calendar, Clock, Video, Users, Activity, CheckCircle, FileText, Timer, UserCheck, BarChart3 } from "lucide-react";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useAppointments } from "../hooks/useAppointments";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { useQueue } from "../hooks/useQueue";
import { StatCard } from "../components/dashboard/StatCard";
import { AppointmentCard } from "../components/dashboard/AppointmentCard";

export function DoctorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { appointments, loading: appointmentsLoading } = useAppointments('doctor');
  const { stats, loading: statsLoading } = useDashboardStats('doctor');
  const { queue, loading: queueLoading } = useQueue();

  return (
    <div className="space-y-6 pb-8">
      {/* Greeting Section */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">Good Morning, {user?.name || "Dr. Sarah Miller"} 👋</h1>
            <p className="text-gray-600">You have {stats?.todaysAppointments || 0} appointments scheduled for today</p>
          </div>
          <div className="px-5 py-3 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-xs text-gray-600 mb-0.5">Current Time</p>
            <p className="text-lg font-semibold text-gray-900">10:45 AM</p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Appointments & Queue */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Appointments */}
          <Card className="p-6 border-0 shadow-md bg-white">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-cyan-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Today's Appointments</h3>
                  <p className="text-sm text-gray-500">{appointments.length} scheduled</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {appointmentsLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="h-20 bg-gray-50 animate-pulse rounded-xl" />
                ))
              ) : (
                appointments.map((appointment) => (
                  <div 
                    key={appointment.id} 
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-11 h-11 bg-gradient-to-br from-cyan-600 to-teal-500 rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-sm flex-shrink-0">
                        {appointment.patient.split(' ').map((n: string) => n[0]).join('')}
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
                ))
              )}
            </div>
          </Card>

          {/* Live Queue */}
          <Card className="p-6 border-0 shadow-md bg-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Live Queue</h3>
                <p className="text-sm text-gray-500">Patient queue management</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {/* Current Serving */}
              <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-xl p-5 border border-cyan-200">
                <p className="text-sm text-gray-700 font-medium mb-4">Currently Serving</p>
                {queueLoading ? (
                  <div className="h-32 bg-white/50 animate-pulse rounded-xl" />
                ) : (
                  <>
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-teal-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <span className="text-2xl font-bold">{queue?.currentServing}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{queue?.nextPatient.name}</p>
                        <p className="text-xs text-gray-600 truncate">{queue?.nextPatient.reason}</p>
                      </div>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-700 hover:to-teal-600 text-white h-11 shadow-sm font-medium">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Completed
                    </Button>
                  </>
                )}
              </div>

              {/* Queue Progress */}
              <div className="bg-white rounded-xl p-5 border border-gray-200 flex flex-col justify-between">
                <div>
                  <p className="text-sm text-gray-700 font-medium mb-4">Queue Progress</p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Completed</span>
                    <span className="text-sm font-semibold text-gray-900">{queue?.completed || 0} / {queue?.totalToday || 0}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-cyan-600 to-teal-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${((queue?.completed || 0) / (queue?.totalToday || 1)) * 100}%` }}
                    />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-100 mt-4">
                  <p className="text-xs text-gray-500">Estimated wait for next: <span className="font-semibold text-gray-700">{queue?.estimatedWaitTime}</span></p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Actions & Stats */}
        <div className="space-y-6">
          {/* Quick Action - Write Prescription */}
          <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-cyan-600 to-teal-500 text-white">
            <div className="space-y-5">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1.5">Write Prescription</h3>
                <p className="text-sm text-cyan-50">Create and manage patient prescriptions</p>
              </div>
              <Button 
                className="w-full bg-white text-cyan-700 hover:bg-cyan-50 font-semibold h-11 shadow-md"
                onClick={() => navigate("/doctor/write-prescription")}
              >
                Create New
              </Button>
            </div>
          </Card>

          {/* Today's Statistics */}
          <Card className="p-6 border-0 shadow-md bg-white">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Today's Statistics</h3>
            </div>

            <div className="space-y-3">
              {statsLoading ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="h-20 bg-gray-50 animate-pulse rounded-xl" />
                ))
              ) : (
                <>
                  <StatCard 
                    title="Today's Appointments" 
                    value={stats?.todaysAppointments || 0} 
                    icon={Calendar} 
                    iconColor="text-white" 
                    bgColor="bg-cyan-500" 
                  />
                  <StatCard 
                    title="Completed Today" 
                    value={stats?.completedConsultations || 0} 
                    icon={CheckCircle} 
                    iconColor="text-white" 
                    bgColor="bg-green-500" 
                  />
                  <StatCard 
                    title="Waiting Patients" 
                    value={stats?.waitingPatients || 0} 
                    icon={Users} 
                    iconColor="text-white" 
                    bgColor="bg-orange-500" 
                  />
                  <StatCard 
                    title="Avg. Consultation" 
                    value={stats?.avgConsultationTime || 0} 
                    unit="min"
                    icon={Timer} 
                    iconColor="text-white" 
                    bgColor="bg-blue-500" 
                  />
                </>
              )}
            </div>
          </Card>

          {/* Patient History Quick Access */}
          <Card className="p-6 border-0 shadow-sm bg-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Patient History</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">Access patient records and consultation history</p>
            <Button 
              variant="outline" 
              className="w-full border-gray-300 h-10"
              onClick={() => navigate("/doctor/patient-history")}
            >
              View All Records
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

