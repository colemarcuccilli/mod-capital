import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { FiPlus, FiMinus, FiHelpCircle } from 'react-icons/fi';
import IconWrapper from '../atoms/IconWrapper';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, Flip);

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
  
  const faqs: FAQ[] = [
    {
      question: "What does it cost?",
      answer: "We operate on an offer first basis, meaning YOU name your price. If we need to negotiate, we will reach out!"
    },
    {
      question: "Are there any upfront fees?",
      answer: "We do not charge any upfront fees, our fee is taken at closing or built into the loan amount."
    },
    {
      question: "How long does it take to get a deal funded?",
      answer: "We typically need 48 hours from submission to funding, however we will fund as fast as possible, and in some cases, same day. If you have a deal, your best bet is to submit it as soon as possible so we can review it and get the process started."
    },
    {
      question: "Does Mod Capital fund the deals?",
      answer: "Sometimes we will directly fund your deal, or we will bring in a capital partner to get it done!"
    }
  ];
  
  // Toggle FAQ expansion with FLIP animation
  const toggleFAQ = (index: number) => {
    const faqItem = faqItemsRef.current[index];
    if (!faqItem) return;
    
    // First, collapse any open FAQs
    faqItemsRef.current.forEach((item, i) => {
      if (i !== index && item?.classList.contains('expanded')) {
        // Get the FLIP state before changing anything
        const state = Flip.getState(faqItemsRef.current);
        
        // Find elements to animate
        const answer = item.querySelector('.faq-answer');
        const plusIcon = item.querySelector('.plus-icon');
        const minusIcon = item.querySelector('.minus-icon');
        
        if (answer && plusIcon && minusIcon) {
          // Collapse animation
          gsap.to(answer, {
            height: 0,
            marginTop: 0,
            duration: 0.4,
            ease: "power3.out"
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
        
        // Remove expanded class
        item.classList.remove('expanded');
        
        // Apply FLIP to smoothly reposition all elements
        Flip.from(state, {
          duration: 0.6,
          ease: "power2.inOut",
          absolute: true,
          onComplete: () => {
            // Create gentle bounce effect
            gsap.fromTo(item, 
              { y: 0 },
              { y: -5, duration: 0.2, ease: "power1.out", yoyo: true, repeat: 1 }
            );
          }
        });
      }
    });
    
    // Now toggle the target FAQ
    const isExpanded = faqItem.classList.contains('expanded');
    
    // Get the FLIP state before changing anything
    const state = Flip.getState(faqItemsRef.current);
    
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
        duration: 0.4,
        ease: "power3.out"
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
      
      // Remove expanded class
      faqItem.classList.remove('expanded');
    } else {
      // Expand animation
      gsap.to(answer, {
        height: "auto",
        marginTop: "0.75rem",
        duration: 0.4,
        ease: "power3.out"
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
      
      // Add expanded class
      faqItem.classList.add('expanded');
    }
    
    // Apply FLIP to smoothly reposition all elements
    Flip.from(state, {
      duration: 0.6,
      ease: "power2.inOut",
      absolute: true,
      onComplete: () => {
        // Create gentle hover effect for expanded item
        if (!isExpanded) {
          gsap.fromTo(faqItem, 
            { y: 0 }, 
            { 
              y: -10, 
              duration: 0.4, 
              ease: "power1.out",
              yoyo: true, 
              repeat: 1 
            }
          );
        }
      }
    });
  };
  
  useEffect(() => {
    // Don't run animations if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    const ctx = gsap.context(() => {
      // Create floating particle effect for background (only for desktop)
      if (!prefersReducedMotion && window.innerWidth >= 768) {
        const particles = gsap.utils.toArray<HTMLElement>('.particle');
        particles.forEach((particle) => {
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
              backgroundSize: "0% 100%",
              y: 40,
              opacity: 0,
              rotation: 5
            },
            {
              backgroundSize: "100% 100%",
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
      
      // Orbital FAQ animation - each item orbits in from sides
      if (faqItemsRef.current.length) {
        faqItemsRef.current.forEach((faqItem, index) => {
          if (!faqItem) return;
          
          // Staggered orbital entrance animation
          const xOffset = index % 2 === 0 ? -300 : 300;
          const rotation = index % 2 === 0 ? 20 : -20;
          
          gsap.fromTo(faqItem,
            { 
              x: xOffset, 
              y: 40,
              opacity: 0,
              rotation: rotation,
              scale: 0.8
            },
            { 
              x: 0, 
              y: 0,
              opacity: 1,
              rotation: 0,
              scale: 1,
              duration: 1,
              delay: 0.1 * index,
              ease: "power3.out",
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
            gsap.set(answer, { height: 0, marginTop: 0 });
            gsap.set(minusIcon, { autoAlpha: 0 });
          }
          
          // Add hover effect for each FAQ item
          faqItem.addEventListener('mouseenter', () => {
            if (!faqItem.classList.contains('expanded')) {
              gsap.to(faqItem, {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                y: -5,
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                duration: 0.3,
                ease: "power2.out"
              });
            }
          });
          
          faqItem.addEventListener('mouseleave', () => {
            if (!faqItem.classList.contains('expanded')) {
              gsap.to(faqItem, {
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                y: 0,
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                duration: 0.3,
                ease: "power2.out"
              });
            }
          });
          
          // Add click handler
          faqItem.addEventListener('click', () => toggleFAQ(index));
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
      id="faqs"
      className="relative py-20 bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden"
    >
      {/* Particle Background */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="particle absolute w-6 h-6 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: `rgba(${Math.floor(Math.random() * 100) + 155}, ${Math.floor(Math.random() * 100) + 155}, ${Math.floor(Math.random() * 100) + 155}, 0.1)`,
              transform: `scale(${Math.random() * 2 + 0.5})`,
              opacity: Math.random() * 0.5 + 0.1
            }}
          />
        ))}
      </div>
      
      {/* Parallax Overlay */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 opacity-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, rgba(16, 24, 39, 0.05) 100%)',
        }}
      />
      
      {/* Large decorative ring */}
      <div className="absolute right-0 top-0 w-96 h-96 rounded-full border-4 border-accent/10 -mr-48 -mt-48 transform rotate-45" />
      <div className="absolute left-0 bottom-0 w-72 h-72 rounded-full border-4 border-primary/10 -ml-36 -mb-36 transform -rotate-12" />
      
      <div className="container relative z-10">
        <div className="text-center">
          <div className="flex items-center justify-center mb-3">
            <div className="relative">
              <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full"></div>
              <IconWrapper name="FiHelpCircle" size={32} className="text-accent relative z-10" />
            </div>
          </div>
          <h2 
            ref={titleRef}
            className="text-3xl md:text-4xl font-bold mb-2"
          >
            <span className="bg-gradient-to-r from-accent/30 to-accent/30 bg-[length:0%_40%] bg-bottom bg-no-repeat px-2">
              Frequently Asked Questions
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12">
            Get the answers to the most common questions about our funding solutions.
          </p>
        </div>
        
        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto relative">
          {faqs.map((faq, index) => (
            <div
              key={index}
              ref={addToFaqItemsRef}
              className="faq-item backdrop-blur-sm bg-white/85 rounded-xl shadow-md p-5 mb-4 cursor-pointer hover:shadow-lg transition-all duration-300 will-change-transform"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg md:text-xl font-semibold text-primary pr-4">
                  {faq.question}
                </h3>
                <div className="relative flex-shrink-0 w-6 h-6">
                  <div className="plus-icon absolute inset-0 transition-opacity duration-300">
                    <IconWrapper name="FiPlus" size={24} className="text-accent" />
                  </div>
                  <div className="minus-icon absolute inset-0 transition-opacity duration-300">
                    <IconWrapper name="FiMinus" size={24} className="text-accent" />
                  </div>
                </div>
              </div>
              <div className="faq-answer overflow-hidden h-0 mt-0">
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQs; 