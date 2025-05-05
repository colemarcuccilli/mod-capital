import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedButton from '../atoms/AnimatedButton'; // Assuming AnimatedButton handles links

gsap.registerPlugin(ScrollTrigger);

interface FundingTypeInfo {
  title: string;
  description: string;
  icon: string; // Simple emoji/character for now
  path: string;
  gradient: string; // Tailwind gradient class
}

const fundingTypesData: FundingTypeInfo[] = [
    { title: "Double Close", description: "Seamless back-to-back transaction funding.", icon: "🤝", path: "/double-close", gradient: "from-accent/70 to-secondary/70" },
    { title: "EMD", description: "Secure deals with earnest money deposit coverage.", icon: "💰", path: "/emd", gradient: "from-accent/70 to-accent-secondary/70" },
    { title: "Gap Funding", description: "Bridge short-term financing gaps in your projects.", icon: "🌉", path: "/gap", gradient: "from-secondary/70 to-accent-secondary/70" },
    { title: "Private Money", description: "Access flexible capital from private lenders.", icon: "🏦", path: "/private-money", gradient: "from-accent-secondary/70 to-accent/70" }
];

const FundingTypes: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const sectionEl = sectionRef.current;
        const titleEl = titleRef.current;
        const gridEl = gridRef.current;

        if (!sectionEl || !titleEl || !gridEl) return;

        const cards = gsap.utils.toArray<HTMLElement>(gridEl.children);

    const ctx = gsap.context(() => {
            // Section entrance
            gsap.from(sectionEl, {
                opacity: 0,
                y: 50,
            duration: 0.8,
                ease: 'power3.out',
            scrollTrigger: {
                    trigger: sectionEl,
              start: "top 85%",
            }
            });

            // Card entrance (staggered)
            if (cards.length > 0) {
                gsap.from(cards, {
                    opacity: 0,
                    y: 30,
                    scale: 0.95,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: gridEl,
                        start: "top 85%",
          }
        });
      }
    }, sectionRef);
    
        return () => ctx.revert();
  }, []);
  
  return (
        <section ref={sectionRef} id="funding-types" className="py-20 md:py-28 bg-background dark:bg-gray-800 opacity-100">
            <div className="container mx-auto px-4">
                <h2 ref={titleRef} className="text-3xl md:text-4xl font-bold text-center mb-16 text-primary dark:text-white">
          Our <span className="text-accent">Funding</span> Solutions
        </h2>
                <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {fundingTypesData.map((type) => (
                        <div key={type.title} className="funding-type-card group relative overflow-hidden rounded-xl shadow-lg bg-white dark:bg-gray-700 p-6 text-center transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 h-64 flex flex-col justify-between">
                             {/* Gradient Overlay on Hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${type.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0`}></div>
              
                            {/* Content Container */}
                            <div className="relative z-10 flex flex-col items-center h-full">
                                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{type.icon}</div>
                                <h3 className="text-xl font-semibold mb-2 text-primary dark:text-white group-hover:text-white transition-colors duration-300">{type.title}</h3>
                                <p className="text-sm text-primary/80 dark:text-gray-300 mb-4 group-hover:text-white/90 transition-colors duration-300 flex-grow">{type.description}</p>
                                {/* Button - Ensure it's above overlay */}
                <AnimatedButton 
                  to={type.path}
                                    className="text-sm !py-2 !px-4 light-btn group-hover:bg-white/90 group-hover:text-accent mt-auto" // Use light-btn variant, override padding
                >
                                    Learn More
                </AnimatedButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FundingTypes; 