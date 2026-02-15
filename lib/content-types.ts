export type LocaleProfile = {
  name: string;
  nativeName?: string;
  title: string;
  affiliation: string;
  location: string;
  keywords: string[];
  social: {
    label: string;
    href: string;
  }[];
  cvLink: string;
  avatar?: string;
};

export type Localized<T> = {
  en: T;
  zh: T;
};

export type ProfileContent = Localized<LocaleProfile>;

export type ResearchInterest = {
  title: string;
  description: string;
};

export type ResearchExperience = {
  title: string;
  period: string;
  role: string;
  advisor?: string;
  funding?: string;
  summary: string;
  bullets: string[];
  tags?: string[];
};

export type PublicationEntry = {
  id: string;
  type: "C" | "J" | "P" | "S";
  title: string;
  authors: string;
  venue: string;
  year: string;
  tags?: string[];
  links?: {
    label: string;
    href: string;
  }[];
  notes?: string;
};

export type ProjectEntry = {
  name: string;
  summary: string;
  period: string;
  role: string;
  tags?: string[];
  links?: {
    label: string;
    href: string;
  }[];
  metrics?: Record<string, string | number>;
};

export type ProjectGroup = {
  title: string;
  kind: "academic" | "open-source" | string;
  items: ProjectEntry[];
};

export type TimelineEntry = {
  title: string;
  period: string;
  location?: string;
  details: string[];
};

export type AwardEntry = {
  title: string;
  issuer: string;
  year: string;
  notes?: string;
};

export type UpdateEntry = {
  date: string;
  type: string;
  title: string;
  summary: string;
  link: string;
};

export type ResearchContent = Localized<{
  interests: ResearchInterest[];
  experiences: ResearchExperience[];
}>;

export type ProjectsContent = Localized<{
  groups: ProjectGroup[];
}>;

export type TimelineContent = Localized<{
  education: TimelineEntry[];
  experience: TimelineEntry[];
}>;

export type PublicationsContent = Localized<{
  entries: PublicationEntry[];
}>;

export type AwardsContent = Localized<{
  awards: AwardEntry[];
}>;

export type UpdatesContent = Localized<{
  updates: UpdateEntry[];
}>;

export type BlogPageCopy = Localized<{
  title: string;
  description: string;
  eyebrow: string;
  filters: {
    type: string;
    year: string;
    all: string;
  };
  types: {
    research: string;
    note: string;
  };
  empty: string;
}>;

export type HomePageCopy = Localized<{
  heroIntro: string;
  buttons: {
    cv: string;
    publications: string;
    projects: string;
  };
  highlights: {
    title: string;
    focusLabel: string;
    focusValue: string;
    contactLabel: string;
    contactValue: string;
    locationLabel: string;
  };
  sections: {
    updates: { title: string; eyebrow: string };
    projects: { title: string; eyebrow: string; action: string };
    publications: { title: string; eyebrow: string; action: string };
    awards: { title: string; eyebrow: string; action: string };
  };
}>;

export type ResearchPageCopy = Localized<{
  heroTitle: string;
  heroDescription: string;
  interestsTitle: string;
  interestsEyebrow: string;
  experienceTitle: string;
  experienceEyebrow: string;
  collaboration: string;
}>;

export type ProjectsPageCopy = Localized<{
  heroTitle: string;
  heroDescription: string;
  filters: {
    year: string;
    label: string;
    all: string;
    ongoing: string;
    featured: string;
  };
  badges: {
    ongoing: string;
    featured: string;
  };
  empty: string;
  sections: {
    updates: { title: string; eyebrow: string };
  };
  groupLabels: {
    academic: string;
    "open-source": string;
    default: string;
  };
}>;

export type PublicationsPageCopy = Localized<{
  section: {
    title: string;
    description: string;
    eyebrow: string;
    note: string;
  };
  filters: {
    type: string;
    year: string;
    all: string;
  };
  types: {
    C: string;
    J: string;
    P: string;
    S: string;
  };
  empty: string;
}>;

export type CVPageCopy = Localized<{
  intro: {
    title: string;
    description: string;
    eyebrow: string;
    download: string;
    contactLabel: string;
    contactAction: string;
    locationLabel: string;
  };
  education: { title: string; eyebrow: string };
  experience: { title: string; eyebrow: string };
  honors: {
    title: string;
    eyebrow: string;
    headers: string[];
  };
  skills: {
    title: string;
    eyebrow: string;
    headers: string[];
    rows: string[][];
  };
  links: {
    title: string;
    eyebrow: string;
    publications: string;
    projects: string;
  };
}>;

export type ContactPageCopy = Localized<{
  title: string;
  description: string;
  eyebrow: string;
  revealButton: string;
  copyButton: string;
  copySuccess: string;
  copyError: string;
  submit: string;
  items: {
    contact: string;
    github: string;
    scholar: string;
    location: string;
  };
  notes: string[];
  feedback: {
    emailMissing: string;
    formInvalid: string;
  };
  calloutTitle: string;
  calloutPoints: string[];
  form: {
    nameLabel: string;
    namePlaceholder: string;
    replyLabel: string;
    messageLabel: string;
    messagePlaceholder: string;
  };
  scholarLabel: string;
}>;

export type ExperiencePageCopy = Localized<{
  experience: {
    title: string;
    description: string;
    eyebrow: string;
  };
  education: {
    title: string;
    description: string;
    eyebrow: string;
  };
}>;
