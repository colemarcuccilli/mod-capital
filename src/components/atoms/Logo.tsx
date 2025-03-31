import React from 'react';

// Correct path based on user's ls output
import domentraLogo from '../../assets/images/logos/DomentraWordMarkRichBlack.svg'; 

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  // Keep this simple - just the image
  return (
    <img 
      src={domentraLogo} 
      alt="Domentra Logo" 
      className={`h-10 md:h-12 w-auto ${className}`} // Adjust height as needed
    />
  );
};

export default Logo; 