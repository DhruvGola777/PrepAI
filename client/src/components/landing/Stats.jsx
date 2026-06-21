import React, { useState, useEffect, useRef } from 'react';
import { statsData } from '../../assets/assets';

// CountUp component to animate numbers
const CountUp = ({ end, duration = 2000, prefix = "", suffix = "", isVisible }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // easeOutExpo curve
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setCount(Math.round(easeProgress * end));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [end, duration, isVisible]);

  // Format large numbers with commas
  const formattedCount = count.toLocaleString();

  return (
    <span>
      {prefix}{formattedCount}{suffix}
    </span>
  );
};

const Stats = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 relative bg-slate-50/50 dark:bg-slate-900/20 border-y border-slate-200/50 dark:border-slate-800/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-1.5 mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium text-sm">
            Proven Results
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 dark:text-white">
            Our Success in <span className="text-gradient">Numbers</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {statsData.map((stat) => (
            <div key={stat.id} className="glass-card rounded-2xl p-8 text-center group hover:-translate-y-1 transition-transform duration-300">
              <div className="mb-6 flex justify-center">
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
              </div>
              <h3 className="text-4xl font-bold mb-2 text-slate-900 dark:text-white">
                <CountUp end={stat.value} suffix={stat.suffix} isVisible={isVisible} />
              </h3>
              <p className="text-slate-600 dark:text-slate-400 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
