import React from 'react';
import { featuresData } from '../../assets/assets';

const Features = () => {
  return (
    <section id="features" className="py-24 relative bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-1.5 mb-4 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium text-sm">
            Platform Features
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 dark:text-white">
            Everything you need to <span className="text-gradient">succeed</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Our comprehensive toolkit provides everything you need to prepare, practice, and perfect your interview skills before the big day.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((feature, index) => (
            <div key={index} className="glass-card rounded-2xl p-8 hover:-translate-y-1 transition-transform duration-300">
              <div className="mb-6 inline-flex p-3 rounded-xl bg-slate-100 dark:bg-slate-800">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
