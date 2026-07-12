import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";

import { signOut } from "./actions";
import { ConversionPanel } from "./conversion-panel";

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
    <div className="flex flex-1 flex-col gap-6 px-6 py-8">
      <header className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <span className="h-5 w-1.5 bg-primary" aria-hidden="true" />
          <span className="font-heading text-sm font-semibold tracking-[0.25em] uppercase">
            TenderLabs
          </span>
        </div>
        <div className="flex items-center gap-4">
          {email && (
            <span className="text-sm text-muted-foreground">{email}</span>
          )}
          <form action={signOut}>
            <Button type="submit" variant="outline" size="sm">
              Sign out
            </Button>
          </form>
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center py-8">
        <ConversionPanel />
      </main>
    </div>
  );
}
