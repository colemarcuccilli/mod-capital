import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { FiChevronDown } from 'react-icons/fi';
import IconWrapper from '../atoms/IconWrapper';
import Button from '../atoms/Button';

// Register GSAP plugins
gsap.registerPlugin(TextPlugin, ScrollToPlugin);

interface AnimatedHeroProps {
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  className?: string;
}

const AnimatedHero: React.FC<AnimatedHeroProps> = ({
  subtitle = "Need funding to scale? We make it fast and simple.",
  ctaText = "View Funding Solutions",
  ctaLink = "#funding-types",
  className = ''
}) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const greenFilterRef = useRef<HTMLDivElement>(null);
  const topGradientRef = useRef<HTMLDivElement>(null);
  const bottomGradientRef = useRef<HTMLDivElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const logoBorderRef = useRef<HTMLDivElement>(null);
  const logoBorderInnerRef = useRef<HTMLDivElement>(null);
  const logoTextRef = useRef<HTMLDivElement>(null);
  const modTextRef = useRef<HTMLDivElement>(null);
  const capitalTextRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLButtonElement>(null);
  
  // State to manage the current title
  const [currentTitle, setCurrentTitle] = useState("Double Close Funding");
  const [animationComplete, setAnimationComplete] = useState(false);
  
  // Loan types for rotation
  const titles = ["Double Close Funding", "EMD Funding", "Gap Funding", "Private Money Loan"];
  
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
  
  const rotateTitles = () => {
    if (!titleRef.current || !animationComplete) return;
    
    // Get next title
    const currentIndex = titles.indexOf(currentTitle);
    const nextIndex = (currentIndex + 1) % titles.length;
    const nextTitle = titles[nextIndex];
    
    // Animate out current title
    const tl = gsap.timeline();
    
    tl.to(titleRef.current, {
      opacity: 0,
      y: -30,
      duration: 0.3,
      onComplete: () => {
        setCurrentTitle(nextTitle);
      }
    })
    .to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      delay: 0.1
    });
    
    // Schedule next rotation
    setTimeout(() => {
      rotateTitles();
    }, 3000);
  };
  
  // Character-by-character animation
  const animateCharacters = (text: string, element: HTMLElement | null, onComplete?: () => void) => {
    if (!element) return;
    
    let currentText = "";
    element.textContent = "";
    
    const tl = gsap.timeline({
      onComplete: onComplete
    });
    
    for (let i = 0; i < text.length; i++) {
      tl.add(() => {
        currentText += text[i];
        element.textContent = currentText;
      }, i * 0.05);
    }
  };
  
  // Animation effect
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      // Skip animations for reduced motion preference
      if (overlayRef.current) gsap.set(overlayRef.current, { opacity: 0 });
      if (greenFilterRef.current) gsap.set(greenFilterRef.current, { opacity: 0 });
      if (topGradientRef.current) gsap.set(topGradientRef.current, { opacity: 0 });
      if (bottomGradientRef.current) gsap.set(bottomGradientRef.current, { opacity: 0 });
      if (logoWrapperRef.current) gsap.set(logoWrapperRef.current, { opacity: 0 });
      if (contentRef.current) gsap.set(contentRef.current, { opacity: 1 });
      if (titleRef.current) {
        gsap.set(titleRef.current, { opacity: 1 });
      }
      if (subtitleRef.current) gsap.set(subtitleRef.current, { opacity: 1, y: 0 });
      if (buttonRef.current) gsap.set(buttonRef.current, { opacity: 1, y: 0 });
      if (arrowRef.current) gsap.set(arrowRef.current, { opacity: 1, y: 0 });
      
      setAnimationComplete(true);
      
      // Simple title rotation without animation
      const rotationInterval = setInterval(() => {
        const currentIndex = titles.indexOf(currentTitle);
        const nextIndex = (currentIndex + 1) % titles.length;
        setCurrentTitle(titles[nextIndex]);
      }, 3000);
      
      return () => clearInterval(rotationInterval);
    }
    
    // If motion is allowed, proceed with animations
    const ctx = gsap.context(() => {
      // Initial setup
      gsap.set(logoWrapperRef.current, { opacity: 0 });
      gsap.set(contentRef.current, { opacity: 0 });
      
      // Ensure logo is centered inside border
      if (logoTextRef.current) {
        logoTextRef.current.style.position = 'relative';
        logoTextRef.current.style.zIndex = '3';
      }
      
      if (titleRef.current) {
        titleRef.current.textContent = titles[0];
      }
      
      // Main animation timeline
      const tl = gsap.timeline({
        onComplete: () => {
          setAnimationComplete(true);
          setTimeout(rotateTitles, 2000);
        }
      });
      
      // Hulu-style animation sequence
      tl.from([topGradientRef.current, bottomGradientRef.current], 0.7, { 
        ease: "power3.inOut", 
        filter: "blur(0px)", 
        opacity: 0 
      })
      .from(greenFilterRef.current, 0.8, { 
        opacity: 0, 
        scale: 3 
      }, "-=50%")
      .to(greenFilterRef.current, 0.25, { 
        opacity: 0, 
        scale: 3 
      })
      .to([topGradientRef.current, bottomGradientRef.current], 0.3, { 
        filter: "blur(0px)", 
        opacity: 0 
      }, "-=100%")
      .set(logoWrapperRef.current, { opacity: 1 })
      .from(modTextRef.current, 0.2, { 
        ease: "back", 
        filter: "blur(0.3em)", 
        opacity: 0, 
        scale: 1.5, 
        stagger: 0.02 
      })
      .from(capitalTextRef.current, 0.2, { 
        delay: 0.25, 
        filter: "blur(0.3em)", 
        opacity: 0, 
        scale: 0.5, 
        stagger: 0.02, 
        xPercent: -25 
      })
      .from(logoBorderRef.current, 0.4, { 
        ease: "power3.out", 
        opacity: 0, 
        scale: 0.75 
      }, "-=100%")
      .from(logoBorderInnerRef.current, 0.4, { 
        ease: "power3.out", 
        scale: 0.75 
      }, "-=100%")
      .to(logoWrapperRef.current, 1.5, { 
        scale: 1.1 
      }, "-=20%")
      .to([logoBorderRef.current, logoBorderInnerRef.current], 1.5, { 
        ease: "power3.out", 
        scale: 1.1 
      }, "-=100%")
      .to(logoBorderRef.current, 1.25, { 
        ease: "power4.in", 
        scale: 8 
      }, "-=50%")
      .to(logoBorderInnerRef.current, 0.5, { 
        ease: "power4.in", 
        scale: 8 
      }, "-=60%")
      .to(logoWrapperRef.current, 0.25, { 
        opacity: 0, 
        scale: 1.2 
      }, "-=50%")
      // End of logo animation, now fade in regular content
      .to(overlayRef.current, 0.5, { 
        opacity: 0 
      })
      .set(contentRef.current, { 
        opacity: 1
      })
      .from(titleRef.current, 0.5, {
        opacity: 0,
        y: 30
      })
      .from(subtitleRef.current, 0.5, {
        opacity: 0,
        y: 30
      }, "-=0.3")
      .from(buttonRef.current, 0.5, {
        opacity: 0,
        y: 30
      }, "-=0.3")
      .from(arrowRef.current, 0.5, {
        opacity: 0,
        y: 30
      }, "-=0.3");
      
      // Down arrow bounce (after main animation completes)
      tl.add(() => {
        gsap.to(arrowRef.current, {
          y: 10,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          duration: 1.2
        });
        
        // Subtle glow pulse
        gsap.to(arrowRef.current, {
          boxShadow: '0 0 15px rgba(255, 0, 0, 0.3)',
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      });
    }, heroRef);
    
    return () => {
      ctx.revert();
    };
  }, []);
  
  return (
    <div 
      ref={heroRef}
      className={`relative min-h-screen flex items-center justify-center overflow-hidden pt-16 ${className}`}
    >
      {/* Overlay for initial fade and final transition */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 bg-black z-40"
      ></div>
      
      {/* Green Filter (red in our case) */}
      <div 
        ref={greenFilterRef} 
        className="absolute inset-0 z-30"
        style={{
          background: "radial-gradient(rgba(255, 0, 0, 0.05), rgba(255, 0, 0, 0.4) 80%)"
        }}
      ></div>
      
      {/* Animated Gradients */}
      <div 
        ref={topGradientRef}
        className="absolute top-[-50px] w-[110%] h-[100px] left-[-5%] z-20"
        style={{ 
          background: "linear-gradient(to right, rgba(220, 38, 38, 0.75) 0% 10%, transparent 10% 20%, rgba(171, 111, 218, 0.5) 20% 50%, rgba(220, 38, 38, 0.5) 50% 70%, rgba(255, 0, 0, 0.75) 70%)",
          filter: "blur(3em)"
        }}
      ></div>
      <div 
        ref={bottomGradientRef}
        className="absolute bottom-[-50px] w-[110%] h-[100px] left-[-5%] z-20"
        style={{ 
          background: "linear-gradient(to right, rgba(220, 38, 38, 0.75) 0% 10%, transparent 10% 30%, rgba(220, 38, 38, 0.5) 30% 50%, transparent 50% 70%, rgba(171, 111, 218, 0.5) 70% 80%, transparent 80%)",
          filter: "blur(3em)"
        }}
      ></div>
      
      {/* Logo Wrapper (for Hulu-style animation) */}
      <div 
        ref={logoWrapperRef} 
        className="absolute inset-0 flex items-center justify-center z-30"
      >
        <div className="relative">
          {/* Logo Border */}
          <div 
            ref={logoBorderRef} 
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary rounded-2xl"
            style={{ height: "160%", width: "140%", zIndex: 1 }}
          ></div>
          
          {/* Logo Border Inner */}
          <div 
            ref={logoBorderInnerRef} 
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black rounded-2xl"
            style={{ height: "calc(160% - 0.5em)", width: "calc(140% - 0.5em)", zIndex: 2 }}
          ></div>
          
          {/* Logo Text */}
          <div ref={logoTextRef} className="flex flex-col items-center">
            <div 
              ref={modTextRef} 
              className="text-primary text-8xl font-bold leading-tight"
              style={{ height: "120px", lineHeight: "120px" }}
            >
              MOD
            </div>
            <div 
              ref={capitalTextRef} 
              className="text-white text-3xl tracking-widest"
            >
              CAPITAL
            </div>
          </div>
        </div>
      </div>
      
      {/* Background */}
      <div className="absolute inset-0 bg-white z-10"></div>
      
      {/* Content - This appears after the animation */}
      <div 
        ref={contentRef} 
        className="container relative z-30 py-20 md:py-32 opacity-0"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-black"
          >
            {currentTitle}
          </h1>
          
          <p 
            ref={subtitleRef}
            className="text-xl md:text-2xl text-gray-600 mb-10"
          >
            {subtitle}
          </p>
          
          <div ref={buttonRef}>
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
      
      {/* Bouncing scroll button at bottom of hero */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-30">
        <button
          ref={arrowRef}
          onClick={handleScrollClick}
          className="w-12 h-12 bg-white text-primary hover:bg-gray-100 rounded-full flex items-center justify-center shadow-lg focus:outline-none transition-colors duration-300"
          aria-label="Scroll down"
        >
          <IconWrapper name="FiChevronDown" size={24} />
        </button>
      </div>
    </div>
  );
};

export default AnimatedHero; 