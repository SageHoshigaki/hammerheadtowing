// src/pages/LiveLocationPage.jsx

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import {
  ArrowUpRight,
  Check,
  Crosshair,
  LocateFixed,
  MapPin,
  Navigation,
  Phone,
  Radio,
  ShieldCheck,
  X,
} from "lucide-react";

const STATUS = {
  IDLE: "idle",
  LOCATING: "locating",
  LIVE: "live",
  STOPPED: "stopped",
  ERROR: "error",
};

function formatCoordinate(value) {
  return typeof value === "number" ? value.toFixed(6) : "—";
}

function LocationRadar({ status }) {
  const active = status === STATUS.LOCATING || status === STATUS.LIVE;
  const isLive = status === STATUS.LIVE;

  return (
    <div className="relative grid aspect-square w-full place-items-center overflow-hidden border border-white/10 bg-[#070707]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(211,19,26,0.16),transparent_55%)]" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.16)_1px,transparent_1px)] [background-size:38px_38px]" />

      <div className="absolute inset-[8%] rounded-full border border-white/10" />
      <div className="absolute inset-[21%] rounded-full border border-white/10" />
      <div className="absolute inset-[34%] rounded-full border border-white/10" />

      <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
      <div className="absolute left-0 top-1/2 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {active && (
        <>
          <motion.div
            className="absolute h-20 w-20 rounded-full border border-[#D3131A]/70"
            initial={{ scale: 0.7, opacity: 0.8 }}
            animate={{ scale: 4.4, opacity: 0 }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />

          <motion.div
            className="absolute h-20 w-20 rounded-full border border-[#D3131A]/40"
            initial={{ scale: 0.7, opacity: 0.7 }}
            animate={{ scale: 4.4, opacity: 0 }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.75,
            }}
          />
        </>
      )}

      <motion.div
        className="relative z-10 grid h-24 w-24 place-items-center border border-[#D3131A]/50 bg-[#D3131A] text-white shadow-[0_0_60px_rgba(211,19,26,0.32)]"
        animate={active ? { scale: [1, 1.035, 1] } : { scale: 1 }}
        transition={{
          duration: 1.6,
          repeat: active ? Infinity : 0,
        }}
      >
        <LocateFixed className="h-9 w-9" strokeWidth={1.6} />
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between border-t border-white/10 bg-black/70 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 ${
              isLive
                ? "bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.85)]"
                : status === STATUS.LOCATING
                  ? "bg-[#D3131A] shadow-[0_0_14px_rgba(211,19,26,0.8)]"
                  : "bg-white/25"
            }`}
          />

          <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/55">
            {isLive
              ? "Signal locked"
              : status === STATUS.LOCATING
                ? "Acquiring signal"
                : "System standby"}
          </span>
        </div>

        <span className="font-mono text-[10px] tracking-[0.2em] text-white/25">
          HH-GPS-03
        </span>
      </div>
    </div>
  );
}

function Stat({ label, value, icon: Icon }) {
  return (
    <div className="border border-white/10 bg-white/[0.025] p-4">
      <div className="mb-5 flex items-center justify-between">
        <span className="text-[9px] font-bold uppercase tracking-[0.24em] text-white/35">
          {label}
        </span>

        <Icon className="h-4 w-4 text-[#D3131A]" strokeWidth={1.6} />
      </div>

      <p className="font-mono text-sm text-white">{value}</p>
    </div>
  );
}

export default function LiveLocationPage({
  logoSrc = "/images/hammerhead-logo.png",
  phoneNumber = "(631) 555-0199",
  onLocationChange,
  onContinue,
}) {
  const rootRef = useRef(null);
  const watchIdRef = useRef(null);

  const [status, setStatus] = useState(STATUS.IDLE);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: {
          ease: "power4.out",
        },
      });

      timeline
        .from("[data-header]", {
          y: -24,
          opacity: 0,
          duration: 0.8,
        })
        .from(
          "[data-kicker]",
          {
            x: -28,
            opacity: 0,
            duration: 0.7,
          },
          "-=0.35",
        )
        .from(
          "[data-title-line]",
          {
            y: 70,
            opacity: 0,
            stagger: 0.12,
            duration: 1,
          },
          "-=0.35",
        )
        .from(
          "[data-copy]",
          {
            y: 24,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.55",
        )
        .from(
          "[data-trust]",
          {
            y: 18,
            opacity: 0,
            stagger: 0.1,
            duration: 0.65,
          },
          "-=0.45",
        )
        .from(
          "[data-panel]",
          {
            x: 50,
            opacity: 0,
            duration: 1,
          },
          "-=0.8",
        );
    }, rootRef);

    return () => context.revert();
  }, []);

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const mapsUrl = useMemo(() => {
    if (!location) return "";

    return `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
  }, [location]);

  function startSharing() {
    setError("");

    if (!("geolocation" in navigator)) {
      setStatus(STATUS.ERROR);
      setError("This device does not support location sharing.");
      return;
    }

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    setStatus(STATUS.LOCATING);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const nextLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: Math.round(position.coords.accuracy),
          timestamp: position.timestamp,
        };

        setLocation(nextLocation);
        setStatus(STATUS.LIVE);
        onLocationChange?.(nextLocation);
      },
      (geoError) => {
        setStatus(STATUS.ERROR);

        if (geoError.code === geoError.PERMISSION_DENIED) {
          setError(
            "Location access was denied. Enable location permission in your browser or enter your pickup address manually.",
          );
          return;
        }

        if (geoError.code === geoError.POSITION_UNAVAILABLE) {
          setError(
            "Your current position is unavailable. Move to an open area or enter a nearby landmark.",
          );
          return;
        }

        if (geoError.code === geoError.TIMEOUT) {
          setError(
            "The location request timed out. Try again or enter your pickup address manually.",
          );
          return;
        }

        setError("Hammer Head dispatch could not access your location.");
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 3000,
      },
    );
  }

  function stopSharing() {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    setStatus(STATUS.STOPPED);
  }

  return (
    <main
      ref={rootRef}
      className="relative min-h-screen overflow-hidden bg-[#050505] text-[#F5F3EE]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_16%,rgba(211,19,26,0.16),transparent_31%),radial-gradient(circle_at_14%_88%,rgba(255,255,255,0.04),transparent_28%)]" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.055] [background-image:linear-gradient(rgba(255,255,255,.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.16)_1px,transparent_1px)] [background-size:64px_64px]" />

      <div className="pointer-events-none absolute left-0 top-0 h-full w-[3px] bg-[#D3131A]" />

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-84px)] max-w-[1480px] items-center gap-12 px-5 py-14 md:px-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:py-20">
        <div>
          <div
            data-kicker
            className="mb-8 flex items-center gap-3 border-l-2 border-[#D3131A] pl-4"
          >
            <Radio className="h-4 w-4 text-[#D3131A]" />

            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/40">
              Recovery capability / live dispatch
            </span>
          </div>

          <div className="overflow-hidden">
            <h1
              data-title-line
              className="text-5xl font-semibold uppercase leading-[0.86] tracking-[-0.065em] sm:text-6xl lg:text-[5.7rem]"
            >
              Share your
            </h1>
          </div>

          <div className="overflow-hidden">
            <h1
              data-title-line
              className="text-5xl font-semibold uppercase leading-[0.86] tracking-[-0.065em] text-[#D3131A] sm:text-6xl lg:text-[5.7rem]"
            >
              exact location.
            </h1>
          </div>

          <p
            data-copy
            className="mt-8 max-w-xl border-l border-white/15 pl-5 text-base leading-7 text-white/52 sm:text-lg"
          >
            Send Hammer Head dispatch your live position so the nearest recovery
            unit can locate you faster and respond with the right equipment.
          </p>

          <div className="mt-9 grid max-w-xl gap-px border border-white/10 bg-white/10 sm:grid-cols-2">
            <div
              data-trust
              className="flex items-center gap-3 bg-[#080808] px-5 py-4"
            >
              <ShieldCheck className="h-4 w-4 text-[#D3131A]" />

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">
                  Data use
                </p>

                <p className="mt-1 text-xs text-white/70">
                  Service request only
                </p>
              </div>
            </div>

            <div
              data-trust
              className="flex items-center gap-3 bg-[#080808] px-5 py-4"
            >
              <Navigation className="h-4 w-4 text-[#D3131A]" />

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">
                  Tracking
                </p>

                <p className="mt-1 text-xs text-white/70">High-accuracy GPS</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4 text-[8px] font-bold uppercase tracking-[0.28em] text-white/25">
            <span>Field Operations / Long Island</span>
            <span>HH—03</span>
          </div>
        </div>

        <div
          data-panel
          className="relative border border-white/10 bg-[#0B0B0B]/95 p-4 shadow-[0_30px_100px_rgba(0,0,0,0.7)] backdrop-blur-xl sm:p-6"
        >
          <div className="absolute left-0 top-0 h-[3px] w-32 bg-[#D3131A]" />

          <div className="absolute right-0 top-0 h-px w-1/3 bg-gradient-to-l from-white/30 to-transparent" />

          <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <LocationRadar status={status} />

            <div className="flex min-h-full flex-col">
              <div className="mb-6 flex items-start justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/30">
                    Location status
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold uppercase tracking-[-0.03em]">
                    {status === STATUS.LIVE
                      ? "Position secured"
                      : status === STATUS.LOCATING
                        ? "Locating device"
                        : status === STATUS.STOPPED
                          ? "Sharing paused"
                          : status === STATUS.ERROR
                            ? "Location unavailable"
                            : "Ready to connect"}
                  </h2>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={status}
                    initial={{ scale: 0.75, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.75, opacity: 0 }}
                    className={`grid h-11 w-11 place-items-center border ${
                      status === STATUS.LIVE
                        ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                        : status === STATUS.ERROR
                          ? "border-red-400/30 bg-red-400/10 text-red-300"
                          : "border-white/10 bg-white/[0.03] text-white/50"
                    }`}
                  >
                    {status === STATUS.LIVE ? (
                      <Check className="h-4 w-4" />
                    ) : status === STATUS.ERROR ? (
                      <X className="h-4 w-4" />
                    ) : (
                      <Crosshair className="h-4 w-4" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                <Stat
                  label="Latitude"
                  value={formatCoordinate(location?.latitude)}
                  icon={MapPin}
                />

                <Stat
                  label="Longitude"
                  value={formatCoordinate(location?.longitude)}
                  icon={Navigation}
                />

                <Stat
                  label="Accuracy"
                  value={location ? `${location.accuracy} meters` : "—"}
                  icon={LocateFixed}
                />

                <Stat
                  label="Connection"
                  value={status === STATUS.LIVE ? "Live" : "Standby"}
                  icon={Radio}
                />
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="mt-4 border border-red-400/20 bg-red-400/10 p-4 text-sm leading-6 text-red-100/80"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-auto pt-6">
                {status !== STATUS.LIVE ? (
                  <motion.button
                    type="button"
                    onClick={startSharing}
                    disabled={status === STATUS.LOCATING}
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.99 }}
                    className="group relative flex w-full items-center justify-between overflow-hidden bg-[#D3131A] px-5 py-4 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition duration-300 hover:bg-white hover:text-black disabled:cursor-wait disabled:opacity-65"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      <LocateFixed className="h-5 w-5" />

                      {status === STATUS.LOCATING
                        ? "Acquiring location"
                        : status === STATUS.STOPPED
                          ? "Resume location sharing"
                          : "Share live location"}
                    </span>

                    <ArrowUpRight className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />

                    <motion.span
                      className="absolute inset-y-0 left-0 w-14 -skew-x-12 bg-white/20"
                      animate={{ x: ["-200%", "1000%"] }}
                      transition={{
                        duration: 2.8,
                        repeat: Infinity,
                        repeatDelay: 1.5,
                      }}
                    />
                  </motion.button>
                ) : (
                  <div className="space-y-3">
                    <motion.button
                      type="button"
                      onClick={() => onContinue?.(location)}
                      whileHover={{ x: 3 }}
                      whileTap={{ scale: 0.99 }}
                      className="flex w-full items-center justify-between bg-[#D3131A] px-5 py-4 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition duration-300 hover:bg-white hover:text-black"
                    >
                      <span>Continue service request</span>
                      <ArrowUpRight className="h-5 w-5" />
                    </motion.button>

                    <div className="grid grid-cols-2 gap-3">
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 border border-white/10 bg-white/[0.025] px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-white/65 transition hover:border-white/25 hover:bg-white hover:text-black"
                      >
                        <MapPin className="h-4 w-4" />
                        Open map
                      </a>

                      <button
                        type="button"
                        onClick={stopSharing}
                        className="flex items-center justify-center gap-2 border border-white/10 bg-white/[0.025] px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-white/65 transition hover:border-[#D3131A] hover:bg-[#D3131A] hover:text-white"
                      >
                        <X className="h-4 w-4" />
                        Stop sharing
                      </button>
                    </div>
                  </div>
                )}

                <p className="mt-4 text-center text-[9px] font-medium uppercase tracking-[0.16em] text-white/22">
                  Secure connection required · HTTPS only
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
            <span className="text-[8px] font-bold uppercase tracking-[0.25em] text-white/20">
              Hammer Head Response Network
            </span>

            <span className="font-mono text-[9px] text-[#D3131A]">ONLINE</span>
          </div>
        </div>
      </section>
    </main>
  );
}
