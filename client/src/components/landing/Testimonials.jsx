import React from 'react';
import { Star, MessageCircle } from 'lucide-react';
import { testimonialsData } from '../../assets/assets';

// Duplicate the array to create a seamless infinite scrolling effect
const infiniteTestimonials = [...testimonialsData, ...testimonialsData];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-24 relative bg-slate-50/50 dark:bg-slate-900/20 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-1.5 mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium text-sm">
            Testimonials
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 dark:text-white">
            What Our <span className="text-gradient">Users Say</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Don't just take our word for it. See what professionals who used our platform have to say.
          </p>
        </div>

        {/* Outer wrapper masks the scrollbar and edges */}
        <div className="relative w-[100vw] left-1/2 -ml-[50vw]">
          <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-slate-50/50 dark:from-[#0b1120] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-slate-50/50 dark:from-[#0b1120] to-transparent z-10 pointer-events-none"></div>
          
          {/* Inner container with marquee animation */}
          <div className="flex gap-6 w-max animate-marquee">
            {infiniteTestimonials.map((testimonial, index) => (
              <div 
                key={`${testimonial.id}-${index}`} 
                className="w-[350px] shrink-0"
              >
                <div className="glass-card rounded-2xl p-8 h-[280px] flex flex-col transition-all duration-300 hover:shadow-2xl">
                  <div className="mb-4 text-blue-500 dark:text-blue-400">
                    <MessageCircle size={32} />
                  </div>
                  
                  <blockquote className="text-slate-700 dark:text-slate-300 italic mb-8 flex-grow">
                    "{testimonial.content}"
                  </blockquote>
                  
                  <div className="mt-auto">
                    <div className="flex items-center mb-4 text-yellow-500">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={16} className="fill-current" />
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 border-2 border-white dark:border-slate-700 shadow-sm">
                        <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">{testimonial.name}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
