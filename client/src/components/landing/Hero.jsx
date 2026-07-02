import React, { useEffect, useState } from 'react';
import { PlayCircle, Star, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

const Hero = ({ openLoginModal }) => {
  const [typedText, setTypedText] = useState('');
  const fullText = "I led a web app redesign that faced timeline and technical constraints. I reorganized tasks, implemented agile sprints, and focused on critical features first, delivering on time with positive client feedback.";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.substring(0, i));
      i++;
      if (i > fullText.length) {
        clearInterval(interval);
      }
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen pt-32 pb-16 overflow-hidden flex items-center">
      {/* Background blur effects */}
      <div className="absolute top-0 left-0 right-0 h-full pointer-events-none">
        <div className="absolute top-20 left-1/4 w-125 h-125 bg-blue-500/10 dark:bg-blue-600/20 rounded-full filter blur-3xl mix-blend-multiply dark:mix-blend-screen"></div>
        <div className="absolute bottom-40 right-1/4 w-125 h-125 bg-indigo-500/10 dark:bg-indigo-600/20 rounded-full filter blur-3xl mix-blend-multiply dark:mix-blend-screen"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* Left Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 lg:pr-8 flex flex-col items-center text-center lg:items-start lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium text-sm border border-blue-100 dark:border-blue-800/50">
              <Sparkles size={16} />
              AI-Powered Interview Coach
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-slate-900 dark:text-white">
              <span className="text-gradient">Ace your interview</span> with real-time AI assistance
            </h1>

            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl">
              Never freeze up during critical moments - our AI Assistant delivers perfect responses and feedback in real-time as you practice.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-10 w-full sm:w-auto">
              <button
                onClick={openLoginModal}
                className="flex items-center justify-center w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 hover:-translate-y-0.5 cursor-pointer"
              >
                Get Started Free
                <PlayCircle className="ml-2 h-5 w-5" />
              </button>
            </div>

            {/* Social Proof */}
            <div className="flex flex-col items-center lg:items-start gap-4">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-950 bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="avatar" className="w-full h-full" />
                    </div>
                  ))}
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Join <span className="font-bold text-slate-900 dark:text-white">50,000+</span> professionals
                </span>
              </div>
              <div className="flex items-center gap-1 text-yellow-500">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
                <span className="ml-2 text-sm text-slate-600 dark:text-slate-400 font-medium">4.9/5 Average Rating</span>
              </div>
            </div>
          </motion.div>

          {/* Right Visual UI element */}
          <div className="lg:w-1/2 w-full relative mt-12 lg:mt-0">
            <div className="glass-card rounded-2xl p-6 md:p-8 relative">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="ml-2 text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    Mock Interview Session
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Interviewer Question */}
                  <div className="bg-slate-100 dark:bg-slate-800/80 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <PlayCircle size={18} />
                      </div>
                      <h3 className="font-semibold text-slate-800 dark:text-slate-200">Interviewer Question</h3>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">
                      "Can you describe a challenging project you worked on and how you handled it?"
                    </p>
                  </div>

                  {/* AI Suggestion */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border border-blue-100 dark:border-blue-800/50 relative">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-800/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <Sparkles size={18} />
                      </div>
                      <h3 className="font-semibold text-slate-800 dark:text-slate-200">Live AI Suggestion</h3>
                    </div>
                    <div className="font-mono text-sm md:text-base text-blue-700 dark:text-blue-300 leading-relaxed min-h-25">
                      {typedText}
                      <span className="inline-block w-1 h-4 ml-1 bg-blue-600 dark:bg-blue-400 animate-cursor-blink align-middle"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-1/4 -right-12 w-24 h-24 bg-blue-500/20 rounded-full filter blur-2xl animate-pulse-slow"></div>
            <div className="absolute bottom-1/4 -left-12 w-32 h-32 bg-indigo-500/20 rounded-full filter blur-2xl animate-pulse-slow delay-1000"></div>
          </div>

        </div>
      </div>
    </div >
  );
};

export default Hero;
