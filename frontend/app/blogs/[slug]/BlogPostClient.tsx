"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "@/app/navbar/page";
import { blogPosts } from "@/data/blogPosts";
import { useTranslation, useLoadNamespace } from "@/components/I18nProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function BlogPostClient({ slug }: { slug: string }) {
  const { t } = useTranslation();
  useLoadNamespace("blog");

  const post = blogPosts[slug as keyof typeof blogPosts];
  if (!post) return null;

  const allOtherBlogs = Object.entries(blogPosts)
    .filter(([s]) => s !== slug)
    .map(([id, blog]) => ({
      id,
      title: blog.title,
      image: blog.image,
      date: blog.date,
    }));
  const relatedBlogs = allOtherBlogs
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-12 sm:pt-20 lg:pt-18">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2">
          <div className="flex justify-end mb-4">
            <LanguageSwitcher />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-4 lg:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-3 lg:gap-6">
            <article className="bg-white rounded-lg lg:rounded-2xl shadow-sm overflow-hidden">
              <div className="aspect-[16/9] sm:aspect-video relative">
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-3 sm:p-6 lg:p-8">
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-500 mb-3 sm:mb-4">
                  <span>{t(`blog.dates.${post.date}`)}</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                    {t(`blog.category.${post.category}`) || post.category}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight">
                  {t(`blog.titles.${post.title}`)}
                </h1>

                <div
                  className="prose prose-sm sm:prose lg:prose-lg prose-slate max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: t(`blog.contents.${post.title}`),
                  }}
                />

                {/* Share buttons */}
                <div className="flex items-center gap-3 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-200">
                  <span className="text-sm text-slate-600">
                    {t("blog.shareText")}
                  </span>
                  <div className="flex gap-2">
                    <a
                      href="https://facebook.com/"
                      className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center"
                    >
                      f
                    </a>
                    <a
                      href="https://twitter.com/"
                      className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center"
                    >
                      x
                    </a>
                    <a
                      href="https://linkedin.com/"
                      className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center"
                    >
                      in
                    </a>
                  </div>
                </div>
              </div>
            </article>

            {/* Sidebar for related blogs */}
            <aside className="hidden lg:block space-y-4">
              <div className="bg-white rounded-xl shadow-sm p-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  {t("blog.otherBlogs")}
                </h3>
                <div className="space-y-3">
                  {relatedBlogs.map((blog) => (
                    <Link
                      key={blog.id}
                      href={`/blogs/${blog.id}`}
                      className="block bg-white rounded-lg shadow-md border hover:shadow-lg transition"
                    >
                      <div className="w-full h-32 relative">
                        <Image
                          src={blog.image || "/placeholder.svg"}
                          alt={blog.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-gray-500 mb-1">
                          {t(`blog.titles.${blog.date}`)}
                        </p>
                        <h4 className="text-sm font-semibold text-slate-800 line-clamp-2">
                          {t(`blog.titles.${blog.title}`)}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              <Link
                href="/blogs"
                className="block w-full text-center py-2 bg-gradient-to-r from-blue-500 to-indigo-400 text-white rounded-lg text-sm font-medium hover:shadow-md"
              >
                {t("blog.backToBlogs")}
              </Link>
            </aside>
          </div>

          {/* Mobile Related Blogs */}
          <div className="lg:hidden mt-4 bg-white rounded-lg shadow-sm p-3">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">
              {t("blog.otherBlogs")}
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {relatedBlogs.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blogs/${blog.id}`}
                  className="flex gap-3 bg-white rounded-lg shadow-md border hover:shadow-lg transition p-2"
                >
                  <div className="w-20 h-16 relative flex-shrink-0">
                    <Image
                      src={blog.image || "/placeholder.svg"}
                      alt={blog.title}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-1">{blog.date}</p>
                    <h4 className="text-sm font-semibold text-slate-800 line-clamp-2">
                      {/* {t("blog.titles." + blog.title)} */}
                      {t(`blog.titles.${blog.title}`)}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>

            <Link
              href="/blogs"
              className="block w-full mt-4 text-center py-2 bg-gradient-to-r from-blue-500 to-indigo-400 text-white rounded-lg text-sm font-medium hover:shadow-md"
            >
              {t("blog.backToBlogs")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
