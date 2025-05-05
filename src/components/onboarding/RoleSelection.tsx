import React from 'react';
import { UserProfileDraft } from './OnboardingFlowManager'; // Import the type
import IconWrapper from '../atoms/IconWrapper'; // Use for icons later
import {
  FiBriefcase, // Lender
  FiHome, // Investor/Buyer/Owner
  FiUserCheck, // Agent/Wholesaler
  FiHelpCircle // Other
} from 'react-icons/fi';

interface RoleSelectionProps {
  onSelectRole: (role: UserProfileDraft['role']) => void;
}

// Store icon NAME (string) instead of component type
const roleOptions: { role: UserProfileDraft['role']; label: string; iconName: string }[] = [
  { role: 'Investor / Buyer', label: 'Investor / Buyer', iconName: 'FiHome' },
  { role: 'Lender / Capital Provider', label: 'Lender / Capital Provider', iconName: 'FiBriefcase' },
  { role: 'Agent', label: 'Agent', iconName: 'FiUserCheck' },
  { role: 'Wholesaler', label: 'Wholesaler', iconName: 'FiUserCheck' }, // Can reuse icons
  { role: 'Property Owner / Seller', label: 'Property Owner / Seller', iconName: 'FiHome' }, // Can reuse icons
  { role: 'Other', label: 'Other', iconName: 'FiHelpCircle' },
];

const RoleSelection: React.FC<RoleSelectionProps> = ({ onSelectRole }) => {
  return (
    <div className="p-6 md:p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center max-w-3xl w-full">
      <h2 className="text-2xl font-semibold text-primary dark:text-white mb-4">Welcome to Domentra!</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-8">To help us tailor your experience, could you tell us about your primary role in real estate?</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Destructure iconName and pass it to IconWrapper's 'name' prop */} 
        {roleOptions.map(({ role, label, iconName }) => (
          <button
            key={role}
            onClick={() => onSelectRole(role)}
            className="role-button group flex flex-col items-center justify-center p-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md hover:border-accent dark:hover:border-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-all duration-200 ease-in-out h-32"
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

export default RoleSelection; 