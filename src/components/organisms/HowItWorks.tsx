import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiFileText, FiCheckSquare, FiLifeBuoy, FiDollarSign, FiArrowDown } from 'react-icons/fi';
import IconWrapper from '../atoms/IconWrapper';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const HowItWorks: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);
  const mobileStepsRef = useRef<(HTMLDivElement | null)[]>([]);
  
  // Reset refs
  stepsRef.current = [];
  mobileStepsRef.current = [];
  
  // Add to refs
  const addToStepsRef = (el: HTMLDivElement | null) => {
    if (el && !stepsRef.current.includes(el)) {
      stepsRef.current.push(el);
    }
  };
  
  const addToMobileStepsRef = (el: HTMLDivElement | null) => {
    if (el && !mobileStepsRef.current.includes(el)) {
      mobileStepsRef.current.push(el);
    }
  };
  
  const steps: Step[] = [
    {
      icon: <IconWrapper name="FiFileText" size={24} className="text-white" />,
      title: "Request Funding",
      description: "Submit your funding request through our simple online form to start quickly"
    },
    {
      icon: <IconWrapper name="FiCheckSquare" size={24} className="text-white" />,
      title: "Funding Terms",
      description: "We'll create a funding agreement with clear terms and manageable conditions"
    },
    {
      icon: <IconWrapper name="FiLifeBuoy" size={24} className="text-white" />,
      title: "Funding Review",
      description: "Our team will review and validate your funding needs within 24 hours"
    },
    {
      icon: <IconWrapper name="FiDollarSign" size={24} className="text-white" />,
      title: "Fast Funding",
      description: "Receive your funding within 48 hours or less to your preferred account"
    }
  ];
  
  // Toggle mobile step expansion
  const toggleMobileStep = (index: number) => {
    const step = mobileStepsRef.current[index];
    if (!step) return;
    
    const details = step.querySelector('.step-details');
    const isExpanded = step.classList.contains('expanded');
    const icon = step.querySelector('.expand-icon');
    
    if (!details || !icon) return;
    
    if (isExpanded) {
      // Collapse
      gsap.to(details, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut"
      });
      gsap.to(icon, { rotation: 0, duration: 0.3 });
      step.classList.remove('expanded');
    } else {
      // Expand
      gsap.to(details, {
        height: "auto",
        opacity: 1,
        duration: 0.3,
        ease: "power2.inOut"
      });
      gsap.to(icon, { rotation: 180, duration: 0.3 });
      step.classList.add('expanded');
    }
  };
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section entrance animation
      gsap.from(sectionRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 90%",
          toggleActions: "play none none none"
        }
      });
      
      // Title animation
      if (titleRef.current) {
        // Enhanced title animation with staggered letters
        const titleSpan = titleRef.current.querySelector('span');
        if (titleSpan) {
          // Background fill animation
          gsap.to(titleSpan, {
            backgroundSize: "100% 100%",
            duration: 1,
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top 80%",
            }
          });
          
          // Create a more natural floating motion for the title using timeline
          const floatTL = gsap.timeline({
            repeat: -1,
            yoyo: true,
            repeatRefresh: true // This will recreate the animation on each repeat
          });
          
          floatTL.to(titleRef.current, {
            y: "5px", 
            rotation: 0.5, // Very slight rotation for more natural motion
            duration: 2.5,
            ease: "sine.inOut"
          });
        }
      }
      
      // Triangle animations
      const triangles = document.querySelectorAll('.step-triangle');
      if (triangles.length) {
        // Animate each triangle with a slight delay
        triangles.forEach((triangle, index) => {
          // Initial state
          gsap.set(triangle, { 
            scale: 0,
            transformOrigin: "center bottom"
          });
          
          // Scale up animation
          gsap.to(triangle, {
            scale: 1,
            duration: 0.5,
            delay: 0.3 + (index * 0.2),
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: stepsRef.current[index],
              start: "top 80%",
            }
          });
          
          // Add a subtle bounce animation
          gsap.to(triangle, {
            y: -3,
            duration: 1 + (index * 0.2),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 0.5 + (index * 0.1)
          });
        });
      }
      
      // Desktop step animations
      if (stepsRef.current.length) {
        stepsRef.current.forEach((step, index) => {
          if (!step) return;
          
          // Staggered animation for each step
          gsap.from(step, {
            y: 20,
            opacity: 0,
            duration: 0.5,
            delay: 0.3 + (index * 0.2),
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          });
        });
      }
      
      // Mobile steps animations
      if (mobileStepsRef.current.length) {
        mobileStepsRef.current.forEach((step, index) => {
          if (!step) return;
          
          // Initialize states
          const details = step.querySelector('.step-details');
          if (details) {
            gsap.set(details, { height: 0, opacity: 0 });
          }
          
          // Staggered entrance animation
          gsap.from(step, {
            x: index % 2 === 0 ? -20 : 20,
            opacity: 0,
            duration: 0.4,
            delay: 0.3 + (index * 0.15),
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 90%",
              toggleActions: "play none none reverse"
            }
          });
          
          // Add click handler for toggling
          step.addEventListener('click', () => toggleMobileStep(index));
        });
      }
    }, sectionRef);
    
    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
  
  return (
    <section 
      ref={sectionRef}
      className="relative py-20 md:py-32 bg-white"
      id="how-it-works"
    >
      {/* Subtle background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-gray-50 to-transparent"></div>
        <div className="absolute top-1/4 -left-10 w-40 h-40 rounded-full bg-red-50 blur-xl opacity-50"></div>
        <div className="absolute bottom-1/4 -right-10 w-60 h-60 rounded-full bg-red-100 blur-xl opacity-30"></div>
      </div>
      
      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 
            ref={titleRef} 
            className="text-3xl md:text-4xl font-bold text-center mb-16 text-primary"
          >
            How <span className="text-accent">Funding</span> Works
          </h2>
          
          {/* Mobile View (Interactive expandable steps) */}
          <div className="block md:hidden space-y-3 px-4">
            {steps.map((step, index) => (
              <div 
                key={index} 
                ref={addToMobileStepsRef}
                className="bg-white rounded-xl shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <h3 className="text-lg font-bold text-black">{step.title}</h3>
                  </div>
                  <div className="expand-icon text-primary">
                    <IconWrapper name="FiArrowDown" size={20} />
                  </div>
                </div>
                
                <div className="step-details overflow-hidden mt-2 opacity-0 h-0">
                  <div className="flex items-start pt-2 border-t border-gray-100 mt-2">
                    <div className="w-10 h-10 rounded-full bg-accent mr-3 flex-shrink-0 flex items-center justify-center">
                      {step.icon}
                    </div>
                    <p className="text-gray-600 text-sm pt-2">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Desktop View - Horizontal flowing layout */}
          <div className="hidden md:block relative">
            {/* Step Boxes */}
            <div className="grid grid-cols-4 gap-2 relative steps-grid">
              {steps.map((step, index) => (
                <div 
                  key={index}
                  ref={addToStepsRef}
                  className="flex flex-col items-center"
                >
                  {/* Step Icon */}
                  <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center shadow-lg mb-3">
                    {step.icon}
                  </div>
                  
                  {/* Content */}
                  <div className="text-center px-4">
                    <h3 className="text-lg font-bold text-black mb-1">{step.title}</h3>
                    <p className="text-gray-600 text-sm mb-1">{step.description}</p>

                    {/* Triangle under each step */}
                    <svg 
                      className="w-full h-6 overflow-visible"
                      viewBox="0 0 100 20"
                      preserveAspectRatio="none"
                    >
                      <polygon 
                        points="45,20 50,10 55,20" 
                        fill="none" 
                        stroke="rgba(255, 0, 0, 0.6)" 
                        strokeWidth="1" 
                        className="step-triangle"
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks; 