import { useEffect, useState } from "react";
import { Check, Calendar as CalendarIcon, Video, User as UserIcon, CreditCard, CheckCircle2 } from "lucide-react";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { Calendar } from "../components/common/Calendar";
import { useLocation } from "react-router";
import { DoctorService } from "../services/DoctorService";
import { appointmentService } from "../services/AppointmentService";

const steps = [
  { id: 1, name: "Select Doctor" },
  { id: 2, name: "Choose Mode" },
  { id: 3, name: "Pick Slot" },
  { id: 4, name: "Payment" },
  { id: 5, name: "Confirmation" }
];

const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM",
  "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
];

export function AppointmentBooking() {
  const location = useLocation();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(3);
  const [consultationType, setConsultationType] = useState<"online" | "offline">("online");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState("10:00 AM");
  const [selectedDoctor, setSelectedDoctor] = useState<any>(location.state?.doctor || null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingResult, setBookingResult] = useState<any>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await DoctorService.getAllDoctors();
        setDoctors(data);
        setSelectedDoctor((currentDoctor: any) => currentDoctor || data[0] || null);
      } catch (error) {
        console.error("Failed to load doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  const handleBooking = async () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      return;
    }

    if (!selectedDoctor || !selectedDate) {
      setBookingError("Please select a doctor, date, and time.");
      return;
    }

    try {
      setIsBooking(true);
      setBookingError("");
      const response = await appointmentService.book({
        doctorId: selectedDoctor.id,
        consultationType,
        selectedDate: selectedDate.toISOString(),
        selectedSlot,
        reason: "General consultation",
      });
      setBookingResult(response.appointment);
      setCurrentStep(5);
    } catch (error) {
      setBookingError(error instanceof Error ? error.message : "Failed to book appointment.");
    } finally {
      setIsBooking(false);
    }
  };

  const doctor = selectedDoctor || {
    name: "Loading doctor...",
    specialty: "General Physician",
    experience: "0 years",
    rating: 0,
    onlineFee: 50,
    offlineFee: 80,
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Book Appointment</h1>
        <p className="text-gray-600 mt-2 text-lg">Follow the steps to complete your booking</p>
      </div>

      {/* Step Indicator */}
      <Card className="p-6 border-0 shadow-sm">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all ${
                  currentStep >= step.id
                    ? "bg-gradient-to-r from-cyan-600 to-teal-500 text-white shadow-lg shadow-cyan-500/30"
                    : "bg-gray-200 text-gray-500"
                }`}>
                  {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                </div>
                <p className={`text-xs mt-2 font-medium ${
                  currentStep >= step.id ? "text-gray-900" : "text-gray-500"
                }`}>
                  {step.name}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={`h-1 flex-1 -mx-2 rounded-full ${
                  currentStep > step.id ? "bg-gradient-to-r from-cyan-600 to-teal-500" : "bg-gray-200"
                }`} />
              )}
            </div>
          ))}
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Doctor Selection (Step 1) */}
          {currentStep >= 1 && (
            <Card className="p-6 border-0 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Selected Doctor</h3>
              {doctors.length > 1 && (
                <div className="mb-4 grid gap-2 md:grid-cols-2">
                  {doctors.slice(0, 4).map((doctorOption) => (
                    <button
                      key={doctorOption.id}
                      type="button"
                      onClick={() => setSelectedDoctor(doctorOption)}
                      className={`rounded-xl border px-4 py-3 text-left transition-all ${
                        selectedDoctor?.id === doctorOption.id
                          ? "border-cyan-500 bg-cyan-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <p className="font-medium text-gray-900">{doctorOption.name}</p>
                      <p className="text-sm text-gray-500">{doctorOption.specialty}</p>
                    </button>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-teal-500 rounded-2xl flex items-center justify-center text-white text-lg font-semibold shadow-lg shadow-cyan-500/20">
                  {doctor.avatar || doctor.name.split(" ").slice(0, 2).map((part: string) => part[0]).join("")}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{doctor.name}</h4>
                  <p className="text-sm text-gray-600">{doctor.specialty}</p>
                  <p className="text-sm text-gray-500">{doctor.experience} experience • ⭐ {doctor.rating}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Consultation Mode (Step 2) */}
          {currentStep >= 2 && (
            <Card className="p-6 border-0 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Choose Consultation Mode</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => setConsultationType("online")}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    consultationType === "online"
                      ? "border-cyan-600 bg-cyan-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Video className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Video Consultation</p>
                      <p className="text-2xl font-semibold text-gray-900">${doctor.onlineFee}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Connect from anywhere via secure video call</p>
                </button>

                <button
                  onClick={() => setConsultationType("offline")}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    consultationType === "offline"
                      ? "border-cyan-600 bg-cyan-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <UserIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">In-Person Visit</p>
                      <p className="text-2xl font-semibold text-gray-900">${doctor.offlineFee}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Visit the clinic for face-to-face consultation</p>
                </button>
              </div>
            </Card>
          )}

          {/* Date & Time Selection (Step 3) */}
          {currentStep >= 3 && currentStep < 5 && (
            <Card className="p-6 border-0 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Select Date & Time</h3>
              
              <div className="flex justify-center mb-6">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-xl border"
                  disabled={(date) => date < new Date()}
                />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-900 mb-3">Available Time Slots</p>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                        selectedSlot === slot
                          ? "bg-gradient-to-r from-cyan-600 to-teal-500 text-white"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Payment (Step 4) */}
          {currentStep === 4 && (
            <Card className="p-6 border-0 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Payment Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200"
                    />
                  </div>
                </div>
              </div>
            </Card>
          )}

          {bookingError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {bookingError}
            </div>
          )}

          {/* Confirmation (Step 5) */}
          {currentStep === 5 && (
            <Card className="p-8 border-0 shadow-sm text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Booking Confirmed!</h3>
              <p className="text-gray-600 mb-6">
                Your appointment has been successfully booked. You will receive a confirmation email shortly.
              </p>
              <div className="bg-gray-50 rounded-xl p-6 text-left space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Appointment ID:</span>
                  <span className="font-semibold text-gray-900">#{bookingResult?.id || "APT-PENDING"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date & Time:</span>
                  <span className="font-semibold text-gray-900">
                    {bookingResult?.date || selectedDate?.toLocaleDateString()} at {bookingResult?.time || selectedSlot}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mode:</span>
                  <span className="font-semibold text-gray-900 capitalize">{bookingResult?.mode || consultationType}</span>
                </div>
              </div>
              <Button 
                className="w-full mt-6 bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-700 hover:to-teal-600"
                onClick={() => window.location.href = '/dashboard'}
              >
                Back to Dashboard
              </Button>
            </Card>
          )}
        </div>

        {/* Booking Summary */}
        <Card className="p-6 border-0 shadow-sm h-fit sticky top-6">
          <h3 className="font-semibold text-gray-900 mb-4">Booking Summary</h3>
          
          <div className="space-y-4">
            <div className="pb-4 border-b border-gray-100">
              <p className="text-sm text-gray-600">Doctor</p>
              <p className="font-medium text-gray-900">{doctor.name}</p>
            </div>
            
            {currentStep >= 2 && (
              <div className="pb-4 border-b border-gray-100">
                <p className="text-sm text-gray-600">Consultation Type</p>
                <p className="font-medium text-gray-900 capitalize">{consultationType}</p>
              </div>
            )}
            
            {currentStep >= 3 && (
              <>
                <div className="pb-4 border-b border-gray-100">
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium text-gray-900">{selectedDate?.toLocaleDateString()}</p>
                </div>
                <div className="pb-4 border-b border-gray-100">
                  <p className="text-sm text-gray-600">Time</p>
                  <p className="font-medium text-gray-900">{selectedSlot}</p>
                </div>
              </>
            )}

            <div className="pt-2">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Consultation Fee</span>
                <span className="font-medium text-gray-900">
                  ${consultationType === "online" ? doctor.onlineFee : doctor.offlineFee}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Platform Fee</span>
                <span className="font-medium text-gray-900">$5</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="font-semibold text-gray-900">Total Amount</span>
                <span className="font-semibold text-cyan-600 text-xl">
                  ${(consultationType === "online" ? doctor.onlineFee : doctor.offlineFee) + 5}
                </span>
              </div>
            </div>
          </div>

          {currentStep < 5 && (
            <Button 
              onClick={handleBooking}
              disabled={isBooking}
              className="w-full mt-6 h-14 bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-700 hover:to-teal-600 shadow-lg shadow-cyan-500/30"
            >
              {currentStep === 4 ? (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  {isBooking ? "Processing..." : "Pay & Confirm"}
                </>
              ) : (
                "Continue"
              )}
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
}
