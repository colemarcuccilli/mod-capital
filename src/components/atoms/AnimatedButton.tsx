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
  const isLightButton = className.includes('light-btn');
  
  useEffect(() => {
    if (buttonRef.current) {
      // Create a pulse animation with different intensity based on button type
      const shadowColor = isLightButton 
        ? 'rgba(255, 59, 48, 0.3)' // Lighter shadow for light buttons 
        : 'rgba(255, 59, 48, 0.6)'; // Regular shadow for normal buttons
        
      const pulseAnimation = gsap.to(buttonRef.current, {
        boxShadow: `0 0 15px ${shadowColor}`,
        scale: isLightButton ? 1.01 : 1.02, // Smaller scale for light buttons
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        paused: true
      });
      
      // Start the animation
      pulseAnimation.play();
      
      // Clean up animation
      return () => {
        pulseAnimation.kill();
      };
    }
  }, [isLightButton]);
  
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (buttonRef.current) {
      const shadowColor = isLightButton 
        ? 'rgba(255, 59, 48, 0.4)' // Lighter hover shadow
        : 'rgba(255, 59, 48, 0.8)'; // Regular hover shadow
        
      gsap.to(buttonRef.current, {
        scale: isLightButton ? 1.03 : 1.05, // Smaller hover scale for light buttons
        boxShadow: `0 0 20px ${shadowColor}`,
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