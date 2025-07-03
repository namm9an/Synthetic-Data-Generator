import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import HeroSection from './components/HeroSection';
import GenerationForm from './components/GenerationForm';
import PreviewGallery from './components/PreviewGallery';
import FileUploadZone from './components/FileUploadZone';
import HistoryLog from './components/HistoryLog';
import StatsDashboard from './components/StatsDashboard';
import Header from './components/Header';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-black dark:via-gray-900 dark:to-black transition-colors duration-500">
        {/* Advanced Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {/* Animated Gradient Orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-r from-green-600/10 to-yellow-600/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
          
          {/* Cyber Grid */}
          <div className="absolute inset-0 cyber-grid opacity-5" />
          
          {/* Floating Particles */}
          <div className="particles">
            {[...Array(100)].map((_, i) => (
              <div
                key={i}
                className="particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 20}s`,
                  animationDuration: `${15 + Math.random() * 10}s`
                }}
              />
            ))}
          </div>
        </div>

        <Header />
        <main className="relative z-10">
          <HeroSection />
          
          {/* Modern Content Sections */}
          <div className="relative">
            {/* Section Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-transparent" />
            
            <div className="container mx-auto px-4 py-24 space-y-32 relative z-10">
              <GenerationForm />
              <FileUploadZone />
              <PreviewGallery />
              
              <div className="grid lg:grid-cols-2 gap-12">
                <HistoryLog />
                <StatsDashboard />
              </div>
            </div>
          </div>
        </main>
        
        {/* Modern Footer Section */}
        <footer className="relative z-10 mt-32 py-16 border-t border-white/10">
          <div className="container mx-auto px-4 text-center">
            <div className="glass rounded-3xl p-8 inline-block backdrop-blur-lg border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Create?</h3>
              <p className="text-white/70 mb-6">Join thousands of developers using our AI-powered synthetic data generator</p>
              <div className="flex gap-4 justify-center">
                <a href="#" className="text-neon-cyan hover:text-neon-pink transition-colors">Documentation</a>
                <a href="#" className="text-neon-cyan hover:text-neon-pink transition-colors">API Reference</a>
                <a href="#" className="text-neon-cyan hover:text-neon-pink transition-colors">Support</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
