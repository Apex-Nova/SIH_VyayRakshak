import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Simple in-memory rate limiter (per IP) for the anonymous report endpoint.
// In production this would be backed by a shared store (e.g. Redis).
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

const ISSUE_TYPES = new Set([
  "Financial Irregularity",
  "Project Not Found",
  "Duplicate Work",
  "Poor Quality",
  "Progress Misreporting",
  "Evidence Concern",
  "Other",
]);

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    return NextResponse.json(
      { error: "Too many reports submitted. Please try again shortly." },
      { status: 429 }
    );
  }
  recent.push(now);
  hits.set(ip, recent);

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const issueType = String(body?.issueType ?? "");
  const description = String(body?.description ?? "").trim();

  if (!ISSUE_TYPES.has(issueType)) {
    return NextResponse.json({ error: "Please select a valid issue type." }, { status: 400 });
  }
  if (description.length < 10) {
    return NextResponse.json(
      { error: "Please provide a description of at least 10 characters." },
      { status: 400 }
    );
  }

  // A real implementation would persist this to a moderated queue. The demo
  // acknowledges receipt with a reference id and stores nothing personal.
  const reference = `NRK-${now.toString(36).toUpperCase()}`;
  return NextResponse.json({ ok: true, reference });
}
