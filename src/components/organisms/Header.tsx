import React, { useEffect, useRef } from 'react';
import Logo from '../atoms/Logo';
import Navigation from '../molecules/Navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Header: React.FC = () => {
  const headerRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    // Initial animation
    if (headerRef.current) {
      gsap.from(headerRef.current, {
        y: -100,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      });
    }
    
    // Header scroll effect
    const header = headerRef.current;
    
    if (header) {
      ScrollTrigger.create({
        start: 'top top',
        end: 99999, // A large number to keep it active
        onUpdate: (self) => {
          const scrolled = self.progress > 0;
          
          if (scrolled) {
            header.classList.add('bg-white', 'shadow-md');
            header.classList.remove('bg-transparent');
          } else {
            header.classList.remove('bg-white', 'shadow-md');
            header.classList.add('bg-transparent');
          }
        }
      });
    }
    
    return () => {
      // Clean up the ScrollTrigger
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
  
  return (
    <header 
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-30 transition-all duration-300 py-4"
    >
      <div className="container flex justify-between items-center">
        <Logo />
        <Navigation />
      </div>
    </header>
  );
};

export default Header; 