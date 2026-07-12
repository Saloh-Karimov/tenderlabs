import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  CircleDollarSign,
  Clock,
  Cpu,
  Database,
  FileCheck,
  Layers,
  Lock,
  Play,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const stats = [
  {
    icon: CircleDollarSign,
    value: "$60/hr",
    label: "The burdened rate you're paying senior estimators to retype numbers.",
  },
  {
    icon: Clock,
    value: "3–10 hrs",
    label: "Lost per estimator, every single week, to Bluebeam → CAVsoft re-entry.",
  },
  {
    icon: TrendingUp,
    value: "+10 hrs",
    label: "Back per week means more tenders priced, submitted — and won.",
  },
];

const steps = [
  {
    number: "01",
    icon: FileCheck,
    title: "Drag & drop the CSV",
    body: "Export your takeoff from Bluebeam Revu exactly the way you already do. Drop it on TenderLabs. That's the whole workflow change.",
  },
  {
    number: "02",
    icon: Layers,
    title: "We map it Level-by-Level",
    body: "Quantities, levels, and line items are mapped automatically — Level-by-Level or Lump Sum. Transposition errors are eliminated, not proofread.",
  },
  {
    number: "03",
    icon: ArrowRight,
    title: "Import straight into CAVsoft",
    body: "Seconds later you're holding an import-ready CAVsoft workbook. Open, import, price. No retyping. No cleanup pass.",
  },
];

