import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import domentraIconPoix from '../../assets/images/logos/DomentraIconPhoix.svg';

interface IntroAnimationProps {
  onComplete: () => void;
}

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const poixFilterRef = useRef<HTMLDivElement>(null);
  const topGradientRef = useRef<HTMLDivElement>(null);
  const bottomGradientRef = useRef<HTMLDivElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const logoBorderRef = useRef<HTMLDivElement>(null);
  const logoBorderInnerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      onComplete();
      return;
    }
    
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
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
      
      tl.from([topGradientRef.current, bottomGradientRef.current], { 
        duration: 0.7, 
        ease: "power3.inOut", 
        filter: "blur(0px)", 
        opacity: 0 
      })
      .from(poixFilterRef.current, { 
        duration: 0.8, 
        opacity: 0, 
        scale: 3 
      }, "-=50%")
      .to(poixFilterRef.current, { 
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
      .from(logoRef.current, { 
        duration: 0.4,
        opacity: 0,
        scale: 0.8,
        ease: "back"
      })
      .from(logoBorderRef.current, { 
        duration: 0.4, 
        ease: "power3.out", 
        opacity: 0, 
        scale: 0.75,
        backgroundColor: '#FF6666'
      }, "-=100%")
      .from(logoBorderInnerRef.current, { 
        duration: 0.4, 
        ease: "power3.out", 
        scale: 0.75,
        backgroundColor: '#FFFFFA'
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
      .to(logoRef.current, { 
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
      className="fixed inset-0 w-screen h-screen z-50 flex items-center justify-center bg-primary overflow-hidden"
      style={{ position: 'fixed' }}
    >
      <div 
        ref={poixFilterRef} 
        className="absolute inset-0 z-10"
        style={{
          background: "radial-gradient(rgba(201, 87, 229, 0.05), rgba(201, 87, 229, 0.4) 80%)"
        }}
      ></div>
      
      <div 
        ref={topGradientRef}
        className="absolute top-[-50px] w-[110%] h-[100px] left-[-5%] z-20"
        style={{ 
          background: "linear-gradient(to right, rgba(255, 102, 102, 0.7) 0% 20%, transparent 20% 40%, rgba(197, 216, 109, 0.5) 40% 70%, rgba(255, 102, 102, 0.6) 70%)",
          filter: "blur(3em)"
        }}
      ></div>
      <div 
        ref={bottomGradientRef}
        className="absolute bottom-[-50px] w-[110%] h-[100px] left-[-5%] z-20"
        style={{ 
          background: "linear-gradient(to right, rgba(201, 87, 229, 0.6) 0% 30%, transparent 30% 50%, rgba(255, 102, 102, 0.5) 50% 80%, transparent 80%)",
          filter: "blur(3em)"
        }}
      ></div>
      
      <div 
        ref={logoWrapperRef} 
        className="relative z-30 opacity-0 flex items-center justify-center"
        style={{ width: '150px', height: '150px' }}
      >
        <div 
          ref={logoBorderRef} 
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-accent rounded-2xl"
          style={{ width: '140%', height: '160%', zIndex: 1 }}
        ></div>
        
        <div 
          ref={logoBorderInnerRef} 
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background rounded-2xl"
          style={{ width: 'calc(140% - 0.5em)', height: 'calc(160% - 0.5em)', zIndex: 2 }}
        ></div>
        
        <div 
          ref={logoRef}
          className="absolute inset-0 flex items-center justify-center z-10 p-4"
        >
          <img 
            src={domentraIconPoix} 
            alt="Domentra Loading" 
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default IntroAnimation; 