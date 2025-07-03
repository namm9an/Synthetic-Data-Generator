import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Button from './ui/Button';

const HeroSection = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToGenerate = () => {
    const generateSection = document.getElementById('generate');
    if (generateSection) {
      generateSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ opacity }}
    >
      {/* Dynamic Gradient Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"
          style={{
            background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(139, 92, 246, 0.3) 0%, rgba(59, 130, 246, 0.2) 25%, rgba(236, 72, 153, 0.1) 50%, transparent 70%)`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 via-purple-900/50 to-pink-900/50" />
      </div>

      {/* Cyber Grid */}
      <div className="absolute inset-0 cyber-grid opacity-30" />

      {/* Floating 3D Elements */}
      <motion.div 
        className="absolute inset-0"
        style={{ y: y1 }}
      >
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 200 + 50}px`,
              height: `${Math.random() * 200 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `radial-gradient(circle, ${[
                'rgba(0, 255, 255, 0.1)',
                'rgba(255, 0, 255, 0.1)',
                'rgba(0, 255, 0, 0.1)',
                'rgba(139, 92, 246, 0.1)'
              ][i % 4]}, transparent 70%)`,
              filter: 'blur(20px)'
            }}
            animate={{
              x: [0, 100, -50, 0],
              y: [0, -100, 50, 0],
              scale: [1, 1.5, 0.8, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 20 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </motion.div>

      {/* Matrix Rain Effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-20 bg-gradient-to-b from-neon-green to-transparent opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: '-100px'
            }}
            animate={{
              y: ['0vh', '110vh']
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'linear'
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <motion.div 
        className="relative z-10 text-center px-4 max-w-7xl mx-auto"
        style={{ y: y2 }}
      >
        {/* AI Badge */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.2, type: "spring" }}
          className="inline-flex items-center px-4 py-2 rounded-full glass border border-white/20 mb-8 backdrop-blur-lg"
        >
          <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse mr-3" />
          <span className="text-sm font-medium text-white/90">Powered by Advanced AI</span>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="ml-2"
          >
            <svg className="w-4 h-4 text-neon-cyan" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L13.09 5.26L16 4L14.74 7.09L18 8L14.74 9.91L16 13L13.09 11.74L12 15L10.91 11.74L8 13L9.26 9.91L6 8L9.26 7.09L8 4L10.91 5.26L12 2Z" />
            </svg>
          </motion.div>
        </motion.div>

        {/* Hero Title */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <h1 className="text-6xl md:text-8xl xl:text-9xl font-black mb-6 leading-none">
            <motion.span 
              className="block text-gradient holographic font-display"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] 
              }}
              transition={{ duration: 8, repeat: Infinity }}
            >
              SYNTHETIC
            </motion.span>
            <motion.span 
              className="block text-white font-display relative"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              DATA
              <motion.span
                className="absolute -top-2 -right-2 text-2xl"
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ⚡
              </motion.span>
            </motion.span>
            <motion.span 
              className="block text-4xl md:text-6xl xl:text-7xl mt-4 neon-cyan font-display"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.7, type: "spring", bounce: 0.4 }}
            >
              GENERATOR
            </motion.span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="text-xl md:text-3xl mb-12 text-white/80 max-w-4xl mx-auto leading-relaxed font-light"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          Create
          <motion.span 
            className="neon-pink font-semibold mx-2"
            animate={{ textShadow: ['0 0 10px #ff00ff', '0 0 30px #ff00ff', '0 0 10px #ff00ff'] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            limitless
          </motion.span>
          synthetic datasets with
          <motion.span 
            className="neon-cyan font-semibold mx-2"
            animate={{ textShadow: ['0 0 10px #00ffff', '0 0 30px #00ffff', '0 0 10px #00ffff'] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          >
            AI precision
          </motion.span>
          in seconds
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={scrollToGenerate}
              size="xl"
              className="btn-cyber px-12 py-4 text-lg font-bold bg-gradient-to-r from-neon-cyan to-neon-purple text-black rounded-2xl shadow-cyber hover:shadow-neon-lg transition-all duration-300"
            >
              <motion.svg 
                className="w-6 h-6 mr-3" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </motion.svg>
              START GENERATING
              <motion.div
                className="ml-3 text-2xl"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                →
              </motion.div>
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              size="xl"
              className="glass border-2 border-white/20 text-white hover:bg-white/10 backdrop-blur-lg px-12 py-4 text-lg font-bold rounded-2xl transition-all duration-300"
            >
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              WATCH DEMO
            </Button>
          </motion.div>
        </motion.div>

        {/* Feature Showcase */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          {[
            { icon: "🚀", label: "Instant", value: "< 3s", color: "neon-cyan" },
            { icon: "🎯", label: "Accuracy", value: "99.9%", color: "neon-pink" },
            { icon: "💎", label: "Quality", value: "Premium", color: "neon-green" },
            { icon: "🔥", label: "Models", value: "500+", color: "neon-purple" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="glass rounded-3xl p-6 text-center border border-white/10 backdrop-blur-lg hover:border-white/20 transition-all duration-300"
              whileHover={{ y: -10, scale: 1.05 }}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
            >
              <motion.div 
                className="text-4xl mb-3"
                animate={{ rotateY: 360 }}
                transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
              >
                {stat.icon}
              </motion.div>
              <div className={`text-2xl font-black mb-1 ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-white/60 text-sm font-medium uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
      >
        <div className="glass rounded-full p-4 border border-white/20 backdrop-blur-lg">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default HeroSection;
