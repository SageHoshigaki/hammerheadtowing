// src/pages/PrestigeServicesPage.jsx

import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Camera,
  CarFront,
  Check,
  Clapperboard,
  Gauge,
  MapPinned,
  Sparkles,
  Store,
  Warehouse,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion } from "motion/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CHAMPAGNE = "#C9B896";
const IVORY = "#F4F0E8";
const INK = "#080807";

const services = [
  {
    number: "01",
    shortTitle: "Dedicated",
    title: "Dedicated single-vehicle transport",
    description:
      "A considered transport plan shaped around one vehicle, one route, and the particular requirements of the movement.",
    idealFor:
      "Exotic vehicles, private collections, dealers, and time-sensitive movements.",
    considerations: [
      "Vehicle-specific planning",
      "Scheduled collection",
      "Limited handling",
      "Direct communication",
    ],
    icon: CarFront,
    image: "/images/prestige/services/dedicatedtrabsport.png",
  },
  {
    number: "02",
    shortTitle: "Enclosed",
    title: "Enclosed vehicle transport",
    description:
      "Protected movement for vehicles requiring separation from weather, road debris, and ordinary open-carrier exposure.",
    idealFor:
      "Luxury, exotic, collector, classic, restored, and specialty vehicles.",
    considerations: [
      "Enclosed availability",
      "Trailer access",
      "Vehicle dimensions",
      "Loading clearance",
    ],
    icon: Warehouse,
    image: "/images/prestige/Enclosedtransport.png",
  },
  {
    number: "03",
    shortTitle: "Exotic",
    title: "Exotic and luxury vehicles",
    description:
      "Transport coordinated around low clearance, specialty wheels, carbon components, custom finishes, and vehicle-specific restrictions.",
    idealFor:
      "Supercars, premium SUVs, luxury saloons, and high-value inventory.",
    considerations: [
      "Splitter clearance",
      "Wheel protection",
      "Air suspension",
      "Handling notes",
    ],
    icon: Sparkles,
    image: "/images/prestige/Exoticandluxury.png",
  },
  {
    number: "04",
    shortTitle: "Collector",
    title: "Collector and classic vehicles",
    description:
      "Deliberate movement for irreplaceable, restored, vintage, and historically significant vehicles.",
    idealFor:
      "Private collections, museums, auctions, storage facilities, and restoration ateliers.",
    considerations: [
      "Condition documentation",
      "Non-standard controls",
      "Battery considerations",
      "Indoor access",
    ],
    icon: BadgeCheck,
    image: "/images/prestige/Collectorandclassic.png",
  },
  {
    number: "05",
    shortTitle: "Clearance",
    title: "Low-clearance handling",
    description:
      "Loading plans built around approach angle, ride height, aerodynamic components, and restricted vehicle geometry.",
    idealFor:
      "Exotics, track cars, modified vehicles, and vehicles with delicate lower bodywork.",
    considerations: [
      "Ground clearance",
      "Approach angle",
      "Liftgate requirements",
      "Low-angle loading",
    ],
    icon: Gauge,
    image: "/images/prestige/Low-clearancehandling.png",
  },
  {
    number: "06",
    shortTitle: "Dealer",
    title: "Dealer and auction transfers",
    description:
      "Scheduled movement between dealerships, auctions, storage, service departments, and customer delivery points.",
    idealFor:
      "Dealers, brokers, auctions, body shops, and vehicle customization companies.",
    considerations: [
      "Release documents",
      "Collection contacts",
      "Lot access",
      "Delivery windows",
    ],
    icon: Store,
    image: "/images/prestige/Dealerauction.png",
  },
  {
    number: "07",
    shortTitle: "Events",
    title: "Event, film and showroom delivery",
    description:
      "Planned arrivals and departures for exhibitions, productions, launches, private events, and showroom placements.",
    idealFor:
      "Film productions, agencies, event teams, brands, dealerships, and collectors.",
    considerations: [
      "Venue access",
      "Exact timing",
      "Indoor delivery",
      "Production coordination",
    ],
    icon: Clapperboard,
    image: "/images/prestige/event.png",
  },
  {
    number: "08",
    shortTitle: "Interstate",
    title: "Regional and interstate transport",
    description:
      "Route-led vehicle movement evaluated around timing, distance, equipment, availability, and return logistics.",
    idealFor:
      "Private clients, dealers, collectors, auctions, and recurring commercial accounts.",
    considerations: [
      "Route availability",
      "Scheduling flexibility",
      "Origin access",
      "Equipment confirmation",
    ],
    icon: MapPinned,
    image: "/images/prestige/Interstatetransport.png",
  },
];

