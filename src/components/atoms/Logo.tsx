import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <img 
        src={require("../../assets/images/ModCapLogo.png")} 
        alt="Mod Capital Logo" 
        className={`object-contain h-32 ${className}`}
      />
    </div>
  );
};

export default Logo; 