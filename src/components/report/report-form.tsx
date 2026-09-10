"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, CheckCircle2, Loader2, Upload } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";

const ISSUE_TYPES = [
  "Financial Irregularity",
  "Project Not Found",
  "Duplicate Work",
  "Poor Quality",
  "Progress Misreporting",
  "Evidence Concern",
  "Other",
];

export function ReportForm() {
  const [issueType, setIssueType] = useState("");
  const [projectId, setProjectId] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!issueType) return setError("Please select an issue type.");
    if (description.trim().length < 10)
      return setError("Please describe the issue (at least 10 characters).");
    setLoading(true);
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issueType, projectId, location, description }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Submission failed.");
      setReference(data.reference);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (reference) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-lg rounded-2xl border border-low/30 bg-low/5 p-8 text-center"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-low/15">
          <CheckCircle2 className="h-7 w-7 text-low" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-fg">Report submitted</h2>
        <p className="mt-2 text-sm text-muted">
          Thank you. Your report has been received and will be reviewed by the
          relevant authority. No personal information was collected.
        </p>
        <div className="mt-4 inline-block rounded-lg border border-border bg-surface px-4 py-2 font-mono text-sm text-fg">
          Reference: {reference}
        </div>
        <div className="mt-6 flex justify-center gap-3">
          <ButtonLink href="/dashboard" variant="secondary" size="sm">
            Back to Dashboard
          </ButtonLink>
          <Button
            size="sm"
            onClick={() => {
              setReference(null);
              setIssueType("");
              setProjectId("");
              setLocation("");
              setDescription("");
              setFileName("");
            }}
          >
            Submit another
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-accent/30 bg-accent/5 p-4">
        <ShieldCheck className="h-5 w-5 shrink-0 text-accent" />
        <p className="text-sm text-muted">
          Your identity is not required to submit a report. Do not include
          personal information.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-4 rounded-2xl border border-border bg-surface p-6">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">
            Issue Type <span className="text-critical">*</span>
          </label>
          <select
            value={issueType}
            onChange={(e) => setIssueType(e.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-surface-2 px-3 text-sm text-fg focus:border-accent focus:outline-none"
          >
            <option value="">Select an issue type…</option>
            {ISSUE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Project ID (optional)" value={projectId} onChange={setProjectId} placeholder="e.g. 100003" />
          <Field label="Location (optional)" value={location} onChange={setLocation} placeholder="District / village" />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">
            Description <span className="text-critical">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="Describe the concern in detail…"
            className="w-full resize-y rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm text-fg placeholder:text-faint focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">
            Evidence (optional)
          </label>
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border bg-surface-2/40 px-3 py-2.5 text-sm text-muted hover:border-accent/50">
            <Upload className="h-4 w-4" />
            <span>{fileName || "Attach a photo or document"}</span>
            <input
              type="file"
              className="hidden"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
            />
          </label>
        </div>

        {error && (
          <div className="rounded-lg border border-critical/30 bg-critical/10 px-3 py-2 text-xs text-critical">
            {error}
          </div>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
            </>
          ) : (
            "Submit Anonymous Report"
          )}
        </Button>
        <p className="text-center text-[11px] text-faint">
          Submissions are rate-limited to prevent abuse. Demo endpoint — no data
          is persisted.
        </p>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-border bg-surface-2 px-3 text-sm text-fg placeholder:text-faint focus:border-accent focus:outline-none"
      />
    </div>
  );
}
