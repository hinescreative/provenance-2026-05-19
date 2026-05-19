import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cloud,
  Truck,
  RadioTower,
  Lock,
  Bot,
  ScrollText,
  Wrench,
} from "lucide-react";

/**
 * HVACDiagram — owned by 414ac530 / xmm12zxi (TEAM 1 parent).
 * Implemented 2026-05-19 ~15:40 CDT.
 *
 * Bird's-eye visual of the fleet:
 *   - Top: Central Dispatch (CF Edge + D1)
 *   - Middle: 5 entities — 2 Production Vans, 1 Router/Dispatch Tower, 2 Staging Vans
 *   - Bottom: Provenance audit trail (the chain-of-custody line)
 *
 * Click an entity to focus it (others dim). Click again or click outside to unfocus.
 * Tier walls dashed for Production (capability yes, permission no this week).
 * Self-contained — reads no concept data; just renders the canonical fleet layout.
 */

type EntityId = "dispatch" | "m3" | "pc" | "router" | "m1" | "imac";

interface Entity {
  id: EntityId;
  hvacLabel: string;
  technicalLabel: string;
  subtitle: string;
  tier: "edge" | "production" | "infrastructure" | "staging";
  icon: typeof Cloud;
  tagline: string;
  detail: string;
}

const ENTITIES: Entity[] = [
  {
    id: "dispatch",
    hvacLabel: "Central Dispatch + CRM",
    technicalLabel: "CF Edge + D1",
    subtitle: "Cloudflare",
    tier: "edge",
    icon: Cloud,
    tagline: "Source of truth — every job ticket lands here.",
    detail:
      "All canonical state lives here. Variants reach UP via HTTPS, never sideways. Doc 13 axiom.",
  },
  {
    id: "m3",
    hvacLabel: "Production Van A",
    technicalLabel: "M3 Mac",
    subtitle: "Front Office",
    tier: "production",
    icon: Truck,
    tagline: "Revenue route. Day job. No v0 experiments this week.",
    detail:
      "Capability to run v0, no permission. Doc 21 applied at the hardware layer — same shape as a tech who CAN process refunds but isn't authorized to.",
  },
  {
    id: "pc",
    hvacLabel: "Production Van B",
    technicalLabel: "i9 PC",
    subtitle: "Front Office",
    tier: "production",
    icon: Truck,
    tagline: "Revenue route. Frank + Nagatha + Bilby live here.",
    detail:
      "Client-facing variants (Telegram bots) run here. Air-gapped from v0 this week. Writes logged to active-events-table but hooks don't block + Pleco doesn't act (Wes call: Logged but unenforced).",
  },
  {
    id: "router",
    hvacLabel: "Shop Dispatch Tower",
    technicalLabel: "Cheesegrater · fleet-node",
    subtitle: "Infrastructure",
    tier: "infrastructure",
    icon: RadioTower,
    tagline: "Router. Not a van. Pulls App Updates from Corporate.",
    detail:
      "Tailscale hub. Pulls hooks from GitHub every 5 min, serves to vans over the radio (Tailscale LAN). No client routes, no telegram bot — structurally different from the vans.",
  },
  {
    id: "m1",
    hvacLabel: "Staging Van A",
    technicalLabel: "M1 Mac",
    subtitle: "R&D Fleet",
    tier: "staging",
    icon: Truck,
    tagline: "Proving ground. v0 runs here. Safe to break.",
    detail:
      "Pleco (Night-Shift Janitor) runs here. commit-msg hooks active. active-events-table records every write. If something loops or breaks, laugh + reboot — M3 is still printing money.",
  },
  {
    id: "imac",
    hvacLabel: "Staging Van B",
    technicalLabel: "2012 iMac",
    subtitle: "R&D Fleet",
    tier: "staging",
    icon: Truck,
    tagline: "Proving ground. v0 runs here. Codex inspects here.",
    detail:
      "Pleco runs here too. Codex (External Inspector — current face) walks the job ad hoc, files findings, leaves. Future: Codex as Supervisor over Pleco (v0.5+ roadmap).",
  },
];

