import profileJson from "@/content/profile.json";
import researchJson from "@/content/research.json";
import publicationsJson from "@/content/publications.json";
import projectsJson from "@/content/projects.json";
import timelineJson from "@/content/timeline.json";
import awardsJson from "@/content/awards.json";
import updatesJson from "@/content/updates.json";
import blogPageJson from "@/content/pages/blog.json";
import homePageJson from "@/content/pages/home.json";
import researchPageJson from "@/content/pages/research.json";
import projectsPageJson from "@/content/pages/projects.json";
import publicationsPageJson from "@/content/pages/publications.json";
import cvPageJson from "@/content/pages/cv.json";
import contactPageJson from "@/content/pages/contact.json";
import experiencePageJson from "@/content/pages/experience.json";

import type {
  ProfileContent,
  ResearchContent,
  PublicationsContent,
  ProjectsContent,
  TimelineContent,
  AwardsContent,
  UpdatesContent,
  BlogPageCopy,
  HomePageCopy,
  ResearchPageCopy,
  ProjectsPageCopy,
  PublicationsPageCopy,
  CVPageCopy,
  ContactPageCopy,
  ExperiencePageCopy
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

export function getBlogPageCopy(): BlogPageCopy {
  const { en, zh } = blogPageJson as unknown as BlogPageCopy;
  return { en, zh };
}

export function getHomePageCopy(): HomePageCopy {
  const { en, zh } = homePageJson as unknown as HomePageCopy;
  return { en, zh };
}

export function getResearchPageCopy(): ResearchPageCopy {
  const { en, zh } = researchPageJson as unknown as ResearchPageCopy;
  return { en, zh };
}

export function getProjectsPageCopy(): ProjectsPageCopy {
  const { en, zh } = projectsPageJson as unknown as ProjectsPageCopy;
  return { en, zh };
}

export function getPublicationsPageCopy(): PublicationsPageCopy {
  const { en, zh } = publicationsPageJson as unknown as PublicationsPageCopy;
  return { en, zh };
}

export function getCVPageCopy(): CVPageCopy {
  const { en, zh } = cvPageJson as unknown as CVPageCopy;
  return { en, zh };
}

export function getContactPageCopy(): ContactPageCopy {
  const { en, zh } = contactPageJson as unknown as ContactPageCopy;
  return { en, zh };
}

export function getExperiencePageCopy(): ExperiencePageCopy {
  const { en, zh } = experiencePageJson as unknown as ExperiencePageCopy;
  return { en, zh };
}
