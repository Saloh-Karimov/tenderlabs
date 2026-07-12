"use client";

import * as React from "react";
import { CloudUpload, FileSpreadsheet, FileUp, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

type Mode = "level-by-level" | "lump-sum";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ConversionPanel() {
  const [mode, setMode] = React.useState<Mode>("level-by-level");
  const [file, setFile] = React.useState<File | null>(null);
  const [dragActive, setDragActive] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  function acceptFile(candidate: File | undefined) {
    if (candidate && candidate.name.toLowerCase().endsWith(".csv")) {
      setFile(candidate);
    }
  }

  function onDrop(event: React.DragEvent) {
    event.preventDefault();
    setDragActive(false);
    acceptFile(event.dataTransfer.files[0]);
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
          <Label>Export mode</Label>
          <ToggleGroup
            variant="outline"
            spacing={0}
            value={[mode]}
            onValueChange={(value) => {
              if (value.length > 0) setMode(value[0] as Mode);
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
            onClick={() => inputRef.current?.click()}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                inputRef.current?.click();
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
              dragActive && "border-primary bg-primary/10"
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
                  onClick={(event) => {
                    event.stopPropagation();
                    setFile(null);
                    if (inputRef.current) inputRef.current.value = "";
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

        <Button size="lg" className="w-full" disabled={!file}>
          <FileUp data-icon="inline-start" />
          Convert &amp; Export for CAVsoft
        </Button>
      </CardContent>
    </Card>
  );
}
