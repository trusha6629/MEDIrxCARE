import { ReactNode } from "react";

interface GreetingSectionProps {
  name: string;
  message: string;
  extraContent?: ReactNode;
}

/**
 * Reusable Greeting Section component with gradient background
 */
export function GreetingSection({ name, message, extraContent }: GreetingSectionProps) {
  return (
    <div className="bg-gradient-to-r from-cyan-600 to-teal-500 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-400/20 rounded-full -ml-24 -mb-24 blur-2xl" />
      
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold mb-1.5 font-sans">Good Morning, {name}! 👋</h1>
          <p className="text-cyan-50 font-medium">{message}</p>
        </div>
        {extraContent}
      </div>
    </div>
  );
}
