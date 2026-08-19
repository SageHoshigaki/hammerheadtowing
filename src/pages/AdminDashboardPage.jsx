import { useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  ExternalLink,
  Gauge,
  Layers3,
  LogOut,
  Megaphone,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Truck,
  X,
  Zap,
} from "lucide-react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import { useAuth } from "@/contexts/AuthContext";
import {
  useServiceRequests,
  useDashboardMetrics,
  usePulseData,
  usePulseInsight,
  useSourceFlow,
  useLeakageData,
  useCampaignData,
  useCampaignInsights,
  useDemandHeatmap,
  useServiceData,
  useReliabilityData,
  useSystemHealth,
  useRequestStream,
  retryTowbookRequest,
  retryAttioRequest,
  updateServiceRequest,
  fetchRequestEvents,
  HEAT_HOURS,
} from "@/lib/useAdminData";

/* ----------------------------------------------------------
   MOTION
---------------------------------------------------------- */

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055 } },
};

/* ----------------------------------------------------------
   HELPERS
---------------------------------------------------------- */

function money(value) {
  if (value >= 1000) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function moneyCompact(value) {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  }
  return money(value);
}

function percent(value) {
  return `${(value || 0).toFixed(1)}%`;
}

/* ----------------------------------------------------------
   SMALL COMPONENTS
---------------------------------------------------------- */

function Eyebrow({ children, danger = false }) {
  return (
    <p
      className={`text-[9px] font-black uppercase tracking-[0.22em] ${
        danger ? "text-red-500" : "text-white/28"
      }`}
    >
      {children}
    </p>
  );
}

function Metric({ label, value, delta, positive = true, danger = false, onClick }) {
  return (
    <motion.button
      variants={fadeUp}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.985 }}
      onClick={onClick}
      className="group min-w-0 text-left"
    >
      <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/25">
        {label}
      </p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-[25px] font-medium tracking-[-0.055em] text-white lg:text-[30px]">
          {value}
        </span>
        {delta && (
          <span
            className={`text-[10px] font-semibold ${
              danger ? "text-red-400" : positive ? "text-emerald-400" : "text-white/30"
            }`}
          >
            {delta}
          </span>
        )}
      </div>
      <motion.div
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.25 }}
        className="mt-2 h-px origin-left bg-white/20"
      />
    </motion.button>
  );
}

