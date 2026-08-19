import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { GENESIS } from "@/lib/hash";
import { investigateCase, nextAudit, runDisruptor, type EngineFinding, type EngineStep } from "@/lib/engine";
import { materializeSeed, SEED_CASES } from "@/lib/seed";

export type CaseRow = {
  id: string;
  title: string;
  classification: string;
  status: string;
  summary: string;
  created_at: string;
};

export type EvidenceRow = {
  id: string;
  case_id: string;
  name: string;
  kind: string;
  sha256: string;
  payload: string;
  created_at: string;
};

export type FindingRow = {
  id: string;
  case_id: string;
  run_id: string | null;
  title: string;
  attack_class: string;
  phase: string;
  status: string;
  confidence: string;
  investigator_claim: string;
  skeptic_rebuttal: string;
  adjudicator_verdict: string;
  tool_refs: string;
  evidence_hashes: string;
  gates: string;
  created_at: string;
};

export type AuditRow = {
  id: string;
  case_id: string | null;
  prev_hash: string;
  event_hash: string;
  actor: string;
  action: string;
  payload: string;
  created_at: string;
};

export type RunRow = {
  id: string;
  case_id: string | null;
  mode: string;
  attack_class: string | null;
  status: string;
  result: string;
  created_at: string;
};

export type Workspace = {
  cases: CaseRow[];
  findings: FindingRow[];
  audits: AuditRow[];
  runs: RunRow[];
};

async function appendAudit(
  userId: string,
  caseId: string | null,
  actor: string,
  action: string,
  payload: unknown,
): Promise<AuditRow> {
  const sql = await getSql();
  const last = await sql<AuditRow>`
    select id, case_id, prev_hash, event_hash, actor, action, payload, created_at
    from audit_events
    where user_id = ${userId}
    order by created_at desc
    limit 1
  `;
  const prev = last[0]?.event_hash ?? GENESIS;
  const at = new Date().toISOString();
  const link = nextAudit(prev, actor, action, payload, at);
  const id = crypto.randomUUID();
  const encoded = JSON.stringify(payload);
  await sql`
    insert into audit_events (id, user_id, case_id, prev_hash, event_hash, actor, action, payload, created_at)
    values (${id}, ${userId}, ${caseId}, ${link.prev}, ${link.hash}, ${actor}, ${action}, ${encoded}, ${at})
  `;
  return {
    id,
    case_id: caseId,
    prev_hash: link.prev,
    event_hash: link.hash,
    actor,
    action,
    payload: encoded,
    created_at: at,
  };
}

async function seedIfEmpty(userId: string): Promise<void> {
  const sql = await getSql();
  const existing = await sql<{ n: number }>`select count(*)::int as n from cases where user_id = ${userId}`;
  if ((existing[0]?.n ?? 0) > 0) return;

  for (const seed of SEED_CASES) {
    const materialized = materializeSeed(seed);
    const caseId = crypto.randomUUID();
    await sql`
      insert into cases (id, user_id, title, classification, status, summary)
      values (${caseId}, ${userId}, ${materialized.title}, ${materialized.classification}, ${"open"}, ${materialized.summary})
    `;
    for (const ev of materialized.evidence) {
      const evId = crypto.randomUUID();
      const payload = JSON.stringify(ev.payload);
      await sql`
        insert into evidence (id, user_id, case_id, name, kind, sha256, payload)
        values (${evId}, ${userId}, ${caseId}, ${ev.name}, ${ev.kind}, ${ev.sha256}, ${payload})
      `;
    }
    await appendAudit(userId, caseId, "controller", "case.seeded", {
      title: materialized.title,
      evidence: materialized.evidence.length,
    });
  }
}

