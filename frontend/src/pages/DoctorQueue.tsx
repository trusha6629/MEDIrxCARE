import { Activity, CheckCircle } from "lucide-react";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { useQueue } from "../hooks/useQueue";
import { queueService } from "../services/QueueService";

export function DoctorQueue() {
  const { queue, loading, refresh } = useQueue();

  const handleNextPatient = async () => {
    try {
      await queueService.nextPatient();
      await refresh();
    } catch (error) {
      console.error("Failed to advance queue:", error);
    }
  };

  if (loading || !queue) {
    return <div className="p-6">Loading queue...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Live Queue</h1>
        <p className="text-gray-600 mt-1">Manage patient queue in real-time</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Current Serving */}
        <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-cyan-50 to-teal-50 border border-cyan-200">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-cyan-600 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Currently Serving</h3>
          </div>
          
          <div className="flex items-center gap-4 mb-5">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-600 to-teal-500 rounded-xl flex items-center justify-center text-white shadow-lg">
              <span className="text-3xl font-bold">{queue.currentServing}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-lg truncate">{queue.currentPatient?.name || "No active patient"}</p>
              <p className="text-sm text-gray-600 truncate">{queue.currentPatient?.reason || "Waiting to start next consultation"}</p>
            </div>
          </div>
          
          <Button onClick={handleNextPatient} className="w-full bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-700 hover:to-teal-600 text-white h-11 shadow-sm font-medium">
            <CheckCircle className="w-4 h-4 mr-2" />
            Mark as Completed
          </Button>
        </Card>

        {/* Next Patient */}
        <Card className="p-6 border-0 shadow-md bg-white">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Next in Queue</h3>
          </div>
          
          <div className="flex items-center gap-4 mb-5">
            <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center text-gray-700 border-2 border-dashed border-gray-300">
              <span className="text-3xl font-bold">{queue.nextPatient.token}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-700 text-lg">{queue.nextPatient.name}</p>
              <p className="text-sm text-gray-500">{queue.nextPatient.reason}</p>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Today's Progress</span>
              <span className="text-lg font-semibold text-gray-900">{queue.completed} / {queue.totalToday}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Waiting List */}
      <Card className="p-6 border-0 shadow-md bg-white">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Waiting List</h3>
        <div className="space-y-3">
          {queue.waitingList.map((patient: any) => (
            <div key={patient.token} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center font-semibold text-gray-700">
                {patient.token}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{patient.name}</p>
                <p className="text-sm text-gray-600">{patient.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
