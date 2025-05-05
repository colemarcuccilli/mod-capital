import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Match structure defined in Home.tsx PersonalizationDetails
interface WhatWeDoContent {
  heading: string;
  content: string;
  visual?: string; 
}

interface WhatWeDoProps {
    content: WhatWeDoContent;
}

// Basic placeholder component structure
const WhatWeDo: React.FC<WhatWeDoProps> = ({ content }) => {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const sectionEl = sectionRef.current;
        if (!sectionEl) return;

        const ctx = gsap.context(() => {
            gsap.from(sectionEl.children, { // Animate direct children
                opacity: 0,
                y: 50,
                duration: 0.8,
                stagger: 0.2, // Stagger title and paragraph
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: sectionEl,
                    start: "top 85%",
                }
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        // Ensure section starts visible (opacity-100)
        <section ref={sectionRef} className="py-16 md:py-24 bg-white dark:bg-gray-700 opacity-100">
            <div className="container mx-auto px-4 text-center">
                <h2 
                    className="text-3xl md:text-4xl font-bold mb-6 text-primary dark:text-white"
                    dangerouslySetInnerHTML={{ __html: content.heading }} // Allow span styling
                />
                <p className="text-lg text-primary/80 dark:text-gray-300 max-w-3xl mx-auto">
                    {content.content}
                </p>
                {/* Add visual element based on content.visual later */}
            </div>
        </section>
    );
};

export default WhatWeDo; 