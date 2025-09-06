import Link from "next/link"
import Image from "next/image"

// Sample blog data - in a real app, this would come from a database or CMS
const blogs = [
  {
    id: "mental-health-awareness",
    title: "Mental Health Awareness in Higher Education",
    excerpt:
      "Understanding the importance of mental health support systems in colleges and universities across the country.",
    date: "March 15, 2024",
    image: "/placeholder-lrnti.png",
    category: "Mental Health",
  },
  {
    id: "stress-management-techniques",
    title: "Effective Stress Management Techniques",
    excerpt:
      "Discover proven methods to manage academic stress and maintain emotional well-being during challenging times.",
    date: "March 10, 2024",
    image: "/placeholder-h4x3a.png",
    category: "Wellness",
  },
  {
    id: "peer-support-systems",
    title: "Building Strong Peer Support Systems",
    excerpt:
      "How peer-to-peer support can create lasting positive impacts on student mental health and academic success.",
    date: "March 5, 2024",
    image: "/placeholder-nc99u.png",
    category: "Community",
  },
  {
    id: "anxiety-coping-strategies",
    title: "Coping with Academic Anxiety",
    excerpt:
      "Practical strategies and tools to help students manage anxiety related to exams, presentations, and academic pressure.",
    date: "February 28, 2024",
    image: "/placeholder-7erqh.png",
    category: "Mental Health",
  },
  {
    id: "digital-wellness",
    title: "Digital Wellness for Students",
    excerpt: "Maintaining healthy relationships with technology while pursuing academic goals and personal growth.",
    date: "February 20, 2024",
    image: "/placeholder-mhtcn.png",
    category: "Wellness",
  },
  {
    id: "mindfulness-practices",
    title: "Mindfulness Practices for Daily Life",
    excerpt:
      "Simple mindfulness exercises that can be integrated into busy student schedules for better mental clarity.",
    date: "February 15, 2024",
    image: "/mindfulness-meditation.png",
    category: "Wellness",
  },
]

export default function BlogsPage() {
  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white py-16 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Mental Health <span className="text-yellow-300">Resources</span>
        </h1>
        <p className="text-lg text-purple-100 max-w-2xl mx-auto">
          Stay updated with the latest insights, research, and practical tips for mental health and well-being. Discover
          evidence-based approaches to support your journey.
        </p>
      </div>

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <article
              key={blog.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="aspect-video relative">
                <Image src={blog.image || "/placeholder.svg"} alt={blog.title} fill className="object-cover" />
              </div>
              <div className="p-6">
                <div className="text-sm text-slate-500 mb-2">{blog.date}</div>
                <h2 className="text-xl font-semibold text-slate-900 mb-3 line-clamp-2">{blog.title}</h2>
                <p className="text-slate-600 mb-4 line-clamp-3">{blog.excerpt}</p>
                <Link
                  href={`/blogs/${blog.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-400 to-sky-700 text-white rounded-full text-sm font-medium hover:shadow-lg transition-shadow"
                >
                  Read More
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
