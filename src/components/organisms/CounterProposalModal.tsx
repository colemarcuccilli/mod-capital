import React, { useState, useEffect, FormEvent } from 'react';
import { NegotiationTermDetails } from '../../lib/firebaseFirestore';
import LoadingSpinner from '../atoms/LoadingSpinner';
import IconWrapper from '../atoms/IconWrapper';
import { FiX } from 'react-icons/fi';

interface CounterProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newTerms: NegotiationTermDetails, message: string) => void;
  initialTerms: NegotiationTermDetails; // To pre-fill the form
  isSubmitting: boolean; // To disable form during submission
}

// Redefined Interface for the modal's form state
interface CounterProposalFormState {
  amount: string;
  returnRate: string;
  lengthOfFunding: string;
  fundingType: 'EMD' | 'Double Close' | 'Gap Funding' | 'Bridge Loan' | 'New Construction' | 'Rental Loan' | '';
  exitStrategy: 'Sell' | 'Refinance' | '';
  message: string;
}

const CounterProposalModal: React.FC<CounterProposalModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialTerms, 
  isSubmitting
}) => {
  const [formState, setFormState] = useState<CounterProposalFormState>({
    amount: String(initialTerms.amount || ''),
    returnRate: String(initialTerms.returnRate || ''),
    lengthOfFunding: String(initialTerms.lengthOfFunding || ''),
    fundingType: initialTerms.fundingType || '',
    exitStrategy: initialTerms.exitStrategy || '',
    message: '' // Initialize message as empty
  });

  // Reset form when initialTerms change (e.g., modal reopens for same negotiation later)
  useEffect(() => {
    setFormState({
        amount: String(initialTerms.amount || ''),
        returnRate: String(initialTerms.returnRate || ''),
        lengthOfFunding: String(initialTerms.lengthOfFunding || ''),
        fundingType: initialTerms.fundingType || '',
        exitStrategy: initialTerms.exitStrategy || '',
        message: ''
    });
  }, [initialTerms]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
     // Basic validation for numeric fields
    if ((name === 'amount' || name === 'returnRate' || name === 'lengthOfFunding') && value !== '' && isNaN(Number(value))) {
      return; // Prevent non-numeric input
    }
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Convert back to numbers before submitting
    const termsToSubmit: NegotiationTermDetails = {
        amount: Number(formState.amount),
        returnRate: Number(formState.returnRate),
        lengthOfFunding: Number(formState.lengthOfFunding),
        fundingType: formState.fundingType,
        exitStrategy: formState.exitStrategy,
    };
    onSubmit(termsToSubmit, formState.message);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center p-4 animate-fade-in pt-16 md:pt-20">
      {/* Backdrop */} 
      <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Panel */} 
      <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */} 
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-lg font-semibold text-primary dark:text-white">Make Counter-Proposal</h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
            <IconWrapper name="FiX" size={20} />
          </button>
        </div>

        {/* Form Content (Scrollable) */} 
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-4">
            {/* Amount & Return */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Funding Amount ($)</label>
                  <input type="number" name="amount" id="amount" value={formState.amount} onChange={handleChange} required disabled={isSubmitting} className="mt-1 input-field" placeholder="e.g., 100000" step="1000"/>
                </div>
                <div>
                  <label htmlFor="returnRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Proposed Return (%)</label>
                  <input type="number" name="returnRate" id="returnRate" value={formState.returnRate} onChange={handleChange} required disabled={isSubmitting} className="mt-1 input-field" placeholder="e.g., 12" step="0.1"/>
                </div>
             </div>
             {/* Length, Type, Exit */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div>
                    <label htmlFor="lengthOfFunding" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Funding Length (Days)</label>
                    <input type="number" name="lengthOfFunding" id="lengthOfFunding" value={formState.lengthOfFunding} onChange={handleChange} required disabled={isSubmitting} className="mt-1 input-field" placeholder="e.g., 30" min="1"/>
                 </div>
                 <div>
                    <label htmlFor="fundingType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Funding Type</label>
                    <select name="fundingType" id="fundingType" value={formState.fundingType} onChange={handleChange} required disabled={isSubmitting} className="mt-1 select-field">
                        <option value="">Select...</option>
                        <option value="EMD">EMD</option>
                        <option value="Double Close">Double Close</option>
                        <option value="Gap Funding">Gap Funding</option>
                        <option value="Bridge Loan">Bridge Loan</option>
                        <option value="New Construction">New Construction</option>
                        <option value="Rental Loan">Rental Loan</option>
                    </select>
                 </div>
                 <div>
                     <label htmlFor="exitStrategy" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Exit Strategy</label>
                     <select name="exitStrategy" id="exitStrategy" value={formState.exitStrategy} onChange={handleChange} required disabled={isSubmitting} className="mt-1 select-field">
                        <option value="">Select...</option>
                        <option value="Sell">Sell</option>
                        <option value="Refinance">Refinance</option>
                    </select>
                 </div>
             </div>

             {/* Optional Message */}
            <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Optional Message
                  <span className="text-xs text-gray-500 ml-1">(Explain your changes or add context)</span>
                </label>
                <textarea
                    name="message"
                    id="message"
                    rows={3}
                    value={formState.message}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm disabled:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    placeholder="e.g., Adjusted the return rate slightly to better reflect market conditions..."
                />
            </div>

            {/* Footer with Submit Button */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                <button 
                    type="button" 
                    onClick={onClose} 
                    disabled={isSubmitting}
                    className="btn btn-outline mr-3 disabled:opacity-50">
                    Cancel
                </button>
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="btn btn-primary w-40 flex justify-center items-center disabled:opacity-50"
                >
                    {isSubmitting ? <LoadingSpinner size="sm" color="border-white"/> : 'Submit Counter'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

// Add basic input/select field styling if not already global
const InputFieldStyle = `mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm disabled:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:text-white`;
const SelectFieldStyle = `mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm rounded-md disabled:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:text-white`;
// Note: You might need to apply these styles using @apply in a CSS file or define them globally
// For simplicity here, assuming classes like 'input-field' and 'select-field' exist or add inline styles.

export default CounterProposalModal; 