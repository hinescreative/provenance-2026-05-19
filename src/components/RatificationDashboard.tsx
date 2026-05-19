import React, { useState } from "react";
import {
  CheckCircle2,
  Pencil,
  Clock,
  ChevronDown,
  ChevronRight,
  Lock,
  Copy,
  Check,
} from "lucide-react";

/**
 * RatificationDashboard
 * Owned by eiwg8nvg (e05f620b, TEAM 2 partner, v0-cost-skeptic baton holder).
 * Canonical source: research/provenance-2026-05-19/RATIFICATION-FINAL.md
 *
 * 4 questions per the proposed AskUserQuestion structure. Conditional rendering:
 * Q2 gated by Q1; Q3 gated by Q2; Q4 independent (parallel doc 13/16 split).
 * Buttons stage a decision in local state. "Lock all selections" generates a
 * JSON payload Wes pastes back into chat so the session can fire the actual
 * AskUserQuestion with his pre-filled selections + confirm-or-revise pass.
 */

type Decision = "ratify" | "amend" | "defer" | null;

interface Question {
  id: "q1" | "q2" | "q3" | "q4";
  label: string;
  ratifies: string;
  detail: React.ReactNode;
  conditional?: { gatedBy: "q1" | "q2" | "q3"; readable: string };
}

