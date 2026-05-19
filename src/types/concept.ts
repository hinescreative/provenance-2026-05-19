// Canonical shape for every HVAC-analogy concept in the presentation.
//
// Status: PROPOSED 2026-05-19 by future-vault-state-clone (b760fdc9).
// d3fa4929 fills concepts.ts against this interface.
// Iterate the interface in joint TEAM 1 review if a field is missing or wrong.

import type { LucideIcon } from "lucide-react";

/**
 * Hardware tier from Wes's 2026-05-19 13:27 CDT ratification.
 *
 * - "production" : M3 Mac + i9 PC. Air-gapped from v0 this week.
 * - "staging"    : M1 Mac + 2012 iMac. Where v0 deploys + Pleco/Codex run.
 * - "infrastructure" : Cheesegrater. Fleet router / GitHub-cache for hooks.
 */
export type Tier = "production" | "staging" | "infrastructure";

/**
 * A single HVAC↔technical mapping. Each one renders as a ConceptSlide
 * with a FlipCard for the perspective swap.
 */
export interface Concept {
  /** kebab-case slug used in routing + sidebar keys */
  id: string;
  /** Optional grouping for the sidebar (e.g., "Infrastructure", "People", "Policy") */
  category?: string;
  /** HVAC-side display name. Wes's mental-model first-language. */
  hvacName: string;
  /** Technical-side display name. The architecture term. */
  technicalName: string;
  /** One-sentence HVAC summary. Render as subtitle on the HVAC face. */
  hvacTagline: string;
  /** One-sentence technical summary. Render as subtitle on the technical face. */
  technicalTagline: string;
  /** Paragraphs of HVAC-side explanation. Each item = a paragraph. */
  hvacDetail: string[];
  /** Paragraphs of technical-side explanation. Each item = a paragraph. */
  technicalDetail: string[];
  /** Lucide icon component (imported by reference, not string). */
  icon: LucideIcon;
  /** Optional accent CSS color or theme token. Defaults to --color-secondary. */
  accentColor?: string;
  /** IDs of related concepts for cross-linking + "related" footer on each slide. */
  relatedIds?: string[];
  /** Tier breakdown — only meaningful for hardware-facing concepts (e.g., "5 Fleet Vans"). */
  tierBreakdown?: {
    tier: Tier;
    label: string;
    machines: string[];
    note?: string;
  }[];
  /** Optional verbatim quote (Wes-said-this-on-this-date). Renders as a callout. */
  verbatimQuote?: { text: string; attribution: string };
  /** Optional "this is doc N applied at layer X" meta-callout. */
  metaCallout?: string;
  /**
   * Edge-case fence — where the metaphor leads to mis-conclusions.
   * Render as a distinct callout (not buried in technicalDetail prose).
   * Discipline introduced by d3fa4929 in concepts.ts authoring;
   * dedicated field added 2026-05-19 to make the fence visually distinct.
   */
  whereTheMetaphorBreaks?: string;
}

/**
 * Top-level view modes — the global toggle in the header.
 * - "hvac"      : every slide shows the HVAC face by default
 * - "technical" : every slide shows the technical face by default
 * - "paired"    : both faces visible side-by-side (no flip animation)
 */
export type ViewMode = "hvac" | "technical" | "paired";
