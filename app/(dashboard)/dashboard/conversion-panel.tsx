"use client";

import * as React from "react";
import {
  CircleCheck,
  CircleAlert,
  CloudUpload,
  FileSpreadsheet,
  FileUp,
  LoaderCircle,
  X,
} from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";

type Mode = "level-by-level" | "lump-sum";

const ENGINE_URL =
  process.env.NEXT_PUBLIC_ENGINE_URL ?? "http://localhost:8000";
const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

const conversionSchema = z.object({
  tenderName: z
    .string()
    .trim()
    .min(1, "Enter a tender name.")
    .max(120, "Tender name must be 120 characters or fewer."),
  file: z
    .instanceof(File, { message: "Drop a Bluebeam CSV export first." })
    .refine((f) => f.size > 0, "That file is empty.")
    .refine((f) => f.size <= MAX_UPLOAD_BYTES, "CSV must be 25 MB or smaller."),
});

type Status =
  | { kind: "idle" }
  | { kind: "busy" }
  | { kind: "done"; message: string }
  | { kind: "error"; message: string };

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function errorMessage(res: Response): Promise<string> {
  if (res.status === 401) return "Session expired — sign in again.";
  if (res.status === 413) return "CSV must be 25 MB or smaller.";
  if (res.status === 422) {
    const detail = await res
      .json()
      .then((body) => (typeof body?.detail === "string" ? body.detail : null))
      .catch(() => null);
    return detail ?? "The CSV could not be parsed.";
  }
  return "Conversion failed. Try again.";
}

export function ConversionPanel() {
  const [mode, setMode] = React.useState<Mode>("level-by-level");
  const [tenderName, setTenderName] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const [dragActive, setDragActive] = React.useState(false);
  const [status, setStatus] = React.useState<Status>({ kind: "idle" });
  const inputRef = React.useRef<HTMLInputElement>(null);

  const busy = status.kind === "busy";

  function acceptFile(candidate: File | undefined) {
    if (candidate && candidate.name.toLowerCase().endsWith(".csv")) {
      setFile(candidate);
      setStatus({ kind: "idle" });
    }
  }

  function resetDropzone() {
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  function onDrop(event: React.DragEvent) {
    event.preventDefault();
    setDragActive(false);
    if (!busy) acceptFile(event.dataTransfer.files[0]);
  }

  async function handleConvert() {
    const parsed = conversionSchema.safeParse({ tenderName, file });
    if (!parsed.success) {
      setStatus({
        kind: "error",
        message: parsed.error.issues[0]?.message ?? "Check your inputs.",
      });
      return;
    }

    setStatus({ kind: "busy" });

    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setStatus({ kind: "error", message: "Session expired — sign in again." });
        return;
      }

      const params = new URLSearchParams({
        tender_name: parsed.data.tenderName,
        lump_mode: String(mode === "lump-sum"),
        filename: parsed.data.file.name,
      });

      const res = await fetch(`${ENGINE_URL}/api/v1/convert?${params}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "text/csv",
        },
        body: parsed.data.file,
      });

      if (!res.ok) {
        setStatus({ kind: "error", message: await errorMessage(res) });
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${parsed.data.tenderName} - CAVSOFT IMPORT.zip`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);

      resetDropzone();
      setStatus({
        kind: "done",
        message: "ZIP downloaded. Nothing was stored server-side.",
      });
    } catch {
      setStatus({
        kind: "error",
        message: "Could not reach the conversion engine. Is it running?",
      });
    }
  }

  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle>New conversion</CardTitle>
        <CardDescription>
          Drop a Bluebeam Revu CSV export and choose how CAVsoft should receive
          it. Files are processed in memory only — nothing is stored.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="tender-name">Tender name</Label>
          <Input
            id="tender-name"
            placeholder="e.g. 500 Bourke St — Tower A"
            value={tenderName}
            maxLength={120}
            disabled={busy}
            onChange={(event) => setTenderName(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Export mode</Label>
          <ToggleGroup
            variant="outline"
            spacing={0}
            value={[mode]}
            onValueChange={(value) => {
              if (value.length > 0 && !busy) setMode(value[0] as Mode);
            }}
          >
            <ToggleGroupItem value="level-by-level" className="flex-1 px-4">
              Level-by-Level
            </ToggleGroupItem>
            <ToggleGroupItem value="lump-sum" className="flex-1 px-4">
              Lump Sum
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="bluebeam-csv">Bluebeam CSV export</Label>
          <div
            role="button"
            tabIndex={0}
            aria-label="Upload Bluebeam CSV export"
            onClick={() => !busy && inputRef.current?.click()}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                if (!busy) inputRef.current?.click();
              }
            }}
            onDragOver={(event) => {
              event.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={onDrop}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-secondary/30 px-6 py-10 text-center transition-colors outline-none",
              "hover:border-primary/60 hover:bg-secondary/50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
              dragActive && "border-primary bg-primary/10",
              busy && "pointer-events-none opacity-60"
            )}
          >
            <input
              ref={inputRef}
              id="bluebeam-csv"
              type="file"
              accept=".csv,text/csv"
              className="sr-only"
              onChange={(event) => acceptFile(event.target.files?.[0])}
            />
            {file ? (
              <>
                <FileSpreadsheet className="size-8 text-primary" />
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatSize(file.size)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={busy}
                  onClick={(event) => {
                    event.stopPropagation();
                    resetDropzone();
                  }}
                >
                  <X data-icon="inline-start" />
                  Remove
                </Button>
              </>
            ) : (
              <>
                <CloudUpload
                  className={cn(
                    "size-8 text-muted-foreground",
                    dragActive && "text-primary"
                  )}
                />
                <div>
                  <p className="text-sm font-medium">
                    Drag &amp; drop your CSV here
                  </p>
                  <p className="text-xs text-muted-foreground">
                    or click to browse — .csv up to 25 MB
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {status.kind === "error" && (
          <p className="flex items-center gap-2 text-sm text-destructive" role="alert">
            <CircleAlert className="size-4 shrink-0" />
            {status.message}
          </p>
        )}
        {status.kind === "done" && (
          <p className="flex items-center gap-2 text-sm text-primary" role="status">
            <CircleCheck className="size-4 shrink-0" />
            {status.message}
          </p>
        )}

        <Button
          size="lg"
          className="w-full"
          disabled={!file || busy}
          onClick={handleConvert}
        >
          {busy ? (
            <LoaderCircle data-icon="inline-start" className="animate-spin" />
          ) : (
            <FileUp data-icon="inline-start" />
          )}
          {busy ? "Converting…" : "Convert & Export for CAVsoft"}
        </Button>
      </CardContent>
    </Card>
  );
}
