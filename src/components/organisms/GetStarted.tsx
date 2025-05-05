import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedButton from '../atoms/AnimatedButton';

gsap.registerPlugin(ScrollTrigger);

// Match structure defined in Home.tsx PersonalizationDetails
interface GetStartedContent {
  heading: string;
  content: string;
  primaryCtaText: string;
  primaryCtaActionIntent: string; // Keep intent for handler
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

interface GetStartedProps {
    content: GetStartedContent;
    onPrimaryCtaClick: () => void; // Handler passed from Home
}

// Basic placeholder component structure
const GetStarted: React.FC<GetStartedProps> = ({ content, onPrimaryCtaClick }) => {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const sectionEl = sectionRef.current;
        if (!sectionEl) return;

        const ctx = gsap.context(() => {
            // Animate direct children (container)
            gsap.from(sectionEl.children[0], {
                opacity: 0,
                y: 50,
                duration: 0.8,
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
        // Ensure initial visibility
        <section ref={sectionRef} className="py-20 md:py-28 bg-primary dark:bg-gray-800 text-white opacity-100">
            {/* Container is the direct child animated */}
            <div className="container mx-auto px-4 text-center">
                <h2 
                    className="text-3xl md:text-4xl font-bold mb-4"
                    dangerouslySetInnerHTML={{ __html: content.heading }} // Allow span styling
                />
                <p className="text-lg text-background/80 dark:text-gray-300 max-w-2xl mx-auto mb-8">
                    {content.content}
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    {/* Use AnimatedButton with the onClick handler */}
                    <AnimatedButton
                        to="#" // Dummy link
                        onClick={onPrimaryCtaClick} 
                        className="bg-accent hover:bg-accent/90 text-white text-lg px-8 py-3"
                    >
                        {content.primaryCtaText}
                    </AnimatedButton>
                    {content.secondaryCtaText && content.secondaryCtaLink && (
                        <Link 
                            to={content.secondaryCtaLink}
                            className="text-background/80 hover:text-white underline transition-colors text-sm"
                        >
                            {content.secondaryCtaText}
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
};

export default GetStarted; 