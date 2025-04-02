import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiPlus, FiMinus, FiHelpCircle } from 'react-icons/fi';
import IconWrapper from '../atoms/IconWrapper';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface FAQ {
  question: string;
  answer: string;
}

const FAQs: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const faqItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const overlayRef = useRef<HTMLDivElement>(null);
  
  // Reset refs
  faqItemsRef.current = [];
  
  // Add to refs
  const addToFaqItemsRef = (el: HTMLDivElement | null) => {
    if (el && !faqItemsRef.current.includes(el)) {
      faqItemsRef.current.push(el);
    }
  };
  
  // Updated FAQs Data
  const faqs: FAQ[] = [
    {
      question: "What do we charge?",
      answer: "Domentra operates primarily on a Matchmaking Fee model. This fee can be paid upfront or, more commonly, added to the total loan amount and paid at closing."
    },
    {
      question: "Are there any upfront fees?",
      answer: "Typically, no. Our standard Matchmaking Fee is usually incorporated into the loan and paid at closing. In specific circumstances, an upfront fee might be discussed, but it's not our standard practice."
    },
    {
      question: "How long does it take to get funded?",
      answer: "Funding times vary, but after contracts are signed by the Borrower, Lender, and Domentra, the lender typically funds the deal promptly, often within 48 hours or less depending on the specifics."
    },
    {
      question: "Does Domentra fund the deals?",
      answer: "Domentra connects borrowers with capital partners (lenders). While Domentra facilitates the process and is a party to the contracts, the actual funding comes directly from the matched lender."
    },
    {
      question: "What is the funding process?",
      answer: "1. Borrower Submits Funding Request. 2. Domentra contacts them with questions, negotiation, or status updates. 3. Once matched, Borrower, Lender & Domentra Sign Contracts. 4. Lender funds the borrower's deal."
    }
  ];
  
  // Toggle FAQ expansion with improved animation
  const toggleFAQ = (index: number) => {
    const faqItem = faqItemsRef.current[index];
    if (!faqItem) return;
    
    // First, collapse any open FAQs
    faqItemsRef.current.forEach((item, i) => {
      if (i !== index && item?.classList.contains('expanded')) {
        // Find elements to animate
        const answer = item.querySelector('.faq-answer');
        const plusIcon = item.querySelector('.plus-icon');
        const minusIcon = item.querySelector('.minus-icon');
        
        if (answer && plusIcon && minusIcon) {
          // Collapse animation - with fixed values to prevent layout shifts
          gsap.to(answer, {
            height: 0,
            marginTop: 0,
            duration: 0.3,
            ease: "power2.out",
            clearProps: "height"
          });
          
          // Icon animation
          gsap.to(plusIcon, {
            autoAlpha: 1,
            duration: 0.2
          });
          gsap.to(minusIcon, {
            autoAlpha: 0,
            duration: 0.2
          });
        }
        
        // Reset any transforms or styles 
        gsap.to(item, {
          y: 0, 
          backgroundColor: '#FFFFFA',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
          duration: 0.3
        });
        
        // Remove expanded class
        item.classList.remove('expanded');
      }
    });
    
    // Now toggle the target FAQ
    const isExpanded = faqItem.classList.contains('expanded');
    
    // Find elements to animate
    const answer = faqItem.querySelector('.faq-answer');
    const plusIcon = faqItem.querySelector('.plus-icon');
    const minusIcon = faqItem.querySelector('.minus-icon');
    
    if (!answer || !plusIcon || !minusIcon) return;
    
    if (isExpanded) {
      // Collapse animation
      gsap.to(answer, {
        height: 0,
        marginTop: 0,
        duration: 0.3,
        ease: "power2.out",
        clearProps: "height" // This is important to prevent layout issues
      });
      
      // Icon animation
      gsap.to(plusIcon, {
        autoAlpha: 1,
        duration: 0.2
      });
      gsap.to(minusIcon, {
        autoAlpha: 0,
        duration: 0.2
      });
      
      // Reset any transforms or styles
      gsap.to(faqItem, {
        y: 0,
        backgroundColor: '#FFFFFA',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
        duration: 0.3
      });
      
      // Remove expanded class
      faqItem.classList.remove('expanded');
    } else {
      // First measure the content height properly
      gsap.set(answer, { 
        display: 'block',
        autoAlpha: 0,
        height: 'auto'
      });
      
      // Get the natural height (with proper type assertion)
      const height = (answer as HTMLElement).offsetHeight;
      
      // Reset and animate to the precise height
      gsap.set(answer, { 
        autoAlpha: 0,
        height: 0,
        marginTop: 0
      });
      
      // Expand animation with precise height
      gsap.to(answer, {
        height: height,
        autoAlpha: 1,
        marginTop: "0.75rem",
        duration: 0.3,
        ease: "power2.out"
      });
      
      // Icon animation
      gsap.to(plusIcon, {
        autoAlpha: 0,
        duration: 0.2
      });
      gsap.to(minusIcon, {
        autoAlpha: 1,
        duration: 0.2
      });
      
      // Add a subtle highlight to the expanded item
      gsap.to(faqItem, {
        backgroundColor: '#FFFFFA',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
        duration: 0.3
      });
      
      // Add expanded class
      faqItem.classList.add('expanded');
    }
  };
  
  useEffect(() => {
    // Don't run animations if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    const ctx = gsap.context(() => {
      // Create floating particle effect for background (only for desktop)
      if (!prefersReducedMotion && window.innerWidth >= 768) {
        const particles = gsap.utils.toArray<HTMLElement>('.particle');
        particles.forEach((particle) => {
          if (particle) {
            const xRange = gsap.utils.random(10, 30);
            const yRange = gsap.utils.random(10, 30);
            const rotRange = gsap.utils.random(10, 90);
            const duration = gsap.utils.random(5, 10);
            
            gsap.to(particle, {
              x: `+=${xRange}`,
              y: `+=${yRange}`,
              rotation: rotRange,
              duration: duration,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut"
            });
          }
        });
      }
      
      // Parallax overlay
      if (overlayRef.current) {
        gsap.to(overlayRef.current, {
          opacity: 0.7,
          yPercent: -30,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          }
        });
      }
      
      // Title animation
      if (titleRef.current) {
        const titleSpan = titleRef.current.querySelector('span');
        if (titleSpan) {
          gsap.fromTo(titleSpan, 
            { 
              y: 40,
              opacity: 0,
              rotation: 5
            },
            {
              y: 0,
              opacity: 1,
              rotation: 0,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: titleRef.current,
                start: "top 85%",
              }
            }
          );
        }
      }
      
      // FAQ item entrance animations
      if (faqItemsRef.current.length) {
        faqItemsRef.current.forEach((faqItem, index) => {
          if (!faqItem) return;
          
          // Alternating slide-in animation from left and right
          const isEven = index % 2 === 0;
          gsap.fromTo(faqItem,
            { 
              x: isEven ? -50 : 50,
              opacity: 0,
              scale: 0.95
            },
            { 
              x: 0,
              opacity: 1,
              scale: 1,
              duration: 0.6,
              delay: 0.1 * index,
              ease: "power2.out",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 75%",
              }
            }
          );
          
          // Initialize answer height and icon state
          const answer = faqItem.querySelector('.faq-answer');
          const minusIcon = faqItem.querySelector('.minus-icon');
          
          if (answer && minusIcon) {
            gsap.set(answer, { height: 0, marginTop: 0, display: 'none' });
            gsap.set(minusIcon, { autoAlpha: 0 });
          }
          
          // Remove hover effect since they're already white
          
          // Add click handler
          const clickHandler = () => toggleFAQ(index);
          faqItem.addEventListener('click', clickHandler);
          
          // Store handler for cleanup
          faqItem.setAttribute('data-handler-index', index.toString());
        });
      }
    }, sectionRef);
    
    return () => {
      // Proper cleanup 
      ctx.revert();
      
      // Clean up event listeners
      faqItemsRef.current.forEach(item => {
        if (item) {
          const index = parseInt(item.getAttribute('data-handler-index') || '-1');
          if (index !== -1) {
            const clickHandler = () => toggleFAQ(index);
            item.removeEventListener('click', clickHandler);
          }
        }
      });
      
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
  
  return (
    <section 
      ref={sectionRef}
      id="faqs"
      className="relative py-20 bg-gray-50 overflow-hidden"
    >
      {/* Particle Background - Use accent (Bittersweet) and secondary (Poix) */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-gray-50 to-gray-100">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="particle absolute w-6 h-6 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              // Use accent and secondary colors with low opacity
              backgroundColor: Math.random() > 0.5 ? 'rgba(255, 102, 102, 0.1)' : 'rgba(201, 87, 229, 0.1)',
              transform: `scale(${Math.random() * 2 + 0.5})`,
              opacity: Math.random() * 0.5 + 0.1
            }}
          />
        ))}
      </div>
      
      {/* Parallax Overlay - Use primary color (Rich Black) */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 opacity-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(13, 19, 33, 0.1) 0%, rgba(13, 19, 33, 0.05) 100%)', // Rich Black
        }}
      />
      
      {/* Large decorative ring - Use accent (Bittersweet) and primary (Rich Black) */}
      <div className="absolute right-0 top-0 w-96 h-96 rounded-full border-4 border-accent/10 -mr-48 -mt-48 transform rotate-45" />
      <div className="absolute left-0 bottom-0 w-72 h-72 rounded-full border-4 border-primary/10 -ml-36 -mb-36 transform -rotate-12" />
      
      <div className="container relative z-10">
        <div className="text-center">
          <div className="flex items-center justify-center mb-3">
            <div className="relative">
              {/* Use accent color (Bittersweet) */}
              <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full"></div>
              <IconWrapper name="FiHelpCircle" size={32} className="text-accent relative z-10" />
            </div>
          </div>
          <h2 
            ref={titleRef}
            // Use primary text color (Rich Black)
            className="text-3xl md:text-4xl font-bold mb-2 text-primary"
          >
            {/* Use accent text color (Bittersweet) */}
            <span className="text-accent">
              Funding Questions
            </span>
          </h2>
          {/* Use primary text color (Rich Black) with opacity */}
          <p className="text-primary/80 max-w-2xl mx-auto mb-12">
            Get answers to the most common questions about our funding solutions and process.
          </p>
        </div>
        
        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto relative">
          {faqs.map((faq, index) => (
            <div
              key={index}
              ref={addToFaqItemsRef}
              // Use background color (Baby Powder) for FAQ item
              className="faq-item backdrop-blur-sm bg-background rounded-xl shadow-md p-5 mb-4 cursor-pointer hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center justify-between">
                {/* Use primary text color (Rich Black) */}
                <h3 className="text-lg md:text-xl font-semibold text-primary pr-4">
                  {faq.question}
                </h3>
                <div className="relative flex-shrink-0 w-6 h-6">
                  {/* Use accent color (Bittersweet) for icons */}
                  <div className="plus-icon absolute inset-0">
                    <IconWrapper name="FiPlus" size={24} className="text-accent" />
                  </div>
                  <div className="minus-icon absolute inset-0 opacity-0">
                    <IconWrapper name="FiMinus" size={24} className="text-accent" />
                  </div>
                </div>
              </div>
              <div className="faq-answer overflow-hidden h-0 mt-0 hidden">
                {/* Use primary text color (Rich Black) with opacity */}
                <p className="text-primary/80">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQs; 