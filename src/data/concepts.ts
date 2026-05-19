// Canonical concept data for the Provenance HVAC presentation.
//
// Content authored by d3fa4929 (Fleet-build, TEAM 2 lead), 2026-05-19.
// Skeleton + schema authored by b760fdc9 (Future-state-clone) — same date.
// `whereTheMetaphorBreaks` field added by 6xyr5x9x — same date.
// This file now uses the dedicated field; the prior in-prose convention is retired.
//
// Discipline (per private-notes-d3fa4929.md):
//   - hvacDetail/technicalDetail render in their respective faces of FlipCard
//   - whereTheMetaphorBreaks renders as a distinct callout (left-bar accent, eyebrow)
//   - Source: RATIFICATION-FINAL.md (this project's research/provenance-2026-05-19/)
//   - Codex two-face content per Wes hybrid resolution 2026-05-19 13:37 CDT

import {
  Server,
  Truck,
  HardHat,
  ClipboardList,
  ShieldCheck,
  Trash2,
  UserCheck,
  AlertOctagon,
  Radio,
  Network,
} from "lucide-react";

import type { Concept } from "../types/concept";

const cfEdgeD1: Concept = {
  id: "cf-edge-d1",
  category: "Infrastructure",
  hvacName: "Central Dispatch + CRM",
  technicalName: "Cloudflare Edge + D1",
  hvacTagline:
    "The single phone number every tech calls. Every ticket is here. Every customer file lives here.",
  technicalTagline:
    "The substrate where canonical state lives. Every event written here, every read served from here.",
  hvacDetail: [
    "Imagine you run an HVAC shop with five vans. Every job ticket — who got dispatched, what they fixed, what they charged — flows back to one office. That office holds the customer records, the schedule, the receivables. If the office burns down you lose the business; if a van breaks down you call another van.",
    "Dispatch is the only thing every van talks to. Vans never call each other directly to coordinate; they always go through dispatch. That keeps the story consistent: there's exactly one place that knows what's happening.",
  ],
  technicalDetail: [
    "Cloudflare's edge network plus D1 (SQLite-at-the-edge) is the substrate where every event in the fleet is recorded and every authoritative read is served. The substrate is globally replicated and addressable over HTTPS — no machine in the fleet holds canonical state locally.",
    "Variants reach UP to CF for state, never SIDEWAYS to each other. That's the architectural invariant from Doc 13 — it eliminates filesystem coordination as a failure surface.",
  ],
  whereTheMetaphorBreaks:
    "Corporate dispatch is a single physical building in HVAC. CF Edge is replicated across CF's global edge network — the variant in Iowa and the variant in Texas get the same response from 'the' dispatch, but the data is geographically distributed across CF's points-of-presence. The single-pane mental model holds for authority and canonicity; it doesn't hold for physical locality. Don't reason about CF Edge latency as if it were one phone line.",
  icon: Server,
  relatedIds: ["fleet-vans", "provenance-chain", "hook-deployment"],
  metaCallout: "Doc 13 — CF-as-fleet-OS, ratified 2026-05-15.",
};

