import { useState, useRef, useEffect } from "react";
import { LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const AMBER = "#BA7517"; const AMBER_L = "#FAEEDA";
const BLUE = "#378ADD"; const BLUE_L = "#E6F1FB";
const GREEN = "#639922"; const GREEN_L = "#EAF3DE";
const RED = "#E24B4A"; const RED_L = "#FCEBEB";
const TEAL = "#1D9E75"; const TEAL_L = "#E1F5EE";
const GRAY = "#888780"; const GRAY_L = "#F1EFE8";
const PURPLE = "#7F77DD"; const PURPLE_L = "#EEEDFE";

const patientTrend = [
  { month: "Oct", pxi: 68, fcr: 76, escalation: 9.2, ttr: 4.1 },
  { month: "Nov", pxi: 71, fcr: 78, escalation: 8.8, ttr: 3.8 },
  { month: "Dec", pxi: 70, fcr: 77, escalation: 9.1, ttr: 3.9 },
  { month: "Jan", pxi: 74, fcr: 81, escalation: 7.9, ttr: 3.4 },
  { month: "Feb", pxi: 77, fcr: 83, escalation: 7.2, ttr: 3.1 },
  { month: "Mar", pxi: 79, fcr: 85, escalation: 6.8, ttr: 2.9 },
];

const kpiTrend = [
  { month: "Oct", bedOcc: 81, readmission: 9.2, alos: 4.8, er_wait: 38 },
  { month: "Nov", bedOcc: 83, readmission: 8.8, alos: 4.6, er_wait: 35 },
  { month: "Dec", bedOcc: 86, readmission: 9.5, alos: 4.9, er_wait: 41 },
  { month: "Jan", bedOcc: 84, readmission: 8.4, alos: 4.5, er_wait: 33 },
  { month: "Feb", bedOcc: 87, readmission: 7.9, alos: 4.3, er_wait: 30 },
  { month: "Mar", bedOcc: 88, readmission: 7.6, alos: 4.2, er_wait: 28 },
];

const governanceTrend = [
  { month: "Oct", compliance: 71, incidents: 6, auditScore: 74 },
  { month: "Nov", compliance: 74, incidents: 5, auditScore: 77 },
  { month: "Dec", compliance: 76, incidents: 4, auditScore: 79 },
  { month: "Jan", compliance: 79, incidents: 4, auditScore: 82 },
  { month: "Feb", compliance: 82, incidents: 3, auditScore: 85 },
  { month: "Mar", compliance: 84, incidents: 2, auditScore: 87 },
];

const v2030Data = [
  { pillar: "Digital Health", target: 90, current: 71 },
  { pillar: "PHC Coverage", target: 85, current: 68 },
  { pillar: "NHI Enrollment", target: 100, current: 54 },
  { pillar: "Privatisation", target: 80, current: 62 },
  { pillar: "Saudization", target: 90, current: 74 },
  { pillar: "Quality Accred.", target: 95, current: 81 },
];

const radarData = [
  { domain: "Patient Exp", A: 79 },
  { domain: "System KPIs", A: 84 },
  { domain: "AI Governance", A: 72 },
  { domain: "V2030", A: 68 },
  { domain: "PXCM", A: 74 },
];

const anomalies = [
  { id: 1, domain: "Patient Experience", metric: "Complaint Volume", value: "+28% vs last week", severity: "high", time: "2h ago" },
  { id: 2, domain: "System KPIs", metric: "ER Wait Time", value: "41 min (threshold: 35)", severity: "medium", time: "6h ago" },
  { id: 3, domain: "AI Governance", metric: "Model Drift Index", value: "0.18 (alert: >0.15)", severity: "medium", time: "1d ago" },
  { id: 4, domain: "V2030", metric: "NHI Enrollment Rate", value: "Below quarterly target by 8%", severity: "low", time: "2d ago" },
];

const severityStyle = {
  high: { bg: RED_L, color: RED, label: "Critical" },
  medium: { bg: AMBER_L, color: AMBER, label: "High" },
  low: { bg: BLUE_L, color: BLUE, label: "Moderate" },
};

const pxcmStages = [
  { num: "01", label: "Operational Inputs", desc: "DTS, Nursing, Call Center, Coordinators, Clinical Teams", color: TEAL, bg: TEAL_L },
  { num: "02", label: "AI Processing Engine", desc: "NLP, Sentiment Analysis, Predictive Modeling, Anomaly Detection", color: BLUE, bg: BLUE_L },
  { num: "03", label: "KPI Dashboard", desc: "Role-tiered live dashboards with drill-down by unit, team & period", color: PURPLE, bg: PURPLE_L },
  { num: "04", label: "Leadership Action", desc: "Executive review, intervention authorization, resource allocation", color: AMBER, bg: AMBER_L },
  { num: "05", label: "Policy Formation", desc: "SOP updates, model retraining, governance feedback loop", color: GREEN, bg: GREEN_L },
];

const responseTiers = [
  { tier: "CRITICAL", trigger: "Safety event or PXI drop >15% in 24h", action: "Immediate leadership huddle; root cause activation; safety protocol review", owner: "CNO / CMO / CEO", time: "Within 2 hours", color: RED, bg: RED_L },
  { tier: "HIGH", trigger: "Escalation rate >10% above baseline; complaint clusters on single unit", action: "Director-level intervention; frontline coaching; temporary protocol adjustment", owner: "Department Director / VP Quality", time: "Same business day", color: AMBER, bg: AMBER_L },
  { tier: "MODERATE", trigger: "Sentiment declining >2 consecutive days; FCR below 80%", action: "Supervisor review; team huddle; process audit", owner: "Supervisor / Manager", time: "Within 48 hours", color: BLUE, bg: BLUE_L },
  { tier: "LOW", trigger: "Single anomalous KPI; isolated complaint outside trend", action: "Document and monitor; frontline staff notification", owner: "Team Lead", time: "Within 72 hours", color: GREEN, bg: GREEN_L },
];

const roadmap = [
  { phase: "Phase 1", label: "Foundation", months: "Months 1–3", status: 100, color: GREEN, bg: GREEN_L, items: ["Data architecture assessment across all 5 input streams", "Data governance policies & data stewardship roles", "Pilot dashboard (Tier 2) for 2 high-volume units", "Baseline all target KPIs; establish benchmark comparators", "Train supervisors on dashboard interpretation"] },
  { phase: "Phase 2", label: "Integration", months: "Months 4–6", status: 78, color: TEAL, bg: TEAL_L, items: ["Activate real-time NLP on call center transcription", "Integrate DTS data pipeline into analytics engine", "Launch Tier 1 executive dashboard + daily briefing", "Implement Response Tier Protocol; train leadership", "First bias & fairness audit on NLP models"] },
  { phase: "Phase 3", label: "Intelligence", months: "Months 7–12", status: 42, color: AMBER, bg: AMBER_L, items: ["Full-scale predictive risk modeling & anomaly detection", "Launch Tier 3 frontline dashboards with task queues", "Formalize Policy Development Cycle; first AI-driven SOP", "Initiate model retraining with 6-month outcome data", "Present Phase 1–2 ROI to governance board"] },
  { phase: "Phase 4", label: "Optimization", months: "Month 13+", status: 10, color: BLUE, bg: BLUE_L, items: ["Predictive modeling for staffing & scheduling optimization", "Integrate PXCM into compensation & performance review", "Pursue Planetree/Leapfrog certification using PXCM evidence", "Evaluate interoperability with regional & payer data sources"] },
];

const roles = [
  { role: "Chief Patient Experience Officer (CPXO)", resp: "Owns PXCM strategy; chairs monthly governance board; approves all AI model deployments", authority: "Full — all tiers", color: RED },
  { role: "VP Quality & Safety", resp: "Oversees KPI benchmarks; leads Critical & High-tier response activations; policy approval", authority: "Tier 1 & 2", color: AMBER },
  { role: "Department Directors", resp: "Manages Tier 2 & 3 responses; weekly strategy sessions; drives unit-level improvement plans", authority: "Tier 2 & 3", color: BLUE },
  { role: "PX Analytics Manager", resp: "Manages AI engine operations; model performance monitoring; prepares executive briefings", authority: "Technical only", color: PURPLE },
  { role: "Nursing Supervisors", resp: "Real-time Tier 3 response; frontline dashboard monitoring; rounding compliance ownership", authority: "Tier 3", color: TEAL },
  { role: "Call Center Supervisor", resp: "FCR and sentiment monitoring; escalation triage; staff coaching based on AI flags", authority: "Tier 3", color: GREEN },
  { role: "DTS Supervisor", resp: "Triage data quality assurance; DTS feed monitoring; abandonment rate intervention", authority: "Tier 3", color: GRAY },
];

const successMetrics = [
  { metric: "HCAHPS Overall Rating (Top Box %)", baseline: "Establish baseline", target12: "+5 percentile points", benchmark: "90th percentile nationally", status: "on-track" },
  { metric: "Patient Complaint Rate per 1,000 visits", baseline: "Establish baseline", target12: "20% reduction", benchmark: "<4.5 per 1,000", status: "on-track" },
  { metric: "First-Contact Resolution Rate", baseline: "Establish baseline", target12: ">85%", benchmark: ">90% (industry leading)", status: "achieved" },
  { metric: "Average Time to Resolution (days)", baseline: "Establish baseline", target12: "<3 days moderate; <1 day high", benchmark: "<2 days all tiers", status: "on-track" },
  { metric: "Escalation Rate", baseline: "Establish baseline", target12: "15% reduction from baseline", benchmark: "<6% of total interactions", status: "at-risk" },
  { metric: "AI Alert Precision (Escalation Prediction)", baseline: "N/A", target12: ">80%", benchmark: ">85% sustained", status: "on-track" },
  { metric: "Staff Engagement Score (PX team)", baseline: "Establish baseline", target12: "+10% from baseline", benchmark: "Top quartile healthcare sector", status: "on-track" },
];

const statusBadge = {
  "on-track": { bg: GREEN_L, color: GREEN, label: "On Track" },
  "achieved": { bg: TEAL_L, color: TEAL, label: "Achieved" },
  "at-risk": { bg: RED_L, color: RED, label: "At Risk" },
};

const kpiTiers = [
  {
    tier: "Tier 1", label: "Executive", audience: "C-Suite, Board, VP Quality", refresh: "Hourly / Daily Summary", color: RED, bg: RED_L,
    kpis: ["Overall PX Score", "HCAHPS percentile ranking", "Escalation rate (system-wide)", "Safety event correlation index", "ROI on PX initiatives"],
    status: [88, 72, 6.8, 3, 74],
    icons: ["PX", "HC", "ES", "SF", "RO"]
  },
  {
    tier: "Tier 2", label: "Operational", audience: "Department Directors, Nurse Managers, Call Center Leads", refresh: "Real-time (15-min lag)", color: AMBER, bg: AMBER_L,
    kpis: ["Unit-level sentiment score", "Rounding compliance rate", "First-call resolution rate", "DTS abandonment rate", "Staff-to-complaint ratio"],
    status: [77, 89, 85, 4.2, 1.8],
    icons: ["SN", "RC", "FC", "DT", "SC"]
  },
  {
    tier: "Tier 3", label: "Frontline", audience: "Charge Nurses, Coordinators, DTS Supervisors", refresh: "Real-time (5-min lag)", color: GREEN, bg: GREEN_L,
    kpis: ["Individual interaction flags", "Open unresolved complaints", "Unresolved escalations", "Personal task queue items", "Sentiment alerts today"],
    status: [2, 8, 3, 5, 1],
    icons: ["IF", "OC", "UE", "TQ", "SA"]
  },
];

const policySteps = [
  { num: "01", label: "Signal Identification", desc: "AI engine surfaces persistent pattern not addressable by routine response tiers", status: "complete", color: GREEN },
  { num: "02", label: "Root Cause Analysis", desc: "Multidisciplinary team reviews AI-generated evidence bundle; structured RCA conducted", status: "complete", color: GREEN },
  { num: "03", label: "Policy Drafting", desc: "Quality team develops or revises SOP with clinical, operations, and compliance input", status: "active", color: AMBER },
  { num: "04", label: "Governance Approval", desc: "Policy routed through defined approval pathway with documented evidence base", status: "pending", color: GRAY },
  { num: "05", label: "Implementation & Training", desc: "Rollout with structured onboarding and competency verification", status: "pending", color: GRAY },
  { num: "06", label: "KPI Validation", desc: "AI engine monitors target KPIs for 90-day post-implementation impact; feeds model retraining", status: "pending", color: GRAY },
];

const stepStatus = {
  complete: { bg: GREEN_L, color: GREEN, label: "Complete" },
  active: { bg: AMBER_L, color: AMBER, label: "In Progress" },
  pending: { bg: GRAY_L, color: GRAY, label: "Pending" },
};

const TABS = ["Overview", "Patient Experience", "System KPIs", "AI Governance", "Vision 2030", "PXCM Command"];
const PXCM_SECTIONS = ["Architecture", "Roadmap", "Roles", "KPI Tiers", "Policy Cycle", "Success Metrics"];

function MetricCard({ label, value, sub, color = GRAY, bgColor = GRAY_L, trend }) {
  return (
    <div style={{ background: bgColor, borderRadius: 10, padding: "14px 16px", flex: 1, minWidth: 120 }}>
      <div style={{ fontSize: 12, color: GRAY, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 500, color }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: GRAY, marginTop: 2 }}>{sub}</div>}
      {trend !== undefined && <div style={{ fontSize: 11, marginTop: 3, color: trend > 0 ? GREEN : RED }}>{trend > 0 ? "▲" : "▼"} {Math.abs(trend)}% vs last month</div>}
    </div>
  );
}

