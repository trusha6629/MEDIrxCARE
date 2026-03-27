import { useState } from "react";
import {
  AlertTriangle,
  Bot,
  Calendar,
  ClipboardPlus,
  Pill,
  Send,
  ShieldAlert,
  Stethoscope,
  User,
} from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { Input } from "../components/common/Input";
import { api } from "../services/ApiService";

interface Message {
  id: number;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface AiDoctorResult {
  summary: string;
  specialist: string;
  response: string;
  medicines: MedicineSuggestion[];
  selfCare: string[];
  urgentWarning: string;
}

const initialMessages: Message[] = [
  {
    id: 1,
    type: "ai",
    content:
      "Hello, I'm MediSense AI Doctor. Describe your problem in plain language and I'll suggest possible relief options, medicines to discuss, and when to see a doctor.",
    timestamp: new Date(),
  },
];

export function AiSymptomChecker() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<AiDoctorResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        type: "user",
        content: trimmedInput,
        timestamp: new Date(),
      },
    ]);
    setInput("");
    setIsLoading(true);
    setError("");

    try {
      const nextResult = await api.post<AiDoctorResult>("/ai/doctor", {
        issue: trimmedInput,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          type: "ai",
          content: nextResult.response,
          timestamp: new Date(),
        },
      ]);
      setResult(nextResult);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to get AI doctor guidance.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">MediSense AI Doctor</h1>
          <p className="mt-2 max-w-3xl text-lg text-gray-600">
            Describe the problem you are having and get a fast first-pass view of likely care steps, possible medicine options, and when to book a doctor visit.
          </p>
        </div>
        <div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-800">
          Informational guidance only. This is not a prescription or emergency service.
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-100">
            <ClipboardPlus className="h-5 w-5 text-cyan-700" />
          </div>
          <h2 className="text-base font-semibold text-gray-900">Describe the problem</h2>
          <p className="mt-2 text-sm leading-6 text-gray-500">Tell the AI what hurts, how long it has been going on, and any related symptoms like fever, cough, nausea, or rash.</p>
        </Card>
        <Card className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-teal-100">
            <Pill className="h-5 w-5 text-teal-700" />
          </div>
          <h2 className="text-base font-semibold text-gray-900">Review medicine options</h2>
          <p className="mt-2 text-sm leading-6 text-gray-500">See common relief options the patient can discuss, plus cautions so the UI stays clinically careful.</p>
        </Card>
        <Card className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100">
            <Stethoscope className="h-5 w-5 text-amber-700" />
          </div>
          <h2 className="text-base font-semibold text-gray-900">Escalate when needed</h2>
          <p className="mt-2 text-sm leading-6 text-gray-500">The page highlights when to book a doctor and which specialist is the best next step.</p>
        </Card>
      </div>

      <Card className="rounded-2xl border-l-4 border-l-red-500 border-red-100 bg-red-50 p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <AlertTriangle className="mt-0.5 h-6 w-6 flex-shrink-0 text-red-600" />
          <div>
            <p className="mb-1 font-semibold text-red-900">Emergency Warning</p>
            <p className="text-sm leading-relaxed text-red-700">
              If the patient has chest pain, trouble breathing, severe bleeding, fainting, seizures, or other life-threatening symptoms, call emergency services immediately.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_380px]">
        <Card className="overflow-hidden rounded-3xl border-0 shadow-lg">
          <div className="relative overflow-hidden bg-gradient-to-r from-cyan-600 to-teal-500 p-6 text-white">
            <div className="absolute right-0 top-0 h-48 w-48 -translate-y-1/2 translate-x-1/3 rounded-full bg-white/10 blur-2xl" />
            <div className="relative flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                <Bot className="h-7 w-7" />
              </div>
              <div>
                <p className="text-lg font-semibold">MediSense AI Doctor</p>
                <p className="text-sm text-cyan-50">Guided symptom review, medicine suggestions, and care escalation</p>
              </div>
            </div>
          </div>

          <div className="h-[520px] space-y-4 overflow-y-auto bg-gray-50 p-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.type === "user" ? "justify-end" : ""}`}>
                {message.type === "ai" && (
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-600 to-teal-500">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[78%] rounded-2xl p-4 ${
                    message.type === "user"
                      ? "rounded-br-md bg-cyan-600 text-white"
                      : "rounded-bl-md border border-gray-100 bg-white text-gray-900"
                  }`}
                >
                  <p className="text-sm leading-6">{message.content}</p>
                </div>
                {message.type === "user" && (
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-700 to-slate-900">
                    <User className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-600 to-teal-500">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div className="rounded-2xl rounded-bl-md border border-gray-100 bg-white p-4 text-sm text-gray-500">
                  MediSense AI Doctor is reviewing the case...
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 bg-white p-5">
            <div className="flex gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSend();
                  }
                }}
                placeholder="Describe the problem... for example: 'I have fever, sore throat, and body pain since yesterday'"
                className="h-14 flex-1 rounded-xl border-gray-200 bg-gray-50 transition-all focus:border-cyan-500 focus:ring-cyan-500"
              />
              <Button
                onClick={handleSend}
                className="h-14 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-500 px-6 shadow-lg shadow-cyan-500/30 hover:from-cyan-700 hover:to-teal-600"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
            <p className="mt-3 text-xs text-gray-500">
              Patients should check allergies, pregnancy status, current medicines, and clinician advice before taking any suggested medicine.
            </p>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100">
                <ShieldAlert className="h-5 w-5 text-cyan-700" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">AI Doctor Summary</h2>
                <p className="text-sm text-gray-500">Your latest medicine and care guidance appears here.</p>
              </div>
            </div>

            {result ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-4">
                  <p className="text-sm font-medium text-cyan-900">{result.summary}</p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                    Suggested next doctor: {result.specialist}
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-900">Suggested medicine options</p>
                  {result.medicines.map((medicine) => (
                    <div key={medicine.name} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                      <div className="flex items-center gap-2">
                        <Pill className="h-4 w-4 text-teal-600" />
                        <p className="text-sm font-semibold text-gray-900">{medicine.name}</p>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">{medicine.purpose}</p>
                      <p className="mt-2 text-xs leading-5 text-amber-700">{medicine.caution}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-900">Self-care steps</p>
                  <div className="space-y-2">
                    {result.selfCare.map((step) => (
                      <div key={step} className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">
                        {step}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-semibold text-red-900">Get help urgently if</p>
                  <p className="mt-2 text-sm leading-6 text-red-700">{result.urgentWarning}</p>
                </div>

                <div className="flex gap-3">
                  <Button
                    className="flex-1 bg-gradient-to-r from-cyan-600 to-teal-500 text-white hover:from-cyan-700 hover:to-teal-600"
                    onClick={() => navigate("/dashboard/book-appointment")}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Book Appointment
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => navigate("/dashboard/doctor-directory")}>
                    Find Doctor
                  </Button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-5 text-sm leading-6 text-gray-500">
                Start by describing the patient's problem. Once you submit a message, MediSense AI Doctor will show likely relief options, medicine suggestions, and the best specialist to follow up with.
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
