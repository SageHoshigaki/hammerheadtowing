// src/components/ServicesSection.jsx

import { useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CarFront,
  Construction,
  Gauge,
  LifeBuoy,
  MapPinned,
  Route,
  ShieldCheck,
  Truck,
  Wrench,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion } from "motion/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const services = [
  {
    number: "01",
    title: "Emergency towing",
    shortTitle: "Emergency",
    description:
      "Fast local response for disabled, damaged, and inoperable vehicles when timing matters.",
    icon: Truck,
    tags: ["24/7 response", "Local towing", "Disabled vehicles"],
    accent: "Immediate response",
  },
  {
    number: "02",
    title: "Accident recovery",
    shortTitle: "Recovery",
    description:
      "Controlled vehicle removal and recovery following collisions, roadway incidents, and difficult scenes.",
    icon: ShieldCheck,
    tags: ["Collision recovery", "Scene handling", "Secure removal"],
    accent: "Controlled recovery",
  },
  {
    number: "03",
    title: "Roadside assistance",
    shortTitle: "Roadside",
    description:
      "Jump-starts, tire changes, lockouts, fuel delivery, and direct roadside support.",
    icon: LifeBuoy,
    tags: ["Jump-starts", "Tire changes", "Lockouts"],
    accent: "Roadside support",
  },
  {
    number: "04",
    title: "Winching & extraction",
    shortTitle: "Winching",
    description:
      "Vehicle extraction from snow, mud, embankments, tight access points, and unstable positions.",
    icon: Construction,
    tags: ["Winch-outs", "Off-road recovery", "Difficult access"],
    accent: "Recovery capability",
  },
  {
    number: "05",
    title: "Local flatbed transport",
    shortTitle: "Flatbed",
    description:
      "Secure transport for passenger vehicles, specialty cars, damaged vehicles, and scheduled moves.",
    icon: CarFront,
    tags: ["Flatbed", "Low-clearance", "Scheduled transport"],
    accent: "Secure movement",
  },
  {
    number: "06",
    title: "Commercial logistics",
    shortTitle: "Commercial",
    description:
      "Recurring vehicle movement for dealerships, body shops, repair facilities, auctions, and fleets.",
    icon: Route,
    tags: ["Dealers", "Body shops", "Fleet accounts"],
    accent: "Recurring volume",
  },
  {
    number: "07",
    title: "Insurance & salvage",
    shortTitle: "Insurance",
    description:
      "Documentation-driven transport for total-loss vehicles, salvage, inspections, and collision-center transfers.",
    icon: Wrench,
    tags: ["Total loss", "Salvage", "Inspection moves"],
    accent: "Institutional work",
  },
  {
    number: "08",
    title: "Interstate transport",
    shortTitle: "Interstate",
    description:
      "Scheduled regional and interstate vehicle movement based on route, equipment, timing, and capacity.",
    icon: MapPinned,
    tags: ["Regional lanes", "Interstate", "Scheduled routes"],
    accent: "Route-based transport",
  },
  {
    number: "09",
    title: "Medium & heavy duty",
    shortTitle: "Heavy duty",
    description:
      "Commercial and larger-vehicle support where equipment, weight class, and current operating capacity permit.",
    icon: Gauge,
    tags: ["Capacity permitting", "Commercial vehicles", "Special equipment"],
    accent: "Capacity dependent",
  },
];

