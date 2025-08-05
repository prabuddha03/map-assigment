"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Github, ExternalLink, Code, MapPin, Zap, FileText, Loader2 } from "lucide-react";

// Replace this with your actual CDN image link
const PROFILE_IMAGE_URL = "https://pub-59b3362b9c604d388203b247ffff7743.r2.dev/Prabuddha_chowdhury_image%20copy.jpeg";
const CV_PDF_URL = "https://pub-59b3362b9c604d388203b247ffff7743.r2.dev/Prabuddha_Chowdhury.pdf";

export default function HomePage() {
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [loadingMap, setLoadingMap] = useState(false);

  const handleDashboardClick = () => {
    setLoadingDashboard(true);
  };

  const handleMapClick = () => {
    setLoadingMap(true);
  };

  return (
    <div className="min-h-screen bg-white">

      <section className="relative py-20 px-4 text-center bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">

        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.3) 1px, transparent 0)`,
            backgroundSize: '30px 30px'
          }}></div>
        </div>
        
        <div className="relative max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 border border-blue-200 rounded-full text-blue-800 text-sm mb-6">
            <Code className="h-4 w-4" />
            Hiring Assignment Story
          </div>
          
          <h1 className="text-4xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            My Journey Through the
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 pb-4">
              Assignment
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            From an initial misunderstanding to a refined, polished solution — here's how I approached, debugged, and delivered a production-ready application.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/dashboard"
              onClick={handleDashboardClick}
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 border-2 border-gray-300 rounded-xl hover:border-gray-400 hover:shadow-lg transition-all duration-300 text-lg font-medium disabled:opacity-50"
            >
              {loadingDashboard ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  The Misunderstood Project
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Link>
            <Link
              href="/map"
              onClick={handleMapClick}
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50"
            >
              {loadingMap ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading Map...
                </>
              ) : (
                <>
                  <MapPin className="h-5 w-5" />
                  View The Actual Assignment
                  <span className="ml-2 px-2 py-1 bg-white/20 rounded-full text-xs">Primary</span>
                </>
              )}
            </Link>
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Profile Image */}
            <div className="flex-shrink-0 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-2xl opacity-20 scale-110"></div>
              <div className="relative">
                <img
                  src={PROFILE_IMAGE_URL}
                  alt="Prabuddha Choudhury"
                  className="w-56 h-56 md:w-64 md:h-64 rounded-full object-cover shadow-2xl border-4 border-white relative z-10"
                />
                
              </div>
            </div>
            
            {/* About Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm mb-6">
                <Code className="h-4 w-4" />
                Full Stack Developer
              </div>
              
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Prabuddha</span>
              </h2>
              
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-6">
                A Full Stack Developer who enjoys backend-heavy problem-solving, loves debugging complex issues, and builds scalable systems that matter.
              </p>
              
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                With 11+ months of internship experience, I've solved 300+ LeetCode problems, work extensively with scalable systems, and believe in writing clean, maintainable, and well-documented code that stands the test of time.
              </p>
              
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-8">
                {[
                  { name: "React", color: "from-blue-500 to-cyan-500" },
                  { name: "Node.js", color: "from-green-500 to-emerald-500" },
                  { name: "TypeScript", color: "from-blue-600 to-indigo-600" },
                  { name: "Next.js", color: "from-gray-800 to-gray-600" },
                  { name: "Redux", color: "from-purple-500 to-pink-500" },

                ].map((tech, index) => (
                  <span
                    key={index}
                    className={`px-4 py-2 bg-gradient-to-r ${tech.color} text-white rounded-full text-sm font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 cursor-default`}
                  >
                    {tech.name}
                  </span>
                ))}
              </div>
              
              <div className="flex justify-center lg:justify-start">
                <a
                  href={CV_PDF_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-xl hover:from-gray-800 hover:to-gray-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <FileText className="h-5 w-5" />
                  View CV
                  <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Story Section */}
      <section className="py-20 px-4 bg-white relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              The Story
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-stretch">
            <div className="space-y-6 flex flex-col">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl border border-blue-200 flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  Initial Approach
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  When I first started this assignment, I built a comprehensive industrial IoT dashboard with multiple chart types, KPI cards, and data visualizations—showcasing my ability to create complex, data-rich interfaces.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-100 p-8 rounded-2xl border border-purple-200 flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  Course Correction
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Upon reviewing the requirements more carefully, I realized the focus should be on interactive mapping functionality. Rather than scrapping my work, I adapted quickly and built the map assignment as a focused, requirement-aligned solution.
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl text-white shadow-2xl flex flex-col">
              <h3 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Why Keep Both?
              </h3>
              <p className="text-gray-300 leading-relaxed mb-8 flex-1">
                I'm showcasing both versions to demonstrate my complete thought process and technical range—from comprehensive dashboard solutions to focused, requirement-specific implementations.
              </p>
              
              <div className="grid grid-cols-1 gap-4">
                <Link href="/dashboard" className="group p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-white mb-1">Dashboard Project</h4>
                      <p className="text-gray-400 text-sm">Comprehensive IoT solution</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
                
                <Link href="/map" className="group p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl border border-blue-400/30 hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-white mb-1 flex items-center gap-2">
                        Map Assignment 
                        <span className="px-2 py-1 bg-blue-500 rounded-full text-xs">Primary</span>
                      </h4>
                      <p className="text-gray-400 text-sm">Interactive mapping solution</p>
                    </div>
                    <MapPin className="h-5 w-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Challenges Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Key Challenges & Solutions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Every obstacle was an opportunity to demonstrate problem-solving skills and technical expertise.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "API Date Range Validation",
                description: "OpenMeteo API returned 400 Bad Request for future dates → switched to using past 30 days of historical data instead.",
                icon: "🕒",
                color: "from-red-500 to-orange-500"
              },
              {
                title: "Per-Polygon Data Management",
                description: "Global state variable issue caused same weather data for all polygons → refactored Redux state to store data per polygon ID.",
                icon: "🗺️",
                color: "from-blue-500 to-cyan-500"
              },
              {
                title: "Mobile Responsive Controls",
                description: "Overlapping sidebar/control panel on mobile → implemented proper z-index management and responsive positioning.",
                icon: "📱",
                color: "from-green-500 to-emerald-500"
              },
              {
                title: "Polygon Data Persistence",
                description: "Polygon data lost on browser refresh → implemented localStorage integration with Redux state synchronization.",
                icon: "💾",
                color: "from-purple-500 to-pink-500"
              },
              {
                title: "Leaflet Overlay Management",
                description: "Drawing overlays not removing properly from map → fixed event handling and layer management in leaflet-editable integration.",
                icon: "🎯",
                color: "from-indigo-500 to-blue-500"
              },
              {
                title: "Accurate Area Calculations",
                description: "Incorrect map area approximation → implemented proper geospatial calculations using latitude-aware formulas.",
                icon: "📐",
                color: "from-yellow-500 to-orange-500"
              }
            ].map((challenge, index) => (
              <div key={index} className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-gray-300">
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-r ${challenge.color} rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {challenge.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
                      {challenge.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      <em>{challenge.description}</em>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Differentiators Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Key Differentiators
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Github className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Structured Git Workflow</h3>
                  <p className="text-gray-600">Main & dev branches, issue-based commits, pull requests, no direct pushes to main.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Code className="h-6 w-6 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Clean Architecture</h3>
                  <p className="text-gray-600">Modular components, TypeScript interfaces, Redux state management, and separation of concerns.</p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <ExternalLink className="h-6 w-6 text-purple-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Fully Responsive</h3>
                  <p className="text-gray-600">Works seamlessly on desktop and mobile with adaptive layouts and touch-friendly controls.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Zap className="h-6 w-6 text-orange-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Performance Optimized</h3>
                  <p className="text-gray-600">API caching, efficient state updates, and smooth animations throughout the application.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Technical Implementation
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Interactive Mapping</h3>
              <p className="text-gray-600">React-Leaflet integration with polygon drawing, real-time weather data, and dynamic coloring based on user-defined rules.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">State Management</h3>
              <p className="text-gray-600">Redux Toolkit for complex state, localStorage persistence, and efficient data flow between components.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ExternalLink className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">API Integration</h3>
              <p className="text-gray-600">Custom Next.js API routes with Open-Meteo weather data, caching strategies, and error handling.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bonus Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Bonus Features
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Interactive polygon tooltips with real-time weather data",
              "Multi-weather data support (temperature, precipitation, wind speed)",
              "Custom polygon naming and color rule management",
              "Mobile-responsive design with hamburger navigation",
              "Smooth transitions and animations throughout the app",
              "localStorage persistence for polygon data",
              "Timeline slider with 30-day historical data range",
              "Dynamic map area calculations and zoom-level reporting",
              "Comprehensive toast notifications for user feedback",
              "Fallback logic for missing weather data points"
            ].map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-3"></div>
                <p className="text-gray-600 leading-relaxed">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
            Technology Stack
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Next.js 15", color: "bg-black text-white" },
              { name: "TypeScript", color: "bg-blue-600 text-white" },
              { name: "React-Leaflet", color: "bg-green-600 text-white" },
              { name: "Redux Toolkit", color: "bg-purple-600 text-white" },
              { name: "Tailwind CSS", color: "bg-cyan-500 text-white" },
              { name: "Shadcn/ui", color: "bg-gray-800 text-white" },
              { name: "Open-Meteo API", color: "bg-orange-500 text-white" },
              { name: "React Hot Toast", color: "bg-red-500 text-white" }
            ].map((tech, index) => (
              <div
                key={index}
                className={`px-4 py-3 rounded-lg font-medium text-sm ${tech.color} shadow-md hover:shadow-lg transition-shadow`}
              >
                {tech.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Development Process Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Development Process
          </h2>
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Phase 1: Initial Dashboard</h3>
              <p className="text-gray-600">Built a comprehensive industrial IoT dashboard with multiple chart types, KPI cards, data tables, and responsive design.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Phase 2: Map Integration</h3>
              <p className="text-gray-600">Developed the interactive map with React-Leaflet, polygon drawing capabilities, and basic state management.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Phase 3: Weather Data & API</h3>
              <p className="text-gray-600">Integrated Open-Meteo API, built custom Next.js API routes, implemented caching, and added timeline controls.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Phase 4: Polish & Features</h3>
              <p className="text-gray-600">Added tooltips, legends, mobile responsiveness, polygon naming, color rules, and comprehensive error handling.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Closing Note Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Closing Note
          </h2>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8 max-w-3xl mx-auto">
            This project wasn't just about fulfilling requirements — it was about thinking like a real developer, adapting quickly to changing requirements, solving real-world bugs, and building scalable solutions with room for future improvements.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed mb-12">
            Every challenge was an opportunity to demonstrate problem-solving skills, attention to detail, and the ability to deliver production-ready code.
          </p>
          
          {/* Final CTAs */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/dashboard"
              onClick={handleDashboardClick}
              className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:shadow-lg transition-all duration-300 font-medium disabled:opacity-50"
            >
              {loadingDashboard ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Code className="h-5 w-5" />
                  Explore Dashboard
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Link>
            <Link
              href="/map"
              onClick={handleMapClick}
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 disabled:opacity-50"
            >
              {loadingMap ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <MapPin className="h-5 w-5" />
                  Explore Map Assignment
                  <span className="ml-2 px-2 py-1 bg-white/20 rounded-full text-xs">Main Project</span>
                </>
              )}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      
    </div>
  );
}