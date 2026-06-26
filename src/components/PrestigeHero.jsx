import { ArrowUpRight, Lock, ShieldCheck, Sparkles, Timer } from "lucide-react";
import { motion } from "framer-motion";

const trustItems = [
  {
    icon: ShieldCheck,
    label: "Insured handling",
  },
  {
    icon: Lock,
    label: "Secured transport",
  },
  {
    icon: Timer,
    label: "Scheduled delivery",
  },
  {
    icon: Sparkles,
    label: "White-glove care",
  },
];

export function PrestigeHero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="absolute inset-0">
        <img
          src="/images/pres-hero.png"
          alt="Luxury vehicle transport by Hammer Head Prestige"
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <header className="relative z-20 mx-auto flex w-[min(100%-2rem,1500px)] items-center justify-between py-7">
        <a href="/" className="group">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.45em] text-white/38">
            Hammer Head
          </p>

          <h1 className="mt-2 text-sm font-semibold uppercase tracking-[0.32em] text-white transition group-hover:text-white/75">
            Prestige Transport
          </h1>
        </a>

        <nav className="hidden items-center gap-10 text-[0.65rem] font-bold uppercase tracking-[0.24em] text-white/48 lg:flex">
          <a href="#services" className="transition hover:text-white">
            Services
          </a>
          <a href="#process" className="transition hover:text-white">
            Process
          </a>
          <a href="#vehicles" className="transition hover:text-white">
            Vehicles
          </a>
          <a href="#contact" className="transition hover:text-white">
            Contact
          </a>
        </nav>

        <a
          href="tel:+15160000000"
          className="hidden border border-white/15 px-5 py-3 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white/70 transition hover:border-white/40 hover:text-white md:inline-flex"
        >
          Call now
        </a>
      </header>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-104px)] w-[min(100%-2rem,1500px)] items-center">
        <div className="max-w-4xl pb-20 pt-14">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-7 text-[0.68rem] font-bold uppercase tracking-[0.48em] text-white/42"
          >
            Exotic • Classic • Luxury • Collector
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="font-serif text-[clamp(4rem,10vw,11rem)] font-light leading-[0.84] tracking-[-0.075em]"
          >
            Transport
            <span className="block text-white/48">Without</span>
            <span className="block">Compromise.</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="mt-8 h-px w-32 origin-left bg-white/35"
          />

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.45 }}
            className="mt-8 max-w-xl text-base leading-7 text-white/62 md:text-lg md:leading-8"
          >
            Private vehicle transport for exotics, classics, collector cars,
            luxury vehicles, and specialty assets — handled with precision from
            pickup to delivery.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.6 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <a
              href="#quote"
              className="group inline-flex min-h-14 items-center justify-center gap-3 bg-white px-7 text-[0.7rem] font-black uppercase tracking-[0.18em] text-black transition hover:bg-white/85"
            >
              Request private quote
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>

            <a
              href="#process"
              className="group inline-flex min-h-14 items-center justify-center gap-3 border border-white/15 px-7 text-[0.7rem] font-black uppercase tracking-[0.18em] text-white/70 transition hover:border-white/35 hover:text-white"
            >
              View process
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.75 }}
            className="mt-14 grid max-w-3xl grid-cols-2 gap-px border border-white/10 bg-white/10 md:grid-cols-4"
          >
            {trustItems.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="group bg-black/45 px-4 py-5 backdrop-blur-xl transition hover:bg-white/[0.06]"
              >
                <Icon className="size-4 text-white/45 transition group-hover:text-white" />

                <p className="mt-5 text-[0.62rem] font-bold uppercase leading-5 tracking-[0.16em] text-white/50 transition group-hover:text-white/75">
                  {label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 z-10 hidden text-right md:block">
        <p className="text-[0.58rem] font-bold uppercase tracking-[0.28em] text-white/28">
          Private vehicle logistics
        </p>

        <p className="mt-2 text-[0.58rem] font-bold uppercase tracking-[0.28em] text-white/48">
          Long Island / Tri-State / Interstate
        </p>
      </div>
    </section>
  );
}