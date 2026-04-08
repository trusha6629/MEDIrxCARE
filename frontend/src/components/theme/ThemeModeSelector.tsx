import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "../common/DropdownMenu";

const themeOptions = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export function ThemeModeSelector({ label = "Appearance" }: { label?: string }) {
  const { resolvedTheme, setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTheme = mounted ? theme || "light" : "light";
  const previewTheme = mounted ? resolvedTheme || "light" : "light";

  return (
    <>
      <DropdownMenuLabel className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-slate-400">
        {label}
      </DropdownMenuLabel>
      <DropdownMenuRadioGroup value={activeTheme} onValueChange={(value) => setTheme(value)}>
        {themeOptions.map((option) => {
          const Icon = option.icon;
          const isActive = activeTheme === option.value;

          return (
            <DropdownMenuRadioItem
              key={option.value}
              value={option.value}
              className="mx-1 rounded-xl px-9 py-2.5 focus:bg-cyan-50 focus:text-cyan-700 dark:focus:bg-slate-800 dark:focus:text-slate-100"
            >
              <Icon className={isActive ? "text-cyan-600 dark:text-cyan-300" : "text-gray-500 dark:text-slate-400"} />
              <span className="text-sm text-gray-700 dark:text-slate-200">{option.label}</span>
              {option.value === "system" && (
                <span className="ml-auto text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-slate-500">
                  {previewTheme}
                </span>
              )}
            </DropdownMenuRadioItem>
          );
        })}
      </DropdownMenuRadioGroup>
    </>
  );
}
