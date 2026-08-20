// src/pages/RequestRecoveryPage.jsx

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Camera,
  Car,
  Check,
  Clock3,
  LocateFixed,
  Loader2,
  MapPin,
  Phone,
  ShieldAlert,
  Truck,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import LiveLocationPage from "./LiveLocationPage";
import { getAttribution } from "@/lib/attribution";

const steps = [
  "Situation",
  "Urgency",
  "Location",
  "Vehicle",
  "Photos",
  "Contact",
  "Review",
];

const situations = [
  "Disabled vehicle",
  "Accident recovery",
  "Stuck / winch-out",
  "Roadside assistance",
  "Scheduled transport",
];

export default function RequestRecoveryPage({
  phoneNumber = "(631) 300-5559",
  logoSrc = "/images/hammerhead-logo.png",
}) {
  const [step, setStep] = useState(0);
  const [showLiveLocation, setShowLiveLocation] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [form, setForm] = useState({
    situation: "",
    urgency: "",
    pickupAddress: "",
    latitude: null,
    longitude: null,
    destination: "",
    year: "",
    make: "",
    model: "",
    condition: "",
    keysAvailable: "",
    color: "",
    vin: "",
    licensePlate: "",
    licensePlateState: "",
    poNumber: "",
    notes: "",
    photos: [],
    name: "",
    phone: "",
    email: "",
  });

  const progress = useMemo(() => ((step + 1) / steps.length) * 100, [step]);

  function updateForm(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function next() {
    setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  function previous() {
    setStep((current) => Math.max(current - 1, 0));
  }

  function removePhoto(index) {
    setForm((current) => ({
      ...current,
      photos: current.photos.filter((_, i) => i !== index),
    }));
  }

  async function submitRequest() {
    setSubmitting(true);
    setSubmitError("");

    try {
      // 1. Upload photos
      const uploadedUrls = [];
      for (const file of form.photos) {
        try {
          const fd = new FormData();
          fd.append("file", file);
          fd.append("requestId", "pending");
          const uploadRes = await fetch("/.netlify/functions/upload-photo", {
            method: "POST",
            body: fd,
          });
          if (uploadRes.ok) {
            const uploadData = await uploadRes.json();
            uploadedUrls.push(uploadData.url);
          }
        } catch {
          // Photo upload failure shouldn't block the request
        }
      }

      // 2. Get marketing attribution
      const attribution = getAttribution();

      // 3. Submit to Netlify function
      const payload = {
        name: form.name,
        phone: form.phone,
        email: form.email,
        situation: form.situation,
        urgency: form.urgency,
        pickupAddress: form.pickupAddress,
        latitude: form.latitude,
        longitude: form.longitude,
        destination: form.destination,
        year: form.year,
        make: form.make,
        model: form.model,
        condition: form.condition,
        keysAvailable: form.keysAvailable,
        color: form.color,
        vin: form.vin,
        licensePlate: form.licensePlate,
        licensePlateState: form.licensePlateState,
        poNumber: form.poNumber,
        notes: form.notes,
        photo_urls: uploadedUrls,
        ...attribution,
      };

      const res = await fetch("/.netlify/functions/create-service-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");

      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err.message || "Something went wrong. Please call dispatch directly.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  /* ---- Live location sub-view ---- */
  if (showLiveLocation) {
    return (
      <LiveLocationPage
        logoSrc={logoSrc}
        phoneNumber={phoneNumber}
        onLocationChange={(location) => {
          setForm((current) => ({
            ...current,
            latitude: location.latitude,
            longitude: location.longitude,
          }));
        }}
        onContinue={() => {
          setShowLiveLocation(false);
          next();
        }}
      />
    );
  }

  /* ---- Success screen ---- */
  if (submitted) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#050505] px-5 text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl border border-white/10 bg-[#0A0A0A] p-8 sm:p-12"
        >
          <div className="grid h-14 w-14 place-items-center bg-[#D3131A]">
            <Check className="h-6 w-6" />
          </div>

          <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.26em] text-[#D3131A]">
            Request received
          </p>

          <h1 className="mt-4 text-4xl font-semibold uppercase tracking-[-0.045em] sm:text-6xl">
            Dispatch review started.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-white/50">
            Hammer Head has received your vehicle and location details. Call
            dispatch for immediate confirmation.
          </p>

          <a
            href={`tel:${phoneNumber.replace(/[^\d+]/g, "")}`}
            className="mt-8 flex w-full items-center justify-between bg-[#D3131A] px-5 py-4 text-[11px] font-bold uppercase tracking-[0.18em]"
          >
            Call dispatch
            <Phone className="h-5 w-5" />
          </a>
        </motion.div>
      </main>
    );
  }

  /* ---- Multi-step form ---- */
  return (
    <main className="min-h-screen bg-[#050505] text-[#F4F1EC]">
      <header className="flex items-center justify-between border-b border-white/10 px-5 py-4 md:px-10">
        <Link to="/">
          <img src={logoSrc} alt="Hammer Head" className="h-11 w-auto" />
        </Link>

        <a
          href={`tel:${phoneNumber.replace(/[^\d+]/g, "")}`}
          className="flex items-center gap-2 border border-[#D3131A] px-4 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white"
        >
          <Phone className="h-4 w-4" />
          Call dispatch
        </a>
      </header>

      <div className="h-[3px] bg-white/10">
        <motion.div
          animate={{ width: `${progress}%` }}
          className="h-full bg-[#D3131A]"
        />
      </div>

      <section className="mx-auto grid max-w-[1450px] gap-10 px-5 py-12 md:px-10 lg:grid-cols-[320px_1fr] lg:py-20">
        <aside>
          <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#D3131A]">
            Recovery intake
          </p>

          <h1 className="mt-5 text-4xl font-semibold uppercase leading-[0.92] tracking-[-0.05em]">
            Tell us what's happening.
          </h1>

          <div className="mt-9 space-y-1">
            {steps.map((label, index) => (
              <div
                key={label}
                className={`flex items-center justify-between border-b px-1 py-4 text-[10px] font-bold uppercase tracking-[0.17em] ${
                  index === step
                    ? "border-[#D3131A] text-white"
                    : "border-white/10 text-white/25"
                }`}
              >
                <span>
                  {String(index + 1).padStart(2, "0")} / {label}
                </span>
                {index < step && <Check className="h-4 w-4 text-[#D3131A]" />}
              </div>
            ))}
          </div>
        </aside>

        <section className="border border-white/10 bg-[#0A0A0A] p-6 sm:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3 }}
            >
              {/* STEP 0 — Situation */}
              {step === 0 && (
                <div>
                  <StepHeader icon={ShieldAlert} eyebrow="Step 01" title="What is happening?" />
                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    {situations.map((item) => (
                      <Choice key={item} active={form.situation === item} onClick={() => updateForm("situation", item)} label={item} icon={Truck} />
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 1 — Urgency */}
              {step === 1 && (
                <div>
                  <StepHeader icon={Clock3} eyebrow="Step 02" title="How soon do you need help?" />
                  <div className="mt-8 grid gap-3">
                    {["Immediate", "Within one hour", "Scheduled"].map((item) => (
                      <Choice key={item} active={form.urgency === item} onClick={() => updateForm("urgency", item)} label={item} icon={Clock3} />
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2 — Location */}
              {step === 2 && (
                <div>
                  <StepHeader icon={MapPin} eyebrow="Step 03" title="Where is the vehicle?" />

                  <button
                    type="button"
                    onClick={() => setShowLiveLocation(true)}
                    className="mt-8 flex w-full items-center justify-between bg-[#D3131A] px-5 py-5 text-left text-[11px] font-bold uppercase tracking-[0.16em]"
                  >
                    <span className="flex items-center gap-3">
                      <LocateFixed className="h-5 w-5" />
                      Share live location
                    </span>
                    <ArrowRight className="h-5 w-5" />
                  </button>

                  <div className="my-6 flex items-center gap-4">
                    <div className="h-px flex-1 bg-white/10" />
                    <span className="text-[9px] uppercase tracking-[0.2em] text-white/25">Or enter manually</span>
                    <div className="h-px flex-1 bg-white/10" />
                  </div>

                  <Field label="Pickup address or landmark" value={form.pickupAddress} onChange={(v) => updateForm("pickupAddress", v)} />
                  <Field label="Destination" value={form.destination} onChange={(v) => updateForm("destination", v)} />
                </div>
              )}

              {/* STEP 3 — Vehicle (with Towbook fields) */}
              {step === 3 && (
                <div>
                  <StepHeader icon={Car} eyebrow="Step 04" title="Vehicle details" />

                  <div className="mt-8 grid gap-4 sm:grid-cols-3">
                    <Field label="Year" value={form.year} onChange={(v) => updateForm("year", v)} />
                    <Field label="Make" value={form.make} onChange={(v) => updateForm("make", v)} />
                    <Field label="Model" value={form.model} onChange={(v) => updateForm("model", v)} />
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <Field label="Vehicle color" value={form.color} onChange={(v) => updateForm("color", v)} />
                    <SelectField label="Vehicle condition" value={form.condition} onChange={(v) => updateForm("condition", v)} options={["Operable", "Non-operable", "Damaged"]} />
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <SelectField label="Keys available" value={form.keysAvailable} onChange={(v) => updateForm("keysAvailable", v)} options={["Yes", "No", "Unsure"]} />
                    <Field label="License plate" value={form.licensePlate} onChange={(v) => updateForm("licensePlate", v)} />
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    <Field label="Plate state" value={form.licensePlateState} onChange={(v) => updateForm("licensePlateState", v)} />
                    <Field label="VIN (optional)" value={form.vin} onChange={(v) => updateForm("vin", v)} />
                    <Field label="PO # (optional)" value={form.poNumber} onChange={(v) => updateForm("poNumber", v)} />
                  </div>

                  <TextArea label="Additional notes" value={form.notes} onChange={(v) => updateForm("notes", v)} />
                </div>
              )}

              {/* STEP 4 — Photos */}
              {step === 4 && (
                <div>
                  <StepHeader icon={Camera} eyebrow="Step 05" title="Upload vehicle photos" />

                  <label className="mt-8 flex min-h-[220px] cursor-pointer flex-col items-center justify-center border border-dashed border-white/20 bg-white/[0.02] text-center transition hover:border-[#D3131A]">
                    <Camera className="h-9 w-9 text-[#D3131A]" />
                    <p className="mt-5 text-sm font-semibold uppercase tracking-[0.12em]">Select photos</p>
                    <p className="mt-2 max-w-sm text-xs leading-5 text-white/35">
                      Upload the vehicle, visible damage, roadside position, or access conditions.
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        updateForm("photos", [...form.photos, ...files].slice(0, 8));
                      }}
                    />
                  </label>

                  {form.photos.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-3">
                      {form.photos.map((file, i) => (
                        <div key={i} className="group relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Photo ${i + 1}`}
                            className="h-20 w-20 rounded border border-white/10 object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(i)}
                            className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-red-600 text-white opacity-0 transition group-hover:opacity-100"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      <p className="mt-2 w-full text-[10px] text-white/25">{form.photos.length}/8 photos</p>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 5 — Contact */}
              {step === 5 && (
                <div>
                  <StepHeader icon={Phone} eyebrow="Step 06" title="How should dispatch reach you?" />
                  <div className="mt-8 space-y-4">
                    <Field label="Full name" value={form.name} onChange={(v) => updateForm("name", v)} />
                    <Field label="Phone number" value={form.phone} onChange={(v) => updateForm("phone", v)} />
                    <Field label="Email address" value={form.email} onChange={(v) => updateForm("email", v)} />
                  </div>
                </div>
              )}

              {/* STEP 6 — Review */}
              {step === 6 && (
                <div>
                  <StepHeader icon={Check} eyebrow="Step 07" title="Review your request" />

                  <div className="mt-8 divide-y divide-white/10 border border-white/10">
                    <ReviewRow label="Situation" value={form.situation} />
                    <ReviewRow label="Urgency" value={form.urgency} />
                    <ReviewRow
                      label="Pickup"
                      value={form.pickupAddress || (form.latitude ? `${form.latitude}, ${form.longitude}` : "Not provided")}
                    />
                    <ReviewRow label="Destination" value={form.destination} />
                    <ReviewRow label="Vehicle" value={[form.year, form.make, form.model].filter(Boolean).join(" ")} />
                    <ReviewRow label="Color" value={form.color} />
                    <ReviewRow label="Plate" value={[form.licensePlate, form.licensePlateState].filter(Boolean).join(" / ")} />
                    <ReviewRow label="Condition" value={form.condition} />
                    <ReviewRow label="Photos" value={form.photos.length > 0 ? `${form.photos.length} photo(s)` : null} />
                    <ReviewRow label="Customer" value={form.name} />
                    <ReviewRow label="Phone" value={form.phone} />
                    <ReviewRow label="Email" value={form.email} />
                  </div>

                  {submitError && (
                    <div className="mt-5 flex items-center gap-2 border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-400">
                      <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                      {submitError}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">
            <button
              type="button"
              onClick={previous}
              disabled={step === 0}
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/50 disabled:opacity-20"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            {step < steps.length - 1 ? (
              <button
                type="button"
                onClick={next}
                className="flex items-center gap-5 bg-[#D3131A] px-5 py-4 text-[10px] font-bold uppercase tracking-[0.16em] text-white"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={submitRequest}
                disabled={submitting}
                className="flex items-center gap-5 bg-[#D3131A] px-5 py-4 text-[10px] font-bold uppercase tracking-[0.16em] text-white disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    Submit request
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

/* ---- Sub-components (unchanged design) ---- */

function StepHeader({ icon: Icon, eyebrow, title }) {
  return (
    <div>
      <div className="flex items-center gap-3 text-[#D3131A]">
        <Icon className="h-5 w-5" />
        <span className="text-[9px] font-bold uppercase tracking-[0.25em]">{eyebrow}</span>
      </div>
      <h2 className="mt-5 text-3xl font-semibold uppercase tracking-[-0.04em] sm:text-5xl">{title}</h2>
    </div>
  );
}

function Choice({ label, active, onClick, icon: Icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-24 items-center justify-between border px-5 text-left transition ${
        active ? "border-[#D3131A] bg-[#D3131A]/10" : "border-white/10 bg-white/[0.02] hover:border-white/25"
      }`}
    >
      <span className="text-sm font-semibold uppercase tracking-[-0.01em]">{label}</span>
      <Icon className={`h-5 w-5 ${active ? "text-[#D3131A]" : "text-white/30"}`} />
    </button>
  );
}

function Field({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[9px] font-bold uppercase tracking-[0.2em] text-white/35">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-white/10 bg-[#050505] px-4 py-4 text-sm text-white outline-none transition focus:border-[#D3131A]"
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[9px] font-bold uppercase tracking-[0.2em] text-white/35">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-white/10 bg-[#050505] px-4 py-4 text-sm text-white outline-none focus:border-[#D3131A]"
      >
        <option value="">Select</option>
        {options.map((option) => (<option key={option}>{option}</option>))}
      </select>
    </label>
  );
}

function TextArea({ label, value, onChange }) {
  return (
    <label className="mt-4 block">
      <span className="mb-2 block text-[9px] font-bold uppercase tracking-[0.2em] text-white/35">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        className="w-full resize-none border border-white/10 bg-[#050505] px-4 py-4 text-sm text-white outline-none focus:border-[#D3131A]"
      />
    </label>
  );
}

function ReviewRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="grid gap-2 px-5 py-4 sm:grid-cols-[160px_1fr]">
      <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/30">{label}</span>
      <span className="text-sm text-white/75">{value}</span>
    </div>
  );
}
