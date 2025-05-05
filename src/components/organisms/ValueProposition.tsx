import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiUsers, FiBarChart2, FiCheck } from 'react-icons/fi';
import IconWrapper from '../atoms/IconWrapper';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Define structure locally or import
interface ValueItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

// Update props interface
interface ValuePropositionProps {
    title?: string; // Optional title override
    propositions?: ValueItem[]; // Optional items override
}

// Default propositions (internal fallback)
const defaultPropositions: ValueItem[] = [
    {
      icon: <IconWrapper name="FiUsers" size={40} className="text-accent" />,
      title: "Personalized Matchmaking",
      description: "We pair you with the right lenders for your specific needs and project requirements."
    },
    {
      icon: <IconWrapper name="FiBarChart2" size={40} className="text-accent" />,
      title: "Creative Financing Expertise",
      description: "Our team specializes in developing customized solutions for even the most complex deals."
    },
    {
      icon: <IconWrapper name="FiCheck" size={40} className="text-accent" />,
      title: "Vetted Network",
      description: "Access our network of trusted lenders and investors who have been thoroughly vetted."
    }
];

// Default title (internal fallback)
const defaultTitle = "Why Choose <span class=\'text-accent\'>Domentra</span>";

const ValueProposition: React.FC<ValuePropositionProps> = ({ title: personalizedTitle, propositions: personalizedPropositions }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  
  // Use personalized props or fall back to defaults
  const currentTitle = personalizedTitle || defaultTitle;
  const currentPropositions = personalizedPropositions && personalizedPropositions.length > 0 
      ? personalizedPropositions 
      : defaultPropositions;
  
  useEffect(() => {
      const sectionEl = sectionRef.current;
      const titleEl = titleRef.current;
      const cardsContainer = cardsRef.current;

      if (!sectionEl || !titleEl || !cardsContainer) return;

      const cards = gsap.utils.toArray<HTMLElement>(cardsContainer.children);

      const ctx = gsap.context(() => {
            // Animate Title
            gsap.from(titleEl, {
                opacity: 0,
                y: 30,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: sectionEl, // Trigger based on section
                    start: "top 85%",
                }
            });

            // Stagger Cards Animation
            if (cards.length > 0) {
                 gsap.from(cards, {
                    opacity: 0,
                    y: 50,
                    scale: 0.95,
                    duration: 0.6,
                    stagger: 0.15,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: cardsContainer,
                        start: "top 85%",
                    }
                 });
            }
        }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [currentTitle, currentPropositions]); // Re-run if props change
  
  return (
    <section ref={sectionRef} className="py-20 md:py-28 bg-white dark:bg-gray-800 opacity-100">
      <div className="container mx-auto px-4">
        <h2 
          ref={titleRef}
          className="text-3xl md:text-4xl font-bold text-center mb-16 text-primary dark:text-white"
          dangerouslySetInnerHTML={{ __html: currentTitle }}
        />
        
        <div 
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {currentPropositions.map((value, index) => (
            <div 
              key={index}
              className="value-card bg-gray-50 dark:bg-gray-700 rounded-lg shadow-lg p-8 text-center transform transition-transform duration-300 hover:scale-105 border border-gray-100 dark:border-gray-600"
            >
              <div className="inline-block p-4 rounded-full bg-accent/10 dark:bg-accent/20 mb-6">
                {value.icon}
              </div>
              <h3 className="text-xl font-semibold text-primary dark:text-white mb-3">{value.title}</h3>
              <p className="text-primary/80 dark:text-gray-300">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProposition; 