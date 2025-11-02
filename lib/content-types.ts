export type LocaleProfile = {
  name: string;
  nativeName?: string;
  title: string;
  affiliation: string;
  location: string;
  email: string;
  keywords: string[];
  social: {
    label: string;
    href: string;
  }[];
  cvLink: string;
  avatar?: string;
};

export type ProfileContent = {
  en: LocaleProfile;
  zh: LocaleProfile;
};

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
