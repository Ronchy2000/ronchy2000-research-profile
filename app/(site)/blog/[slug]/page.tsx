"use client";

import Link from "next/link";

import { MDXContent } from "@/components/mdx-content";
import { Section } from "@/components/section";
import { useLocale } from "@/components/locale-provider";

const POST_COPY = {
  en: {
    title: "Sample Research Note",
    date: "2025-02-01",
    summary: "An example of research notes and technical writing.",
    paragraphs: [
      "Welcome to my research notes. This space is dedicated to documenting experiment findings, paper reviews, and technical explorations in multi-agent systems and robotics.",
      "Each article includes detailed analysis, relevant references, and illustrative examples to share insights from my research journey."
    ],
    backPrefix: "Return to the ",
    backLabel: "blog index",
    backSuffix: " for more entries."
  },
  zh: {
    title: "示例研究手记",
    date: "2025-02-01",
    summary: "示范如何整理实验结果、论文阅读与技术笔记。",
    paragraphs: [
      "欢迎来到我的研究笔记，这里记录多智能体与机器人方向的实验结果、论文体会与技术探索。",
      "每篇文章都会附上关键分析、参考文献及示例，方便快速复盘研究过程。"
    ],
    backPrefix: "返回",
    backLabel: "博客列表",
    backSuffix: "查看更多内容。"
  }
} as const;

export default function BlogPostPage() {
  const { locale } = useLocale();
  const post = POST_COPY[locale];

  return (
    <div className="space-y-16">
      <Section title={post.title} description={post.summary} eyebrow={post.date}>
        <MDXContent>
          {post.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
          <p>
            {post.backPrefix}
            <Link href="/blog" className="text-brand">
              {post.backLabel}
            </Link>
            {post.backSuffix}
          </p>
        </MDXContent>
      </Section>
    </div>
  );
}
