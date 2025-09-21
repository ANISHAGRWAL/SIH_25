"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "@/app/navbar/page";
import { blogPosts } from "@/data/blogPosts";
import { useTranslation, useLoadNamespace } from "@/components/I18nProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";

// Define the type for a single blog post item
interface BlogPost {
  id: string;
  title: string;
  image: string;
  date: string;
  category: string;
  // Add other properties if needed
}

// Explicitly type the 'blog' prop
function RelatedBlogCard({ blog }: { blog: BlogPost }) {
  const { t } = useTranslation();
  return (
    <Link
      href={`/blogs/${blog.id}`}
      className="group block bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all"
    >
      <div className="relative w-full aspect-video rounded-t-lg overflow-hidden">
        <Image
          src={blog.image || "/placeholder.svg"}
          alt={t(`blog.titles.${blog.title}`)}
          fill
          sizes="(max-width: 768px) 100vw, 300px"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-3">
        <p className="text-xs text-gray-500 mb-1">
          {t(`blog.dates.${blog.date}`)}
        </p>
        <h4 className="text-sm font-semibold text-slate-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {t(`blog.titles.${blog.title}`)}
        </h4>
      </div>
    </Link>
  );
}

export default function BlogPostClient({ slug }: { slug: string }) {
  const { t } = useTranslation();
  useLoadNamespace("blog");

  const post = blogPosts[slug as keyof typeof blogPosts];
  if (!post) return null;

  // The 'allOtherBlogs' array needs to match the new BlogPost type
  const allOtherBlogs: BlogPost[] = Object.entries(blogPosts)
    .filter(([s]) => s !== slug)
    .map(([id, blog]) => ({
      id,
      title: blog.title,
      image: blog.image,
      date: blog.date,
      category: blog.category, // Added category to match the interface
    }));
    
  const relatedBlogs = allOtherBlogs.sort(() => 0.5 - Math.random()).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-12 sm:pt-20 lg:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-10">
          <div className="flex justify-end mb-4">
            <LanguageSwitcher />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 lg:gap-8">
            <article className="bg-white rounded-lg lg:rounded-2xl shadow-sm overflow-hidden">
              <div className="relative w-full aspect-[16/9] sm:aspect-[3/2] lg:aspect-[16/9]">
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt={t(`blog.titles.${post.title}`)}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </div>

              <div className="p-4 sm:p-6 lg:p-8">
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-500 mb-3">
                  <span>{t(`blog.dates.${post.date}`)}</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    {t(`blog.category.${post.category}`) || post.category}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight">
                  {t(`blog.titles.${post.title}`)}
                </h1>

                <div
                  className="prose prose-sm sm:prose lg:prose-lg prose-slate max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: t(`blog.contents.${post.title}`),
                  }}
                />

                <div className="flex items-center gap-3 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-200">
                  <span className="text-sm text-slate-600">
                    {t("blog.shareText")}
                  </span>
                  <div className="flex gap-2">
                    <a
                      href="https://facebook.com/"
                      aria-label="Share on Facebook"
                      className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                    >
                      f
                    </a>
                    <a
                      href="https://twitter.com/"
                      aria-label="Share on X (formerly Twitter)"
                      className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-gray-900 transition-colors"
                    >
                      x
                    </a>
                    <a
                      href="https://linkedin.com/"
                      aria-label="Share on LinkedIn"
                      className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                    >
                      in
                    </a>
                  </div>
                </div>
              </div>
            </article>

            <aside className="hidden lg:block space-y-4">
              <div className="bg-white rounded-xl shadow-sm p-4 top-50">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  {t("blog.otherBlogs")}
                </h3>
                <div className="space-y-4">
                  {relatedBlogs.map((blog) => (
                    <RelatedBlogCard key={blog.id} blog={blog} />
                  ))}
                </div>
              </div>
              <Link
                href="/blogs"
                className="block w-full text-center py-3 bg-gradient-to-r from-blue-500 to-indigo-400 text-white rounded-lg text-sm font-medium hover:shadow-md transition-shadow sticky top-[350px]"
              >
                {t("blog.backToBlogs")}
              </Link>
            </aside>
          </div>

          <div className="lg:hidden mt-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              {t("blog.otherBlogs")}
            </h3>
            <div className="flex gap-4 overflow-x-scroll scroll-smooth snap-x pb-4">
              {relatedBlogs.map((blog) => (
                <div key={blog.id} className="w-64 flex-shrink-0 snap-center">
                  <RelatedBlogCard blog={blog} />
                </div>
              ))}
            </div>

            <Link
              href="/blogs"
              className="block w-full mt-6 text-center py-3 bg-gradient-to-r from-blue-500 to-indigo-400 text-white rounded-lg text-sm font-medium hover:shadow-md transition-shadow"
            >
              {t("blog.backToBlogs")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}