export const loadWorkspace = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<Workspace> => {
    await seedIfEmpty(context.userId);
    const sql = await getSql();
    const cases = await sql<CaseRow>`
      select id, title, classification, status, summary, created_at
      from cases where user_id = ${context.userId}
      order by created_at desc
    `;
    const findings = await sql<FindingRow>`
      select id, case_id, run_id, title, attack_class, phase, status, confidence,
             investigator_claim, skeptic_rebuttal, adjudicator_verdict,
             tool_refs, evidence_hashes, gates, created_at
      from findings where user_id = ${context.userId}
      order by created_at desc
    `;
    const audits = await sql<AuditRow>`
      select id, case_id, prev_hash, event_hash, actor, action, payload, created_at
      from audit_events where user_id = ${context.userId}
      order by created_at desc
      limit 80
    `;
    const runs = await sql<RunRow>`
      select id, case_id, mode, attack_class, status, result, created_at
      from swarm_runs where user_id = ${context.userId}
      order by created_at desc
      limit 40
    `;
    return { cases, findings, audits, runs };
  });

export const loadCase = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((id: string) => id)
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    const cases = await sql<CaseRow>`
      select id, title, classification, status, summary, created_at
      from cases where id = ${id} and user_id = ${context.userId}
    `;
    const kase = cases[0];
    if (!kase) return null;
    const evidence = await sql<EvidenceRow>`
      select id, case_id, name, kind, sha256, payload, created_at
      from evidence where case_id = ${id} and user_id = ${context.userId}
      order by created_at asc
    `;
    const findings = await sql<FindingRow>`
      select id, case_id, run_id, title, attack_class, phase, status, confidence,
             investigator_claim, skeptic_rebuttal, adjudicator_verdict,
             tool_refs, evidence_hashes, gates, created_at
      from findings where case_id = ${id} and user_id = ${context.userId}
      order by created_at desc
    `;
    const audits = await sql<AuditRow>`
      select id, case_id, prev_hash, event_hash, actor, action, payload, created_at
      from audit_events where case_id = ${id} and user_id = ${context.userId}
      order by created_at desc
      limit 40
    `;
    return { case: kase, evidence, findings, audits };
  });

export const createCase = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { title: string; summary: string }) => ({
    title: input.title.trim().slice(0, 120),
    summary: input.summary.trim().slice(0, 800),
  }))
  .handler(async ({ context, data }) => {
    if (!data.title) throw new Error("Title required");
    const sql = await getSql();
    const id = crypto.randomUUID();
    await sql`
      insert into cases (id, user_id, title, classification, status, summary)
      values (${id}, ${context.userId}, ${data.title}, ${"CUI"}, ${"open"}, ${data.summary})
    `;
    await appendAudit(context.userId, id, "operator", "case.created", { title: data.title });
    return { id };
  });

export const addEvidence = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { caseId: string; name: string; kind: string; note: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const owned = await sql<{ id: string }>`
      select id from cases where id = ${data.caseId} and user_id = ${context.userId}
    `;
    if (!owned[0]) throw new Error("Case not found");
    const payload = { note: data.note, kind: data.kind, ingested_by: "operator" };
    const { hashEvidencePayload } = await import("@/lib/engine");
    const digest = hashEvidencePayload(payload);
    const id = crypto.randomUUID();
    await sql`
      insert into evidence (id, user_id, case_id, name, kind, sha256, payload)
      values (${id}, ${context.userId}, ${data.caseId}, ${data.name.trim()}, ${data.kind}, ${digest}, ${JSON.stringify(payload)})
    `;
    await appendAudit(context.userId, data.caseId, "controller", "evidence.ingested", {
      name: data.name,
      sha256: digest,
    });
    return { id, sha256: digest };
  });

async function persistFindings(
  userId: string,
  caseId: string,
  runId: string,
  findings: EngineFinding[],
) {
  const sql = await getSql();
  for (const f of findings) {
    const id = crypto.randomUUID();
    await sql`
      insert into findings (
        id, user_id, case_id, run_id, title, attack_class, phase, status, confidence,
        investigator_claim, skeptic_rebuttal, adjudicator_verdict,
        tool_refs, evidence_hashes, gates
      ) values (
        ${id}, ${userId}, ${caseId}, ${runId}, ${f.title}, ${f.attackClass}, ${f.phase},
        ${f.status}, ${f.confidence}, ${f.investigatorClaim}, ${f.skepticRebuttal},
        ${f.adjudicatorVerdict}, ${JSON.stringify(f.toolRefs)}, ${JSON.stringify(f.evidenceHashes)},
        ${JSON.stringify(f.gates)}
      )
    `;
  }
}