function SectionHeader({ title, sub }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 15, fontWeight: 500, color: "#2C2C2A" }}>{title}</div>
      {sub && <div style={{ fontSize: 12, color: GRAY, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function Card({ children, style = {} }) {
  return <div style={{ background: "#fff", border: "0.5px solid #e0ddd5", borderRadius: 12, padding: 16, ...style }}>{children}</div>;
}

function AnomalyPanel() {
  return (
    <div>
      <SectionHeader title="Anomaly & risk alerts" sub="AI-flagged deviations requiring executive attention" />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {anomalies.map(a => {
          const s = severityStyle[a.severity];
          return (
            <div key={a.id} style={{ background: "#fff", border: "0.5px solid #e0ddd5", borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap" }}>{s.label}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#2C2C2A" }}>{a.metric}</div>
                <div style={{ fontSize: 12, color: GRAY }}>{a.domain} · {a.value}</div>
              </div>
              <div style={{ fontSize: 11, color: GRAY, whiteSpace: "nowrap" }}>{a.time}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AIPanel() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [sumLoading, setSumLoading] = useState(false);
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const ctx = `You are an AI analyst in an executive healthcare dashboard for a Saudi hospital system (Vision 2030 context), integrating the PXCM (Patient Experience Command Model).
Key data (March 2026): PXI: 79, FCR: 85%, Escalation Rate: 6.8%, TTR: 2.9 days, Rounding Compliance: 89%, Bed Occupancy: 88%, Readmission: 7.6%, ER Wait: 28 min, AI Governance: 84%, V2030 composite: 68%, NHI Enrollment: 54%.
PXCM Phase 1: 100% complete. Phase 2: 78%. Phase 3: 42%. Phase 4: 10%.
Policy Cycle: Step 3 (Policy Drafting) currently in progress.
KPI Tiers: Tier 1 (Executive), Tier 2 (Operational), Tier 3 (Frontline) all active.
Active anomalies: Complaint spike +28%, ER wait breach, AI model drift 0.18.
Respond concisely as if briefing a health system executive. Under 120 words.`;

  async function ask() {
    if (!prompt.trim() || loading) return;
    const u = prompt.trim(); setPrompt("");
    setMessages(m => [...m, { role: "user", text: u }]);
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: ctx,
          messages: [...messages.map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text })), { role: "user", content: u }] })
      });
      const data = await res.json();
      setMessages(m => [...m, { role: "assistant", text: data.content?.[0]?.text || "No response." }]);
    } catch { setMessages(m => [...m, { role: "assistant", text: "API error. Please try again." }]); }
    setLoading(false);
  }

  async function generateSummary() {
    setSumLoading(true); setSummary("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000,
          messages: [{ role: "user", content: `${ctx}\n\nGenerate a concise executive summary (5 bullet points) covering PXCM status, KPI tier health, policy cycle progress, and top risks. Use plain text bullets starting with •` }] })
      });
      const data = await res.json();
      setSummary(data.content?.[0]?.text || "Could not generate summary.");
    } catch { setSummary("API error."); }
    setSumLoading(false);
  }

  return (
    <Card>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <SectionHeader title="Ask the dashboard" sub="Natural language insights — PXCM-aware" />
        <button onClick={generateSummary} disabled={sumLoading} style={{ fontSize: 12, padding: "6px 14px", borderRadius: 8, border: "0.5px solid #e0ddd5", background: AMBER_L, color: "#633806", cursor: "pointer", fontWeight: 500 }}>
          {sumLoading ? "Generating..." : "Executive summary"}
        </button>
      </div>
      {summary && <div style={{ background: AMBER_L, borderRadius: 8, padding: "12px 14px", marginBottom: 14, fontSize: 13, color: "#412402", lineHeight: 1.7, whiteSpace: "pre-line" }}>{summary}</div>}
      <div style={{ maxHeight: 220, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
        {messages.length === 0 && <div style={{ color: GRAY, fontSize: 13, padding: "8px 0" }}>Ask anything — e.g. "What is the current policy cycle status?" or "Which KPI tier needs attention?"</div>}
        {messages.map((m, i) => (
          <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", background: m.role === "user" ? BLUE_L : GRAY_L, color: m.role === "user" ? "#0C447C" : "#2C2C2A", borderRadius: 8, padding: "8px 12px", maxWidth: "85%", fontSize: 13, lineHeight: 1.6 }}>{m.text}</div>
        ))}
        {loading && <div style={{ alignSelf: "flex-start", background: GRAY_L, borderRadius: 8, padding: "8px 12px", fontSize: 13, color: GRAY }}>Thinking…</div>}
        <div ref={bottomRef} />
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input value={prompt} onChange={e => setPrompt(e.target.value)} onKeyDown={e => e.key === "Enter" && ask()} placeholder="Ask about PXCM, KPI tiers, policy cycle, alerts…" style={{ flex: 1, fontSize: 13, padding: "8px 12px", borderRadius: 8, border: "0.5px solid #e0ddd5", outline: "none" }} />
        <button onClick={ask} disabled={loading || !prompt.trim()} style={{ padding: "8px 16px", borderRadius: 8, background: AMBER, color: "#fff", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500 }}>Ask</button>
      </div>
    </Card>
  );
}

function OverviewTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <MetricCard label="Patient Experience Index" value="79/100" sub="PXI — Mar 2026" color={GREEN} bgColor={GREEN_L} trend={2} />
        <MetricCard label="Bed Occupancy" value="88%" sub="Target ≤90%" color={BLUE} bgColor={BLUE_L} trend={1} />
        <MetricCard label="AI Governance Score" value="87/100" color={AMBER} bgColor={AMBER_L} trend={2} />
        <MetricCard label="V2030 Overall" value="68%" color={TEAL} bgColor={TEAL_L} trend={3} />
        <MetricCard label="PXCM Phase" value="Phase 2" sub="78% complete" color={PURPLE} bgColor={PURPLE_L} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <SectionHeader title="Cross-domain performance" sub="Radar — current month" />
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e0ddd5" />
              <PolarAngleAxis dataKey="domain" tick={{ fontSize: 11, fill: GRAY }} />
              <Radar name="Score" dataKey="A" stroke={AMBER} fill={AMBER} fillOpacity={0.18} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
        <AnomalyPanel />
      </div>
      <Card>
        <SectionHeader title="PXCM 5-stage closed loop — status snapshot" />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {pxcmStages.map((s, i) => (
            <div key={i} style={{ background: s.bg, borderRadius: 10, padding: "10px 14px", flex: 1, minWidth: 110 }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: s.color, marginBottom: 4 }}>{s.num}</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#2C2C2A", marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: GRAY, lineHeight: 1.5 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <SectionHeader title="KPI tier activation status" sub="Dashboard access by stakeholder level" />
          {kpiTiers.map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: i < 2 ? 12 : 0 }}>
              <div style={{ background: t.bg, color: t.color, fontSize: 11, fontWeight: 500, padding: "4px 12px", borderRadius: 20, whiteSpace: "nowrap" }}>{t.tier}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#2C2C2A" }}>{t.label}</div>
                <div style={{ fontSize: 11, color: GRAY }}>{t.refresh}</div>
              </div>
              <div style={{ background: GREEN_L, color: GREEN, fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 20 }}>Active</div>
            </div>
          ))}
        </Card>
        <Card>
          <SectionHeader title="Policy development cycle" sub="Current active cycle status" />
          {policySteps.map((s, i) => {
            const st = stepStatus[s.status];
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: i < 5 ? 10 : 0 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: st.bg, color: st.color, fontSize: 11, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{s.num}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: "#2C2C2A" }}>{s.label}</div>
                </div>
                <div style={{ background: st.bg, color: st.color, fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: 20, whiteSpace: "nowrap" }}>{st.label}</div>
              </div>
            );
          })}
        </Card>
      </div>
      <AIPanel />
    </div>
  );
}

function PatientTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <MetricCard label="Patient Experience Index" value="79/100" color={GREEN} bgColor={GREEN_L} trend={2} />
        <MetricCard label="First-Contact Resolution" value="85%" sub="Target >85%" color={TEAL} bgColor={TEAL_L} trend={2} />
        <MetricCard label="Escalation Rate" value="6.8%" sub="Target <6%" color={AMBER} bgColor={AMBER_L} trend={-6} />
        <MetricCard label="Time to Resolution" value="2.9 days" sub="Target <3 days" color={BLUE} bgColor={BLUE_L} trend={-7} />
        <MetricCard label="Rounding Compliance" value="89%" sub="Target ≥90%" color={PURPLE} bgColor={PURPLE_L} trend={2} />
      </div>
      <Card>
        <SectionHeader title="PXCM core KPI trends" sub="PXI, FCR, Escalation Rate — 6-month rolling" />
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={patientTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0ede5" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: GRAY }} />
            <YAxis tick={{ fontSize: 11, fill: GRAY }} />
            <Tooltip />
            <Line type="monotone" dataKey="pxi" stroke={GREEN} strokeWidth={2} name="PXI" />
            <Line type="monotone" dataKey="fcr" stroke={TEAL} strokeWidth={2} name="FCR %" />
            <Line type="monotone" dataKey="escalation" stroke={RED} strokeWidth={2} name="Escalation %" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
      <Card>
        <SectionHeader title="Response tier protocol — live status" sub="PXCM executive response framework" />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {responseTiers.map((t, i) => (
            <div key={i} style={{ background: t.bg, borderRadius: 10, padding: "12px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <div style={{ background: t.color, color: "#fff", fontSize: 11, fontWeight: 500, padding: "3px 12px", borderRadius: 20 }}>{t.tier}</div>
                <div style={{ fontSize: 12, color: GRAY }}>{t.time} · {t.owner}</div>
              </div>
              <div style={{ fontSize: 12, color: "#2C2C2A", marginBottom: 2 }}><b>Trigger:</b> {t.trigger}</div>
              <div style={{ fontSize: 12, color: GRAY }}><b>Action:</b> {t.action}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function KPITab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <MetricCard label="Bed Occupancy" value="88%" sub="Target ≤90%" color={BLUE} bgColor={BLUE_L} trend={1} />
        <MetricCard label="Readmission Rate" value="7.6%" sub="Target <8%" color={GREEN} bgColor={GREEN_L} trend={-4} />
        <MetricCard label="ALOS" value="4.2 days" color={TEAL} bgColor={TEAL_L} trend={-2} />
        <MetricCard label="ER Wait Time" value="28 min" sub="Target <30 min" color={AMBER} bgColor={AMBER_L} trend={-7} />
      </div>
      <Card>
        <SectionHeader title="Operational KPI trends" sub="6-month rolling" />
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={kpiTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0ede5" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: GRAY }} />
            <YAxis tick={{ fontSize: 11, fill: GRAY }} />
            <Tooltip />
            <Line type="monotone" dataKey="bedOcc" stroke={BLUE} strokeWidth={2} name="Bed Occ %" />
            <Line type="monotone" dataKey="er_wait" stroke={AMBER} strokeWidth={2} name="ER Wait (min)" />
            <Line type="monotone" dataKey="readmission" stroke={RED} strokeWidth={2} name="Readmission %" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
      <Card>
        <SectionHeader title="Predictive forecast — bed occupancy" sub="AI projection Q2 2026" />
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={[
            { month: "Mar", actual: 88 },
            { month: "Apr", upper: 91, lower: 87 },
            { month: "May", upper: 93, lower: 88 },
            { month: "Jun", upper: 95, lower: 89 },
          ]}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0ede5" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: GRAY }} />
            <YAxis tick={{ fontSize: 11, fill: GRAY }} domain={[80, 100]} />
            <Tooltip />
            <Area type="monotone" dataKey="upper" stroke={RED} fill={RED_L} name="Upper bound" />
            <Area type="monotone" dataKey="lower" stroke={BLUE} fill={BLUE_L} name="Lower bound" />
            <Line type="monotone" dataKey="actual" stroke={BLUE} strokeWidth={2} dot name="Actual" />
          </AreaChart>
        </ResponsiveContainer>
        <div style={{ fontSize: 11, color: RED, marginTop: 4 }}>Risk alert: Occupancy may breach 90% ceiling by May if current admission trajectory continues.</div>
      </Card>
    </div>
  );
}

function GovernanceTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <MetricCard label="PDPL Compliance" value="84%" sub="Target ≥90%" color={AMBER} bgColor={AMBER_L} trend={2} />
        <MetricCard label="AI Audit Score" value="87/100" color={GREEN} bgColor={GREEN_L} trend={2} />
        <MetricCard label="AI Incidents" value="2" sub="This month" color={BLUE} bgColor={BLUE_L} trend={-33} />
        <MetricCard label="Model Bias Index" value="0.09" sub="Threshold: 0.15" color={TEAL} bgColor={TEAL_L} trend={-18} />
      </div>
      <Card>
        <SectionHeader title="AI governance metrics trend" />
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={governanceTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0ede5" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: GRAY }} />
            <YAxis tick={{ fontSize: 11, fill: GRAY }} />
            <Tooltip />
            <Line type="monotone" dataKey="compliance" stroke={GREEN} strokeWidth={2} name="Compliance %" />
            <Line type="monotone" dataKey="auditScore" stroke={AMBER} strokeWidth={2} name="Audit Score" />
            <Line type="monotone" dataKey="incidents" stroke={RED} strokeWidth={2} name="Incidents" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
      <Card>
        <SectionHeader title="CAGT framework status" sub="Capture · Analyse · Govern · Transform" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { label: "Capture", value: 91, color: TEAL, bg: TEAL_L },
            { label: "Analyse", value: 83, color: BLUE, bg: BLUE_L },
            { label: "Govern", value: 72, color: AMBER, bg: AMBER_L },
            { label: "Transform", value: 61, color: RED, bg: RED_L },
          ].map(c => (
            <div key={c.label} style={{ background: c.bg, borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 12, color: GRAY, marginBottom: 4 }}>CAGT — {c.label}</div>
              <div style={{ fontSize: 20, fontWeight: 500, color: c.color, marginBottom: 6 }}>{c.value}%</div>
              <div style={{ height: 5, borderRadius: 4, background: "#e0ddd5" }}>
                <div style={{ height: 5, borderRadius: 4, background: c.color, width: `${c.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function V2030Tab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <MetricCard label="Overall V2030 Progress" value="68%" color={TEAL} bgColor={TEAL_L} trend={3} />
        <MetricCard label="NHI Enrollment" value="54%" sub="Target: 100%" color={AMBER} bgColor={AMBER_L} trend={4} />
        <MetricCard label="Digital Health Index" value="71%" sub="Target: 90%" color={BLUE} bgColor={BLUE_L} trend={2} />
        <MetricCard label="Quality Accreditation" value="81%" sub="Target: 95%" color={GREEN} bgColor={GREEN_L} trend={1} />
      </div>
      <Card>
        <SectionHeader title="Vision 2030 pillar progress vs targets" />
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={v2030Data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0ede5" />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: GRAY }} />
            <YAxis type="category" dataKey="pillar" tick={{ fontSize: 11, fill: GRAY }} width={120} />
            <Tooltip />
            <Bar dataKey="target" fill="#e0ddd5" name="Target" radius={[0, 4, 4, 0]} />
            <Bar dataKey="current" fill={TEAL} name="Current" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
      <Card>
        <SectionHeader title="NHI enrollment trajectory" sub="AI projection to 2030 target" />
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={[
            { year: "2024", actual: 42 }, { year: "2025", actual: 54 },
            { year: "2026", predicted: 64 }, { year: "2027", predicted: 74 },
            { year: "2028", predicted: 83 }, { year: "2029", predicted: 92 }, { year: "2030", predicted: 100 },
          ]}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0ede5" />
            <XAxis dataKey="year" tick={{ fontSize: 11, fill: GRAY }} />
            <YAxis tick={{ fontSize: 11, fill: GRAY }} domain={[30, 105]} />
            <Tooltip />
            <Line type="monotone" dataKey="actual" stroke={TEAL} strokeWidth={2} dot name="Actual" />
            <Line type="monotone" dataKey="predicted" stroke={AMBER} strokeWidth={2} strokeDasharray="5 5" dot name="Projected" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

function PXCMTab() {
  const [active, setActive] = useState("Architecture");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <MetricCard label="PXCM Phase" value="Phase 2" sub="Integration — 78%" color={PURPLE} bgColor={PURPLE_L} />
        <MetricCard label="Input Streams Active" value="3 / 5" sub="DTS, Call Center, Clinical" color={TEAL} bgColor={TEAL_L} />
        <MetricCard label="Policy Cycle Step" value="Step 3" sub="Policy Drafting — active" color={AMBER} bgColor={AMBER_L} />
        <MetricCard label="KPI Tiers Active" value="3 / 3" sub="Tier 1, 2 & 3 live" color={GREEN} bgColor={GREEN_L} />
      </div>

      <div style={{ display: "flex", gap: 0, borderBottom: "0.5px solid #e0ddd5", overflowX: "auto" }}>
        {PXCM_SECTIONS.map(s => (
          <button key={s} onClick={() => setActive(s)} style={{ padding: "9px 14px", fontSize: 12, fontWeight: active === s ? 500 : 400, color: active === s ? PURPLE : GRAY, background: "none", border: "none", borderBottom: active === s ? `2px solid ${PURPLE}` : "2px solid transparent", cursor: "pointer", whiteSpace: "nowrap" }}>{s}</button>
        ))}
      </div>

      {active === "Architecture" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <SectionHeader title="PXCM 5-stage closed-loop architecture" sub="Each stage feeds the next in a continuous quality intelligence loop" />
          {pxcmStages.map((s, i) => (
            <div key={i} style={{ background: s.bg, borderRadius: 12, padding: "14px 18px", display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div style={{ background: s.color, color: "#fff", fontSize: 13, fontWeight: 500, width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{s.num}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: "#2C2C2A", marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 13, color: GRAY, lineHeight: 1.6 }}>{s.desc}</div>
              </div>
              {i < pxcmStages.length - 1 && <div style={{ color: GRAY, fontSize: 20, alignSelf: "center" }}>↓</div>}
            </div>
          ))}
        </div>
      )}

      {active === "Roadmap" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <SectionHeader title="PXCM implementation roadmap" sub="4-phase deployment — current progress" />
          {roadmap.map((p, i) => (
            <Card key={i}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <div style={{ background: p.bg, color: p.color, fontSize: 12, fontWeight: 500, padding: "4px 14px", borderRadius: 20 }}>{p.phase}</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: "#2C2C2A" }}>{p.label}</div>
                <div style={{ fontSize: 12, color: GRAY }}>{p.months}</div>
                <div style={{ marginLeft: "auto", fontSize: 14, fontWeight: 500, color: p.color }}>{p.status}%</div>
              </div>
              <div style={{ height: 6, borderRadius: 4, background: "#e0ddd5", marginBottom: 12 }}>
                <div style={{ height: 6, borderRadius: 4, background: p.color, width: `${p.status}%` }} />
              </div>
              {p.items.map((item, j) => (
                <div key={j} style={{ fontSize: 12, color: GRAY, display: "flex", gap: 8, marginBottom: 5 }}>
                  <span style={{ color: p.color }}>·</span>{item}
                </div>
              ))}
            </Card>
          ))}
        </div>
      )}

      {active === "Roles" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <SectionHeader title="PXCM roles & responsibilities" sub="Decision authority and accountability framework" />
          {roles.map((r, i) => (
            <div key={i} style={{ background: "#fff", border: "0.5px solid #e0ddd5", borderRadius: 12, padding: "14px 16px", display: "flex", gap: 14 }}>
              <div style={{ width: 4, borderRadius: 4, background: r.color, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: "#2C2C2A", marginBottom: 4 }}>{r.role}</div>
                <div style={{ fontSize: 12, color: GRAY, marginBottom: 8, lineHeight: 1.6 }}>{r.resp}</div>
                <div style={{ display: "inline-block", background: r.color + "22", color: r.color, fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 20 }}>{r.authority}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {active === "KPI Tiers" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <SectionHeader title="KPI tier structure" sub="Role-specific dashboards — audience, KPIs, and refresh cadence" />
          {kpiTiers.map((t, ti) => (
            <Card key={ti}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div style={{ background: t.bg, color: t.color, fontSize: 13, fontWeight: 500, padding: "5px 16px", borderRadius: 20 }}>{t.tier} — {t.label}</div>
                <div style={{ fontSize: 12, color: GRAY, flex: 1 }}>{t.audience}</div>
                <div style={{ fontSize: 11, color: t.color, fontWeight: 500 }}>{t.refresh}</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
                {t.kpis.map((kpi, ki) => (
                  <div key={ki} style={{ background: t.bg, borderRadius: 8, padding: "10px 10px" }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: t.color, marginBottom: 4 }}>{t.status[ki]}{ki === 0 && ti === 0 ? "" : ki === 3 && ti === 1 ? "%" : ki === 4 && ti === 1 ? "x" : ki < 3 || ti === 2 ? "" : "%"}</div>
                    <div style={{ fontSize: 11, color: GRAY, lineHeight: 1.4 }}>{kpi}</div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
          <Card>
            <SectionHeader title="KPI definitions — core PXCM metrics" sub="Standardized definitions for governance alignment" />
            {[
              { name: "Patient Experience Index (PXI)", def: "Composite weighted score from survey results, complaint rates, escalation frequency, and resolution timeliness. Primary governance metric." },
              { name: "Escalation Rate", def: "Percentage of patient interactions requiring supervisor or leadership intervention. Benchmarked against acuity-adjusted national norms." },
              { name: "First-Contact Resolution (FCR)", def: "Percentage of patient concerns fully resolved at first point of contact without escalation or transfer." },
              { name: "Rounding Compliance Rate", def: "Percentage of scheduled patient rounding events completed on time with documented interaction outcomes." },
              { name: "Sentiment Trend Index", def: "7-day rolling sentiment score by unit and care team, enabling early identification of emerging culture or workflow issues." },
              { name: "Time to Resolution (TTR)", def: "Average time from complaint or concern logged to documented resolution, stratified by severity tier." },
            ].map((d, i) => (
              <div key={i} style={{ borderBottom: i < 5 ? "0.5px solid #f0ede5" : "none", paddingBottom: i < 5 ? 10 : 0, marginBottom: i < 5 ? 10 : 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#2C2C2A", marginBottom: 3 }}>{d.name}</div>
                <div style={{ fontSize: 12, color: GRAY, lineHeight: 1.6 }}>{d.def}</div>
              </div>
            ))}
          </Card>
        </div>
      )}

      {active === "Policy Cycle" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <SectionHeader title="Policy development cycle" sub="6-step evidence-to-governance process — current cycle status" />
          {policySteps.map((s, i) => {
            const st = stepStatus[s.status];
            return (
              <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: st.bg, color: st.color, fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: `1.5px solid ${st.color}` }}>{s.num}</div>
                  {i < policySteps.length - 1 && <div style={{ width: 2, height: 24, background: "#e0ddd5", margin: "4px 0" }} />}
                </div>
                <div style={{ flex: 1, background: st.bg, borderRadius: 12, padding: "12px 16px", marginBottom: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "#2C2C2A" }}>{s.label}</div>
                    <div style={{ background: "#fff", color: st.color, fontSize: 11, fontWeight: 500, padding: "2px 10px", borderRadius: 20, border: `0.5px solid ${st.color}` }}>{st.label}</div>
                  </div>
                  <div style={{ fontSize: 12, color: GRAY, lineHeight: 1.6 }}>{s.desc}</div>
                </div>
              </div>
            );
          })}
          <Card>
            <SectionHeader title="Model retraining protocol" sub="Triggered by validated policy outcomes" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { label: "Retraining frequency", value: "Quarterly", color: BLUE, bg: BLUE_L },
                { label: "Escalation precision target", value: ">85%", color: GREEN, bg: GREEN_L },
                { label: "Complaint recall target", value: ">80%", color: TEAL, bg: TEAL_L },
                { label: "Performance degradation trigger", value: ">5% drop", color: RED, bg: RED_L },
              ].map((m, i) => (
                <div key={i} style={{ background: m.bg, borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ fontSize: 11, color: GRAY, marginBottom: 4 }}>{m.label}</div>
                  <div style={{ fontSize: 18, fontWeight: 500, color: m.color }}>{m.value}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {active === "Success Metrics" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <SectionHeader title="Success metrics & target benchmarks" sub="Evaluated at 6-month and 12-month intervals post-deployment" />
          {successMetrics.map((m, i) => {
            const s = statusBadge[m.status];
            return (
              <Card key={i}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#2C2C2A", flex: 1 }}>{m.metric}</div>
                  <div style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 500, padding: "3px 12px", borderRadius: 20, whiteSpace: "nowrap" }}>{s.label}</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  {[["Baseline", m.baseline, GRAY], ["12-Month Target", m.target12, BLUE], ["Best Practice", m.benchmark, GREEN]].map(([lbl, val, col]) => (
                    <div key={lbl} style={{ background: GRAY_L, borderRadius: 8, padding: "8px 10px" }}>
                      <div style={{ fontSize: 11, color: GRAY, marginBottom: 3 }}>{lbl}</div>
                      <div style={{ fontSize: 12, fontWeight: 500, color: col }}>{val}</div>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState(0);
  const tabContent = [<OverviewTab />, <PatientTab />, <KPITab />, <GovernanceTab />, <V2030Tab />, <PXCMTab />];

  return (
    <div style={{ fontFamily: "var(--font-sans)", background: "var(--color-background-tertiary)", minHeight: "100vh", paddingBottom: 32 }}>
      <div style={{ background: "#fff", borderBottom: "0.5px solid #e0ddd5", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 500, color: "#2C2C2A" }}>Executive Health Intelligence Dashboard</div>
          <div style={{ fontSize: 12, color: GRAY, marginTop: 2 }}>Saudi Health System · PXCM Integrated · March 2026</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ background: PURPLE_L, color: "#3C3489", fontSize: 11, fontWeight: 500, padding: "4px 12px", borderRadius: 20 }}>PXCM Phase 2 · 78%</div>
          <div style={{ background: AMBER_L, color: "#633806", fontSize: 11, fontWeight: 500, padding: "4px 12px", borderRadius: 20 }}>4 active alerts</div>
        </div>
      </div>
      <div style={{ background: "#fff", borderBottom: "0.5px solid #e0ddd5", display: "flex", overflowX: "auto" }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} style={{ padding: "11px 16px", fontSize: 13, fontWeight: tab === i ? 500 : 400, color: tab === i ? AMBER : GRAY, background: "none", border: "none", borderBottom: tab === i ? `2px solid ${AMBER}` : "2px solid transparent", cursor: "pointer", whiteSpace: "nowrap" }}>{t}</button>
        ))}
      </div>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "20px 16px" }}>
        {tabContent[tab]}
      </div>
    </div>
  );
}
