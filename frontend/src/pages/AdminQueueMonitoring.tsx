import { useEffect, useMemo, useState } from "react";
import { Activity, Users, Clock, TrendingUp } from "lucide-react";
import { Card } from "../components/common/Card";
import { DoctorService } from "../services/DoctorService";
import { queueService } from "../services/QueueService";
import { LoadingSpinner } from "../components/common/LoadingSpinner";

export function AdminQueueMonitoring() {
  const [queueData, setQueueData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueueData = async () => {
      try {
        setLoading(true);
        const doctors = await DoctorService.getAllDoctors();
        const queueStatuses = await Promise.all(
          doctors.slice(0, 5).map(async (doctor) => {
            const queue = await queueService.getQueueStatus(doctor.id);
            const waiting = queue.waitingList?.length || 0;

            return {
              doctor: doctor.name,
              specialization: doctor.specialty,
              currentToken: queue.currentServing || 0,
              waiting,
              avgWaitTime: queue.estimatedWaitTime || "0 mins",
              servedToday: queue.completed || 0,
              status: waiting >= 5 ? "warning" : "active",
            };
          }),
        );

        setQueueData(queueStatuses);
      } catch (error) {
        console.error("Failed to fetch queue monitoring data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQueueData();
  }, []);

  const summary = useMemo(() => {
    return {
      activeQueues: queueData.length,
      totalWaiting: queueData.reduce((total, queue) => total + queue.waiting, 0),
      avgWait: queueData.length
        ? `${Math.round(queueData.reduce((total, queue) => total + Number.parseInt(queue.avgWaitTime, 10), 0) / queueData.length)}m`
        : "0m",
      servedToday: queueData.reduce((total, queue) => total + queue.servedToday, 0),
    };
  }, [queueData]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Queue Monitoring</h1>
        <p className="mt-1 text-sm text-gray-500">Live queue movement across active doctor schedules</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {[
              { label: "Active Queues", value: summary.activeQueues, icon: Activity, classes: "bg-cyan-100 text-cyan-600" },
              { label: "Total Waiting", value: summary.totalWaiting, icon: Users, classes: "bg-blue-100 text-blue-600" },
              { label: "Avg Wait Time", value: summary.avgWait, icon: Clock, classes: "bg-green-100 text-green-600" },
              { label: "Served Today", value: summary.servedToday, icon: TrendingUp, classes: "bg-emerald-100 text-emerald-600" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.label} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:bg-slate-950">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.classes}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{item.label}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-slate-50">{item.value}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {queueData.map((queue) => (
              <Card
                key={queue.doctor}
                className={`rounded-2xl border bg-white p-6 shadow-sm dark:bg-slate-950 ${
                  queue.status === "warning" ? "border-amber-200 bg-amber-50/30" : "border-gray-200"
                }`}
              >
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-50">{queue.doctor}</h3>
                    <p className="text-sm text-gray-500 dark:text-slate-400">{queue.specialization}</p>
                  </div>
                  <span
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                      queue.status === "active" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {queue.status === "active" ? "Active" : "High Wait Time"}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-white p-4 text-center">
                    <p className="mb-2 text-xs text-gray-500">Current Token</p>
                    <p className="text-3xl font-bold text-cyan-600">#{queue.currentToken}</p>
                  </div>
                  <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-4 text-center">
                    <p className="mb-2 text-xs text-gray-500">Waiting</p>
                    <p className="text-3xl font-bold text-blue-600">{queue.waiting}</p>
                  </div>
                  <div className="rounded-xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white p-4 text-center">
                    <p className="mb-2 text-xs text-gray-500">Avg Time</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-slate-50">{queue.avgWaitTime}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
