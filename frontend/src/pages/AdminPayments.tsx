import { IndianRupee, TrendingUp, CreditCard, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { formatINR } from "../utils/currency";

const recentTransactions = [
  {
    id: "TXN001234",
    patient: "Rohan Verma",
    doctor: "Dr. Aarav Mehta",
    amount: 3200,
    status: "completed",
    date: "2024-02-26 09:30",
    method: "Credit Card"
  },
  {
    id: "TXN001235",
    patient: "Ananya Patel",
    doctor: "Dr. Kavya Iyer",
    amount: 2400,
    status: "completed",
    date: "2024-02-26 10:15",
    method: "Insurance"
  },
  {
    id: "TXN001236",
    patient: "Vikram Nair",
    doctor: "Dr. Meera Kapoor",
    amount: 4100,
    status: "pending",
    date: "2024-02-26 11:00",
    method: "Credit Card"
  },
  {
    id: "TXN001237",
    patient: "Sneha Kulkarni",
    doctor: "Dr. Nisha Menon",
    amount: 1900,
    status: "failed",
    date: "2024-02-26 14:20",
    method: "Debit Card"
  },
  {
    id: "TXN001238",
    patient: "Karan Malhotra",
    doctor: "Dr. Rahul Bansal",
    amount: 5200,
    status: "completed",
    date: "2024-02-26 15:45",
    method: "Cash"
  },
];

export function AdminPayments() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Payments</h1>
        <p className="text-sm text-gray-500 mt-1">Financial transactions and revenue tracking</p>
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl flex items-center justify-center">
              <IndianRupee className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg">
              +15%
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-1">Today's Revenue</p>
          <p className="text-3xl font-bold text-gray-900">{formatINR(84500)}</p>
        </Card>

        <Card className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-cyan-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-cyan-600" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg">
              +12%
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-1">This Month</p>
          <p className="text-3xl font-bold text-gray-900">{formatINR(742500)}</p>
        </Card>

        <Card className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Successful</p>
          <p className="text-3xl font-bold text-gray-900">387</p>
        </Card>

        <Card className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-50 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Failed</p>
          <p className="text-3xl font-bold text-gray-900">12</p>
        </Card>
      </div>

      {/* Recent Transactions */}
      {recentTransactions.length > 0 ? (
        <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
              <p className="text-sm text-gray-500">Latest payment activities</p>
            </div>
            <Button variant="outline" className="rounded-xl">
              Export Report
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono text-gray-900">{transaction.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">{transaction.patient}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{transaction.doctor}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-900">{formatINR(transaction.amount)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{transaction.method}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{transaction.date}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                        transaction.status === "completed" 
                          ? "bg-green-50 text-green-700" 
                          : transaction.status === "pending"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-red-50 text-red-700"
                      }`}>
                        {transaction.status === "completed" && <CheckCircle className="w-3 h-3" />}
                        {transaction.status === "pending" && <Clock className="w-3 h-3" />}
                        {transaction.status === "failed" && <AlertCircle className="w-3 h-3" />}
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Button variant="outline" size="sm" className="rounded-xl">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card className="p-12 bg-white border border-gray-200 rounded-2xl shadow-sm text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <IndianRupee className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No transactions found</h3>
          <p className="text-gray-500">There are no payment records available at this time.</p>
        </Card>
      )}
    </div>
  );
}

