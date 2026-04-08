import { TestTube, Search, Calendar, Clock, MapPin, IndianRupee } from "lucide-react";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { useState } from "react";
import { formatINR } from "../utils/currency";

const categories = [
  { name: "All Tests", count: 250, active: true },
  { name: "Blood Tests", count: 85, active: false },
  { name: "Imaging", count: 42, active: false },
  { name: "Pathology", count: 65, active: false },
  { name: "Cardiac", count: 28, active: false },
  { name: "Radiology", count: 30, active: false },
];

const popularTests = [
  {
    id: 1,
    name: "Complete Blood Count (CBC)",
    category: "Blood Test",
    price: 399,
    duration: "6-8 hours",
    preparation: "Fasting not required",
    description: "Comprehensive blood cell analysis including RBC, WBC, and platelets"
  },
  {
    id: 2,
    name: "Lipid Profile",
    category: "Blood Test",
    price: 549,
    duration: "12 hours",
    preparation: "12 hours fasting required",
    description: "Complete cholesterol screening including HDL, LDL, and triglycerides"
  },
  {
    id: 3,
    name: "Thyroid Function Test (TSH, T3, T4)",
    category: "Blood Test",
    price: 799,
    duration: "24 hours",
    preparation: "Fasting not required",
    description: "Comprehensive thyroid hormone levels assessment"
  },
  {
    id: 4,
    name: "HbA1c (Glycated Hemoglobin)",
    category: "Blood Test",
    price: 499,
    duration: "24 hours",
    preparation: "Fasting not required",
    description: "3-month average blood sugar level test for diabetes monitoring"
  },
  {
    id: 5,
    name: "Chest X-Ray",
    category: "Radiology",
    price: 899,
    duration: "Same day",
    preparation: "No preparation needed",
    description: "Digital X-ray imaging of chest and lungs"
  },
  {
    id: 6,
    name: "ECG (Electrocardiogram)",
    category: "Cardiac",
    price: 699,
    duration: "Immediate",
    preparation: "No preparation needed",
    description: "Heart electrical activity monitoring and rhythm analysis"
  },
  {
    id: 7,
    name: "Ultrasound Abdomen",
    category: "Imaging",
    price: 1299,
    duration: "Same day",
    preparation: "6 hours fasting required",
    description: "Detailed imaging of abdominal organs"
  },
  {
    id: 8,
    name: "Vitamin D Test",
    category: "Blood Test",
    price: 949,
    duration: "2-3 days",
    preparation: "Fasting not required",
    description: "Vitamin D levels assessment for bone health"
  },
];

const recentBookings = [
  {
    id: 1,
    name: "Complete Blood Count",
    date: "2024-03-10",
    time: "09:00 AM",
    location: "Lab - Building A, Floor 2",
    status: "scheduled"
  },
  {
    id: 2,
    name: "Lipid Profile",
    date: "2024-03-12",
    time: "10:30 AM",
    location: "Lab - Building A, Floor 2",
    status: "scheduled"
  },
];

export function PatientTestsServices() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Tests & Services</h1>
        <p className="text-sm text-gray-500 mt-1">Book diagnostic tests and medical services</p>
      </div>

      {/* Search Bar */}
      <Card className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search for tests, scans, or services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 rounded-xl border-gray-200"
          />
        </div>
      </Card>

      {/* Categories */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {categories.map((category, index) => (
          <button
            key={index}
            className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              category.active
                ? "bg-gradient-to-r from-cyan-600 to-teal-500 text-white shadow-md"
                : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
            }`}
          >
            {category.name} ({category.count})
          </button>
        ))}
      </div>

      {/* Recent Bookings */}
      {recentBookings.length > 0 && (
        <Card className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Tests</h3>
          <div className="space-y-3">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <TestTube className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-gray-900">{booking.name}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(booking.date).toLocaleDateString()}
                      </div>
                      <span className="text-sm text-gray-400">•</span>
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Clock className="w-3.5 h-3.5" />
                        {booking.time}
                      </div>
                      <span className="text-sm text-gray-400">•</span>
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <MapPin className="w-3.5 h-3.5" />
                        {booking.location}
                      </div>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="rounded-xl">
                  Reschedule
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Popular Tests */}
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Popular Tests & Services</h2>
          <p className="text-sm text-gray-500 mt-1">Most frequently booked diagnostic services</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {popularTests.map((test) => (
            <Card key={test.id} className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-cyan-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <TestTube className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">{test.name}</h3>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium">
                      {test.category}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-lg font-bold text-gray-900">
                    <IndianRupee className="w-5 h-5" />
                    {formatINR(test.price).replace("₹", "")}
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">{test.description}</p>

              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4 text-gray-400" />
                  {test.duration}
                </div>
                <span className="text-gray-300">•</span>
                <div className="text-gray-600">{test.preparation}</div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 h-10 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-700 hover:to-teal-600 text-white font-medium shadow-sm">
                  Book Now
                </Button>
                <Button variant="outline" className="h-10 rounded-xl">
                  Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-cyan-50 to-white border border-cyan-100 rounded-2xl shadow-sm">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm">
            <TestTube className="w-6 h-6 text-cyan-600" />
          </div>
          <h4 className="text-base font-semibold text-gray-900 mb-2">Home Sample Collection</h4>
          <p className="text-sm text-gray-600">Book tests from home. Our phlebotomist will visit you.</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-teal-50 to-white border border-teal-100 rounded-2xl shadow-sm">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm">
            <Clock className="w-6 h-6 text-teal-600" />
          </div>
          <h4 className="text-base font-semibold text-gray-900 mb-2">Quick Reports</h4>
          <p className="text-sm text-gray-600">Get digital reports within 24-48 hours of sample collection.</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-2xl shadow-sm">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm">
            <IndianRupee className="w-6 h-6 text-blue-600" />
          </div>
          <h4 className="text-base font-semibold text-gray-900 mb-2">Best Prices</h4>
          <p className="text-sm text-gray-600">NABL certified labs with competitive pricing and packages.</p>
        </Card>
      </div>
    </div>
  );
}