export const dispatchInvestigate = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((caseId: string) => caseId)
  .handler(async ({ context, data: caseId }) => {
    const sql = await getSql();
    const cases = await sql<CaseRow>`
      select id, title, classification, status, summary, created_at
      from cases where id = ${caseId} and user_id = ${context.userId}
    `;
    const kase = cases[0];
    if (!kase) throw new Error("Case not found");
    const evidence = await sql<EvidenceRow>`
      select id, case_id, name, kind, sha256, payload, created_at
      from evidence where case_id = ${caseId} and user_id = ${context.userId}
    `;
    const parsed = evidence.map((e) => ({
      id: e.id,
      name: e.name,
      kind: e.kind,
      sha256: e.sha256,
      payload: JSON.parse(e.payload) as Record<string, unknown>,
    }));
    const result = investigateCase({ title: kase.title, evidence: parsed });
    const runId = crypto.randomUUID();
    await sql`
      insert into swarm_runs (id, user_id, case_id, mode, attack_class, status, result)
      values (${runId}, ${context.userId}, ${caseId}, ${"investigate"}, ${null}, ${"complete"}, ${JSON.stringify({
        steps: result.steps,
        count: result.findings.length,
      })})
    `;
    await persistFindings(context.userId, caseId, runId, result.findings);
    await appendAudit(context.userId, caseId, "controller", "swarm.investigate", {
      runId,
      findings: result.findings.length,
    });
    return { runId, ...result };
  });

export const dispatchDisrupt = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { attackId: string; caseId?: string }) => input)
  .handler(async ({ context, data }) => {
    const result = runDisruptor(data.attackId);
    const sql = await getSql();
    const runId = crypto.randomUUID();
    const caseId = data.caseId ?? null;
    await sql`
      insert into swarm_runs (id, user_id, case_id, mode, attack_class, status, result)
      values (${runId}, ${context.userId}, ${caseId}, ${"disrupt"}, ${data.attackId}, ${result.outcome}, ${JSON.stringify({
        outcome: result.outcome,
        steps: result.steps,
        gates: result.gates,
      })})
    `;
    if (caseId) {
      await persistFindings(context.userId, caseId, runId, [result.finding]);
    }
    await appendAudit(context.userId, caseId, "controller", "swarm.disrupt", {
      attack: data.attackId,
      outcome: result.outcome,
    });
    return { runId, ...result };
  });

export const briefFinding = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { title: string; claim: string; verdict: string }) => input)
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return {
        ok: false as const,
        text: "Live briefing is unavailable here. The adjudicator verdict above is the authoritative output.",
      };
    }
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        max_tokens: 220,
        messages: [
          {
            role: "system",
            content:
              "You are the SwarmKillChain operator brief. Four tight sentences. No hype. Distinguish incident vs evaluation vs theory. Never treat model consensus as proof.",
          },
          {
            role: "user",
            content: `Finding: ${data.title}\nClaim: ${data.claim}\nVerdict: ${data.verdict}`,
          },
        ],
      }),
    });
    if (!res.ok) return { ok: false as const, text: `Briefing failed (${res.status}).` };
    const body = (await res.json()) as { choices: { message: { content: string } }[] };
    return { ok: true as const, text: body.choices[0]?.message.content ?? "" };
  });

export type InvestigateResult = {
  runId: string;
  findings: EngineFinding[];
  steps: EngineStep[];
};

export type DisruptResult = {
  runId: string;
  outcome: "contained" | "partial" | "breach";
  steps: EngineStep[];
  gates: EngineFinding["gates"];
  finding: EngineFinding;
  attack: { id: string; name: string; summary: string };
};
