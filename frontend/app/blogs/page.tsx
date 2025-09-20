"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

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
    category: "Self Care",
  },
  {
    id: "creativity-mental-health-link",
    title: "The Hidden Link Between Creativity and Mental Health",
    excerpt:
      "Explore how creative activities like art and writing can relieve stress, boost mood, and strengthen resilience.",
    date: "March 26, 2024",
    image: "/Creativity.jpeg",
    category: "Expression",

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
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
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
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled
        ? 'bg-white/95 backdrop-blur-lg shadow-xl border-b border-gray-200/50'
        : 'bg-white/80 backdrop-blur-sm border-b border-gray-200'
        }`}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className={`flex items-center gap-2 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <Image
                className="mx-auto pb-2"
                src="/logoiconfull.png" // Path from the 'public' folder
                alt="Sahayog Admin Logo"
                width={142} // Corresponds to w-8
                height={142} // Corresponds to h-8
              />
            </Link>
            <div className="hidden md:flex items-center gap-8">
              {[
                { name: "about", href: "/#about" },
                { name: "services", href: "/#services" },
                { name: "contact", href: "/#contact" },
                { name: "blogs", href: "/blogs", active: true }
              ].map((section, index) => (
                <Link
                  key={section.name}
                  href={section.href}
                  className={`font-medium transition-all duration-300 hover:text-slate-900 relative group capitalize ${section.active ? 'text-blue-600' : 'text-slate-600'
                    } ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {section.name}
                  <span className={`absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-400 transition-all duration-300 group-hover:w-full ${section.active ? 'w-full' : ''
                    }`} />
                </Link>
              ))}
              <Link href="/signup">
                <Button className={`rounded-full bg-gradient-to-r from-blue-500 to-indigo-400 hover:from-blue-600 hover:to-indigo-500 transition-all duration-300 hover:scale-105 hover:shadow-lg transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
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

      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-400 text-white py-16 px-6 text-center mt-16 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="absolute top-10 right-10 w-32 h-32 rounded-full border border-white/20"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 rounded-full border border-white/20"></div>
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
            Mental Health <span className="text-blue-100">Resources</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Stay updated with the latest insights, research, and practical tips for mental health and well-being. Discover
            evidence-based approaches to support your journey.
          </p>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <article
              key={blog.id}
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group hover:-translate-y-3 hover:scale-105"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="aspect-video relative overflow-hidden">
                <Image
                  src={blog.image || "/placeholder.svg"}
                  alt={blog.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                {blog.category && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-slate-700 transition-transform duration-300 group-hover:scale-105">
                    {blog.category}
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="text-sm text-slate-500 mb-2 group-hover:text-slate-600 transition-colors duration-300">{blog.date}</div>
                <h2 className="text-xl font-semibold text-slate-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">{blog.title}</h2>
                <p className="text-slate-600 mb-4 line-clamp-3 group-hover:text-slate-700 transition-colors duration-300">{blog.excerpt}</p>
                <Link
                  href={`/blogs/${blog.id}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-400 text-white rounded-full text-sm font-medium hover:shadow-xl transition-all duration-300 hover:scale-105 transform group/button"
                >
                  Read More
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover/button:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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