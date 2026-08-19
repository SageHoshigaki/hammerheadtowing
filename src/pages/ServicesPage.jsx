// src/pages/ServicesPage.jsx

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  ArrowUpRight,
  Car,
  Check,
  ChevronDown,
  CircleDot,
  Construction,
  FileCheck2,
  Gauge,
  LifeBuoy,
  MapPin,
  Navigation,
  Phone,
  Route,
  ShieldCheck,
  Truck,
  Wrench,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const RED = "#D3131A";

const services = [
  {
    number: "01",
    key: "emergency",
    title: "Emergency Towing",
    shortTitle: "Emergency",
    eyebrow: "Immediate response",
    description:
      "Fast local response for disabled, damaged, or inoperable vehicles.",
    detail:
      "The truck arrives, secures the scene, selects the correct loading approach, and begins controlled transport.",
    icon: Truck,
    tags: ["24/7 dispatch", "Local towing", "Disabled vehicles"],
    signal: "Priority dispatch",
    code: "HH-01",
  },
  {
    number: "02",
    key: "roadside",
    title: "Roadside Assistance",
    shortTitle: "Roadside",
    eyebrow: "Field diagnostics",
    description:
      "Support for flat tires, jump-starts, lockouts, and roadside incidents.",
    detail:
      "The operator checks the vehicle before deciding whether the problem can be resolved roadside or requires a tow.",
    icon: LifeBuoy,
    tags: ["Jump-start", "Flat tire", "Lockout"],
    signal: "Roadside support",
    code: "HH-02",
  },
  {
    number: "03",
    key: "accident",
    title: "Accident Recovery",
    shortTitle: "Recovery",
    eyebrow: "Scene control",
    description:
      "Controlled vehicle recovery following collisions and roadway incidents.",
    detail:
      "The damaged vehicle is stabilized, debris is accounted for, and the recovery path is cleared before movement.",
    icon: ShieldCheck,
    tags: ["Collision recovery", "Scene management", "Secure transport"],
    signal: "Scene recovery",
    code: "HH-03",
  },
  {
    number: "04",
    key: "winching",
    title: "Winching & Extraction",
    shortTitle: "Extraction",
    eyebrow: "Load under control",
    description:
      "Recovery for vehicles stuck in mud, snow, embankments, or difficult positions.",
    detail:
      "The anchor point, cable angle, vehicle position, resistance, and pull direction are set before force is applied.",
    icon: Construction,
    tags: ["Winch-outs", "Off-road", "Difficult access"],
    signal: "Tension applied",
    code: "HH-04",
  },
  {
    number: "05",
    key: "flatbed",
    title: "Local Flatbed Transport",
    shortTitle: "Flatbed",
    eyebrow: "Precision loading",
    description:
      "Secure local movement for damaged, specialty, and low-clearance vehicles.",
    detail:
      "The bed lowers, the vehicle aligns with the approach angle, and loading completes without unnecessary suspension or body contact.",
    icon: Car,
    tags: ["Flatbed", "Low clearance", "Scheduled transport"],
    signal: "Loading sequence",
    code: "HH-05",
  },
  {
    number: "06",
    key: "commercial",
    title: "Commercial Logistics",
    shortTitle: "Logistics",
    eyebrow: "Account movement",
    description:
      "Scheduled movement for dealerships, body shops, auctions, and fleets.",
    detail:
      "Multiple vehicles, facilities, delivery windows, and route checkpoints are organized as one repeatable operation.",
    icon: Wrench,
    tags: ["Dealers", "Body shops", "Fleet accounts"],
    signal: "Fleet movement",
    code: "HH-06",
  },
  {
    number: "07",
    key: "salvage",
    title: "Insurance & Salvage",
    shortTitle: "Documentation",
    eyebrow: "Condition recorded",
    description:
      "Documentation-led transport for total-loss and collision vehicles.",
    detail:
      "Vehicle identity, condition, pickup location, destination, and transfer status remain connected to the movement.",
    icon: FileCheck2,
    tags: ["Total loss", "Inspection moves", "Salvage"],
    signal: "Transfer verified",
    code: "HH-07",
  },
  {
    number: "08",
    key: "regional",
    title: "Regional Transport",
    shortTitle: "Regional",
    eyebrow: "Extended movement",
    description:
      "Scheduled regional and interstate transport based on route and capacity.",
    detail:
      "Longer movement is planned around route conditions, timing, equipment availability, checkpoints, and delivery coordination.",
    icon: MapPin,
    tags: ["Regional lanes", "Interstate", "Scheduled routes"],
    signal: "Regional lane",
    code: "HH-08",
  },
];

