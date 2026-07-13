import { redirect } from "next/navigation";
import {
  FileStack,
  Gauge,
  Rows3,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";

import { signOut } from "./actions";
import { ConversionPanel } from "./conversion-panel";

// Dummy initial state. Real numbers arrive with the metadata/history
// milestone — these are throughput KPIs only, never content-derived.
const KPIS: {
  label: string;
  value: string;
  foot: string;
  icon: LucideIcon;
  secure?: boolean;
}[] = [
  {
    label: "Tenders Processed (MTD)",
    value: "24",
    foot: "July to date",
    icon: FileStack,
  },
  {
    label: "Data Lines Extracted",
    value: "86,412",
    foot: "rows nobody had to retype",
    icon: Rows3,
  },
  {
    label: "Avg. Execution Speed",
    value: "0.08s",
    foot: "per conversion, in-RAM",
    icon: Gauge,
  },
  {
    label: "ZDR Security Wipes",
    value: "132",
    foot: "memory flushed after every run",
    icon: ShieldCheck,
    secure: true,
  },
];

// TODO: Replace this static dummy data with the real audit trail before
// launch. The engine's BackgroundTask will insert metadata rows into
// Supabase, and this server component fetches them in place of the constant:
//   const { data: recent } = await supabase
//     .from("audit_logs")
//     .select("tender, mode, rows, created_at")
//     .order("created_at", { ascending: false })
//     .limit(7);
// Metadata columns only — file contents never reach the database.
const RECENT_CONVERSIONS = [
  { tender: "500 Bourke St — Tower A", mode: "Level-by-Level", rows: 12480 },
  { tender: "Westfield Doncaster L3", mode: "Lump Sum", rows: 3214 },
  { tender: "101 Collins Riser Upgrade", mode: "Level-by-Level", rows: 8926 },
  { tender: "Monash Clayton LTB", mode: "Level-by-Level", rows: 15060 },
  { tender: "Crown Basement Chillers", mode: "Lump Sum", rows: 1873 },
  { tender: "RCH East Wing", mode: "Level-by-Level", rows: 6541 },
  { tender: "Barangaroo C2 Ambient Loop", mode: "Lump Sum", rows: 4102 },
];

const PANEL_SHELL =
  "rounded-3xl border border-slate-200/60 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]";

export default async function DashboardPage() {
  const supabase = await createClient();

  // getClaims verifies the JWT locally; do not rely on the proxy alone.
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (!claims) {
    redirect("/login");
  }

  const email = typeof claims.email === "string" ? claims.email : null;

  return (
    <div className="relative flex min-h-svh flex-1 flex-col overflow-x-clip bg-[#F8FAFC]">
      {/* Ambient depth: masked dot grid + faint amber wash behind the fold */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-150 bg-dot-grid opacity-60 [mask-image:radial-gradient(ellipse_70%_100%_at_50%_0%,black,transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-200 -translate-x-1/2 rounded-full bg-amber-200/25 blur-[140px]"
      />

      <header className="sticky top-0 z-10 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-3 lg:px-8">
          <div className="flex items-center gap-3.5">
            <Logo />
            <span
              className="hidden h-4 w-px bg-slate-200 sm:block"
              aria-hidden="true"
            />
            <span className="hidden font-mono text-[11px] font-medium tracking-[0.22em] text-slate-400 uppercase sm:block">
              Command Center
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50/70 px-2.5 py-1 font-mono text-[10px] font-medium tracking-[0.14em] text-emerald-700 uppercase sm:inline-flex">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
              </span>
              ZDR Active
            </span>
            {email && (
              <span className="hidden text-sm text-slate-400 md:block">
                {email}
              </span>
            )}
            <form action={signOut}>
              <Button
                type="submit"
                variant="outline"
                size="sm"
                className="rounded-full border-slate-200 px-3.5 text-slate-600 hover:border-slate-300 hover:text-slate-900"
              >
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col gap-9 px-6 pt-12 pb-20 lg:px-8">
        <div className="flex flex-col gap-2">
          <p className="font-mono text-[11px] font-medium tracking-[0.25em] text-amber-600 uppercase">
            Tender operations · metadata only
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Command Center
          </h1>
          <p className="text-sm text-slate-500">
            Bluebeam → CavSoft conversions, processed entirely in memory.
          </p>
        </div>

        {/* Telemetry strip: one panel, four cells, hairline dividers */}
        <section aria-label="Throughput metrics" className={PANEL_SHELL}>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
            {KPIS.map((kpi) => (
              <div
                key={kpi.label}
                className={cn(
                  "border-b border-slate-100 p-7 last:border-b-0",
                  "sm:odd:border-r sm:[&:nth-last-child(-n+2)]:border-b-0",
                  "xl:border-b-0 xl:[&:not(:last-child)]:border-r"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] font-medium tracking-[0.14em] text-slate-400 uppercase">
                    {kpi.label}
                  </span>
                  <kpi.icon
                    className="size-3.5 shrink-0 text-slate-300"
                    aria-hidden="true"
                  />
                </div>
                <p className="mt-5 text-4xl font-semibold tracking-tighter text-slate-900 tabular-nums">
                  {kpi.value}
                </p>
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-400">
                  {kpi.secure && (
                    <span
                      className="size-1.5 rounded-full bg-emerald-500"
                      aria-hidden="true"
                    />
                  )}
                  {kpi.foot}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          aria-label="Conversions"
          className="grid items-start gap-6 lg:grid-cols-5"
        >
          <div className="lg:col-span-2">
            <ConversionPanel />
          </div>

          <div className={cn(PANEL_SHELL, "overflow-hidden lg:col-span-3")}>
            <div className="flex items-start justify-between gap-4 px-8 pt-7 pb-5">
              <div>
                <h2 className="text-[15px] font-semibold tracking-tight text-slate-900">
                  Recent conversions
                </h2>
                <p className="mt-1 text-[13px] text-slate-400">
                  Every run, wiped from memory the moment it streams back.
                </p>
              </div>
              <span className="mt-0.5 shrink-0 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-[10px] font-medium tracking-[0.14em] text-slate-400 uppercase">
                Last 7 runs
              </span>
            </div>
            <div className="border-t border-slate-100 px-8 py-2">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-100 hover:bg-transparent">
                    <TableHead className="h-11 text-[11px] font-medium tracking-[0.12em] text-slate-400 uppercase">
                      Tender
                    </TableHead>
                    <TableHead className="h-11 text-[11px] font-medium tracking-[0.12em] text-slate-400 uppercase">
                      Mode
                    </TableHead>
                    <TableHead className="h-11 text-right text-[11px] font-medium tracking-[0.12em] text-slate-400 uppercase">
                      Rows
                    </TableHead>
                    <TableHead className="h-11 text-right text-[11px] font-medium tracking-[0.12em] text-slate-400 uppercase">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {RECENT_CONVERSIONS.map((row) => (
                    <TableRow
                      key={row.tender}
                      className="border-slate-100 transition-colors hover:bg-slate-50/60"
                    >
                      <TableCell className="max-w-56 truncate py-3.5 text-sm font-medium text-slate-800">
                        {row.tender}
                      </TableCell>
                      <TableCell className="py-3.5">
                        <span className="inline-flex items-center rounded-md bg-slate-100/80 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                          {row.mode}
                        </span>
                      </TableCell>
                      <TableCell className="py-3.5 text-right font-mono text-[13px] text-slate-600 tabular-nums">
                        {row.rows.toLocaleString("en-AU")}
                      </TableCell>
                      <TableCell className="py-3.5 text-right">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700">
                          <ShieldCheck className="size-3" aria-hidden="true" />
                          RAM Purged
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 px-8 py-3.5">
              <span className="font-mono text-[10px] tracking-[0.22em] text-slate-300 uppercase">
                TL-SEC-01
              </span>
              <span className="text-[11px] text-slate-400">
                Metadata only — file contents never persist.
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
