import Link from "next/link";

import { MDXContent } from "@/components/mdx-content";
import { Section } from "@/components/section";

const placeholderPost = {
  title: "Sample Research Note",
  date: "2025-02-01",
  summary: "Placeholder MDX entry demonstrating the blog layout.",
  tags: ["Research", "Placeholder"]
};

export default function BlogPostPage() {
  return (
    <div className="space-y-16">
      <Section title={placeholderPost.title} description={placeholderPost.summary} eyebrow={placeholderPost.date}>
        <MDXContent>
          <p>
            This is a placeholder article layout. Replace it with an MDX loader or hardcoded content when ready. The
            Callout component and code snippets are showcased in the sample MDX file under <code>blog/sample-post.mdx</code>.
          </p>
          <p>
            Use this page to publish research diaries, experiment retrospectives, or paper reading notes. Include
            references, footnotes, and illustrative figures as needed.
          </p>
          <p>
            Return to the <Link href="/blog" className="text-brand">blog index</Link> for more entries.
          </p>
        </MDXContent>
      </Section>
    </div>
  );
}
