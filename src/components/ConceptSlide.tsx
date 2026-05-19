import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FlipCard } from "./FlipCard";
import { getConceptById } from "../data/concepts";
import type { Concept, ViewMode } from "../types/concept";

interface ConceptSlideProps {
  concept: Concept;
  viewMode: ViewMode;
  onSelectRelated: (id: string) => void;
}

export function ConceptSlide({ concept, viewMode, onSelectRelated }: ConceptSlideProps) {
  const Icon = concept.icon;
  const hasContent =
    concept.hvacDetail.length > 0 || concept.technicalDetail.length > 0;

  return (
    <AnimatePresence mode="wait">
      <motion.article
        key={concept.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
        className="flex flex-col gap-6"
      >
        <header className="flex items-start gap-4">
          {Icon && (
            <div className="flex-shrink-0 p-3 rounded-lg bg-highlight">
              <Icon className="w-8 h-8" color="var(--color-secondary)" aria-hidden="true" />
            </div>
          )}
          <div>
            {concept.category && (
              <p className="font-mono text-xs uppercase tracking-wider text-gray m-0">
                {concept.category}
              </p>
            )}
            <h2 className="font-header font-bold text-3xl md:text-4xl tracking-tight m-0">
              {concept.hvacName}
            </h2>
            <p className="font-mono text-sm text-darkgray m-0 mt-1">
              {concept.technicalName}
            </p>
          </div>
        </header>

        {!hasContent && (
          <div className="border border-dashed border-gray rounded p-4 bg-highlight/40">
            <p className="m-0 italic text-darkgray">
              Content stub — d3fa4929 fills `hvacDetail` + `technicalDetail` in
              <code className="ml-1 font-mono text-xs bg-highlight px-1 py-0.5 rounded">
                src/data/concepts.ts
              </code>
              .
            </p>
          </div>
        )}

        <FlipCard concept={concept} viewMode={viewMode} />

        {concept.tierBreakdown && concept.tierBreakdown.length > 0 && (
          <section className="border border-lightgray rounded-lg p-4 bg-light">
            <h3 className="font-header font-semibold text-base m-0 mb-3">
              Tier Breakdown
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {concept.tierBreakdown.map((t) => (
                <div
                  key={t.tier}
                  className="border border-lightgray rounded p-3 bg-highlight/30"
                >
                  <p className="font-mono text-xs uppercase tracking-wider text-secondary m-0 mb-1">
                    {t.tier}
                  </p>
                  <p className="font-semibold text-sm m-0 mb-2">{t.label}</p>
                  <ul className="list-none m-0 p-0 font-mono text-xs text-darkgray">
                    {t.machines.map((m) => (
                      <li key={m} className="leading-relaxed">
                        · {m}
                      </li>
                    ))}
                  </ul>
                  {t.note && (
                    <p className="text-xs text-darkgray mt-2 italic m-0">{t.note}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {concept.verbatimQuote && (
          <blockquote className="border-l-4 border-accent pl-4 py-2 italic text-darkgray bg-highlight/40 rounded-r">
            <p className="m-0">"{concept.verbatimQuote.text}"</p>
            <footer className="font-mono text-xs not-italic text-gray mt-2">
              — {concept.verbatimQuote.attribution}
            </footer>
          </blockquote>
        )}

        {concept.metaCallout && (
          <p className="font-mono text-xs text-secondary bg-highlight/60 px-3 py-2 rounded border border-secondary/30">
            {concept.metaCallout}
          </p>
        )}

        {concept.whereTheMetaphorBreaks && (
          <aside className="border-l-4 border-accent bg-light rounded-r-lg p-4">
            <p className="font-mono text-xs uppercase tracking-wider text-accent m-0 mb-2">
              Where the metaphor breaks
            </p>
            <p className="m-0 text-darkgray">
              {concept.whereTheMetaphorBreaks}
            </p>
          </aside>
        )}

        {concept.relatedIds && concept.relatedIds.length > 0 && (
          <section className="border-t border-lightgray pt-4">
            <p className="font-mono text-xs uppercase tracking-wider text-gray m-0 mb-2">
              Related
            </p>
            <ul className="list-none m-0 p-0 flex flex-wrap gap-2">
              {concept.relatedIds.map((id) => {
                const related = getConceptById(id);
                if (!related) return null;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => onSelectRelated(id)}
                      className="inline-flex items-center gap-1 text-sm px-3 py-1.5 border border-lightgray rounded-full hover:bg-highlight hover:border-secondary transition-colors"
                    >
                      {related.hvacName}
                      <ArrowRight className="w-3 h-3" aria-hidden="true" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </motion.article>
    </AnimatePresence>
  );
}
