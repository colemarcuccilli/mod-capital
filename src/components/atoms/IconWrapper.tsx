import React from 'react';
import * as FiIcons from 'react-icons/fi';

type IconProps = {
  name: string;
  size?: number;
  className?: string;
  onClick?: () => void;
};

/**
 * Icon wrapper for Feather icons from react-icons/fi
 */
const IconWrapper: React.FC<IconProps> = ({ 
  name, 
  size = 24, 
  className = '', 
  onClick 
}) => {
  // Access icon from FiIcons using name
  const IconComponent = (FiIcons as any)[name];
  
  if (!IconComponent) {
    console.warn(`Icon ${name} not found`);
    return null;
  }
  
  return (
    <span className={className} onClick={onClick} style={{ display: 'inline-flex' }}>
      <IconComponent size={size} />
    </span>
  );
};

export default IconWrapper; 