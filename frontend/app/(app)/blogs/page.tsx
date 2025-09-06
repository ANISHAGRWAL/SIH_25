import Link from "next/link"
import Image from "next/image"

// Sample blog data - in a real app, this would come from a database or CMS
const blogs = [
  {
    id: "why-Talking-About-Mental-Health-Matters",
    title: "Why Talking About Mental Health Matters?",
    excerpt:
      "Mental health is as important as physical health, yet for years, it has been surrounded by silence, stigma, and misconceptions.",
    date: "March 15, 2024",
    image: "/Mental.png",
    category: "Mental Health",
  },
  {
    id: "digital-detox",
    title: "Digital Detox: How to Reset Your Mind",
    excerpt:
      "Discover proven methods to manage academic stress and maintain emotional well-being during challenging times.",
    date: "March 10, 2024",
    image: "/Detox.png",
    category: "Wellness",
  },
  {
    id: "simple-habit-to-boost-your-mind",
    title: "Simple Habits to Boost Your Mental Wellness Daily",
    excerpt:
      "Taking care of your mind doesn’t always mean big changes—it’s often the small, everyday habits that make the biggest difference. ",
    date: "March 5, 2024",
    image: "/peaceful-meditation.png",
    category: "Community",
  },
  {
    id: "sleep-secret-mental-health",
    title: "Sleep: The Secret Pillar of Mental Health",
    excerpt:
      "Sleep isn’t a luxury—it’s a foundation. Discover why quality rest is essential for emotional balance and mental clarity.",
    date: "March 20, 2024",
    image: "/Sleep.png",
    category: "Health",
  },
  {
    id: "journaling-for-clarity",
    title: "Journaling for Clarity: Turning Thoughts Into Healing Words",
    excerpt:
      "Journaling helps untangle your thoughts and create space for healing, growth, and emotional awareness.",
    date: "March 23, 2024",
    image: "/chatjournal.jpeg",
    category: "Expression",
  },
  {
    id: "creativity-mental-health-link",
    title: "The Hidden Link Between Creativity and Mental Health",
    excerpt:
      "Explore how creative activities like art and writing can relieve stress, boost mood, and strengthen resilience.",
    date: "March 26, 2024",
    image: "/Creativity.jpeg"
  },
  {
    id: "resilience-building",
    title: "Resilience Building: How to Bounce Back from Setbacks Stronger",
    excerpt:
      "Learn how setbacks can become stepping stones and discover daily habits that build emotional strength.",
    date: "April 2, 2024",
    image: "/Resilience.png",
    category: "Growth",
  },
  {
    id: "mental-health-and-connection",
    title: "When Mental Health Makes Connections Harder",
    excerpt:
      "Explore how anxiety and overthinking affect relationships—and how to reconnect gently and confidently.",
    date: "April 9, 2024",
    image: "/Connections.jpeg",
    category: "Anxiety",
  },
  {
    id: "silence-and-solitude",
    title: "Silence and Solitude: Why Doing Nothing is Sometimes Everything",
    excerpt:
      "In a world obsessed with busyness, discover how stillness and solitude can refresh, heal, and reset your mind.",
    date: "April 16, 2024",
    image: "/Silence.png",
    category: "Mindfulness",
  },
];


export default function BlogsPage() {
  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-400 text-white py-16 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Mental Health <span className="text-blue-100">Resources</span>
        </h1>
        <p className="text-lg text-blue-100 max-w-2xl mx-auto">
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
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-400 text-white rounded-full text-sm font-medium hover:shadow-lg transition-shadow"
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