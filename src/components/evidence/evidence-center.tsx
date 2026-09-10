"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Camera, Upload, Loader2, MapPin, Clock, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatDate } from "@/lib/utils";
import type { EvidenceStatus } from "@/lib/types";

interface EvidenceRow {
  id: string;
  label: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  similarityScore: number;
  status: EvidenceStatus;
  hash: string;
  projectId: string;
  projectName: string;
  district: string;
  stateName: string;
}

const STATUS_STYLE: Record<EvidenceStatus, string> = {
  VERIFIED: "text-low bg-low/10 ring-low/20",
  REVIEW_REQUIRED: "text-medium bg-medium/10 ring-medium/20",
  POSSIBLE_REUSE: "text-high bg-high/10 ring-high/20",
  LOCATION_MISMATCH: "text-high bg-high/10 ring-high/20",
  TIMESTAMP_MISMATCH: "text-medium bg-medium/10 ring-medium/20",
};

export function EvidenceCenter({ records }: { records: EvidenceRow[] }) {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <UploadDemo />
        <ComparisonDemo />
      </div>

      <div>
        <h2 className="mb-4 text-lg font-bold text-fg">Evidence Records</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {records.map((e) => (
            <div key={e.id} className="overflow-hidden rounded-xl border border-border bg-surface">
              <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-surface-2 to-bg">
                <Camera className="h-8 w-8 text-faint" />
              </div>
              <div className="p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium text-fg">
                    {e.projectName.slice(0, 28)}…
                  </span>
                </div>
                <span
                  className={cn(
                    "mt-2 inline-block rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ring-1",
                    STATUS_STYLE[e.status]
                  )}
                >
                  {e.status.replace("_", " ")}
                </span>
                <div className="mt-3 space-y-1 text-[11px] text-faint">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3" /> {formatDate(e.timestamp)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3 w-3" /> {e.latitude.toFixed(3)},{" "}
                    {e.longitude.toFixed(3)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Fingerprint className="h-3 w-3" /> {e.hash} · sim {e.similarityScore}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function UploadDemo() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{ status: string; detail: string } | null>(null);

  function onFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
      setResult(null);
      setAnalyzing(true);
      // Simulated analysis (no external API is called).
      setTimeout(() => {
        setAnalyzing(false);
        setResult({
          status: "REVIEW REQUIRED",
          detail:
            "Simulated analysis: no EXIF geotag detected and timestamp unverifiable. Flagged for human review. (Demo — no real ML/API is invoked.)",
        });
      }, 1600);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <h3 className="text-sm font-semibold text-fg">Test Evidence Verification</h3>
      <p className="mt-1 text-xs text-muted">
        Upload a demo image to simulate the verification pipeline. Nothing is
        uploaded to a server; analysis is simulated locally.
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
      />
      <div
        onClick={() => inputRef.current?.click()}
        className="mt-4 flex aspect-video cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-surface-2/40 transition-colors hover:border-accent/50"
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Uploaded evidence preview" className="h-full w-full object-cover" />
        ) : (
          <div className="text-center text-xs text-faint">
            <Upload className="mx-auto h-6 w-6" />
            <span className="mt-2 block">Click to select an image</span>
          </div>
        )}
      </div>
      {analyzing && (
        <div className="mt-3 flex items-center gap-2 text-xs text-accent">
          <Loader2 className="h-4 w-4 animate-spin" /> Verifying evidence…
        </div>
      )}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 rounded-lg border border-medium/30 bg-medium/10 px-3 py-2"
        >
          <div className="text-xs font-semibold text-medium">{result.status}</div>
          <p className="mt-1 text-[11px] text-muted">{result.detail}</p>
        </motion.div>
      )}
    </div>
  );
}

function ComparisonDemo() {
  const [sim, setSim] = useState(91);
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <h3 className="text-sm font-semibold text-fg">Image Comparison</h3>
      <p className="mt-1 text-xs text-muted">
        Compare two submissions for potential reuse.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {["Evidence A", "Evidence B"].map((l) => (
          <div key={l}>
            <div className="flex aspect-square items-center justify-center rounded-xl bg-gradient-to-br from-surface-2 to-bg">
              <Camera className="h-7 w-7 text-faint" />
            </div>
            <div className="mt-1.5 text-center text-[11px] text-faint">{l}</div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <div className="mb-1 flex items-center justify-between text-xs">
          <label className="text-muted">Similarity</label>
          <span className="tabular font-semibold text-fg">{sim}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={sim}
          onChange={(e) => setSim(Number(e.target.value))}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-surface-2 accent-accent"
        />
      </div>
      <div
        className={cn(
          "mt-3 rounded-lg px-3 py-2 text-xs",
          sim > 85
            ? "border border-high/30 bg-high/10 text-high"
            : "border border-low/30 bg-low/10 text-low"
        )}
      >
        {sim > 85
          ? "Potential image reuse — flag for human verification."
          : "Images appear sufficiently distinct."}
      </div>
    </div>
  );
}
