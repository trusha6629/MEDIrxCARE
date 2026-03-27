import { useState, useEffect } from "react";
import { Clock, Users, Hash, Bell, CheckCircle, TrendingUp, AlertCircle } from "lucide-react";
import { Button } from "../common/Button";
import { useQueue } from "../../hooks/useQueue";
import { LoadingSpinner } from "../common/LoadingSpinner";

/**
 * Component to display the live queue status for patients
 */
export function QueueStatus() {
  const { queue, loading, error } = useQueue();
  const [showNotification, setShowNotification] = useState(false);

  // Hardcoded patient data for demo purposes (usually comes from Auth/Context)
  const [patientData] = useState({
    yourToken: "A-25",
    category: "General Consultation",
    appointmentTime: "10:30 AM",
  });

  // Calculate if turn is approaching
  useEffect(() => {
    if (queue) {
      const yourTokenNum = parseInt(patientData.yourToken.split("-")[1]);
      const currentServingNum = queue.currentServing;
      const patientsAhead = yourTokenNum - currentServingNum;

      if (patientsAhead > 0 && patientsAhead <= 2) {
        setShowNotification(true);
      }
    }
  }, [queue, patientData.yourToken]);

  if (loading) return <LoadingSpinner />;
  
  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-2xl border border-red-100 flex items-center gap-3">
        <AlertCircle className="w-5 h-5" />
        <p>Failed to load queue status. Please try again later.</p>
      </div>
    );
  }

  if (!queue) return null;

  const yourTokenNum = parseInt(patientData.yourToken.split("-")[1]);
  const currentServingNum = queue.currentServing;
  const patientsAhead = Math.max(0, yourTokenNum - currentServingNum);
  
  // Calculate progress percentage
  const totalSlots = 30; // Mock total slots for progress calculation
  const progress = Math.min(100, (currentServingNum / yourTokenNum) * 100);

  return (
    <div className="space-y-4">
      {/* Alert Notification: Turn Approaching */}
      {showNotification && patientsAhead > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 shadow-sm animate-pulse">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-amber-900 mb-1">Your Turn is Approaching!</h4>
              <p className="text-sm text-amber-700 leading-relaxed">
                Your consultation will start soon. Please reach the waiting area and be ready.
              </p>
            </div>
            <button
              onClick={() => setShowNotification(false)}
              className="text-amber-600 hover:text-amber-800 text-sm font-medium"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Success Notification: It's Your Turn */}
      {patientsAhead === 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-green-900 mb-1">It's Your Turn!</h4>
              <p className="text-sm text-green-700 leading-relaxed">
                Please proceed to the consultation room. The doctor is ready to see you.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Queue Status Card */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 to-teal-500 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold text-lg">Queue Status</h3>
              <p className="text-cyan-100 text-sm mt-0.5">{patientData.category}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Queue Information */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Your Token */}
            <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-2xl p-5 border border-cyan-100">
              <div className="flex items-center gap-2 mb-3">
                <Hash className="w-4 h-4 text-cyan-600" />
                <span className="text-sm font-medium text-cyan-900">Your Token</span>
              </div>
              <div className="text-3xl font-bold text-cyan-600">{patientData.yourToken}</div>
            </div>

            {/* Current Token */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-5 border border-purple-100">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Current Token</span>
              </div>
              <div className="text-3xl font-bold text-purple-600">A-{queue.currentServing}</div>
            </div>
          </div>

          {/* Queue Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Patients Ahead</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{patientsAhead}</div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Estimated Wait</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {queue.estimatedWaitTime}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">Queue Progress</span>
              <span className="text-gray-500">{Math.round(progress)}%</span>
            </div>
            <div className="relative">
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-600 to-teal-500 rounded-full transition-all duration-1000 ease-out shadow-md shadow-cyan-500/30"
                  style={{ width: `${progress}%` }}
                >
                  <div className="h-full w-full bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-pulse" />
                </div>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-400">A-{queue.currentServing}</span>
                <span className="text-xs font-medium text-cyan-600">{patientData.yourToken}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button variant="outline" className="w-full h-11 rounded-xl border-gray-300 hover:bg-gray-50">
              Cancel Appointment
            </Button>
            <Button className="w-full h-11 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-700 hover:to-teal-600 shadow-md shadow-cyan-500/20">
              Notify Doctor
            </Button>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-100">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="font-medium text-blue-900 text-sm mb-1">Important Information</h4>
            <p className="text-xs text-blue-700 leading-relaxed">
              Please arrive at the waiting area at least 5 minutes before your turn.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
