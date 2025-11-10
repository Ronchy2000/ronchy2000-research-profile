"use client";

import Link from "next/link";

import { Section } from "@/components/section";
import { Table } from "@/components/table";
import { Timeline } from "@/components/timeline";
import { useLocale } from "@/components/locale-provider";
import { getAwardsContent, getProfileContent, getTimelineContent } from "@/lib/content";

export default function CVPage() {
  const { locale } = useLocale();
  const profileContent = getProfileContent();
  const profile = profileContent[locale];
  const timeline = getTimelineContent()[locale];
  const awards = getAwardsContent()[locale].awards;

  const copy = {
    en: {
      intro: {
        title: "Curriculum Vitae",
        description: "Downloadable PDF and printable view. Adjust content via the files in /content.",
        eyebrow: "Overview",
        download: "Download PDF",
        contactLabel: "Contact",
        contactAction: "Reveal email",
        locationLabel: "Location"
      },
      education: { title: "Education", eyebrow: "CV" },
      experience: { title: "Professional Experience", eyebrow: "CV" },
      honors: {
        title: "Selected Honors",
        eyebrow: "Recognition",
        headers: ["Year", "Award", "Issuer"]
      },
      skills: {
        title: "Skills & Coursework",
        eyebrow: "CV",
        headers: ["Category", "Items"],
        rows: [
          ["Programming", "Python, C/C++, MATLAB"],
          ["Frameworks", "PyTorch, ROS, OpenCV"],
          ["Courses", "Optimal Control, Multi-agent Systems, Embedded Systems"]
        ]
      },
      links: {
        title: "Additional Links",
        eyebrow: "CV",
        publications: "Publications overview",
        projects: "Project portfolio"
      }
    },
    zh: {
      intro: {
        title: "个人简历",
        description: "提供 PDF 下载与打印视图，相关内容可在 /content 目录中维护。",
        eyebrow: "概览",
        download: "下载 PDF",
        contactLabel: "联系邮箱",
        contactAction: "点击显示邮箱",
        locationLabel: "常驻城市"
      },
      education: { title: "教育背景", eyebrow: "简历" },
      experience: { title: "实习 / 工作经历", eyebrow: "简历" },
      honors: {
        title: "荣誉奖励",
        eyebrow: "荣誉",
        headers: ["年份", "奖项", "颁发机构"]
      },
      skills: {
        title: "技能与课程",
        eyebrow: "简历",
        headers: ["类别", "内容"],
        rows: [
          ["编程", "Python、C/C++、MATLAB"],
          ["框架", "PyTorch、ROS、OpenCV"],
          ["课程", "最优控制、多智能体系统、嵌入式系统"]
        ]
      },
      links: {
        title: "更多链接",
        eyebrow: "简历",
        publications: "查看发表成果",
        projects: "浏览项目集锦"
      }
    }
  } as const;

  const t = copy[locale];
  const honorsHeaders = [...t.honors.headers];
  const skillsHeaders = [...t.skills.headers];
  const skillsRows = t.skills.rows.map((row) => [...row]);

  return (
    <div className="space-y-16">
      <Section
        title={t.intro.title}
        description={t.intro.description}
        eyebrow={t.intro.eyebrow}
        actions={
          <a href={profile.cvLink} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
            {t.intro.download}
          </a>
        }
      >
        <div className="space-y-3 text-base text-slate-600 dark:text-slate-300">
          <p>{profile.title}</p>
          <p>{profile.affiliation}</p>
          <p>
            {t.intro.contactLabel}: <Link href="/contact" className="text-brand hover:text-brand-foreground">{t.intro.contactAction}</Link>
          </p>
          <p>{t.intro.locationLabel}: {profile.location}</p>
        </div>
      </Section>

      <Section title={t.education.title} eyebrow={t.education.eyebrow}>
        <Timeline items={timeline.education} />
      </Section>

      <Section title={t.experience.title} eyebrow={t.experience.eyebrow}>
        <Timeline items={timeline.experience} />
      </Section>

      <Section title={t.honors.title} eyebrow={t.honors.eyebrow}>
        <Table
          headers={honorsHeaders}
          rows={awards.map((award) => [award.year, award.title, award.issuer])}
        />
      </Section>

      <Section title={t.skills.title} eyebrow={t.skills.eyebrow}>
        <Table
          headers={skillsHeaders}
          rows={skillsRows}
        />
      </Section>

      <Section title={t.links.title} eyebrow={t.links.eyebrow}>
        <ul className="space-y-2 text-base text-slate-600 dark:text-slate-300">
          <li>
            <Link href="/publications" className="text-brand hover:text-brand-foreground">
              {t.links.publications}
            </Link>
          </li>
          <li>
            <Link href="/projects" className="text-brand hover:text-brand-foreground">
              {t.links.projects}
            </Link>
          </li>
        </ul>
      </Section>
    </div>
  );
}
