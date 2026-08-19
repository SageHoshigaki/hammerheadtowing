import { useRef } from "react";
import {
  ArrowUpRight,
  Instagram,
  Linkedin,
  MapPin,
  Phone,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

function FacebookIcon({ className = "size-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M13.5 22v-9h3l.45-3.5H13.5V7.25c0-1.01.28-1.7 1.73-1.7H17V2.42A23.7 23.7 0 0 0 14.39 2C11.8 2 10 3.58 10 6.49V9.5H7V13h3v9h3.5Z" />
    </svg>
  );
}

const socials = [
  {
    label: "Instagram",
    href: "https://instagram.com/",
    icon: Instagram,
  },
  {
    label: "Facebook",
    href: "https://facebook.com/",
    icon: FacebookIcon,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/",
    icon: Linkedin,
  },
];

export function Footer() {
  const footerRef = useRef(null);
  const wordmarkRef = useRef(null);

  useGSAP(
    () => {
      const revealItems = gsap.utils.toArray("[data-footer-reveal]");

      gsap.from(revealItems, {
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 82%",
          once: true,
        },
        opacity: 0,
        y: 36,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
      });

      gsap.from("[data-footer-logo]", {
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 75%",
          once: true,
        },
        opacity: 0,
        y: 30,
        scale: 0.96,
        duration: 0.9,
        ease: "power3.out",
      });

      if (wordmarkRef.current) {
        const words = wordmarkRef.current.querySelectorAll(
          "[data-footer-word]",
        );

        gsap.from(words, {
          scrollTrigger: {
            trigger: wordmarkRef.current,
            start: "top 92%",
            once: true,
          },
          yPercent: 110,
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power4.out",
        });
      }

      const refreshTimer = window.setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);

      return () => {
        window.clearTimeout(refreshTimer);
      };
    },
    {
      scope: footerRef,
    },
  );

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden bg-black text-white"
    >
      {/* Tailwind-only grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30
        [background-image:linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)]
        [background-size:100px_100px]
        [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.9),transparent_92%)]"
      />

      <div className="pointer-events-none absolute -bottom-64 left-1/2 size-[46rem] -translate-x-1/2 rounded-full bg-red-600/15 blur-[180px]" />

      <div className="relative z-10 mx-auto w-[min(100%-2rem,1500px)] pt-20 md:pt-28">
        <div className="grid gap-12 border-b border-white/10 pb-16 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p
              data-footer-reveal
              className="mb-6 flex items-center gap-4 text-[0.66rem] font-black uppercase tracking-[0.2em] text-white/40"
            >
              <span className="h-px w-10 bg-red-600" />
              Emergency towing and recovery
            </p>

            <h2
              data-footer-reveal
              className="max-w-5xl text-[clamp(3.5rem,8vw,9rem)] font-black uppercase leading-[0.82] tracking-[-0.075em]"
            >
              When the road stops,
              <span className="block text-red-600">
                call Hammer Head.
              </span>
            </h2>
          </div>

          <a
            data-footer-reveal
            href="tel:+15160000000"
            className="group inline-flex min-h-16 w-fit items-center justify-center gap-4 bg-red-600 px-7 text-xs font-black uppercase tracking-[0.14em] transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-black"
          >
            <Phone className="size-5" />
            Call dispatch

            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>

        <div className="grid gap-12 border-b border-white/10 py-14 md:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-center">
          <div data-footer-logo>
            <img
              src="/images/hammer-head-logo.png"
              alt="Hammer Head Towing and Recovery"
              className="h-auto w-full max-w-[340px] object-contain"
              onLoad={() => ScrollTrigger.refresh()}
            />
          </div>

          <div data-footer-reveal>
            <p className="text-[0.62rem] font-black uppercase tracking-[0.18em] text-white/40">
              Operating base
            </p>

            <div className="mt-4 flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-red-500" />

              <p className="text-sm font-semibold leading-6 text-white/70">
                Farmingdale, New York

                <span className="block text-white/40">
                  Long Island and interstate transport
                </span>
              </p>
            </div>
          </div>

          <div data-footer-reveal>
            <p className="text-[0.62rem] font-black uppercase tracking-[0.18em] text-white/40">
              Follow the operation
            </p>

            <div className="mt-4 flex gap-2">
              {socials.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="group grid size-12 place-items-center border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-red-600 hover:bg-red-600"
                >
                  <Icon className="size-4 text-white/60 transition-colors group-hover:text-white" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div
          id="request-service"
          className="grid gap-8 border-b border-white/10 py-10 text-sm text-white/50 md:grid-cols-2 md:items-center"
        >
          <p data-footer-reveal className="max-w-lg leading-6">
            Towing, roadside assistance, accident recovery, commercial
            transport, and vehicle logistics from Long Island to interstate
            destinations.
          </p>

          <div
            data-footer-reveal
            className="flex flex-col gap-2 md:items-end"
          >
            <a
              href="tel:+15160000000"
              className="text-lg font-black text-white transition-colors hover:text-red-500"
            >
              +1 (516) 000-0000
            </a>

            <span className="text-[0.62rem] font-black uppercase tracking-[0.16em] text-red-500">
              Dispatch available 24/7
            </span>
          </div>
        </div>

        <div
          ref={wordmarkRef}
          className="flex overflow-hidden py-10 md:py-14"
          aria-hidden="true"
        >
          <span
            data-footer-word
            className="block whitespace-nowrap text-[clamp(4rem,13vw,14rem)] font-black uppercase leading-none tracking-[-0.085em] text-white"
          >
            Hammer
          </span>

          <span
            data-footer-word
            className="ml-[0.18em] block whitespace-nowrap text-[clamp(4rem,13vw,14rem)] font-black uppercase leading-none tracking-[-0.085em] text-red-600"
          >
            Head.
          </span>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 py-5 text-[0.58rem] font-bold uppercase tracking-[0.14em] text-white/30 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} Hammer Head Towing
          </span>

          <span>
            Farmingdale · Long Island · Interstate
          </span>
        </div>
      </div>
    </footer>
  );
}