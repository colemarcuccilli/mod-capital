import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
// import Logo from '../atoms/Logo'; // Remove static logo import
import AnimatedDomentraLogo from '../atoms/AnimatedDomentraLogo'; // Import animated logo
import Navigation from '../molecules/Navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Define props for Header
interface HeaderProps {
  toggleNotificationPanel: () => void; // Add the prop type
}

const Header: React.FC<HeaderProps> = ({ toggleNotificationPanel }) => {
  const headerRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    // Existing header animation/scroll logic... 
    // It's important this doesn't conflict with the logo animation start.
    // Ensure header initial animation is quick or logo animation delay accounts for it.
    if (headerRef.current) {
      gsap.from(headerRef.current, {
        y: -100,
        opacity: 0,
        duration: 0.5, // Faster header entrance
        ease: 'power3.out'
      });
    }
    
    const header = headerRef.current;
    if (header) {
      ScrollTrigger.create({
        start: 'top top',
        end: 99999, 
        onUpdate: (self) => {
          const scrolled = self.progress > 0;
          if (scrolled) {
            header.classList.add('bg-background', 'shadow-md');
            header.classList.remove('bg-transparent');
          } else {
            header.classList.remove('bg-background', 'shadow-md');
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
      // Start transparent, transition to background color on scroll
      className="fixed top-0 left-0 right-0 z-30 transition-colors duration-300 py-3 bg-transparent"
    >
      <div className="container flex justify-between items-center">
        {/* Use AnimatedDomentraLogo directly (it contains the Link) */}
        <AnimatedDomentraLogo className="h-10 md:h-12" />
        <Navigation className="flex-grow flex justify-end" toggleNotificationPanel={toggleNotificationPanel} />
      </div>
    </header>
  );
};

export default Header; 