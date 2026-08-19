import { useRef } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  MapPin,
  PhoneCall,
  Truck,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion } from "motion/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const steps = [
  {
    number: "01",
    title: "Call dispatch",
    description:
      "Tell us what happened, where you are, and what type of vehicle needs help.",
    icon: PhoneCall,
  },
  {
    number: "02",
    title: "Confirm location",
    description:
      "We verify the pickup point, destination, vehicle condition, and required equipment.",
    icon: MapPin,
  },
  {
    number: "03",
    title: "We mobilize",
    description:
      "The right truck and operator are assigned for towing, recovery, or transport.",
    icon: Truck,
  },
  {
    number: "04",
    title: "Job completed",
    description:
      "The vehicle is secured, delivered, documented, and the service is closed out.",
    icon: CheckCircle2,
  },
];

export function ProcessSection() {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      gsap.from("[data-process-header]", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
        },
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: "power3.out",
      });

      gsap.from("[data-process-step]", {
        scrollTrigger: {
          trigger: "[data-process-grid]",
          start: "top 80%",
        },
        opacity: 0,
        y: 50,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from("[data-process-line]", {
        scrollTrigger: {
          trigger: "[data-process-grid]",
          start: "top 80%",
        },
        scaleX: 0,
        transformOrigin: "left",
        duration: 1.4,
        ease: "power3.inOut",
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-24 text-black md:py-32"
    >
      <div className="mx-auto w-[min(100%-2rem,1500px)]">
        <div
          data-process-header
          className="grid gap-10 border-b border-black/15 pb-14 lg:grid-cols-[0.75fr_1.25fr] lg:items-end"
        >
          <div>
            <div className="mb-5 flex items-center gap-4 text-[0.68rem] font-black uppercase tracking-[0.2em] text-black/42">
              <span className="h-px w-10 bg-red-600" />
              From call to recovery
            </div>

            <p className="max-w-sm text-sm leading-6 text-black/52">
              Clear communication, direct dispatch, and the right equipment
              without unnecessary steps.
            </p>
          </div>

          <h2 className="max-w-4xl text-[clamp(3.2rem,6vw,7rem)] font-black uppercase leading-[0.88] tracking-[-0.065em]">
            Help should move
            <span className="block text-red-600">as fast as the problem.</span>
          </h2>
        </div>

        <div
          data-process-grid
          className="relative grid border-l border-t border-black/15 md:grid-cols-2 xl:grid-cols-4"
        >
          <div
            data-process-line
            className="absolute left-0 top-0 hidden h-1 w-full bg-red-600 xl:block"
          />

          {steps.map(({ number, title, description, icon: Icon }) => (
            <motion.article
              key={number}
              data-process-step
              whileHover={{ y: -6 }}
              className="group relative min-h-[340px] border-b border-r border-black/15 bg-white p-7 transition-colors duration-300 hover:bg-black hover:text-white md:p-8"
            >
              <div className="flex items-start justify-between">
                <span className="text-[0.64rem] font-black tracking-[0.18em] text-black/30 transition-colors group-hover:text-white/30">
                  {number}
                </span>

                <div className="grid size-12 place-items-center border border-black/15 transition-all duration-300 group-hover:border-red-600 group-hover:bg-red-600">
                  <Icon className="size-5" strokeWidth={1.7} />
                </div>
              </div>

              <div className="mt-24">
                <h3 className="text-2xl font-black uppercase leading-[0.95] tracking-[-0.04em] md:text-3xl">
                  {title}
                </h3>

                <p className="mt-5 max-w-xs text-sm leading-6 text-black/52 transition-colors group-hover:text-white/58">
                  {description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="flex flex-col gap-6 border-x border-b border-black/15 p-7 md:flex-row md:items-center md:justify-between md:p-8">
          <p className="max-w-2xl text-lg font-semibold leading-7">
            Need immediate towing or recovery support?
          </p>

          <a
            href="tel:+15160000000"
            className="group inline-flex min-h-14 items-center justify-center gap-3 bg-red-600 px-6 text-xs font-black uppercase tracking-[0.14em] text-white transition-colors hover:bg-black"
          >
            Call dispatch
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
}