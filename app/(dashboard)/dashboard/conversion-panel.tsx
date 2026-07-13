"use client";

import * as React from "react";
import {
  CircleCheck,
  CircleAlert,
  CloudUpload,
  FileSpreadsheet,
  FileUp,
  LoaderCircle,
  ShieldCheck,
  X,
} from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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
      anchor.download = `${parsed.data.tenderName} - CavSoft Import.zip`;
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
    <div className="w-full rounded-3xl border border-slate-200/60 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="flex items-start justify-between gap-4 px-8 pt-7 pb-5">
        <div>
          <h2 className="text-[15px] font-semibold tracking-tight text-slate-900">
            New conversion
          </h2>
          <p className="mt-1 text-[13px] leading-relaxed text-slate-400">
            Drop your Bluebeam exports and choose how CavSoft should receive
            them.
          </p>
        </div>
        <span className="mt-0.5 inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50/70 px-2.5 py-1 font-mono text-[10px] font-medium tracking-[0.14em] text-emerald-700 uppercase">
          <ShieldCheck className="size-3" aria-hidden="true" />
          In-RAM
        </span>
      </div>

      <div className="flex flex-col gap-7 border-t border-slate-100 px-8 py-7">
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="tender-name"
            className="text-[13px] font-medium text-slate-600"
          >
            Tender name
          </Label>
          <Input
            id="tender-name"
            placeholder="e.g. 500 Bourke St — Tower A"
            value={tenderName}
            maxLength={120}
            disabled={busy}
            onChange={(event) => setTenderName(event.target.value)}
            className="h-11 rounded-xl border-slate-200 bg-slate-50/50 text-[15px] transition-colors focus-visible:border-amber-500 focus-visible:bg-white focus-visible:ring-amber-500/15"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-[13px] font-medium text-slate-600">
            Export mode
          </Label>
          <ToggleGroup
            spacing={1}
            value={[mode]}
            onValueChange={(value) => {
              if (value.length > 0 && !busy) setMode(value[0] as Mode);
            }}
            className="w-full rounded-xl bg-slate-100/80 p-1"
          >
            <ToggleGroupItem
              value="level-by-level"
              className="h-9 flex-1 rounded-lg px-4 text-[13px] font-medium text-slate-500 hover:bg-white/60 hover:text-slate-700 aria-pressed:bg-white aria-pressed:text-slate-900 aria-pressed:shadow-[0_1px_3px_rgb(0,0,0,0.08)]"
            >
              Level-by-Level
            </ToggleGroupItem>
            <ToggleGroupItem
              value="lump-sum"
              className="h-9 flex-1 rounded-lg px-4 text-[13px] font-medium text-slate-500 hover:bg-white/60 hover:text-slate-700 aria-pressed:bg-white aria-pressed:text-slate-900 aria-pressed:shadow-[0_1px_3px_rgb(0,0,0,0.08)]"
            >
              Lump Sum
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="flex flex-col gap-2">
          <Label
            htmlFor="bluebeam-csv"
            className="text-[13px] font-medium text-slate-600"
          >
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
              "group/drop flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 px-6 py-10 text-center transition-all duration-300 ease-out outline-none",
              "hover:border-amber-400 hover:bg-amber-50/40",
              "focus-visible:border-amber-500 focus-visible:ring-4 focus-visible:ring-amber-500/15",
              dragActive &&
                "border-amber-500 bg-amber-50/60 shadow-[0_0_0_4px_rgb(245,158,11,0.08),0_12px_40px_rgb(245,158,11,0.12)]",
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
                <ul className="flex w-full flex-col gap-2">
                  {files.map((f) => (
                    <li
                      key={`${f.name}:${f.size}`}
                      className="flex items-center gap-3 rounded-xl border border-slate-200/60 bg-white px-3 py-2 text-left shadow-[0_2px_8px_rgb(0,0,0,0.03)] duration-300 animate-in fade-in slide-in-from-bottom-1"
                    >
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-amber-100 bg-amber-50">
                        <FileSpreadsheet className="size-4 text-amber-600" />
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-slate-800">
                        {f.name}
                      </span>
                      <span className="font-mono text-[11px] text-slate-400">
                        {formatSize(f.size)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Remove ${f.name}`}
                        disabled={busy}
                        className="text-slate-400 hover:text-slate-700"
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
                <p className="text-xs font-medium text-slate-400">
                  {files.length} file{files.length === 1 ? "" : "s"} ·{" "}
                  {formatSize(totalSize)} — drop or click to add more systems
                </p>
              </>
            ) : (
              <>
                <span
                  className={cn(
                    "flex size-14 items-center justify-center rounded-full border border-slate-200/60 bg-white shadow-[0_8px_24px_rgb(0,0,0,0.06)] transition-all duration-300",
                    "group-hover/drop:-translate-y-1 group-hover/drop:shadow-[0_12px_32px_rgb(217,119,6,0.16)]",
                    dragActive &&
                      "-translate-y-1 shadow-[0_12px_32px_rgb(217,119,6,0.16)]"
                  )}
                >
                  <CloudUpload
                    className={cn(
                      "size-6 text-slate-400 transition-colors duration-300 group-hover/drop:text-amber-500",
                      dragActive && "text-amber-600"
                    )}
                  />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Drop your system CSVs
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    or click to browse — CHW, HW, CW… up to 25 MB combined
                  </p>
                </div>
                <p className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                  <ShieldCheck className="size-3 text-emerald-500" />
                  Processed in RAM — never written to disk
                </p>
              </>
            )}
          </div>
        </div>

        {status.kind === "error" && (
          <p
            className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50/70 px-3.5 py-2.5 text-[13px] font-medium text-red-700 duration-300 animate-in fade-in"
            role="alert"
          >
            <CircleAlert className="mt-0.5 size-4 shrink-0" />
            {status.message}
          </p>
        )}
        {status.kind === "done" && (
          <p
            className="flex items-start gap-2 rounded-xl border border-emerald-100 bg-emerald-50/70 px-3.5 py-2.5 text-[13px] font-medium text-emerald-700 duration-300 animate-in fade-in"
            role="status"
          >
            <CircleCheck className="mt-0.5 size-4 shrink-0" />
            {status.message}
          </p>
        )}

        <Button
          size="lg"
          className="h-12 w-full rounded-xl bg-slate-900 text-[15px] font-semibold text-white shadow-[0_8px_24px_rgb(15,23,42,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-[0_12px_32px_rgb(15,23,42,0.24)] active:translate-y-0 disabled:shadow-none"
          disabled={files.length === 0 || busy}
          onClick={handleConvert}
        >
          {busy ? (
            <LoaderCircle data-icon="inline-start" className="animate-spin" />
          ) : (
            <FileUp data-icon="inline-start" />
          )}
          {busy ? "Converting…" : "Convert & Export for CavSoft"}
        </Button>
      </div>
    </div>
  );
}