const visualStates = [
  {
    roadRotation: -5,
    roadX: 4,
    cablePath:
      "M-100 680 C300 620 570 520 1040 250 C1250 130 1450 110 1750 180",
    redX: 72,
    redY: 42,
    beamRotation: -22,
  },
  {
    roadRotation: 4,
    roadX: -5,
    cablePath: "M-100 510 C240 420 510 470 760 620 C980 750 1280 650 1750 380",
    redX: 29,
    redY: 47,
    beamRotation: 18,
  },
  {
    roadRotation: -2,
    roadX: 5,
    cablePath: "M-100 700 C250 700 420 300 790 330 C1160 360 1280 650 1750 560",
    redX: 69,
    redY: 52,
    beamRotation: -12,
  },
  {
    roadRotation: -11,
    roadX: -4,
    cablePath: "M-100 720 C310 710 510 590 740 390 C980 180 1280 210 1750 240",
    redX: 42,
    redY: 46,
    beamRotation: -36,
  },
  {
    roadRotation: -7,
    roadX: 8,
    cablePath: "M-100 650 C340 650 540 590 800 480 C1080 360 1300 350 1750 430",
    redX: 74,
    redY: 58,
    beamRotation: -15,
  },
  {
    roadRotation: 3,
    roadX: -7,
    cablePath: "M-100 470 C300 330 550 390 770 510 C1010 640 1280 600 1750 410",
    redX: 31,
    redY: 57,
    beamRotation: 27,
  },
  {
    roadRotation: -3,
    roadX: 5,
    cablePath: "M-100 620 C290 510 550 480 800 500 C1080 530 1320 430 1750 240",
    redX: 70,
    redY: 40,
    beamRotation: -29,
  },
  {
    roadRotation: 0,
    roadX: 0,
    cablePath: "M-100 540 C280 540 500 540 800 540 C1120 540 1390 540 1750 540",
    redX: 50,
    redY: 50,
    beamRotation: -7,
  },
];

function normalizePhone(phone = "") {
  return phone.replace(/[^\d+]/g, "");
}

