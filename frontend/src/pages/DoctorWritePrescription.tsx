import { useState, useRef } from "react";
import { FileText, Pill, Plus, Upload, X, File } from "lucide-react";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { Label } from "../components/common/Label";

export function DoctorWritePrescription() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "application/pdf") {
        setSelectedFile(file);
      } else {
        alert("Please upload only PDF files.");
      }
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Write Prescription</h1>
          <p className="text-gray-600 mt-1">Create and manage patient prescriptions</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6 border-0 shadow-md bg-white">
            <form className="space-y-6">
              {/* Patient Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientName" className="text-gray-700 text-sm font-medium">Patient Name</Label>
                    <Input 
                      id="patientName" 
                      placeholder="Enter patient name" 
                      className="h-11 rounded-xl bg-gray-50 border-gray-200 focus:border-cyan-500 focus:ring-cyan-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patientId" className="text-gray-700 text-sm font-medium">Patient ID</Label>
                    <Input 
                      id="patientId" 
                      placeholder="Enter patient ID" 
                      className="h-11 rounded-xl bg-gray-50 border-gray-200 focus:border-cyan-500 focus:ring-cyan-500"
                    />
                  </div>
                </div>
              </div>

              {/* Diagnosis */}
              <div className="space-y-2">
                <Label htmlFor="diagnosis" className="text-gray-700 text-sm font-medium">Diagnosis</Label>
                <Input 
                  id="diagnosis" 
                  placeholder="Enter diagnosis" 
                  className="h-11 rounded-xl bg-gray-50 border-gray-200 focus:border-cyan-500 focus:ring-cyan-500"
                />
              </div>

              {/* Medications */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Medications</h3>
                  <Button type="button" variant="outline" size="sm" className="border-gray-300">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Medicine
                  </Button>
                </div>

                <div className="space-y-3">
                  <Card className="p-4 bg-gray-50 border border-gray-200">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Pill className="w-5 h-5 text-cyan-600" />
                      </div>
                      <div className="grid md:grid-cols-3 gap-3 flex-1">
                        <Input placeholder="Medicine name" className="h-10 rounded-lg bg-white" />
                        <Input placeholder="Dosage (e.g., 500mg)" className="h-10 rounded-lg bg-white" />
                        <Input placeholder="Frequency (e.g., 2x daily)" className="h-10 rounded-lg bg-white" />
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Additional Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-gray-700 text-sm font-medium">Additional Notes</Label>
                <textarea 
                  id="notes" 
                  rows={4}
                  placeholder="Enter any additional instructions or notes..."
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-cyan-500 focus:ring-cyan-500 transition-all resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button type="submit" className="flex-1 bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-700 hover:to-teal-600 text-white h-11 shadow-sm font-medium">
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Prescription
                </Button>
                <Button type="button" variant="outline" className="border-gray-300 h-11 px-6">
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* PDF Upload Section */}
        <div className="space-y-6">
          <Card className="p-6 border-0 shadow-md bg-white h-fit">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload PDF Prescription</h3>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Already have a scanned prescription? Upload it here as a PDF.
            </p>

            {!selectedFile ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-cyan-500 hover:bg-cyan-50/50 transition-all cursor-pointer group"
              >
                <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-cyan-100 transition-colors">
                  <Upload className="w-7 h-7 text-gray-400 group-hover:text-cyan-600" />
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">Click to upload</p>
                <p className="text-xs text-gray-500">Only PDF files accepted</p>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept=".pdf"
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-cyan-50 rounded-2xl border border-cyan-100 relative group">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <File className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <button 
                    onClick={removeFile}
                    className="p-1.5 bg-white rounded-full shadow-sm text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white shadow-sm">
                  Confirm & Upload
                </Button>
              </div>
            )}
          </Card>

          {/* Quick Guidelines */}
          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            <h4 className="font-semibold mb-3">Guidelines</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <span>Ensure the scan is clear and readable.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <span>File size should not exceed 5MB.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <span>Only original medical documents are accepted.</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
