/**
 * useAdminData.js
 *
 * Every piece of data the admin dashboard consumes lives here.
 * Each hook takes the raw service_requests[] array and derives
 * a specific dashboard section's data in real time — no mock data.
 *
 * The single source of truth is the requests array fetched from
 * Supabase.  Every chart, metric, table, and heatmap is a pure
 * derivation of that array.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "./supabase";

/* ==========================================================
   HELPERS
   ========================================================== */

function rangeToDate(range) {
  const now = new Date();
  switch (range) {
    case "Today":
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    case "Last 7 days":
      return new Date(now.getTime() - 7 * 86_400_000);
    case "Last 30 days":
      return new Date(now.getTime() - 30 * 86_400_000);
    case "Last 90 days":
      return new Date(now.getTime() - 90 * 86_400_000);
    default:
      return new Date(now.getTime() - 30 * 86_400_000);
  }
}

/** Shortened month+day label: "Aug 5" */
function shortDate(d) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** HH:MM AM/PM */
function clockTime(d) {
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function val(r) {
  return r.job_value ? parseFloat(r.job_value) : 0;
}

/* ==========================================================
   1.  CORE FETCH — pulls service_requests within a date range
   ========================================================== */

export function useServiceRequests(dateRange) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const since = rangeToDate(dateRange).toISOString();
      const { data, error: err } = await supabase
        .from("service_requests")
        .select("*")
        .gte("created_at", since)
        .order("created_at", { ascending: false });
      if (err) throw err;
      setRequests(data || []);
    } catch (err) {
      console.error("Failed to load requests:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => { load(); }, [load]);

  return { requests, loading, error, refetch: load, setRequests };
}

/* ==========================================================
   2.  TOP-LEVEL METRICS — the 4 hero numbers
   ========================================================== */

export function useDashboardMetrics(requests) {
  return useMemo(() => {
    const total = requests.length;
    const completed = requests.filter((r) => r.status === "completed").length;
    const revenue = requests.reduce((s, r) => s + val(r), 0);

    const tbFailed = requests.filter((r) => r.towbook_status === "failed").length;
    const tbPending = requests.filter((r) => r.towbook_status === "pending").length;
    const tbSuccess = requests.filter((r) => r.towbook_status === "success").length;
    const attioFailed = requests.filter((r) => r.attio_status === "failed").length;

    // Anything that needs admin attention
    const attention = requests.filter(
      (r) =>
        r.towbook_status === "failed" ||
        r.attio_status === "failed" ||
        // pending for > 30 min
        (r.towbook_status === "pending" &&
          new Date() - new Date(r.created_at) > 30 * 60_000),
    );

    const attentionDelta = [];
    const failed = attention.filter((r) => r.towbook_status === "failed").length;
    const stale = attention.filter(
      (r) => r.towbook_status === "pending" && new Date() - new Date(r.created_at) > 30 * 60_000
    ).length;
    const attioBroken = attention.filter((r) => r.attio_status === "failed").length;
    if (failed) attentionDelta.push(`${failed} failed`);
    if (stale) attentionDelta.push(`${stale} stale`);
    if (attioBroken) attentionDelta.push(`${attioBroken} CRM`);

    return {
      total,
      completed,
      revenue,
      tbFailed,
      tbPending,
      tbSuccess,
      attioFailed,
      attention,
      attentionDelta: attentionDelta.join(" · ") || "All clear",
    };
  }, [requests]);
}

/* ==========================================================
   3.  BUSINESS PULSE — time-series for the area chart
   ========================================================== */

export function usePulseData(requests) {
  return useMemo(() => {
    const map = {};
    for (const r of requests) {
      const d = new Date(r.created_at);
      const key = shortDate(d);
      if (!map[key]) map[key] = { date: key, requests: 0, completed: 0, revenue: 0, _ts: d.getTime() };
      map[key].requests++;
      if (r.status === "completed") map[key].completed++;
      map[key].revenue += val(r);
    }
    return Object.values(map).sort((a, b) => a._ts - b._ts);
  }, [requests]);
}

/** Derived insight sentence for the pulse header. */
export function usePulseInsight(pulseData) {
  return useMemo(() => {
    if (pulseData.length < 4) return { trend: 0, sentence: "Not enough data yet." };
    const half = Math.floor(pulseData.length / 2);
    const firstHalf = pulseData.slice(0, half);
    const secondHalf = pulseData.slice(half);
    const avg = (arr) => arr.reduce((s, d) => s + d.requests, 0) / (arr.length || 1);
    const a1 = avg(firstHalf);
    const a2 = avg(secondHalf);
    const trend = a1 > 0 ? ((a2 - a1) / a1) * 100 : 0;
    const dir = trend >= 0 ? "up" : "down";
    return {
      trend,
      sentence:
        Math.abs(trend) < 2
          ? "Demand is holding steady."
          : `Demand is trending ${dir} ${Math.abs(trend).toFixed(0)}% over the period.`,
    };
  }, [pulseData]);
}

/* ==========================================================
   4.  ACQUISITION FLOW  (Source → Towbook → Completed → Revenue)
   ========================================================== */

export function useSourceFlow(requests) {
  return useMemo(() => {
    const map = {};
    for (const r of requests) {
      const src = r.source || "Direct";
      if (!map[src]) map[src] = { name: src, requests: 0, towbook: 0, completed: 0, revenue: 0 };
      map[src].requests++;
      if (r.towbook_status === "success") map[src].towbook++;
      if (r.status === "completed") map[src].completed++;
      map[src].revenue += val(r);
    }
    return Object.values(map).sort((a, b) => b.requests - a.requests);
  }, [requests]);
}

/* ==========================================================
   5.  LEAKAGE INTELLIGENCE
   ========================================================== */

export function useLeakageData(requests) {
  return useMemo(() => {
    const tbFail = requests.filter((r) => r.towbook_status === "failed");
    const neverDisp = requests.filter(
      (r) => r.towbook_status === "pending" && r.status !== "cancelled",
    );
    const cancelled = requests.filter((r) => r.status === "cancelled");
    const other = requests.filter(
      (r) =>
        r.status !== "completed" &&
        r.status !== "cancelled" &&
        r.towbook_status !== "failed" &&
        r.towbook_status !== "pending",
    );

    const sum = (arr) => arr.reduce((s, r) => s + val(r), 0);

    return [
      { label: "Towbook failures", count: tbFail.length, value: sum(tbFail) },
      { label: "Never dispatched", count: neverDisp.length, value: sum(neverDisp) },
      { label: "Cancelled", count: cancelled.length, value: sum(cancelled) },
      { label: "Other incomplete", count: other.length, value: sum(other) },
    ];
  }, [requests]);
}

/* ==========================================================
   6.  CAMPAIGN EFFICIENCY — scatter plot data
   ========================================================== */

export function useCampaignData(requests) {
  return useMemo(() => {
    const map = {};
    for (const r of requests) {
      const camp = r.campaign || "—";
      const src = r.source || "Direct";
      const key = `${camp}__${src}`;
      if (!map[key]) map[key] = { name: camp, source: src, leads: 0, completed: 0, revenue: 0 };
      map[key].leads++;
      if (r.status === "completed") map[key].completed++;
      map[key].revenue += val(r);
    }
    return Object.values(map)
      .map((c) => ({ ...c, conversion: c.leads > 0 ? (c.completed / c.leads) * 100 : 0 }))
      .filter((c) => c.leads >= 1)
      .sort((a, b) => b.leads - a.leads);
  }, [requests]);
}

/** Top-3 campaign insight blocks (scale / efficiency / value density). */
export function useCampaignInsights(campaigns) {
  return useMemo(() => {
    if (!campaigns.length) return { scale: null, efficiency: null, value: null };

    const sorted = [...campaigns];

    // Scale = most leads with decent conversion
    const scale = sorted.filter((c) => c.conversion > 50).sort((a, b) => b.leads - a.leads)[0] || sorted[0];

    // Efficiency = best conversion (min 2 leads)
    const efficiency = sorted.filter((c) => c.leads >= 2).sort((a, b) => b.conversion - a.conversion)[0];

    // Value density = highest revenue per lead
    const value = sorted.filter((c) => c.leads >= 2).sort((a, b) => (b.revenue / b.leads) - (a.revenue / a.leads))[0];

    return { scale, efficiency, value };
  }, [campaigns]);
}

/* ==========================================================
   7.  DEMAND HEATMAP — day-of-week × time-of-day
   ========================================================== */

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const HEAT_HOURS = ["12a", "3a", "6a", "9a", "12p", "3p", "6p", "9p"];

export { HEAT_HOURS };

export function useDemandHeatmap(requests) {
  return useMemo(() => {
    // 7 days × 8 three-hour buckets
    const grid = {};
    for (const day of DAYS) grid[day] = new Array(8).fill(0);

    for (const r of requests) {
      const d = new Date(r.created_at);
      const day = DAYS[d.getDay()];
      const bucket = Math.floor(d.getHours() / 3); // 0-7
      grid[day][bucket]++;
    }

    // Normalize to 0-6 intensity
    const flat = Object.values(grid).flat();
    const max = Math.max(...flat, 1);
    const normalized = {};
    for (const day of DAYS) {
      normalized[day] = grid[day].map((v) => Math.round((v / max) * 6));
    }

    // Peak window
    let peakDay = "", peakBucket = 0, peakVal = 0;
    for (const day of DAYS) {
      for (let b = 0; b < 8; b++) {
        if (grid[day][b] > peakVal) {
          peakVal = grid[day][b];
          peakDay = day;
          peakBucket = b;
        }
      }
    }

    const bucketLabels = ["12–3 AM", "3–6 AM", "6–9 AM", "9 AM–12 PM", "12–3 PM", "3–6 PM", "6–9 PM", "9 PM–12 AM"];

    // Revenue for peak window
    const peakRevenue = requests.filter((r) => {
      const d = new Date(r.created_at);
      return DAYS[d.getDay()] === peakDay && Math.floor(d.getHours() / 3) === peakBucket;
    });
    const peakAvgTicket = peakRevenue.length
      ? peakRevenue.reduce((s, r) => s + val(r), 0) / peakRevenue.filter((r) => val(r) > 0).length || 0
      : 0;

    return {
      heatmap: normalized,
      peak: { day: peakDay, window: bucketLabels[peakBucket], count: peakVal },
      peakAvgTicket,
    };
  }, [requests]);
}

/* ==========================================================
   8.  SERVICE INTELLIGENCE — breakdown by service type
   ========================================================== */

export function useServiceData(requests) {
  return useMemo(() => {
    const map = {};
    for (const r of requests) {
      const svc = r.service_type || r.situation || "Other";
      if (!map[svc]) map[svc] = { name: svc, requests: 0, completed: 0, revenue: 0 };
      map[svc].requests++;
      if (r.status === "completed") map[svc].completed++;
      map[svc].revenue += val(r);
    }
    return Object.values(map)
      .map((s) => ({ ...s, avg: s.completed > 0 ? s.revenue / s.completed : 0 }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [requests]);
}

/* ==========================================================
   9.  INTEGRATION RELIABILITY — success-rate time series
   ========================================================== */

export function useReliabilityData(requests) {
  return useMemo(() => {
    // Group by day, compute towbook success rate
    const map = {};
    for (const r of requests) {
      const d = new Date(r.created_at);
      const key = shortDate(d);
      if (!map[key]) map[key] = { date: key, total: 0, success: 0, _ts: d.getTime() };
      if (r.towbook_status === "success" || r.towbook_status === "failed") {
        map[key].total++;
        if (r.towbook_status === "success") map[key].success++;
      }
    }

    const series = Object.values(map)
      .sort((a, b) => a._ts - b._ts)
      .map((d) => ({ date: d.date, rate: d.total > 0 ? (d.success / d.total) * 100 : 100 }));

    // Aggregate stats
    const totalAttempts = requests.filter((r) => r.towbook_status === "success" || r.towbook_status === "failed").length;
    const totalSuccess = requests.filter((r) => r.towbook_status === "success").length;
    const overallRate = totalAttempts > 0 ? (totalSuccess / totalAttempts) * 100 : 100;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const failedToday = requests.filter(
      (r) => r.towbook_status === "failed" && new Date(r.created_at) >= todayStart,
    ).length;

    // Most common error
    const errorMap = {};
    for (const r of requests) {
      if (r.towbook_error) {
        const key = r.towbook_error.slice(0, 80);
        errorMap[key] = (errorMap[key] || 0) + 1;
      }
    }
    const topError = Object.entries(errorMap).sort((a, b) => b[1] - a[1])[0];

    return {
      series,
      overallRate,
      failedToday,
      topError: topError ? { message: topError[0], count: topError[1] } : null,
    };
  }, [requests]);
}

/* ==========================================================
   10. SYSTEM HEALTH STATUS — the 3 status pills
   ========================================================== */

export function useSystemHealth(requests) {
  return useMemo(() => {
    const tbAttempts = requests.filter((r) => r.towbook_status === "success" || r.towbook_status === "failed").length;
    const tbSuccess = requests.filter((r) => r.towbook_status === "success").length;
    const tbRate = tbAttempts > 0 ? ((tbSuccess / tbAttempts) * 100).toFixed(1) : "100.0";

    // Last request timestamp
    const lastReq = requests[0]; // already sorted desc
    let lastAgo = "No requests";
    if (lastReq) {
      const diffMs = Date.now() - new Date(lastReq.created_at).getTime();
      const diffMin = Math.floor(diffMs / 60_000);
      if (diffMin < 1) lastAgo = "Just now";
      else if (diffMin < 60) lastAgo = `${diffMin}m ago`;
      else lastAgo = `${Math.floor(diffMin / 60)}h ago`;
    }

    return { tbRate, lastAgo };
  }, [requests]);
}

/* ==========================================================
   11. REQUEST STREAM — shape raw rows for the table
   ========================================================== */

export function useRequestStream(requests) {
  return useMemo(() => {
    return requests.map((r) => ({
      // pass through everything from DB
      ...r,
      // computed display fields the table expects
      _vehicle: [r.vehicle_year, r.vehicle_make, r.vehicle_model].filter(Boolean).join(" ") || "—",
      _route: [r.pickup_address, r.destination_address].filter(Boolean).join(" → ") || "—",
      _service: r.service_type || r.situation || "—",
      _source: r.source || "Direct",
      _campaign: r.campaign || "—",
      _time: clockTime(new Date(r.created_at)),
      _status: r.towbook_status || "pending",
      _towbook: r.towbook_reference || "",
      _revenue: val(r),
      _urgency: (r.urgency || "").toLowerCase().includes("immediate") ? "urgent" : "standard",
    }));
  }, [requests]);
}

/* ==========================================================
   12. RETRY / UPDATE ACTIONS (call Netlify functions)
   ========================================================== */

async function getToken() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || "";
}

export async function retryTowbookRequest(requestId) {
  const token = await getToken();
  const res = await fetch("/.netlify/functions/retry-towbook", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ requestId }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Retry failed");
  return json;
}

export async function retryAttioRequest(requestId) {
  const token = await getToken();
  const res = await fetch("/.netlify/functions/retry-attio", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ requestId }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Retry failed");
  return json;
}

export async function updateServiceRequest(requestId, updates) {
  const token = await getToken();
  const res = await fetch("/.netlify/functions/update-request", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ requestId, updates }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Update failed");
  return json;
}

export async function fetchRequestEvents(requestId) {
  const { data, error } = await supabase
    .from("request_events")
    .select("*")
    .eq("request_id", requestId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}