function StatusBadge({ status }) {
  const config = {
    success: { text: "Sent", icon: Check, classes: "text-emerald-400 bg-emerald-500/8 border-emerald-500/15" },
    failed:  { text: "Failed", icon: AlertTriangle, classes: "text-red-400 bg-red-500/8 border-red-500/15" },
    pending: { text: "Pending", icon: Clock3, classes: "text-amber-300 bg-amber-500/8 border-amber-500/15" },
    sending: { text: "Sending", icon: RefreshCw, classes: "text-blue-300 bg-blue-500/8 border-blue-500/15" },
  }[status] || { text: status || "—", icon: Clock3, classes: "text-white/30 bg-white/5 border-white/10" };

  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[9px] font-bold uppercase tracking-[.12em] ${config.classes}`}>
      <Icon size={10} className={status === "sending" ? "animate-spin" : ""} />
      {config.text}
    </span>
  );
}

function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Layers3 size={28} className="text-white/10" />
      <p className="mt-4 text-sm text-white/25">{message}</p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/10 border-t-red-500" />
      <span className="ml-3 text-xs text-white/25">Loading requests…</span>
    </div>
  );
}

/* ----------------------------------------------------------
   TOOLTIPS
---------------------------------------------------------- */

function PulseTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const row = payload[0]?.payload;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-w-[190px] rounded-xl border border-white/[0.08] bg-[#0d0e10]/95 p-4 shadow-2xl backdrop-blur-xl"
    >
      <p className="text-[9px] uppercase tracking-[.18em] text-white/28">{label}</p>
      <p className="mt-2 text-2xl font-medium tracking-[-0.04em]">
        {row.requests}
        <span className="ml-1 text-xs font-normal text-white/30">requests</span>
      </p>
      <div className="mt-3 space-y-1.5 text-[11px]">
        <div className="flex justify-between gap-8">
          <span className="text-white/30">Completed</span>
          <span>{row.completed}</span>
        </div>
        <div className="flex justify-between gap-8">
          <span className="text-white/30">Revenue</span>
          <span>{money(row.revenue)}</span>
        </div>
        {row.requests > 0 && (
          <div className="flex justify-between gap-8">
            <span className="text-white/30">Completion</span>
            <span>{percent((row.completed / row.requests) * 100)}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function CampaignTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-xl border border-white/[0.08] bg-[#0d0e10]/95 p-4 shadow-2xl backdrop-blur-xl"
    >
      <p className="text-sm font-semibold">{row.name}</p>
      <p className="mt-1 text-[9px] uppercase tracking-[.14em] text-white/28">{row.source}</p>
      <div className="mt-4 grid grid-cols-3 gap-5">
        <div>
          <p className="text-[8px] uppercase tracking-[.14em] text-white/25">Leads</p>
          <p className="mt-1 text-sm">{row.leads}</p>
        </div>
        <div>
          <p className="text-[8px] uppercase tracking-[.14em] text-white/25">Conv.</p>
          <p className="mt-1 text-sm">{(row.conversion || 0).toFixed(0)}%</p>
        </div>
        <div>
          <p className="text-[8px] uppercase tracking-[.14em] text-white/25">Revenue</p>
          <p className="mt-1 text-sm">{money(row.revenue)}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ----------------------------------------------------------
   BUSINESS PULSE
---------------------------------------------------------- */

function BusinessPulse({ data, insight }) {
  if (!data.length) return <EmptyState message="No data for the selected period." />;

  return (
    <motion.section variants={fadeUp} className="border-t border-white/[0.055] py-10">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <Eyebrow>Business pulse</Eyebrow>
          <h2 className="mt-2 text-2xl font-medium tracking-[-0.045em]">
            {insight.sentence}
          </h2>
        </div>
        {Math.abs(insight.trend) >= 2 && (
          <div className="max-w-md">
            <div className="flex items-center gap-2 text-sm text-white/75">
              {insight.trend >= 0 ? (
                <TrendingUp size={14} className="text-emerald-400" />
              ) : (
                <TrendingDown size={14} className="text-red-400" />
              )}
              <span>{Math.abs(insight.trend).toFixed(0)}% {insight.trend >= 0 ? "increase" : "decrease"} over period</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 h-[370px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 12, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="requestFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#dc2626" stopOpacity={0.28} />
                <stop offset="100%" stopColor="#dc2626" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,.045)" />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "rgba(255,255,255,.25)", fontSize: 9 }} />
            <YAxis yAxisId="volume" axisLine={false} tickLine={false} tick={{ fill: "rgba(255,255,255,.20)", fontSize: 9 }} />
            <YAxis yAxisId="money" hide orientation="right" />
            <Tooltip cursor={{ stroke: "rgba(255,255,255,.08)", strokeDasharray: "4 4" }} content={<PulseTooltip />} />
            <Area yAxisId="volume" type="monotone" dataKey="requests" stroke="#dc2626" strokeWidth={2} fill="url(#requestFill)" dot={false} activeDot={{ r: 4, fill: "#dc2626", stroke: "#090a0b", strokeWidth: 3 }} />
            <Line yAxisId="volume" type="monotone" dataKey="completed" stroke="rgba(255,255,255,.72)" strokeWidth={1.5} dot={false} />
            <Line yAxisId="money" type="monotone" dataKey="revenue" stroke="rgba(255,255,255,.20)" strokeDasharray="5 6" strokeWidth={1} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-6 text-[9px] font-bold uppercase tracking-[.16em] text-white/25">
        <span className="flex items-center gap-2"><span className="h-[2px] w-5 bg-red-600" />Requests</span>
        <span className="flex items-center gap-2"><span className="h-[2px] w-5 bg-white/65" />Completed</span>
        <span className="flex items-center gap-2"><span className="h-px w-5 border-t border-dashed border-white/25" />Revenue</span>
      </div>
    </motion.section>
  );
}

/* ----------------------------------------------------------
   ATTENTION QUEUE
---------------------------------------------------------- */

function AttentionQueue({ requests, retrying, retryTowbook }) {
  if (!requests.length) return null;

  return (
    <motion.section variants={fadeUp} className="py-9">
      <div className="flex items-end justify-between">
        <div>
          <Eyebrow danger>Attention</Eyebrow>
          <h2 className="mt-2 text-2xl font-medium tracking-[-0.045em]">
            {requests.length} request{requests.length !== 1 ? "s" : ""} need{requests.length === 1 ? "s" : ""} intervention.
          </h2>
        </div>
        <Badge className="border-red-500/15 bg-red-500/[0.07] text-red-400">Live</Badge>
      </div>

      <div className="mt-7 divide-y divide-white/[0.055] border-y border-white/[0.055]">
        <AnimatePresence mode="popLayout">
          {requests.map((request, index) => (
            <motion.div
              layout
              key={request.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ delay: index * 0.05 }}
              className="group grid gap-4 py-5 lg:grid-cols-[130px_1fr_180px_120px]"
            >
              <div>
                <p className="text-xs font-semibold">{request.id.slice(0, 8)}</p>
                <p className="mt-1 text-[10px] text-white/25">{request._time}</p>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={request._status} />
                  {request._urgency === "urgent" && (
                    <span className="text-[9px] font-bold uppercase tracking-[.12em] text-red-400/70">urgent</span>
                  )}
                </div>
                <p className="mt-2 text-sm text-white/75">{request.name} · {request._vehicle}</p>
                <p className="mt-1 text-[11px] text-white/28">{request.towbook_error || request._route}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-[.16em] text-white/20">Route</p>
                <p className="mt-2 text-[11px] text-white/45">{request._route}</p>
              </div>
              <div className="flex items-center justify-end">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    disabled={retrying === request.id}
                    onClick={() => retryTowbook(request.id)}
                    className="bg-red-600 text-[10px] font-bold hover:bg-red-500"
                    size="sm"
                  >
                    <RefreshCw size={11} className={retrying === request.id ? "animate-spin" : ""} />
                    {retrying === request.id ? "Retrying" : "Retry"}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

/* ----------------------------------------------------------
   ACQUISITION FLOW
---------------------------------------------------------- */

function AcquisitionFlow({ data }) {
  if (!data.length) return null;
  const max = Math.max(...data.map((r) => r.requests));
  const totalRevenue = data.reduce((s, r) => s + r.revenue, 0);
  const topSource = data[0];
  const topPct = totalRevenue > 0 ? ((topSource.revenue / totalRevenue) * 100).toFixed(0) : 0;

  return (
    <motion.section variants={fadeUp} className="border-t border-white/[0.055] py-10">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <Eyebrow>Acquisition → Revenue</Eyebrow>
          <h2 className="mt-2 text-2xl font-medium tracking-[-0.045em]">Follow demand all the way to money.</h2>
        </div>
        <p className="max-w-md text-xs leading-5 text-white/30">
          {topSource.name} creates {((topSource.requests / data.reduce((s, r) => s + r.requests, 0)) * 100).toFixed(0)}% of tracked demand and {topPct}% of attributed revenue.
        </p>
      </div>

      <div className="mt-9 hidden grid-cols-[170px_1fr_120px_120px_140px] gap-5 px-2 text-[8px] font-bold uppercase tracking-[.16em] text-white/20 md:grid">
        <span>Source</span><span>Requests</span><span>Towbook</span><span>Completed</span><span className="text-right">Revenue</span>
      </div>

      <div className="mt-3 divide-y divide-white/[0.05]">
        {data.map((row, index) => (
          <motion.button
            key={row.name}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.06 }}
            whileHover={{ x: 3 }}
            className="group grid w-full gap-4 py-5 text-left md:grid-cols-[170px_1fr_120px_120px_140px] md:items-center md:gap-5"
          >
            <div>
              <p className="text-sm font-semibold text-white/78">{row.name}</p>
              <p className="mt-1 text-[10px] text-white/22">
                {row.requests > 0 ? percent((row.completed / row.requests) * 100) : "0%"} completion
              </p>
            </div>
            <div>
              <div className="relative h-7 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(row.requests / max) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-y-0 left-0 rounded-sm bg-white/[0.075] transition-colors group-hover:bg-white/[0.11]"
                />
                <div className="relative flex h-full items-center px-3 text-xs">{row.requests}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span>{row.towbook}</span>
              <ArrowRight size={11} className="text-white/18" />
            </div>
            <div className="text-sm">{row.completed}</div>
            <div className="text-left md:text-right">
              <p className="text-sm font-semibold">{money(row.revenue)}</p>
              <p className="mt-1 text-[9px] text-white/22">{row.requests > 0 ? money(row.revenue / row.requests) : "$0"} / lead</p>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.section>
  );
}

/* ----------------------------------------------------------
   LEAKAGE INTELLIGENCE
---------------------------------------------------------- */

function LeakageIntelligence({ data }) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  const lostValue = data.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) return null;

  return (
    <motion.section variants={fadeUp} className="grid gap-10 border-t border-white/[0.055] py-10 xl:grid-cols-[.7fr_1.3fr]">
      <div>
        <Eyebrow>Leakage</Eyebrow>
        <p className="mt-5 text-5xl font-medium tracking-[-0.065em]">{total}</p>
        <p className="mt-1 text-sm text-white/38">requests did not reach completion</p>
        {lostValue > 0 && (
          <div className="mt-7 border-l border-red-500/40 pl-4">
            <p className="text-[9px] uppercase tracking-[.17em] text-white/25">Estimated unrealized value</p>
            <p className="mt-2 text-2xl font-medium">{money(lostValue)}</p>
          </div>
        )}
      </div>
      <div className="space-y-6">
        {data.filter((d) => d.count > 0).map((item, index) => {
          const maxValue = Math.max(...data.map((r) => r.count), 1);
          const width = (item.count / maxValue) * 100;
          return (
            <motion.div key={item.label} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }}>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs font-medium text-white/65">{item.label}</p>
                  <p className="mt-1 text-[10px] text-white/22">{item.count} requests</p>
                </div>
                {item.value > 0 && <p className="text-sm font-semibold">{money(item.value)}</p>}
              </div>
              <div className="mt-3 h-[5px] overflow-hidden bg-white/[0.045]">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${width}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.75, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full bg-red-600/70"
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}

/* ----------------------------------------------------------
   CAMPAIGN EFFICIENCY
---------------------------------------------------------- */

function InsightBlock({ label, title, copy }) {
  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
      <p className="text-[9px] font-bold uppercase tracking-[.18em] text-red-500">{label}</p>
      <p className="mt-2 text-sm font-semibold">{title}</p>
      <p className="mt-1 max-w-sm text-xs leading-5 text-white/30">{copy}</p>
    </motion.div>
  );
}

function CampaignEfficiency({ data, insights }) {
  if (!data.length) return null;

  return (
    <motion.section variants={fadeUp} className="border-t border-white/[0.055] py-10">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <Eyebrow>Campaign efficiency</Eyebrow>
          <h2 className="mt-2 text-2xl font-medium tracking-[-0.045em]">Find scale, efficiency and waste.</h2>
        </div>
        <p className="text-[10px] uppercase tracking-[.14em] text-white/25">X = volume · Y = conversion · size = revenue</p>
      </div>

      <div className="mt-7 h-[380px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 30, right: 40, bottom: 10, left: -10 }}>
            <CartesianGrid stroke="rgba(255,255,255,.04)" strokeDasharray="3 5" />
            <XAxis type="number" dataKey="leads" name="Leads" axisLine={false} tickLine={false} tick={{ fill: "rgba(255,255,255,.24)", fontSize: 9 }} />
            <YAxis type="number" dataKey="conversion" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: "rgba(255,255,255,.24)", fontSize: 9 }} unit="%" />
            <ZAxis dataKey="revenue" range={[130, 1000]} />
            <Tooltip cursor={{ stroke: "rgba(255,255,255,.08)", strokeDasharray: "3 5" }} content={<CampaignTooltip />} />
            <Scatter data={data} fill="#dc2626" fillOpacity={0.8} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid gap-7 border-t border-white/[0.05] pt-7 md:grid-cols-3">
        {insights.scale && (
          <InsightBlock
            label="Scale"
            title={insights.scale.name}
            copy={`Highest demand with ${insights.scale.conversion.toFixed(0)}% lead-to-job conversion.`}
          />
        )}
        {insights.efficiency && (
          <InsightBlock
            label="Efficiency"
            title={insights.efficiency.name}
            copy={`Best conversion rate at ${insights.efficiency.conversion.toFixed(0)}%.`}
          />
        )}
        {insights.value && (
          <InsightBlock
            label="Value density"
            title={insights.value.name}
            copy={`${money(insights.value.revenue / insights.value.leads)} revenue per lead.`}
          />
        )}
      </div>
    </motion.section>
  );
}

/* ----------------------------------------------------------
   DEMAND HEATMAP
---------------------------------------------------------- */

function DemandHeatmap({ heatmap, peak, peakAvgTicket }) {
  function heatClass(value) {
    const classes = [
      "bg-white/[0.015]", "bg-white/[0.035]", "bg-red-950/30",
      "bg-red-900/35", "bg-red-800/45", "bg-red-700/60", "bg-red-600/85",
    ];
    return classes[value] || classes[0];
  }

  return (
    <motion.section variants={fadeUp} className="border-t border-white/[0.055] py-10">
      <div className="grid gap-10 xl:grid-cols-[1.4fr_.6fr]">
        <div>
          <Eyebrow>Demand rhythm</Eyebrow>
          <h2 className="mt-2 text-2xl font-medium tracking-[-0.045em]">When Long Island needs a truck.</h2>

          <div className="mt-8 overflow-x-auto">
            <div className="min-w-[690px]">
              <div className="grid grid-cols-[90px_repeat(8,1fr)] gap-2">
                <div />
                {HEAT_HOURS.map((hour) => (
                  <div key={hour} className="pb-2 text-center text-[9px] uppercase tracking-[.12em] text-white/22">{hour}</div>
                ))}
                {Object.entries(heatmap).map(([day, values]) => (
                  <div key={day} className="contents">
                    <div className="flex items-center text-[10px] text-white/38">{day}</div>
                    {values.map((value, index) => (
                      <motion.div
                        key={`${day}-${index}`}
                        whileHover={{ scale: 1.08, zIndex: 10 }}
                        className={`group relative h-10 rounded-[4px] ${heatClass(value)}`}
                      >
                        <div className="pointer-events-none absolute -top-9 left-1/2 z-20 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-[#101112] px-2 py-1 text-[9px] text-white/65 shadow-xl group-hover:block">
                          {day} · {HEAT_HOURS[index]}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-end">
          <div className="border-l border-red-500/40 pl-5">
            <p className="text-[9px] uppercase tracking-[.17em] text-white/25">Peak window</p>
            <p className="mt-2 text-xl font-medium">{peak.day} {peak.window}</p>
            <p className="mt-2 text-xs leading-5 text-white/30">
              {peak.count} request{peak.count !== 1 ? "s" : ""} in this window during the selected period.
            </p>
          </div>
          {peakAvgTicket > 0 && (
            <div className="mt-8 border-l border-white/10 pl-5">
              <p className="text-[9px] uppercase tracking-[.17em] text-white/25">Revenue signal</p>
              <p className="mt-2 text-xl font-medium">{money(peakAvgTicket)} avg.</p>
              <p className="mt-2 text-xs leading-5 text-white/30">Average ticket during peak window.</p>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}

/* ----------------------------------------------------------
   SERVICE INTELLIGENCE
---------------------------------------------------------- */

function ServiceIntelligence({ data }) {
  if (!data.length) return null;
  const maxRevenue = Math.max(...data.map((r) => r.revenue), 1);

  // Find highest avg-ticket service
  const highValue = [...data].filter((d) => d.avg > 0).sort((a, b) => b.avg - a.avg)[0];

  return (
    <motion.section variants={fadeUp} className="border-t border-white/[0.055] py-10">
      <div>
        <Eyebrow>Service intelligence</Eyebrow>
        <h2 className="mt-2 text-2xl font-medium tracking-[-0.045em]">Volume is not the same thing as value.</h2>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead>
            <tr className="border-b border-white/[0.055] text-[8px] font-bold uppercase tracking-[.16em] text-white/20">
              <th className="pb-4">Service</th>
              <th className="pb-4">Requests</th>
              <th className="pb-4">Completed</th>
              <th className="pb-4">Conversion</th>
              <th className="pb-4">Avg value</th>
              <th className="pb-4 text-right">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <motion.tr
                key={row.name}
                initial={{ opacity: 0, y: 5 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group border-b border-white/[0.045]"
              >
                <td className="py-5">
                  <p className="text-sm font-medium text-white/78">{row.name}</p>
                  <div className="mt-2 h-[2px] w-40 bg-white/[0.04]">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${(row.revenue / maxRevenue) * 100}%` }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="h-full bg-red-600" />
                  </div>
                </td>
                <td className="py-5 text-sm text-white/48">{row.requests}</td>
                <td className="py-5 text-sm text-white/48">{row.completed}</td>
                <td className="py-5 text-sm text-white/48">{row.requests > 0 ? percent((row.completed / row.requests) * 100) : "—"}</td>
                <td className="py-5 text-sm text-white/48">{row.avg > 0 ? money(row.avg) : "—"}</td>
                <td className="py-5 text-right text-sm font-semibold">{money(row.revenue)}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {highValue && (
        <div className="mt-7 flex items-start gap-3">
          <Sparkles size={14} className="mt-0.5 text-red-500" />
          <p className="max-w-2xl text-xs leading-5 text-white/30">
            {highValue.name} produces the highest average ticket at {money(highValue.avg)}.
          </p>
        </div>
      )}
    </motion.section>
  );
}

