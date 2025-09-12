// app/blogs/[slug]/page.tsx
import { notFound } from "next/navigation";
import BlogPostClient from "./BlogPostClient";
import { blogPosts } from "@/data/blogPosts";

export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({ slug }));
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug as keyof typeof blogPosts];
  if (!post) notFound();

  return <BlogPostClient slug={params.slug} />;
}
