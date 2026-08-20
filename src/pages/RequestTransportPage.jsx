// src/pages/RequestTransportPage.jsx

import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Building2,
  Camera,
  CarFront,
  Check,
  ChevronDown,
  EyeOff,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Upload,
  UserRound,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const CHAMPAGNE = "#C9B896";
const IVORY = "#F4F0E8";

const steps = [
  "Service",
  "Vehicle",
  "Collection",
  "Delivery",
  "Handling",
  "Photography",
  "Client",
  "Review",
];

const transportTypes = [
  "Dedicated single-vehicle transport",
  "Enclosed transport",
  "Open transport",
  "Dealer or auction transfer",
  "Event or showroom delivery",
  "Not yet decided",
];

const handlingOptions = [
  "Low ground clearance",
  "Non-running vehicle",
  "No keys available",
  "Fragile front splitter",
  "Custom wheels",
  "Exposed carbon fiber",
  "Air suspension",
  "Manual transmission",
  "Indoor collection",
  "Indoor delivery",
  "Confidential transport",
  "Vehicle cover requested",
];

const pickupTypes = [
  "Private residence",
  "Dealership",
  "Auction",
  "Storage facility",
  "Repair facility",
  "Event venue",
  "Other",
];

function Field({ label, value, onChange, placeholder = "", type = "text" }) {
  return (
    <label className="group block">
      <span className="mb-3 block text-[0.57rem] font-medium uppercase tracking-[0.24em] text-white/30 transition-colors duration-300 group-focus-within:text-[#C9B896]">
        {label}
      </span>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full border-0 border-b border-white/14 bg-transparent px-0 py-4 text-[0.95rem] font-light text-[#F4F0E8] outline-none transition-all duration-300 placeholder:text-white/16 focus:border-[#C9B896]"
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="group block">
      <span className="mb-3 block text-[0.57rem] font-medium uppercase tracking-[0.24em] text-white/30 transition-colors duration-300 group-focus-within:text-[#C9B896]">
        {label}
      </span>

      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full appearance-none border-0 border-b border-white/14 bg-transparent px-0 py-4 pr-10 text-[0.95rem] font-light text-[#F4F0E8] outline-none transition-all duration-300 focus:border-[#C9B896]"
        >
          <option value="" className="bg-[#0A0A09]">
            Select
          </option>

          {options.map((option) => (
            <option key={option} value={option} className="bg-[#0A0A09]">
              {option}
            </option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute right-0 top-1/2 size-4 -translate-y-1/2 text-white/25" />
      </div>
    </label>
  );
}

function TextArea({ label, value, onChange, placeholder = "", rows = 5 }) {
  return (
    <label className="group block">
      <span className="mb-3 block text-[0.57rem] font-medium uppercase tracking-[0.24em] text-white/30 transition-colors duration-300 group-focus-within:text-[#C9B896]">
        {label}
      </span>

      <textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full resize-none border-0 border-b border-white/14 bg-transparent px-0 py-4 text-[0.95rem] font-light leading-7 text-[#F4F0E8] outline-none transition-all duration-300 placeholder:text-white/16 focus:border-[#C9B896]"
      />
    </label>
  );
}

function StepHeading({ icon: Icon, number, eyebrow, title, copy }) {
  return (
    <header className="max-w-5xl">
      <div className="flex items-center gap-4 text-[#C9B896]">
        <Icon className="size-[18px]" strokeWidth={1.35} />

        <span className="text-[0.58rem] font-medium uppercase tracking-[0.27em]">
          {number} · {eyebrow}
        </span>
      </div>

      <h2 className="font-prestige-serif mt-8 text-[clamp(3.2rem,6vw,6.4rem)] font-normal leading-[0.88] tracking-[-0.04em]">
        {title}
      </h2>

      {copy && (
        <p className="mt-7 max-w-2xl text-[0.95rem] font-light leading-8 text-white/44">
          {copy}
        </p>
      )}
    </header>
  );
}

function ChoiceCard({ label, active, onClick, icon: Icon = CarFront }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.995 }}
      className={`group relative flex min-h-[122px] items-end justify-between overflow-hidden border px-5 py-5 text-left transition-all duration-500 ${
        active
          ? "border-[#C9B896] bg-[#C9B896]/[0.07]"
          : "border-white/10 bg-white/[0.015] hover:border-white/25"
      }`}
    >
      <span
        className={`absolute left-0 top-0 h-px transition-all duration-700 ${
          active ? "w-full bg-[#C9B896]" : "w-0 bg-[#C9B896] group-hover:w-full"
        }`}
      />

      <span className="font-prestige-serif max-w-[82%] text-[1.45rem] font-normal leading-[1.05] tracking-[-0.025em] text-[#F4F0E8]">
        {label}
      </span>

      <span
        className={`grid size-9 shrink-0 place-items-center border transition-all duration-500 ${
          active
            ? "border-[#C9B896] bg-[#C9B896] text-black"
            : "border-white/12 text-white/28 group-hover:border-white/30 group-hover:text-white"
        }`}
      >
        {active ? (
          <Check className="size-3.5" strokeWidth={1.7} />
        ) : (
          <Icon className="size-3.5" strokeWidth={1.35} />
        )}
      </span>
    </motion.button>
  );
}

function ReviewRow({ label, value }) {
  return (
    <div className="grid gap-3 border-b border-white/10 py-6 sm:grid-cols-[190px_1fr]">
      <span className="text-[0.56rem] font-medium uppercase tracking-[0.22em] text-white/28">
        {label}
      </span>

      <span className="font-prestige-serif text-[1.35rem] leading-[1.2] text-white/78">
        {value || "Not provided"}
      </span>
    </div>
  );
}

function SectionNote({ children }) {
  return (
    <div className="border-l border-[#C9B896] bg-[#C9B896]/[0.045] px-5 py-4">
      <p className="text-sm font-light leading-7 text-white/48">{children}</p>
    </div>
  );
}

export function RequestTransportPage({ phoneNumber = "(631) 300-5559" }) {
  const rootRef = useRef(null);

  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    transportType: "",

    year: "",
    make: "",
    model: "",
    trim: "",
    vin: "",
    valueRange: "",
    operatingCondition: "",
    modified: "",
    clearance: "",

    pickupAddress: "",
    pickupType: "",
    pickupContact: "",
    pickupPhone: "",
    pickupDate: "",
    datesFlexible: "",
    pickupAccess: "",

    deliveryAddress: "",
    deliveryType: "",
    deliveryContact: "",
    deliveryPhone: "",
    deliveryWindow: "",
    deliveryAccess: "",

    handling: [],
    confidentiality: false,
    publicPhotography: false,
    specialInstructions: "",

    photos: [],

    clientType: "",
    name: "",
    phone: "",
    email: "",
    company: "",
    preferredContact: "",
    referralSource: "",
  });

  useGSAP(
    () => {
      gsap
        .timeline({
          defaults: {
            ease: "power4.out",
          },
        })
        .from("[data-request-eyebrow]", {
          opacity: 0,
          y: 18,
          duration: 0.8,
        })
        .from(
          "[data-request-title-line]",
          {
            yPercent: 110,
            stagger: 0.12,
            duration: 1.1,
          },
          "-=0.4",
        )
        .from(
          "[data-request-intro]",
          {
            opacity: 0,
            y: 24,
            duration: 0.85,
          },
          "-=0.5",
        )
        .from(
          "[data-request-panel]",
          {
            opacity: 0,
            y: 40,
            duration: 0.95,
          },
          "-=0.5",
        );
    },
    {
      scope: rootRef,
    },
  );

  const progress = useMemo(() => ((step + 1) / steps.length) * 100, [step]);

  function update(key, value) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function toggleHandling(option) {
    setForm((current) => {
      const exists = current.handling.includes(option);

      return {
        ...current,
        handling: exists
          ? current.handling.filter((item) => item !== option)
          : [...current.handling, option],
      };
    });
  }

  function goToStep(index) {
    setStep(index);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function nextStep() {
    goToStep(Math.min(step + 1, steps.length - 1));
  }

  function previousStep() {
    goToStep(Math.max(step - 1, 0));
  }

  function submitRequest() {
    console.log("Prestige transport request:", form);

    setSubmitted(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  if (submitted) {
    return (
      <main className="font-prestige-sans relative grid min-h-screen place-items-center overflow-hidden bg-[#080807] px-5 py-16 text-[#F4F0E8]">
        <div className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:88px_88px]" />

        <div className="pointer-events-none absolute right-[-12%] top-[-18%] size-[42rem] rounded-full bg-[#C9B896]/10 blur-[160px]" />

        <motion.section
          initial={{
            opacity: 0,
            y: 40,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative z-10 w-full max-w-4xl border border-white/10 bg-[#0B0B0A]/90 p-8 backdrop-blur-xl md:p-14"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-7">
            <div className="grid size-12 place-items-center bg-[#C9B896] text-black">
              <Check className="size-5" strokeWidth={1.5} />
            </div>

            <span className="text-[0.54rem] font-medium uppercase tracking-[0.26em] text-white/24">
              Hammer Head Prestige
            </span>
          </div>

          <p className="mt-10 text-[0.58rem] font-medium uppercase tracking-[0.27em] text-[#C9B896]">
            Transport request received
          </p>

          <h1 className="font-prestige-serif mt-6 max-w-3xl text-[clamp(3.6rem,7vw,7rem)] font-normal leading-[0.88] tracking-[-0.045em]">
            Your request is now
            <span className="block italic text-[#C9B896]">
              under consideration.
            </span>
          </h1>

          <p className="mt-8 max-w-2xl text-[0.95rem] font-light leading-8 text-white/48">
            A Prestige representative will review the vehicle, route, collection
            environment, requested timing, and handling requirements before
            confirming availability and preparing a private quotation.
          </p>

          <div className="mt-12 grid gap-3 sm:grid-cols-2">
            <a
              href={`tel:${phoneNumber.replace(/[^\d+]/g, "")}`}
              className="group flex min-h-16 items-center justify-between bg-[#F4F0E8] px-6 text-[0.6rem] font-medium uppercase tracking-[0.2em] text-black transition-colors duration-300 hover:bg-[#C9B896]"
            >
              Speak with Prestige
              <Phone className="size-4" strokeWidth={1.5} />
            </a>

            <Link
              to="/prestige"
              className="group flex min-h-16 items-center justify-between border border-white/15 px-6 text-[0.6rem] font-medium uppercase tracking-[0.2em] text-white transition-colors duration-300 hover:bg-white hover:text-black"
            >
              Return to Prestige
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </motion.section>
      </main>
    );
  }

  return (
    <main
      ref={rootRef}
      className="font-prestige-sans relative min-h-screen overflow-hidden bg-[#080807] text-[#F4F0E8]"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.025] [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:92px_92px]" />

      <div className="pointer-events-none absolute right-[-15%] top-[-10%] size-[46rem] rounded-full bg-[#C9B896]/[0.07] blur-[170px]" />

      <section className="relative border-b border-white/[0.08] px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1540px]">
          <div data-request-eyebrow className="flex items-center gap-4">
            <span className="h-px w-12 bg-[#C9B896]" />

            <span className="text-[0.58rem] font-medium uppercase tracking-[0.29em] text-white/38">
              Private transport enquiry
            </span>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <div className="overflow-hidden">
                <h1
                  data-request-title-line
                  className="font-prestige-serif max-w-6xl text-[clamp(4.4rem,9vw,10rem)] font-normal leading-[0.81] tracking-[-0.05em]"
                >
                  Tell us about
                </h1>
              </div>

              <div className="overflow-hidden">
                <h1
                  data-request-title-line
                  className="font-prestige-serif text-[clamp(4.4rem,9vw,10rem)] font-normal italic leading-[0.81] tracking-[-0.05em] text-[#C9B896]"
                >
                  the vehicle.
                </h1>
              </div>
            </div>

            <div
              data-request-intro
              className="border-l border-[#C9B896]/45 pl-6"
            >
              <p className="text-[0.95rem] font-light leading-8 text-white/45">
                Every request is reviewed individually before availability,
                equipment, or pricing is confirmed.
              </p>

              <div className="mt-6 flex items-center gap-3 text-[0.56rem] font-medium uppercase tracking-[0.22em] text-white/28">
                <ShieldCheck
                  className="size-4 text-[#C9B896]"
                  strokeWidth={1.35}
                />
                Private and confidential
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="relative h-px bg-white/10">
        <motion.div
          animate={{
            width: `${progress}%`,
          }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="h-full bg-[#C9B896]"
        />
      </div>

      <section className="relative z-10 mx-auto grid max-w-[1540px] gap-12 px-5 py-14 md:px-10 lg:grid-cols-[280px_1fr] lg:py-24">
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <p className="text-[0.56rem] font-medium uppercase tracking-[0.26em] text-white/24">
              Enquiry index
            </p>

            <div className="mt-8">
              {steps.map((label, index) => {
                const isCurrent = index === step;
                const isComplete = index < step;
                const isAvailable = index <= step;

                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => isAvailable && goToStep(index)}
                    className={`group flex w-full items-baseline justify-between border-b py-5 text-left transition-colors duration-300 ${
                      isCurrent
                        ? "border-[#C9B896] text-white"
                        : isComplete
                          ? "border-white/10 text-white/48 hover:text-white"
                          : "border-white/[0.07] text-white/18"
                    }`}
                  >
                    <span className="font-prestige-serif text-[1.35rem] leading-none">
                      {label}
                    </span>

                    <span
                      className={`font-mono text-[0.52rem] tracking-[0.18em] ${
                        isCurrent || isComplete
                          ? "text-[#C9B896]"
                          : "text-white/14"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-10 border-l border-[#C9B896] pl-5">
              <p className="text-[0.52rem] font-medium uppercase tracking-[0.22em] text-[#C9B896]">
                Current chapter
              </p>

              <p className="font-prestige-serif mt-3 text-2xl">{steps[step]}</p>
            </div>
          </div>
        </aside>

        <section
          data-request-panel
          className="border border-white/[0.09] bg-[#0A0A09]/88 p-6 backdrop-blur-xl md:p-10 lg:p-14"
        >
          <div className="mb-10 flex items-center justify-between border-b border-white/[0.08] pb-5 lg:hidden">
            <span className="text-[0.55rem] font-medium uppercase tracking-[0.24em] text-white/28">
              {String(step + 1).padStart(2, "0")} · {steps[step]}
            </span>

            <span className="text-[0.55rem] font-medium tracking-[0.18em] text-[#C9B896]">
              {step + 1}/{steps.length}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{
                opacity: 0,
                y: 22,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -18,
              }}
              transition={{
                duration: 0.42,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {step === 0 && (
                <>
                  <StepHeading
                    icon={Sparkles}
                    number="01"
                    eyebrow="Transport character"
                    title="Choose the character of the journey."
                    copy="Select the service that feels closest to the movement you have in mind. The final transport method will be confirmed after review."
                  />

                  <div className="mt-12 grid gap-3 sm:grid-cols-2">
                    {transportTypes.map((type) => (
                      <ChoiceCard
                        key={type}
                        label={type}
                        active={form.transportType === type}
                        onClick={() => update("transportType", type)}
                      />
                    ))}
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <StepHeading
                    icon={CarFront}
                    number="02"
                    eyebrow="Vehicle profile"
                    title="Introduce us to the vehicle."
                    copy="The details below help us understand its proportions, condition, value, clearance, and the equipment the movement may require."
                  />

                  <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                    <Field
                      label="Year"
                      value={form.year}
                      onChange={(value) => update("year", value)}
                    />

                    <Field
                      label="Make"
                      value={form.make}
                      onChange={(value) => update("make", value)}
                    />

                    <Field
                      label="Model"
                      value={form.model}
                      onChange={(value) => update("model", value)}
                    />

                    <Field
                      label="Trim or specification"
                      value={form.trim}
                      onChange={(value) => update("trim", value)}
                    />

                    <Field
                      label="VIN — optional"
                      value={form.vin}
                      onChange={(value) => update("vin", value)}
                    />

                    <SelectField
                      label="Estimated value"
                      value={form.valueRange}
                      onChange={(value) => update("valueRange", value)}
                      options={[
                        "Under $50,000",
                        "$50,000–$100,000",
                        "$100,000–$250,000",
                        "$250,000–$500,000",
                        "$500,000+",
                        "Prefer not to state",
                      ]}
                    />

                    <SelectField
                      label="Operating condition"
                      value={form.operatingCondition}
                      onChange={(value) => update("operatingCondition", value)}
                      options={[
                        "Operable",
                        "Non-running",
                        "Starts but does not drive",
                        "Condition unknown",
                      ]}
                    />

                    <SelectField
                      label="Vehicle configuration"
                      value={form.modified}
                      onChange={(value) => update("modified", value)}
                      options={[
                        "Factory specification",
                        "Modified",
                        "Restored",
                        "Race-prepared",
                        "Unknown",
                      ]}
                    />

                    <Field
                      label="Ground clearance"
                      value={form.clearance}
                      placeholder="Measurement or estimate"
                      onChange={(value) => update("clearance", value)}
                    />
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <StepHeading
                    icon={MapPin}
                    number="03"
                    eyebrow="Collection"
                    title="Where will we collect it?"
                    copy="The collection environment can influence trailer positioning, access, loading method, and the timing of the movement."
                  />

                  <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Field
                        label="Collection address"
                        value={form.pickupAddress}
                        onChange={(value) => update("pickupAddress", value)}
                      />
                    </div>

                    <SelectField
                      label="Collection setting"
                      value={form.pickupType}
                      onChange={(value) => update("pickupType", value)}
                      options={pickupTypes}
                    />

                    <Field
                      label="Preferred collection date"
                      type="date"
                      value={form.pickupDate}
                      onChange={(value) => update("pickupDate", value)}
                    />

                    <Field
                      label="Collection contact"
                      value={form.pickupContact}
                      onChange={(value) => update("pickupContact", value)}
                    />

                    <Field
                      label="Collection contact number"
                      value={form.pickupPhone}
                      onChange={(value) => update("pickupPhone", value)}
                    />

                    <SelectField
                      label="Date flexibility"
                      value={form.datesFlexible}
                      onChange={(value) => update("datesFlexible", value)}
                      options={["Flexible", "Fixed date", "Some flexibility"]}
                    />

                    <div className="sm:col-span-2">
                      <TextArea
                        label="Collection access"
                        placeholder="Gate access, narrow roads, underground parking, height restrictions, indoor collection, trailer limitations..."
                        value={form.pickupAccess}
                        onChange={(value) => update("pickupAccess", value)}
                      />
                    </div>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <StepHeading
                    icon={MapPin}
                    number="04"
                    eyebrow="Delivery"
                    title="Where should it arrive?"
                    copy="Tell us about the receiving location, preferred timing, and any conditions that should shape the final handover."
                  />

                  <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Field
                        label="Delivery address"
                        value={form.deliveryAddress}
                        onChange={(value) => update("deliveryAddress", value)}
                      />
                    </div>

                    <SelectField
                      label="Delivery setting"
                      value={form.deliveryType}
                      onChange={(value) => update("deliveryType", value)}
                      options={pickupTypes}
                    />

                    <Field
                      label="Preferred delivery window"
                      value={form.deliveryWindow}
                      placeholder="Date or timing preference"
                      onChange={(value) => update("deliveryWindow", value)}
                    />

                    <Field
                      label="Receiving contact"
                      value={form.deliveryContact}
                      onChange={(value) => update("deliveryContact", value)}
                    />

                    <Field
                      label="Receiving contact number"
                      value={form.deliveryPhone}
                      onChange={(value) => update("deliveryPhone", value)}
                    />

                    <div className="sm:col-span-2">
                      <TextArea
                        label="Delivery access"
                        placeholder="Gate instructions, loading zone, driveway grade, indoor placement, venue access, receiving protocol..."
                        value={form.deliveryAccess}
                        onChange={(value) => update("deliveryAccess", value)}
                      />
                    </div>
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  <StepHeading
                    icon={ShieldCheck}
                    number="05"
                    eyebrow="Particular care"
                    title="Tell us what deserves particular care."
                    copy="Select every condition that may influence handling. You may add anything more specific in the private notes below."
                  />

                  <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {handlingOptions.map((option) => (
                      <ChoiceCard
                        key={option}
                        label={option}
                        active={form.handling.includes(option)}
                        onClick={() => toggleHandling(option)}
                        icon={
                          option === "Confidential transport"
                            ? EyeOff
                            : ShieldCheck
                        }
                      />
                    ))}
                  </div>

                  <div className="mt-10 grid gap-3 sm:grid-cols-2">
                    <ChoiceCard
                      label="Request discreet handling"
                      active={form.confidentiality}
                      onClick={() =>
                        update("confidentiality", !form.confidentiality)
                      }
                      icon={EyeOff}
                    />

                    <ChoiceCard
                      label="Permit public photography"
                      active={form.publicPhotography}
                      onClick={() =>
                        update("publicPhotography", !form.publicPhotography)
                      }
                      icon={Camera}
                    />
                  </div>

                  <div className="mt-10">
                    <TextArea
                      label="Private handling notes"
                      placeholder="Custom controls, alarm systems, battery disconnects, wheel-lock keys, fragile components, specific loading instructions..."
                      value={form.specialInstructions}
                      onChange={(value) => update("specialInstructions", value)}
                    />
                  </div>
                </>
              )}

              {step === 5 && (
                <>
                  <StepHeading
                    icon={Camera}
                    number="06"
                    eyebrow="Photography"
                    title="A closer look at the vehicle."
                    copy="Clear photographs allow us to review condition, clearance, bodywork, wheels, and the collection environment before proposing the movement."
                  />

                  <label className="group mt-12 flex min-h-[340px] cursor-pointer flex-col items-center justify-center border border-dashed border-white/16 bg-white/[0.012] px-6 text-center transition-all duration-500 hover:border-[#C9B896] hover:bg-[#C9B896]/[0.025]">
                    <div className="grid size-14 place-items-center border border-[#C9B896]/35 text-[#C9B896] transition-colors duration-500 group-hover:bg-[#C9B896] group-hover:text-black">
                      <Upload className="size-5" strokeWidth={1.35} />
                    </div>

                    <p className="font-prestige-serif mt-7 text-3xl">
                      Select vehicle photographs
                    </p>

                    <p className="mt-4 max-w-xl text-sm font-light leading-7 text-white/34">
                      Front and rear three-quarter views, both sides, wheels,
                      visible condition, front clearance, and collection access
                      are recommended.
                    </p>

                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(event) =>
                        update("photos", Array.from(event.target.files || []))
                      }
                    />
                  </label>

                  {form.photos.length > 0 && (
                    <div className="mt-5 flex items-center justify-between border border-white/10 bg-white/[0.015] px-5 py-4">
                      <span className="text-sm font-light text-white/55">
                        {form.photos.length} photograph
                        {form.photos.length === 1 ? "" : "s"} selected
                      </span>

                      <Check className="size-4 text-[#C9B896]" />
                    </div>
                  )}
                </>
              )}

              {step === 6 && (
                <>
                  <StepHeading
                    icon={UserRound}
                    number="07"
                    eyebrow="Private client"
                    title="Who may we speak with?"
                    copy="A Prestige representative will use these details to review the request and discuss timing, equipment, and availability."
                  />

                  <div className="mt-12">
                    <p className="mb-4 text-[0.57rem] font-medium uppercase tracking-[0.24em] text-white/30">
                      Client relationship
                    </p>

                    <div className="grid gap-3 sm:grid-cols-3">
                      {[
                        ["Private owner", UserRound],
                        ["Dealer or business", Building2],
                        ["Concierge or representative", Sparkles],
                      ].map(([label, Icon]) => (
                        <ChoiceCard
                          key={label}
                          label={label}
                          active={form.clientType === label}
                          onClick={() => update("clientType", label)}
                          icon={Icon}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2">
                    <Field
                      label="Full name"
                      value={form.name}
                      onChange={(value) => update("name", value)}
                    />

                    <Field
                      label="Company or collection"
                      value={form.company}
                      onChange={(value) => update("company", value)}
                    />

                    <Field
                      label="Telephone"
                      value={form.phone}
                      onChange={(value) => update("phone", value)}
                    />

                    <Field
                      label="Email"
                      type="email"
                      value={form.email}
                      onChange={(value) => update("email", value)}
                    />

                    <SelectField
                      label="Preferred contact"
                      value={form.preferredContact}
                      onChange={(value) => update("preferredContact", value)}
                      options={["Telephone", "Text message", "Email"]}
                    />

                    <Field
                      label="Introduction or referral"
                      value={form.referralSource}
                      placeholder="How did you hear about Prestige?"
                      onChange={(value) => update("referralSource", value)}
                    />
                  </div>
                </>
              )}

              {step === 7 && (
                <>
                  <StepHeading
                    icon={Check}
                    number="08"
                    eyebrow="Review"
                    title="One final review."
                    copy="This enquiry allows Prestige to consider the vehicle, route, timing, and handling requirements. It does not yet confirm availability or booking."
                  />

                  <div className="mt-12 border-t border-white/10">
                    <ReviewRow
                      label="Transport preference"
                      value={form.transportType}
                    />

                    <ReviewRow
                      label="Vehicle"
                      value={`${form.year} ${form.make} ${form.model} ${form.trim}`.trim()}
                    />

                    <ReviewRow
                      label="Condition"
                      value={form.operatingCondition}
                    />

                    <ReviewRow label="Collection" value={form.pickupAddress} />

                    <ReviewRow
                      label="Preferred collection"
                      value={form.pickupDate}
                    />

                    <ReviewRow label="Delivery" value={form.deliveryAddress} />

                    <ReviewRow
                      label="Particular care"
                      value={form.handling.join(", ")}
                    />

                    <ReviewRow
                      label="Discretion"
                      value={
                        form.confidentiality
                          ? "Discreet handling requested"
                          : "Standard handling"
                      }
                    />

                    <ReviewRow
                      label="Photography"
                      value={`${form.photos.length} selected`}
                    />

                    <ReviewRow
                      label="Client"
                      value={`${form.name}${
                        form.company ? ` · ${form.company}` : ""
                      }`}
                    />

                    <ReviewRow
                      label="Preferred contact"
                      value={form.preferredContact}
                    />
                  </div>

                  <div className="mt-8">
                    <SectionNote>
                      Hammer Head Prestige will review the vehicle, route,
                      timing, access, equipment requirements, and current
                      operating capacity before confirming availability or
                      issuing a private quotation.
                    </SectionNote>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-14 flex items-center justify-between border-t border-white/[0.08] pt-8">
            <button
              type="button"
              onClick={previousStep}
              disabled={step === 0}
              className="group flex items-center gap-3 text-[0.57rem] font-medium uppercase tracking-[0.2em] text-white/38 transition-colors hover:text-white disabled:pointer-events-none disabled:opacity-15"
            >
              <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
              Previous
            </button>

            {step < steps.length - 1 ? (
              <motion.button
                type="button"
                onClick={nextStep}
                whileHover={{
                  x: 4,
                }}
                whileTap={{
                  scale: 0.99,
                }}
                className="group flex min-h-14 items-center gap-10 bg-[#F4F0E8] px-6 text-[0.58rem] font-medium uppercase tracking-[0.2em] text-black transition-colors duration-300 hover:bg-[#C9B896]"
              >
                Continue
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </motion.button>
            ) : (
              <motion.button
                type="button"
                onClick={submitRequest}
                whileHover={{
                  x: 4,
                }}
                whileTap={{
                  scale: 0.99,
                }}
                className="group flex min-h-14 items-center gap-10 bg-[#C9B896] px-6 text-[0.58rem] font-medium uppercase tracking-[0.2em] text-black transition-colors duration-300 hover:bg-[#F4F0E8]"
              >
                Submit private enquiry
                <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </motion.button>
            )}
          </div>
        </section>
      </section>

      <footer className="relative border-t border-white/[0.08] px-5 py-6 md:px-10">
        <div className="mx-auto flex max-w-[1540px] items-center justify-between text-[0.49rem] font-medium uppercase tracking-[0.22em] text-white/18">
          <span>Hammer Head Prestige</span>

          <span className="hidden sm:block">Private vehicle transport</span>

          <span className="text-[#C9B896]">Enquiry by review</span>
        </div>
      </footer>
    </main>
  );
}