const process = [
  {
    number: "01",
    title: "Vehicle review",
    description:
      "Profile, condition, dimensions, clearance, and handling requirements are considered before the movement is proposed.",
  },
  {
    number: "02",
    title: "Route planning",
    description:
      "Origin, destination, property access, timing, and operating constraints are reviewed together.",
  },
  {
    number: "03",
    title: "Equipment confirmation",
    description:
      "The transport method, loading approach, and equipment requirements are confirmed.",
  },
  {
    number: "04",
    title: "Condition record",
    description:
      "Mileage, visible condition, photographs, and special notes may be documented before collection.",
  },
  {
    number: "05",
    title: "Secure loading",
    description:
      "The vehicle is loaded according to its clearance, condition, geometry, and restraint requirements.",
  },
  {
    number: "06",
    title: "Client communication",
    description:
      "A direct Prestige contact manages timing, access, updates, and delivery coordination.",
  },
  {
    number: "07",
    title: "Delivery inspection",
    description:
      "Condition and completion are reviewed with the receiving party at destination.",
  },
];

const vehicleProfiles = [
  "Supercars",
  "Luxury saloons",
  "Collector vehicles",
  "Classic vehicles",
  "Modified vehicles",
  "Low-clearance vehicles",
  "Track and race cars",
  "Dealer inventory",
];

const documentation = [
  "Pre-collection condition photographs",
  "Recorded vehicle mileage",
  "Visible-condition notation",
  "Collection authorization",
  "Special handling instructions",
  "Delivery photographs",
  "Delivery acknowledgment",
  "Timestamped movement record",
];

