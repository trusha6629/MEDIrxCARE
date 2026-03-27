import { useState, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Card } from "../common/Card";
import { cn } from "../common/utils";

export interface ProfileSettingsSection {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  content: ReactNode;
}

interface ProfileSettingsShellProps {
  title: string;
  description: string;
  sections: ProfileSettingsSection[];
  menuLabel?: string;
  defaultSectionId?: string;
}

export function ProfileSettingsShell({
  title,
  description,
  sections,
  menuLabel = "Profile Menu",
  defaultSectionId,
}: ProfileSettingsShellProps) {
  const initialSection = sections.find((section) => section.id === defaultSectionId)?.id ?? sections[0]?.id ?? "";
  const [activeSectionId, setActiveSectionId] = useState(initialSection);
  const activeSection = sections.find((section) => section.id === activeSectionId) ?? sections[0];

  if (!activeSection) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">{title}</h1>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>

      <Card className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="space-y-1 border-b border-gray-100 pb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">{menuLabel}</p>
          <p className="text-sm text-gray-600">Everything is organized into one horizontal profile workspace.</p>
        </div>

        <nav className="-mx-1 mt-4 flex gap-3 overflow-x-auto px-1 pb-2">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = section.id === activeSection.id;

            return (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSectionId(section.id)}
                className={cn(
                  "min-w-[220px] shrink-0 rounded-2xl px-4 py-3 text-left transition-all",
                  isActive
                    ? "bg-gradient-to-r from-cyan-600 to-teal-500 text-white shadow-md"
                    : "border border-gray-200 bg-gray-50 text-gray-600 hover:bg-white hover:text-gray-900",
                )}
              >
                <div className="flex items-start gap-3">
                  <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", isActive ? "text-white" : "text-gray-500")} />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium">{section.label}</span>
                    <span className={cn("mt-1 block text-xs leading-5", isActive ? "text-cyan-50" : "text-gray-500")}>
                      {section.description}
                    </span>
                  </span>
                </div>
              </button>
            );
          })}
        </nav>
      </Card>

      <div className="min-w-0 space-y-6">
        <Card className="rounded-3xl border border-gray-200 bg-white px-6 py-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-100 to-teal-50">
              <activeSection.icon className="h-6 w-6 text-cyan-700" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{activeSection.label}</h2>
              <p className="mt-1 text-sm text-gray-500">{activeSection.description}</p>
            </div>
          </div>
        </Card>

        {activeSection.content}
      </div>
    </div>
  );
}
