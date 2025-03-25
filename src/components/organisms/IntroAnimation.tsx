import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface IntroAnimationProps {
  onComplete: () => void;
}

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const greenFilterRef = useRef<HTMLDivElement>(null);
  const topGradientRef = useRef<HTMLDivElement>(null);
  const bottomGradientRef = useRef<HTMLDivElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const logoBorderRef = useRef<HTMLDivElement>(null);
  const logoBorderInnerRef = useRef<HTMLDivElement>(null);
  const modTextRef = useRef<HTMLDivElement>(null);
  const capitalTextRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      // Skip animation for accessibility
      onComplete();
      return;
    }
    
    const ctx = gsap.context(() => {
      // Hulu-style animation sequence
      const tl = gsap.timeline({
        onComplete: () => {
          // When animation is done, hide everything and call onComplete
          gsap.to(containerRef.current, {
            autoAlpha: 0,
            duration: 0.5,
            onComplete: () => {
              if (containerRef.current) {
                containerRef.current.style.display = 'none';
              }
              onComplete();
            }
          });
        }
      });
      
      // Create letter arrays for text animation
      const modLetters = Array.from("MOD");
      const capitalLetters = Array.from("CAPITAL");
      
      // Update DOM to have spans for each letter
      if (modTextRef.current) {
        modTextRef.current.innerHTML = '';
        modLetters.forEach(letter => {
          const span = document.createElement('span');
          span.textContent = letter;
          span.classList.add('mod-letter');
          modTextRef.current?.appendChild(span);
        });
      }
      
      if (capitalTextRef.current) {
        capitalTextRef.current.innerHTML = '';
        capitalLetters.forEach(letter => {
          const span = document.createElement('span');
          span.textContent = letter;
          span.classList.add('capital-letter');
          capitalTextRef.current?.appendChild(span);
        });
      }
      
      // Get references to all letter spans
      const modLetterEls = gsap.utils.toArray<HTMLElement>('.mod-letter');
      const capitalLetterEls = gsap.utils.toArray<HTMLElement>('.capital-letter');
      
      // Animation sequence
      tl.from([topGradientRef.current, bottomGradientRef.current], { 
        duration: 0.7, 
        ease: "power3.inOut", 
        filter: "blur(0px)", 
        opacity: 0 
      })
      .from(greenFilterRef.current, { 
        duration: 0.8, 
        opacity: 0, 
        scale: 3 
      }, "-=50%")
      .to(greenFilterRef.current, { 
        duration: 0.25, 
        opacity: 0, 
        scale: 3 
      })
      .to([topGradientRef.current, bottomGradientRef.current], { 
        duration: 0.3, 
        filter: "blur(0px)", 
        opacity: 0 
      }, "-=100%")
      .set(logoWrapperRef.current, { opacity: 1 })
      .from(modLetterEls, { 
        duration: 0.2, 
        ease: "back", 
        filter: "blur(0.3em)", 
        opacity: 0, 
        scale: 1.5, 
        stagger: 0.05 
      })
      .from(capitalLetterEls, { 
        duration: 0.2, 
        delay: 0.25, 
        filter: "blur(0.3em)", 
        opacity: 0, 
        scale: 0.5, 
        stagger: 0.02, 
        xPercent: -25 
      })
      .from(logoBorderRef.current, { 
        duration: 0.4, 
        ease: "power3.out", 
        opacity: 0, 
        scale: 0.75 
      }, "-=100%")
      .from(logoBorderInnerRef.current, { 
        duration: 0.4, 
        ease: "power3.out", 
        scale: 0.75 
      }, "-=100%")
      .to(logoWrapperRef.current, { 
        duration: 1.5, 
        scale: 1.1 
      }, "-=20%")
      .to([logoBorderRef.current, logoBorderInnerRef.current], { 
        duration: 1.5, 
        ease: "power3.out", 
        scale: 1.1 
      }, "-=100%")
      .to(logoBorderRef.current, { 
        duration: 1.25, 
        ease: "power4.in", 
        scale: 15 
      }, "-=50%")
      .to(logoBorderInnerRef.current, { 
        duration: 0.5, 
        ease: "power4.in", 
        scale: 15 
      }, "-=60%")
      .to(logoWrapperRef.current, { 
        duration: 0.25, 
        opacity: 0, 
        scale: 1.2 
      }, "-=50%");
    }, containerRef);
    
    return () => {
      ctx.revert();
    };
  }, [onComplete]);
  
  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 w-screen h-screen z-50 flex items-center justify-center bg-black overflow-hidden"
      style={{ position: 'fixed' }}
    >
      {/* Red Filter (previously green) */}
      <div 
        ref={greenFilterRef} 
        className="absolute inset-0 z-10"
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
      
      {/* Logo Wrapper */}
      <div 
        ref={logoWrapperRef} 
        className="relative z-30 opacity-0"
        style={{ width: '300px', height: '200px' }}
      >
        {/* Logo Border */}
        <div 
          ref={logoBorderRef} 
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary rounded-2xl"
          style={{ width: '140%', height: '160%', zIndex: 1 }}
        ></div>
        
        {/* Logo Border Inner */}
        <div 
          ref={logoBorderInnerRef} 
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black rounded-2xl"
          style={{ width: 'calc(140% - 0.5em)', height: 'calc(160% - 0.5em)', zIndex: 2 }}
        ></div>
        
        {/* Logo Text */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
          <div 
            ref={modTextRef} 
            className="text-primary text-8xl font-bold leading-tight"
            style={{ height: '120px', lineHeight: '120px' }}
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
  );
};

export default IntroAnimation; 