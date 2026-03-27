import { DollarSign, TrendingUp, Calendar, FileText } from "lucide-react";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";

const earningsData = {
  today: 850,
  weekly: 4200,
  monthly: 24500,
  total: 156000,
  consultations: {
    today: 6,
    monthly: 156,
    total: 892
  }
};

const recentTransactions = [
  { id: 1, patient: "John Smith", amount: 150, date: "Feb 26, 2026", type: "Video Consultation" },
  { id: 2, patient: "Sarah Johnson", amount: 200, date: "Feb 26, 2026", type: "In-Person" },
  { id: 3, patient: "Michael Chen", amount: 150, date: "Feb 25, 2026", type: "Video Consultation" },
  { id: 4, patient: "Emily Davis", amount: 200, date: "Feb 25, 2026", type: "In-Person" },
  { id: 5, patient: "Robert Wilson", amount: 150, date: "Feb 24, 2026", type: "Video Consultation" },
];

export function DoctorEarnings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Earnings</h1>
        <p className="text-gray-600 mt-1">Track your revenue and consultation statistics</p>
      </div>

      {/* Earnings Overview */}
      <div className="grid md:grid-cols-4 gap-5">
        <Card className="p-5 border-0 shadow-md bg-gradient-to-br from-cyan-50 to-teal-50 border border-cyan-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-cyan-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm font-medium text-gray-700">Today</p>
          </div>
          <p className="text-3xl font-semibold text-gray-900">${earningsData.today}</p>
          <p className="text-xs text-gray-600 mt-1">{earningsData.consultations.today} consultations</p>
        </Card>

        <Card className="p-5 border-0 shadow-sm bg-white border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-gray-700">This Week</p>
          </div>
          <p className="text-3xl font-semibold text-gray-900">${earningsData.weekly.toLocaleString()}</p>
          <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12% from last week
          </p>
        </Card>

        <Card className="p-5 border-0 shadow-sm bg-white border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-700">This Month</p>
          </div>
          <p className="text-3xl font-semibold text-gray-900">${earningsData.monthly.toLocaleString()}</p>
          <p className="text-xs text-gray-600 mt-1">{earningsData.consultations.monthly} consultations</p>
        </Card>

        <Card className="p-5 border-0 shadow-sm bg-white border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-sm font-medium text-gray-700">Total</p>
          </div>
          <p className="text-3xl font-semibold text-gray-900">${earningsData.total.toLocaleString()}</p>
          <p className="text-xs text-gray-600 mt-1">{earningsData.consultations.total} consultations</p>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="p-6 border-0 shadow-md bg-white">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          <Button variant="outline" size="sm" className="border-gray-300">
            <FileText className="w-4 h-4 mr-2" />
            Download Report
          </Button>
        </div>

        <div className="space-y-3">
          {recentTransactions.map((transaction) => (
            <div 
              key={transaction.id} 
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-teal-500 rounded-xl flex items-center justify-center text-white font-semibold text-sm">
                  {transaction.patient.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{transaction.patient}</p>
                  <p className="text-xs text-gray-600">{transaction.type}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900 text-lg">${transaction.amount}</p>
                <p className="text-xs text-gray-600">{transaction.date}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