/* ----------------------------------------------------------
   INTEGRATION RELIABILITY
---------------------------------------------------------- */

function Reliability({ data }) {
  return (
    <motion.section variants={fadeUp} className="border-t border-white/[0.055] py-10">
      <div className="grid gap-10 xl:grid-cols-[1fr_1.4fr]">
        <div>
          <Eyebrow>Integration reliability</Eyebrow>
          <div className="mt-6 flex items-end gap-3">
            <p className="text-5xl font-medium tracking-[-0.065em]">{percent(data.overallRate)}</p>
            <span className="mb-1 text-xs text-white/30">Towbook success</span>
          </div>
          <div className="mt-7 grid grid-cols-2 gap-7">
            <div>
              <p className="text-[9px] uppercase tracking-[.16em] text-white/20">Success rate</p>
              <p className="mt-2 text-xl">{percent(data.overallRate)}</p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[.16em] text-white/20">Failed today</p>
              <p className="mt-2 text-xl text-red-400">{data.failedToday}</p>
            </div>
          </div>
          {data.topError && (
            <div className="mt-8">
              <p className="text-[9px] uppercase tracking-[.16em] text-white/20">Most common failure</p>
              <p className="mt-2 text-sm text-white/70">{data.topError.message}</p>
              <p className="mt-1 text-xs text-white/28">{data.topError.count} occurrences</p>
            </div>
          )}
        </div>

        {data.series.length > 1 && (
          <div className="h-[270px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.series} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="healthFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#dc2626" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#dc2626" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,.04)" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "rgba(255,255,255,.22)", fontSize: 9 }} />
                <YAxis domain={[80, 100]} axisLine={false} tickLine={false} tick={{ fill: "rgba(255,255,255,.20)", fontSize: 9 }} />
                <ReferenceLine y={98} stroke="rgba(255,255,255,.08)" strokeDasharray="4 4" />
                <Area type="monotone" dataKey="rate" stroke="#dc2626" strokeWidth={1.8} fill="url(#healthFill)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </motion.section>
  );
}

/* ----------------------------------------------------------
   REQUEST STREAM
---------------------------------------------------------- */

function RequestStream({ rows, query, setQuery, retrying, retryTowbook, onOpenDetail }) {
  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return rows;
    return rows.filter((row) =>
      [row.id, row.name, row.phone, row.email, row._vehicle, row._route, row._source, row._campaign, row._service, row.license_plate]
        .join(" ")
        .toLowerCase()
        .includes(search),
    );
  }, [rows, query]);

  if (!rows.length) return <EmptyState message="No requests in the selected period." />;

  return (
    <motion.section variants={fadeUp} className="border-t border-white/[0.055] py-10">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <Eyebrow>Underlying records</Eyebrow>
          <h2 className="mt-2 text-2xl font-medium tracking-[-0.045em]">Request stream</h2>
        </div>
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/22" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search requests"
            className="w-full border-white/[0.07] bg-white/[0.025] pl-9 text-xs text-white placeholder:text-white/20 sm:w-64"
          />
        </div>
      </div>

      <div className="mt-7 overflow-x-auto">
        <table className="w-full min-w-[1050px] text-left">
          <thead>
            <tr className="border-b border-white/[0.055] text-[8px] font-bold uppercase tracking-[.17em] text-white/20">
              <th className="pb-4">Request</th>
              <th className="pb-4">Vehicle / route</th>
              <th className="pb-4">Service</th>
              <th className="pb-4">Attribution</th>
              <th className="pb-4">Towbook</th>
              <th className="pb-4">Time</th>
              <th className="pb-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {filtered.map((row) => (
                <motion.tr
                  layout
                  key={row.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="group cursor-pointer border-b border-white/[0.045] transition-colors hover:bg-white/[0.012]"
                  onClick={() => onOpenDetail?.(row)}
                >
                  <td className="py-5">
                    <p className="text-sm font-medium">{row.name || "—"}</p>
                    <p className="mt-1 text-[10px] text-white/25">{row.id.slice(0, 8)} · {row.phone || "—"}</p>
                  </td>
                  <td className="py-5">
                    <p className="text-xs text-white/60">{row._vehicle}</p>
                    <p className="mt-1 text-[10px] text-white/25">{row._route}</p>
                  </td>
                  <td className="py-5 text-xs text-white/45">{row._service}</td>
                  <td className="py-5">
                    <p className="text-xs text-white/55">{row._source}</p>
                    <p className="mt-1 text-[10px] text-white/22">{row._campaign}</p>
                  </td>
                  <td className="py-5">
                    <StatusBadge status={row._status} />
                    {row._towbook && (
                      <p className="mt-1.5 text-[9px] text-white/20">{row._towbook}</p>
                    )}
                  </td>
                  <td className="py-5 text-xs text-white/28">{row._time}</td>
                  <td className="py-5 text-right" onClick={(e) => e.stopPropagation()}>
                    {row._status === "success" ? (
                      <motion.button
                        whileHover={{ x: 2 }}
                        onClick={() => onOpenDetail?.(row)}
                        className="inline-flex items-center gap-1 text-[10px] font-semibold text-white/35 hover:text-white"
                      >
                        Open <ExternalLink size={10} />
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.96 }}
                        disabled={retrying === row.id}
                        onClick={() => retryTowbook(row.id)}
                        className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-red-400 disabled:opacity-40"
                      >
                        <RefreshCw size={10} className={retrying === row.id ? "animate-spin" : ""} />
                        {retrying === row.id ? "Retrying" : "Retry Towbook"}
                      </motion.button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.section>
  );
}

/* ----------------------------------------------------------
   REQUEST DETAIL PANEL
---------------------------------------------------------- */

function RequestDetailPanel({ row, onClose, onRetryTowbook, onRetryAttio, onUpdateStatus, retrying }) {
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [jobValue, setJobValue] = useState(row.job_value || "");

  useEffect(() => {
    setEventsLoading(true);
    fetchRequestEvents(row.id)
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setEventsLoading(false));
  }, [row.id]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-start justify-end bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: 400 }}
        animate={{ x: 0 }}
        exit={{ x: 400 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="h-full w-full max-w-xl overflow-y-auto border-l border-white/[0.08] bg-[#0a0b0c] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[.22em] text-white/25">Request detail</p>
            <p className="mt-1 text-xs text-white/40 font-mono">{row.id}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-white/30 hover:bg-white/[0.05] hover:text-white">
            <X size={16} />
          </button>
        </div>

        {/* Status badges */}
        <div className="mt-6 flex items-center gap-3">
          <StatusBadge status={row._status} />
          {row.attio_status && row.attio_status !== "success" && (
            <span className="text-[9px] font-bold uppercase tracking-[.12em] text-amber-400">CRM: {row.attio_status}</span>
          )}
        </div>

        {/* Customer */}
        <Section title="Customer">
          <DetailRow label="Name" value={row.name} />
          <DetailRow label="Phone" value={row.phone} />
          <DetailRow label="Email" value={row.email} />
        </Section>

        {/* Vehicle */}
        <Section title="Vehicle">
          <DetailRow label="Vehicle" value={row._vehicle} />
          <DetailRow label="Color" value={row.vehicle_color} />
          <DetailRow label="VIN" value={row.vin} />
          <DetailRow label="Plate" value={[row.license_plate, row.license_plate_state].filter(Boolean).join(" / ")} />
          <DetailRow label="Condition" value={row.vehicle_condition} />
          <DetailRow label="Keys" value={row.keys_available} />
        </Section>

        {/* Service */}
        <Section title="Service">
          <DetailRow label="Situation" value={row.situation} />
          <DetailRow label="Service type" value={row.service_type} />
          <DetailRow label="Urgency" value={row.urgency} />
          <DetailRow label="Pickup" value={row.pickup_address} />
          <DetailRow label="Destination" value={row.destination_address} />
          <DetailRow label="Notes" value={row.notes} />
          <DetailRow label="PO #" value={row.po_number} />
        </Section>

        {/* Photos */}
        {row.photo_urls?.length > 0 && (
          <Section title="Photos">
            <div className="flex flex-wrap gap-2">
              {row.photo_urls.map((url, i) => (
                <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                  <img src={url} alt={`Photo ${i + 1}`} className="h-20 w-20 rounded border border-white/10 object-cover" />
                </a>
              ))}
            </div>
          </Section>
        )}

        {/* Attribution */}
        <Section title="Marketing attribution">
          <DetailRow label="Source" value={row.source} />
          <DetailRow label="Medium" value={row.medium} />
          <DetailRow label="Campaign" value={row.campaign} />
          <DetailRow label="Content" value={row.content} />
          <DetailRow label="Term" value={row.term} />
          <DetailRow label="GCLID" value={row.gclid} />
          <DetailRow label="FBCLID" value={row.fbclid} />
          <DetailRow label="Referrer" value={row.referrer} />
          <DetailRow label="Landing page" value={row.landing_page} />
        </Section>

        {/* Integration status */}
        <Section title="Integration status">
          <DetailRow label="Towbook status" value={row.towbook_status} />
          <DetailRow label="Towbook ref" value={row.towbook_reference} />
          <DetailRow label="Towbook attempts" value={row.towbook_attempt_count} />
          <DetailRow label="Last attempt" value={row.towbook_last_attempt_at ? new Date(row.towbook_last_attempt_at).toLocaleString() : "—"} />
          <DetailRow label="Towbook error" value={row.towbook_error} error />
          <div className="h-3" />
          <DetailRow label="Attio status" value={row.attio_status} />
          <DetailRow label="Attio record" value={row.attio_record_id} />
          <DetailRow label="Attio error" value={row.attio_error} error />
        </Section>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap gap-3">
          {row.towbook_status !== "success" && (
            <Button
              disabled={retrying === row.id}
              onClick={() => onRetryTowbook(row.id)}
              className="bg-red-600 text-[10px] font-bold hover:bg-red-500"
              size="sm"
            >
              <RefreshCw size={11} className={retrying === row.id ? "animate-spin" : ""} />
              Retry Towbook
            </Button>
          )}
          {row.attio_status === "failed" && (
            <Button
              onClick={() => onRetryAttio(row.id)}
              variant="outline"
              className="border-white/10 text-[10px] font-bold"
              size="sm"
            >
              <RefreshCw size={11} />
              Retry Attio
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-white/10 text-[10px] font-bold" size="sm">
                Set status <ChevronDown size={11} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="border-white/[0.08] bg-[#111214] text-white">
              {["new", "contacted", "dispatched", "in_progress", "completed", "cancelled"].map((s) => (
                <DropdownMenuItem key={s} onClick={() => onUpdateStatus(row.id, { status: s })}>
                  {s.replace("_", " ")}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Job value */}
        <div className="mt-5 flex items-end gap-3">
          <label className="flex-1">
            <span className="mb-1 block text-[9px] font-bold uppercase tracking-[.16em] text-white/25">Job value ($)</span>
            <Input
              type="number"
              value={jobValue}
              onChange={(e) => setJobValue(e.target.value)}
              className="border-white/[0.07] bg-white/[0.025] text-xs text-white"
              placeholder="0"
            />
          </label>
          <Button
            onClick={() => onUpdateStatus(row.id, { job_value: parseFloat(jobValue) || 0 })}
            variant="outline"
            className="border-white/10 text-[10px] font-bold"
            size="sm"
          >
            Save
          </Button>
        </div>

        {/* Events log */}
        <Section title="Activity log">
          {eventsLoading ? (
            <p className="text-xs text-white/20">Loading…</p>
          ) : events.length === 0 ? (
            <p className="text-xs text-white/20">No events recorded.</p>
          ) : (
            <div className="space-y-3">
              {events.map((evt) => (
                <div key={evt.id} className="flex items-start gap-3">
                  <div className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white/15" />
                  <div>
                    <p className="text-xs text-white/55">{evt.message || evt.event_type}</p>
                    <p className="mt-0.5 text-[10px] text-white/20">{new Date(evt.created_at).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>
      </motion.div>
    </motion.div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mt-6 border-t border-white/[0.06] pt-5">
      <p className="mb-3 text-[9px] font-black uppercase tracking-[.20em] text-white/25">{title}</p>
      {children}
    </div>
  );
}

function DetailRow({ label, value, error = false }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex justify-between gap-4 py-1.5 text-xs">
      <span className="text-white/30">{label}</span>
      <span className={`text-right ${error ? "text-red-400" : "text-white/65"}`}>{String(value)}</span>
    </div>
  );
}

/* ----------------------------------------------------------
   MAIN PAGE
---------------------------------------------------------- */

export default function AdminDashboardPage() {
  const { signOut } = useAuth();
  const [dateRange, setDateRange] = useState("Last 30 days");
  const [query, setQuery] = useState("");
  const [retrying, setRetrying] = useState(null);
  const [detailRow, setDetailRow] = useState(null);

  // ===== REAL DATA from Supabase =====
  const { requests, loading, error, refetch, setRequests } = useServiceRequests(dateRange);

  // Derived analytics — all pure computations of real data
  const metrics = useDashboardMetrics(requests);
  const pulseData = usePulseData(requests);
  const pulseInsight = usePulseInsight(pulseData);
  const sourceFlow = useSourceFlow(requests);
  const leakageData = useLeakageData(requests);
  const campaignData = useCampaignData(requests);
  const campaignInsights = useCampaignInsights(campaignData);
  const { heatmap, peak, peakAvgTicket } = useDemandHeatmap(requests);
  const serviceData = useServiceData(requests);
  const reliabilityData = useReliabilityData(requests);
  const systemHealth = useSystemHealth(requests);
  const requestRows = useRequestStream(requests);

  // ===== RETRY HANDLERS (real API calls) =====
  const retryTowbook = useCallback(async (id) => {
    setRetrying(id);
    try {
      await retryTowbookRequest(id);
      await refetch();
    } catch (err) {
      console.error("Towbook retry failed:", err);
    } finally {
      setRetrying(null);
    }
  }, [refetch]);

  const retryAttio = useCallback(async (id) => {
    try {
      await retryAttioRequest(id);
      await refetch();
    } catch (err) {
      console.error("Attio retry failed:", err);
    }
  }, [refetch]);

  const handleUpdateStatus = useCallback(async (id, updates) => {
    try {
      await updateServiceRequest(id, updates);
      await refetch();
      // Also update the detail panel's row
      setDetailRow((prev) => prev?.id === id ? { ...prev, ...updates } : prev);
    } catch (err) {
      console.error("Update failed:", err);
    }
  }, [refetch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08090a] text-white">
        <LoadingState />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08090a] text-white selection:bg-red-600/35">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-white/[0.055] bg-[#08090a]/90 backdrop-blur-2xl">
        <div className="mx-auto flex h-[68px] max-w-[1700px] items-center justify-between px-5 lg:px-8">
          <div className="flex items-center gap-4">
            <img src="/images/logo2.png" alt="Hammer Head Towing" className="h-8 w-auto object-contain" />
            <div className="hidden h-6 w-px bg-white/[0.08] sm:block" />
            <div className="hidden sm:block">
              <p className="text-[8px] font-black uppercase tracking-[.22em] text-white/22">Intelligence</p>
              <p className="mt-0.5 text-xs font-medium text-white/65">Operations Command</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ opacity: [0.75, 1, 0.75] }}
              transition={{ duration: 2.4, repeat: Infinity }}
              className="hidden items-center gap-2 rounded-full border border-emerald-500/10 bg-emerald-500/[0.045] px-3 py-1.5 text-[9px] font-medium text-emerald-400 md:flex"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Systems live
            </motion.div>
            <Button variant="ghost" size="icon" className="text-white/35 hover:bg-white/[0.04] hover:text-white" onClick={refetch}>
              <RefreshCw size={15} />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 text-[10px] text-white/55 hover:bg-white/[0.04] hover:text-white">
                  <span className="grid h-6 w-6 place-items-center rounded-md bg-red-600 text-[9px] font-black">HH</span>
                  Admin
                  <ChevronDown size={11} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="border-white/[0.08] bg-[#111214] text-white">
                <DropdownMenuItem onClick={signOut}>
                  <LogOut size={12} className="mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <motion.main
        variants={stagger}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-[1700px] px-5 pb-20 lg:px-8"
      >
        {/* ERROR STATE */}
        {error && (
          <div className="mt-6 rounded-lg border border-red-500/20 bg-red-500/[0.06] px-5 py-4 text-sm text-red-400">
            <AlertTriangle size={14} className="mb-1 inline" /> Failed to load data: {error}
            <button onClick={refetch} className="ml-3 underline">Retry</button>
          </div>
        )}

        {/* COMMAND STATE */}
        <motion.section variants={fadeUp} className="pt-9 pb-8">
          <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
            <div>
              <div className="flex items-center gap-2">
                <Gauge size={12} className="text-red-500" />
                <Eyebrow>Live state</Eyebrow>
              </div>
              <h1 className="mt-3 text-3xl font-medium tracking-[-0.055em] sm:text-4xl">Hammer Head Intelligence</h1>
              <p className="mt-2 text-xs text-white/28">Understand demand, operations, acquisition and revenue as one system.</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <button className="flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2 text-[10px] text-white/50 transition hover:bg-white/[0.04] hover:text-white">
                  <Clock3 size={12} /> {dateRange} <ChevronDown size={11} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="border-white/[0.08] bg-[#111214] text-white">
                {["Today", "Last 7 days", "Last 30 days", "Last 90 days"].map((range) => (
                  <DropdownMenuItem key={range} onClick={() => setDateRange(range)}>{range}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <motion.div variants={stagger} className="mt-9 grid gap-6 border-y border-white/[0.055] py-6 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label="Requests" value={metrics.total} delta={metrics.total > 0 ? `${metrics.tbSuccess} sent` : null} positive />
            <Metric label="Completed" value={metrics.completed} delta={metrics.total > 0 ? percent((metrics.completed / metrics.total) * 100) : null} positive />
            <Metric label="Attributed revenue" value={moneyCompact(metrics.revenue)} positive />
            <Metric label="Need action" value={metrics.attention.length} delta={metrics.attentionDelta} danger={metrics.attention.length > 0} />
          </motion.div>

          <div className="mt-4 flex flex-wrap gap-x-7 gap-y-2 text-[9px] font-medium uppercase tracking-[.12em] text-white/22">
            <span className="flex items-center gap-2">
              <span className={`h-1.5 w-1.5 rounded-full ${error ? "bg-red-400" : "bg-emerald-400"}`} />
              {error ? "Supabase error" : "Supabase healthy"}
            </span>
            <span className="flex items-center gap-2">
              <span className={`h-1.5 w-1.5 rounded-full ${parseFloat(systemHealth.tbRate) >= 95 ? "bg-emerald-400" : "bg-amber-400"}`} />
              Towbook {systemHealth.tbRate}%
            </span>
            <span>Last request {systemHealth.lastAgo}</span>
          </div>
        </motion.section>

        <BusinessPulse data={pulseData} insight={pulseInsight} />

        <AttentionQueue
          requests={requestRows.filter((r) => metrics.attention.some((a) => a.id === r.id))}
          retrying={retrying}
          retryTowbook={retryTowbook}
        />

        <AcquisitionFlow data={sourceFlow} />
        <LeakageIntelligence data={leakageData} />
        <CampaignEfficiency data={campaignData} insights={campaignInsights} />
        <DemandHeatmap heatmap={heatmap} peak={peak} peakAvgTicket={peakAvgTicket} />
        <ServiceIntelligence data={serviceData} />
        <Reliability data={reliabilityData} />

        <RequestStream
          rows={requestRows}
          query={query}
          setQuery={setQuery}
          retrying={retrying}
          retryTowbook={retryTowbook}
          onOpenDetail={setDetailRow}
        />
      </motion.main>

      {/* REQUEST DETAIL SLIDE-OUT */}
      <AnimatePresence>
        {detailRow && (
          <RequestDetailPanel
            row={detailRow}
            onClose={() => setDetailRow(null)}
            onRetryTowbook={retryTowbook}
            onRetryAttio={retryAttio}
            onUpdateStatus={handleUpdateStatus}
            retrying={retrying}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
