import { Users, Search, FileText, Calendar } from "lucide-react";
import { Card } from "../components/common/Card";
import { Input } from "../components/common/Input";
import { Button } from "../components/common/Button";
import { useState } from "react";

const patientRecords = [
  {
    id: 1,
    name: "John Smith",
    patientId: "P12345",
    lastVisit: "Feb 20, 2026",
    diagnosis: "Hypertension",
    visits: 8
  },
  {
    id: 2,
    name: "Sarah Johnson",
    patientId: "P12346",
    lastVisit: "Feb 25, 2026",
    diagnosis: "Cardiac Check-up",
    visits: 5
  },
  {
    id: 3,
    name: "Michael Chen",
    patientId: "P12347",
    lastVisit: "Feb 18, 2026",
    diagnosis: "Diabetes Type 2",
    visits: 12
  },
  {
    id: 4,
    name: "Emily Davis",
    patientId: "P12348",
    lastVisit: "Feb 22, 2026",
    diagnosis: "Migraine",
    visits: 6
  },
  {
    id: 5,
    name: "Robert Wilson",
    patientId: "P12349",
    lastVisit: "Feb 24, 2026",
    diagnosis: "Asthma",
    visits: 9
  }
];

export function DoctorPatientHistory() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPatients = patientRecords.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.patientId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Patient History</h1>
        <p className="text-gray-600 mt-1">Access patient records and consultation history</p>
      </div>

      {/* Search */}
      <Card className="p-4 border-0 shadow-sm bg-white">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by patient name or ID..."
            className="pl-12 h-11 rounded-xl bg-gray-50 border-gray-200 focus:border-cyan-500 focus:ring-cyan-500"
          />
        </div>
      </Card>

      {/* Patient Records */}
      <Card className="p-6 border-0 shadow-md bg-white">
        <div className="space-y-3">
          {filteredPatients.map((patient) => (
            <div 
              key={patient.id} 
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-11 h-11 bg-gradient-to-br from-cyan-600 to-teal-500 rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                  {patient.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{patient.name}</p>
                  <p className="text-xs text-gray-600">ID: {patient.patientId}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-sm">
                  <p className="text-gray-600">Last Visit</p>
                  <p className="font-medium text-gray-900">{patient.lastVisit}</p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-600">Total Visits</p>
                  <p className="font-medium text-gray-900">{patient.visits}</p>
                </div>
                <div className="text-sm min-w-[150px]">
                  <p className="text-gray-600">Last Diagnosis</p>
                  <p className="font-medium text-gray-900 truncate">{patient.diagnosis}</p>
                </div>
                <Button variant="outline" size="sm" className="border-gray-300 h-9 px-4">
                  <FileText className="w-4 h-4 mr-2" />
                  View Records
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No patient records found</p>
          </div>
        )}
      </Card>
    </div>
  );
}

