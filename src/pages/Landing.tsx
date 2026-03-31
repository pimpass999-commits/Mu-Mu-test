import React from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, ArrowRight, Shield, Zap, Users, BarChart3, Globe, Github } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors selection:bg-blue-100 dark:selection:bg-blue-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <CheckSquare className="text-white h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">TaskFlow</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</a>
            <a href="#solutions" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Solutions</a>
            <a href="#pricing" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="hidden sm:flex">Log in</Button>
            </Link>
            <Link to="/login">
              <Button variant="primary" size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800 mb-6">
              New: AI-Powered Task Prioritization ✨
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 leading-[1.1]">
              Manage your work <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">without the chaos.</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              TaskFlow brings all your tasks, projects, and team members together in one place. 
              Build better products, faster.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/login">
                <Button size="lg" className="h-14 px-8 text-lg rounded-2xl shadow-xl shadow-blue-200 dark:shadow-none">
                  Start for free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-2xl dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300">
                Book a demo
              </Button>
            </div>
          </motion.div>

          {/* App Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-950 via-transparent to-transparent z-10 h-full w-full"></div>
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl bg-slate-50 dark:bg-slate-900 p-2">
              <img 
                src="https://picsum.photos/seed/dashboard/1600/900" 
                alt="TaskFlow Dashboard Preview" 
                className="rounded-2xl w-full h-auto"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-8">Trusted by teams at</p>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale dark:invert">
            <div className="flex items-center gap-2 font-bold text-xl">GOOGLE</div>
            <div className="flex items-center gap-2 font-bold text-xl">NETFLIX</div>
            <div className="flex items-center gap-2 font-bold text-xl">AIRBNB</div>
            <div className="flex items-center gap-2 font-bold text-xl">SPOTIFY</div>
            <div className="flex items-center gap-2 font-bold text-xl">STRIPE</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50/50 dark:bg-slate-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Everything you need to ship.</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">Powerful features to help your team stay organized and focused on what matters.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: 'Lightning Fast', desc: 'Optimized for speed. No more waiting for pages to load.' },
              { icon: Users, title: 'Team Collaboration', desc: 'Real-time updates and seamless communication for your whole team.' },
              { icon: Shield, title: 'Enterprise Security', desc: 'Your data is safe with us. We use industry-leading encryption.' },
              { icon: BarChart3, title: 'Advanced Analytics', desc: 'Track progress and identify bottlenecks with deep insights.' },
              { icon: Globe, title: 'Remote First', desc: 'Built for the modern workforce. Work from anywhere, anytime.' },
              { icon: Github, title: 'Git Integration', desc: 'Connect your workflow with GitHub, GitLab, and Bitbucket.' },
            ].map((feature, i) => (
              <div key={i} className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <CheckSquare className="text-white h-5 w-5" />
                </div>
                <span className="text-xl font-bold text-slate-900 dark:text-white">TaskFlow</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                The modern project management tool for high-performance teams.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-6">Product</h4>
              <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
                <li><a href="#" className="hover:text-blue-600 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-400 dark:text-slate-500">© 2026 TaskFlow Inc. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors"><Github className="h-5 w-5" /></a>
              <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors">Twitter</a>
              <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