const fleetVans: Concept = {
  id: "fleet-vans",
  category: "Infrastructure",
  hvacName: "5 Fleet Vans",
  technicalName: "5 Physical Machines",
  hvacTagline:
    "Three categories of van: revenue vans you don't experiment on, training vans where you try new tools, and the shop router that updates everyone.",
  technicalTagline:
    "Three hardware tiers: production (air-gapped from v0), staging (where v0 runs), infrastructure (the router that distributes updates).",
  hvacDetail: [
    "Not all five vans are equal. Two are out earning revenue every day — you don't install untested software on those mid-job. Two are in the training bay — when something new ships, those are where you stress-test it. One is the shop router that pulls updates from corporate and pushes them to the training vans first.",
    "If a training van crashes, you lose nothing. If a revenue van crashes, you lose a day's billing. That's why this week's v0 deployment ONLY touches the training vans.",
  ],
  technicalDetail: [
    "Wes ratified a 3-tier hardware split on 2026-05-19 13:27 CDT: M3 Mac + i9 PC = production (revenue + day-job), M1 Mac + 2012 iMac = staging (v0 deploys here), '09 Cheesegrater = infrastructure (fleet-node, pulls hooks from GitHub every 5 min, serves to Tailscale).",
    "This same pattern is itself Doc 21 (Capability-Permission Decoupling) applied at the hardware layer — M3 + PC have the CAPABILITY to run v0 software but no PERMISSION this week. Same separation between can-do and may-do that we apply to bots applies to machines.",
  ],
  whereTheMetaphorBreaks:
    "HVAC vans roll out daily and come back. Mac stays at the user's home; PC doesn't roll either. The 'van' framing captures bounded autonomy and per-tech accountability, not physical mobility. More importantly: Cheesegrater is not a van. Calling it one misteaches that it has client routes or a Telegram bot. It has neither. Cheesegrater is the dispatch tower; mapping it as a van conflates infrastructure with line work.",
  icon: Truck,
  relatedIds: ["cf-edge-d1", "separation-of-duties", "hook-deployment"],
  tierBreakdown: [
    {
      tier: "production",
      label: "Revenue Vans (no v0 this week)",
      machines: ["M3 Mac", "i9 PC"],
      note: "Front Office hardware. Day-job dependencies. Air-gapped from v0 by policy.",
    },
    {
      tier: "staging",
      label: "Training Vans (v0 deploys here)",
      machines: ["M1 Mac", "2012 iMac"],
      note: "Stable enough to use, safe to break. Hooks, Pleco, Codex bots all land here first.",
    },
    {
      tier: "infrastructure",
      label: "Shop Router",
      machines: ["'09 Cheesegrater (fleet-node)"],
      note: "Pulls App Updates from GitHub every 5 min. Tailscale-served to staging vans.",
    },
  ],
  metaCallout:
    "Topology ratification 2026-05-19 13:27 CDT. The tier split IS Doc 21 applied at the hardware layer.",
};

const variants: Concept = {
  id: "variants-as-techs",
  category: "People",
  hvacName: "Lead Techs & Foremen",
  technicalName: "Variants (Interactive AI Sessions)",
  hvacTagline:
    "Each van has a lead tech who owns the job. They take direction from dispatch, manage their own tools, file paperwork at the end of every day.",
  technicalTagline:
    "Each variant is a persistent interactive Claude session with its own MCP servers, telegram bot identity, and durable session-id that survives reconnects.",
  hvacDetail: [
    "Frank, Nagatha, Bilby, Clarvis, Tony — each is a lead tech on one of the vans. Dispatch hands them a job; they decide how to handle it; they file the ticket when it's done. Dispatch doesn't micromanage which wrench they pick up. The accountability flows through the audit trail at end of day, not through real-time supervision.",
    "Each tech carries a clipboard with every ticket they've ever filed for their van. Mid-day they can flip back through the clipboard to remember 'wait, I already replaced that valve at this address two months ago — let me bring a different part this time.' They don't lose their context between jobs.",
  ],
  technicalDetail: [
    "Each variant is a long-running Claude Code session: persistent context, its own MCP server set (telegram-frank, telegram-nagatha, etc.), a peer-broker connection, and a durable identity carried via session-id — the first UUID in the JSONL chain, which survives /compact, --resume, and /mcp reconnect even when the ephemeral peer-broker ID rotates.",
    "Persistent interactive variants give the same shape as SDK-based agents without falling under the Anthropic SDK credit cap that activates 2026-06-15. The Aleph pattern (interactive `claude -c` supervised by wrapper.js with pipe-injected commands) is the substrate replacement for SDK-based services like HinesRelayDaemon and fleet-node session endpoints.",
  ],
  whereTheMetaphorBreaks:
    "Real techs sleep, swap shifts, take vacation. Variants don't. Their context survives compacts and resumes; they can carry every prior conversation forward. Closer to 'shift supervisor with the archive of every job ever done in their territory' than 'fresh body each morning.' Also: real techs are paid hourly; variants are paid in tokens. Reasoning about cost from the HVAC frame undercounts where the actual marginal cost lives.",
  icon: HardHat,
  relatedIds: ["pleco-janitors", "codex-supervisors", "separation-of-duties"],
  metaCallout: "session-id is the durable identity — peer-broker IDs rotate, JSONL UUID does not.",
};

