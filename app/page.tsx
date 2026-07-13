import Link from "next/link";
import {
  ArrowRight,
  Check,
  CircleDollarSign,
  Clock,
  Cpu,
  Database,
  FileUp,
  Layers,
  Lock,
  Play,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";

import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

const CARD_SHELL =
  "bg-white rounded-3xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]";

const stats = [
  {
    icon: CircleDollarSign,
    value: "$60/hr",
    label:
      "The burdened rate you're paying senior estimators to retype numbers.",
  },
  {
    icon: Clock,
    value: "3–10 hrs",
    label:
      "Lost per estimator, every single week, to Bluebeam → CavSoft re-entry.",
  },
  {
    icon: TrendingUp,
    value: "+2–3",
    label:
      "Extra tenders priced and submitted each month when those hours come back.",
  },
];

const steps = [
  {
    number: "01",
    icon: FileUp,
    title: "Drop the exports",
    body: "Export your takeoff from Bluebeam Revu exactly the way you already do — every system at once. Drop them on TenderLabs. That's the whole workflow change.",
  },
  {
    number: "02",
    icon: Layers,
    title: "Mapped in memory",
    body: "Levels, systems and line items are consolidated in RAM — Level-by-Level or Lump Sum — with verification totals on every sheet. Transposition errors are eliminated, not proofread.",
  },
  {
    number: "03",
    icon: Zap,
    title: "Import-ready in seconds",
    body: "You're holding a CavSoft-ready workbook per level, plus a master summary for the whole tender. Open, import, price. No retyping. No cleanup pass.",
  },
];

const zdrPoints = [
  {
    icon: Cpu,
    title: "Processed entirely in RAM",
    body: "Your takeoff exists in volatile memory for the seconds it takes to convert — then it's gone.",
  },
  {
    icon: Database,
    title: "No disk. No storage. No copies.",
    body: "Nothing is written to disk, object storage, or backups. There is no file for anyone to leak.",
  },
  {
    icon: Lock,
    title: "Your rates never leave the transaction",
    body: "Quantities, item codes and pricing are never logged — not even inside error messages.",
  },
];

const tiers: {
  name: string;
  price: string;
  cadence: string;
  description: string;
  roiLine: string;
  features: string[];
  highlighted: boolean;
}[] = [
  {
    name: "Estimator",
    price: "$499",
    cadence: "/month",
    description: "One estimator. Every tender, converted.",
    roiLine: "Covered by ~2 recovered hours a week.",
    features: [
      "1 seat",
      "25 conversions / month",
      "Level-by-Level & Lump Sum modes",
      "Batch multi-system uploads",
      "Email support",
    ],
    highlighted: false,
  },
  {
    name: "Bureau",
    price: "$999",
    cadence: "/month",
    description: "For estimating teams pricing work every week.",
    roiLine: "≈ 4 recovered hours. Your team gets back 40+ a month.",
    features: [
      "5 seats",
      "Unlimited conversions",
      "Level-by-Level & Lump Sum modes",
      "Batch multi-system uploads",
      "Priority support, same-day answers",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "$1,499",
    cadence: "/month",
    description: "Standardise takeoff-to-CavSoft across every office.",
    roiLine: "One workflow, every branch, every estimator.",
    features: [
      "Unlimited seats",
      "Unlimited conversions",
      "Custom column mappings",
      "Same-day support SLA",
      "Quarterly workflow reviews",
    ],
    highlighted: false,
  },
];

function CtaLink({
  href,
  children,
  variant = "primary",
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-[15px] font-semibold transition-all duration-200",
        variant === "primary" &&
          "bg-slate-900 text-white shadow-[0_8px_30px_rgb(15,23,42,0.25)] hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-[0_12px_40px_rgb(15,23,42,0.3)]",
        variant === "secondary" &&
          "border border-slate-200 bg-white text-slate-700 shadow-[0_2px_10px_rgb(0,0,0,0.04)] hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-900",
        className
      )}
    >
      {children}
    </Link>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 font-mono text-xs font-medium tracking-[0.3em] text-amber-600 uppercase">
      {children}
    </p>
  );
}

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col overflow-x-clip bg-white text-slate-900">
      {/* Glass navbar */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3.5">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-500 md:flex">
            <a href="#how-it-works" className="transition-colors hover:text-slate-900">
              How it works
            </a>
            <a href="#security" className="transition-colors hover:text-slate-900">
              Security
            </a>
            <a href="#pricing" className="transition-colors hover:text-slate-900">
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="inline-flex h-9 items-center rounded-full px-4 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-slate-900 px-4.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgb(15,23,42,0.25)] transition-all duration-200 hover:-translate-y-px hover:bg-slate-800"
            >
              Get started
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        {/* ————— Hero ————— */}
        <section className="relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-blueprint-grid [mask-image:radial-gradient(ellipse_75%_65%_at_50%_0%,black,transparent)] opacity-70"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-48 left-1/2 h-130 w-225 -translate-x-1/2 rounded-full bg-amber-200/40 blur-[160px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-40 -right-40 h-96 w-96 rounded-full bg-slate-200/60 blur-[140px]"
          />

          <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center gap-8 px-6 pt-40 pb-24 text-center">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-slate-200/80 bg-white/80 py-1.5 pr-4 pl-2.5 text-xs font-medium text-slate-600 shadow-[0_2px_12px_rgb(0,0,0,0.05)] backdrop-blur">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-amber-500" />
              </span>
              Purpose-built for Bluebeam Revu → CavSoft estimating teams
            </div>

            <h1 className="max-w-4xl text-5xl leading-[1.05] font-semibold tracking-tighter text-balance text-slate-900 sm:text-6xl lg:text-7xl">
              Keep measuring in Bluebeam.{" "}
              <span className="bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 bg-clip-text text-transparent">
                Stop retyping into CavSoft.
              </span>
            </h1>

            <p className="max-w-2xl text-lg leading-relaxed text-balance text-slate-600 sm:text-xl">
              Your estimators bill out at{" "}
              <span className="font-semibold text-slate-900">$60 an hour</span>{" "}
              — and they&apos;re burning{" "}
              <span className="font-semibold text-slate-900">
                3–10 hours a week
              </span>{" "}
              working as data clerks between Bluebeam and CavSoft. TenderLabs
              turns the exports they already make into import-ready CavSoft
              workbooks in seconds.
            </p>

            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <CtaLink href="/signup">
                Reclaim your estimators&apos; hours
                <ArrowRight className="size-4" />
              </CtaLink>
              <CtaLink href="#demo" variant="secondary">
                <Play className="size-3.5 fill-current" />
                Watch the 3-minute demo
              </CtaLink>
            </div>

            <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <ShieldCheck className="size-3.5 text-amber-600" />
              Zero data retention — takeoffs are processed in memory and never
              stored.
            </p>
          </div>
        </section>

        {/* ————— ROI stats ————— */}
        <section className="relative border-y border-slate-200/60 bg-slate-50/80">
          <div className="mx-auto w-full max-w-6xl px-6 py-24">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <SectionEyebrow>The silent five-figure leak</SectionEyebrow>
              <h2 className="text-4xl font-semibold tracking-tight text-balance text-slate-900 sm:text-5xl">
                Stop paying senior talent to be data clerks.
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                The hours aren&apos;t the real cost. The real cost is every
                tender you didn&apos;t have time to price. More hours back means
                more submissions; more submissions means more wins — top-line
                growth, not a line-item saving.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.value}
                  className={cn(
                    CARD_SHELL,
                    "group p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_50px_rgb(0,0,0,0.08)]"
                  )}
                >
                  <stat.icon className="size-5 text-amber-600" />
                  <p className="mt-5 text-5xl font-semibold tracking-tighter text-slate-900 tabular-nums">
                    {stat.value}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-500">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mx-auto mt-10 flex max-w-3xl flex-col items-center justify-center gap-2 rounded-2xl bg-slate-900 px-8 py-6 text-center shadow-[0_16px_50px_rgb(15,23,42,0.35)] sm:flex-row sm:gap-4">
              <p className="font-mono text-sm text-slate-400">
                3–10 hrs/wk × $60/hr × 4.3 wks
              </p>
              <ArrowRight className="hidden size-4 text-slate-500 sm:block" />
              <p className="text-lg font-semibold tracking-tight text-white">
                $770 – $2,580 leaking per estimator, every month
              </p>
            </div>
          </div>
        </section>

        {/* ————— Video (glass) ————— */}
        <section id="demo" className="relative scroll-mt-24">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-10 left-1/2 h-100 w-175 -translate-x-1/2 rounded-full bg-amber-200/30 blur-[140px]"
          />
          <div className="relative mx-auto w-full max-w-5xl px-6 py-24">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <SectionEyebrow>Three minutes, start to finish</SectionEyebrow>
              <h2 className="text-4xl font-semibold tracking-tight text-balance text-slate-900 sm:text-5xl">
                Watch a real takeoff become a real import.
              </h2>
            </div>

            <div className="group relative">
              {/* Floating spec chips */}
              <div className="absolute -top-5 -left-3 z-10 hidden rotate-[-2deg] items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-[0_8px_24px_rgb(0,0,0,0.08)] backdrop-blur transition-transform duration-300 group-hover:-translate-y-1 md:flex">
                <Zap className="size-3.5 text-amber-600" />
                0.08s average conversion
              </div>
              <div className="absolute -right-3 -bottom-5 z-10 hidden rotate-[2deg] items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-[0_8px_24px_rgb(0,0,0,0.08)] backdrop-blur transition-transform duration-300 group-hover:translate-y-1 md:flex">
                <ShieldCheck className="size-3.5 text-emerald-600" />
                RAM only — zero retention
              </div>

              <div className="rounded-[2rem] bg-gradient-to-b from-amber-200/60 via-slate-200/60 to-transparent p-px shadow-[0_24px_80px_rgb(0,0,0,0.1)] transition-transform duration-300 group-hover:-translate-y-1">
                <div className="rounded-[calc(2rem-1px)] bg-white/60 p-3 backdrop-blur-xl">
                  <div className="relative flex aspect-video flex-col items-center justify-center gap-6 overflow-hidden rounded-[1.4rem] bg-gradient-to-b from-slate-50 to-white">
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-dot-grid opacity-60"
                    />
                    {/* Faux window chrome */}
                    <div className="absolute top-4 left-5 flex gap-1.5">
                      <span className="size-2.5 rounded-full bg-slate-200" />
                      <span className="size-2.5 rounded-full bg-slate-200" />
                      <span className="size-2.5 rounded-full bg-slate-200" />
                    </div>

                    <button
                      type="button"
                      aria-label="Play the 3-minute walkthrough"
                      className="relative flex size-20 cursor-pointer items-center justify-center rounded-full border border-white/60 bg-white/80 shadow-[0_16px_50px_rgb(217,119,6,0.25)] backdrop-blur transition-all duration-200 hover:scale-105 hover:shadow-[0_20px_60px_rgb(217,119,6,0.35)]"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 rounded-full bg-amber-400/20 blur-xl"
                      />
                      <Play className="relative size-8 translate-x-0.5 fill-amber-600 text-amber-600" />
                    </button>
                    <div className="relative text-center">
                      <p className="font-semibold text-slate-900">
                        Watch the 3-minute walkthrough
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        A real Bluebeam export becomes a CavSoft import — live,
                        unedited
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ————— Mechanism ————— */}
        <section
          id="how-it-works"
          className="relative scroll-mt-24 border-t border-slate-200/60 bg-slate-50/80"
        >
          <div className="mx-auto w-full max-w-6xl px-6 py-24">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <SectionEyebrow>The mechanism</SectionEyebrow>
              <h2 className="text-4xl font-semibold tracking-tight text-balance text-slate-900 sm:text-5xl">
                Drop the files. Import the workbook. Done.
              </h2>
            </div>

            <div className="relative grid gap-6 md:grid-cols-3">
              <div
                aria-hidden="true"
                className="absolute top-14 right-[16%] left-[16%] hidden h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent md:block"
              />
              {steps.map((step) => (
                <div
                  key={step.number}
                  className={cn(
                    CARD_SHELL,
                    "relative p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_50px_rgb(0,0,0,0.08)]"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex size-11 items-center justify-center rounded-xl border border-amber-200 bg-amber-50">
                      <step.icon className="size-5 text-amber-600" />
                    </span>
                    <span className="font-mono text-xs font-medium tracking-widest text-slate-400">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight text-slate-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ————— ZDR (dark band) ————— */}
        <section id="security" className="relative scroll-mt-24 overflow-hidden bg-slate-900">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-blueprint-grid opacity-[0.07] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-32 left-1/2 h-64 w-150 -translate-x-1/2 rounded-full bg-amber-500/10 blur-[100px]"
          />
          <div className="relative mx-auto w-full max-w-5xl px-6 py-24">
            <div className="mb-14 flex flex-col items-center gap-5 text-center">
              <span className="flex size-14 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 shadow-[0_0_60px_rgb(245,158,11,0.2)]">
                <ShieldCheck className="size-7 text-amber-500" />
              </span>
              <div>
                <p className="font-mono text-[11px] tracking-[0.35em] text-slate-400 uppercase">
                  TenderLabs security posture · TL-SEC-01
                </p>
                <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  Zero Data Retention.
                </h2>
                <p className="mt-3 text-lg font-medium text-amber-500">
                  Processed ephemerally in RAM. No pricing logs. Ever.
                </p>
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {zdrPoints.map((point) => (
                <div
                  key={point.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.07]"
                >
                  <point.icon className="size-5 text-amber-500" />
                  <p className="mt-4 font-semibold text-white">{point.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {point.body}
                  </p>
                </div>
              ))}
            </div>

            <p className="mx-auto mt-12 max-w-2xl border-t border-white/10 pt-6 text-center text-sm text-slate-400">
              Your rates are your edge. We designed TenderLabs so that we{" "}
              <span className="font-medium text-white">couldn&apos;t</span> leak
              them if we tried — only run metadata (project name, mode, row
              counts) is ever recorded.
            </p>
          </div>
        </section>

        {/* ————— Pricing ————— */}
        <section id="pricing" className="relative scroll-mt-24">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 left-1/2 h-100 w-175 -translate-x-1/2 rounded-full bg-amber-200/30 blur-[140px]"
          />
          <div className="relative mx-auto w-full max-w-6xl px-6 py-24">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <SectionEyebrow>Pricing</SectionEyebrow>
              <h2 className="text-4xl font-semibold tracking-tight text-balance text-slate-900 sm:text-5xl">
                Pays for itself before Friday.
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                At a $60/hr burdened rate, ten recovered hours is ≈ $2,400 per
                estimator, per month. Every plan below costs less than the
                problem it removes.
              </p>
            </div>

            <div className="grid items-stretch gap-6 lg:grid-cols-3">
              {tiers.map((tier) =>
                tier.highlighted ? (
                  /* Bureau — the hero card */
                  <div
                    key={tier.name}
                    className="relative flex flex-col rounded-3xl bg-slate-900 p-8 shadow-[0_32px_80px_rgb(15,23,42,0.4)] ring-1 ring-slate-900 transition-transform duration-300 hover:-translate-y-1 lg:-my-4 lg:p-9"
                  >
                    <span className="absolute -top-3.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-slate-900 shadow-[0_4px_16px_rgb(245,158,11,0.4)]">
                      <Sparkles className="size-3" />
                      Most popular
                    </span>
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-lg font-semibold text-white">
                        {tier.name}
                      </h3>
                    </div>
                    <p className="mt-1 text-sm text-slate-400">
                      {tier.description}
                    </p>
                    <p className="mt-6">
                      <span className="text-5xl font-semibold tracking-tighter text-white tabular-nums">
                        {tier.price}
                      </span>
                      <span className="text-slate-400">{tier.cadence}</span>
                    </p>
                    <p className="mt-2 text-xs font-medium text-amber-400">
                      {tier.roiLine}
                    </p>
                    <ul className="mt-7 flex flex-col gap-3">
                      {tier.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-2.5 text-sm text-slate-200"
                        >
                          <Check className="size-4 shrink-0 text-amber-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-7 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4">
                      <p className="flex items-center gap-1.5 text-sm font-semibold text-amber-400">
                        <Sparkles className="size-3.5" />+ $5,000 one-time
                        bespoke onboarding
                      </p>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                        You send us your database. We manually map your CavSoft
                        systems and architect a custom Bluebeam Revu toolset.
                        You convert seamlessly on Day 1 without ever altering
                        your takeoff process.
                      </p>
                    </div>
                    <Link
                      href="/signup"
                      className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-amber-500 text-[15px] font-semibold text-slate-900 shadow-[0_8px_30px_rgb(245,158,11,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-400"
                    >
                      Start with Bureau
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>
                ) : (
                  <div
                    key={tier.name}
                    className={cn(
                      CARD_SHELL,
                      "flex flex-col p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_50px_rgb(0,0,0,0.08)]"
                    )}
                  >
                    <h3 className="text-lg font-semibold text-slate-900">
                      {tier.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {tier.description}
                    </p>
                    <p className="mt-6">
                      <span className="text-5xl font-semibold tracking-tighter text-slate-900 tabular-nums">
                        {tier.price}
                      </span>
                      <span className="text-slate-400">{tier.cadence}</span>
                    </p>
                    <p className="mt-2 text-xs font-medium text-slate-500">
                      {tier.roiLine}
                    </p>
                    <ul className="mt-7 flex flex-1 flex-col gap-3">
                      {tier.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-2.5 text-sm text-slate-600"
                        >
                          <Check className="size-4 shrink-0 text-amber-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/signup"
                      className="mt-8 inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-[15px] font-semibold text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-900"
                    >
                      Get started
                    </Link>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* ————— Final CTA ————— */}
        <section className="relative overflow-hidden border-t border-slate-200/60 bg-slate-50/80">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-blueprint-grid opacity-60 [mask-image:radial-gradient(ellipse_60%_90%_at_50%_100%,black,transparent)]"
          />
          <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center gap-8 px-6 py-28 text-center">
            <h2 className="text-4xl font-semibold tracking-tight text-balance text-slate-900 sm:text-5xl">
              Your next tender is waiting.{" "}
              <span className="bg-gradient-to-br from-amber-500 to-amber-700 bg-clip-text text-transparent">
                Your estimators shouldn&apos;t be typing.
              </span>
            </h2>
            <CtaLink href="/signup">
              Start converting today
              <ArrowRight className="size-4" />
            </CtaLink>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200/60 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-slate-500 sm:flex-row">
          <Logo
            className="opacity-90"
            markClassName="size-4.5"
            textClassName="text-sm"
          />
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-amber-600" />
            Uploads live in memory only — never on disk.
          </span>
          <span>© {new Date().getFullYear()} TenderLabs</span>
        </div>
      </footer>
    </div>
  );
}
