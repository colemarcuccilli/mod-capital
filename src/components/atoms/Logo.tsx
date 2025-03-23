import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <Link to="/" className={`font-heading font-bold text-2xl text-primary ${className}`}>
      <span className="text-accent">Mod</span> Capital
    </Link>
  );
};

export default Logo; 