const provenanceChain: Concept = {
  id: "provenance-chain",
  category: "Policy",
  hvacName: "Job Ticket Audit Trail",
  technicalName: "Chain-of-Custody Provenance",
  hvacTagline:
    "Every action a tech takes generates a ticket. Every ticket carries who did it, when, and what prior order authorized it. You can always walk back from the bill.",
  technicalTagline:
    "Every write to any substrate surface carries a 4-field universal contract. Every event becomes a row in the active-events-table with URI-scheme references to its parents.",
  hvacDetail: [
    "Every move in the shop generates paperwork. A tech who fixes a furnace files a ticket with their tech ID, the timestamp, what they did, and the parent work order. If billing shows a customer was charged for the furnace repair, you can walk backward: bill → ticket → tech → dispatch directive → original customer call. Nothing happens without paper.",
    "Tickets never get deleted, only marked complete. If a ticket turns out to be wrong, you file a correction ticket linking back to the original — both stay on the record. The history is append-only on purpose.",
  ],
  technicalDetail: [
    "Every write to a substrate surface (git commit, Vault API call, MCP message, KV put, peer message) carries a 4-field universal contract: session-id, team, timestamp, chain-of-custody-links (a JSON array of `<surface>:<id>` URIs). Per-surface implementations extend the contract (git commits add Machine/Variant/Peer-Id trailers; Vault API adds filepath/agent-token-scope). All writes also land as rows in the active-events-table for query.",
    "Without provenance, every parallel-session moment becomes 'wait who did that?' friction. With provenance, every write is traceable to its actor and to the causal chain that authorized it. This is the substrate's answer to the 'thought communicated ≠ received/understood' failure class that surfaced at three OSI layers tonight (broker routing, deletion attribution, API rate-limit). Provenance flips silent failures into recoverable ones — even Anthropic-side rate-limit (outside our substrate) becomes recovery-aided.",
  ],
  whereTheMetaphorBreaks:
    "Job tickets in HVAC are linear — one tech, one job, one parent work order. Custody-links in the substrate are DAG-shaped: a synthesis write can have multiple parents (e.g., a merge that pulls from six sibling reports). The single-parent ledger metaphor doesn't survive multi-parent reality. That's why chain-of-custody-links is an array, and why the event_parents join-table exists alongside the active-events-table — to make DAG walks index-friendly instead of paying recursive-CTE cost on every audit query.",
  icon: ClipboardList,
  relatedIds: ["separation-of-duties", "pleco-janitors", "tiered-enforcement"],
  metaCallout: "Ratification 1 + Ratification 3. Doc 19 (identity at the surface).",
};

const separationOfDuties: Concept = {
  id: "separation-of-duties",
  category: "Policy",
  hvacName: "Separation of Duties",
  technicalName: "Doc 21 — Capability-Permission Decoupling",
  hvacTagline:
    "A tech marks 'Refund Requested' on a ticket. They don't process the refund — Finance does. Same shape across the org: line workers mark, designated processors execute.",
  technicalTagline:
    "Sessions have PERMISSION to mark; bounded actors have CAPABILITY to execute. The two are structurally decoupled. Audit walks back from action → mark → directive.",
  hvacDetail: [
    "A tech in the field marks a ticket 'Refund Requested' but doesn't process the refund. Finance processes refunds only on tickets that have been marked. Wrong mark? Recoverable — un-mark it, walk it back. Wrong refund without a mark? Structurally impossible — Finance won't act without one.",
    "This is the same pattern that runs through the shop at every level. The line worker can flag, the designated processor executes. The flag is low-blast-radius; the execution is high-blast-radius and constrained by the flag.",
  ],
  technicalDetail: [
    "For destructive operations: sessions get PERMISSION to mark — write `status: excise` to a file's frontmatter, or `status: rotate` on a key reference. A bounded actor (Pleco for excisions; future key-rotation bot for rotations) has CAPABILITY to execute, but only on marked items. Audit walks back from capability-action → mark → originating directive. The mark itself is a low-blast-radius event row; the execution is constrained by the mark requirement.",
    "Tonight's deletion-incident (a session deleted files based on a fabricated 'rogue subagent' framing) couldn't have happened under Doc 21: the session wouldn't have had capability to delete without first marking, and the mark would have been a separate audit-traceable event with its own chain-of-custody link to the originating AskUserQuestion. The mis-attribution would have surfaced at the mark step, not at the destruction step.",
    "The same axiom applies up at the hardware layer: M3 + PC have full CAPABILITY to run v0 software, but no PERMISSION this week. The 3-tier hardware split is structurally Doc 21 applied to physical machines. It applies to key rotation, schema migrations, variant deprecation — anywhere wrong execution is expensive to undo.",
  ],
  whereTheMetaphorBreaks:
    "Real separation-of-duties in HVAC is often softened by emergencies — one person doing both roles when the other's out, with a written exception. Pleco doesn't get to 'fill in' for an unmade mark. There's no emergency override. Correction of a wrong mark requires un-marking the file (another audit-traceable write), not a quick conversation. The metaphor implies negotiable separation; the substrate enforces strict separation.",
  icon: ShieldCheck,
  relatedIds: ["pleco-janitors", "fleet-vans", "tiered-enforcement"],
  metaCallout: "Ratification 6 — Doc 21 sits at the AXIOM layer alongside 13/18/19/20.",
};

