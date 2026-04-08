import { useState } from "react";
import {
  AlertTriangle,
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
import { CareAssistantLogo } from "../components/icons/CareAssistantLogo";
import { DoctorSearchLogo } from "../components/icons/DoctorSearchLogo";
import { AI_CARE_GUIDE_NAME } from "../utils/brand";

interface Message {
  id: number;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface MedicineSuggestion {
  name: string;
  purpose: string;
  caution: string;
}

interface AiDoctorResult {
  summary: string;
  specialist: string;
  response: string;
  medicines: MedicineSuggestion[];
  selfCare: string[];
  urgentWarning: string;
}

const starterPrompts = [
  "I have fever, sore throat, and body pain since yesterday.",
  "There is stomach pain and nausea after meals for two days.",
  "I feel headache, eye strain, and dizziness after long work hours.",
];

const initialMessages: Message[] = [
  {
    id: 1,
    type: "ai",
    content:
      "Describe the symptoms in plain language, mention how long they have lasted, and include anything that makes them better or worse.",
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

  const submitIssue = async (rawIssue: string) => {
    const trimmedInput = rawIssue.trim();

    if (!trimmedInput) {
      return;
    }

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
      setError(requestError instanceof Error ? requestError.message : "Failed to get care guidance.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <Card className="overflow-hidden border-0 bg-[linear-gradient(135deg,_#0f172a_0%,_#155e75_45%,_#0f766e_100%)] p-0 text-white shadow-xl">
        <div className="grid gap-8 px-6 py-7 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium">
              <CareAssistantLogo className="h-4 w-4" />
              {AI_CARE_GUIDE_NAME}
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">Modern first-pass care guidance, designed to feel clinical and clear</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-cyan-50/80">
              Describe symptoms, review safe medicine suggestions to discuss, and understand when to book a doctor visit or seek urgent care.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => {
                    setInput(prompt);
                    void submitIssue(prompt);
                  }}
                  className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-left text-xs text-cyan-50 transition-all hover:bg-white/15"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {[
              {
                title: "Describe the issue",
                description: "Mention duration, intensity, and related symptoms.",
                icon: ClipboardPlus,
              },
              {
                title: "Review next steps",
                description: "See specialist suggestions, self-care, and cautions.",
                icon: Stethoscope,
              },
              {
                title: "Escalate safely",
                description: "Spot urgent warning signs without guessing.",
                icon: ShieldAlert,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 backdrop-blur">
                  <Icon className="h-5 w-5 text-cyan-100" />
                  <p className="mt-3 text-sm font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-cyan-50/75">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <Card className="rounded-2xl border border-red-100 bg-red-50 p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <AlertTriangle className="mt-0.5 h-6 w-6 flex-shrink-0 text-red-600" />
          <div>
            <p className="mb-1 font-semibold text-red-900">Emergency warning</p>
            <p className="text-sm leading-relaxed text-red-700">
              If the patient has chest pain, trouble breathing, severe bleeding, fainting, seizures, or any life-threatening symptom, call emergency services immediately.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_390px]">
        <Card className="overflow-hidden rounded-3xl border-0 shadow-lg dark:bg-slate-950">
          <div className="border-b border-gray-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-600 to-teal-500 text-white shadow-lg shadow-cyan-500/20">
                <CareAssistantLogo className="h-6 w-6" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900 dark:text-slate-50">{AI_CARE_GUIDE_NAME}</p>
                <p className="text-sm text-gray-500 dark:text-slate-400">Structured symptom guidance with a medical-first visual style</p>
              </div>
            </div>
          </div>

          <div className="h-[560px] space-y-4 overflow-y-auto bg-[linear-gradient(180deg,_#f8fbfd_0%,_#ffffff_30%,_#f8fbfd_100%)] p-6 dark:bg-slate-950">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.type === "user" ? "justify-end" : ""}`}>
                {message.type === "ai" && (
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-600 to-teal-500 text-white">
                    <CareAssistantLogo className="h-5 w-5" />
                  </div>
                )}
                <div
                  className={`max-w-[78%] rounded-2xl p-4 ${
                    message.type === "user"
                      ? "rounded-br-md bg-cyan-600 text-white"
                      : "rounded-bl-md border border-gray-100 bg-white text-gray-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
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
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-600 to-teal-500 text-white">
                  <CareAssistantLogo className="h-5 w-5" />
                </div>
                <div className="rounded-2xl rounded-bl-md border border-gray-100 bg-white p-4 text-sm text-gray-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                  Reviewing the case and preparing the next-care guidance...
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex gap-3">
              <Input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    void submitIssue(input);
                  }
                }}
                placeholder="Describe the symptoms, duration, severity, and any related triggers..."
                className="h-14 flex-1 rounded-xl border-gray-200 bg-gray-50 transition-all focus:border-cyan-500 focus:ring-cyan-500 dark:border-slate-700 dark:bg-slate-900"
              />
              <Button
                onClick={() => void submitIssue(input)}
                className="h-14 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-500 px-6 shadow-lg shadow-cyan-500/25 hover:from-cyan-700 hover:to-teal-600"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
            <p className="mt-3 text-xs text-gray-500 dark:text-slate-400">
              Always double-check allergies, pregnancy status, ongoing medicines, and doctor instructions before acting on any suggestion.
            </p>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100">
                <Stethoscope className="h-5 w-5 text-cyan-700" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-slate-50">Care plan</h2>
                <p className="text-sm text-gray-500 dark:text-slate-400">Actionable outputs appear here after each response.</p>
              </div>
            </div>

            {result ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">Suggested specialist</p>
                  <p className="mt-2 text-lg font-semibold text-cyan-950 dark:text-slate-50">{result.specialist}</p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">Guidance</p>
                  <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-slate-300">{result.response}</p>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">Medicines to discuss</p>
                  {result.medicines.map((medicine) => (
                    <div key={medicine.name} className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                      <div className="flex items-center gap-2">
                        <Pill className="h-4 w-4 text-teal-600" />
                        <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">{medicine.name}</p>
                      </div>
                      <p className="mt-2 text-sm text-gray-600 dark:text-slate-300">{medicine.purpose}</p>
                      <p className="mt-2 text-xs leading-5 text-amber-700 dark:text-amber-300">{medicine.caution}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">Self-care steps</p>
                  <div className="space-y-2">
                    {result.selfCare.map((step) => (
                      <div key={step} className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                        {step}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-950/30">
                  <p className="text-sm font-semibold text-red-900 dark:text-red-200">Get help urgently if</p>
                  <p className="mt-2 text-sm leading-6 text-red-700 dark:text-red-300">{result.urgentWarning}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Button
                    className="bg-gradient-to-r from-cyan-600 to-teal-500 text-white hover:from-cyan-700 hover:to-teal-600"
                    onClick={() => navigate("/dashboard/book-appointment")}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Book Appointment
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-200 dark:border-slate-700"
                    onClick={() => navigate("/dashboard/doctor-directory")}
                  >
                    <DoctorSearchLogo className="mr-2 h-4 w-4" />
                    Find Doctor
                  </Button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-5 text-sm leading-6 text-gray-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                Start with a symptom description to see specialist guidance, medicines to discuss, self-care steps, and red-flag warnings.
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
