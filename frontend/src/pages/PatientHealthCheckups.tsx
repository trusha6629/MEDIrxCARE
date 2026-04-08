import { Heart, Calendar, Clock, CheckCircle, ArrowRight, TrendingUp } from "lucide-react";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { formatINR } from "../utils/currency";

const checkupPackages = [
  {
    id: 1,
    name: "Basic Health Checkup",
    description: "Essential health screening for general wellness",
    price: 899,
    duration: "2-3 hours",
    tests: 15,
    popular: false,
    includes: [
      "Complete Blood Count",
      "Lipid Profile",
      "Blood Sugar (Fasting)",
      "Liver Function Test",
      "Kidney Function Test",
    ]
  },
  {
    id: 2,
    name: "Comprehensive Health Checkup",
    description: "Complete health assessment with advanced diagnostics",
    price: 1999,
    duration: "4-5 hours",
    tests: 35,
    popular: true,
    includes: [
      "All Basic Tests",
      "Thyroid Profile",
      "Vitamin D & B12",
      "ECG",
      "Chest X-Ray",
      "Doctor Consultation",
    ]
  },
  {
    id: 3,
    name: "Cardiac Health Package",
    description: "Specialized heart health screening",
    price: 1499,
    duration: "3-4 hours",
    tests: 20,
    popular: false,
    includes: [
      "ECG & Echo",
      "Lipid Profile Advanced",
      "Cardiac Enzymes",
      "Blood Pressure Monitoring",
      "Cardiologist Consultation",
    ]
  },
  {
    id: 4,
    name: "Diabetes Screening",
    description: "Complete diabetes risk assessment",
    price: 1199,
    duration: "2-3 hours",
    tests: 12,
    popular: false,
    includes: [
      "HbA1c Test",
      "Fasting Blood Sugar",
      "Post Prandial Sugar",
      "Kidney Function",
      "Lipid Profile",
    ]
  },
];

const upcomingCheckups = [
  {
    id: 1,
    name: "Annual Health Checkup",
    date: "2024-03-15",
    time: "09:00 AM",
    location: "MEDIrxCARE Main Campus",
    status: "scheduled"
  },
  {
    id: 2,
    name: "Cardiac Follow-up",
    date: "2024-03-28",
    time: "11:00 AM",
    location: "Cardiology Wing - Floor 3",
    status: "scheduled"
  },
];

const healthScore = {
  overall: 85,
  categories: [
    { name: "Heart Health", score: 92, status: "excellent" },
    { name: "Metabolic Health", score: 78, status: "good" },
    { name: "Physical Fitness", score: 85, status: "good" },
    { name: "Mental Wellness", score: 88, status: "excellent" },
  ]
};

export function PatientHealthCheckups() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Health Checkups</h1>
        <p className="text-sm text-gray-500 mt-1">Preventive health packages and wellness screenings</p>
      </div>

      {/* Health Score Card */}
      <Card className="p-6 bg-gradient-to-br from-cyan-50 to-teal-50 border border-cyan-200 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-lg">
                <div className="text-center">
                  <p className="text-3xl font-bold text-cyan-600">{healthScore.overall}</p>
                  <p className="text-xs text-gray-500">Score</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">Your Health Score</h3>
              <p className="text-sm text-gray-600 mb-3">Based on your recent checkups and vitals</p>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">+5 points from last month</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {healthScore.categories.map((category, index) => (
              <div key={index} className="text-center p-3 bg-white rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">{category.name}</p>
                <p className="text-lg font-bold text-gray-900">{category.score}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Upcoming Checkups */}
      {upcomingCheckups.length > 0 && (
        <Card className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Checkups</h3>
          <div className="space-y-3">
            {upcomingCheckups.map((checkup) => (
              <div key={checkup.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-xl border border-cyan-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <Heart className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-gray-900">{checkup.name}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(checkup.date).toLocaleDateString()}
                      </div>
                      <span className="text-sm text-gray-400">•</span>
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Clock className="w-3.5 h-3.5" />
                        {checkup.time}
                      </div>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="rounded-xl">
                  View Details
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Health Packages */}
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Available Health Packages</h2>
          <p className="text-sm text-gray-500 mt-1">Choose a package that suits your health needs</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {checkupPackages.map((pkg) => (
            <Card 
              key={pkg.id} 
              className={`p-6 bg-white border rounded-2xl shadow-sm hover:shadow-md transition-all relative ${
                pkg.popular ? "border-cyan-300 ring-2 ring-cyan-100" : "border-gray-200"
              }`}
            >
              {pkg.popular && (
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-gradient-to-r from-cyan-600 to-teal-500 text-white text-xs font-semibold rounded-full shadow-md">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{pkg.name}</h3>
                <p className="text-sm text-gray-600">{pkg.description}</p>
              </div>

              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-bold text-gray-900">{formatINR(pkg.price)}</span>
                <span className="text-sm text-gray-500">per checkup</span>
              </div>

              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-gray-400" />
                  {pkg.duration}
                </div>
                <span className="text-gray-300">•</span>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-gray-400" />
                  {pkg.tests} Tests
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-900 mb-3">Includes:</p>
                <ul className="space-y-2">
                  {pkg.includes.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <Button 
                className={`w-full h-11 rounded-xl font-medium shadow-sm transition-all ${
                  pkg.popular
                    ? "bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-700 hover:to-teal-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                }`}
              >
                Book Checkup
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