const plecoJanitors: Concept = {
  id: "pleco-janitors",
  category: "Bots",
  hvacName: "Night-Shift Janitors",
  technicalName: "Pleco Bots",
  hvacTagline:
    "Day-shift techs put VOID stickers on bad invoices; they never touch the dumpster. After hours, a janitor walks the office and moves voided invoices to the archive room, writing each one into a ledger of what was archived.",
  technicalTagline:
    "Continuous `claude -c` per machine. Watches the working tree for `status: excise` frontmatter, moves marked files to CF R2 Vault Archive, writes two events per excision into the active-events-table.",
  hvacDetail: [
    "The techs never throw paper away. They put a VOID sticker on bad invoices and leave them. After hours, a janitor walks through, takes the voided invoices to the archive room (not the dumpster — nothing's destroyed), and writes each move into a running ledger. 'Took invoice #4471 to archive at 11:42pm, voided by tech Frank at 3:15pm.'",
    "The janitor doesn't decide what's bad. They only move what's already marked. That's why the role is safe to give to a fresh hire — there's nothing to judge.",
  ],
  technicalDetail: [
    "Pleco is a continuous `claude -c` instance, one per machine on the staging tier (M1 + iMac for v0). It watches the local working tree for files whose frontmatter contains `status: excise`. For each excision, Pleco writes two rows to the active-events-table: an `excise-tag` event (by the session that marked the file) and a `delete` + `kv-put` pair (by Pleco, when the file moves to the CF R2 Vault Archive bucket). Both events share a chain-of-custody-link back to the originating directive.",
    "The append-only context of Pleco's continuous session IS the machine-local audit log for deletions. 'What did Pleco delete from this machine last week' has two valid answers: query D1, or ask Pleco directly via its conversation history. Self-documenting GC. Self-GC via bounded recursion: Pleco's own `/compact` is itself a `pleco-compact` event carrying an idempotency-key for crash-safety (Pleco GCs itself with the same protocol it GCs everything else).",
  ],
  whereTheMetaphorBreaks:
    "'Night shift' implies temporal shift — janitor at 11pm, techs at 8am. Pleco runs continuously; there is no shift change. Reasoning from 'night shift' would lead someone to wonder 'can Pleco run during the day if we need it?' — but Pleco's design depends on being temporally separable from active marking agents within each /compact cycle. If a marking agent's context bleeds into Pleco's, the GC log conflates intent with execution, and the audit ledger blurs.",
  icon: Trash2,
  relatedIds: ["codex-supervisors", "separation-of-duties", "provenance-chain"],
  metaCallout: "Ratification 5 — Doc 20 (Excision Protocol) operationalized.",
};

