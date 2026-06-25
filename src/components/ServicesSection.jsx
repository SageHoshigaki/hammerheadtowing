import { useRef } from "react";
import {
  ArrowUpRight,
  CarFront,
  Clock3,
  Route,
  ShieldCheck,
  Truck,
  Wrench,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion } from "motion/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const services = [
  {
    number: "01",
    title: "Emergency towing",
    description:
      "Fast local response for breakdowns, disabled vehicles, and urgent roadside situations.",
    icon: Truck,
  },
  {
    number: "02",
    title: "Accident recovery",
    description:
      "Professional recovery, winching, and vehicle removal with careful scene handling.",
    icon: ShieldCheck,
  },
  {
    number: "03",
    title: "Roadside assistance",
    description:
      "Jump-starts, tire changes, lockouts, fuel delivery, and roadside support.",
    icon: Wrench,
  },
  {
    number: "04",
    title: "Flatbed transport",
    description:
      "Secure movement for passenger vehicles, specialty cars, and non-running vehicles.",
    icon: CarFront,
  },
  {
    number: "05",
    title: "Commercial towing",
    description:
      "Support for fleets, work vehicles, dealerships, repair shops, and commercial accounts.",
    icon: Route,
  },
  {
    number: "06",
    title: "24/7 dispatch",
    description:
      "Direct response when timing matters, with emergency availability day and night.",
    icon: Clock3,
  },
];

export function ServicesSection() {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      gsap.from("[data-services-header]", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from("[data-service-card]", {
        scrollTrigger: {
          trigger: "[data-services-grid]",
          start: "top 78%",
        },
        opacity: 0,
        y: 60,
        stagger: 0.1,
        duration: 0.9,
        ease: "power3.out",
      });

      gsap.from("[data-services-footer]", {
        scrollTrigger: {
          trigger: "[data-services-footer]",
          start: "top 88%",
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
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
      id="services"
      className="relative overflow-hidden bg-white py-24 text-black md:py-32"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-black/10" />

      <div className="absolute right-[-8rem] top-24 size-96 rounded-full bg-red-600/5 blur-3xl" />

      <div className="mx-auto w-[min(100%-2rem,1500px)]">
        <div
          data-services-header
          className="grid gap-10 border-b border-black/15 pb-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-end"
        >
          <div>
            <div className="mb-5 flex items-center gap-4 text-[0.68rem] font-black uppercase tracking-[0.2em] text-black/45">
              <span className="h-px w-10 bg-red-600" />
              Core services
            </div>

            <p className="max-w-sm text-sm leading-6 text-black/55">
              Towing, recovery, roadside response, and commercial transport
              built around speed, care, and direct communication.
            </p>
          </div>

          <h2 className="max-w-4xl text-balance text-[clamp(3rem,6vw,6.8rem)] font-black uppercase leading-[0.88] tracking-[-0.065em]">
            The equipment.
            <span className="block text-red-600">The response.</span>
            The execution.
          </h2>
        </div>

        <div
          data-services-grid
          className="grid border-l border-t border-black/15 sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map(({ number, title, description, icon: Icon }) => (
            <motion.article
              key={title}
              data-service-card
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25 }}
              className="group relative min-h-[330px] overflow-hidden border-b border-r border-black/15 bg-white p-7 transition-colors duration-300 hover:bg-black hover:text-white md:p-8"
            >
              <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-red-600 transition-transform duration-500 group-hover:scale-x-100" />

              <div className="flex items-start justify-between">
                <span className="text-[0.65rem] font-black tracking-[0.18em] text-black/35 transition-colors group-hover:text-white/35">
                  {number}
                </span>

                <div className="grid size-12 place-items-center border border-black/15 transition-colors group-hover:border-red-500/50 group-hover:bg-red-600">
                  <Icon className="size-5" strokeWidth={1.7} />
                </div>
              </div>

              <div className="mt-20">
                <h3 className="max-w-xs text-2xl font-black uppercase leading-[0.95] tracking-[-0.035em] md:text-3xl">
                  {title}
                </h3>

                <p className="mt-5 max-w-sm text-sm leading-6 text-black/55 transition-colors group-hover:text-white/60">
                  {description}
                </p>
              </div>

              <ArrowUpRight className="absolute bottom-7 right-7 size-5 translate-y-2 opacity-0 text-red-500 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100" />
            </motion.article>
          ))}
        </div>

        <div
          data-services-footer
          className="grid gap-8 border-b border-l border-r border-black/15 p-7 md:grid-cols-[1fr_auto] md:items-center md:p-8"
        >
          <div>
            <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-red-600">
              Need immediate help?
            </p>

            <p className="mt-2 max-w-2xl text-lg font-semibold leading-7 md:text-xl">
              Speak directly with dispatch and get the right equipment moving.
            </p>
          </div>

          <a
            href="tel:+15160000000"
            className="group inline-flex min-h-14 items-center justify-center gap-3 bg-red-600 px-6 text-xs font-black uppercase tracking-[0.14em] text-white transition-colors hover:bg-black"
          >
            Call 24/7 dispatch

            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
}