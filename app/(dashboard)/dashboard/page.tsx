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

const CARD_SHELL =
  "bg-white rounded-3xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]";

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
    <div className="flex min-h-svh flex-1 flex-col bg-[#F8FAFC]">
      <header className="sticky top-0 z-10 border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-3 lg:px-8">
          <div className="flex items-center gap-3">
            <Logo />
            <span
              className="hidden h-4 w-px bg-slate-200 sm:block"
              aria-hidden="true"
            />
            <span className="hidden text-xs font-medium tracking-[0.18em] text-slate-500 uppercase sm:block">
              Command Center
            </span>
          </div>
          <div className="flex items-center gap-3">
            {email && (
              <span className="hidden text-sm font-medium text-slate-500 md:block">
                {email}
              </span>
            )}
            <form action={signOut}>
              <Button type="submit" variant="outline" size="sm">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-10 px-6 pt-16 pb-16 lg:px-8">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Command Center
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Bluebeam → CAVsoft conversions, processed entirely in memory.
          </p>
        </div>

        <section
          aria-label="Throughput metrics"
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
        >
          {KPIS.map((kpi) => (
            <div key={kpi.label} className={`${CARD_SHELL} p-6`}>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                  {kpi.label}
                </span>
                <kpi.icon
                  className="size-4 shrink-0 text-slate-400"
                  aria-hidden="true"
                />
              </div>
              <div className="mt-4 flex flex-col gap-1">
                <span className="text-4xl font-semibold tracking-tighter text-slate-900 tabular-nums">
                  {kpi.value}
                </span>
                <span className="text-xs text-slate-400">{kpi.foot}</span>
              </div>
            </div>
          ))}
        </section>

        <section
          aria-label="Conversions"
          className="grid items-start gap-6 lg:grid-cols-5"
        >
          <div className="lg:col-span-2">
            <ConversionPanel />
          </div>

          <div className={`${CARD_SHELL} overflow-hidden lg:col-span-3`}>
            <div className="border-b border-slate-100 px-8 py-6">
              <h2 className="text-base font-semibold text-slate-900">
                Recent conversions
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Audit trail — metadata only. File contents never persist.
              </p>
            </div>
            <div className="px-8 py-4">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-100 hover:bg-transparent">
                    <TableHead className="text-xs font-medium text-slate-500">
                      Tender
                    </TableHead>
                    <TableHead className="text-xs font-medium text-slate-500">
                      Mode
                    </TableHead>
                    <TableHead className="text-right text-xs font-medium text-slate-500">
                      Rows
                    </TableHead>
                    <TableHead className="text-right text-xs font-medium text-slate-500">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {RECENT_CONVERSIONS.map((row) => (
                    <TableRow
                      key={row.tender}
                      className="border-slate-100 hover:bg-slate-50/60"
                    >
                      <TableCell className="max-w-56 truncate py-3.5 font-medium text-slate-800">
                        {row.tender}
                      </TableCell>
                      <TableCell className="py-3.5">
                        <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-medium text-slate-600">
                          {row.mode}
                        </span>
                      </TableCell>
                      <TableCell className="py-3.5 text-right text-slate-600 tabular-nums">
                        {row.rows.toLocaleString("en-AU")}
                      </TableCell>
                      <TableCell className="py-3.5 text-right">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                          <ShieldCheck className="size-3" aria-hidden="true" />
                          RAM Purged
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
