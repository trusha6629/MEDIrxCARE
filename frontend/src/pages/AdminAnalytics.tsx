import { BarChart3, TrendingUp, Users, Calendar, Activity, IndianRupee } from "lucide-react";
import { Card } from "../components/common/Card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  AreaChart,
  Area
} from "recharts";
import { formatINR } from "../utils/currency";

const appointmentData = [
  { name: "Mon", count: 45 },
  { name: "Tue", count: 52 },
  { name: "Wed", count: 48 },
  { name: "Thu", count: 61 },
  { name: "Fri", count: 55 },
  { name: "Sat", count: 32 },
  { name: "Sun", count: 18 },
];

const revenueData = [
  { name: "Jan", revenue: 450000 },
  { name: "Feb", revenue: 520000 },
  { name: "Mar", revenue: 480000 },
  { name: "Apr", revenue: 610000 },
  { name: "May", revenue: 550000 },
  { name: "Jun", revenue: 670000 },
];

const departmentData = [
  { name: "Cardiology", patients: 120 },
  { name: "Neurology", patients: 85 },
  { name: "Orthopedic", patients: 150 },
  { name: "Pediatric", patients: 210 },
  { name: "Dermatology", patients: 95 },
];

export function AdminAnalytics() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Hospital Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Detailed performance metrics and platform insights</p>
        </div>
        <div className="flex gap-2">
          <select className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 12 Months</option>
          </select>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-cyan-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Patients</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-gray-900">12,847</p>
                <span className="text-xs font-medium text-green-600">+12%</span>
              </div>
            </div>
          </div>
        </Card>
        <Card className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Appointments</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-gray-900">3,422</p>
                <span className="text-xs font-medium text-green-600">+8%</span>
              </div>
            </div>
          </div>
        </Card>
        <Card className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <IndianRupee className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-gray-900">{formatINR(3284000)}</p>
                <span className="text-xs font-medium text-green-600">+15%</span>
              </div>
            </div>
          </div>
        </Card>
        <Card className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">System Health</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-gray-900">99.9%</p>
                <span className="text-xs font-medium text-gray-400">Stable</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Appointments Chart */}
        <Card className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-600" />
              Weekly Appointments
            </h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={appointmentData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <Tooltip 
                  cursor={{ fill: '#f9fafb' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar 
                  dataKey="count" 
                  fill="url(#colorCyan)" 
                  radius={[6, 6, 0, 0]} 
                  barSize={40}
                />
                <defs>
                  <linearGradient id="colorCyan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0891b2" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0891b2" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Revenue Trend Chart */}
        <Card className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-green-600" />
              Revenue Growth
            </h3>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg">Target: {formatINR(4000000)}</span>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#colorGreen)" 
                />
                <defs>
                  <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Patients by Department */}
        <Card className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              Patients by Department
            </h3>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  width={100}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar 
                  dataKey="patients" 
                  fill="#8b5cf6" 
                  radius={[0, 6, 6, 0]} 
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
