import { Clock, Users, TrendingUp, AlertCircle } from "lucide-react";
import { Card } from "../components/common/Card";
import { Progress } from "../components/common/Progress";
import { Button } from "../components/common/Button";
import { useQueue } from "../hooks/useQueue";
import { useDashboardStats } from "../hooks/useDashboardStats";

export function LiveQueueTracker() {
  const { queue, loading: queueLoading } = useQueue();
  const { stats, loading: statsLoading } = useDashboardStats('patient');

  const currentServing = queue?.currentServing || 45;
  const yourNumber = 52; // This would normally come from the user's appointment data
  const peopleAhead = Math.max(0, yourNumber - currentServing);
  const estimatedWait = peopleAhead * 5; // 5 minutes per person
  const progressPercentage = ((currentServing / yourNumber) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 px-4 md:px-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Live Queue Tracker</h1>
        <p className="text-gray-600 mt-1">Real-time queue status for your appointment</p>
      </div>

      {/* Appointment Info */}
      <Card className="p-6 border-0 shadow-lg bg-gradient-to-r from-cyan-600 to-teal-500 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-cyan-50 mb-1 text-sm font-medium">Today's Appointment</p>
            <h3 className="text-2xl font-bold">Dr. Sarah Johnson</h3>
            <p className="text-cyan-50 mt-1 font-medium">Cardiology Department</p>
          </div>
          <div className="text-right">
            <p className="text-cyan-50 mb-1 text-sm font-medium">Scheduled Time</p>
            <p className="text-2xl font-bold">10:30 AM</p>
          </div>
        </div>
      </Card>

      {/* Queue Status Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-8 border-0 shadow-sm text-center bg-white border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-20 h-20 bg-cyan-50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-cyan-100">
            <Users className="w-10 h-10 text-cyan-600" />
          </div>
          <p className="text-gray-500 mb-1 text-sm font-medium uppercase tracking-wider">Currently Serving</p>
          <p className="text-6xl font-black text-gray-900 mb-2">{queueLoading ? '...' : currentServing}</p>
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <p className="text-sm text-green-600 font-semibold uppercase tracking-wide">Live Status</p>
          </div>
        </Card>

        <Card className="p-8 border-0 shadow-sm text-center bg-white border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-purple-100">
            <TrendingUp className="w-10 h-10 text-purple-600" />
          </div>
          <p className="text-gray-500 mb-1 text-sm font-medium uppercase tracking-wider">Your Queue Number</p>
          <p className="text-6xl font-black text-gray-900 mb-2">{yourNumber}</p>
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-orange-500 rounded-full" />
            <p className="text-sm text-orange-600 font-semibold uppercase tracking-wide">In Waiting</p>
          </div>
        </Card>
      </div>

      {/* Progress Indicator */}
      <Card className="p-6 border-0 shadow-sm bg-white border border-gray-100">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 tracking-tight">Queue Progress</h3>
            <span className="text-sm font-bold text-cyan-600">{Math.round(progressPercentage)}% Complete</span>
          </div>
          <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-600 to-teal-500 transition-all duration-1000 ease-out shadow-sm"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">
              {peopleAhead} {peopleAhead === 1 ? "person" : "people"} ahead of you
            </p>
            <p className="text-xs text-gray-400 font-medium">Remaining steps: {peopleAhead}</p>
          </div>
        </div>
      </Card>

      {/* Estimated Wait Time */}
      <Card className="p-6 border-0 shadow-sm bg-white border border-gray-100">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center flex-shrink-0 border border-orange-100 shadow-sm">
            <Clock className="w-7 h-7 text-orange-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-1 tracking-tight">Estimated Wait Time</h3>
            <div className="flex items-baseline gap-2 mb-2">
              <p className="text-4xl font-black text-gray-900">{estimatedWait}</p>
              <p className="text-lg font-bold text-gray-500">minutes</p>
            </div>
            <p className="text-sm text-gray-600 font-medium leading-relaxed">
              Based on current queue movement. You'll be notified when your turn is approaching.
            </p>
          </div>
        </div>
      </Card>

      {/* Tips */}
      <Card className="p-6 border-0 shadow-sm border-l-4 border-l-cyan-600 bg-cyan-50/50">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-cyan-600" />
          </div>
          <div>
            <p className="font-bold text-gray-900 mb-2 uppercase tracking-wide text-xs">Queue Guidelines</p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2 font-medium">• Please arrive <span className="text-cyan-700 font-bold">10 minutes</span> before your estimated time</li>
              <li className="flex items-center gap-2 font-medium">• Keep your <span className="text-cyan-700 font-bold">appointment confirmation</span> and ID ready</li>
              <li className="flex items-center gap-2 font-medium">• You'll receive a <span className="text-cyan-700 font-bold">push notification</span> when you're next</li>
              <li className="flex items-center gap-2 font-medium">• Missing your slot may require <span className="text-orange-700 font-bold">rejoining the queue</span></li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" className="h-14 rounded-2xl border-gray-200 hover:bg-gray-50 font-bold text-gray-700 shadow-sm">
          Cancel Appointment
        </Button>
        <Button className="h-14 rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-700 hover:to-teal-600 text-white font-bold shadow-lg shadow-cyan-600/20">
          Contact Support
        </Button>
      </div>

      {/* Recent Queue Movement */}
      <Card className="p-6 border-0 shadow-md bg-white border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-gray-600" />
          </div>
          <h3 className="font-bold text-gray-900 tracking-tight">Recent Queue Movement</h3>
        </div>
        <div className="space-y-3">
          {[
            { number: currentServing, time: "Just now", status: "Serving" },
            { number: currentServing - 1, time: "5 mins ago", status: "Completed" },
            { number: currentServing - 2, time: "10 mins ago", status: "Completed" },
            { number: currentServing - 3, time: "15 mins ago", status: "Completed" },
          ].map((item) => (
            <div
              key={item.number}
              className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors rounded-2xl border border-gray-100/50"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm ${
                  item.status === "Serving" 
                    ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white" 
                    : "bg-white text-gray-500 border border-gray-200"
                }`}>
                  {item.number}
                </div>
                <div>
                  <p className="font-bold text-gray-900">Token #{item.number}</p>
                  <p className="text-xs text-gray-500 font-medium">{item.time}</p>
                </div>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                item.status === "Serving"
                  ? "bg-green-100 text-green-700 shadow-sm"
                  : "bg-gray-200 text-gray-600"
              }`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

