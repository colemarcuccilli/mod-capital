import React from 'react';
import { UserProfileDraft } from './OnboardingFlowManager'; // Import the type
import IconWrapper from '../atoms/IconWrapper'; 
import {
  FiTrendingUp, // Flip
  FiKey, // Hold
  FiRepeat, // BRRRR
  FiDollarSign, // Wholesale
  FiPlusSquare, // New Construction
  FiHelpCircle // Other
} from 'react-icons/fi';

// Define possible strategy types
type InvestmentStrategy = 'Fix & Flip' | 'Buy & Hold' | 'BRRRR' | 'Wholesaling' | 'New Construction' | 'Other';

interface StrategySelectionProps {
  onSelectStrategy: (strategy: InvestmentStrategy) => void;
}

const strategyOptions: { strategy: InvestmentStrategy; label: string; iconName: string }[] = [
  { strategy: 'Fix & Flip', label: 'Fix & Flip', iconName: 'FiTrendingUp' },
  { strategy: 'Buy & Hold', label: 'Buy & Hold', iconName: 'FiKey' },
  { strategy: 'BRRRR', label: 'BRRRR', iconName: 'FiRepeat' },
  { strategy: 'Wholesaling', label: 'Wholesaling', iconName: 'FiDollarSign' },
  { strategy: 'New Construction', label: 'New Construction', iconName: 'FiPlusSquare' },
  { strategy: 'Other', label: 'Other', iconName: 'FiHelpCircle' },
];

const StrategySelection: React.FC<StrategySelectionProps> = ({ onSelectStrategy }) => {
  return (
    // Wrapper div to target for GSAP animations
    <div className="strategy-selection-container p-6 md:p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center max-w-3xl w-full">
      <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-6">What is your primary investment strategy?</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {strategyOptions.map(({ strategy, label, iconName }) => (
          <button
            key={strategy}
            onClick={() => onSelectStrategy(strategy)}
            className="strategy-button group flex flex-col items-center justify-center p-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md hover:border-accent dark:hover:border-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-all duration-200 ease-in-out h-32"
          >
            <IconWrapper name={iconName} className="text-3xl text-gray-500 dark:text-gray-400 group-hover:text-accent mb-2 transition-colors" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-primary dark:group-hover:text-accent transition-colors">{label}</span>
          </button>
        ))}
      </div>
       {/* Placeholder for 'Other' text input if needed later */}
    </div>
  );
};

// Export the type for use in OnboardingFlowManager
export type { InvestmentStrategy }; 
export default StrategySelection; 