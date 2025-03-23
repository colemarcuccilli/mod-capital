import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiUsers, FiBarChart2, FiCheck } from 'react-icons/fi';
import IconWrapper from '../atoms/IconWrapper';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface ValueItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ValueProposition: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  
  const values: ValueItem[] = [
    {
      icon: <IconWrapper name="FiUsers" size={40} className="text-accent" />,
      title: "Personalized Matchmaking",
      description: "We pair you with the right lenders for your specific needs and project requirements."
    },
    {
      icon: <IconWrapper name="FiBarChart2" size={40} className="text-accent" />,
      title: "Creative Financing Expertise",
      description: "Our team specializes in developing customized solutions for even the most complex deals."
    },
    {
      icon: <IconWrapper name="FiCheck" size={40} className="text-accent" />,
      title: "Vetted Network",
      description: "Access our network of trusted lenders and investors who have been thoroughly vetted."
    }
  ];
  
  useEffect(() => {
    // Title animation
    if (titleRef.current) {
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      });
    }
    
    // Cards animation
    if (cardsRef.current && cardsRef.current.children.length > 0) {
      const cards = Array.from(cardsRef.current.children);
      
      cards.forEach((card, index) => {
        const direction = index % 2 === 0 ? -100 : 100;
        
        gsap.from(card, {
          opacity: 0,
          x: direction,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        });
      });
    }
    
    return () => {
      // Clean up ScrollTrigger
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
  
  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="container">
        <h2 
          ref={titleRef}
          className="text-3xl md:text-4xl font-bold text-center mb-16"
        >
          Why Choose <span className="text-accent">Mod Capital</span>
        </h2>
        
        <div 
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {values.map((value, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-lg p-8 transform transition-transform duration-300 hover:scale-105"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6 mx-auto">
                {value.icon}
              </div>
              
              <h3 className="text-xl font-bold text-center mb-4">{value.title}</h3>
              
              <p className="text-gray-600 text-center">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProposition; 