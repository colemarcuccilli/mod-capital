import React, { useEffect, useRef } from 'react';
import Button from '../atoms/Button';
import gsap from 'gsap';

interface HeroProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage?: string;
  className?: string;
}

const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  ctaText,
  ctaLink,
  backgroundImage,
  className = ''
}) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  
  // Animation effect
  useEffect(() => {
    if (titleRef.current && subtitleRef.current && ctaRef.current) {
      // Hide all elements initially
      gsap.set([titleRef.current, subtitleRef.current, ctaRef.current], { opacity: 0 });
      
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
    }
  }, []);
  
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
      className={`relative min-h-screen flex items-center justify-center overflow-hidden pt-16 ${className}`}
    >
      {/* Background Image with Parallax */}
      {backgroundImage && (
        <div
          className="hero-bg absolute inset-0 w-full h-full bg-cover bg-center transform scale-110"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-primary/60"></div>
        </div>
      )}
      
      {/* Content */}
      <div className="container relative z-10 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white"
          >
            {title}
          </h1>
          
          <p 
            ref={subtitleRef}
            className="text-xl md:text-2xl text-white/90 mb-10"
          >
            {subtitle}
          </p>
          
          <div ref={ctaRef} className="transform translate-y-10">
            <Button 
              variant="primary"
              className="text-lg px-8 py-4"
              onClick={() => window.location.href = ctaLink}
            >
              {ctaText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero; 