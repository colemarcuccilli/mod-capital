import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// Import the correct store and types
import { useOnboardingStore, InitialProfile } from '../../store/onboardingStore';
import AnimatedButton from '../atoms/AnimatedButton';
import { FiTarget, FiDollarSign, FiShare2 } from 'react-icons/fi';
import IconWrapper from '../atoms/IconWrapper';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Update SolutionDetail interface to expect icon name string
interface SolutionDetail { title: string; description: string; icon?: string; }
interface SolutionsContent {
  heading: string;
  items: SolutionDetail[]; // Expects an array of items
  ctaText?: string; 
  ctaAction?: string; 
}

// Update props to accept content object
interface SolutionsOverviewProps {
    content?: SolutionsContent; // Make content prop optional
}

// Define default content using icon NAMES
const defaultContent: SolutionsContent = {
    heading: "Diverse Opportunities & Solutions",
    items: [
        { title: "Deal Sourcing", description: "Find off-market investment opportunities.", icon: 'FiTarget' },
        { title: "Funding Access", description: "Connect with various capital types (EMD, Gap, Private Money).", icon: 'FiDollarSign' },
        { title: "Deal Placement", description: "Present your deals to vetted buyers and lenders.", icon: 'FiShare2' },
    ],
    ctaText: "Learn More",
    ctaAction: '/info/how-it-works'
};

const SolutionsOverview: React.FC<SolutionsOverviewProps> = ({ content: personalizedContent }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null); // Ref for the grid/list

  // Use personalized content if provided, otherwise use default
  const contentToDisplay = personalizedContent || defaultContent;
  
  // Animation Effect
  useEffect(() => {
    const sectionEl = sectionRef.current;
    const titleEl = titleRef.current;
    const gridEl = gridRef.current;
    const ctaButton = sectionEl?.querySelector('.solutions-cta-btn'); // Target button if it exists

    if (!sectionEl || !titleEl || !gridEl) return;

    const items = gsap.utils.toArray<HTMLElement>(gridEl.children);

    const ctx = gsap.context(() => {
       // Section entrance
       gsap.from(sectionEl, {
          opacity: 0, 
          y: 50, 
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
              trigger: sectionEl, 
              start: "top 85%" 
          }
       });

       // Stagger items animation
        if (items.length > 0) {
            gsap.from(items, {
                opacity: 0,
                y: 30,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: gridEl, 
              start: "top 85%",
          }
       });
        }

       // Animate CTA button if present
       if (ctaButton) {
            gsap.from(ctaButton, {
                opacity: 0,
                y: 20,
                duration: 0.5,
                ease: 'power2.out',
                 scrollTrigger: {
                    trigger: ctaButton, // Trigger when button itself is close
                    start: "top 95%", 
                }
            });
       }

    }, sectionRef);
    return () => ctx.revert();
  }, [contentToDisplay]); // Re-run if content changes
  
  return (
    <section 
      ref={sectionRef} 
      className="relative py-20 md:py-28 bg-gray-100 dark:bg-gray-800 opacity-100"
      id="solutions-overview"
    >
       {/* Background elements if desired */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 dark:bg-accent/20 rounded-full -mr-32 -mt-32 blur-2xl opacity-50"></div>
       <div className="container mx-auto px-4 relative z-10">
         <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 
            ref={titleRef}
            className="text-3xl md:text-4xl font-bold text-center mb-4 text-primary dark:text-white"
            dangerouslySetInnerHTML={{ __html: contentToDisplay.heading }}
          />
          {/* Optional: Add a general description if needed, maybe from contentToDisplay.description if added to type */}
        </div>
        
        {/* Render the list/grid of items */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {contentToDisplay.items.map((item, index) => (
                <div key={index} className="solution-item bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md border-l-4 border-accent dark:border-accent-light">
                    {/* Use IconWrapper with the name string */}
                    {item.icon && (
                        <div className="mb-3 text-accent dark:text-accent-light">
                           <IconWrapper name={item.icon} size={36} /> 
                        </div>
                    )}
                    <h3 className="text-xl font-semibold text-primary dark:text-white mb-2">{item.title}</h3>
                    <p className="text-primary/80 dark:text-gray-300 text-sm">{item.description}</p>
          </div>
            ))}
        </div>

         {/* Optional CTA Button based on personalized content */}
         {contentToDisplay.ctaText && contentToDisplay.ctaAction && (
            <div className="text-center mt-16">
                <AnimatedButton 
                    to={contentToDisplay.ctaAction} 
                    className="text-lg solutions-cta-btn"
                >
                    {contentToDisplay.ctaText}
                </AnimatedButton>
            </div>
         )}
      </div>
    </section>
  );
};

export default SolutionsOverview; 
