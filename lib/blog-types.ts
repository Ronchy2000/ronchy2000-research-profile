export type BlogPostType = "research" | "note";

export type BlogPostMeta = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  type: BlogPostType;
};

export type BlogPost = BlogPostMeta & {
  content: string;
};

