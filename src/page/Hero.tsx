"use client"

import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { ArrowRight, FileSpreadsheet, Zap, Download, Clock } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@clerk/clerk-react"

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)
  const { isSignedIn } = useAuth()
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isSignedIn) {
      navigate('/home');
    }
  }, [isSignedIn, navigate]);

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-white">Templify</div>
          <Link to={isSignedIn ? "/home" : "/signin"}>
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center space-y-8 animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 animate-slide-up">Templify</h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto animate-slide-up delay-200">
            Transform your spreadsheets into beautiful, personalized documents in seconds
          </p>

          {/* Pain Point Section */}
          <div className="max-w-4xl mx-auto mt-16 animate-slide-up delay-300">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-red-500/20 p-3 rounded-full">
                  <Clock className="w-8 h-8 text-red-400" />
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-white mb-4">The Problem</h2>
              <p className="text-gray-300 text-lg">
                Creating custom PDFs from Excel or CSV files is slow and frustrating. Manual formatting, repetitive
                tasks, and complex tools waste hours of your valuable time.
              </p>
            </div>
          </div>

          {/* Solution Section */}
          <div className="max-w-4xl mx-auto mt-8 animate-slide-up delay-400">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-green-500/20 p-3 rounded-full">
                  <Zap className="w-8 h-8 text-green-400" />
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-white mb-4">The Solution</h2>
              <p className="text-gray-300 text-lg mb-6">
                Templify converts spreadsheets into personalized templates with rich text in seconds. Upload your data,
                customize your template, and download professional documents instantly.
              </p>

              {/* Feature highlights */}
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <FileSpreadsheet className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                  <h3 className="text-white font-semibold mb-2">Easy Upload</h3>
                  <p className="text-gray-400 text-sm">Drag & drop Excel or CSV files</p>
                </div>
                <div className="text-center">
                  <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                  <h3 className="text-white font-semibold mb-2">Smart Templates</h3>
                  <p className="text-gray-400 text-sm">AI-powered rich text editor</p>
                </div>
                <div className="text-center">
                  <Download className="w-12 h-12 text-green-400 mx-auto mb-3" />
                  <h3 className="text-white font-semibold mb-2">Instant Export</h3>
                  <p className="text-gray-400 text-sm">Download as PDF or TXT</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-12 animate-slide-up delay-500">
            <Link to={isSignedIn ? "/home" : "/signin"}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
              >
                Start Creating Templates
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
