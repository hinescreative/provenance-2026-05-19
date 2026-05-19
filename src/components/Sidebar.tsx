import React, { useMemo } from "react";
import type { Concept } from "../types/concept";

interface SidebarProps {
  concepts: Concept[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function Sidebar({ concepts, selectedId, onSelect }: SidebarProps) {
  const grouped = useMemo(() => {
    const map = new Map<string, Concept[]>();
    for (const c of concepts) {
      const category = c.category ?? "Other";
      if (!map.has(category)) map.set(category, []);
      map.get(category)!.push(c);
    }
    return Array.from(map.entries());
  }, [concepts]);

  return (
    <aside className="md:w-72 md:min-w-72 border-b md:border-b-0 md:border-r border-lightgray bg-light/60">
      <nav className="p-4 md:p-6 md:sticky md:top-0 md:max-h-screen md:overflow-y-auto">
        {grouped.map(([category, items]) => (
          <div key={category} className="mb-6">
            <h2 className="font-mono text-xs uppercase tracking-wider text-gray mb-2 mt-0">
              {category}
            </h2>
            <ul className="list-none m-0 p-0">
              {items.map((c) => {
                const isSelected = c.id === selectedId;
                const Icon = c.icon;
                return (
                  <li key={c.id} className="mb-1">
                    <button
                      type="button"
                      onClick={() => onSelect(c.id)}
                      aria-current={isSelected ? "page" : undefined}
                      className={[
                        "w-full text-left px-3 py-2 rounded flex items-start gap-2 transition-colors",
                        "hover:bg-highlight",
                        isSelected
                          ? "bg-highlight border-l-2 border-accent font-semibold"
                          : "border-l-2 border-transparent",
                      ].join(" ")}
                    >
                      {Icon && (
                        <Icon
                          className="w-4 h-4 mt-0.5 flex-shrink-0"
                          color={isSelected ? "var(--color-accent)" : "var(--color-darkgray)"}
                          aria-hidden="true"
                        />
                      )}
                      <span className="flex flex-col">
                        <span className="text-sm leading-tight">{c.hvacName}</span>
                        <span className="font-mono text-[0.65rem] text-gray leading-tight">
                          {c.technicalName}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
