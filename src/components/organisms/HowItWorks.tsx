import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiFileText, FiCheckSquare, FiLifeBuoy, FiDollarSign, FiArrowDown, FiArrowUp } from 'react-icons/fi';
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
  const pathRef = useRef<SVGPathElement>(null);
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
      description: "Submit your funding request through our simple form"
    },
    {
      icon: <IconWrapper name="FiCheckSquare" size={24} className="text-white" />,
      title: "Funding Terms",
      description: "We'll create a funding agreement with clear terms"
    },
    {
      icon: <IconWrapper name="FiLifeBuoy" size={24} className="text-white" />,
      title: "Funding Review",
      description: "Our team will review and validate your funding needs"
    },
    {
      icon: <IconWrapper name="FiDollarSign" size={24} className="text-white" />,
      title: "Fast Funding",
      description: "Receive your funding within 48 hours or less"
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
          
          // Add subtle floating effect to title
          gsap.to(titleRef.current, {
            y: 5,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
          });
        }
      }
      
      // Path animation using strokeDasharray and strokeDashoffset
      if (pathRef.current) {
        // Get the total length of the path
        const pathLength = pathRef.current.getTotalLength();
        
        // Initialize the path as hidden
        gsap.set(pathRef.current, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength
        });
        
        // Animate the path drawing as the user scrolls
        gsap.to(pathRef.current, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "bottom 70%",
            scrub: 0.5, // Smoother scrubbing effect
          }
        });
        
        // Add thickness animation that responds to scroll
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 70%",
          scrub: 0.3,
          onUpdate: (self) => {
            // Grow from 2 to 6 pixels as scroll progresses
            const thickness = 2 + (self.progress * 4);
            gsap.set(pathRef.current, { strokeWidth: thickness });
          }
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
            delay: 0.1 + (index * 0.1),
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          });
          
          // Pulse animation for step number
          const stepNumber = step.querySelector('.step-number');
          if (stepNumber) {
            gsap.to(stepNumber, {
              scale: 1.2,
              duration: 0.3,
              yoyo: true,
              repeat: 1,
              delay: 0.3 + (index * 0.1),
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 80%",
                toggleActions: "play none none none"
              }
            });
          }
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
            delay: 0.1 + (index * 0.1),
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
      className="relative py-10 bg-background overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-accent/5 rounded-full -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full -ml-48 -mb-48" />
      
      <div className="container relative z-10">
        <h2 
          ref={titleRef}
          className="text-3xl md:text-4xl font-bold text-center mb-10 text-black"
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
                  <div className="step-number flex-shrink-0 mr-3 text-primary text-xl font-bold">
                    {index + 1}
                  </div>
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
          <div className="grid grid-cols-4 gap-4 relative pt-8 steps-grid">
            {steps.map((step, index) => (
              <div 
                key={index}
                ref={addToStepsRef}
                className="flex flex-col items-center"
              >
                {/* Circle with number */}
                <div 
                  className="step-number text-primary text-xl font-bold mb-4 z-10"
                >
                  {index + 1}
                </div>
                
                {/* Step Icon */}
                <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center shadow-lg mb-3">
                  {step.icon}
                </div>
                
                {/* Content */}
                <div className="text-center px-4">
                  <h3 className="text-lg font-bold text-black mb-1">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* SVG Path below all content */}
          <div className="mt-4 relative">
            <svg 
              className="w-full h-20 overflow-visible"
              viewBox="0 0 1600 120"
              preserveAspectRatio="none"
            >
              <path
                ref={pathRef}
                d="M0,60 C100,30 150,90 200,60 C250,30 300,90 350,60 C400,30 450,90 500,60 C550,30 600,90 650,60 C700,30 750,90 800,60 C850,30 900,90 950,60 C1000,30 1050,90 1100,60 C1150,30 1200,90 1250,60 C1300,30 1350,90 1400,60 C1450,30 1500,90 1550,60 C1600,30 1600,60"
                fill="none"
                stroke="#FF0000"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks; 