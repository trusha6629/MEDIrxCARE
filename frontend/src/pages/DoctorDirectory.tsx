import { useEffect, useState } from "react";
import { Search, Star, Video, User as UserIcon, Calendar, MapPin } from "lucide-react";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { useNavigate } from "react-router";
import { DoctorService } from "../services/DoctorService";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { DoctorSearchLogo } from "../components/icons/DoctorSearchLogo";
import { formatINR } from "../utils/currency";

const specializations = [
  "All",
  "Cardiology",
  "Dermatology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "General Physician",
  "Psychiatry",
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

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSpecialty = selectedSpecialty === "All" || doctor.specialty === selectedSpecialty;
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpecialty && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-slate-950 via-cyan-950 to-teal-900 p-0 text-white shadow-xl">
        <div className="grid gap-6 px-6 py-7 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium">
              <DoctorSearchLogo className="h-4 w-4" />
              Doctor discovery
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">Find the right doctor for your next step</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-cyan-50/80">
              Filter by specialty, compare availability, and book the consultation mode that fits best.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
            {[
              { label: "Available Today", value: filteredDoctors.length || doctors.length },
              { label: "Top Rated", value: "4.8+" },
              { label: "Online Consults", value: "Fast" },
              { label: "Specialties", value: specializations.length - 1 },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.16em] text-cyan-100/70">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card className="border-0 bg-white p-4 shadow-sm dark:bg-slate-950">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by doctor name or specialty..."
            className="h-14 rounded-xl border-gray-200 bg-gray-50 pl-12 transition-all focus:border-cyan-500 focus:ring-cyan-500 dark:border-slate-700 dark:bg-slate-900"
          />
        </div>
      </Card>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {specializations.map((specialty) => (
          <button
            key={specialty}
            onClick={() => setSelectedSpecialty(specialty)}
            className={`whitespace-nowrap rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${
              selectedSpecialty === specialty
                ? "bg-gradient-to-r from-cyan-600 to-teal-500 text-white shadow-lg shadow-cyan-500/25"
                : "border border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
            }`}
          >
            {specialty}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredDoctors.map((doctor) => (
            <Card
              key={doctor.id}
              className="group border-0 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl dark:bg-slate-950"
            >
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-600 to-teal-500 text-lg font-semibold text-white shadow-lg shadow-cyan-500/20 transition-transform duration-200 group-hover:scale-105">
                    {doctor.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-slate-50">{doctor.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-slate-400">{doctor.specialty}</p>
                    <div className="mt-1 flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold text-gray-900 dark:text-slate-50">{doctor.rating}</span>
                      <span className="text-sm text-gray-500 dark:text-slate-400">({doctor.reviews})</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 border-t border-gray-100 pt-3 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                    <UserIcon className="h-4 w-4" />
                    <span>{doctor.experience} experience</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                    <MapPin className="h-4 w-4" />
                    <span>{doctor.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                    <Calendar className="h-4 w-4" />
                    <span>Next: {doctor.nextAvailable}</span>
                  </div>
                </div>

                <div className="flex gap-3 border-t border-gray-100 pt-3 dark:border-slate-800">
                  <div className="flex-1 rounded-xl bg-blue-50 p-3 dark:bg-slate-900">
                    <div className="mb-1 flex items-center gap-2">
                      <Video className="h-4 w-4 text-blue-600" />
                      <p className="text-xs font-medium text-gray-600 dark:text-slate-400">Online</p>
                    </div>
                    <p className="text-xl font-semibold text-gray-900 dark:text-slate-50">{formatINR(doctor.onlineFee)}</p>
                  </div>
                  <div className="flex-1 rounded-xl bg-green-50 p-3 dark:bg-slate-900">
                    <div className="mb-1 flex items-center gap-2">
                      <UserIcon className="h-4 w-4 text-green-600" />
                      <p className="text-xs font-medium text-gray-600 dark:text-slate-400">In-Person</p>
                    </div>
                    <p className="text-xl font-semibold text-gray-900 dark:text-slate-50">{formatINR(doctor.offlineFee)}</p>
                  </div>
                </div>

                <Button
                  className="w-full rounded-xl bg-gradient-to-r from-cyan-600 to-teal-500 text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-700 hover:to-teal-600"
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
        <Card className="border-0 bg-white p-12 text-center shadow-sm dark:bg-slate-950">
          <p className="text-lg text-gray-600 dark:text-slate-400">No doctors matched your current filters.</p>
        </Card>
      )}
    </div>
  );
}