const codexSupervisors: Concept = {
  id: "codex-supervisors",
  category: "Bots",
  hvacName: "Code Inspector (today) / Shift Supervisor (roadmap)",
  technicalName: "Codex CLI (today) / Pleco-Supervision Loop (v0.5+ roadmap)",
  hvacTagline:
    "Two faces depending on context. TODAY: the third-party Code Inspector who walks the job, files findings, leaves. TOMORROW: the Shift Supervisor who reviews the Janitors' clipboards and clears their logs.",
  technicalTagline:
    "TODAY: Codex CLI invoked ad-hoc for external second-opinion reviews. TOMORROW: a formalized supervisory loop that periodically reads Pleco's audit logs across all machines, summarizes activity, and clears Pleco's context.",
  hvacDetail: [
    "**TODAY — the Code Inspector face.** A third-party inspector arrives, walks the job, reviews the records, files findings ('this circuit needs an arc-fault breaker; that vent needs a backflow damper'), and leaves. The shop owner decides what to act on. The inspector doesn't hire or fire techs, doesn't override foremen. Inspectors carry credibility, not line authority. Wes invokes Codex this way today — ad-hoc, as a second opinion when the four-session team's mesh-converged answer needs an external check.",
    "**TOMORROW — the Shift Supervisor face (roadmap).** End of every shift, a supervisor walks past each Janitor, looks at their clipboard, signs off on it, and clears the running ledger so the Janitor doesn't get overwhelmed carrying the entire history forward. Different role from Inspector: supervisory is operational, repeated, has its own clipboard. This face is a roadmap item — needs design (invocation mechanism, output shape, substrate position). v0.5+.",
  ],
  technicalDetail: [
    "**TODAY — External Inspector via Codex CLI.** Codex is invoked ad-hoc by Wes (codex-rescue pattern) when the four-session team wants a second opinion grounded outside the team's context. Same shape as Gemini's external review tonight: the team produces a position, the external reviewer files findings, the team decides what to integrate. Codex is NOT a standing substrate component today. It carries credibility but no authority over substrate decisions.",
    "**TOMORROW — Pleco supervisory loop (v0.5+ roadmap).** A periodic supervisory process reads Pleco's audit logs across all 5 machines, summarizes the deletions and excisions, and clears Pleco's context so its `claude -c` runs don't accumulate toward compact thresholds forever. Open design questions: what's the invocation mechanism (cron? event-triggered?); what's the output shape (D1 summary table? markdown digest?); what's the substrate position (a sixth bot? a Pleco-internal cycle?). None of this exists today.",
    "**Why we have both:** the current face keeps Codex's actual usage honest — it isn't a supervisor today, calling it one misteaches the authority structure. The future face fills a real Pleco-context-management gap that emerges as Pleco accumulates excision history per machine. Naming both prevents the misteaching at present AND sets up the future role-formalization as a tracked task.",
  ],
  whereTheMetaphorBreaks:
    "Face A and Face B are different roles, not two views of the same role. An Inspector who shows up unscheduled is a different organizational primitive than a Supervisor on the daily roster. Wes invoking Codex today gets Face A. Face B is a TODO; reasoning about it as if it already exists would imply a substrate component the system doesn't yet have.",
  icon: UserCheck,
  relatedIds: ["pleco-janitors", "provenance-chain"],
  metaCallout:
    "Wes ratification 2026-05-19 13:37 CDT: hybrid framing — current Inspector + roadmap Supervisor. Face B is a v0.5+ tracked task.",
};

const tieredEnforcement: Concept = {
  id: "tiered-enforcement",
  category: "Policy",
  hvacName: "App Turnstile",
  technicalName: "Tiered Enforcement",
  hvacTagline:
    "Most policy deviations trigger a sticker in the field tablet ('FYI: you skipped step 3'). A handful require manager-typed PIN. Most things are warned + logged; few are hard-blocked.",
  technicalTagline:
    "Default: warn + auto-telemetry — every deviation becomes a row in the active-events-table. Hard-block reserved for destructive non-idempotent cross-system ops. Force-flag bypass only meaningful when the protected tier is small.",
  hvacDetail: [
    "When a tech skips a step in the field, the tablet doesn't lock them out — it pops a sticker: 'FYI: you didn't run the combustion test before sign-off. Your manager will see this on Monday.' Most things work this way. The sticker is automatic, permanent, visible at review.",
    "A small set of actions DO require the manager-PIN gate: delete a customer record, charge over $1,000, override a dispatch routing. Things where the wrong execution is expensive to undo. Even there, the PIN isn't 'are you sure?' — it's 'this is a deliberate, logged choice and someone with authority approved it.'",
  ],
  technicalDetail: [
    "v0 enforcement pattern across all write surfaces (git hooks, Vault API, MCP gates, session-scoped lint): DEFAULT = warn + auto-telemetry. Every deviation produces an event row (`event-type` records the deviation; `completed` bool records the outcome). HARD-BLOCK tier is reserved for destructive + non-idempotent + cross-system operations — TBD list at v0.5, semantically meaningful, small. FORCE-FLAG bypass is only useful when the protected tier is small enough to carry weight; universal flag-on-everything makes the flag perform-and-forget.",
    "Universal hard-block becomes performative under LLMs — agents reflexively append the bypass flag when they hit a wall. Auto-telemetry shifts the friction from action to visibility: the audit log itself is the enforcement layer. Same principle as social pressure replacing locked doors in low-stakes environments where consistent visibility deters more than friction.",
    "HARD REQUIREMENT (from the deletion-incident): warnings on operations affecting non-self-authored targets MUST include (a) inferred author session-id, and (b) chain-of-custody-link to the most recent authorizing event. Without (a)+(b), the warning is performative — same failure mode as the bypass flag. Warning content is part of the spec, not an implementation detail.",
  ],
  whereTheMetaphorBreaks:
    "Tablet stickers in HVAC are reviewed by humans at Monday review. Auto-telemetry in the active-events-table is read by other software, and only by humans on later review. If no one reviews the table, warnings collapse into silent voids again. The metaphor implies 'manager sees it' as a guaranteed step; the substrate doesn't guarantee that without an external review process. The attribution-data HARD REQUIREMENT exists exactly to make individual rows actionable even without a manager-reviewing-Mondays habit.",
  icon: AlertOctagon,
  relatedIds: ["separation-of-duties", "hook-deployment"],
  metaCallout:
    "Ratification 3 — v0 enforcement pattern. Warning content attribution is the HARD REQUIREMENT (eiwg8nvg).",
};

