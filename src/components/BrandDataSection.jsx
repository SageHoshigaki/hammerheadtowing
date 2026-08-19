import { useRef } from "react";
import {
  ArrowUpRight,
  Clock3,
  MapPinned,
  Route,
  ShieldCheck,
  Truck,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion } from "motion/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const dataPoints = [
  {
    value: "24/7",
    label: "Dispatch availability",
    description: "Emergency response day and night.",
    icon: Clock3,
  },
  {
    value: "NY",
    label: "Operating base",
    description: "Farmingdale, Long Island.",
    icon: MapPinned,
  },
  {
    value: "2",
    label: "Service divisions",
    description: "Recovery and prestige transport.",
    icon: Truck,
  },
  {
    value: "Multi-state",
    label: "Transport reach",
    description: "Local, regional, and interstate.",
    icon: Route,
  },
];

const capabilities = [
  "Emergency towing",
  "Roadside assistance",
  "Accident recovery",
  "Commercial transport",
  "Luxury vehicle transport",
  "Interstate logistics",
];

export function BrandDataSection() {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      gsap.from("[data-brand-logo]", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
        },
        opacity: 0,
        y: 50,
        scale: 0.96,
        duration: 1,
        ease: "power4.out",
      });

      gsap.from("[data-brand-copy]", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 72%",
        },
        opacity: 0,
        y: 34,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from("[data-data-card]", {
        scrollTrigger: {
          trigger: "[data-data-grid]",
          start: "top 80%",
        },
        opacity: 0,
        y: 45,
        stagger: 0.09,
        duration: 0.85,
        ease: "power3.out",
      });

      gsap.from("[data-capability-item]", {
        scrollTrigger: {
          trigger: "[data-capability-list]",
          start: "top 86%",
        },
        opacity: 0,
        x: -20,
        stagger: 0.06,
        duration: 0.65,
        ease: "power3.out",
      });
    },
    {
      scope: sectionRef,
    },
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-24 text-black md:py-32"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-black/10" />

      <div className="absolute right-[-8rem] top-16 size-[30rem] rounded-full bg-red-600/5 blur-[110px]" />

      <div className="mx-auto w-[min(100%-2rem,1500px)]">
        <div className="grid gap-14 border-b border-black/15 pb-16 xl:grid-cols-[0.8fr_1.2fr] xl:items-end">
          <div>
            <div
              data-brand-copy
              className="mb-7 flex items-center gap-4 text-[0.68rem] font-black uppercase tracking-[0.2em] text-black/40"
            >
              <span className="h-px w-10 bg-red-600" />
              One operation. Two revenue engines.
            </div>

            <div data-brand-logo className="max-w-md">
              <img
                src="/images/logo3.png"
                alt="Hammer Head Towing and Recovery"
                className="h-auto w-full object-contain"
              />
            </div>
          </div>

          <div>
            <p
              data-brand-copy
              className="max-w-4xl text-[clamp(2rem,4vw,4.8rem)] font-black uppercase leading-[0.95] tracking-[-0.055em]"
            >
              Built to respond fast.
              <span className="block text-red-600">
                Structured to grow.
              </span>
            </p>

            <div className="mt-8 grid gap-7 md:grid-cols-[1fr_auto] md:items-end">
              <p
                data-brand-copy
                className="max-w-2xl text-base leading-7 text-black/58 md:text-lg"
              >
                Hammer Head combines emergency towing, roadside recovery,
                commercial vehicle movement, and premium transport inside one
                disciplined operating system.
              </p>

              <a
                data-brand-copy
                href="#request-service"
                className="group inline-flex min-h-14 items-center justify-center gap-3 bg-red-600 px-6 text-xs font-black uppercase tracking-[0.13em] text-white transition-colors hover:bg-black"
              >
                Request service

                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </div>

        <div
          data-data-grid
          className="grid border-l border-t border-black/15 sm:grid-cols-2 xl:grid-cols-4"
        >
          {dataPoints.map(
            ({ value, label, description, icon: Icon }, index) => (
              <motion.article
                key={label}
                data-data-card
                whileHover={{
                  y: -6,
                }}
                transition={{
                  duration: 0.25,
                }}
                className="group relative min-h-[300px] overflow-hidden border-b border-r border-black/15 bg-white p-7 transition-colors duration-300 hover:bg-black hover:text-white"
              >
                <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-red-600 transition-transform duration-500 group-hover:scale-x-100" />

                <div className="flex items-start justify-between">
                  <span className="text-[0.62rem] font-black tracking-[0.18em] text-black/30 transition-colors group-hover:text-white/30">
                    0{index + 1}
                  </span>

                  <div className="grid size-12 place-items-center border border-black/15 transition-colors group-hover:border-red-500/50 group-hover:bg-red-600">
                    <Icon className="size-5" strokeWidth={1.7} />
                  </div>
                </div>

                <div className="mt-16">
                  <p className="text-[clamp(2rem,3.2vw,4rem)] font-black uppercase leading-none tracking-[-0.06em]">
                    {value}
                  </p>

                  <h3 className="mt-5 text-sm font-black uppercase tracking-[0.12em]">
                    {label}
                  </h3>

                  <p className="mt-3 max-w-xs text-sm leading-6 text-black/50 transition-colors group-hover:text-white/55">
                    {description}
                  </p>
                </div>
              </motion.article>
            ),
          )}
        </div>

        <div className="grid border-x border-b border-black/15 lg:grid-cols-[0.7fr_1.3fr]">
          <div className="border-b border-black/15 p-7 lg:border-b-0 lg:border-r md:p-9">
            <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-red-600">
              Core capability
            </p>

            <p className="mt-4 max-w-sm text-2xl font-black uppercase leading-[1.05] tracking-[-0.04em]">
              One brand built around recovery, movement, and trust.
            </p>
          </div>

          <div
            data-capability-list
            className="grid sm:grid-cols-2 xl:grid-cols-3"
          >
            {capabilities.map((capability) => (
              <div
                key={capability}
                data-capability-item
                className="flex min-h-20 items-center gap-4 border-b border-black/10 px-6 py-5 last:border-b-0 sm:border-r"
              >
                <span className="size-2 shrink-0 rounded-full bg-red-600" />

                <span className="text-xs font-black uppercase tracking-[0.12em] text-black/68">
                  {capability}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-black/15 pt-5">
          <div className="flex items-center gap-3 text-[0.62rem] font-black uppercase tracking-[0.16em] text-black/38">
            <ShieldCheck className="size-4 text-red-600" />
            Professional towing and vehicle transport
          </div>

          <span className="hidden text-[0.62rem] font-black uppercase tracking-[0.16em] text-black/28 sm:block">
            Farmingdale · Long Island · Interstate
          </span>
        </div>
      </div>
    </section>
  );
}