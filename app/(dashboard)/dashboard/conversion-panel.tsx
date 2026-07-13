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
  files: z
    .array(z.instanceof(File).refine((f) => f.size > 0, "One of the files is empty."))
    .min(1, "Drop at least one Bluebeam CSV export first.")
    .refine(
      (list) => list.reduce((sum, f) => sum + f.size, 0) <= MAX_UPLOAD_BYTES,
      "Combined CSVs must be 25 MB or smaller."
    ),
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
  const [files, setFiles] = React.useState<File[]>([]);
  const [dragActive, setDragActive] = React.useState(false);
  const [status, setStatus] = React.useState<Status>({ kind: "idle" });
  const inputRef = React.useRef<HTMLInputElement>(null);

  const busy = status.kind === "busy";
  const totalSize = files.reduce((sum, f) => sum + f.size, 0);

  function acceptFiles(candidates: FileList | null | undefined) {
    if (!candidates) return;
    const incoming = Array.from(candidates).filter((f) =>
      f.name.toLowerCase().endsWith(".csv")
    );
    if (incoming.length === 0) return;
    setFiles((current) => {
      const seen = new Set(current.map((f) => `${f.name}:${f.size}`));
      return [
        ...current,
        ...incoming.filter((f) => !seen.has(`${f.name}:${f.size}`)),
      ];
    });
    setStatus({ kind: "idle" });
  }

  function removeFile(target: File) {
    setFiles((current) => current.filter((f) => f !== target));
    if (inputRef.current) inputRef.current.value = "";
  }

  function resetDropzone() {
    setFiles([]);
    if (inputRef.current) inputRef.current.value = "";
  }

  function onDrop(event: React.DragEvent) {
    event.preventDefault();
    setDragActive(false);
    if (!busy) acceptFiles(event.dataTransfer.files);
  }

  async function handleConvert() {
    const parsed = conversionSchema.safeParse({ tenderName, files });
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
      });

      // One batch request: every system export in a single multipart body.
      const formData = new FormData();
      for (const f of parsed.data.files) {
        formData.append("files", f, f.name);
      }

      const res = await fetch(`${ENGINE_URL}/api/v1/convert?${params}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: formData,
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
    <Card className="w-full gap-6 rounded-3xl border border-slate-200/60 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-0 [--card-spacing:--spacing(8)]">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-lg font-semibold text-slate-900">
          New conversion
        </CardTitle>
        <CardDescription className="text-slate-500">
          Drop a Bluebeam Revu CSV export and choose how CAVsoft should receive
          it. Files are processed in memory only — nothing is stored.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="tender-name" className="font-medium text-slate-700">
            Tender name
          </Label>
          <Input
            id="tender-name"
            placeholder="e.g. 500 Bourke St — Tower A"
            value={tenderName}
            maxLength={120}
            disabled={busy}
            onChange={(event) => setTenderName(event.target.value)}
            className="h-11 rounded-xl"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="font-medium text-slate-700">Export mode</Label>
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
          <Label htmlFor="bluebeam-csv" className="font-medium text-slate-700">
            Bluebeam CSV exports
          </Label>
          <div
            role="button"
            tabIndex={0}
            aria-label="Upload Bluebeam CSV exports"
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
              "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center transition-all duration-200 ease-in-out outline-none",
              "hover:scale-[1.01] hover:border-amber-500 hover:bg-amber-50/50",
              "focus-visible:border-amber-500 focus-visible:ring-3 focus-visible:ring-amber-500/40",
              dragActive && "scale-[1.01] border-amber-500 bg-amber-50/60",
              busy && "pointer-events-none opacity-60"
            )}
          >
            <input
              ref={inputRef}
              id="bluebeam-csv"
              type="file"
              accept=".csv,text/csv"
              multiple
              className="sr-only"
              onChange={(event) => acceptFiles(event.target.files)}
            />
            {files.length > 0 ? (
              <>
                <ul className="flex w-full flex-col gap-1.5">
                  {files.map((f) => (
                    <li
                      key={`${f.name}:${f.size}`}
                      className="flex items-center gap-3 rounded-xl border border-slate-200/60 bg-white px-3 py-2 text-left shadow-[0_2px_8px_rgb(0,0,0,0.03)]"
                    >
                      <FileSpreadsheet className="size-4 shrink-0 text-amber-500" />
                      <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800">
                        {f.name}
                      </span>
                      <span className="text-xs text-slate-400">
                        {formatSize(f.size)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Remove ${f.name}`}
                        disabled={busy}
                        onClick={(event) => {
                          event.stopPropagation();
                          removeFile(f);
                        }}
                      >
                        <X />
                      </Button>
                    </li>
                  ))}
                </ul>
                <p className="text-xs font-medium text-slate-500">
                  {files.length} file{files.length === 1 ? "" : "s"} ·{" "}
                  {formatSize(totalSize)} — drop or click to add more systems
                </p>
              </>
            ) : (
              <>
                <CloudUpload
                  className={cn(
                    "size-8 text-slate-400 transition-colors duration-200",
                    dragActive && "text-amber-500"
                  )}
                />
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Drag &amp; drop your system CSVs here
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-slate-500">
                    one per system (CHW, HW, CW…) — up to 25 MB combined
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {status.kind === "error" && (
          <p
            className="flex items-center gap-2 text-sm font-medium text-red-600"
            role="alert"
          >
            <CircleAlert className="size-4 shrink-0" />
            {status.message}
          </p>
        )}
        {status.kind === "done" && (
          <p
            className="flex items-center gap-2 text-sm font-medium text-emerald-600"
            role="status"
          >
            <CircleCheck className="size-4 shrink-0" />
            {status.message}
          </p>
        )}

        <Button
          size="lg"
          className="h-12 w-full rounded-xl bg-slate-900 text-base font-semibold text-white transition-all hover:bg-slate-800"
          disabled={files.length === 0 || busy}
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
