import type { MetadataRoute } from "next";

const BASE = "https://nirikshak-ai.example";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/dashboard",
    "/projects",
    "/financial",
    "/progress",
    "/evidence",
    "/agencies",
    "/constituencies",
    "/map",
    "/investigation",
    "/report",
    "/login",
    "/inspection",
  ];
  return routes.map((r) => ({
    url: `${BASE}${r}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: r === "" ? 1 : 0.7,
  }));
}
