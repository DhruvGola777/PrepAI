import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import Stats from '../components/landing/Stats';
import Features from '../components/landing/Features';
import Testimonials from '../components/landing/Testimonials';
import FAQ from '../components/landing/FAQ';
import Footer from '../components/landing/Footer';
import Login from './Login';
import { motion, AnimatePresence } from 'motion/react';

const LandingPage = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const outlineRef = useRef(null);

  const mouse = useRef({ x: 0, y: 0 });
  const position = useRef({ x: 0, y: 0 });

  useEffect(()=>{
    const handleMouseMove = (e) => {
      mouse.current={x:e.clientX,y:e.clientY}
    };
    const animate=()=>{
      position.current.x +=(mouse.current.x-position.current.x)*0.1;
      position.current.y +=(mouse.current.y-position.current.y)*0.1;

      if(outlineRef.current){
        outlineRef.current.style.transform =`translate3d(${position.current.x-20}px,${position.current.y-20}px,0)`;
      }
      requestAnimationFrame(animate);
    }
    document.addEventListener('mousemove',handleMouseMove);
    const req= requestAnimationFrame(animate)
    return ()=>{
      document.removeEventListener('mousemove',handleMouseMove);
      cancelAnimationFrame(req)
    }
  },[])

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 overflow-x-hidden">
      <Navbar openLoginModal={() => setShowLoginModal(true)} />
      <main>
        <Hero openLoginModal={() => setShowLoginModal(true)} />
        <Features />
        <Stats />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
      
      {/* Login modal overlay with Framer Motion spring animations */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative"
            >
              <Login onClose={() => setShowLoginModal(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={outlineRef} className="fixed top-0 left-0 h-15 w-15 rounded-full border-primary border-2 pointer-events-none z-9999">
      </div>
    </div>
  );
};

export default LandingPage;
