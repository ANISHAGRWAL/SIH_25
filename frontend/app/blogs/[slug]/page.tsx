"use client"

import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { useTranslation } from "@/components/I18nProvider"
import Navbar from "@/app/navbar/page"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import { blogPosts } from "@/data/blogPosts"
import { useLoadNamespace } from "@/components/I18nProvider"

export default function BlogPost({ params }: { params: { slug: string } }) {
  const { t } = useTranslation()
  const post = blogPosts[params.slug as keyof typeof blogPosts]
  useLoadNamespace("blog") 

  if (!post) {
    notFound()
  }

  // Get all other blogs excluding the current one
  const allOtherBlogs = Object.entries(blogPosts)
    .filter(([slug]) => slug !== params.slug)
    .map(([slug, blog]) => ({
      id: slug,
      title: blog.title,
      image: blog.image,
      date: blog.date,
    }))

  // Shuffle the blogs randomly and take only 3
  const relatedBlogs = allOtherBlogs.sort(() => 0.5 - Math.random()).slice(0, 3)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Add top padding/margin to account for fixed navbar */}
      <div className="pt-12 sm:pt-20 lg:pt-18">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2">
          <div className="flex justify-end mb-4">
            <LanguageSwitcher />
          </div>
        </div>

        {/* Reduced container padding significantly for mobile */}
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-4 lg:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-3 lg:gap-6">
            {/* Blog Article */}
            <article className="bg-white rounded-lg lg:rounded-2xl shadow-sm overflow-hidden">
              {/* Hero Image - Reduced aspect ratio on mobile */}
              <div className="aspect-[16/9] sm:aspect-video relative">
                <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
              </div>

              {/* Content - Significantly reduced padding on mobile */}
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
                  className="prose prose-sm sm:prose lg:prose-lg prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-700 prose-li:text-slate-700 prose-p:mb-3 prose-headings:mb-3 prose-headings:mt-4"
                  dangerouslySetInnerHTML={{ __html: t(`blog.contents.${post.title}`) }}
                />

                {/* Social Share Buttons - Reduced spacing */}
                <div className="flex items-center gap-3 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-200">
                  <span className="text-sm text-slate-600">{t("blog.shareText")}</span>
                  <div className="flex gap-2">
                    <a
                      href="https://www.facebook.com/"
                      className="w-8 h-8 bg-blue-500 text-white rounded-full text-sm flex items-center justify-center hover:bg-blue-600 transition-colors"
                    >
                      f
                    </a>
                    <a
                      href="https://twitter.com/"
                      className="w-8 h-8 bg-gray-900 text-white rounded-full text-sm flex items-center justify-center hover:bg-gray-800 transition-colors"
                    >
                      x
                    </a>
                    <a
                      href="https://www.linkedin.com/"
                      className="w-8 h-8 bg-blue-600 text-white rounded-full text-sm flex items-center justify-center hover:bg-blue-700 transition-colors"
                    >
                      in
                    </a>
                  </div>
                </div>
              </div>
            </article>

            {/* Sidebar: Other Blogs - Hidden on mobile, compact on desktop */}
            <aside className="hidden lg:block space-y-4">
              {/* Other Blogs Section */}
              <div className="bg-white rounded-xl shadow-sm p-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">{t("blog.otherBlogs")}</h3>
                <div className="space-y-3">
                  {relatedBlogs.map((blog) => (
                    <Link
                      key={blog.id}
                      href={`/blogs/${blog.id}`}
                      className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border hover:border-blue-400"
                    >
                      <div className="w-full h-32 relative">
                        <Image
                          src={blog.image || "/placeholder.svg"}
                          alt={blog.title}
                          fill
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-gray-500 mb-1">{blog.date}</p>
                        <h4 className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2">{blog.title}</h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Back to All Blogs Button */}
              <Link
                href="/blogs"
                className="block w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-400 text-white rounded-lg text-center font-medium text-sm hover:shadow-lg transition-shadow"
              >
                {t("blog.backToBlogs")}
              </Link>
            </aside>
          </div>

          {/* Mobile-only related blogs section */}
          <div className="lg:hidden mt-4 bg-white rounded-lg shadow-sm p-3">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">{t("blog.otherBlogs")}</h3>
            <div className="grid grid-cols-1 gap-3">
              {relatedBlogs.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blogs/${blog.id}`}
                  className="flex gap-3 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border hover:border-blue-400 p-2"
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
                    <h4 className="text-sm font-semibold text-slate-800 leading-tight line-clamp-2">{blog.title}</h4>
                  </div>
                </Link>
              ))}
            </div>

            {/* Mobile Back Button */}
            <Link
              href="/blogs"
              className="block w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-400 text-white rounded-lg text-center font-medium text-sm hover:shadow-lg transition-shadow mt-4"
            >
              {t("blog.backToBlogs")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
