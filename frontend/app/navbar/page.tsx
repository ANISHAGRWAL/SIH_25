"use client";

import { useState, useEffect } from 'react';
import React from 'react';

// Define the props for the Button component
interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: string;
  size?: string;
  style?: React.CSSProperties; // Added to fix the style prop error
}

// A simple, reusable Button component with added types
const Button = ({ children, className, ...props }: ButtonProps) => (
  <button
    className={`px-6 py-2 text-white font-semibold rounded-lg shadow-md transition-all duration-300 ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Navbar = () => {
  // Fix: Declare the `isScrolled` state variable
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Fix: Declare the `isLoaded` state variable for the initial fade-in animation
  const [isLoaded, setIsLoaded] = useState(false);

  // Fix: Add a useEffect hook to handle the scroll event
  useEffect(() => {
    const handleScroll = () => {
      // Check if the user has scrolled past 50 pixels
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Add event listener for scroll and clean up on component unmount
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fix: Add a useEffect to trigger the fade-in animation once the component mounts
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled
      ? 'bg-white/95 backdrop-blur-lg shadow-xl border-b border-gray-200/50'
      : 'bg-white/80 backdrop-blur-sm border-b border-gray-200'
    }`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <a href="/" className={`flex items-center gap-2 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
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
          </a>
          <div className="hidden md:flex items-center gap-8">
            {[
              { name: "about", href: "/#about" },
              { name: "services", href: "/#services" },
              { name: "contact", href: "/#contact" },
              { name: "blogs", href: "/blogs", active: true }
            ].map((section, index) => (
              <a
                key={section.name}
                href={section.href}
                className={`font-medium transition-all duration-300 hover:text-slate-900 relative group capitalize ${section.active ? 'text-blue-600' : 'text-slate-600'
                } ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {section.name}
                <span className={`absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-400 transition-all duration-300 group-hover:w-full ${section.active ? 'w-full' : ''
                }`} />
              </a>
            ))}
            <a href="/signup">
              <Button className={`rounded-full bg-gradient-to-r from-blue-500 to-indigo-400 hover:from-blue-600 hover:to-indigo-500 transition-all duration-300 hover:scale-105 hover:shadow-lg transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                }`} style={{ transitionDelay: '400ms' }}>
                Get Started
              </Button>
            </a>
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
  );
};

export default Navbar;