function CapabilityPermissionTable() {
  const rows = [
    {
      op: "Excision (Pleco)",
      marker: 'Any session writes status: excise',
      actor: "Pleco moves to Vault Archive",
      doc: "Doc 20",
      layer: "Operational",
    },
    {
      op: "Key rotation",
      marker: "Session marks status: rotate on key reference",
      actor: "Key-rotation bot rotates + updates audit",
      doc: "TBD",
      layer: "Operational (future)",
    },
    {
      op: "Vault excision",
      marker: "Session marks vault doc",
      actor: "Pleco (Vault Archive variant)",
      doc: "Doc 20 instance",
      layer: "Operational",
    },
    {
      op: "Schema migration",
      marker: "Session marks status: migrate",
      actor: "Migration bot applies + verifies",
      doc: "TBD",
      layer: "Operational (future)",
    },
    {
      op: "Variant deprecation",
      marker: "Session marks status: deprecate",
      actor: "Fleet-management bot tombstones + audits",
      doc: "TBD",
      layer: "Operational (future)",
    },
    {
      op: "Tier promotion (hardware)",
      marker: "Any session marks machine status: promote-to-production",
      actor: "Wes-via-AskUserQuestion",
      doc: "Doc 21",
      layer: "Hardware",
    },
  ];

  return (
    <div className="overflow-x-auto mt-3">
      <table className="w-full text-xs font-mono border-collapse">
        <thead>
          <tr className="bg-highlight">
            <th className="text-left p-2 border border-lightgray font-semibold">Operation</th>
            <th className="text-left p-2 border border-lightgray font-semibold">Marker</th>
            <th className="text-left p-2 border border-lightgray font-semibold">Bounded actor</th>
            <th className="text-left p-2 border border-lightgray font-semibold">Doc</th>
            <th className="text-left p-2 border border-lightgray font-semibold">Layer</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.op}>
              <td className="p-2 border border-lightgray align-top">{r.op}</td>
              <td className="p-2 border border-lightgray align-top text-darkgray">{r.marker}</td>
              <td className="p-2 border border-lightgray align-top text-darkgray">{r.actor}</td>
              <td className="p-2 border border-lightgray align-top text-darkgray">{r.doc}</td>
              <td className="p-2 border border-lightgray align-top text-darkgray">{r.layer}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function V0ScopeSubitems() {
  const items = [
    {
      title: "Unified event-type scope",
      body: "{write, delete, rename, send, route, mcp-call, kv-put, pleco-compact, hook-drift, hook-hash-mismatch, excise-tag} — extensible. Wes call #3 + Gemini both selected unified scope: write-focused-v0 is blind to peer-message silent stalls.",
    },
    {
      title: "30-day rolling retention",
      body: "Last-N retention rejected — dangerous in retry loops (agent stuck in retry blows out slots with garbage, overwriting WHY it started looping).",
    },
    {
      title: "idempotency-key column with NULL = no-claim",
      body: "Column ships v0 for Pleco's /compact crash-safety. NULL is a valid value meaning 'this event does not claim idempotency semantics.' Schema MUST permit NULL; future NOT NULL tightening requires explicit ratification. Anti-creep at schema layer.",
    },
    {
      title: "Warning-content attribution — HARD REQUIREMENT",
      body: "When tiered enforcement fires on operations affecting non-self-authored targets, the warning MUST surface (a) inferred author session-id and (b) chain-of-custody-link to most recent authorizing event. Without (a)+(b), the warning is performative — same failure mode as the deletion-incident. Spec-level requirement, not implementation detail.",
    },
    {
      title: "Tiered enforcement (replaces universal hard-block)",
      body: "Default: warn + auto-telemetry. Every deviation produces an event row. Hard-block tier reserved for explicitly enumerated destructive + non-idempotent + cross-system ops (small set, semantically meaningful). Universal-flag becomes performative.",
    },
    {
      title: "Failed events recorded (completed: bool)",
      body: "Non-negotiable. Without this, broker-routing-failures and similar are invisible to audit. Pairs with warning-content attribution — both prevent the warning surface from collapsing into noise.",
    },
    {
      title: "Doc 21 ratified as axiom layer",
      body: "Capability-Permission Decoupling sits alongside state axioms (13/18/19/20). State axioms = properties of state; operation axiom (21) = property of how destructive operations are designed. Pleco is Doc 21's first concrete operational implementation.",
    },
    {
      title: "Resumability DEFERRED to v0.5+",
      body: "v0-cost-skeptic dissent ratified by Wes (call #3). idempotency-key column is in v0 for Pleco only; resumability-as-substrate-feature waits for (a) more surfaces respecting the key, (b) per-op retry-safety policy. Two separable decisions, same primitive.",
    },
    {
      title: "3-tier hardware split amendment",
      body: "v0 deploys to Staging (M1 + iMac) + Infrastructure (Cheesegrater) ONLY this week. Production (M3 + i9 PC) air-gapped from v0 enforcement, but writes DO land in active-events-table for forensic continuity (Wes lean option A). Promotion gated by tracked task tier-promotion-staging-to-production-week-2+.",
    },
  ];

  return (
    <ul className="mt-3 space-y-2 text-xs">
      {items.map((it) => (
        <li key={it.title} className="border-l-2 border-secondary pl-3">
          <div className="font-mono font-semibold text-darkgray">{it.title}</div>
          <div className="text-gray mt-0.5">{it.body}</div>
        </li>
      ))}
    </ul>
  );
}

function V1PlusBacklog() {
  const tasks = [
    {
      name: "resumability-v1",
      trigger:
        "when (a) more surfaces respect idempotency-key and (b) per-op retry-safety policy ratified",
    },
    {
      name: "first-class-rows-for-non-write-events-v1",
      trigger:
        "AskUserQuestion / peer-msg / goal / slack messages as first-class active-events rows. Schema already supports references via URI scheme; v1 adds the row writes themselves",
    },
    {
      name: "hard-block-tier-definition-v0.5",
      trigger:
        "explicit list of destructive + non-idempotent + cross-system ops requiring force-flag bypass",
    },
    {
      name: "hook-canonical-source-migration-v0.5",
      trigger:
        "when CF-OS v0.1 (peers state to CF) lands. One-line URL swap in fleet-node config",
    },
    {
      name: "hook-hash-verification-v0.5",
      trigger:
        "commit-msg.sha256 adjacent in repo, mismatch logged as event-type: hook-hash-mismatch. Lands with hook-canonical-source-migration",
    },
    {
      name: "external-surface-provenance-policy-v0.5",
      trigger:
        "first external API write integration after v0 ships. Pattern: log on OUR side at every external boundary BEFORE external call with external-receiver: <name>",
    },
    {
      name: "fleet-credential-distribution-v0.5",
      trigger:
        "connects to M6 secrets-intercept work. fleet-hooks repo credential is the first concrete instance",
    },
    {
      name: "query-ui-active-events-v0.5+",
      trigger: "conditional on burden-of-proof test passing — must demonstrate a failure class NOT addressed by write-time framing",
    },
    {
      name: "lifecycle-policy-v0.5",
      trigger:
        "beyond 30-day-rolling: per-event-type TTL, custody-chain GC semantics, compliance retention floors",
    },
    {
      name: "codex-pleco-supervisory-loop-v0.5+",
      trigger:
        "Wes ratified Codex as HYBRID (external 2nd-opinion today, supervisory loop tomorrow). v0.5+ design pass defines invocation mechanism, output shape, substrate position",
    },
    {
      name: "tier-promotion-staging-to-production-week-2+",
      trigger:
        "Pleco runs clean on Staging ≥5 days, active-events-table logs ≥100 events no schema drift, manual Wes ratification per tier (not bulk)",
    },
    {
      name: "baton-assignment-mechanism-retro-v1",
      trigger:
        "v0-cost-skeptic baton works with implicit-claim-via-pushback at v0; assignment-mechanism formalization deferred to round-3 retro",
    },
  ];

  return (
    <div className="mt-3 border border-lightgray rounded bg-light p-3">
      <div className="font-header font-semibold text-sm mb-2">
        v1+ Backlog (Tracked Tasks)
      </div>
      <p className="text-xs text-gray mb-3 italic m-0">
        Each item has an explicit trigger or dependency. Anti-creep rule:
        "later" without a named gate becomes "never" via path-dependent canon.
      </p>
      <div className="space-y-2">
        {tasks.map((t) => (
          <div key={t.name} className="text-xs">
            <span className="font-mono text-secondary">{t.name}</span>
            <span className="text-gray"> — {t.trigger}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExpandableDetail({
  expanded,
  onToggle,
  children,
}: {
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <>
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-1 text-xs font-mono text-secondary hover:text-darkgray mt-2"
      >
        {expanded ? (
          <ChevronDown className="w-3 h-3" aria-hidden="true" />
        ) : (
          <ChevronRight className="w-3 h-3" aria-hidden="true" />
        )}
        {expanded ? "Hide detail" : "Show detail"}
      </button>
      {expanded && <div className="mt-2">{children}</div>}
    </>
  );
}

const QUESTIONS: Question[] = [
  {
    id: "q1",
    label: "Q1 — Substrate Primitive",
    ratifies:
      "Provenance as a fleet-wide universal contract: 4-field core (session-id, team, timestamp, chain-of-custody-links) + URI scheme for cross-surface references + array form for chain-of-custody-links to preserve DAG-shape lineage.",
    detail: (
      <>
        <p className="text-xs text-darkgray m-0 mb-2">
          The substrate primitive is an <strong>abstract interface</strong> every write
          surface implements with its own surface-specific fields layered on top.
        </p>
        <ul className="text-xs text-darkgray m-0 space-y-1 list-disc list-inside">
          <li>
            <span className="font-mono">session-id</span> — durable JSONL UUID; survives
            resumes/compacts/MCP reconnects (NOT peer-broker ID, which drifts)
          </li>
          <li>
            <span className="font-mono">team</span> — multi-session collaboration unit at
            write time (e.g., "TEAM 1"); independent of variant/machine/peer-id
          </li>
          <li>
            <span className="font-mono">timestamp</span> — UTC ISO 8601, surface-write
            time
          </li>
          <li>
            <span className="font-mono">chain-of-custody-links</span> — JSON array of{" "}
            <span className="font-mono">{`<surface>:<id>`}</span> URI references; array
            form preserves multi-parent (synthesis writes pull from many sources)
          </li>
        </ul>
        <p className="text-xs text-darkgray m-0 mt-3">
          URI scheme supports references to non-write events (askuq:, goal:, peer:) in
          v0 even though the rows themselves don't ship until v1 —
          future-proofing the chain.
        </p>
      </>
    ),
  },
  {
    id: "q2",
    label: "Q2 — Substrate Tetrad + Doc 21",
    ratifies:
      "Lock four substrate axioms (Doc 13 location, Doc 18 transport, Doc 19 identity, Doc 20 lifecycle) and Doc 21 (Capability-Permission Decoupling) as fleet doctrine. Pleco is Doc 20's first operational implementation; the 6-row table below shows Doc 21 instances.",
    conditional: { gatedBy: "q1", readable: "If Q1 ratified" },
    detail: (
      <>
        <div className="text-xs text-darkgray space-y-1.5">
          <p className="m-0">
            <strong>Doc 13:</strong> state lives in CF —{" "}
            <em>location axiom</em> (existing, ratified 2026-05-15)
          </p>
          <p className="m-0">
            <strong>Doc 18:</strong> no mounts, HTTPS everywhere —{" "}
            <em>transport axiom</em> (NEW)
          </p>
          <p className="m-0">
            <strong>Doc 19:</strong> provenance machine-readable at the surface —{" "}
            <em>identity axiom</em> (NEW). Load-bearing sharpening: NOT "carry identity
            in transport" (CF+HTTPS already do that). The independent claim is{" "}
            <em>first-class structured field at the surface</em>.
          </p>
          <p className="m-0">
            <strong>Doc 20:</strong> Excision Protocol via Pleco —{" "}
            <em>lifecycle axiom</em> (NEW). Agents NEVER physically delete; they write{" "}
            <span className="font-mono">status: excise</span>. Pleco bot has the
            capability to act.
          </p>
          <p className="m-0">
            <strong>Doc 21:</strong> Capability-Permission Decoupling —{" "}
            <em>operation axiom</em> (NEW). For destructive operations, decouple
            permission (any session can mark) from capability (bounded actor executes).
          </p>
        </div>
        <p className="text-xs text-darkgray mt-3 m-0 italic">
          Doc 21 instance table — Pleco is one of six instances (5 operational + 1
          hardware-tier promotion):
        </p>
        <CapabilityPermissionTable />
      </>
    ),
  },
  {
    id: "q3",
    label: "Q3 — v0 Implementation Scope",
    ratifies:
      "Unified-events enum + 30-day rolling retention + idempotency-key NULL-optional + warning-content attribution as HARD REQUIREMENT + tiered enforcement (warn + auto-telemetry default, hard-block reserved) + failed-events recorded + Doc 21 ratified + resumability deferred to v0.5+. Deploy to Staging Tier (M1 + iMac) + Infrastructure (Cheesegrater) only this week.",
    conditional: { gatedBy: "q2", readable: "If Q2 ratified" },
    detail: (
      <>
        <V0ScopeSubitems />
        <V1PlusBacklog />
      </>
    ),
  },
  {
    id: "q4",
    label: "Q4 — Hook Deployment (Option E) + Doc 13/16 Split",
    ratifies:
      "Hook deployment Option E (GitHub canonical at hinescreative/fleet-hooks + fleet-node Tailscale cache at 100.69.233.7 + 250ms fast-fail to direct-GitHub fallback) AND doc 13/16 domain split (Doc 13 = operational state — peers, sessions, runtime, CF-OS state; Doc 16 = documentary state — docs, KB, journal; both audit-traceable via active-events-table).",
    detail: (
      <>
        <div className="text-xs text-darkgray space-y-2">
          <p className="m-0">
            <strong>Hook deployment v0:</strong> GitHub is canonical source. fleet-node
            on Cheesegrater pulls from GitHub on 5-minute TTL and serves via Tailscale.
            Each machine's <span className="font-mono">.git/hooks/commit-msg</span> is a
            small fetch script with 250ms fast-fail to direct-GitHub fallback.
          </p>
          <p className="m-0">
            <strong>Drift detection:</strong> every git invocation, fetch script
            compares fleet-node hash vs local cache; mismatch refetches and logs
            event-type: hook-drift to active-events-table.
          </p>
          <p className="m-0">
            <strong>v0.5 migration:</strong> tracked as{" "}
            <span className="font-mono">hook-canonical-source-migration-v0.5</span>{" "}
            with explicit CF-OS v0.1 dependency. One-line URL swap in fleet-node
            (zero machine changes).
          </p>
          <p className="m-0">
            <strong>Doc 13 vs 16 reconciliation:</strong> not pick-one-over-other but
            domain-split. Doc 13 governs operational state (peers, sessions, runtime,
            CF-OS), Doc 16 governs documentary state (docs, KB, journal). Both surfaces
            audit-traceable via the active-events-table — separation of concerns
            doesn't break custody walks.
          </p>
          <p className="m-0">
            <strong>Why this fits the tetrad:</strong> Doc 13 honored at v0.5 (CF
            canonical); v0 doesn't violate (nothing else depends on it). Doc 18
            (no mounts) — HTTPS-over-Tailscale throughout. Doc 19 (identity at
            surface) — every hook fetch is itself an event in the table. Doc 20
            (lifecycle) — hooks are git-versioned.
          </p>
        </div>
      </>
    ),
  },
];

export function RatificationDashboard() {
  const [decisions, setDecisions] = useState<Record<string, Decision>>({
    q1: null,
    q2: null,
    q3: null,
    q4: null,
  });
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    q1: false,
    q2: false,
    q3: false,
    q4: false,
  });
  const [locked, setLocked] = useState(false);
  const [copied, setCopied] = useState(false);

  const mark = (qid: string, d: Decision) => {
    if (locked) return;
    setDecisions((prev) => ({ ...prev, [qid]: d }));
  };

  const toggleExpand = (qid: string) =>
    setExpanded((prev) => ({ ...prev, [qid]: !prev[qid] }));

  const isGated = (q: Question): boolean => {
    if (!q.conditional) return false;
    return decisions[q.conditional.gatedBy] !== "ratify";
  };

  const allDecided = Object.values(decisions).every((d) => d !== null);

  const payload = {
    q1: { status: decisions.q1, notes: null },
    q2: { status: decisions.q2, notes: null },
    q3: { status: decisions.q3, notes: null },
    q4: { status: decisions.q4, notes: null },
    locked_at: locked ? new Date().toISOString() : null,
    instructions:
      "Paste this JSON back to e05f620b in chat. The session will fire AskUserQuestion with your selections pre-filled plus a final confirm-or-revise pass.",
  };

  const copyPayload = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API not available; payload still visible in textarea
    }
  };

  return (
    <section aria-label="Ratification dashboard" className="max-w-5xl mx-auto">
      <header className="mb-6">
        <p className="font-mono text-xs uppercase tracking-wider text-gray m-0 mb-1">
          Owned by e05f620b — v0-cost-skeptic baton holder
        </p>
        <h2 className="font-header font-bold text-2xl m-0">Ratification Dashboard</h2>
        <p className="text-darkgray text-sm m-0 mt-1">
          Four questions packaged from the team-of-four convergent discussion + Gemini
          external review + private-notes phase + full-mesh cross-talk. Buttons stage a
          decision; the "Lock all selections" button below generates a JSON payload to
          paste back into chat for the actual AskUserQuestion call.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {QUESTIONS.map((q) => {
          const current = decisions[q.id];
          const gated = isGated(q);
          return (
            <article
              key={q.id}
              className={[
                "border rounded-lg p-4 transition-opacity",
                gated
                  ? "border-lightgray bg-light opacity-50 pointer-events-none"
                  : "border-lightgray bg-light",
              ].join(" ")}
              aria-disabled={gated}
            >
              <div className="flex items-baseline justify-between gap-2 mb-2">
                <h3 className="font-header font-semibold text-base m-0">{q.label}</h3>
                {q.conditional && (
                  <span className="font-mono text-[0.65rem] uppercase tracking-wider text-gray">
                    {q.conditional.readable}
                  </span>
                )}
              </div>
              <p className="text-sm text-darkgray m-0 mb-2">{q.ratifies}</p>

              <ExpandableDetail
                expanded={expanded[q.id]}
                onToggle={() => toggleExpand(q.id)}
              >
                {q.detail}
              </ExpandableDetail>

              <div className="flex gap-2 mt-4">
                <DecisionButton
                  active={current === "ratify"}
                  onClick={() => mark(q.id, "ratify")}
                  icon={<CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />}
                  label="Ratify"
                />
                <DecisionButton
                  active={current === "amend"}
                  onClick={() => mark(q.id, "amend")}
                  icon={<Pencil className="w-3.5 h-3.5" aria-hidden="true" />}
                  label="Amend"
                />
                <DecisionButton
                  active={current === "defer"}
                  onClick={() => mark(q.id, "defer")}
                  icon={<Clock className="w-3.5 h-3.5" aria-hidden="true" />}
                  label="Defer"
                />
              </div>
              {current && (
                <p className="font-mono text-xs text-secondary mt-3 m-0">
                  marked: {current}
                </p>
              )}
            </article>
          );
        })}
      </div>

      <div className="mt-8 border-t border-lightgray pt-6">
        <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
          <h3 className="font-header font-semibold text-base m-0">
            Lock all selections
          </h3>
          <button
            type="button"
            onClick={() => setLocked(!locked)}
            disabled={!allDecided && !locked}
            className={[
              "flex items-center gap-2 px-4 py-2 font-mono text-xs rounded border transition-colors",
              locked
                ? "bg-secondary text-light border-secondary"
                : allDecided
                ? "bg-light text-darkgray border-secondary hover:bg-highlight"
                : "bg-light text-gray border-lightgray opacity-50 cursor-not-allowed",
            ].join(" ")}
          >
            <Lock className="w-3.5 h-3.5" aria-hidden="true" />
            {locked ? "Unlock to revise" : "Lock all 4"}
          </button>
        </div>
        <p className="text-xs text-darkgray m-0 mb-3">
          Once all four are marked, lock the selections to generate a JSON payload.
          Paste the payload back into chat and the session will fire the
          AskUserQuestion call with your selections pre-filled plus a final
          confirm-or-revise pass.
        </p>

        {locked && (
          <div className="relative">
            <pre className="bg-dark text-light p-4 rounded text-xs font-mono overflow-x-auto m-0">
              <code>{JSON.stringify(payload, null, 2)}</code>
            </pre>
            <button
              type="button"
              onClick={copyPayload}
              className="absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-1 font-mono text-xs rounded bg-light text-darkgray border border-lightgray hover:bg-highlight"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3" aria-hidden="true" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" aria-hidden="true" />
                  Copy
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <p className="font-mono text-xs text-gray mt-6 text-center italic m-0">
        Source of truth: research/provenance-2026-05-19/RATIFICATION-FINAL.md ·
        Baton: e05f620b
      </p>
    </section>
  );
}

function DecisionButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs rounded border transition-colors",
        active
          ? "bg-secondary text-light border-secondary"
          : "bg-light text-darkgray border-lightgray hover:bg-highlight hover:border-secondary",
      ].join(" ")}
    >
      {icon}
      {label}
    </button>
  );
}
