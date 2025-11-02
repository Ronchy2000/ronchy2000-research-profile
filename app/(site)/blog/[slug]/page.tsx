import Link from "next/link";

import { MDXContent } from "@/components/mdx-content";
import { Section } from "@/components/section";

const samplePost = {
  title: "Sample Research Note",
  date: "2025-02-01",
  summary: "An example of research notes and technical writing.",
  tags: ["Research", "Example"]
};

export default function BlogPostPage() {
  return (
    <div className="space-y-16">
      <Section title={samplePost.title} description={samplePost.summary} eyebrow={samplePost.date}>
        <MDXContent>
          <p>
            Welcome to my research notes. This space is dedicated to documenting experiment findings, 
            paper reviews, and technical explorations in multi-agent systems and robotics.
          </p>
          <p>
            Each article includes detailed analysis, relevant references, and illustrative examples 
            to share insights from my research journey.
          </p>
          <p>
            Return to the <Link href="/blog" className="text-brand">blog index</Link> for more entries.
          </p>
        </MDXContent>
      </Section>
    </div>
  );
}
