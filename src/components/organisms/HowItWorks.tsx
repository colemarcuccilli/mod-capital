import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { FiUserPlus, FiFileText, FiUsers, FiCheckCircle } from 'react-icons/fi';
import IconWrapper from '../atoms/IconWrapper';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const HowItWorks: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  
  const steps: Step[] = [
    {
      icon: <IconWrapper name="FiUserPlus" size={28} className="text-white" />,
      title: "Sign up or contact us",
      description: "Create an account or reach out to our team to get started with your funding journey."
    },
    {
      icon: <IconWrapper name="FiFileText" size={28} className="text-white" />,
      title: "Share your funding needs",
      description: "Tell us about your project, required funding amount, timeline, and any specific requirements."
    },
    {
      icon: <IconWrapper name="FiUsers" size={28} className="text-white" />,
      title: "Get matched with lenders",
      description: "We'll connect you with the most suitable lenders from our vetted network for your specific needs."
    },
    {
      icon: <IconWrapper name="FiCheckCircle" size={28} className="text-white" />,
      title: "Negotiate and close the deal",
      description: "Finalize terms with your chosen lender and complete the transaction with our support."
    }
  ];
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      if (titleRef.current) {
        gsap.to(titleRef.current.querySelector('span'), {
          backgroundSize: "100% 100%",
          duration: 1,
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
          }
        });
      }
      
      // Path animation with scroll trigger
      if (pathRef.current) {
        const pathLength = pathRef.current.getTotalLength();
        
        // Set initial state - path is hidden
        gsap.set(pathRef.current, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength
        });
        
        // Animate the path drawing on scroll
        gsap.to(pathRef.current, {
          strokeDashoffset: 0,
          duration: 2,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "bottom 70%",
            scrub: 0.5,
          }
        });
      }
    }, sectionRef);
    
    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
  
  // Step content positioning
  const getContentPosition = (index: number) => {
    // Fixed positions for dots on the path
    const positions = [
      { top: '120px', left: '150px' },   // #1 below line
      { top: '20px', left: '450px' },    // #2 at top
      { top: '280px', left: '760px' },   // #3 at bottom
      { top: '100px', left: '1050px' }   // #4 to the right
    ];
    
    return positions[index];
  };
  
  return (
    <section 
      ref={sectionRef} 
      className="relative py-20 bg-background overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-accent/5 rounded-full -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full -ml-48 -mb-48" />
      
      <div className="container relative z-10">
        <h2 
          ref={titleRef}
          className="text-3xl md:text-5xl font-bold text-center mb-32"
        >
          How It <span className="text-accent px-2 py-1 bg-gradient-to-r from-accent/20 to-accent/20 bg-no-repeat bg-left-bottom">Works</span>
        </h2>
        
        <div className="relative max-w-6xl mx-auto" style={{ minHeight: "600px" }}>
          {/* Mobile View (Steps in a simple list) */}
          <div className="block md:hidden space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 mr-4 w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-bold text-primary">{step.title}</h3>
                </div>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
          
          {/* Desktop View (Path with dots and text) */}
          <div className="hidden md:block">
            {/* SVG Path for Animation - Extended path */}
            <svg 
              className="absolute inset-0 w-full h-full overflow-visible"
              preserveAspectRatio="none"
              viewBox="0 0 1200 400"
            >
              <path
                ref={pathRef}
                d="M50,80 C250,20 400,300 600,250 C800,200 1000,50 1150,100"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="4"
                strokeDasharray="none"
                opacity="0.8"
              />
            </svg>
            
            {/* Dots on the path */}
            {steps.map((step, index) => {
              const position = getContentPosition(index);
              
              return (
                <div 
                  key={`dot-${index}`}
                  className="absolute w-10 h-10 rounded-full bg-accent shadow-lg flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 z-20"
                  style={{ 
                    top: position.top, 
                    left: position.left 
                  }}
                >
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white text-accent font-bold text-sm">
                    {index + 1}
                  </div>
                </div>
              );
            })}
            
            {/* Text boxes with static positioning */}
            <div className="absolute top-[150px] left-[20px] z-10 w-[240px]">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-2 text-primary">{steps[0].title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{steps[0].description}</p>
              </div>
            </div>
            
            {/* Box 2 moved to the right of its number */}
            <div className="absolute top-[-30px] left-[480px] z-10 w-[240px]">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-2 text-primary">{steps[1].title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{steps[1].description}</p>
              </div>
            </div>
            
            <div className="absolute top-[310px] left-[660px] z-10 w-[240px]">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-2 text-primary">{steps[2].title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{steps[2].description}</p>
              </div>
            </div>
            
            {/* Box 4 moved to the right of its number */}
            <div className="absolute top-[50px] left-[1080px] z-10 w-[240px]">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-2 text-primary">{steps[3].title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{steps[3].description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks; 