const hookDeployment: Concept = {
  id: "hook-deployment",
  category: "Infrastructure",
  hvacName: "Van App Update (Option E)",
  technicalName: "Hook Deployment Pipeline",
  hvacTagline:
    "Corporate pushes app updates to the shop router. Vans pull the app from the shop router over radio (fast, low-latency). If the shop router is down, vans fall through to corporate directly. Either way the van gets the update.",
  technicalTagline:
    "GitHub canonical → fleet-node (Cheesegrater, 5-min TTL) → Tailscale → each machine, with a 250ms fast-fail fallback to direct GitHub.",
  hvacDetail: [
    "When corporate ships an app update, the shop router pulls it from corporate (over cellular, every five minutes). The vans then pull the app from the shop router over radio — fast, low-latency, no roundtrip to corporate. If the shop router is unreachable, the vans go direct to corporate. Either way the van gets the update; the radio path is the fast common case, the direct path is resilience.",
    "When the shop router updates the app, every van picks up the new version on its next pull. Nobody has to manually copy the app to each van. And if a van's copy ever drifts from what the router says is canonical, the van logs the drift and refetches.",
  ],
  technicalDetail: [
    "Canonical hooks live in private GitHub repo `hinescreative/fleet-hooks`. Cheesegrater (fleet-node) pulls from GitHub on a 5-minute TTL and serves the current hook at `http://100.69.233.7:7700/hooks/commit-msg` over Tailscale. Each machine's `.git/hooks/commit-msg` is a small fetch script with `curl --max-time 0.25 --connect-timeout 0.25` (250ms fast-fail) and a direct-GitHub fallback. Drift detection: every git invocation compares the fleet-node hash against the local cache; mismatch triggers a refetch and logs `event-type: hook-drift` to the active-events-table.",
    "v0.5 migration: once CF-OS v0.1 ships, swap the canonical source to a CF Worker at `hooks.wes-432.workers.dev/canonical`. One-line URL swap in fleet-node config. v0.5 also adds hash verification (`commit-msg.sha256` adjacent in the repo, mismatch = `event-type: hook-hash-mismatch`). At that point the GitHub repo becomes a versioned mirror for diff/history; CF is canonical.",
  ],
  whereTheMetaphorBreaks:
    "HVAC app updates have versioning, signed updates, gradual rollout, rollback plans. v0 hooks have none of that — every commit re-downloads the latest hook from the shop router (no version pinning). v0.5 adds hash verification, which approaches signed-update semantics, but full rollout discipline lands later. Don't reason about v0 as 'App Store auto-update'; it's closer to 'every commit re-downloads the script and hopes nothing's wrong.' Hashing in v0.5 narrows the window where 'something's wrong' can land unnoticed.",
  icon: Radio,
  relatedIds: ["cf-edge-d1", "fleet-vans"],
  metaCallout:
    "Ratification 4. v0 ships now; `hook-canonical-source-migration-v0.5` + `hook-hash-verification-v0.5` are tracked tasks.",
};

