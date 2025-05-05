import React, { useEffect } from 'react';

interface LoadingAnimationPlaceholderProps {
  onComplete: () => void; // Callback function when the "animation" finishes
  duration?: number; // Optional duration in milliseconds
}

const LoadingAnimationPlaceholder: React.FC<LoadingAnimationPlaceholderProps> = ({ 
  onComplete, 
  duration = 2000 // Default duration 2 seconds
}) => {

  useEffect(() => {
    // Simulate the animation duration
    const timer = setTimeout(() => {
      onComplete(); // Call the callback when the timer finishes
    }, duration);

    // Cleanup the timer if the component unmounts before finishing
    return () => clearTimeout(timer);
  }, [onComplete, duration]); // Depend on callback and duration

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background dark:bg-background-dark">
      {/* Simple visual placeholder - Replace with actual animation later */}
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary dark:border-accent mb-4"></div>
      <p className="text-xl text-primary dark:text-white animate-pulse">Loading Domentra...</p>
    </div>
  );
};

export default LoadingAnimationPlaceholder; 