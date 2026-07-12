import Link from "next/link";
import { ArrowRight, Check, Play, ShieldCheck, Timer, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const tiers = [
  {
    name: "Estimator",
    price: "$499",
    description: "For a single estimator converting takeoffs every tender.",
    features: [
      "1 seat",
      "25 conversions / month",
      "Level-by-Level & Lump Sum modes",
      "Email support",
    ],
    highlighted: false,
  },
  {
    name: "Bureau",
    price: "$999",
    description: "For estimating teams running tenders every week.",
    features: [
      "5 seats",
      "Unlimited conversions",
      "Level-by-Level & Lump Sum modes",
      "Priority support",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "$1499",
    description: "For firms standardising takeoff-to-CAVsoft across offices.",
    features: [
      "Unlimited seats",
      "Unlimited conversions",
      "Onboarding & template setup",
      "Same-day support SLA",
    ],
    highlighted: false,
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="h-5 w-1.5 bg-primary" aria-hidden="true" />
          <span className="font-heading text-sm font-semibold tracking-[0.25em] uppercase">
            TenderLabs
          </span>
        </div>
        <nav className="flex items-center gap-2">
          <Button variant="ghost" render={<Link href="/login" />}>
            Sign in
          </Button>
          <Button render={<Link href="/signup" />}>Get started</Button>
        </nav>
      </header>

      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 px-6 py-20 text-center">
          <Badge variant="outline" className="gap-1.5 px-3 py-2 text-xs">
            <Zap className="text-primary" />
            Bluebeam Revu → CAVsoft, automated
          </Badge>
          <h1 className="font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Keep measuring in Bluebeam.{" "}
            <span className="text-primary">Stop retyping into CAVsoft.</span>
          </h1>
          <p className="max-w-2xl text-lg text-balance text-muted-foreground">
            TenderLabs turns your Bluebeam takeoff exports into
            CAVsoft-importable workbooks in seconds — automated takeoff
            integration that hands your estimators back hours on every tender.
          </p>
          <div className="flex items-center gap-3">
            <Button size="lg" render={<Link href="/signup" />}>
              Start converting
              <ArrowRight data-icon="inline-end" />
            </Button>
            <Button size="lg" variant="outline" render={<Link href="/login" />}>
              Sign in
            </Button>
          </div>
          {/* Zero Data Retention badge */}
          <div className="mt-4 flex items-center gap-3 rounded-lg border border-primary/40 bg-primary/10 px-4 py-3">
            <ShieldCheck className="size-5 shrink-0 text-primary" />
            <div className="text-left">
              <p className="text-sm font-semibold tracking-widest text-primary uppercase">
                Zero Data Retention
              </p>
              <p className="text-sm text-muted-foreground">
                Data Processed Ephemerally in RAM. No Pricing Logs Saved.
              </p>
            </div>
          </div>
        </section>

        {/* Pitch video placeholder */}
        <section className="mx-auto w-full max-w-4xl px-6 pb-20">
          <Card className="overflow-hidden p-0">
            <div className="flex aspect-video flex-col items-center justify-center gap-4 bg-secondary/50">
              <span className="flex size-16 items-center justify-center rounded-full border border-primary/40 bg-primary/10">
                <Play className="size-7 translate-x-0.5 text-primary" />
              </span>
              <div className="text-center">
                <p className="font-medium">Watch the 3-minute pitch</p>
                <p className="text-sm text-muted-foreground">
                  <Timer className="mr-1 inline size-3.5 align-[-2px]" />
                  Loom walkthrough — from Bluebeam CSV to CAVsoft import
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* Pricing */}
        <section className="mx-auto w-full max-w-5xl px-6 pb-24">
          <div className="mb-10 text-center">
            <h2 className="font-heading text-3xl font-semibold tracking-tight">
              Simple pricing
            </h2>
            <p className="mt-2 text-muted-foreground">
              Every plan converts with zero data retention.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {tiers.map((tier) => (
              <Card
                key={tier.name}
                className={
                  tier.highlighted ? "ring-2 ring-primary" : undefined
                }
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {tier.name}
                    {tier.highlighted && <Badge>Most popular</Badge>}
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
                  <ul className="flex flex-col gap-2">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="size-4 shrink-0 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="mt-auto w-full"
                    variant={tier.highlighted ? "default" : "outline"}
                    render={<Link href="/signup" />}
                  >
                    Get started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="flex items-center justify-between border-t border-border px-6 py-4 text-xs text-muted-foreground">
        <span>© {new Date().getFullYear()} TenderLabs</span>
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="size-3.5 text-primary" />
          Uploads live in memory only — never on disk.
        </span>
      </footer>
    </div>
  );
}
