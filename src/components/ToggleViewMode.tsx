import React from "react";
import { Wrench, Cpu, Columns2 } from "lucide-react";
import type { ViewMode } from "../types/concept";

interface ToggleViewModeProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

const OPTIONS: { mode: ViewMode; label: string; icon: typeof Wrench }[] = [
  { mode: "hvac", label: "HVAC", icon: Wrench },
  { mode: "technical", label: "Technical", icon: Cpu },
  { mode: "paired", label: "Paired", icon: Columns2 },
];

export function ToggleViewMode({ mode, onChange }: ToggleViewModeProps) {
  return (
    <div
      role="radiogroup"
      aria-label="View mode"
      className="inline-flex border border-lightgray rounded overflow-hidden"
    >
      {OPTIONS.map((opt) => {
        const Icon = opt.icon;
        const isActive = mode === opt.mode;
        return (
          <button
            key={opt.mode}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(opt.mode)}
            className={[
              "flex items-center gap-1.5 px-3 py-2 font-mono text-xs transition-colors border-r border-lightgray last:border-r-0",
              isActive
                ? "bg-secondary text-light"
                : "bg-light text-darkgray hover:bg-highlight",
            ].join(" ")}
          >
            <Icon className="w-3.5 h-3.5" aria-hidden="true" />
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