function RoadField({ state, scrollProgress }) {
  return (
    <div
      className="absolute bottom-[-24%] left-1/2 h-[88%] w-[150%] origin-center transition-transform duration-[1600ms] ease-[cubic-bezier(.22,1,.36,1)]"
      style={{
        transform: `
          translateX(calc(-50% + ${state.roadX}%))
          perspective(900px)
          rotateX(62deg)
          rotateZ(${state.roadRotation}deg)
        `,
      }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#050505,#0A0A0A_45%,#050505)] shadow-[0_-100px_180px_rgba(0,0,0,.9)]" />

      <div className="absolute inset-0 opacity-[0.16] [background-image:url('data:image/svg+xml,%3Csvg viewBox=%220 0 180 180%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%22.8%22 numOctaves=%224%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%22.85%22/%3E%3C/svg%3E')]" />

      <div className="absolute inset-y-0 left-[19%] w-px bg-white/10" />
      <div className="absolute inset-y-0 right-[19%] w-px bg-white/10" />

      <div className="absolute inset-y-0 left-1/2 w-[10px] -translate-x-1/2 overflow-hidden">
        <div
          className="absolute inset-x-0 top-[-100%] h-[240%] [background-image:repeating-linear-gradient(to_bottom,rgba(255,255,255,.68)_0px,rgba(255,255,255,.68)_80px,transparent_80px,transparent_180px)]"
          style={{
            transform: `translateY(${scrollProgress * 260}px)`,
          }}
        />
      </div>

      <div
        className="absolute inset-x-0 top-[34%] h-[14%] bg-[linear-gradient(90deg,transparent,rgba(211,19,26,.04),rgba(211,19,26,.16),rgba(211,19,26,.04),transparent)] blur-xl"
        style={{
          transform: `translateY(${scrollProgress * 180}px)`,
        }}
      />
    </div>
  );
}

function CableSystem({ state, progress }) {
  return (
    <svg
      className="absolute inset-0 h-full w-full overflow-visible"
      viewBox="0 0 1600 900"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d={state.cablePath}
        fill="none"
        stroke="rgba(255,255,255,.09)"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
        className="transition-all duration-[1600ms] ease-[cubic-bezier(.22,1,.36,1)]"
      />

      <path
        d={state.cablePath}
        fill="none"
        stroke={RED}
        strokeWidth="3"
        strokeDasharray="2200"
        strokeDashoffset={2200 - progress * 2200}
        vectorEffect="non-scaling-stroke"
        className="transition-all duration-[1600ms] ease-[cubic-bezier(.22,1,.36,1)]"
      />

      <circle
        cx={180 + progress * 1210}
        cy={650 - progress * 300}
        r="6"
        fill="#050505"
        stroke={RED}
        strokeWidth="2"
        className="transition-all duration-300"
      />

      <circle
        cx={180 + progress * 1210}
        cy={650 - progress * 300}
        r="16"
        fill="none"
        stroke="rgba(211,19,26,.2)"
        className="transition-all duration-300"
      />
    </svg>
  );
}

function BackgroundTypography({ service }) {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        key={`${service.key}-word`}
        className="absolute left-[-2vw] top-[18%] whitespace-nowrap text-[clamp(9rem,25vw,30rem)] font-semibold uppercase leading-none tracking-[-0.095em] text-transparent opacity-[0.055] [-webkit-text-stroke:1px_rgba(255,255,255,.9)]"
      >
        Hammer
      </div>

      <div
        key={`${service.key}-number`}
        className="absolute bottom-[-8%] right-[-2%] font-mono text-[clamp(14rem,35vw,40rem)] font-bold leading-none tracking-[-0.15em] text-white/[0.025]"
      >
        {service.number}
      </div>

      <div className="absolute left-[6%] top-[15%] hidden items-center gap-4 lg:flex">
        <span className="font-mono text-[8px] tracking-[0.24em] text-white/20">
          40.7891° N
        </span>
        <span className="h-px w-10 bg-white/10" />
        <span className="font-mono text-[8px] tracking-[0.24em] text-white/20">
          73.1350° W
        </span>
      </div>
    </div>
  );
}

function EmergencyLight({ state, activeIndex }) {
  return (
    <>
      <div
        className="absolute h-[54vw] w-[54vw] max-h-[850px] max-w-[850px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(211,19,26,.32),rgba(211,19,26,.09)_28%,transparent_68%)] blur-3xl transition-all duration-[1700ms] ease-[cubic-bezier(.22,1,.36,1)]"
        style={{
          left: `${state.redX}%`,
          top: `${state.redY}%`,
        }}
      />

      <div
        key={`beam-${activeIndex}`}
        className="absolute left-1/2 top-1/2 h-[150vh] w-[15vw] min-w-[180px] -translate-x-1/2 -translate-y-1/2 bg-[linear-gradient(90deg,transparent,rgba(211,19,26,.03),rgba(211,19,26,.14),rgba(255,255,255,.035),transparent)] blur-xl"
        style={{
          transform: `translate(-50%, -50%) rotate(${state.beamRotation}deg)`,
          animation:
            "hammerSweep 5.8s cubic-bezier(.65,0,.35,1) infinite alternate",
        }}
      />

      <div className="absolute left-[72%] top-[26%] h-2 w-2 rounded-full bg-[#D3131A] shadow-[0_0_15px_4px_rgba(211,19,26,.8),0_0_80px_25px_rgba(211,19,26,.22)]" />
    </>
  );
}

