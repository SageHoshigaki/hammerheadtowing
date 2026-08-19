// src/components/UniversalNav.jsx

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  LocateFixed,
  Menu,
  Phone,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { gsap } from "gsap";
import { Link, NavLink, useLocation } from "react-router-dom";

const recoveryLinks = [
  { number: "01", label: "Home", to: "/" },
  { number: "02", label: "Services", to: "/services" },
  {
    number: "03",
    label: "Request Recovery",
    to: "/request-recovery",
  },
  { number: "04", label: "Company", to: "/company" },
];

const prestigeLinks = [
  { number: "01", label: "Prestige", to: "/prestige" },
  {
    number: "02",
    label: "Transport Services",
    to: "/prestige/services",
  },
  {
    number: "03",
    label: "Request Transport",
    to: "/prestige/request",
  },
];

function normalizePhone(phone = "") {
  return phone.replace(/[^\d+]/g, "");
}

function isPrestigeRoute(pathname = "") {
  return pathname.startsWith("/prestige");
}

export function UniversalNav({
  recoveryLogoSrc = "/images/logo2.png",
  prestigeLogoSrc = "/images/prestige-logo.png",
  phoneNumber = "(631) 300-5559",
}) {
  const navRef = useRef(null);
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const prestigeMode = isPrestigeRoute(location.pathname);
  const links = prestigeMode ? prestigeLinks : recoveryLinks;

  const activeLogoSrc = prestigeMode ? prestigeLogoSrc : recoveryLogoSrc;

  const accentColor = prestigeMode ? "#C9B896" : "#D3131A";

  const phoneHref = `tel:${normalizePhone(phoneNumber)}`;

  const phoneLabel = prestigeMode ? "Speak with Prestige" : "Call dispatch";

  useEffect(() => {
    const context = gsap.context(() => {
      gsap
        .timeline({
          defaults: {
            ease: "power4.out",
          },
        })
        .from("[data-nav-logo]", {
          opacity: 0,
          y: -14,
          duration: 0.75,
        })
        .from(
          "[data-nav-link]",
          {
            opacity: 0,
            y: -12,
            stagger: 0.055,
            duration: 0.65,
          },
          "-=0.35",
        )
        .from(
          "[data-nav-control]",
          {
            opacity: 0,
            x: 18,
            stagger: 0.06,
            duration: 0.65,
          },
          "-=0.4",
        );
    }, navRef);

    return () => context.revert();
  }, []);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 30);
    }

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        ref={navRef}
        className={`fixed inset-x-0 top-0 z-[100] bg-black text-white transition-all duration-500 ${
          scrolled
            ? "border-b border-white/10 shadow-[0_16px_60px_rgba(0,0,0,0.6)]"
            : "border-b border-white/[0.07]"
        }`}
      >
        <div
          className="absolute inset-x-0 top-0 h-px opacity-80"
          style={{
            background: `linear-gradient(to right, transparent, ${accentColor}, transparent)`,
          }}
        />

        <div
          className={`relative flex w-full items-center transition-all duration-500 ${
            scrolled ? "h-[68px]" : "h-[84px]"
          }`}
        >
          {/* Left: logo */}
          <div className="flex h-full min-w-0 shrink-0 items-center pl-4 sm:pl-6 lg:pl-8">
            <Link
              data-nav-logo
              to={prestigeMode ? "/prestige" : "/"}
              aria-label={
                prestigeMode ? "Hammer Head Prestige home" : "Hammer Head home"
              }
              className="group relative shrink-0"
            >
              <img
                src={activeLogoSrc}
                alt={
                  prestigeMode ? "Hammer Head Prestige" : "Hammer Head Towing"
                }
                className={`w-auto max-w-[120px] object-contain transition-all duration-500 sm:max-w-[170px] lg:max-w-[210px] ${
                  prestigeMode
                    ? scrolled
                      ? "h-11"
                      : "h-14"
                    : scrolled
                      ? "h-9"
                      : "h-12"
                }`}
              />

              <span
                className="absolute -bottom-2 left-0 h-px w-0 transition-all duration-500 group-hover:w-full"
                style={{
                  backgroundColor: accentColor,
                }}
              />
            </Link>
          </div>

          {/* Center: page navigation */}
          <nav className="hidden h-full min-w-0 flex-1 items-center justify-center px-3 xl:flex 2xl:px-6">
            {links.map((link) => (
              <NavLink
                data-nav-link
                key={link.to}
                to={link.to}
                end={link.to === "/" || link.to === "/prestige"}
                className={({ isActive }) =>
                  `group relative flex h-full items-center whitespace-nowrap px-3 text-[0.51rem] uppercase tracking-[0.12em] transition-colors 2xl:px-4 2xl:text-[0.57rem] 2xl:tracking-[0.16em] ${
                    prestigeMode ? "font-medium" : "font-black"
                  } ${
                    isActive ? "text-white" : "text-white/40 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{link.label}</span>

                    <span
                      className={`absolute inset-x-3 bottom-0 h-[2px] origin-left transition-transform duration-500 2xl:inset-x-4 ${
                        isActive
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100"
                      }`}
                      style={{
                        backgroundColor: accentColor,
                      }}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right: anchored controls */}
          <div className="ml-auto flex h-full shrink-0 items-center">
            {/* Recovery / Prestige switch */}
            <div
              data-nav-control
              className="hidden h-11 shrink-0 items-center border-l border-white/10 lg:flex"
            >
              <Link
                to="/"
                className={`flex h-full items-center whitespace-nowrap px-3 text-[0.5rem] uppercase tracking-[0.12em] transition 2xl:px-4 2xl:text-[0.54rem] 2xl:tracking-[0.15em] ${
                  prestigeMode ? "font-medium" : "font-black"
                } ${
                  !prestigeMode
                    ? "bg-white text-black"
                    : "text-white/35 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                Recovery
              </Link>

              <Link
                to="/prestige"
                className={`flex h-full items-center whitespace-nowrap px-3 text-[0.5rem] uppercase tracking-[0.12em] transition 2xl:px-4 2xl:text-[0.54rem] 2xl:tracking-[0.15em] ${
                  prestigeMode ? "font-medium" : "font-black"
                } ${
                  prestigeMode
                    ? "bg-[#C9B896] text-black"
                    : "text-white/35 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                Prestige
              </Link>
            </div>

            {/* Recovery location utility */}
            {!prestigeMode && (
              <Link
                data-nav-control
                to="/location"
                className="group hidden h-11 shrink-0 items-center gap-2 border-l border-white/10 px-4 text-[0.51rem] font-black uppercase tracking-[0.12em] text-white/50 transition hover:bg-white hover:text-black 2xl:flex 2xl:px-5 2xl:text-[0.55rem] 2xl:tracking-[0.15em]"
              >
                <LocateFixed className="h-4 w-4 shrink-0 text-[#D3131A] transition group-hover:text-black" />

                <span className="whitespace-nowrap">Share location</span>
              </Link>
            )}

            {/* Phone CTA: always visible and always far right */}
            <a
              href={phoneHref}
              aria-label={`${phoneLabel}: ${phoneNumber}`}
              title={`${phoneLabel}: ${phoneNumber}`}
              className={`group relative z-20 flex h-11 min-w-11 shrink-0 items-center justify-center gap-3 whitespace-nowrap px-3 text-[0.52rem] uppercase tracking-[0.12em] transition sm:px-4 lg:px-5 ${
                prestigeMode
                  ? "border-l border-white/10 bg-[#C9B896] font-medium text-black hover:bg-[#F4F0E8]"
                  : "bg-[#D3131A] font-black text-white hover:bg-white hover:text-black"
              }`}
            >
              <Phone className="h-4 w-4 shrink-0" strokeWidth={1.9} />

              <span className="hidden lg:inline">{phoneLabel}</span>

              <ArrowUpRight className="hidden h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 lg:block" />
            </a>

            {/* Menu */}
            <button
              data-nav-control
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation"
              aria-expanded={menuOpen}
              className="group grid h-11 w-12 shrink-0 place-items-center border-l border-white/10 bg-black text-white transition hover:bg-white hover:text-black xl:hidden"
            >
              <Menu className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
            </button>
          </div>
        </div>
      </header>

      {/* Header spacer */}
      <div
        className={`transition-all duration-500 ${
          scrolled ? "h-[68px]" : "h-[84px]"
        }`}
      />

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className={`fixed inset-0 z-[200] overflow-y-auto bg-black text-white ${
              prestigeMode ? "font-prestige-sans" : ""
            }`}
            initial={{
              clipPath: "inset(0 0 100% 0)",
            }}
            animate={{
              clipPath: "inset(0 0 0% 0)",
            }}
            exit={{
              clipPath: "inset(0 0 100% 0)",
            }}
            transition={{
              duration: 0.7,
              ease: [0.76, 0, 0.24, 1],
            }}
          >
            <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(255,255,255,.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.14)_1px,transparent_1px)] [background-size:72px_72px]" />

            <div
              className="pointer-events-none absolute right-[-15%] top-[-25%] h-[46rem] w-[46rem] rounded-full blur-[150px]"
              style={{
                backgroundColor: prestigeMode
                  ? "rgba(201,184,150,0.1)"
                  : "rgba(211,19,26,0.1)",
              }}
            />

            <div
              className="absolute left-0 top-0 h-full w-[3px]"
              style={{
                backgroundColor: accentColor,
              }}
            />

            <div className="relative flex min-h-screen flex-col">
              {/* Overlay header */}
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-5 md:px-10">
                <Link
                  to={prestigeMode ? "/prestige" : "/"}
                  onClick={() => setMenuOpen(false)}
                  aria-label={
                    prestigeMode
                      ? "Hammer Head Prestige home"
                      : "Hammer Head home"
                  }
                  className="min-w-0"
                >
                  <img
                    src={activeLogoSrc}
                    alt={
                      prestigeMode
                        ? "Hammer Head Prestige"
                        : "Hammer Head Towing"
                    }
                    className={`w-auto max-w-[180px] object-contain sm:max-w-[240px] ${
                      prestigeMode ? "h-14" : "h-11"
                    }`}
                  />
                </Link>

                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close navigation"
                  className={`group flex shrink-0 items-center gap-4 text-[0.57rem] uppercase tracking-[0.18em] text-white/45 transition hover:text-white ${
                    prestigeMode ? "font-medium" : "font-black"
                  }`}
                >
                  <span className="hidden sm:inline">Close</span>

                  <span className="grid h-11 w-11 place-items-center border border-white/15 transition group-hover:bg-white group-hover:text-black">
                    <X className="h-5 w-5" />
                  </span>
                </button>
              </div>

              {/* Mobile division switch */}
              <div className="grid grid-cols-2 border-b border-white/10">
                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className={`flex min-h-20 items-center justify-between border-r border-white/10 px-5 text-[0.62rem] uppercase tracking-[0.17em] ${
                    prestigeMode ? "font-medium" : "font-black"
                  } ${
                    !prestigeMode ? "bg-[#D3131A] text-white" : "text-white/35"
                  }`}
                >
                  Recovery
                  <ArrowUpRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/prestige"
                  onClick={() => setMenuOpen(false)}
                  className={`flex min-h-20 items-center justify-between px-5 text-[0.62rem] uppercase tracking-[0.17em] ${
                    prestigeMode
                      ? "bg-[#C9B896] font-medium text-black"
                      : "font-black text-white/35"
                  }`}
                >
                  Prestige
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid flex-1 lg:grid-cols-[0.68fr_1.32fr]">
                {/* Information panel */}
                <div className="order-2 flex flex-col justify-between border-t border-white/10 p-6 md:p-10 lg:order-1 lg:border-r lg:border-t-0">
                  <div>
                    <p
                      className={`text-[0.54rem] uppercase tracking-[0.24em] text-white/25 ${
                        prestigeMode ? "font-medium" : "font-black"
                      }`}
                    >
                      {prestigeMode ? "Hammer Head Prestige" : "Hammer Head"}
                    </p>

                    {prestigeMode ? (
                      <h2 className="font-prestige-serif mt-5 max-w-md text-5xl font-normal leading-[0.9] tracking-[-0.04em] sm:text-6xl">
                        Transport,
                        <span className="block italic text-[#C9B896]">
                          considered.
                        </span>
                      </h2>
                    ) : (
                      <h2 className="mt-5 max-w-md text-3xl font-black uppercase leading-[0.92] tracking-[-0.055em] sm:text-5xl">
                        Response when the road stops.
                      </h2>
                    )}
                  </div>

                  <div className="mt-12 space-y-3">
                    {!prestigeMode && (
                      <Link
                        to="/location"
                        onClick={() => setMenuOpen(false)}
                        className="group flex min-h-15 items-center justify-between border border-white/15 px-5 text-[0.59rem] font-black uppercase tracking-[0.16em] text-white"
                      >
                        <span className="flex items-center gap-3">
                          <LocateFixed className="h-4 w-4 text-[#D3131A]" />
                          Share live location
                        </span>

                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    )}

                    <a
                      href={phoneHref}
                      className={`group flex min-h-16 items-center justify-between px-5 text-[0.63rem] uppercase tracking-[0.16em] ${
                        prestigeMode
                          ? "bg-[#C9B896] font-medium text-black"
                          : "bg-[#D3131A] font-black text-white"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Phone className="h-4 w-4" />

                        {prestigeMode
                          ? "Speak with Prestige"
                          : "Call 24/7 dispatch"}
                      </span>

                      <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  </div>
                </div>

                {/* Overlay navigation */}
                <nav className="order-1 flex flex-col justify-center px-6 py-10 md:px-10 lg:order-2 lg:px-16">
                  <p
                    className={`mb-8 text-[0.54rem] uppercase tracking-[0.25em] text-white/20 ${
                      prestigeMode ? "font-medium" : "font-black"
                    }`}
                  >
                    Navigation
                  </p>

                  {links.map((link, index) => (
                    <motion.div
                      key={link.to}
                      initial={{
                        opacity: 0,
                        y: 55,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.7,
                        delay: 0.18 + index * 0.08,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <NavLink
                        to={link.to}
                        onClick={() => setMenuOpen(false)}
                        end={link.to === "/" || link.to === "/prestige"}
                        className={({ isActive }) =>
                          `group grid grid-cols-[42px_minmax(0,1fr)_auto] items-center border-b border-white/10 py-5 transition sm:grid-cols-[65px_minmax(0,1fr)_auto] sm:py-7 ${
                            isActive
                              ? "text-white"
                              : "text-white/30 hover:text-white"
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <span
                              className="font-mono text-[0.57rem]"
                              style={{
                                color: isActive
                                  ? accentColor
                                  : "rgba(255,255,255,0.18)",
                              }}
                            >
                              {link.number}
                            </span>

                            <span
                              className={
                                prestigeMode
                                  ? "font-prestige-serif min-w-0 text-[clamp(2.4rem,6vw,6rem)] font-normal leading-none tracking-[-0.045em]"
                                  : "min-w-0 text-[clamp(1.8rem,6vw,5.5rem)] font-black uppercase leading-none tracking-[-0.07em]"
                              }
                            >
                              {link.label}
                            </span>

                            <span
                              className={`grid h-10 w-10 shrink-0 place-items-center border transition sm:h-12 sm:w-12 ${
                                isActive
                                  ? prestigeMode
                                    ? "border-[#C9B896] bg-[#C9B896] text-black"
                                    : "border-[#D3131A] bg-[#D3131A] text-white"
                                  : "border-white/10 text-white/25 group-hover:border-white group-hover:bg-white group-hover:text-black"
                              }`}
                            >
                              <ArrowUpRight className="h-4 w-4" />
                            </span>
                          </>
                        )}
                      </NavLink>
                    </motion.div>
                  ))}
                </nav>
              </div>

              <div
                className={`flex items-center justify-between border-t border-white/10 px-5 py-4 text-[0.47rem] uppercase tracking-[0.19em] text-white/20 md:px-10 ${
                  prestigeMode ? "font-medium" : "font-black"
                }`}
              >
                <span>Farmingdale, New York</span>

                <span
                  style={{
                    color: accentColor,
                  }}
                >
                  {prestigeMode ? "Private transport" : "24/7 operations"}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
