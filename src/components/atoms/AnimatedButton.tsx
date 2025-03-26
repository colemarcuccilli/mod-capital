import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

interface AnimatedButtonProps {
  children: React.ReactNode;
  to: string;
  className?: string;
  onClick?: () => void;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ 
  children, 
  to, 
  className = '', 
  onClick 
}) => {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    if (buttonRef.current) {
      // Create a pulse animation
      const pulseAnimation = gsap.to(buttonRef.current, {
        boxShadow: '0 0 15px rgba(255, 59, 48, 0.6)', // Subtle red shadow
        scale: 1.02,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        paused: true // Start paused
      });
      
      // Start the animation
      pulseAnimation.play();
      
      // Clean up animation
      return () => {
        pulseAnimation.kill();
      };
    }
  }, []);
  
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 1.05,
        boxShadow: '0 0 20px rgba(255, 59, 48, 0.8)', // Stronger red shadow on hover
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 1,
        // Let the pulse animation handle the shadow
        duration: 0.3,
        ease: 'power2.in'
      });
    }
  };

  return (
    <Link 
      to={to}
      onClick={onClick}
      className={`relative overflow-hidden bg-accent text-white py-2 px-4 rounded-lg hover:bg-accent/90 transition-colors shadow-md ${className}`}
      ref={buttonRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children} <span className={`transition-transform duration-300 inline-block ${isHovered ? 'translate-x-1' : ''}`}>→</span>
    </Link>
  );
};

export default AnimatedButton; 