function ServicePanel({ service, index, active, onActivate }) {
  const Icon = service.icon;

  return (
    <motion.article
      data-service-card
      onMouseEnter={() => onActivate(index)}
      onFocus={() => onActivate(index)}
      whileHover={{ y: -5 }}
      transition={{
        type: "spring",
        stiffness: 220,
        damping: 26,
      }}
      className="group relative min-h-[620px] overflow-hidden border-b border-r border-white/[0.08] bg-[#0A0A09]"
    >
      <img
        src={service.image}
        alt={service.title}
        className="absolute inset-0 h-full w-full object-cover grayscale transition duration-[1400ms] ease-out group-hover:scale-[1.035] group-hover:grayscale-0"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/15" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />

      <div
        className={`absolute inset-x-0 top-0 h-px origin-left bg-[#C9B896] transition-transform duration-700 ${
          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        }`}
      />

      <div className="relative z-10 flex min-h-[620px] flex-col p-7 md:p-9 lg:p-10">
        <div className="flex items-start justify-between">
          <div>
            <span className="font-prestige-sans text-[0.54rem] font-medium uppercase tracking-[0.24em] text-white/35">
              Prestige / {service.number}
            </span>

            <p className="mt-3 text-[0.54rem] font-medium uppercase tracking-[0.24em] text-[#C9B896]">
              Private transport service
            </p>
          </div>

          <div className="grid size-11 place-items-center border border-white/14 bg-black/25 text-[#C9B896] backdrop-blur-sm transition duration-500 group-hover:border-[#C9B896] group-hover:bg-[#C9B896] group-hover:text-black">
            <Icon className="size-[18px]" strokeWidth={1.35} />
          </div>
        </div>

        <div className="mt-auto">
          <h2 className="font-prestige-serif max-w-xl text-[clamp(2.8rem,4vw,4.7rem)] font-normal leading-[0.9] tracking-[-0.035em] text-[#F4F0E8]">
            {service.title}
          </h2>

          <p className="mt-7 max-w-xl text-[0.92rem] font-light leading-7 text-white/52">
            {service.description}
          </p>

          <div className="mt-8 border-l border-[#C9B896]/65 pl-5">
            <p className="text-[0.54rem] font-medium uppercase tracking-[0.23em] text-white/28">
              Considered for
            </p>

            <p className="font-prestige-serif mt-3 max-w-xl text-xl leading-[1.25] text-white/74">
              {service.idealFor}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3">
            {service.considerations.map((item) => (
              <span
                key={item}
                className="border-b border-white/15 pb-1 text-[0.52rem] font-medium uppercase tracking-[0.19em] text-white/38"
              >
                {item}
              </span>
            ))}
          </div>

          <Link
            to={`/prestige/request?service=${encodeURIComponent(
              service.title,
            )}`}
            className="mt-10 flex items-center justify-between border-t border-white/10 pt-6 text-[0.57rem] font-medium uppercase tracking-[0.22em] text-white/48 transition-colors duration-300 hover:text-white"
          >
            Enquire about this service
            <ArrowUpRight className="size-4 text-[#C9B896] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export function PrestigeServicesPage() {
  const rootRef = useRef(null);
  const [activeService, setActiveService] = useState(0);

  useGSAP(
    () => {
      gsap
        .timeline({
          defaults: {
            ease: "power4.out",
          },
        })
        .from("[data-services-eyebrow]", {
          opacity: 0,
          y: 18,
          duration: 0.8,
        })
        .from(
          "[data-services-title-line]",
          {
            yPercent: 110,
            stagger: 0.12,
            duration: 1.15,
          },
          "-=0.45",
        )
        .from(
          "[data-services-copy]",
          {
            opacity: 0,
            y: 28,
            duration: 0.9,
          },
          "-=0.55",
        )
        .from(
          "[data-services-actions]",
          {
            opacity: 0,
            y: 22,
            duration: 0.8,
          },
          "-=0.55",
        );

      gsap.utils.toArray("[data-reveal]").forEach((element) => {
        gsap.from(element, {
          scrollTrigger: {
            trigger: element,
            start: "top 82%",
          },
          opacity: 0,
          y: 55,
          duration: 1,
          ease: "power4.out",
        });
      });

      gsap.from("[data-service-card]", {
        scrollTrigger: {
          trigger: "[data-services-grid]",
          start: "top 80%",
        },
        opacity: 0,
        y: 70,
        stagger: 0.09,
        duration: 1,
        ease: "power4.out",
      });

      gsap.from("[data-process-row]", {
        scrollTrigger: {
          trigger: "[data-process-list]",
          start: "top 82%",
        },
        opacity: 0,
        y: 28,
        stagger: 0.08,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.to("[data-services-hero-image]", {
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-services-hero]",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    {
      scope: rootRef,
    },
  );

  const active = services[activeService];

  return (
    <main
      ref={rootRef}
      className="font-prestige-sans overflow-hidden bg-[#080807] text-[#F4F0E8]"
    >
      <section
        data-services-hero
        className="relative min-h-[82vh] overflow-hidden border-b border-white/[0.08]"
      >
        <img
          data-services-hero-image
          src="/images/prestige/services/services-hero.jpg"
          alt="Prestige vehicle transport"
          className="absolute inset-0 h-[108%] w-full object-cover grayscale"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/35" />

        <div className="pointer-events-none absolute inset-0 opacity-[0.025] [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:92px_92px]" />

        <div className="relative z-10 mx-auto flex min-h-[82vh] w-[min(calc(100%-2rem),1540px)] flex-col justify-center py-24">
          <div data-services-eyebrow className="flex items-center gap-4">
            <span className="h-px w-12 bg-[#C9B896]" />

            <span className="text-[0.58rem] font-medium uppercase tracking-[0.29em] text-white/42">
              Hammer Head Prestige
            </span>
          </div>

          <div className="mt-10 max-w-7xl">
            <div className="overflow-hidden">
              <h1
                data-services-title-line
                className="font-prestige-serif text-[clamp(4.4rem,9vw,10.5rem)] font-normal leading-[0.81] tracking-[-0.05em]"
              >
                Transport, considered
              </h1>
            </div>

            <div className="overflow-hidden">
              <h1
                data-services-title-line
                className="font-prestige-serif text-[clamp(4.4rem,9vw,10.5rem)] font-normal italic leading-[0.81] tracking-[-0.05em] text-[#C9B896]"
              >
                around the vehicle.
              </h1>
            </div>
          </div>

          <p
            data-services-copy
            className="mt-10 max-w-2xl border-l border-[#C9B896]/55 pl-6 text-[0.98rem] font-light leading-8 text-white/52 md:text-[1.05rem]"
          >
            Private movement for exotic, collector, luxury, and low-clearance
            automobiles, shaped around the requirements of each car.
          </p>

          <div
            data-services-actions
            className="mt-11 flex flex-col gap-3 sm:flex-row"
          >
            <Link
              to="/prestige/request"
              className="group flex min-h-16 items-center justify-between gap-16 bg-[#F4F0E8] px-7 text-[0.58rem] font-medium uppercase tracking-[0.22em] text-black transition-colors duration-300 hover:bg-[#C9B896]"
            >
              Begin a private enquiry
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>

            <a
              href="tel:+15160000000"
              className="group flex min-h-16 items-center justify-between gap-16 border border-white/18 px-7 text-[0.58rem] font-medium uppercase tracking-[0.22em] text-white transition-colors duration-300 hover:bg-white hover:text-black"
            >
              Speak with Prestige
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </section>

      <section className="px-5 py-28 md:px-10 md:py-40">
        <div
          data-reveal
          className="mx-auto grid max-w-[1540px] gap-16 lg:grid-cols-[0.7fr_1.3fr]"
        >
          <div>
            <p className="text-[0.58rem] font-medium uppercase tracking-[0.27em] text-[#C9B896]">
              The Prestige standard
            </p>

            <p className="mt-7 max-w-md text-[0.92rem] font-light leading-8 text-white/42">
              Prestige is not ordinary vehicle shipping with a more valuable
              car. Each movement is considered as its own private transport
              operation.
            </p>
          </div>

          <h2 className="font-prestige-serif max-w-5xl text-[clamp(3.8rem,7vw,8rem)] font-normal leading-[0.88] tracking-[-0.045em]">
            The method changes
            <span className="block italic text-[#C9B896]">
              with the vehicle.
            </span>
          </h2>
        </div>
      </section>

      <section className="border-y border-white/[0.08]">
        <div className="mx-auto grid w-[min(calc(100%-2rem),1540px)] lg:grid-cols-[280px_1fr]">
          <aside className="hidden border-x border-white/[0.08] bg-[#0B0B0A] lg:block">
            <div className="sticky top-24 p-8">
              <p className="text-[0.55rem] font-medium uppercase tracking-[0.26em] text-white/24">
                Service collection
              </p>

              <div className="mt-8">
                {services.map((service, index) => {
                  const isActive = activeService === index;

                  return (
                    <button
                      key={service.number}
                      type="button"
                      onClick={() => setActiveService(index)}
                      className={`group flex w-full items-baseline justify-between border-b py-5 text-left transition-colors duration-300 ${
                        isActive
                          ? "border-[#C9B896] text-white"
                          : "border-white/10 text-white/36 hover:text-white"
                      }`}
                    >
                      <span className="font-prestige-serif text-[1.35rem] leading-none">
                        {service.shortTitle}
                      </span>

                      <span
                        className={`text-[0.52rem] font-medium tracking-[0.18em] ${
                          isActive ? "text-[#C9B896]" : "text-white/16"
                        }`}
                      >
                        {service.number}
                      </span>
                    </button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={active.number}
                  initial={{
                    opacity: 0,
                    y: 12,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -12,
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                  className="mt-11 border-l border-[#C9B896] pl-5"
                >
                  <p className="text-[0.52rem] font-medium uppercase tracking-[0.22em] text-[#C9B896]">
                    Currently viewing
                  </p>

                  <p className="font-prestige-serif mt-4 text-2xl leading-[1.05]">
                    {active.title}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </aside>

          <div
            data-services-grid
            className="grid border-l border-white/[0.08] md:grid-cols-2"
          >
            {services.map((service, index) => (
              <ServicePanel
                key={service.number}
                service={service}
                index={index}
                active={activeService === index}
                onActivate={setActiveService}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F4F0E8] px-5 py-28 text-[#080807] md:px-10 md:py-40">
        <div className="mx-auto max-w-[1540px]">
          <div
            data-reveal
            className="grid gap-14 border-b border-black/12 pb-16 lg:grid-cols-[0.7fr_1.3fr] lg:items-end"
          >
            <div>
              <p className="text-[0.58rem] font-medium uppercase tracking-[0.27em] text-black/38">
                The Prestige process
              </p>

              <p className="mt-7 max-w-md text-[0.92rem] font-light leading-8 text-black/48">
                The journey begins before collection. The vehicle, route,
                environment, equipment, and timing are considered together.
              </p>
            </div>

            <h2 className="font-prestige-serif text-[clamp(3.8rem,7vw,8rem)] font-normal leading-[0.88] tracking-[-0.045em]">
              Every detail,
              <span className="block italic text-[#8B7757]">
                accounted for.
              </span>
            </h2>
          </div>

          <div data-process-list className="border-t border-black/12">
            {process.map((item) => (
              <div
                data-process-row
                key={item.number}
                className="group grid gap-6 border-b border-black/12 py-10 md:grid-cols-[70px_0.8fr_1.2fr_auto] md:items-center"
              >
                <span className="text-[0.55rem] font-medium tracking-[0.2em] text-[#8B7757]">
                  {item.number}
                </span>

                <h3 className="font-prestige-serif text-3xl leading-none tracking-[-0.025em]">
                  {item.title}
                </h3>

                <p className="max-w-xl text-[0.9rem] font-light leading-7 text-black/48">
                  {item.description}
                </p>

                <ArrowUpRight className="hidden size-4 text-black/16 transition-colors group-hover:text-[#8B7757] md:block" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-28 md:px-10 md:py-40">
        <div className="mx-auto grid max-w-[1540px] gap-20 lg:grid-cols-2">
          <div data-reveal>
            <CarFront className="size-6 text-[#C9B896]" strokeWidth={1.35} />

            <p className="mt-9 text-[0.57rem] font-medium uppercase tracking-[0.26em] text-white/28">
              Vehicle profiles
            </p>

            <h2 className="font-prestige-serif mt-7 text-[clamp(3.4rem,6vw,6.7rem)] font-normal leading-[0.9] tracking-[-0.04em]">
              Shaped around
              <span className="block italic text-[#C9B896]">
                what you drive.
              </span>
            </h2>

            <div className="mt-12 grid border-l border-t border-white/10 sm:grid-cols-2">
              {vehicleProfiles.map((profile, index) => (
                <motion.div
                  key={profile}
                  whileHover={{
                    backgroundColor: IVORY,
                    color: INK,
                  }}
                  transition={{
                    duration: 0.35,
                  }}
                  className="group flex min-h-28 items-end justify-between border-b border-r border-white/10 p-5"
                >
                  <span className="font-prestige-serif text-2xl leading-none">
                    {profile}
                  </span>

                  <span className="text-[0.5rem] font-medium tracking-[0.18em] text-[#C9B896]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          <div
            data-reveal
            className="border border-white/[0.09] bg-[#0A0A09] p-8 md:p-12"
          >
            <Camera className="size-6 text-[#C9B896]" strokeWidth={1.35} />

            <p className="mt-9 text-[0.57rem] font-medium uppercase tracking-[0.26em] text-white/28">
              Condition and documentation
            </p>

            <h2 className="font-prestige-serif mt-7 max-w-xl text-[clamp(3.2rem,5vw,5.7rem)] font-normal leading-[0.9] tracking-[-0.04em]">
              Confidence,
              <span className="block italic text-[#C9B896]">
                before and after.
              </span>
            </h2>

            <p className="mt-7 max-w-xl text-[0.92rem] font-light leading-8 text-white/42">
              A clear record helps protect the client, the vehicle, and the
              integrity of the movement from collection through delivery.
            </p>

            <div className="mt-11 border-t border-white/10">
              {documentation.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-4 border-b border-white/10 py-5"
                >
                  <Check
                    className="size-4 shrink-0 text-[#C9B896]"
                    strokeWidth={1.4}
                  />

                  <span className="text-[0.9rem] font-light text-white/58">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#C9B896] px-5 py-28 text-[#080807] md:px-10 md:py-36">
        <div className="pointer-events-none absolute right-[-2%] top-1/2 -translate-y-1/2 font-prestige-serif text-[clamp(12rem,30vw,32rem)] leading-none text-black/[0.05]">
          HH
        </div>

        <div
          data-reveal
          className="relative z-10 mx-auto grid max-w-[1540px] gap-14 lg:grid-cols-[1fr_auto] lg:items-end"
        >
          <div>
            <p className="text-[0.58rem] font-medium uppercase tracking-[0.27em] text-black/42">
              Private transport enquiry
            </p>

            <h2 className="font-prestige-serif mt-7 max-w-5xl text-[clamp(4rem,7vw,8rem)] font-normal leading-[0.86] tracking-[-0.045em]">
              Your vehicle deserves
              <span className="block italic">a considered plan.</span>
            </h2>

            <p className="mt-8 max-w-xl text-[0.95rem] font-light leading-8 text-black/52">
              Share the vehicle, route, timing, access, and particular handling
              requirements. Prestige will review the movement before
              availability is confirmed.
            </p>
          </div>

          <Link
            to="/prestige/request"
            className="group flex min-h-16 items-center justify-between gap-16 bg-black px-7 text-[0.58rem] font-medium uppercase tracking-[0.22em] text-white transition-colors duration-300 hover:bg-[#F4F0E8] hover:text-black"
          >
            Begin private enquiry
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
