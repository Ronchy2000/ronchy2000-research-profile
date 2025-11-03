import profileJson from "@/content/profile.json";
import researchJson from "@/content/research.json";
import publicationsJson from "@/content/publications.json";
import projectsJson from "@/content/projects.json";
import timelineJson from "@/content/timeline.json";
import awardsJson from "@/content/awards.json";
import updatesJson from "@/content/updates.json";

import type {
  ProfileContent,
  ResearchContent,
  PublicationsContent,
  ProjectsContent,
  TimelineContent,
  AwardsContent,
  UpdatesContent
} from "./content-types";

/**
 * Placeholder accessors. In production, replace the inline casts with
 * file parsing logic (e.g., load and validate YAML/JSON). For now we rely on
 * the JSON placeholder files under /content.
 */
export function getProfileContent(): ProfileContent {
  const { en, zh } = profileJson as unknown as ProfileContent;
  return { en, zh };
}

export function getResearchContent(): ResearchContent {
  const { en, zh } = researchJson as unknown as ResearchContent;
  return { en, zh };
}

export function getPublicationsContent(): PublicationsContent {
  const { en, zh } = publicationsJson as unknown as PublicationsContent;
  return { en, zh };
}

export function getProjectsContent(): ProjectsContent {
  const { en, zh } = projectsJson as unknown as ProjectsContent;
  return { en, zh };
}

export function getTimelineContent(): TimelineContent {
  const { en, zh } = timelineJson as unknown as TimelineContent;
  return { en, zh };
}

export function getAwardsContent(): AwardsContent {
  const { en, zh } = awardsJson as unknown as AwardsContent;
  return { en, zh };
}

export function getUpdatesContent(): UpdatesContent {
  const { en, zh } = updatesJson as unknown as UpdatesContent;
  return { en, zh };
}
