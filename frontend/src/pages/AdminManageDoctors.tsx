import { useState, useEffect } from "react";
import { Search, Filter, UserCheck, Mail, Phone, MapPin, MoreVertical, Edit, Ban, CheckCircle } from "lucide-react";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { useNavigate } from "react-router";
import { DoctorService } from "../services/DoctorService";
import { LoadingSpinner } from "../components/common/LoadingSpinner";

export function AdminManageDoctors() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const data = await DoctorService.getAllDoctors();
        setDoctors(data as any[]);
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter(doctor => 
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Manage Doctors</h1>
          <p className="text-sm text-gray-500 mt-1">Oversee and manage all medical professionals</p>
        </div>
        <Button 
          className="bg-gradient-to-r from-cyan-600 to-teal-500 text-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
          onClick={() => navigate("/admin/doctors/add")}
        >
          <UserCheck className="w-4 h-4 mr-2" />
          Add New Doctor
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name, email, or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 rounded-xl border-gray-200"
            />
          </div>
          <Button variant="outline" className="rounded-xl h-12 px-6">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </Card>

      {/* Doctors Grid */}
      {loading ? (
        <LoadingSpinner />
      ) : filteredDoctors.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.id} className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-teal-500 rounded-xl flex items-center justify-center text-white font-semibold text-lg shadow-md shadow-cyan-500/20">
                    {doctor.avatar}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                    <p className="text-sm text-gray-500">{doctor.specialization}</p>
                    <span className={`inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-lg text-xs font-medium ${
                      doctor.status === "active" 
                        ? "bg-green-50 text-green-700" 
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      <CheckCircle className="w-3 h-3" />
                      {doctor.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{doctor.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{doctor.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{doctor.location}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex gap-6">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Experience</p>
                    <p className="text-sm font-semibold text-gray-900">{doctor.experience}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Total Patients</p>
                    <p className="text-sm font-semibold text-gray-900">{doctor.patients}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-xl">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-xl text-red-600 hover:bg-red-50">
                    <Ban className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 bg-white border border-gray-200 rounded-2xl shadow-sm text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCheck className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No doctors found</h3>
          <p className="text-gray-500">There are currently no medical professionals matching your search.</p>
        </Card>
      )}
    </div>
  );
}
