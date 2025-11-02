import profileJson from "@/content/profile.json";
import researchJson from "@/content/research.json";
import publicationsJson from "@/content/publications.json";
import projectsJson from "@/content/projects.json";
import timelineJson from "@/content/timeline.json";
import awardsJson from "@/content/awards.json";
import updatesJson from "@/content/updates.json";

import type {
  AwardEntry,
  ProfileContent,
  ProjectGroup,
  PublicationEntry,
  ResearchExperience,
  ResearchInterest,
  TimelineEntry,
  UpdateEntry
} from "./content-types";

type ResearchContent = {
  interests: ResearchInterest[];
  experiences: ResearchExperience[];
};

type ProjectsContent = {
  groups: ProjectGroup[];
};

type TimelineContent = {
  education: TimelineEntry[];
  experience: TimelineEntry[];
};

type PublicationsContent = {
  entries: PublicationEntry[];
};

type AwardsContent = {
  awards: AwardEntry[];
};

type UpdatesContent = {
  updates: UpdateEntry[];
};

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
  const { interests, experiences } = researchJson as unknown as ResearchContent;
  return { interests, experiences };
}

export function getPublicationsContent(): PublicationsContent {
  const { entries } = publicationsJson as unknown as PublicationsContent;
  return { entries };
}

export function getProjectsContent(): ProjectsContent {
  const { groups } = projectsJson as unknown as ProjectsContent;
  return { groups };
}

export function getTimelineContent(): TimelineContent {
  const { education, experience } = timelineJson as unknown as TimelineContent;
  return { education, experience };
}

export function getAwardsContent(): AwardsContent {
  const { awards } = awardsJson as unknown as AwardsContent;
  return { awards };
}

export function getUpdatesContent(): UpdatesContent {
  const { updates } = updatesJson as unknown as UpdatesContent;
  return { updates };
}
