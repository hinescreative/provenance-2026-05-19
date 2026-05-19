import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RotateCw } from "lucide-react";
import type { Concept, ViewMode } from "../types/concept";

interface FlipCardProps {
  concept: Concept;
  viewMode: ViewMode;
}

/**
 * Two-faced concept card:
 * - viewMode="hvac"      → HVAC face front, click to flip
 * - viewMode="technical" → Technical face front, click to flip
 * - viewMode="paired"    → both visible side-by-side, no flip
 *
 * 3D flip uses CSS perspective + preserve-3d (utility classes in index.css).
 */
export function FlipCard({ concept, viewMode }: FlipCardProps) {
  const [flipped, setFlipped] = useState(viewMode === "technical");

  // Re-sync to viewMode when the global toggle changes.
  useEffect(() => {
    if (viewMode === "hvac") setFlipped(false);
    if (viewMode === "technical") setFlipped(true);
  }, [viewMode]);

  if (viewMode === "paired") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Face concept={concept} side="hvac" />
        <Face concept={concept} side="technical" />
      </div>
    );
  }

  return (
    <div className="flip-perspective relative">
      <motion.div
        className="flip-preserve relative w-full"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0.0, 0.2, 1] }}
      >
        <div className="flip-hide-back">
          <Face concept={concept} side="hvac" />
        </div>
        <div className="flip-hide-back flip-back absolute inset-0">
          <Face concept={concept} side="technical" />
        </div>
      </motion.div>
      <button
        type="button"
        onClick={() => setFlipped((v) => !v)}
        className="absolute top-3 right-3 flex items-center gap-1 font-mono text-xs px-2 py-1 bg-light/90 border border-lightgray rounded hover:bg-highlight z-10"
        aria-label={flipped ? "Show HVAC face" : "Show technical face"}
      >
        <RotateCw className="w-3 h-3" />
        flip
      </button>
    </div>
  );
}

function Face({ concept, side }: { concept: Concept; side: "hvac" | "technical" }) {
  const isHvac = side === "hvac";
  const title = isHvac ? concept.hvacName : concept.technicalName;
  const tagline = isHvac ? concept.hvacTagline : concept.technicalTagline;
  const detail = isHvac ? concept.hvacDetail : concept.technicalDetail;
  const sideLabel = isHvac ? "HVAC view" : "Technical view";
  const accent = isHvac ? "var(--color-tertiary)" : "var(--color-secondary)";

  return (
    <div
      className="border-2 rounded-lg p-5 bg-light min-h-[260px]"
      style={{ borderColor: accent }}
    >
      <p
        className="font-mono text-xs uppercase tracking-wider m-0 mb-2"
        style={{ color: accent }}
      >
        {sideLabel}
      </p>
      <h3 className="font-header font-semibold text-xl m-0 mb-2">{title}</h3>
      <p className="text-darkgray italic m-0 mb-4">{tagline}</p>
      {detail.length === 0 ? (
        <p className="text-gray italic m-0">
          (Content pending — d3fa4929 owns this slot.)
        </p>
      ) : (
        detail.map((p, i) => (
          <p key={i} className="m-0 mb-3 last:mb-0">
            {p}
          </p>
        ))
      )}
    </div>
  );
}
