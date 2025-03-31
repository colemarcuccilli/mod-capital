import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiArrowRight } from 'react-icons/fi';
import IconWrapper from '../atoms/IconWrapper';
import AnimatedButton from '../atoms/AnimatedButton';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface FundingType {
  title: string;
  description: string;
  icon: string;
  path: string;
  color: string;
}

const FundingTypes: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Reset refs array
  cardRefs.current = [];
  
  // Add to card refs array
  const addToCardRefs = (el: HTMLDivElement | null) => {
    if (el && !cardRefs.current.includes(el)) {
      cardRefs.current.push(el);
    }
  };
  
  const fundingTypes: FundingType[] = [
    {
      title: "Double Close Funding",
      description: "Fund two transactions seamlessly with our double closing solutions.",
      icon: "🏠🔄🏠",
      path: "/double-close",
      color: "from-accent to-secondary"
    },
    {
      title: "EMD Funding",
      description: "Secure your real estate deals with earnest money deposit funding.",
      icon: "💰🔒",
      path: "/emd",
      color: "from-accent to-accent-secondary"
    },
    {
      title: "Gap Funding",
      description: "Bridge the gap in your real estate financing with flexible terms.",
      icon: "🌉💵",
      path: "/gap",
      color: "from-secondary to-accent-secondary"
    },
    {
      title: "Private Money Loans",
      description: "Access our network of private lenders for your real estate projects.",
      icon: "🏦🤝",
      path: "/private-money",
      color: "from-accent to-secondary"
    }
  ];
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation with text reveal
      if (titleRef.current) {
        const titleElements = titleRef.current.querySelectorAll('span');
        
        gsap.fromTo(titleRef.current, 
          { opacity: 0, y: 30 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.8,
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top 85%",
            }
          }
        );
        
        gsap.fromTo(titleElements[1], 
          { backgroundSize: "0% 100%" },
          { 
            backgroundSize: "100% 100%", 
            duration: 1,
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top 85%",
            }
          }
        );
      }
      
      // Cards animation
      if (cardRefs.current.length > 0) {
        gsap.set(cardRefs.current, { y: 60, opacity: 0 });
        
        cardRefs.current.forEach((card, index) => {
          if (card) {
            // Timeline for each card
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: card,
                start: "top 90%",
              }
            });
            
            // Main card animation
            tl.to(card, {
              y: 0,
              opacity: 1,
              duration: 0.5,
              ease: "power2.out",
              delay: index * 0.08
            });
            
            // Card content animations
            const iconEl = card.querySelector('.card-icon');
            const titleEl = card.querySelector('.card-title');
            const descEl = card.querySelector('.card-desc');
            const btnEl = card.querySelector('.card-btn');
            
            if (iconEl && titleEl && descEl && btnEl) {
              tl.from(iconEl, { scale: 0, duration: 0.3, ease: "back.out(1.7)" }, "-=0.2")
                .from(titleEl, { y: 15, opacity: 0, duration: 0.2 }, "-=0.1")
                .from(descEl, { y: 15, opacity: 0, duration: 0.2 }, "-=0.1")
                .from(btnEl, { y: 15, opacity: 0, duration: 0.2 }, "-=0.1");
            }
            
            // Setup hover animation
            const contentFront = card.querySelector('.card-front-content');
            const contentBack = card.querySelector('.card-back-content');
            
            if (contentFront && contentBack) {
              // Set initial state
              gsap.set(contentBack, { opacity: 0 });
              
              // Hover animation - enhanced for mobile
              let cardHoverTl: gsap.core.Timeline;

              // Click/tap handler for mobile
              const handleCardTap = () => {
                const isFrontVisible = Number(gsap.getProperty(contentFront, 'opacity')) > 0.5;
                
                if (isFrontVisible) {
                  gsap.to(contentFront, { y: -20, opacity: 0, duration: 0.3 });
                  gsap.to(contentBack, { y: 0, opacity: 1, duration: 0.3, delay: 0.1 });
                  gsap.to(card, { 
                    y: -5, 
                    boxShadow: "0 20px 30px -8px rgba(0, 0, 0, 0.2)",
                    duration: 0.3
                  });
                } else {
                  gsap.to(contentFront, { y: 0, opacity: 1, duration: 0.3, delay: 0.1 });
                  gsap.to(contentBack, { y: 20, opacity: 0, duration: 0.3 });
                  gsap.to(card, { 
                    y: 0, 
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    duration: 0.3
                  });
                }
              };
              
              // Desktop hover
              card.addEventListener('mouseenter', () => {
                gsap.to(contentFront, { y: -20, opacity: 0, duration: 0.3 });
                gsap.to(contentBack, { y: 0, opacity: 1, duration: 0.3, delay: 0.1 });
                gsap.to(card, { 
                  y: -5, 
                  boxShadow: "0 20px 30px -8px rgba(0, 0, 0, 0.2)",
                  duration: 0.3
                });
              });
              
              card.addEventListener('mouseleave', () => {
                gsap.to(contentFront, { y: 0, opacity: 1, duration: 0.3, delay: 0.1 });
                gsap.to(contentBack, { y: 20, opacity: 0, duration: 0.3 });
                gsap.to(card, { 
                  y: 0, 
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  duration: 0.3
                });
              });
              
              // Mobile tap
              card.addEventListener('touchstart', handleCardTap);
            }
          }
        });
      }
    }, sectionRef);
    
    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
  
  // Create arrow right icon
  const arrowRightIcon = <IconWrapper name="FiArrowRight" />;
  
  return (
    <section 
      ref={sectionRef} 
      className="relative py-20 md:py-32 bg-background" 
      id="funding-types"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-0 w-64 h-64 rounded-full bg-primary/5 -ml-32"></div>
        <div className="absolute bottom-20 right-0 w-80 h-80 rounded-full bg-accent/5 -mr-40"></div>
      </div>
      
      <div className="container relative z-10">
        <h2 
          ref={titleRef}
          className="text-3xl md:text-4xl font-bold text-center mb-10 text-primary"
        >
          Our <span className="text-accent">Funding</span> Solutions
        </h2>
        
        <div 
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {fundingTypes.map((type, index) => (
            <div 
              key={index}
              ref={addToCardRefs}
              className="funding-card relative h-64 rounded-xl shadow-lg cursor-pointer overflow-hidden bg-background transition-all duration-300 group"
            >
              {/* Card background with gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}></div>
              
              {/* Front content */}
              <div className="card-front-content absolute inset-0 p-5 flex flex-col items-center justify-center text-center z-10">
                <div className="card-icon text-4xl mb-3">{type.icon}</div>
                <h3 className="card-title text-xl font-bold mb-2 text-primary">{type.title}</h3>
                <p className="card-desc text-sm text-primary/80">{type.description}</p>
              </div>
              
              {/* Back content */}
              <div className="card-back-content absolute inset-0 p-5 flex flex-col items-center justify-center text-center bg-background z-10">
                <h3 className="text-xl font-bold mb-3 text-accent">{type.title}</h3>
                <p className="text-sm mb-4 text-primary/80">{type.description}</p>
                <AnimatedButton 
                  to={type.path}
                  className="card-btn flex items-center justify-center space-x-2 text-sm light-btn"
                >
                  Request Funding
                </AnimatedButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FundingTypes; 