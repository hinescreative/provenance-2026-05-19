import React, { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { ConceptSlide } from "./components/ConceptSlide";
import { ToggleViewMode } from "./components/ToggleViewMode";
import { RatificationDashboard } from "./components/RatificationDashboard";
import { HVACDiagram } from "./components/HVACDiagram";
import { concepts, getConceptById, DEFAULT_CONCEPT_ID } from "./data/concepts";
import type { ViewMode } from "./types/concept";

export function App() {
  const [selectedId, setSelectedId] = useState<string>(DEFAULT_CONCEPT_ID);
  const [viewMode, setViewMode] = useState<ViewMode>("paired");
  const [showDiagram, setShowDiagram] = useState<boolean>(false);

  const selected = getConceptById(selectedId);

  return (
    <div className="min-h-screen flex flex-col bg-light text-dark">
      <header className="border-b border-lightgray px-6 py-4 flex flex-wrap gap-4 items-baseline justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-gray">
            Fleet Rebuild · Provenance Architecture
          </p>
          <h1 className="font-header font-bold text-2xl md:text-3xl tracking-tight m-0">
            HVAC Edition
          </h1>
          <p className="text-darkgray italic text-sm m-0 mt-1">
            Click any concept. Flip the card to swap perspectives. The whole architecture, in two languages.
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <button
            onClick={() => setShowDiagram((v) => !v)}
            className="font-mono text-xs px-3 py-2 border border-lightgray rounded hover:bg-highlight transition-colors"
            type="button"
          >
            {showDiagram ? "Hide Diagram" : "Show Diagram"}
          </button>
          <ToggleViewMode mode={viewMode} onChange={setViewMode} />
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row">
        <Sidebar
          concepts={concepts}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />

        <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
          {showDiagram && (
            <section className="mb-10 border border-lightgray rounded-lg p-4 bg-highlight/30">
              <HVACDiagram />
            </section>
          )}

          {selected ? (
            <ConceptSlide concept={selected} viewMode={viewMode} onSelectRelated={setSelectedId} />
          ) : (
            <p className="text-gray italic">
              Concept "{selectedId}" not found. Pick another from the sidebar.
            </p>
          )}
        </main>
      </div>

      <footer className="border-t border-lightgray px-6 py-8 bg-highlight/20">
        <RatificationDashboard />
        <p className="font-mono text-xs text-gray mt-6 text-center">
          PROPOSED · b760fdc9 future-vault-state-clone · TEAM 1 build · mac · {new Date().toISOString().slice(0, 16)}Z
          {" · "}
          <a href="/audit" className="text-secondary hover:text-accent underline">view forensic audit surface →</a>
        </p>
      </footer>
    </div>
  );
}
