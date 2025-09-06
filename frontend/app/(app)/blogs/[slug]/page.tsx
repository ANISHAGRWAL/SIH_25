import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"

// Sample blog data - in a real app, this would come from a database
const blogPosts = {
  "mental-health-awareness": {
    title: "Mental Health Awareness in Higher Education",
    author: "Dr. Sarah Johnson",
    date: "March 15, 2024",
    category: "Mental Health",
    image: "/placeholder-dn6it.png",
    content: `
      <p>Mental health awareness in higher education has become increasingly critical as students face unprecedented challenges in their academic and personal lives. The transition to college life, academic pressures, and social adjustments can significantly impact student well-being.</p>
      
      <h2>The Current State of Student Mental Health</h2>
      <p>Recent studies indicate that nearly 60% of college students report experiencing overwhelming anxiety, while 40% report feeling so depressed that it's difficult to function. These statistics highlight the urgent need for comprehensive mental health support systems within educational institutions.</p>
      
      <h2>Key Challenges Students Face</h2>
      <p>Students today encounter various stressors that can impact their mental health:</p>
      <ul>
        <li>Academic pressure and competition</li>
        <li>Financial stress and student debt</li>
        <li>Social isolation and relationship challenges</li>
        <li>Career uncertainty and future planning anxiety</li>
        <li>Technology overload and social media pressure</li>
      </ul>
      
      <h2>Building Effective Support Systems</h2>
      <p>Educational institutions must prioritize creating comprehensive support systems that address both preventive care and crisis intervention. This includes counseling services, peer support programs, and mental health education initiatives.</p>
      
      <h2>The Role of Technology</h2>
      <p>Digital platforms and apps can play a crucial role in providing accessible mental health resources. From AI-powered chatbots to online therapy sessions, technology can bridge gaps in traditional mental health services.</p>
      
      <p>By fostering an environment of understanding and support, we can help students not only succeed academically but also develop the resilience and coping skills necessary for lifelong well-being.</p>
    `,
  },
  "stress-management-techniques": {
    title: "Effective Stress Management Techniques",
    author: "Dr. Michael Chen",
    date: "March 10, 2024",
    category: "Wellness",
    image: "/peaceful-meditation.png",
    content: `
      <p>Stress management is a crucial skill for students navigating the demands of higher education. Learning effective techniques can significantly improve both academic performance and overall quality of life.</p>
      
      <h2>Understanding Stress Response</h2>
      <p>The body's stress response is a natural mechanism designed to help us cope with challenges. However, chronic stress can have detrimental effects on both physical and mental health, making stress management essential.</p>
      
      <h2>Evidence-Based Techniques</h2>
      <p>Research has identified several highly effective stress management strategies:</p>
      
      <h3>1. Mindfulness and Meditation</h3>
      <p>Regular mindfulness practice can reduce cortisol levels and improve emotional regulation. Even 10 minutes of daily meditation can make a significant difference.</p>
      
      <h3>2. Physical Exercise</h3>
      <p>Regular physical activity releases endorphins and helps process stress hormones. Activities like walking, yoga, or swimming can be particularly beneficial.</p>
      
      <h3>3. Time Management</h3>
      <p>Effective time management reduces the feeling of being overwhelmed. Techniques like the Pomodoro Technique or time-blocking can help students stay organized.</p>
      
      <h2>Creating a Personal Stress Management Plan</h2>
      <p>The most effective approach combines multiple techniques tailored to individual preferences and lifestyle. Students should experiment with different methods to find what works best for them.</p>
    `,
  },
  "peer-support-systems": {
    title: "Building Strong Peer Support Systems",
    author: "Dr. Emily Rodriguez",
    date: "March 5, 2024",
    category: "Community",
    image: "/placeholder-h76jd.png",
    content: `
      <p>Peer support systems play a vital role in student mental health and academic success. These networks provide emotional support, practical assistance, and a sense of belonging that can significantly impact student well-being.</p>
      
      <h2>The Power of Peer Connection</h2>
      <p>Research consistently shows that students with strong peer support networks experience lower levels of stress, anxiety, and depression. These connections provide a buffer against academic and personal challenges.</p>
      
      <h2>Types of Peer Support</h2>
      <p>Effective peer support can take many forms:</p>
      <ul>
        <li>Study groups and academic collaboration</li>
        <li>Emotional support and active listening</li>
        <li>Social activities and community building</li>
        <li>Mentorship programs</li>
        <li>Crisis support and intervention</li>
      </ul>
      
      <h2>Building Your Support Network</h2>
      <p>Creating meaningful peer connections requires intentional effort and authentic engagement. Students can build their networks through various channels including clubs, organizations, and informal social activities.</p>
      
      <h2>Training Peer Supporters</h2>
      <p>Effective peer support programs often include training components that teach active listening, crisis recognition, and appropriate referral procedures. This ensures that peer supporters can provide meaningful help while maintaining appropriate boundaries.</p>
    `,
  },
}

const relatedBlogs = [
  {
    id: "anxiety-coping-strategies",
    title: "Coping with Academic Anxiety",
    image: "/placeholder-bnao6.png",
  },
  {
    id: "digital-wellness",
    title: "Digital Wellness for Students",
    image: "/placeholder-4dxja.png",
  },
  {
    id: "mindfulness-practices",
    title: "Mindfulness Practices for Daily Life",
    image: "/mindful-meditation.png",
  },
]

export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({
    slug,
  }))
}


export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug as keyof typeof blogPosts]

  if (!post) {
    notFound()
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="grid lg:grid-cols-[1fr_300px] gap-8">
        {/* Main Content */}
        <article className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Hero Image */}
          <div className="aspect-video relative">
            <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
              <span>Written by {post.author}</span>
              <span>•</span>
              <span>{post.date}</span>
              <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-xs">{post.category}</span>
            </div>

            <h1 className="text-3xl font-bold text-slate-900 mb-6">{post.title}</h1>

            <div
              className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-700 prose-li:text-slate-700"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Social Share */}
            <div className="flex items-center gap-4 mt-8 pt-8 border-t border-slate-200">
              <span className="text-sm text-slate-600">Share this article:</span>
              <div className="flex gap-2">
                <button className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">
                  f
                </button>
                <button className="w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center text-sm">
                  t
                </button>
                <button className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">
                  in
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Other Blogs */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Other Blogs</h3>
            <div className="space-y-4">
              {relatedBlogs.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blogs/${blog.id}`}
                  className="flex gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <Image
                    src={blog.image || "/placeholder.svg"}
                    alt={blog.title}
                    width={60}
                    height={60}
                    className="rounded-lg object-cover flex-shrink-0"
                  />
                  <div>
                    <h4 className="text-sm font-medium text-slate-900 line-clamp-2">{blog.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Back to Blogs */}
          <Link
            href="/blogs"
            className="block w-full px-4 py-3 bg-gradient-to-r from-teal-400 to-sky-700 text-white rounded-full text-center font-medium hover:shadow-lg transition-shadow"
          >
            ← Back to All Blogs
          </Link>
        </aside>
      </div>
    </div>
  )
}
