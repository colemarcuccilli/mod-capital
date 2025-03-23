import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiArrowRight } from 'react-icons/fi';
import IconWrapper from '../atoms/IconWrapper';

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
      title: "Double Close",
      description: "Fund two transactions seamlessly with our double closing solutions.",
      icon: "🏠🔄🏠",
      path: "/double-close",
      color: "from-blue-500 to-blue-700"
    },
    {
      title: "EMD",
      description: "Secure your real estate deals with earnest money deposit funding.",
      icon: "💰🔒",
      path: "/emd",
      color: "from-green-500 to-green-700"
    },
    {
      title: "Gap",
      description: "Bridge the gap in your real estate financing with flexible terms.",
      icon: "🌉💵",
      path: "/gap",
      color: "from-purple-500 to-purple-700"
    },
    {
      title: "Private Money Loans",
      description: "Access our network of private lenders for your real estate projects.",
      icon: "🏦🤝",
      path: "/private-money",
      color: "from-orange-500 to-orange-700"
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
              start: "top 80%",
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
              start: "top 80%",
            }
          }
        );
      }
      
      // Cards animation
      if (cardRefs.current.length > 0) {
        gsap.set(cardRefs.current, { y: 100, opacity: 0 });
        
        cardRefs.current.forEach((card, index) => {
          if (card) {
            // Timeline for each card
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
              }
            });
            
            // Main card animation
            tl.to(card, {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: "power2.out",
              delay: index * 0.1
            });
            
            // Card content animations
            const iconEl = card.querySelector('.card-icon');
            const titleEl = card.querySelector('.card-title');
            const descEl = card.querySelector('.card-desc');
            const btnEl = card.querySelector('.card-btn');
            
            if (iconEl && titleEl && descEl && btnEl) {
              tl.from(iconEl, { scale: 0, duration: 0.4, ease: "back.out(1.7)" }, "-=0.2")
                .from(titleEl, { y: 20, opacity: 0, duration: 0.3 }, "-=0.2")
                .from(descEl, { y: 20, opacity: 0, duration: 0.3 }, "-=0.2")
                .from(btnEl, { y: 20, opacity: 0, duration: 0.3 }, "-=0.2");
            }
            
            // Setup hover animation
            const contentFront = card.querySelector('.card-front-content');
            const contentBack = card.querySelector('.card-back-content');
            
            if (contentFront && contentBack) {
              // Set initial state
              gsap.set(contentBack, { opacity: 0 });
              
              // Hover animation
              card.addEventListener('mouseenter', () => {
                gsap.to(contentFront, { y: -20, opacity: 0, duration: 0.3 });
                gsap.to(contentBack, { y: 0, opacity: 1, duration: 0.3, delay: 0.1 });
                gsap.to(card, { 
                  y: -10, 
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
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
    <section ref={sectionRef} className="relative py-24 bg-white">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-0 w-64 h-64 rounded-full bg-primary/5 -ml-32"></div>
        <div className="absolute bottom-20 right-0 w-80 h-80 rounded-full bg-accent/5 -mr-40"></div>
      </div>
      
      <div className="container relative z-10">
        <h2 
          ref={titleRef}
          className="text-3xl md:text-5xl font-bold text-center mb-20"
        >
          Our <span className="text-accent bg-gradient-to-r from-accent/20 to-accent/20 bg-[length:100%_40%] bg-bottom bg-no-repeat px-2">Funding</span> Solutions
        </h2>
        
        <div 
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {fundingTypes.map((type, index) => (
            <div 
              key={index}
              ref={addToCardRefs}
              className="funding-card relative h-80 rounded-xl shadow-lg cursor-pointer overflow-hidden bg-white transition-all duration-300"
            >
              {/* Card background with gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}></div>
              
              {/* Front content */}
              <div className="card-front-content absolute inset-0 p-6 flex flex-col items-center justify-center text-center z-10">
                <div className="card-icon text-5xl mb-4">{type.icon}</div>
                <h3 className="card-title text-2xl font-bold mb-3 text-primary">{type.title}</h3>
                <p className="card-desc text-sm text-gray-600">{type.description}</p>
              </div>
              
              {/* Back content */}
              <div className="card-back-content absolute inset-0 p-6 flex flex-col items-center justify-center text-center bg-white z-10">
                <h3 className="text-2xl font-bold mb-4 text-accent">{type.title}</h3>
                <p className="text-sm mb-6">{type.description}</p>
                <Link 
                  to={type.path}
                  className="card-btn flex items-center justify-center space-x-2 bg-accent text-white py-3 px-6 rounded-lg hover:bg-accent/90 transition-colors"
                >
                  <span>Learn More</span>
                  {arrowRightIcon}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FundingTypes; 