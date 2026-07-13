import { redirect } from "next/navigation";
import {
  FileStack,
  Gauge,
  Rows3,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import { Logo } from "@/components/logo";
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
    <div className="flex min-h-svh flex-1 flex-col bg-background">
      <header className="sticky top-0 z-10 border-b border-border/70 bg-background/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-3 lg:px-8">
          <div className="flex items-center gap-3">
            <Logo />
            <span
              className="hidden h-4 w-px bg-border sm:block"
              aria-hidden="true"
            />
            <span className="hidden text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase sm:block">
              Command Center
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {email && (
              <span className="hidden text-sm text-muted-foreground md:block">
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

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-6 py-8 lg:px-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Command Center
          </h1>
          <p className="text-sm text-muted-foreground">
            Bluebeam → CAVsoft conversions, processed entirely in memory.
          </p>
        </div>

        <section
          aria-label="Throughput metrics"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {KPIS.map((kpi) => (
            <Card
              key={kpi.label}
              className="gap-3 rounded-2xl shadow-sm ring-foreground/5"
            >
              <CardHeader className="flex-row items-center justify-between">
                <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  {kpi.label}
                </span>
                <kpi.icon
                  className="size-4 shrink-0 text-muted-foreground/70"
                  aria-hidden="true"
                />
              </CardHeader>
              <CardContent className="flex flex-col gap-1">
                <span className="text-4xl font-light tracking-tight text-foreground tabular-nums">
                  {kpi.value}
                </span>
                <span className="text-xs text-muted-foreground">
                  {kpi.foot}
                </span>
              </CardContent>
            </Card>
          ))}
        </section>

        <section
          aria-label="Conversions"
          className="grid items-start gap-6 lg:grid-cols-5"
        >
          <div className="lg:col-span-2">
            <ConversionPanel />
          </div>

          <Card className="rounded-2xl shadow-sm ring-foreground/5 lg:col-span-3">
            <CardHeader className="border-b border-border/60">
              <CardTitle>Recent conversions</CardTitle>
              <CardDescription>
                Audit trail — metadata only. File contents never persist.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border/60 hover:bg-transparent">
                    <TableHead className="text-xs font-medium text-muted-foreground">
                      Tender
                    </TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">
                      Mode
                    </TableHead>
                    <TableHead className="text-right text-xs font-medium text-muted-foreground">
                      Rows
                    </TableHead>
                    <TableHead className="text-right text-xs font-medium text-muted-foreground">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {RECENT_CONVERSIONS.map((row) => (
                    <TableRow key={row.tender} className="border-border/40">
                      <TableCell className="max-w-56 truncate py-3 font-medium">
                        {row.tender}
                      </TableCell>
                      <TableCell className="py-3">
                        <Badge
                          variant="outline"
                          className="rounded-full border-border/70 px-2.5 font-medium text-muted-foreground"
                        >
                          {row.mode}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3 text-right tabular-nums">
                        {row.rows.toLocaleString("en-AU")}
                      </TableCell>
                      <TableCell className="py-3 text-right">
                        <Badge className="h-auto rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success">
                          <ShieldCheck aria-hidden="true" />
                          RAM Purged
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