const tiers = [
  {
    name: "Estimator",
    price: "$499",
    description: "One estimator. Every tender, converted.",
    features: [
      "1 seat",
      "25 conversions / month",
      "Level-by-Level & Lump Sum modes",
      "Zero transposition errors",
      "Email support",
    ],
    highlighted: false,
  },
  {
    name: "Bureau",
    price: "$999",
    description: "For estimating teams pricing work every week.",
    features: [
      "5 seats",
      "Unlimited conversions",
      "Level-by-Level & Lump Sum modes",
      "Zero transposition errors",
      "Priority support",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "$1499",
    description: "Standardise takeoff-to-CAVsoft across every office.",
    features: [
      "Unlimited seats",
      "Unlimited conversions",
      "Onboarding & template setup",
      "Zero transposition errors",
      "Same-day support SLA",
    ],
    highlighted: false,
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
    body: "Quantities, item codes, and pricing are never logged — not even inside error messages.",
  },
];

function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <span className="h-5 w-1.5 bg-primary shadow-[0_0_12px] shadow-primary/60" aria-hidden="true" />
      <span className="font-heading text-sm font-semibold tracking-[0.25em] uppercase">
        TenderLabs
      </span>
    </span>
  );
}

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col overflow-x-clip">
      {/* Glass navbar */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3.5">
          <Wordmark />
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#how-it-works" className="transition-colors hover:text-foreground">
              How it works
            </a>
            <a href="#security" className="transition-colors hover:text-foreground">
              Security
            </a>
            <a href="#pricing" className="transition-colors hover:text-foreground">
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              nativeButton={false}
              render={<Link href="/login" />}
            >
              Sign in
            </Button>
            <Button
              nativeButton={false}
              render={<Link href="/signup" />}
              className="shadow-md shadow-primary/25"
            >
              Get started
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="relative">
          {/* Depth: blueprint grid + radial glow, all token-derived */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-blueprint-grid [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-40 left-1/2 h-130 w-200 -translate-x-1/2 rounded-full bg-primary/12 blur-[140px]"
          />
          <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center gap-7 px-6 pt-24 pb-20 text-center">
            <Badge
              variant="outline"
              className="gap-1.5 border-primary/30 bg-primary/5 px-3 py-2 text-xs"
            >
              <BadgeCheck className="text-primary" />
              Purpose-built for Bluebeam Revu → CAVsoft estimating teams
            </Badge>
            <h1 className="font-heading text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
              Keep measuring in Bluebeam.{" "}
              <span className="bg-gradient-to-br from-primary via-primary to-primary/50 bg-clip-text text-transparent">
                Stop retyping into CAVsoft.
              </span>
            </h1>
            <p className="max-w-2xl text-lg text-balance text-muted-foreground">
              Your estimators bill out at a{" "}
              <span className="font-medium text-foreground">$60/hr burdened rate</span> —
              and they&apos;re burning{" "}
              <span className="font-medium text-foreground">3–10 hours a week</span>{" "}
              working as data-entry clerks between Bluebeam and CAVsoft. TenderLabs
              turns the CSV they already export into an import-ready CAVsoft
              workbook in seconds. Flawlessly. Every time.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <Button
                size="lg"
                nativeButton={false}
                render={<Link href="/signup" />}
                className="shadow-lg shadow-primary/30"
              >
                Reclaim your estimators&apos; hours
                <ArrowRight data-icon="inline-end" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                nativeButton={false}
                render={<Link href="#pricing" />}
              >
                See pricing
              </Button>
            </div>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="size-3.5 text-primary" />
              Zero data retention — takeoffs are processed in memory and never stored.
            </p>
          </div>
        </section>

        {/* Pain / ROI stats */}
        <section className="relative border-y border-border/60 bg-secondary/20">
          <div className="mx-auto w-full max-w-6xl px-6 py-16">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="mb-3 font-mono text-xs tracking-[0.3em] text-primary uppercase">
                The silent five-figure leak
              </p>
              <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance">
                Stop paying senior talent to be data clerks.
              </h2>
              <p className="mt-3 text-muted-foreground">
                The hours aren&apos;t the real cost. The real cost is every tender you
                didn&apos;t have time to price. More hours back means more submissions;
                more submissions means more wins — that&apos;s top-line growth, not a
                line-item saving.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.value}
                  className="rounded-xl bg-gradient-to-b from-border to-transparent p-px"
                >
                  <div className="flex h-full flex-col gap-3 rounded-[calc(var(--radius-xl)-1px)] bg-card/80 p-6 backdrop-blur-sm">
                    <stat.icon className="size-5 text-primary" />
                    <p className="font-heading text-3xl font-semibold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mechanism */}
        <section id="how-it-works" className="relative scroll-mt-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/3 -right-40 h-100 w-100 rounded-full bg-primary/8 blur-[120px]"
          />
          <div className="relative mx-auto w-full max-w-6xl px-6 py-20">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="mb-3 font-mono text-xs tracking-[0.3em] text-primary uppercase">
                The mechanism
              </p>
              <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance">
                Drop a CSV. Get a CAVsoft workbook. Done.
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {steps.map((step) => (
                <Card key={step.number} className="relative bg-card/60">
                  <CardHeader>
                    <span className="mb-2 font-mono text-xs tracking-widest text-primary">
                      {step.number}
                    </span>
                    <span className="mb-1 flex size-10 items-center justify-center rounded-lg border border-primary/25 bg-primary/10">
                      <step.icon className="size-5 text-primary" />
                    </span>
                    <CardTitle className="text-base">{step.title}</CardTitle>
                    <CardDescription>{step.body}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Zero Data Retention trust-mark */}
        <section id="security" className="scroll-mt-16">
          <div className="mx-auto w-full max-w-4xl px-6 pb-20">
            <div className="rounded-2xl bg-gradient-to-b from-primary/40 via-border to-transparent p-px shadow-2xl shadow-primary/10">
              <div className="rounded-[calc(var(--radius-2xl)-1px)] bg-card/95 px-8 py-10 backdrop-blur-sm">
                <div className="mb-8 flex flex-col items-center gap-4 text-center">
                  <span className="flex size-14 items-center justify-center rounded-full border border-primary/30 bg-primary/10 shadow-[0_0_40px] shadow-primary/25">
                    <ShieldCheck className="size-7 text-primary" />
                  </span>
                  <div>
                    <p className="font-mono text-[11px] tracking-[0.35em] text-muted-foreground uppercase">
                      TenderLabs security posture · TL-SEC-01
                    </p>
                    <h2 className="mt-2 font-heading text-2xl font-semibold tracking-[0.15em] uppercase">
                      Zero Data Retention
                    </h2>
                    <p className="mt-1 text-sm font-medium text-primary">
                      Data Processed Ephemerally in RAM. No Pricing Logs Saved.
                    </p>
                  </div>
                </div>
                <div className="grid gap-6 md:grid-cols-3">
                  {zdrPoints.map((point) => (
                    <div key={point.title} className="flex flex-col gap-2">
                      <point.icon className="size-4.5 text-primary" />
                      <p className="text-sm font-medium">{point.title}</p>
                      <p className="text-sm text-muted-foreground">{point.body}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-8 border-t border-border/60 pt-4 text-center text-xs text-muted-foreground">
                  Your rates are your edge. We designed TenderLabs so that we{" "}
                  <span className="text-foreground">couldn&apos;t</span> leak them if we
                  tried — only run metadata (project name, mode, row counts) is ever
                  recorded.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pitch video placeholder */}
        <section className="mx-auto w-full max-w-4xl px-6 pb-20">
          <div className="rounded-2xl bg-gradient-to-b from-border to-transparent p-px">
            <div className="flex aspect-video flex-col items-center justify-center gap-5 rounded-[calc(var(--radius-2xl)-1px)] bg-gradient-to-b from-secondary/60 to-card">
              <button
                type="button"
                aria-label="Play the 3-minute pitch video"
                className="group flex size-18 cursor-pointer items-center justify-center rounded-full border border-primary/40 bg-primary/10 shadow-[0_0_60px] shadow-primary/30 transition-transform hover:scale-105"
              >
                <Play className="size-8 translate-x-0.5 text-primary transition-transform group-hover:scale-110" />
              </button>
              <div className="text-center">
                <p className="font-medium">Watch the 3-minute pitch</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Loom walkthrough — a real Bluebeam export becomes a CAVsoft import,
                  live
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="relative scroll-mt-16 border-t border-border/60 bg-secondary/20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 left-1/2 h-100 w-175 -translate-x-1/2 rounded-full bg-primary/10 blur-[130px]"
          />
          <div className="relative mx-auto w-full max-w-6xl px-6 py-20">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="mb-3 font-mono text-xs tracking-[0.3em] text-primary uppercase">
                Pricing
              </p>
              <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance">
                Pays for itself before Friday.
              </h2>
              <p className="mt-3 text-muted-foreground">
                At a $60/hr burdened rate, 10 recovered hours is ≈ $2,400 per
                estimator, per month. Every plan below costs less than the problem.
              </p>
            </div>
            <div className="grid items-stretch gap-6 md:grid-cols-3">
              {tiers.map((tier) => (
                <Card
                  key={tier.name}
                  className={cn(
                    "bg-card/70 backdrop-blur-sm",
                    tier.highlighted &&
                      "relative bg-card ring-2 ring-primary shadow-2xl shadow-primary/20 md:-my-3"
                  )}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {tier.name}
                      {tier.highlighted && (
                        <Badge className="shadow-sm shadow-primary/40">
                          Most popular
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>{tier.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col gap-6">
                    <p>
                      <span className="font-heading text-4xl font-semibold">
                        {tier.price}
                      </span>
                      <span className="text-muted-foreground">/m</span>
                    </p>
                    <ul className="flex flex-col gap-2.5">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm">
                          <Check className="size-4 shrink-0 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={cn(
                        "mt-auto w-full",
                        tier.highlighted && "shadow-md shadow-primary/30"
                      )}
                      variant={tier.highlighted ? "default" : "outline"}
                      nativeButton={false}
                      render={<Link href="/signup" />}
                    >
                      Get started
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative overflow-hidden border-t border-border/60">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-blueprint-grid [mask-image:radial-gradient(ellipse_60%_80%_at_50%_100%,black,transparent)]"
          />
          <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-6 py-20 text-center">
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance">
              Your next tender is waiting.{" "}
              <span className="text-primary">Your estimators shouldn&apos;t be typing.</span>
            </h2>
            <Button
              size="lg"
              nativeButton={false}
              render={<Link href="/signup" />}
              className="shadow-lg shadow-primary/30"
            >
              Start converting today
              <ArrowRight data-icon="inline-end" />
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 bg-background/60">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5 text-xs text-muted-foreground">
          <Wordmark className="opacity-80 [&>span:last-child]:text-[11px]" />
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-primary" />
            Uploads live in memory only — never on disk.
          </span>
          <span>© {new Date().getFullYear()} TenderLabs</span>
        </div>
      </footer>
    </div>
  );
}
