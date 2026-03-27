import { Activity, Users, Clock, TrendingUp } from "lucide-react";
import { Card } from "../components/common/Card";

const queueData = [
  {
    doctor: "Dr. Sarah Miller",
    specialization: "Cardiologist",
    currentToken: 7,
    waiting: 5,
    avgWaitTime: "15 min",
    status: "active",
  },
  {
    doctor: "Dr. Michael Chen",
    specialization: "Orthopedic",
    currentToken: 4,
    waiting: 4,
    avgWaitTime: "20 min",
    status: "active",
  },
  {
    doctor: "Dr. Emily Johnson",
    specialization: "Pediatrician",
    currentToken: 12,
    waiting: 3,
    avgWaitTime: "12 min",
    status: "active",
  },
  {
    doctor: "Dr. Robert Williams",
    specialization: "Neurologist",
    currentToken: 3,
    waiting: 8,
    avgWaitTime: "45 min",
    status: "warning",
  },
  {
    doctor: "Dr. Lisa Anderson",
    specialization: "Dermatologist",
    currentToken: 8,
    waiting: 2,
    avgWaitTime: "10 min",
    status: "active",
  },
];

export function AdminQueueMonitoring() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Queue Monitoring</h1>
        <p className="text-sm text-gray-500 mt-1">Real-time queue status across all departments</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-cyan-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Active Queues</p>
              <p className="text-2xl font-bold text-gray-900">5</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Waiting</p>
              <p className="text-2xl font-bold text-gray-900">22</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Avg Wait Time</p>
              <p className="text-2xl font-bold text-gray-900">20m</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Served Today</p>
              <p className="text-2xl font-bold text-gray-900">67</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Queue Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {queueData.map((queue, index) => (
          <Card 
            key={index} 
            className={`p-6 bg-white border rounded-2xl shadow-sm ${
              queue.status === "warning" 
                ? "border-amber-200 bg-amber-50/30" 
                : "border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{queue.doctor}</h3>
                <p className="text-sm text-gray-500">{queue.specialization}</p>
              </div>
              <span className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                queue.status === "active" 
                  ? "bg-green-50 text-green-700" 
                  : "bg-amber-50 text-amber-700"
              }`}>
                {queue.status === "active" ? "Active" : "High Wait Time"}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-cyan-50 to-white rounded-xl border border-cyan-100">
                <p className="text-xs text-gray-500 mb-2">Current Token</p>
                <p className="text-3xl font-bold text-cyan-600">#{queue.currentToken}</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100">
                <p className="text-xs text-gray-500 mb-2">Waiting</p>
                <p className="text-3xl font-bold text-blue-600">{queue.waiting}</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 mb-2">Avg Time</p>
                <p className="text-2xl font-bold text-gray-900">{queue.avgWaitTime}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

