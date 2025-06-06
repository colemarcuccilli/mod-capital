import React, { useEffect, useRef } from 'react';
import AnimatedButton from '../atoms/AnimatedButton';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { FiChevronDown } from 'react-icons/fi';
import IconWrapper from '../atoms/IconWrapper';

// Register TextPlugin and ScrollToPlugin
gsap.registerPlugin(TextPlugin, ScrollToPlugin);

interface HeroProps {
  scrollingPhrases?: string[];
  subtitle?: string;
  ctaText: string;
  ctaLink: string;
  onCtaClick?: () => void;
  backgroundImage?: string;
  className?: string;
}

const Hero: React.FC<HeroProps> = ({
  scrollingPhrases,
  subtitle = "Simple Funding Solutions for Real Estate Investors",
  ctaText = "View Funding Solutions",
  ctaLink = "#",
  onCtaClick,
  backgroundImage,
  className = ''
}) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const rotatingTextRef = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollButtonRef = useRef<HTMLButtonElement>(null);
  
  // Use provided phrases or a default list if none provided
  const phrasesToRotate = scrollingPhrases && scrollingPhrases.length > 0 
      ? scrollingPhrases 
      : ["EMD Funding", "Double Close Funding", "Gap Funding", "Private Money Loan"];
  
  // Handle scroll button click
  const handleScrollClick = () => {
    const howItWorksSection = document.getElementById('how-it-works');
    if (howItWorksSection) {
      gsap.to(window, {
        duration: 1,
        scrollTo: { y: howItWorksSection, offsetY: 50 },
        ease: 'power3.inOut'
      });
    }
  };
  
  // Animation effect
  useEffect(() => {
    if (titleRef.current && rotatingTextRef.current && subtitleRef.current && ctaRef.current) {
      // Hide all elements initially
      gsap.set([titleRef.current, subtitleRef.current, ctaRef.current], { opacity: 0, y: 20 });
      
      // Create animation timeline
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      
      // Animate elements in sequence
      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8
      })
      .to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8
      }, "-=0.5")
      .to(ctaRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8
      }, "-=0.5");
      
      // Set up rotating text animation using phrasesToRotate
      const rotatingTextTl = gsap.timeline({
        repeat: -1,
        repeatDelay: 0.5,
        delay: 1,
        paused: true,
      });

      // Clear previous text content immediately if phrases change
      if(rotatingTextRef.current) rotatingTextRef.current.textContent = '';
      
      phrasesToRotate.forEach((phrase, index) => {
        rotatingTextTl.to(rotatingTextRef.current, {
          duration: 0.5,
          text: {
            value: phrase,
            delimiter: ""
          },
          ease: "none",
        })
        .to(rotatingTextRef.current, {
          duration: 2,
          ease: "none"
        });
      });

      // Ensure the animation starts if it was created
      if (rotatingTextTl) {
          rotatingTextTl.play();
      }
      
      // Scroll button animation
      if (scrollButtonRef.current) {
        // Continuous bouncing animation
        gsap.to(scrollButtonRef.current, {
          y: 10,
          duration: 1.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
        
        // Subtle glow pulse
        gsap.to(scrollButtonRef.current, {
          boxShadow: '0 0 15px rgba(255, 255, 255, 0.6)',
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }

      // Cleanup function
      return () => {
          rotatingTextTl?.kill();
          gsap.killTweensOf(scrollButtonRef.current);
      };
    }
  }, [phrasesToRotate]);
  
  // Background parallax effect
  useEffect(() => {
    if (heroRef.current && backgroundImage) {
      const background = heroRef.current.querySelector('.hero-bg');
      
      if (background) {
        gsap.to(background, {
          y: '30%',
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        });
      }
    }
  }, [backgroundImage]);
  
  return (
    <div 
      ref={heroRef}
      className={`relative flex items-center justify-center overflow-hidden pt-16 ${className} py-20 md:py-32`}
    >
      {/* Background with Overlay */}
      {backgroundImage ? (
        <div
          className="hero-bg absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-primary/60"></div>
        </div>
      ) : (
        <div className="absolute inset-0 bg-background"></div>
      )}
      
      {/* Content */}
      <div className="container relative z-10 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-primary h-20 md:h-24 lg:h-28"
          >
            <span ref={rotatingTextRef} className="text-primary"></span>
          </h1>
          
          {!scrollingPhrases && (
          <p 
            ref={subtitleRef}
            className="text-xl md:text-2xl text-primary/80 mb-10"
          >
            {subtitle}
          </p>
          )}
          {scrollingPhrases && (
            <div ref={subtitleRef} className="h-[calc(1.5rem*1.5*2+2.5rem)] md:h-[calc(1.75rem*1.5*2+2.5rem)]"></div>
          )}
          
          <div ref={ctaRef}>
            <AnimatedButton 
              to={onCtaClick ? '#' : ctaLink}
              onClick={onCtaClick}
              className="text-lg"
            >
              {ctaText}
            </AnimatedButton>
          </div>
        </div>
      </div>
      
      {/* Bouncing scroll button at bottom of hero */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10">
        <button
          ref={scrollButtonRef}
          onClick={handleScrollClick}
          className="w-12 h-12 bg-background text-primary hover:bg-gray-100 rounded-full flex items-center justify-center shadow-lg focus:outline-none transition-colors duration-300"
          aria-label="Scroll down"
        >
          <IconWrapper name="FiChevronDown" size={24} className="text-primary" />
        </button>
      </div>
    </div>
  );
};

export default Hero; 