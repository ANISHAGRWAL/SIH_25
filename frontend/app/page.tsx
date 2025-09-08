"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

// Blog data - same as in your blogs page
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
      "Taking care of your mind doesn't always mean big changes—it's often the small, everyday habits that make the biggest difference. ",
    date: "March 5, 2024",
    image: "/peaceful-meditation.png",
    category: "Community",
  },
  {
    id: "sleep-secret-mental-health",
    title: "Sleep: The Secret Pillar of Mental Health",
    excerpt:
      "Sleep isn't a luxury—it's a foundation. Discover why quality rest is essential for emotional balance and mental clarity.",
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

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)

  // Get the 3 most recent blogs for homepage display
  const featuredBlogs = blogs.slice(0, 3)

  useEffect(() => {
    setIsLoaded(true)
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      
      // Active section detection
      const sections = ["about", "services", "contact", "blogs"]
      const current = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })
      setActiveSection(current || "")
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("mousemove", handleMouseMove)
    
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen scroll-smooth bg-blue-50 font-sans text-slate-800 overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-500/10 to-indigo-400/10 rounded-full blur-3xl transition-all duration-1000 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
            left: '10%',
            top: '20%'
          }}
        />
        <div 
          className="absolute w-80 h-80 bg-gradient-to-r from-indigo-400/10 to-purple-500/10 rounded-full blur-3xl transition-all duration-1000 ease-out"
          style={{
            transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * -0.015}px)`,
            right: '10%',
            bottom: '20%'
          }}
        />
      </div>

      {/* Enhanced Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-xl border-b border-gray-200/50' 
          : 'bg-white/80 backdrop-blur-sm border-b border-gray-200'
      }`}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-400 flex items-center justify-center transform hover:scale-110 transition-all duration-300 hover:rotate-12">
                <svg
                  className="w-5 h-5 text-white transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold text-slate-900 hover:text-blue-600 transition-colors duration-300">MindMates</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              {["about", "services", "contact", "blogs"].map((section, index) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`font-medium transition-all duration-300 hover:text-slate-900 relative group capitalize ${
                    activeSection === section ? 'text-blue-600' : 'text-slate-600'
                  } ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {section}
                  <span className={`absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-400 transition-all duration-300 group-hover:w-full ${
                    activeSection === section ? 'w-full' : ''
                  }`} />
                </button>
              ))}
              <Link href="/signup">
                <Button className={`rounded-full bg-gradient-to-r from-blue-500 to-indigo-400 hover:from-blue-600 hover:to-indigo-500 transition-all duration-300 hover:scale-105 hover:shadow-lg transform ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                }`} style={{ transitionDelay: '400ms' }}>
                  Get Started
                </Button>
              </Link>
            </div>
            <div className="md:hidden">
              <Button variant="ghost" size="sm" className="hover:bg-blue-50 transition-colors duration-200">
                <span className="sr-only">Menu</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <section className="pt-20 pb-16 bg-blue-50 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-blue-200/50 mb-6 hover:bg-white/80 transition-all duration-300">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium text-slate-700">Available 24/7 for Support</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 text-balance">
                Your Mental Health,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-400 animate-pulse">
                  Our Priority
                </span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 text-pretty leading-relaxed">
                A comprehensive digital platform providing AI-guided support, stress assessments, and confidential
                counseling for students in higher education.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-400 hover:from-blue-600 hover:to-indigo-500 transition-all duration-300 hover:scale-105 hover:shadow-xl transform group"
                  >
                    Start Your Journey
                    <svg className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="rounded-full bg-transparent border-slate-300 hover:bg-white hover:border-blue-300 transition-all duration-300 hover:scale-105 hover:shadow-lg transform group">
                  Learn More
                  <svg className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </Button>
              </div>
            </div>
            <div className={`relative transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-200 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-400/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Image
                  src="/woman-in-nature-yoga.png"
                  alt="Mental wellness illustration"
                  width={400}
                  height={300}
                  className="w-full h-auto rounded-2xl transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <span className="text-white text-xl">✨</span>
              </div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <span className="text-white text-sm">💙</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced About Section */}
      <section id="about" className="py-16 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">About MindMates</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto text-pretty">
              Breaking barriers to mental health support with innovative technology, cultural sensitivity, and
              stigma-free care for students.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "🤖", title: "AI-Guided Support", description: "Interactive chatbot offering personalized coping strategies and professional referrals when needed." },
              { icon: "🔒", title: "Complete Privacy", description: "Confidential booking system and encrypted journaling ensure your privacy is always protected." },
              { icon: "🌍", title: "Cultural Context", description: "Regional language support and culturally sensitive resources tailored for diverse communities." }
            ].map((item, index) => (
              <Card key={index} className="text-center rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 group hover:-translate-y-2 hover:scale-105">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                    <span className="text-white text-2xl">{item.icon}</span>
                  </div>
                  <CardTitle className="group-hover:text-blue-600 transition-colors duration-300">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="group-hover:text-slate-700 transition-colors duration-300">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Services Section */}
      <section id="services" className="py-16 bg-blue-50 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Services</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto text-pretty">
              Comprehensive mental health tools and resources designed specifically for students.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: "📊", title: "Stress Assessments", description: "Standardized tools including PHQ-9, GAD-7, and PSS for accurate mental health screening and monitoring." },
              { icon: "📱", title: "Daily Mind Log", description: "AI-powered journaling with weekly reports and insights to track your mental wellness journey." },
              { icon: "🎯", title: "Stress Detection", description: "Advanced facial and voice recognition technology for real-time stress level monitoring." },
              { icon: "🧘", title: "Wellness Content", description: "Daily curated content including yoga sessions, soothing music, and stress-relief activities." },
              { icon: "👥", title: "Peer Support", description: "Anonymous peer support forum with trained student volunteers for community-based healing." },
              { icon: "📅", title: "Professional Booking", description: "Confidential appointment booking with on-campus counselors and mental health professionals." }
            ].map((service, index) => (
              <Card key={index} className="rounded-3xl hover:shadow-2xl transition-all duration-500 border border-gray-200 group hover:-translate-y-3 hover:scale-105 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 group-hover:text-blue-600 transition-colors duration-300">
                    <span className="text-2xl group-hover:scale-125 transition-transform duration-300">{service.icon}</span>
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="group-hover:text-slate-700 transition-colors duration-300">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Contact Section */}
      <section id="contact" className="py-16 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Get In Touch</h2>
              <p className="text-xl text-slate-600 mb-8 text-pretty">
                Have questions about our platform? Need support? We're here to help you on your mental wellness journey.
              </p>
              <div className="space-y-4">
                {[
                  { icon: "📧", text: "support@mindmates.edu" },
                  { icon: "📞", text: "24/7 Crisis Helpline: 1-800-MINDMATE" },
                  { icon: "🏫", text: "Available at 500+ Educational Institutions" }
                ].map((contact, index) => (
                  <div key={index} className="flex items-center gap-3 group hover:translate-x-2 transition-transform duration-300">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white">{contact.icon}</span>
                    </div>
                    <span className="text-slate-600 group-hover:text-slate-900 transition-colors duration-300">{contact.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <Card className="p-6 rounded-3xl shadow-2xl border border-gray-200 hover:shadow-3xl transition-all duration-500 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
                <CardDescription>We'll get back to you within 24 hours</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="First Name" className="transition-all duration-200 focus:scale-105 focus:shadow-md" />
                  <Input placeholder="Last Name" className="transition-all duration-200 focus:scale-105 focus:shadow-md" />
                </div>
                <Input placeholder="Email Address" type="email" className="transition-all duration-200 focus:scale-105 focus:shadow-md" />
                <Input placeholder="Institution Name" className="transition-all duration-200 focus:scale-105 focus:shadow-md" />
                <Textarea placeholder="Your Message" rows={4} className="transition-all duration-200 focus:scale-105 focus:shadow-md" />
                <Button className="w-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-400 hover:from-blue-600 hover:to-indigo-500 transition-all duration-300 hover:scale-105 hover:shadow-lg transform">
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Blogs Section with Real Data */}
      <section id="blogs" className="py-16 bg-blue-50 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Latest from Our Blog</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto text-pretty">
              Expert insights, wellness tips, and stories from our community to support your mental health journey.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {featuredBlogs.map((blog, index) => (
              <Card key={blog.id} className="rounded-3xl hover:shadow-2xl transition-all duration-500 border border-gray-200 group hover:-translate-y-3 cursor-pointer bg-white/80 backdrop-blur-sm">
                <Link href={`/blogs/${blog.id}`}>
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-100 rounded-t-3xl relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                    <Image 
                      src={blog.image} 
                      alt={blog.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    {blog.category && (
                      <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-slate-700">
                        {blog.category}
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <div className="text-sm text-slate-500 mb-2">{blog.date}</div>
                    <CardTitle className="text-lg group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                      {blog.title}
                    </CardTitle>
                    <CardDescription className="group-hover:text-slate-700 transition-colors duration-300 line-clamp-3">
                      {blog.excerpt}
                    </CardDescription>
                  </CardHeader>
                </Link>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Link href="/blogs">
              <Button variant="outline" size="lg" className="rounded-full bg-white/80 border-slate-300 hover:bg-white hover:border-blue-300 transition-all duration-300 hover:scale-105 hover:shadow-lg transform backdrop-blur-sm group">
                View All Articles
                <svg className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-slate-900 text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4 group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-400 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <span className="text-xl font-bold">MindMates</span>
              </div>
              <p className="text-slate-400 text-pretty">
                Empowering students with accessible, stigma-free mental health support through innovative technology.
              </p>
            </div>
            {[
              { title: "Platform", links: [
                { name: "About", action: () => scrollToSection("about") },
                { name: "Services", action: () => scrollToSection("services") },
                { name: "Get Started", href: "/signup" },
                { name: "Login", href: "/login" }
              ]},
              { title: "Resources", links: [
                { name: "Blog", href: "/blogs" },
                { name: "Help Center", href: "#" },
                { name: "Privacy Policy", href: "#" },
                { name: "Terms of Service", href: "#" }
              ]},
              { title: "Emergency Support", links: [
                { name: "Crisis Helpline: 988", href: "#" },
                { name: "Campus Security: 911", href: "#" },
                { name: "24/7 Chat Support", href: "#" }
              ]}
            ].map((section, index) => (
              <div key={index}>
                <h4 className="font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-2 text-slate-400">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      {link.href ? (
                        <Link href={link.href} className="hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                          {link.name}
                        </Link>
                      ) : (
                        <button onClick={link.action} className="hover:text-white transition-all duration-300 hover:translate-x-1 inline-block text-left">
                          {link.name}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 MindMates. All rights reserved. Developed with ❤️ for student mental health.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}