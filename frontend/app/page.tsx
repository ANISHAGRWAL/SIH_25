"use client"

import Image from 'next/image';
import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
// Import the Formspree hook and component
import { useForm, ValidationError } from '@formspree/react';


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
    id: "journaling-for-clarity",
    title: "Journaling for Clarity: Turning Thoughts Into Healing Words",
    excerpt:
      "Journaling helps untangle your thoughts and create space for healing, growth, and emotional awareness.",
    date: "March 23, 2024",
    image: "/chatjournal.jpeg",
    category: "Expression",
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

// Team data
const teamMembers = [
  {
    name: "Anish Agarwal",
    // role: "Lead Developer",
    github: "https://github.com/anishagrwal",
    linkedin: "https://linkedin.com/in/anish-agarwal-0a6a32257",
    image: "/team/anish.jpeg", // You'll need to add team member images
    // specialty: "Full-Stack Development"
  },
  {
    name: "Raj De Modak",
    // role: "Backend Engineer",
    github: "https://github.com/rajdemodak01",
    linkedin: "https://www.linkedin.com/in/rajdemodak01/",
    image: "/team/raj.jpg",
    // specialty: "System Architecture"
  },
  {
    name: "Amar Pal",
    // role: "Frontend Developer",
    github: "https://github.com/ITSAMARHERE",
    linkedin: "https://www.linkedin.com/in/amar-pal-a945ba250/",
    image: "/team/amar.jpg",
    // specialty: "UI/UX Design"
  },
  {
    name: "Aryan Sinha",
    // role: "AI/ML Engineer",
    github: "",
    linkedin: "https://www.linkedin.com/in/aryan-kr-sinha-81412a271/",
    image: "/team/aryan.jpeg",
    // specialty: "Machine Learning"
  },
  {
    name: "Shashank Shekhar",
    role: "DevOps Engineer",
    github: "https://github.com/shashankkk05",
    linkedin: "https://www.linkedin.com/in/shashank-s-1a7469251/",
    image: "/team/shashank.jpg",
    specialty: "Cloud Infrastructure"
  },
  {
    name: "Ananya Mishra",
    // role: "Product Manager",
    github: "https://github.com/ananyamishra233",
    linkedin: "https://www.linkedin.com/in/ananya-mishra-41b431248/",
    image: "/team/ananya.jpg",
    // specialty: "Product Strategy"
  }
];


