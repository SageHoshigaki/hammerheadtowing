import { useRef } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Clock3,
  MapPin,
  Menu,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { motion } from "motion/react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const stats = [
  {
    value: "24/7",
    label: "Emergency dispatch",
    icon: Clock3,
  },
  {
    value: "NY",
    label: "Local + interstate",
    icon: MapPin,
  },
  {
    value: "01",
    label: "Direct response team",
    icon: ShieldCheck,
  },
];

export function HammerHeadHero() {
  const heroRef = useRef(null);

  useGSAP(
    () => {
      const timeline = gsap.timeline({
        defaults: {
          ease: "power4.out",
        },
      });

      timeline
        .from("[data-nav]", {
          opacity: 0,
          y: -24,
          duration: 0.8,
        })
        .from(
          "[data-eyebrow]",
          {
            opacity: 0,
            y: 18,
            duration: 0.7,
          },
          "-=0.35",
        )
        .from(
          "[data-title-line]",
          {
            yPercent: 120,
            rotate: 2,
            duration: 1.15,
            stagger: 0.12,
          },
          "-=0.4",
        )
        .from(
          "[data-body]",
          {
            opacity: 0,
            y: 24,
            duration: 0.8,
          },
          "-=0.65",
        )
        .from(
          "[data-actions]",
          {
            opacity: 0,
            y: 22,
            duration: 0.7,
          },
          "-=0.6",
        )
        .from(
          "[data-stat]",
          {
            opacity: 0,
            x: 26,
            stagger: 0.08,
            duration: 0.7,
          },
          "-=0.55",
        );

      gsap.to("[data-video]", {
        scale: 1.045,
        duration: 14,
        ease: "none",
        repeat: -1,
        yoyo: true,
      });

      gsap.to("[data-red-glow]", {
        opacity: 0.8,
        scale: 1.18,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    {
      scope: heroRef,
    },
  );

  return (
    <section
      ref={heroRef}
      className="relative isolate min-h-screen overflow-hidden bg-black text-white"
    >
      {/* Background video */}
      <div
        data-video
        className="absolute inset-0 scale-[1.01] will-change-transform"
      >
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/media/towing-hero-poster.webp"
          aria-hidden="true"
        >
          <source src="/videos/truck0.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Dark video treatment */}
      <div className="absolute inset-0 bg-black/40" />

      <div className="absolute inset-0 bg-[linear-gradient(90deg,#000_0%,rgba(0,0,0,0.96)_28%,rgba(0,0,0,0.7)_57%,rgba(0,0,0,0.38)_100%)]" />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.7)_0%,transparent_30%,rgba(0,0,0,0.92)_100%)]" />

      <div className="hero-grid absolute inset-0 opacity-40" />

      <div
        data-red-glow
        className="absolute right-[-12rem] top-[20%] size-[34rem] rounded-full bg-red-600/20 blur-[150px]"
      />

      <div className="absolute left-[62%] top-0 hidden h-full w-px bg-white/10 xl:block" />

      {/* Header */}
      <header
        data-nav
        className="absolute inset-x-0 top-0 z-40 border-b border-white/10"
      >
        <div className="mx-auto flex h-20 w-[min(100%-2rem,1500px)] items-center justify-between lg:h-24">
          {/* Real logo */}
          <a
            href="/"
            className="group flex items-center"
            aria-label="Hammer Head Towing and Recovery home"
          >
            <img
              src="/images/logo2.png"
              alt="Hammer Head Towing and Recovery"
              className="h-12 w-auto max-w-[180px] object-contain transition-transform duration-500 group-hover:scale-[1.03] lg:h-16 lg:max-w-[240px]"
            />
          </a>

          <nav className="hidden items-center gap-8 lg:flex">
            <a className="nav-link" href="#services">
              Services
            </a>

            <a className="nav-link" href="#recovery">
              Recovery
            </a>

            <a className="nav-link" href="#coverage">
              Coverage
            </a>

            <a className="nav-link" href="/prestige">
              Prestige
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="tel:+15160000000"
              className="hidden items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-white/70 md:flex"
            >
              <Phone className="size-4 text-red-500" />
              24/7 Dispatch
            </a>

            <a
              href="#request-service"
              className="group hidden min-h-12 items-center gap-3 bg-red-600 px-5 text-xs font-black uppercase tracking-[0.12em] transition-colors hover:bg-red-500 sm:inline-flex"
            >
              Request service

              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>

            <button
              type="button"
              aria-label="Open navigation"
              className="grid size-11 place-items-center border border-white/15 bg-black/30 backdrop-blur-md lg:hidden"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero content */}
      <div className="relative z-20 mx-auto flex min-h-screen w-[min(100%-2rem,1500px)] items-end pb-24 pt-36 lg:items-center lg:pb-0">
        <div className="grid w-full gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="max-w-6xl">
            <div
              data-eyebrow
              className="mb-7 flex flex-wrap items-center gap-4 text-[0.66rem] font-bold uppercase tracking-[0.2em] text-white/55"
            >
              <span className="h-px w-10 bg-red-600" />

              Farmingdale, New York

              <span className="hidden text-white/25 sm:inline">
                Local and interstate response
              </span>
            </div>

            <h1 className="font-black uppercase leading-[0.8] tracking-[-0.075em]">
              <span className="block overflow-hidden">
                <span
                  data-title-line
                  className="block text-[clamp(4rem,10vw,10rem)]"
                >
                  Built for
                </span>
              </span>

              <span className="block overflow-hidden">
                <span
                  data-title-line
                  className="block text-[clamp(4rem,10vw,10rem)] text-red-600"
                >
                  the recovery.
                </span>
              </span>
            </h1>

            <div className="mt-8 grid max-w-4xl gap-7 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
              <p
                data-body
                className="max-w-2xl text-base leading-7 text-white/65 md:text-lg md:leading-8"
              >
                Fast, professional towing, roadside assistance, accident
                recovery, and commercial vehicle transport across Long Island
                and beyond.
              </p>

              <div
                data-actions
                className="flex flex-col gap-3 sm:flex-row md:flex-col"
              >
                <a href="tel:+15160000000" className="hero-button-primary">
                  <Phone className="size-4" />
                  Call dispatch
                </a>

                <a href="#services" className="hero-button-secondary">
                  Explore services
                  <ArrowUpRight className="size-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Right-side data card */}
          <aside className="hidden overflow-hidden border border-white/10 bg-black/55 backdrop-blur-xl lg:block">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <span className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-white/45">
                Response network
              </span>

              <span className="flex items-center gap-2 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-green-400">
                <span className="size-1.5 animate-pulse rounded-full bg-green-400" />
                Active
              </span>
            </div>

            {stats.map(({ value, label, icon: Icon }, index) => (
              <div
                key={label}
                data-stat
                className="group grid grid-cols-[52px_1fr_auto] items-center gap-4 border-b border-white/10 px-5 py-5 last:border-b-0"
              >
                <div className="grid size-11 place-items-center border border-red-500/30 bg-red-500/10">
                  <Icon className="size-5 text-red-500" />
                </div>

                <div>
                  <p className="text-xl font-black tracking-[-0.05em]">
                    {value}
                  </p>

                  <p className="mt-1 text-[0.62rem] uppercase tracking-[0.14em] text-white/42">
                    {label}
                  </p>
                </div>

                <span className="text-[0.55rem] text-white/20">
                  0{index + 1}
                </span>
              </div>
            ))}
          </aside>
        </div>
      </div>

      {/* Bottom information */}
      <div className="absolute bottom-0 left-0 z-30 flex items-center gap-3 bg-red-600 px-5 py-3 text-[0.6rem] font-black uppercase tracking-[0.17em]">
        <Clock3 className="size-4" />
        Emergency response available 24/7
      </div>

      <div className="absolute bottom-0 right-0 z-30 hidden items-center gap-3 border-l border-t border-white/10 bg-black/70 px-5 py-3 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-white/50 backdrop-blur-lg md:flex">
        <MapPin className="size-4 text-red-500" />
        Long Island · New York · Interstate
      </div>

      <motion.a
        href="#services"
        animate={{
          y: [0, 7, 0],
        }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-24 right-7 z-30 hidden size-12 place-items-center border border-white/15 bg-black/40 backdrop-blur-lg xl:grid"
        aria-label="Scroll to services"
      >
        <ArrowDown className="size-4 text-red-500" />
      </motion.a>
    </section>
  );
}