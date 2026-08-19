// src/pages/CompanyPage.jsx

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Camera,
  MapPinned,
  Phone,
  ShieldCheck,
  Truck,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const standards = [
  {
    icon: ShieldCheck,
    title: "Controlled recovery",
    copy: "Every job begins with the vehicle, roadway position, access conditions, and equipment required.",
  },
  {
    icon: Truck,
    title: "Right equipment",
    copy: "Recovery and transport decisions are based on the actual job—not assumptions.",
  },
  {
    icon: BadgeCheck,
    title: "Professional handling",
    copy: "Clear communication, careful loading, documentation, and accountable service.",
  },
];

const audiences = [
  "Local drivers",
  "Dealerships",
  "Body shops",
  "Repair facilities",
  "Auctions",
  "Commercial fleets",
  "Insurance partners",
  "Vehicle owners",
];

export default function CompanyPage({
  logoSrc = "/images/logo2.png",
  phoneNumber = "(631) 555-0199",
}) {
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .from("[data-company-kicker]", {
          opacity: 0,
          x: -30,
          duration: 0.7,
        })
        .from(
          "[data-company-title]",
          {
            opacity: 0,
            y: 70,
            duration: 1,
          },
          "-=0.35",
        )
        .from(
          "[data-company-copy]",
          {
            opacity: 0,
            y: 25,
            duration: 0.8,
          },
          "-=0.5",
        )
        .from(
          "[data-company-image]",
          {
            opacity: 0,
            scale: 0.96,
            duration: 1,
          },
          "-=0.7",
        );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={rootRef} className="min-h-screen bg-[#050505] text-[#F4F1EC]">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="grid min-h-[740px] lg:grid-cols-2">
          <div className="relative z-10 flex flex-col justify-center px-5 py-20 md:px-10 lg:px-[max(40px,calc((100vw-1450px)/2))]">
            <div
              data-company-kicker
              className="flex items-center gap-3 border-l-2 border-[#D3131A] pl-4"
            >
              <Building2 className="h-4 w-4 text-[#D3131A]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/40">
                Hammer Head / Farmingdale, New York
              </span>
            </div>

            <h1
              data-company-title
              className="mt-8 text-5xl font-semibold uppercase leading-[0.87] tracking-[-0.065em] sm:text-7xl lg:text-[6.8rem]"
            >
              Forged for
              <span className="block text-[#D3131A]">the road.</span>
            </h1>

            <p
              data-company-copy
              className="mt-8 max-w-xl border-l border-white/15 pl-5 text-base leading-7 text-white/52 sm:text-lg"
            >
              Hammer Head is built around readiness, controlled vehicle
              handling, and direct communication—from urgent local recoveries to
              scheduled commercial vehicle movement.
            </p>
          </div>

          <div data-company-image className="relative min-h-[580px]">
            <img
              src="/images/company/logo2.png"
              alt="Hammer Head recovery truck"
              className="absolute inset-0 h-full w-full object-cover grayscale"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-black/20 to-transparent lg:from-[#050505]/40" />

            <div className="absolute bottom-0 left-0 right-0 flex justify-between border-t border-white/15 bg-black/65 px-5 py-4 text-[9px] font-bold uppercase tracking-[0.22em] text-white/40 backdrop-blur-xl">
              <span>Field operations</span>
              <span>Long Island</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1450px] gap-12 px-5 py-20 md:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:py-28">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#D3131A]">
            The operation
          </p>

          <h2 className="mt-5 text-4xl font-semibold uppercase leading-[0.92] tracking-[-0.05em] sm:text-6xl">
            More than a truck and a phone.
          </h2>
        </div>

        <div className="space-y-7 text-base leading-8 text-white/55">
          <p>
            Hammer Head serves drivers who need immediate help, vehicle owners
            who need careful transport, and businesses that rely on consistent
            vehicle movement.
          </p>

          <p>
            The company is being built around multiple service capabilities:
            emergency towing, roadside assistance, accident recovery, scheduled
            flatbed work, commercial logistics, and institutional vehicle
            movement.
          </p>

          <p>
            The goal is straightforward: respond professionally, use the right
            equipment, document the work, and leave the customer with confidence
            in how the vehicle was handled.
          </p>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#090909] px-5 py-20 md:px-10">
        <div className="mx-auto max-w-[1450px]">
          <div className="grid gap-px border border-white/10 bg-white/10 md:grid-cols-3">
            {standards.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.article
                  key={item.title}
                  whileHover={{ y: -5 }}
                  className="bg-[#090909] p-7 sm:p-10"
                >
                  <div className="flex items-center justify-between">
                    <Icon className="h-6 w-6 text-[#D3131A]" />
                    <span className="font-mono text-xs text-white/20">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="mt-12 text-2xl font-semibold uppercase tracking-[-0.03em]">
                    {item.title}
                  </h3>

                  <p className="mt-4 text-sm leading-6 text-white/45">
                    {item.copy}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1450px] px-5 py-20 md:px-10 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <div className="flex items-center gap-3 text-[#D3131A]">
              <Users className="h-5 w-5" />
              <span className="text-[10px] font-bold uppercase tracking-[0.24em]">
                Who we serve
              </span>
            </div>

            <h2 className="mt-6 text-4xl font-semibold uppercase leading-[0.92] tracking-[-0.05em] sm:text-6xl">
              One operation. Multiple demands.
            </h2>
          </div>

          <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2">
            {audiences.map((audience) => (
              <div
                key={audience}
                className="flex min-h-24 items-center justify-between bg-[#090909] px-5"
              >
                <span className="text-sm font-semibold uppercase">
                  {audience}
                </span>

                <ArrowRight className="h-4 w-4 text-[#D3131A]" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#090909] px-5 py-20 md:px-10">
        <div className="mx-auto max-w-[1450px]">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <div className="flex items-center gap-3 text-[#D3131A]">
                <Camera className="h-5 w-5" />
                <span className="text-[10px] font-bold uppercase tracking-[0.24em]">
                  Real work
                </span>
              </div>

              <h2 className="mt-5 text-4xl font-semibold uppercase tracking-[-0.05em] sm:text-6xl">
                Recovery in the field.
              </h2>
            </div>

            <p className="max-w-xl text-sm leading-6 text-white/45">
              Replace these images with actual Hammer Head recoveries, roadside
              calls, loading procedures, commercial work, and completed vehicle
              deliveries.
            </p>
          </div>

          <div className="mt-12 grid auto-rows-[260px] gap-3 md:grid-cols-3">
            <img
              src="/images/company/gallery-1.png"
              alt=""
              className="h-full w-full object-cover grayscale md:row-span-2"
            />
            <img
              src="/images/company/gallery-2.png"
              alt=""
              className="h-full w-full object-cover grayscale"
            />
            <img
              src="/images/company/gallery-3.png"
              alt=""
              className="h-full w-full object-cover grayscale"
            />
            <img
              src="/images/company/gallery-4.png"
              alt=""
              className="h-full w-full object-cover grayscale md:col-span-2"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1450px] gap-px border-x border-white/10 bg-white/10 md:grid-cols-2">
        <div className="bg-[#050505] p-8 sm:p-12">
          <MapPinned className="h-6 w-6 text-[#D3131A]" />

          <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.25em] text-white/30">
            Service territory
          </p>

          <h3 className="mt-4 text-3xl font-semibold uppercase tracking-[-0.04em]">
            Long Island and scheduled regional routes.
          </h3>

          <p className="mt-5 max-w-lg text-sm leading-6 text-white/45">
            Contact dispatch to confirm current coverage, equipment
            availability, and transport scheduling.
          </p>
        </div>

        <div className="bg-[#D3131A] p-8 text-white sm:p-12">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/60">
            Need assistance?
          </p>

          <h3 className="mt-4 text-4xl font-semibold uppercase leading-[0.92] tracking-[-0.05em]">
            Start with your exact location.
          </h3>

          <Link
            to="/request-recovery"
            className="mt-10 flex items-center justify-between bg-white px-5 py-4 text-[11px] font-bold uppercase tracking-[0.17em] text-black transition hover:bg-black hover:text-white"
          >
            Request recovery
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
