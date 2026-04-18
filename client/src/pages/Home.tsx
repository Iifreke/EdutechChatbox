import { Button } from "@/components/ui/button";
import { ChevronRight, BookOpen, Users, Globe } from "lucide-react";
import { useState } from "react";
import ChatWidget from "@/components/ChatWidget";

/**
 * Design Philosophy: Modern Minimalist with Gradient Accents
 * - Clean, professional aesthetic with educational focus
 * - Deep blue (#1e40af) for trust, teal (#0891b2) for innovation
 * - Asymmetric layouts, gradient accents, smooth transitions
 * - Typography: Poppins for display, Inter for body
 */

export default function Home() {
  const [showChat, setShowChat] = useState(true);

  return (
    <div className="min-h-screen bg-white text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="font-bold text-xl text-foreground">Edutech</span>
          </div>
          <Button
            onClick={() => setShowChat(true)}
            className="bg-gradient-to-r from-blue-700 to-cyan-600 hover:from-blue-800 hover:to-cyan-700 text-white"
          >
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container py-20 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                  Learn with
                  <span className="gradient-primary-text block">Purpose</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Transform your educational journey with personalized learning paths, expert instructors, and a global community of learners.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => setShowChat(true)}
                  className="bg-gradient-to-r from-blue-700 to-cyan-600 hover:from-blue-800 hover:to-cyan-700 text-white px-8 py-6 text-lg h-auto"
                >
                  Explore Programs
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  className="px-8 py-6 text-lg h-auto border-2 border-blue-700 text-blue-700 hover:bg-blue-50"
                >
                  Watch Demo
                </Button>
              </div>

              <div className="flex gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-blue-700">50K+</div>
                  <div className="text-sm text-muted-foreground">Active Learners</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-700">500+</div>
                  <div className="text-sm text-muted-foreground">Expert Courses</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-700">150+</div>
                  <div className="text-sm text-muted-foreground">Countries</div>
                </div>
              </div>
            </div>

            {/* Right: Hero Image */}
            <div className="relative">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663461655112/DyqMNWC6utsKSJbt7bSgtx/edutech-hero-MN5CDYZ2fgP9Y42RoPWxB2.webp"
                alt="Edutech Learning"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-blue-700/10 to-cyan-600/10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-white to-blue-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose Edutech?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We combine cutting-edge technology with expert instruction to create the perfect learning experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="hover-lift p-8 bg-white rounded-xl border border-border shadow-sm">
              <div className="mb-6">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663461655112/DyqMNWC6utsKSJbt7bSgtx/edutech-feature-1-GDuCbPZM3LrZNJxk9J7vnV.webp"
                  alt="Personalized Learning"
                  className="w-20 h-20 mx-auto"
                />
              </div>
              <h3 className="text-2xl font-bold text-center mb-3">Personalized Learning</h3>
              <p className="text-center text-muted-foreground">
                AI-powered recommendations tailored to your learning style and pace. Progress at your own speed.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="hover-lift p-8 bg-white rounded-xl border border-border shadow-sm">
              <div className="mb-6">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663461655112/DyqMNWC6utsKSJbt7bSgtx/edutech-feature-2-ZzsBqmK9nkR3C9rCcn6srm.webp"
                  alt="Expert Instructors"
                  className="w-20 h-20 mx-auto"
                />
              </div>
              <h3 className="text-2xl font-bold text-center mb-3">Expert Instructors</h3>
              <p className="text-center text-muted-foreground">
                Learn from industry leaders and experienced educators with proven track records of success.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="hover-lift p-8 bg-white rounded-xl border border-border shadow-sm">
              <div className="mb-6">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663461655112/DyqMNWC6utsKSJbt7bSgtx/edutech-feature-3-AyNLPcTM3oShqitLb4foPx.webp"
                  alt="Global Community"
                  className="w-20 h-20 mx-auto"
                />
              </div>
              <h3 className="text-2xl font-bold text-center mb-3">Global Community</h3>
              <p className="text-center text-muted-foreground">
                Connect with learners worldwide, collaborate on projects, and build lasting professional networks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="gradient-primary rounded-2xl p-12 md:p-16 text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Learning?</h2>
            <p className="text-xl mb-8 opacity-95 max-w-2xl mx-auto">
              Join thousands of students and professionals who are already advancing their careers with Edutech.
            </p>
            <Button
              onClick={() => setShowChat(true)}
              className="bg-white text-blue-700 hover:bg-gray-100 px-8 py-6 text-lg h-auto font-semibold"
            >
              Start Your Journey
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
                  <span className="font-bold">E</span>
                </div>
                <span className="font-bold text-lg">Edutech</span>
              </div>
              <p className="text-gray-400">Empowering learners worldwide.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-smooth">Features</a></li>
                <li><a href="#" className="hover:text-white transition-smooth">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-smooth">Courses</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-smooth">About</a></li>
                <li><a href="#" className="hover:text-white transition-smooth">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-smooth">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-smooth">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-smooth">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-smooth">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2026 Edutech. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Chat Widget */}
      <ChatWidget isOpen={showChat} onClose={() => setShowChat(false)} />
    </div>
  );
}