// New ContactForm component using Formspree hook
function ContactForm() {
  // Use the formspree hook with your unique form ID
  const [state, handleSubmit] = useForm("mqadwjzw");


  // If the form submission is successful, show a success message
  if (state.succeeded) {
    return <div className="text-center p-8 text-xl text-green-700 font-semibold rounded-3xl bg-green-50 shadow-inner">
      Thanks! Your message has been sent successfully. We'll be in touch!
    </div>;
  }


  return (
    <Card className="p-6 rounded-3xl shadow-2xl border border-gray-200 hover:shadow-3xl transition-all duration-500 bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Send us a message</CardTitle>
        <CardDescription>We'll get back to you within 24 hours</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Wrap your inputs in a form and attach the onSubmit handler */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Add 'name' attribute to each input field */}
            <Input placeholder="First Name" name="first-name" className="transition-all duration-200 focus:scale-105 focus:shadow-md" />
            <Input placeholder="Last Name" name="last-name" className="transition-all duration-200 focus:scale-105 focus:shadow-md" />
          </div>
          <Input placeholder="Email Address" type="email" name="email" className="transition-all duration-200 focus:scale-105 focus:shadow-md" />
          {/* Add validation error messages for specific fields */}
          <ValidationError
            prefix="Email"
            field="email"
            errors={state.errors}
            className="text-red-500 text-sm"
          />
          <Input placeholder="Institution Name" name="institution" className="transition-all duration-200 focus:scale-105 focus:shadow-md" />
          <Textarea placeholder="Your Message" name="message" rows={4} className="transition-all duration-200 focus:scale-105 focus:shadow-md" />
          <ValidationError
            prefix="Message"
            field="message"
            errors={state.errors}
            className="text-red-500 text-sm"
          />
          <Button
            type="submit"
            disabled={state.submitting}
            className="w-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-400 hover:from-blue-600 hover:to-indigo-500 transition-all duration-300 hover:scale-105 hover:shadow-lg transform"
          >
            {state.submitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// Team Section Component
function TeamSection() {
  return (
    <section id="team" className="py-16 bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-96 h-96 bg-gradient-to-r from-blue-500/5 to-indigo-400/5 rounded-full blur-3xl -top-20 -left-20 animate-pulse"></div>
        <div className="absolute w-80 h-80 bg-gradient-to-r from-indigo-400/5 to-purple-500/5 rounded-full blur-3xl -bottom-20 -right-20 animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-blue-200/50 mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-slate-700">Meet Our Team</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            The Minds Behind{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-400">
              Campus Care
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto text-pretty">
            A passionate team of developers, designers, and mental health advocates working together to make wellness accessible for every student.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-10xl mx-auto">
          {teamMembers.map((member, index) => (
            <div key={index} className="group relative">
              {/* Single card container with no gaps */}
              <div className="rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 backdrop-blur-sm transform hover:-translate-y-2 hover:ring-2 hover:ring-blue-500/50 overflow-hidden bg-white">

                {/* Image Container - no separate rounding, inherits from parent */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Social Links - appear on hover at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center gap-3 opacity-0 transform translate-y-full group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name}'s LinkedIn Profile`}
                      className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-sm hover:bg-blue-600 hover:scale-110 transition-all duration-300 shadow-lg"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name}'s GitHub Profile`}
                      className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-sm hover:bg-gray-800 hover:scale-110 transition-all duration-300 shadow-lg"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Title directly attached to image - no padding/gap */}
                <div className="px-4 py-3 text-center">
                  <h3 className="text-lg font-bold text-slate-800 relative inline-block">
                    {member.name}
                    {/* Underline effect */}
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


// Update the main HomePage component to use the new ContactForm component
export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)


  // Get the 3 most recent blogs for homepage display
  const featuredBlogs = blogs.slice(0, 3)


  useEffect(() => {
    setIsLoaded(true)


    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)


      // Active section detection
      const sections = ["about", "services", "team", "contact", "blogs"]
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
    // Close mobile menu after navigation
    setIsMobileMenuOpen(false)
  }


  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
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
            <div className={`flex items-center gap-2 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <Image
                className="mx-auto pb-2"
                src="/logoiconfull.png" // Path from the 'public' folder
                alt="Sahayog Admin Logo"
                width={122} // Corresponds to w-8
                height={122} // Corresponds to h-8
              />
            </div>


            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {["about", "services", "team", "contact", "blogs"].map((section, index) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`font-medium transition-all duration-300 hover:text-slate-900 relative group capitalize ${activeSection === section ? 'text-blue-600' : 'text-slate-600'
                    } ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {section}
                  <span className={`absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-400 transition-all duration-300 group-hover:w-full ${activeSection === section ? 'w-full' : ''
                    }`} />
                </button>
              ))}
              <Link href="/login">
                <Button className={`rounded-full bg-gradient-to-r from-blue-500 to-indigo-400 hover:from-blue-600 hover:to-indigo-500 transition-all duration-300 hover:scale-105 hover:shadow-lg transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                  }`} style={{ transitionDelay: '500ms' }}>
                  Get Started
                </Button>
              </Link>
            </div>


            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileMenu}
                className="hover:bg-blue-50 transition-colors duration-200 p-2"
              >
                <span className="sr-only">Menu</span>
                <div className="relative w-6 h-6">
                  <span className={`absolute left-0 top-0 w-6 h-0.5 bg-slate-700 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`}></span>
                  <span className={`absolute left-0 top-2.5 w-6 h-0.5 bg-slate-700 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`absolute left-0 top-5 w-6 h-0.5 bg-slate-700 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
                </div>
              </Button>
            </div>
          </div>


          {/* Mobile Menu */}
          <div
            className={`fixed inset-x-0 top-[60px] md:hidden transform transition-transform duration-500 ease-in-out ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}
          >
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 p-6 space-y-4">
              {["about", "services", "team", "contact", "blogs"].map((section, index) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`w-full text-left py-3 px-4 rounded-xl font-medium transition-all duration-300 hover:bg-blue-50 hover:text-blue-600 capitalize ${activeSection === section ? 'text-blue-600 bg-blue-50' : 'text-slate-600'
                    }`}
                >
                  {section}
                </button>
              ))}
              <div className="pt-4 border-t border-gray-200">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-400 hover:from-blue-600 hover:to-indigo-500 transition-all duration-300 hover:scale-105 hover:shadow-lg transform">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>


      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}


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
                <Link href="/login">
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
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">About Campus Care</h2>
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

      {/* Team Section */}
      <TeamSection />

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
                  { icon: "📧", text: "campuscare.team@gmail.com" },
                  { icon: "📞", text: "24/7 Crisis Helpline: KIRAN (1800-599-0019)" },
                  // { icon: "🏫", text: "Available at 500+ Educational Institutions" }
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
            {/* Replace the Card with the new ContactForm component */}
            <ContactForm />
          </div>
        </div>
      </section>


      {/* Enhanced Blogs Section with No Background Cards */}
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
              <div
                key={blog.id}
                className="group cursor-pointer rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-3"
              >
                <Link href={`/blogs/${blog.id}`}>
                  {/* Image wrapper */}
                  <div className="aspect-video relative overflow-hidden">
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


                  {/* Title + text wrapper - same width as image */}
                  <div className="p-4 bg-white">
                    <div className="text-sm text-slate-500 mb-2">{blog.date}</div>
                    <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors duration-300 line-clamp-2 mb-2">
                      {blog.title}
                    </h3>
                    <p className="text-slate-600 group-hover:text-slate-700 transition-colors duration-300 line-clamp-3">
                      {blog.excerpt}
                    </p>
                  </div>
                </Link>
              </div>


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
                <Image
                  className=" pb-2"
                  src="/logoiconfull.png" // Path from the 'public' folder
                  alt="Campus care Admin Logo"
                  width={152} // Corresponds to w-8
                  height={152} // Corresponds to h-8
                />
              </div>
              <p className="text-slate-400 text-pretty">
                Empowering students with accessible, stigma-free mental health support through innovative technology.
              </p>
            </div>
            {[
              {
                title: "Platform", links: [
                  { name: "About", action: () => scrollToSection("about") },
                  { name: "Services", action: () => scrollToSection("services") },
                  { name: "Team", action: () => scrollToSection("team") },
                  { name: "Get Started", href: "/signup" },
                  { name: "Login", href: "/login" }
                ]
              },
              {
                title: "Resources", links: [
                  { name: "Blog", href: "/blogs" },
                  { name: "Help Center", href: "#" },
                  { name: "Privacy Policy", href: "#" },
                  { name: "Terms of Service", href: "#" }
                ]
              },
              {
                title: "Emergency Support", links: [
                  { name: "Crisis Helpline: 988", href: "#" },
                  { name: "Campus Security: 911", href: "#" },
                  { name: "24/7 Chat Support", href: "#" }
                ]
              }
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
            <p>&copy; 2024 Campus Care. All rights reserved. Developed with ❤️ for student mental health.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}