function CinematicBackdrop({ activeIndex, scrollProgress }) {
  const activeService = services[activeIndex] || services[0];
  const state = visualStates[activeIndex] || visualStates[0];

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#050505]">
      <style>{`
        @keyframes hammerSweep {
          0% {
            opacity: .18;
            translate: -24vw 0;
          }

          55% {
            opacity: .7;
          }

          100% {
            opacity: .22;
            translate: 24vw 0;
          }
        }

        @keyframes hammerStatus {
          0%, 100% {
            opacity: .35;
          }

          50% {
            opacity: 1;
          }
        }
      `}</style>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,#111214_0%,#080808_34%,#050505_72%)]" />

      <RoadField state={state} scrollProgress={scrollProgress} />

      <EmergencyLight state={state} activeIndex={activeIndex} />

      <CableSystem state={state} progress={Math.max(0.08, scrollProgress)} />

      <BackgroundTypography service={activeService} />

      <div className="absolute inset-y-0 left-[5%] w-px bg-white/[0.055]" />
      <div className="absolute inset-y-0 right-[5%] w-px bg-white/[0.055]" />
      <div className="absolute left-0 top-[28%] h-px w-full bg-white/[0.035]" />
      <div className="absolute left-0 top-[72%] h-px w-full bg-white/[0.035]" />

      <div
        key={activeService.key}
        className="absolute right-5 top-28 hidden w-[280px] border-t border-white/15 pt-4 md:right-10 lg:right-16 lg:block"
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9px] tracking-[0.22em] text-[#D3131A]">
            {activeService.code}
          </span>

          <span className="text-[8px] font-bold uppercase tracking-[0.22em] text-white/25">
            Active operation
          </span>
        </div>

        <p className="mt-6 text-2xl font-semibold uppercase tracking-[-0.045em] text-white/85">
          {activeService.signal}
        </p>

        <div className="mt-4 flex items-center gap-3">
          <span
            className="h-1.5 w-1.5 rounded-full bg-[#D3131A]"
            style={{
              animation: "hammerStatus 1.6s ease-in-out infinite",
            }}
          />

          <span className="text-[8px] font-bold uppercase tracking-[0.19em] text-white/35">
            Hammer Head dispatch
          </span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-[3px] w-full bg-white/[0.035]">
        <div
          className="h-full bg-[#D3131A] transition-[width] duration-150"
          style={{
            width: `${scrollProgress * 100}%`,
          }}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 opacity-[0.075] [background-image:url('data:image/svg+xml,%3Csvg viewBox=%220 0 180 180%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%221.15%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22 opacity=%22.42%22/%3E%3C/svg%3E')]" />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,.74),rgba(5,5,5,.13)_35%,rgba(5,5,5,.07)_60%,rgba(5,5,5,.68))]" />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,.33),transparent_26%,transparent_70%,rgba(5,5,5,.84))]" />
    </div>
  );
}