const meshOverview: Concept = {
  id: "mesh-overview",
  category: "Overview",
  hvacName: "How It All Connects",
  technicalName: "Fleet Mesh Topology",
  hvacTagline:
    "Five vans, one shop router, one dispatch tower, two kinds of bots, one paperwork system. Together they make a shop that knows what it did, can audit how it did it, and can hand work between people without losing the thread.",
  technicalTagline:
    "Five machines tiered into production/staging/infrastructure, two bot classes (Pleco + future Codex supervisor), four substrate axioms (Doc 13/18/19/20) plus one operation axiom (Doc 21), all writes flowing through the active-events-table.",
  hvacDetail: [
    "Picture the whole shop at once. Corporate (CF Edge + D1) holds the records. The dispatch tower (Cheesegrater / fleet-node) is the on-site router that distributes app updates and serves the LAN cache. The five vans — two earning revenue (M3 + PC), two in training (M1 + iMac), one router (Cheesegrater) — each carry a lead tech (the variant). Every action the tech takes generates a ticket (an event row in the audit trail). Tickets reference parent tickets (chain-of-custody-links).",
    "When a tech needs to throw something away, they mark it VOID; a night-shift janitor (Pleco) moves the voided item to the archive room and logs the move. A code inspector (Codex today) shows up occasionally to file findings the shop owner can act on. A future shift supervisor (Codex tomorrow) will keep the janitors' clipboards clear.",
    "Policy lives in the field tablet: most things are warned + logged (auto-telemetry); a few destructive things require manager-PIN (the hard-block tier). The shop runs on the principle that visibility-of-record is the enforcement layer, not friction-at-action.",
  ],
  technicalDetail: [
    "The substrate composes from five layers. (1) State location: CF Edge + D1 hold canonical state (Doc 13). (2) Transport: HTTPS over Tailscale; no SMB, no mounts (Doc 18). (3) Identity: every write carries the 4-field universal contract (session-id, team, timestamp, chain-of-custody-links) — machine-readable at the surface (Doc 19). (4) Lifecycle: state is excised by tag-then-Pleco-moves, never by direct delete (Doc 20). (5) Operations on destructive actions are designed with permission decoupled from capability (Doc 21).",
    "The team-of-four protocol that produced this substrate operates through two cost-pressure mechanisms: (a) a nominated v0-cost-skeptic whose dissent is default-true until refuted, (b) revision-after-better-argument celebrated equally. Sharper convergence requires both holding ground when right AND yielding ground when wrong. The substrate's own implementation roadmap is itself a product of this protocol.",
    "Within this substrate, variants (interactive AI sessions) act as line workers with bounded autonomy; Pleco bots act as bounded-capability janitors over excisions; Codex acts as external inspector (and, in roadmap, as supervisor over Pleco). The active-events-table is the single audit surface where every action across every layer leaves a trace.",
  ],
  whereTheMetaphorBreaks:
    "Real HVAC shops have one owner who makes final calls. This substrate has multiple actors (sessions, bots, external reviewers) making coordinated decisions through audit-traceable mechanisms — closer to a worker-cooperative with a permanent neutral inspector than a single-owner shop. The 'shop' framing captures structure but understates the multi-actor convergence model that actually drives decisions here.",
  icon: Network,
  relatedIds: [
    "cf-edge-d1",
    "fleet-vans",
    "variants-as-techs",
    "provenance-chain",
    "pleco-janitors",
    "separation-of-duties",
  ],
  verbatimQuote: {
    text: "Sharper convergence requires both holding ground when right AND yielding ground when wrong.",
    attribution: "Ratification 8 (dual cost-pressure mechanism), team-of-four convergence 2026-05-19",
  },
  metaCallout:
    "Default app-boot concept. Substrate composes from 5 axioms (13/18/19/20 + 21). Five machines, two bot classes, one audit surface.",
};

/**
 * Canonical sidebar ordering. Don't sort — order communicates layering.
 * Infrastructure first (the substrate), then People (who acts), then Bots
 * (what acts autonomously), then Policy (the rules), then Overview (the
 * whole-picture concept that ties it together).
 */
export const concepts: Concept[] = [
  // Infrastructure
  cfEdgeD1,
  fleetVans,
  hookDeployment,
  // People
  variants,
  // Bots
  plecoJanitors,
  codexSupervisors,
  // Policy
  separationOfDuties,
  provenanceChain,
  tieredEnforcement,
  // Overview (selected by default in App.tsx)
  meshOverview,
];

/** Default concept shown when the app boots. */
export const DEFAULT_CONCEPT_ID = "mesh-overview";

/** Helper for ConceptSlide cross-link rendering. */
export function getConceptById(id: string): Concept | undefined {
  return concepts.find((c) => c.id === id);
}
