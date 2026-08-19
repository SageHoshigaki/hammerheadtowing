const STORAGE_KEY = "hh_attribution";
const PARAMS = ["utm_source","utm_medium","utm_campaign","utm_content","utm_term","gclid","fbclid"];

export function captureAttribution() {
  try {
    const url = new URL(window.location.href);
    const incoming = {};
    let hasParam = false;
    for (const key of PARAMS) {
      const value = url.searchParams.get(key);
      if (value) { incoming[key] = value; hasParam = true; }
    }
    if (hasParam) {
      incoming.referrer = document.referrer || "";
      incoming.landing_page = window.location.pathname + window.location.search;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(incoming));
    } else if (!sessionStorage.getItem(STORAGE_KEY)) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
        referrer: document.referrer || "",
        landing_page: window.location.pathname + window.location.search,
      }));
    }
  } catch { /* private browsing */ }
}

function normalizeSource(raw) {
  if (!raw) return "Direct";
  const s = raw.toLowerCase();
  if (s === "google" || s === "google_ads" || s === "googleads") return "Google Ads";
  if (s === "facebook" || s === "fb" || s === "meta" || s === "instagram") return "Meta Ads";
  if (s === "bing") return "Bing Organic";
  return raw;
}

export function getAttribution() {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    const data = stored ? JSON.parse(stored) : {};
    let source = normalizeSource(data.utm_source);
    if (!data.utm_source && data.gclid) source = "Google Ads";
    if (!data.utm_source && data.fbclid) source = "Meta Ads";
    if (!data.utm_source && !data.gclid && !data.fbclid && data.referrer) {
      const ref = data.referrer.toLowerCase();
      if (ref.includes("google.")) source = "Google Organic";
      else if (ref.includes("bing.")) source = "Bing Organic";
      else if (ref.includes("facebook.") || ref.includes("instagram.")) source = "Meta Ads";
      else source = "Referral";
    }
    return {
      source, medium: data.utm_medium || "", campaign: data.utm_campaign || "",
      content: data.utm_content || "", term: data.utm_term || "",
      gclid: data.gclid || "", fbclid: data.fbclid || "",
      referrer: data.referrer || "", landing_page: data.landing_page || "",
      user_agent: navigator.userAgent || "",
    };
  } catch {
    return { source:"Direct",medium:"",campaign:"",content:"",term:"",gclid:"",fbclid:"",referrer:"",landing_page:"",user_agent:navigator.userAgent||"" };
  }
}
