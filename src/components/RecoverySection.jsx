import { useRef } from "react";
import {
  ArrowUpRight,
  Check,
  Gauge,
  ShieldCheck,
  Truck,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const capabilities = [
  "Accident-scene recovery",
  "Winching and vehicle extraction",
  "Commercial vehicle support",
  "Flatbed and specialty transport",
];

const metrics = [
  {
    icon: Gauge,
    value: "24/7",
    label: "Response availability",
  },
  {
    icon: Truck,
    value: "Local",
    label: "Long Island coverage",
  },
  {
    icon: ShieldCheck,
    value: "Direct",
    label: "Professional handling",
  },
];

export function RecoverySection() {
  const sectionRef = useRef(null);
  const mediaRef = useRef(null);

  useGSAP(
    () => {
      const recoveryMedia = sectionRef.current?.querySelector(
        "[data-recovery-media]",
      );

      gsap.from("[data-recovery-kicker]", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 72%",
        },
        opacity: 0,
        y: 24,
        duration: 0.7,
        ease: "power3.out",
      });

      gsap.from("[data-recovery-line]", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 68%",
        },
        yPercent: 115,
        stagger: 0.1,
        duration: 1.1,
        ease: "power4.out",
      });

      gsap.from("[data-recovery-copy]", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
        },
        opacity: 0,
        y: 28,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from("[data-capability]", {
        scrollTrigger: {
          trigger: "[data-capabilities]",
          start: "top 82%",
        },
        opacity: 0,
        x: -25,
        stagger: 0.08,
        duration: 0.7,
        ease: "power3.out",
      });

      gsap.from("[data-recovery-stat]", {
        scrollTrigger: {
          trigger: "[data-recovery-stats]",
          start: "top 84%",
        },
        opacity: 0,
        y: 30,
        stagger: 0.08,
        duration: 0.7,
        ease: "power3.out",
      });

      gsap.from(mediaRef.current, {
        scrollTrigger: {
          trigger: mediaRef.current,
          start: "top 82%",
        },
        clipPath: "inset(0 100% 0 0)",
        duration: 1.25,
        ease: "power4.inOut",
      });

      if (recoveryMedia) {
        gsap.to(recoveryMedia, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
          yPercent: 6,
          scale: 1.06,
          ease: "none",
        });
      }
    },
    {
      scope: sectionRef,
    },
  );

  return (
    <section
      ref={sectionRef}
      id="recovery"
      className="relative overflow-hidden bg-black py-24 text-white md:py-32"
    >
      <div className="absolute inset-0 recovery-grid opacity-40" />
      <div className="absolute -left-48 top-1/3 size-[34rem] rounded-full bg-red-600/10 blur-[150px]" />

      <div className="relative mx-auto w-[min(100%-2rem,1500px)]">
        <div className="grid gap-14 xl:grid-cols-[0.92fr_1.08fr] xl:items-center">
          <div>
            <div
              data-recovery-kicker
              className="mb-7 flex items-center gap-4 text-[0.68rem] font-black uppercase tracking-[0.2em] text-white/45"
            >
              <span className="h-px w-10 bg-red-600" />
              Recovery capability
            </div>

            <h2 className="font-black uppercase leading-[0.86] tracking-[-0.065em]">
              <span className="block overflow-hidden">
                <span
                  data-recovery-line
                  className="block text-[clamp(3.5rem,7vw,7.5rem)]"
                >
                  When the road
                </span>
              </span>

              <span className="block overflow-hidden">
                <span
                  data-recovery-line
                  className="block text-[clamp(3.5rem,7vw,7.5rem)] text-red-600"
                >
                  stops moving.
                </span>
              </span>

              <span className="block overflow-hidden">
                <span
                  data-recovery-line
                  className="block text-[clamp(3.5rem,7vw,7.5rem)]"
                >
                  We don’t.
                </span>
              </span>
            </h2>

            <p
              data-recovery-copy
              className="mt-8 max-w-xl text-base leading-7 text-white/58 md:text-lg md:leading-8"
            >
              From roadside breakdowns to accident recovery and scheduled
              vehicle movement, Hammer Head coordinates the right response,
              equipment, and communication from dispatch through delivery.
            </p>

            <div
              data-capabilities
              className="mt-10 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2"
            >
              {capabilities.map((capability) => (
                <div
                  key={capability}
                  data-capability
                  className="flex min-h-20 items-center gap-4 bg-[#080808] px-5 py-4"
                >
                  <span className="grid size-8 shrink-0 place-items-center bg-red-600">
                    <Check className="size-4" strokeWidth={3} />
                  </span>

                  <p className="text-xs font-bold uppercase leading-5 tracking-[0.11em] text-white/72">
                    {capability}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <a
                href="tel:+15160000000"
                className="group inline-flex min-h-14 items-center justify-center gap-3 bg-red-600 px-6 text-xs font-black uppercase tracking-[0.13em] transition-colors hover:bg-red-500"
              >
                Request recovery
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>

              <a
                href="#coverage"
                className="group inline-flex min-h-14 items-center justify-center gap-3 border border-white/15 px-6 text-xs font-black uppercase tracking-[0.13em] transition-colors hover:border-white/35 hover:bg-white/5"
              >
                View coverage
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>

          <div>
            <div
              ref={mediaRef}
              className="relative min-h-[520px] overflow-hidden border border-white/10 bg-[#090909] md:min-h-[680px]"
            >
              <video
                data-recovery-media
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                poster="/images/recovery-poster.jpg"
                aria-label="Hammer Head towing and vehicle recovery operation"
                className="absolute inset-0 h-full w-full object-cover"
              >
                <source src="/videos/truck1.mp4" type="video/mp4" />
              </video>

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/30" />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.35),transparent_45%)]" />

              <div className="absolute left-5 top-5 flex items-center gap-3 border border-white/15 bg-black/55 px-4 py-3 backdrop-blur-md">
                <span className="size-2 animate-pulse rounded-full bg-red-600" />
                <span className="text-[0.62rem] font-black uppercase tracking-[0.18em] text-white/65">
                  Recovery division
                </span>
              </div>

              <div
                data-recovery-stats
                className="absolute inset-x-0 bottom-0 grid gap-px bg-white/10 sm:grid-cols-3"
              >
                {metrics.map(({ icon: Icon, value, label }) => (
                  <motion.div
                    key={label}
                    data-recovery-stat
                    whileHover={{ backgroundColor: "rgba(239, 27, 36, 0.92)" }}
                    className="group bg-black/70 p-5 backdrop-blur-xl"
                  >
                    <Icon className="size-5 text-red-500 transition-colors group-hover:text-white" />

                    <p className="mt-6 text-2xl font-black uppercase tracking-[-0.05em]">
                      {value}
                    </p>

                    <p className="mt-2 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-white/42 group-hover:text-white/75">
                      {label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-x border-b border-white/10 px-5 py-4">
              <span className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-white/32">
                Field operations / Long Island
              </span>

              <span className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-red-500">
                HH—02
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}