function ServiceCard({ service, index, onActivate }) {
  const cardRef = useRef(null);
  const spotlightRef = useRef(null);

  const Icon = service.icon;

  function handlePointerMove(event) {
    const card = cardRef.current;
    const spotlight = spotlightRef.current;

    if (!card || !spotlight) return;

    const rect = card.getBoundingClientRect();

    gsap.to(spotlight, {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      duration: 0.35,
      ease: "power3.out",
    });
  }

  return (
    <motion.article
      ref={cardRef}
      data-service-card
      onMouseEnter={() => onActivate(index)}
      onFocus={() => onActivate(index)}
      onPointerMove={handlePointerMove}
      whileHover={{ y: -8 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 24,
      }}
      className="group relative min-h-[430px] overflow-hidden border-b border-r border-black/15 bg-white p-7 text-black transition-colors duration-500 hover:bg-[#080808] hover:text-white md:p-9"
    >
      <div
        ref={spotlightRef}
        className="pointer-events-none absolute left-0 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
      />

      <div className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-red-600 transition-transform duration-700 ease-out group-hover:scale-x-100" />

      <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-red-600/0 to-transparent transition-all duration-700 group-hover:via-red-600/50" />

      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-start justify-between">
          <div>
            <span className="font-mono text-[0.62rem] font-bold tracking-[0.22em] text-black/35 transition-colors duration-500 group-hover:text-white/35">
              HH / {service.number}
            </span>

            <p className="mt-2 text-[0.58rem] font-black uppercase tracking-[0.19em] text-red-600">
              {service.accent}
            </p>
          </div>

          <motion.div
            whileHover={{ rotate: 6, scale: 1.05 }}
            className="grid size-14 place-items-center border border-black/15 bg-white transition-all duration-500 group-hover:border-red-500/50 group-hover:bg-red-600 group-hover:text-white"
          >
            <Icon className="size-5" strokeWidth={1.65} />
          </motion.div>
        </div>

        <div className="mt-auto pt-24">
          <h3 className="max-w-sm text-[clamp(1.9rem,2.6vw,3.2rem)] font-black uppercase leading-[0.9] tracking-[-0.055em]">
            {service.title}
          </h3>

          <p className="mt-6 max-w-md text-sm leading-6 text-black/52 transition-colors duration-500 group-hover:text-white/55">
            {service.description}
          </p>

          <div className="mt-7 flex flex-wrap gap-2">
            {service.tags.map((tag) => (
              <span
                key={tag}
                className="border border-black/10 px-3 py-2 text-[0.56rem] font-black uppercase tracking-[0.15em] text-black/40 transition-all duration-500 group-hover:border-white/15 group-hover:text-white/40"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-black/10 pt-5 transition-colors duration-500 group-hover:border-white/10">
          <span className="text-[0.58rem] font-black uppercase tracking-[0.17em] text-black/35 transition-colors group-hover:text-white/35">
            View capability
          </span>

          <ArrowUpRight className="size-5 translate-y-2 text-red-600 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100" />
        </div>
      </div>
    </motion.article>
  );
}

export function ServicesSection() {
  const sectionRef = useRef(null);
  const progressRef = useRef(null);

  const [activeService, setActiveService] = useState(0);

  useGSAP(
    () => {
      const section = sectionRef.current;

      gsap.from("[data-services-eyebrow]", {
        scrollTrigger: {
          trigger: section,
          start: "top 78%",
        },
        opacity: 0,
        x: -30,
        duration: 0.75,
        ease: "power4.out",
      });

      gsap.from("[data-services-title-line]", {
        scrollTrigger: {
          trigger: section,
          start: "top 74%",
        },
        yPercent: 115,
        stagger: 0.12,
        duration: 1.05,
        ease: "power4.out",
      });

      gsap.from("[data-services-intro]", {
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
        },
        opacity: 0,
        y: 30,
        duration: 0.85,
        ease: "power3.out",
      });

      gsap.from("[data-service-index]", {
        scrollTrigger: {
          trigger: "[data-services-grid]",
          start: "top 82%",
        },
        opacity: 0,
        x: -25,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from("[data-service-card]", {
        scrollTrigger: {
          trigger: "[data-services-grid]",
          start: "top 80%",
        },
        opacity: 0,
        y: 80,
        rotateX: 5,
        transformOrigin: "50% 100%",
        stagger: 0.08,
        duration: 1,
        ease: "power4.out",
      });

      gsap.from("[data-services-marquee]", {
        scrollTrigger: {
          trigger: "[data-services-marquee]",
          start: "top 92%",
        },
        opacity: 0,
        duration: 0.8,
      });

      gsap.to("[data-marquee-track]", {
        xPercent: -50,
        duration: 26,
        repeat: -1,
        ease: "none",
      });

      gsap.from("[data-services-footer]", {
        scrollTrigger: {
          trigger: "[data-services-footer]",
          start: "top 88%",
        },
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: "power3.out",
      });

      gsap.to(progressRef.current, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top center",
          end: "bottom center",
          scrub: true,
        },
      });
    },
    {
      scope: sectionRef,
    },
  );

  const active = services[activeService];

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative overflow-hidden bg-[#F2F0EB] py-24 text-black md:py-32 lg:py-40"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-black/12" />

      <div className="pointer-events-none absolute right-[-16rem] top-20 size-[42rem] rounded-full bg-red-600/[0.06] blur-[110px]" />

      <div className="pointer-events-none absolute left-[8%] top-[42%] h-[28rem] w-[28rem] rounded-full bg-black/[0.025] blur-[120px]" />

      <div className="absolute bottom-0 left-5 top-0 hidden w-px bg-black/10 xl:block">
        <div
          ref={progressRef}
          className="h-full w-full origin-top scale-y-0 bg-red-600"
        />
      </div>

      <div className="mx-auto w-[min(calc(100%-2rem),1500px)]">
        <div className="grid border-l border-black/15 lg:grid-cols-[260px_1fr]">
          <aside
            data-service-index
            className="relative hidden border-r border-black/15 bg-[#ECEAE5] lg:block"
          >
            <div className="sticky top-24 p-7">
              <p className="text-[0.58rem] font-black uppercase tracking-[0.22em] text-black/35">
                Service index
              </p>

              <div className="mt-7 space-y-1">
                {services.map((service, index) => (
                  <button
                    key={service.number}
                    type="button"
                    onClick={() => setActiveService(index)}
                    className={`group flex w-full items-center justify-between border-b px-0 py-4 text-left transition-all duration-300 ${
                      activeService === index
                        ? "border-red-600 text-black"
                        : "border-black/10 text-black/35 hover:text-black"
                    }`}
                  >
                    <span className="text-[0.61rem] font-black uppercase tracking-[0.15em]">
                      {service.shortTitle}
                    </span>

                    <span
                      className={`font-mono text-[0.58rem] transition-colors ${
                        activeService === index
                          ? "text-red-600"
                          : "text-black/25"
                      }`}
                    >
                      {service.number}
                    </span>
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={active.number}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  className="mt-10 border-l-2 border-red-600 pl-4"
                >
                  <p className="text-[0.56rem] font-black uppercase tracking-[0.18em] text-red-600">
                    Active capability
                  </p>

                  <p className="mt-3 text-sm font-semibold uppercase leading-5">
                    {active.title}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </aside>

          <div
            data-services-grid
            className="grid border-t border-black/15 sm:grid-cols-2 xl:grid-cols-3"
          >
            {services.map((service, index) => (
              <ServiceCard
                key={service.title}
                service={service}
                index={index}
                onActivate={setActiveService}
              />
            ))}
          </div>
        </div>
      </div>

      <div
        data-services-marquee
        className="mt-16 overflow-hidden border-y border-black/15 bg-black py-5 text-white md:mt-24"
      >
        <div
          data-marquee-track
          className="flex w-max items-center whitespace-nowrap"
        >
          {[0, 1].map((group) => (
            <div
              key={group}
              className="flex items-center gap-10 pr-10 text-[0.68rem] font-black uppercase tracking-[0.2em]"
            >
              <span>Emergency towing</span>
              <span className="size-1.5 bg-red-600" />
              <span>Accident recovery</span>
              <span className="size-1.5 bg-red-600" />
              <span>Roadside assistance</span>
              <span className="size-1.5 bg-red-600" />
              <span>Commercial logistics</span>
              <span className="size-1.5 bg-red-600" />
              <span>Interstate transport</span>
              <span className="size-1.5 bg-red-600" />
              <span>24/7 dispatch</span>
              <span className="size-1.5 bg-red-600" />
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto w-[min(calc(100%-2rem),1500px)]">
        <div
          data-services-footer
          className="relative overflow-hidden border-x border-b border-black/15 bg-red-600 p-7 text-white md:p-10 lg:p-14"
        >
          <div className="pointer-events-none absolute right-[-4%] top-1/2 -translate-y-1/2 text-[clamp(8rem,22vw,24rem)] font-black leading-none tracking-[-0.09em] text-black/[0.08]">
            HH
          </div>

          <div className="relative z-10 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-[0.61rem] font-black uppercase tracking-[0.22em] text-white/60">
                Immediate assistance
              </p>

              <h3 className="mt-5 max-w-4xl text-[clamp(2.6rem,5vw,5.8rem)] font-black uppercase leading-[0.88] tracking-[-0.06em]">
                Get the right equipment moving.
              </h3>

              <p className="mt-6 max-w-xl text-sm leading-6 text-white/65 md:text-base">
                Speak directly with Hammer Head dispatch or begin a recovery
                request with your location and vehicle details.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <motion.a
                href="tel:+16313005559"
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.985 }}
                className="group inline-flex min-h-16 items-center justify-between gap-10 bg-white px-6 text-[0.66rem] font-black uppercase tracking-[0.16em] text-black transition-colors hover:bg-black hover:text-white"
              >
                Call 24/7 dispatch
                <ArrowUpRight className="size-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </motion.a>

              <motion.a
                href="/request-recovery"
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.985 }}
                className="group inline-flex min-h-16 items-center justify-between gap-10 border border-white/30 px-6 text-[0.66rem] font-black uppercase tracking-[0.16em] text-white transition-colors hover:bg-white hover:text-black"
              >
                Request recovery
                <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