const TIER_COLORS: Record<Entity["tier"], string> = {
  edge: "var(--color-secondary)",
  production: "var(--color-accent)",
  infrastructure: "var(--color-tertiary)",
  staging: "var(--color-secondary)",
};

export function HVACDiagram() {
  const [focused, setFocused] = useState<EntityId | null>(null);

  const dispatch = ENTITIES[0];
  const productionVans = ENTITIES.filter((e) => e.tier === "production");
  const router = ENTITIES.find((e) => e.tier === "infrastructure")!;
  const stagingVans = ENTITIES.filter((e) => e.tier === "staging");

  const isFocused = (id: EntityId) => focused === id;
  const isDim = (id: EntityId) => focused !== null && focused !== id;

  return (
    <div
      className="relative w-full rounded-2xl border border-lightgray bg-highlight/30 p-6 md:p-8"
      onClick={() => setFocused(null)}
    >
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="m-0 font-mono text-[10px] uppercase tracking-widest text-gray">
            Bird's-eye · click any entity to focus
          </p>
          <h3 className="font-header m-0 mt-1 text-lg font-semibold">
            The Fleet — HVAC Topology
          </h3>
        </div>
        <p className="m-0 font-mono text-[10px] uppercase tracking-wider text-gray">
          3-tier · ratified 2026-05-19 13:27 CDT
        </p>
      </div>

      {/* Dispatch (top) */}
      <div className="flex justify-center">
        <EntityNode
          entity={dispatch}
          focused={isFocused(dispatch.id)}
          dim={isDim(dispatch.id)}
          onClick={(e) => {
            e.stopPropagation();
            setFocused(focused === dispatch.id ? null : dispatch.id);
          }}
        />
      </div>

      {/* Connector: Dispatch → Router */}
      <svg
        className="mx-auto block"
        width="2"
        height="32"
        aria-hidden="true"
      >
        <line
          x1="1"
          y1="0"
          x2="1"
          y2="32"
          stroke="var(--color-gray)"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
      </svg>

      {/* Tier walls + 5 entities */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_auto_1fr] lg:gap-8">
        {/* Production Tier */}
        <TierWall
          label="Production Tier · air-gapped this week"
          sublabel="capability YES · permission NO"
          color="accent"
          dashed
        >
          {productionVans.map((e) => (
            <EntityNode
              key={e.id}
              entity={e}
              focused={isFocused(e.id)}
              dim={isDim(e.id)}
              onClick={(ev) => {
                ev.stopPropagation();
                setFocused(focused === e.id ? null : e.id);
              }}
              badge={<Lock size={12} className="text-accent" aria-label="locked" />}
            />
          ))}
        </TierWall>

        {/* Infrastructure */}
        <TierWall label="Infrastructure" color="tertiary">
          <EntityNode
            entity={router}
            focused={isFocused(router.id)}
            dim={isDim(router.id)}
            onClick={(ev) => {
              ev.stopPropagation();
              setFocused(focused === router.id ? null : router.id);
            }}
          />
        </TierWall>

        {/* Staging Tier */}
        <TierWall
          label="Staging Tier · proving ground"
          sublabel="capability YES · permission YES"
          color="secondary"
        >
          {stagingVans.map((e) => (
            <EntityNode
              key={e.id}
              entity={e}
              focused={isFocused(e.id)}
              dim={isDim(e.id)}
              onClick={(ev) => {
                ev.stopPropagation();
                setFocused(focused === e.id ? null : e.id);
              }}
              badge={<Bot size={12} className="text-secondary" aria-label="Pleco active" />}
            />
          ))}
        </TierWall>
      </div>

      {/* Provenance audit trail (bottom) */}
      <div className="mt-6 flex items-center gap-3 rounded-lg border border-dashed border-tertiary/60 bg-tertiary/5 px-4 py-3">
        <ScrollText size={18} className="text-tertiary shrink-0" />
        <div>
          <p className="m-0 font-mono text-[10px] uppercase tracking-wider text-darkgray">
            Job-Ticket Audit Trail · Chain-of-Custody Spine
          </p>
          <p className="m-0 text-sm text-darkgray">
            Every action stamped with <code className="font-mono text-xs text-secondary">session-id · team · timestamp · chain-of-custody-links</code> — runs across Staging this week; Production logs but doesn't enforce.
          </p>
        </div>
      </div>

      {/* Focused-entity detail card (overlay-style, in-flow) */}
      <AnimatePresence>
        {focused && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="mt-6 rounded-xl border border-secondary/40 bg-light p-4 shadow-sm"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const e = ENTITIES.find((x) => x.id === focused)!;
              const Icon = e.icon;
              return (
                <div className="flex gap-4">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${TIER_COLORS[e.tier]}1a` }}
                  >
                    <Icon size={24} style={{ color: TIER_COLORS[e.tier] }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h4 className="font-header m-0 text-base font-semibold">
                        {e.hvacLabel}
                      </h4>
                      <span className="font-mono text-xs text-gray">
                        = {e.technicalLabel}
                      </span>
                    </div>
                    <p className="font-mono mt-1 mb-2 text-[10px] uppercase tracking-wider text-tertiary">
                      {e.subtitle}
                    </p>
                    <p className="m-0 mb-2 text-sm text-darkgray">{e.tagline}</p>
                    <p className="m-0 text-sm">{e.detail}</p>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

interface TierWallProps {
  label: string;
  sublabel?: string;
  color: "secondary" | "tertiary" | "accent";
  dashed?: boolean;
  children: React.ReactNode;
}

function TierWall({ label, sublabel, color, dashed, children }: TierWallProps) {
  const borderClass = dashed ? "border-dashed" : "border-solid";
  const colorVar = `var(--color-${color})`;
  return (
    <div
      className={`relative rounded-xl border-2 ${borderClass} p-4`}
      style={{
        borderColor: `${colorVar}66`,
        backgroundColor: `${colorVar}08`,
      }}
    >
      <div className="mb-3 flex flex-col">
        <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: colorVar }}>
          {label}
        </span>
        {sublabel && (
          <span className="font-mono text-[9px] uppercase tracking-wider text-gray">
            {sublabel}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-3">{children}</div>
    </div>
  );
}

interface EntityNodeProps {
  entity: Entity;
  focused: boolean;
  dim: boolean;
  onClick: (e: React.MouseEvent) => void;
  badge?: React.ReactNode;
}

function EntityNode({ entity, focused, dim, onClick, badge }: EntityNodeProps) {
  const Icon = entity.icon;
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-pressed={focused}
      aria-label={`${entity.hvacLabel} (${entity.technicalLabel})`}
      animate={{
        scale: focused ? 1.06 : 1,
        opacity: dim ? 0.35 : 1,
      }}
      whileHover={{ scale: focused ? 1.06 : 1.03 }}
      transition={{ duration: 0.16 }}
      className="relative flex min-w-[140px] flex-1 cursor-pointer flex-col items-start gap-1 rounded-lg border border-lightgray bg-light p-3 text-left transition-colors hover:border-secondary"
      style={{
        outline: focused ? `2px solid ${TIER_COLORS[entity.tier]}` : "none",
        outlineOffset: 2,
      }}
    >
      <div className="flex w-full items-center justify-between">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-md"
          style={{ backgroundColor: `${TIER_COLORS[entity.tier]}1a` }}
        >
          <Icon size={16} style={{ color: TIER_COLORS[entity.tier] }} />
        </div>
        {badge && (
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-highlight">
            {badge}
          </div>
        )}
      </div>
      <p className="font-header m-0 mt-1 text-sm font-semibold leading-tight">
        {entity.hvacLabel}
      </p>
      <p className="font-mono m-0 text-[10px] uppercase tracking-wider text-gray">
        {entity.technicalLabel}
      </p>
    </motion.button>
  );
}
