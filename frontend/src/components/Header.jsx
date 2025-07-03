import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import Button from './ui/Button';

const Header = () => {
  const { isDark, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [0.8, 0.95]);
  const headerBlur = useTransform(scrollY, [0, 100], [10, 20]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'py-2' : 'py-4'
      }`}
      style={{
        background: `rgba(0, 0, 0, ${isScrolled ? 0.8 : 0.3})`,
        backdropFilter: `blur(${isScrolled ? 20 : 10}px)`,
        borderBottom: `1px solid rgba(255, 255, 255, ${isScrolled ? 0.1 : 0.05})`
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Futuristic Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-4"
          >
            <motion.div 
              className="relative"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-neon-cyan via-neon-purple to-neon-pink rounded-2xl flex items-center justify-center relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-neon-cyan to-neon-purple opacity-50"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <svg
                  className="w-7 h-7 text-black relative z-10"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L13.09 5.26L16 4L14.74 7.09L18 8L14.74 9.91L16 13L13.09 11.74L12 15L10.91 11.74L8 13L9.26 9.91L6 8L9.26 7.09L8 4L10.91 5.26L12 2Z" />
                </svg>
              </div>
            </motion.div>
            
            <div className="hidden sm:block">
              <motion.h1 
                className="text-xl font-black text-white font-display"
                whileHover={{ scale: 1.02 }}
              >
                <span className="bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
                  SYNTH
                </span>
                <span className="text-white">DATA</span>
              </motion.h1>
              <motion.p 
                className="text-xs text-neon-green font-mono uppercase tracking-wider"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                &gt; AI POWERED_
              </motion.p>
            </div>
          </motion.div>

          {/* Cyber Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {[
              { name: 'Generate', href: '#generate', icon: '⚡' },
              { name: 'Gallery', href: '#gallery', icon: '🎨' },
              { name: 'History', href: '#history', icon: '📊' },
              { name: 'Analytics', href: '#stats', icon: '🔬' },
            ].map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="group relative px-4 py-2 text-white/80 hover:text-white transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <span className="flex items-center space-x-2 font-medium">
                  <span className="text-sm">{item.icon}</span>
                  <span>{item.name}</span>
                </span>
                
                {/* Hover effect */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-neon-cyan to-neon-purple"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}
          </nav>

          {/* Control Panel */}
          <div className="flex items-center space-x-3">
            {/* AI Status Indicator */}
            <motion.div 
              className="hidden md:flex items-center space-x-2 glass rounded-full px-3 py-1.5 border border-white/10"
              animate={{ boxShadow: ['0 0 10px rgba(0,255,255,0.3)', '0 0 20px rgba(0,255,255,0.1)', '0 0 10px rgba(0,255,255,0.3)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                className="w-2 h-2 bg-neon-green rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span className="text-xs text-white/80 font-mono">AI ONLINE</span>
            </motion.div>

            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className="glass rounded-full p-3 border border-white/10 hover:border-white/20 transition-colors group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle theme"
            >
              <motion.div
                animate={{ rotate: isDark ? 0 : 180 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {isDark ? (
                  <motion.svg 
                    className="w-5 h-5 text-neon-cyan group-hover:text-neon-purple transition-colors" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                    whileHover={{ scale: 1.1 }}
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      clipRule="evenodd"
                    />
                  </motion.svg>
                ) : (
                  <motion.svg 
                    className="w-5 h-5 text-neon-purple group-hover:text-neon-cyan transition-colors" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                    whileHover={{ scale: 1.1 }}
                  >
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </motion.svg>
                )}
              </motion.div>
            </motion.button>

            {/* Menu Button for Mobile */}
            <motion.button
              className="lg:hidden glass rounded-full p-3 border border-white/10 hover:border-white/20 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Open menu"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <motion.path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