function ServiceIndex({ activeIndex, onSelect }) {
  return (
    <div className="fixed bottom-5 left-1/2 z-40 hidden -translate-x-1/2 border border-white/10 bg-black/65 p-1.5 shadow-[0_20px_80px_rgba(0,0,0,.55)] backdrop-blur-xl lg:flex">
      {services.map((service, index) => {
        const Icon = service.icon;
        const active = activeIndex === index;

        return (
          <button
            key={service.key}
            type="button"
            onClick={() => onSelect(index)}
            aria-label={`Go to ${service.title}`}
            className={`group flex h-11 items-center gap-2 overflow-hidden px-3 transition-all duration-500 ${
              active
                ? "max-w-[180px] bg-[#D3131A] text-white"
                : "max-w-11 text-white/35 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />

            <span
              className={`whitespace-nowrap text-[8px] font-bold uppercase tracking-[0.16em] transition-opacity duration-300 ${
                active ? "opacity-100" : "opacity-0"
              }`}
            >
              {service.shortTitle}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ChapterInterface({ service, index, active, phoneHref }) {
  const Icon = service.icon;
  const rightAligned = index % 2 === 1;

  return (
    <section
      id={`service-${index}`}
      data-service-section
      data-service-index={index}
      className="relative z-20 flex min-h-[110vh] items-center px-5 py-28 md:px-10 lg:min-h-[125vh] lg:px-16"
    >
      <div
        className={`mx-auto flex w-full max-w-[1550px] ${
          rightAligned ? "justify-end" : "justify-start"
        }`}
      >
        <div
          data-service-panel
          className={`relative w-full max-w-[620px] overflow-hidden border border-white/10 bg-black/42 p-6 shadow-[0_40px_140px_rgba(0,0,0,.55)] backdrop-blur-xl transition-all duration-700 sm:p-8 lg:p-10 ${
            active ? "translate-y-0 opacity-100" : "translate-y-10 opacity-30"
          }`}
        >
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,.038),transparent_42%)]" />

          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-[#D3131A] via-[#D3131A]/30 to-transparent" />

          <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 border-b border-l border-white/[0.045]" />

          <div className="relative">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="font-mono text-[10px] tracking-[0.24em] text-[#D3131A]">
                  {service.number}
                </p>

                <p className="mt-3 text-[9px] font-bold uppercase tracking-[0.24em] text-white/35">
                  {service.eyebrow}
                </p>
              </div>

              <div
                className={`grid h-12 w-12 place-items-center border transition-all duration-500 ${
                  active
                    ? "border-[#D3131A] bg-[#D3131A] text-white"
                    : "border-white/10 bg-black/30 text-white/40"
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={1.45} />
              </div>
            </div>

            <div className="mt-14 overflow-hidden">
              <h2 className="text-[clamp(3.2rem,7vw,6.8rem)] font-semibold uppercase leading-[0.79] tracking-[-0.07em]">
                {service.title}
              </h2>
            </div>

            <div className="mt-7 flex items-center">
              <div
                className={`h-[2px] bg-[#D3131A] transition-all duration-1000 ${
                  active ? "w-full" : "w-14"
                }`}
              />

              <span className="h-1.5 w-1.5 shrink-0 bg-[#D3131A]" />
            </div>

            <p className="mt-7 max-w-xl text-base leading-7 text-white/68 sm:text-lg sm:leading-8">
              {service.description}
            </p>

            <p className="mt-5 max-w-xl text-sm leading-7 text-white/38">
              {service.detail}
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {service.tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-white/10 bg-black/30 px-3 py-2 text-[8px] font-bold uppercase tracking-[0.17em] text-white/42"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                to={`/request-recovery?service=${encodeURIComponent(
                  service.title,
                )}`}
                className="group flex min-h-14 flex-1 items-center justify-between bg-[#D3131A] px-5 text-[9px] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-black"
              >
                Request this service
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>

              <a
                href={phoneHref}
                className="group flex min-h-14 items-center justify-center gap-3 border border-white/15 bg-black/35 px-5 text-[9px] font-bold uppercase tracking-[0.18em] text-white/60 transition hover:border-white hover:bg-white hover:text-black"
              >
                <Phone className="h-4 w-4" />
                Call dispatch
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ServicesPage({ phoneNumber = "(631) 300-5559" }) {
  const pageRef = useRef(null);
  const scrollFrameRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const phoneHref = `tel:${normalizePhone(phoneNumber)}`;

  useGSAP(
    () => {
      gsap
        .timeline({
          defaults: {
            ease: "power4.out",
          },
        })
        .from("[data-hero-kicker]", {
          opacity: 0,
          x: -30,
          duration: 0.8,
        })
        .from(
          "[data-hero-line]",
          {
            yPercent: 115,
            duration: 1.25,
            stagger: 0.08,
          },
          "-=0.4",
        )
        .from(
          "[data-hero-copy]",
          {
            opacity: 0,
            y: 26,
            duration: 0.85,
          },
          "-=0.55",
        )
        .from(
          "[data-hero-control]",
          {
            opacity: 0,
            y: 20,
            stagger: 0.08,
            duration: 0.7,
          },
          "-=0.45",
        );

      gsap.utils.toArray("[data-service-panel]").forEach((panel) => {
        gsap.from(panel, {
          y: 70,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: panel,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });
      });

      ScrollTrigger.refresh();
    },
    {
      scope: pageRef,
    },
  );

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll("[data-service-section]"),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (first, second) =>
              second.intersectionRatio - first.intersectionRatio,
          );

        if (!visible.length) return;

        const nextIndex = Number(visible[0].target.dataset.serviceIndex);

        if (Number.isFinite(nextIndex)) {
          setActiveIndex(nextIndex);
        }
      },
      {
        rootMargin: "-28% 0px -28% 0px",
        threshold: [0.15, 0.35, 0.55, 0.75],
      },
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    function updateScrollProgress() {
      const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const progress = documentHeight > 0 ? window.scrollY / documentHeight : 0;

      setScrollProgress(Math.min(Math.max(progress, 0), 1));

      scrollFrameRef.current = null;
    }

    function handleScroll() {
      if (scrollFrameRef.current) return;

      scrollFrameRef.current =
        window.requestAnimationFrame(updateScrollProgress);
    }

    updateScrollProgress();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);

      if (scrollFrameRef.current) {
        window.cancelAnimationFrame(scrollFrameRef.current);
      }
    };
  }, []);

  function scrollToService(index) {
    document.getElementById(`service-${index}`)?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }

  return (
    <main
      ref={pageRef}
      className="relative min-h-screen overflow-clip bg-[#050505] text-[#F4F1EC]"
    >
      <CinematicBackdrop
        activeIndex={activeIndex}
        scrollProgress={scrollProgress}
      />

      <section className="relative z-20 flex min-h-[calc(100vh-84px)] items-end px-5 pb-10 pt-24 md:px-10 lg:px-16 lg:pb-14">
        <div className="mx-auto w-full max-w-[1550px]">
          <div data-hero-kicker className="flex items-center gap-4">
            <span className="h-px w-12 bg-[#D3131A]" />

            <Truck className="h-4 w-4 text-[#D3131A]" strokeWidth={1.5} />

            <span className="text-[9px] font-bold uppercase tracking-[0.28em] text-white/45">
              Hammer Head recovery systems
            </span>
          </div>

          <div className="mt-16">
            <div className="overflow-hidden">
              <h1
                data-hero-line
                className="text-[clamp(4.6rem,12vw,12.5rem)] font-semibold uppercase leading-[0.74] tracking-[-0.08em]"
              >
                Built for
              </h1>
            </div>

            <div className="overflow-hidden">
              <h1
                data-hero-line
                className="text-[clamp(4.6rem,12vw,12.5rem)] font-semibold uppercase leading-[0.74] tracking-[-0.08em] text-[#D3131A]"
              >
                the unexpected.
              </h1>
            </div>
          </div>

          <div className="mt-12 grid gap-8 border-t border-white/12 pt-7 lg:grid-cols-[1fr_auto] lg:items-end">
            <p
              data-hero-copy
              className="max-w-2xl text-base leading-7 text-white/52 sm:text-lg sm:leading-8"
            >
              A live operational view of Hammer Head’s recovery capability—from
              first dispatch through loading, documentation, routing, and final
              delivery.
            </p>

            <div className="grid grid-cols-2 gap-px border border-white/10 bg-white/10 sm:grid-cols-4">
              {[
                ["24/7", "Dispatch", Zap],
                ["08", "Services", CircleDot],
                ["Local", "Response", Navigation],
                ["Regional", "Routes", Route],
              ].map(([value, label, Icon]) => (
                <div
                  data-hero-control
                  key={label}
                  className="min-w-[125px] bg-black/55 px-4 py-4 backdrop-blur-xl"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-semibold uppercase tracking-[-0.04em]">
                      {value}
                    </p>

                    <Icon
                      className="h-3.5 w-3.5 text-[#D3131A]"
                      strokeWidth={1.5}
                    />
                  </div>

                  <p className="mt-2 text-[8px] font-bold uppercase tracking-[0.18em] text-white/30">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button
            data-hero-control
            type="button"
            onClick={() => scrollToService(0)}
            className="group mt-9 flex items-center gap-4 text-[8px] font-bold uppercase tracking-[0.22em] text-white/35 transition hover:text-white"
          >
            Explore capabilities
            <span className="grid h-10 w-10 place-items-center border border-white/15 transition group-hover:border-[#D3131A] group-hover:bg-[#D3131A]">
              <ChevronDown className="h-4 w-4" />
            </span>
          </button>
        </div>
      </section>

      <section className="relative z-20 border-y border-white/10 bg-black/50 px-5 py-8 backdrop-blur-xl md:px-10 lg:px-16">
        <div className="mx-auto flex max-w-[1550px] flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <Gauge className="h-5 w-5 text-[#D3131A]" />

            <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-white/40">
              Scroll through the operation
            </p>
          </div>

          <p className="max-w-xl text-sm leading-6 text-white/35">
            Each chapter shows the equipment, procedure, and movement associated
            with that specific service.
          </p>
        </div>
      </section>

      <div className="relative z-20">
        {services.map((service, index) => (
          <ChapterInterface
            key={service.key}
            service={service}
            index={index}
            active={activeIndex === index}
            phoneHref={phoneHref}
          />
        ))}
      </div>

      <section className="relative z-20 border-y border-white/10 bg-black/75 px-5 py-20 backdrop-blur-xl md:px-10 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-[1550px]">
          <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["01", "Assess", "Understand the vehicle and environment."],
              ["02", "Stabilize", "Control risk before movement begins."],
              ["03", "Recover", "Apply the appropriate equipment and force."],
              ["04", "Deliver", "Complete the movement with clear handoff."],
            ].map(([number, title, copy]) => (
              <div
                key={number}
                className="group relative overflow-hidden bg-[#080808] p-7 sm:p-8"
              >
                <div className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-[#D3131A] transition-transform duration-500 group-hover:scale-x-100" />

                <p className="font-mono text-[9px] tracking-[0.2em] text-[#D3131A]">
                  {number}
                </p>

                <h3 className="mt-8 text-3xl font-semibold uppercase tracking-[-0.05em]">
                  {title}
                </h3>

                <p className="mt-4 text-sm leading-6 text-white/38">{copy}</p>

                <div className="mt-7 flex items-center gap-2 text-[8px] font-bold uppercase tracking-[0.17em] text-white/30">
                  <Check className="h-3.5 w-3.5 text-[#D3131A]" />
                  Controlled process
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-20 overflow-hidden bg-[#D3131A] px-5 py-20 text-white md:px-10 lg:px-16 lg:py-28">
        <div className="pointer-events-none absolute inset-0 opacity-[0.1] [background-image:linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:64px_64px]" />

        <div className="pointer-events-none absolute -right-20 -top-20 h-[34rem] w-[34rem] rounded-full border border-white/15" />

        <div className="pointer-events-none absolute right-16 top-16 h-[20rem] w-[20rem] rounded-full border border-white/15" />

        <div className="relative mx-auto flex max-w-[1550px] flex-col justify-between gap-12 lg:flex-row lg:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 animate-pulse bg-white" />

              <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-white/65">
                Dispatch available
              </p>
            </div>

            <h2 className="mt-6 max-w-5xl text-[clamp(4rem,10vw,10rem)] font-semibold uppercase leading-[0.76] tracking-[-0.08em]">
              Need the right truck
              <span className="block">moving now?</span>
            </h2>

            <a
              href={phoneHref}
              className="mt-9 inline-flex items-center gap-3 border-b border-white/35 pb-2 text-base font-semibold transition hover:border-white"
            >
              <Phone className="h-4 w-4" />
              {phoneNumber}
            </a>
          </div>

          <Link
            to="/request-recovery"
            className="group flex min-h-16 items-center justify-between gap-14 bg-white px-6 text-[10px] font-bold uppercase tracking-[0.18em] text-black transition hover:bg-black hover:text-white sm:min-w-[330px]"
          >
            Start recovery request
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1.5" />
          </Link>
        </div>
      </section>

      <ServiceIndex activeIndex={activeIndex} onSelect={scrollToService} />
    </main>
  );
}
