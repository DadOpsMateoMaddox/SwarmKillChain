create table if not exists cases (
  id text primary key,
  user_id text not null,
  title text not null,
  classification text not null default 'CUI',
  status text not null default 'open',
  summary text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists cases_user_id_idx on cases (user_id);

create table if not exists evidence (
  id text primary key,
  user_id text not null,
  case_id text not null,
  name text not null,
  kind text not null,
  sha256 text not null,
  payload text not null default '{}',
  created_at timestamptz not null default now()
);
create index if not exists evidence_case_idx on evidence (user_id, case_id);

create table if not exists findings (
  id text primary key,
  user_id text not null,
  case_id text not null,
  run_id text,
  title text not null,
  attack_class text not null,
  phase text not null,
  status text not null,
  confidence text not null,
  investigator_claim text not null default '',
  skeptic_rebuttal text not null default '',
  adjudicator_verdict text not null default '',
  tool_refs text not null default '[]',
  evidence_hashes text not null default '[]',
  gates text not null default '[]',
  created_at timestamptz not null default now()
);
create index if not exists findings_case_idx on findings (user_id, case_id);

create table if not exists audit_events (
  id text primary key,
  user_id text not null,
  case_id text,
  prev_hash text not null,
  event_hash text not null,
  actor text not null,
  action text not null,
  payload text not null default '{}',
  created_at timestamptz not null default now()
);
create index if not exists audit_user_idx on audit_events (user_id, created_at);

create table if not exists swarm_runs (
  id text primary key,
  user_id text not null,
  case_id text,
  mode text not null,
  attack_class text,
  status text not null,
  result text not null default '{}',
  created_at timestamptz not null default now()
);
create index if not exists swarm_runs_user_idx on swarm_runs (user_id, created_at);
