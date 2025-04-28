import React from 'react';

interface LoadingSpinnerProps {
  size?: string; // e.g., 'w-8 h-8'
  color?: string; // e.g., 'border-accent'
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'w-10 h-10', 
  color = 'border-accent' // Default to accent color
}) => {
  return (
    <div className={`inline-block ${size} animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]`}
         role="status">
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );
};

export default LoadingSpinner; 