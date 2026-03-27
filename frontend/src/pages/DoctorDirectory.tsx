import { useEffect, useState } from "react";
import { Search, Star, Video, User as UserIcon, Calendar, MapPin } from "lucide-react";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { useNavigate } from "react-router";
import { DoctorService } from "../services/DoctorService";
import { LoadingSpinner } from "../components/common/LoadingSpinner";

const specializations = [
  "All", "Cardiology", "Dermatology", "Neurology", "Orthopedics", 
  "Pediatrics", "General Physician", "Psychiatry"
];

export function DoctorDirectory() {
  const navigate = useNavigate();
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const data = await DoctorService.getAllDoctors();
        setDoctors(data);
      } catch (error) {
        console.error("Failed to load doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSpecialty = selectedSpecialty === "All" || doctor.specialty === selectedSpecialty;
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpecialty && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Find Doctors</h1>
        <p className="text-gray-600 mt-2 text-lg">Search and book appointments with top healthcare professionals</p>
      </div>

      {/* Search */}
      <Card className="p-4 border-0 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by doctor name or specialty..."
            className="pl-12 h-14 rounded-xl bg-gray-50 border-gray-200 focus:border-cyan-500 focus:ring-cyan-500 transition-all"
          />
        </div>
      </Card>

      {/* Specialization Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {specializations.map((specialty) => (
          <button
            key={specialty}
            onClick={() => setSelectedSpecialty(specialty)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              selectedSpecialty === specialty
                ? "bg-gradient-to-r from-cyan-600 to-teal-500 text-white shadow-lg shadow-cyan-500/30"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300"
            }`}
          >
            {specialty}
          </button>
        ))}
      </div>

      {/* Doctor Cards */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
          <Card key={doctor.id} className="p-6 border-0 shadow-sm hover:shadow-xl transition-all group">
            <div className="space-y-4">
              {/* Doctor Info */}
              <div className="flex items-start gap-3">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-teal-500 rounded-2xl flex items-center justify-center text-white text-lg font-semibold shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                  {doctor.avatar}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                  <p className="text-sm text-gray-600">{doctor.specialty}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold text-gray-900">{doctor.rating}</span>
                    <span className="text-sm text-gray-500">({doctor.reviews})</span>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2.5 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <UserIcon className="w-4 h-4" />
                  <span>{doctor.experience} years experience</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{doctor.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Next: {doctor.nextAvailable}</span>
                </div>
              </div>

              {/* Fees */}
              <div className="flex gap-3 pt-3 border-t border-gray-100">
                <div className="flex-1 bg-blue-50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Video className="w-4 h-4 text-blue-600" />
                    <p className="text-xs text-gray-600 font-medium">Online</p>
                  </div>
                  <p className="text-xl font-semibold text-gray-900">${doctor.onlineFee}</p>
                </div>
                <div className="flex-1 bg-green-50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <UserIcon className="w-4 h-4 text-green-600" />
                    <p className="text-xs text-gray-600 font-medium">In-Person</p>
                  </div>
                  <p className="text-xl font-semibold text-gray-900">${doctor.offlineFee}</p>
                </div>
              </div>

              {/* Actions */}
                <Button 
                  className="w-full rounded-xl bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-700 hover:to-teal-600 shadow-lg shadow-cyan-500/30"
                  onClick={() => navigate("/dashboard/book-appointment", { state: { doctor } })}
                >
                  Book Appointment
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!loading && filteredDoctors.length === 0 && (
        <Card className="p-12 border-0 shadow-sm text-center">
          <p className="text-gray-600 text-lg">No doctors found matching your criteria.</p>
        </Card>
      )}
    </div>
  );
}
