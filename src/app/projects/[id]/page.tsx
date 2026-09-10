import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/projects/project-detail";
import { projectById, topFlagged } from "@/lib/data/queries";

export function generateStaticParams() {
  // Pre-render the top-flagged projects; the rest render on demand.
  return topFlagged(12).map((p) => ({ id: p.id }));
}

export function generateMetadata({
  params,
}: {
  params: { id: string };
}): Metadata {
  const p = projectById(params.id);
  return {
    title: p ? `${p.name.slice(0, 48)} · #${p.id}` : "Project not found",
  };
}

export default function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const project = projectById(params.id);
  if (!project) notFound();
  return <ProjectDetail project={project} />;
}
