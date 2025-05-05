import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { BuyBoxDetails } from '../../lib/firebaseFirestore';

// --- Constants for Checkbox/Select Options ---
const PROPERTY_TYPES = ["Single Family", "Multi-Family (2-4 units)", "Multi-Family (5+ units)", "Commercial", "Land", "Industrial", "Other"];
const STRATEGIES = ["Fix & Flip", "Buy & Hold", "BRRRR", "Development", "Wholesaling"];
const FUNDING_SOURCES = ["Cash", "Hard Money", "Private Money", "Conventional Bank Loan", "Seller Financing"];
const GOALS = ["Passive Income", "Capital Appreciation", "Portfolio Growth", "Quick Profits"];
const NOTIFICATION_PREFS = ["Email", "SMS/Text", "In-App Notification"];
const DEALS_COMPLETED_OPTIONS = ["0", "1-3", "4-10", "11-20", "20+"];
const DEALS_TARGET_OPTIONS = ["1-2", "3-5", "6-10", "10+"];

// --- Component Props ---
interface InvestorBuyBoxQuestionsProps {
    onSubmit: (data: BuyBoxDetails) => void;
}

// --- Form Input Type (Aligned with Q&A Plan Part 1) ---
type BuyBoxFormInputs = {
    markets: string; // Comma-separated string for now
    propertyTypes: string[]; // Array for checkboxes
    strategy: string[]; // Array for checkboxes
    strategyOther: string;
    priceMin?: number;
    priceMax?: number;
    rehabMin?: number;
    rehabMax?: number;
    fundingSources: string[]; // Array for checkboxes
    fundingSourcesOther: string;
    dealsCompleted: string; // Use string for range options
    primaryGoals: string[]; // Array for checkboxes
    primaryGoalsOther: string;
    dealsTarget12Months: string; // Use string for range options
    notificationPrefs: string[]; // Array for checkboxes
    additionalInfo: string;
};

// --- Component Implementation ---
const InvestorBuyBoxQuestions: React.FC<InvestorBuyBoxQuestionsProps> = ({ onSubmit }) => {
    const {
        register,
        handleSubmit,
        control, // Needed for checkbox groups
        watch,
        formState: { errors, isSubmitting },
    } = useForm<BuyBoxFormInputs>({
        defaultValues: { // Initialize arrays for checkboxes
            propertyTypes: [],
            strategy: [],
            fundingSources: [],
            primaryGoals: [],
            notificationPrefs: [],
            strategyOther: '',
            fundingSourcesOther: '',
            primaryGoalsOther: '',
            additionalInfo: ''
        }
    });

    // Watch checkbox fields to conditionally show 'Other' inputs
    const watchStrategies = watch("strategy", []);
    const watchFundingSources = watch("fundingSources", []);
    const watchGoals = watch("primaryGoals", []);

    const handleFormSubmit: SubmitHandler<BuyBoxFormInputs> = (data) => {
        console.log("Buy Box Form Submitted Raw:", data);
        // Format data before submitting
        const formattedData: BuyBoxDetails = {
            markets: data.markets?.split(',').map(m => m.trim()).filter(Boolean) || [],
            propertyTypes: data.propertyTypes || [],
            strategy: data.strategy || [],
            strategyOther: watchStrategies.includes('Other') ? data.strategyOther : undefined,
            priceMin: data.priceMin ? Number(data.priceMin) : undefined,
            priceMax: data.priceMax ? Number(data.priceMax) : undefined,
            rehabMin: data.rehabMin ? Number(data.rehabMin) : undefined,
            rehabMax: data.rehabMax ? Number(data.rehabMax) : undefined,
            fundingSources: data.fundingSources || [],
            fundingSourcesOther: watchFundingSources.includes('Other') ? data.fundingSourcesOther : undefined,
            dealsCompleted: data.dealsCompleted || undefined,
            primaryGoals: data.primaryGoals || [],
            primaryGoalsOther: watchGoals.includes('Other') ? data.primaryGoalsOther : undefined,
            dealsTarget12Months: data.dealsTarget12Months || undefined,
            notificationPrefs: data.notificationPrefs || [],
            additionalInfo: data.additionalInfo || undefined,
        };
        console.log("Buy Box Formatted Data:", formattedData);
        onSubmit(formattedData);
    };

    // --- Helper for Checkbox Groups ---
    const renderCheckboxGroup = (name: keyof BuyBoxFormInputs, options: string[], otherOption = false) => (
        <div className="space-y-2 mt-2 grid grid-cols-2 gap-x-4 gap-y-2 md:grid-cols-3">
            {options.map((option) => (
                <label key={option} className="flex items-center space-x-2 cursor-pointer">
                    <input 
                        type="checkbox" 
                        value={option} 
                        {...register(name)} 
                        className="form-checkbox checkbox checkbox-accent checkbox-sm"
                    />
                    <span className="text-sm text-primary dark:text-gray-300 select-none">{option}</span>
                </label>
            ))}
            {otherOption && (
                <label key="Other" className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" value="Other" {...register(name)} className="form-checkbox checkbox checkbox-accent checkbox-sm"/>
                    <span className="text-sm text-primary dark:text-gray-300 select-none">Other</span>
                </label>
            )}
        </div>
    );

    // Basic shared styles for labels and inputs
    const labelClass = "block text-sm font-medium text-primary dark:text-gray-300 mb-1";
    const inputClass = "input-field"; // Assuming input-field provides necessary base styles
    const selectClass = "select select-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"; // Example using DaisyUI select

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
                {/* Q1: Markets */}
                <div>
                    <label htmlFor="markets" className={labelClass}>Preferred Markets (Cities/States, comma-separated)</label>
                    <input id="markets" type="text" className={inputClass} placeholder="e.g., Austin, TX, Miami, FL" {...register("markets")} />
                </div>

                {/* Q2: Property Types */}
                <div>
                    <label className={labelClass}>Property Types You Invest In</label>
                    {renderCheckboxGroup('propertyTypes', PROPERTY_TYPES)}
                </div>

                 {/* Q3: Strategies */}
                 <div>
                    <label className={labelClass}>Investment Strategies Used</label>
                    {renderCheckboxGroup('strategy', STRATEGIES, true)}
                    {watchStrategies.includes('Other') && (
                        <input type="text" className={`${inputClass} mt-2`} placeholder="Please specify other strategy" {...register("strategyOther")} />
                    )}
                </div>
                
                 {/* Q4: Price Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="priceMin" className={labelClass}>Min Purchase Price ($)</label>
                        <input id="priceMin" type="number" className={inputClass} placeholder="e.g., 100000" {...register("priceMin", { valueAsNumber: true })} />
                    </div>
                     <div>
                        <label htmlFor="priceMax" className={labelClass}>Max Purchase Price ($)</label>
                        <input id="priceMax" type="number" className={inputClass} placeholder="e.g., 500000" {...register("priceMax", { valueAsNumber: true })} />
                    </div>
                </div>

                 {/* Q5: Rehab Budget */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="rehabMin" className={labelClass}>Min Rehab Budget ($)</label>
                        <input id="rehabMin" type="number" className={inputClass} placeholder="e.g., 10000" {...register("rehabMin", { valueAsNumber: true })} />
                    </div>
                     <div>
                        <label htmlFor="rehabMax" className={labelClass}>Max Rehab Budget ($)</label>
                        <input id="rehabMax" type="number" className={inputClass} placeholder="e.g., 100000" {...register("rehabMax", { valueAsNumber: true })} />
                    </div>
                </div>

                {/* Q6: Funding Sources */} 
                <div>
                    <label className={labelClass}>How do you typically fund deals?</label>
                    {renderCheckboxGroup('fundingSources', FUNDING_SOURCES, true)}
                    {watchFundingSources.includes('Other') && (
                        <input type="text" className={`${inputClass} mt-2`} placeholder="Please specify other funding source" {...register("fundingSourcesOther")} />
                    )}
                </div>

                {/* Q7: Deals Completed */}
                 <div>
                    <label htmlFor="dealsCompleted" className={labelClass}>Deals Completed (Last 3 Years)</label>
                    <select id="dealsCompleted" className={selectClass} {...register("dealsCompleted")}> 
                        <option value="">Select Range...</option>
                        {DEALS_COMPLETED_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                 </div>

                 {/* Q8: Primary Goals */}
                <div>
                    <label className={labelClass}>Primary Investment Goals</label>
                    {renderCheckboxGroup('primaryGoals', GOALS, true)}
                    {watchGoals.includes('Other') && (
                        <input type="text" className={`${inputClass} mt-2`} placeholder="Please specify other goal" {...register("primaryGoalsOther")} />
                    )}
                </div>

                 {/* Q9: Deals Target */} 
                 <div>
                    <label htmlFor="dealsTarget12Months" className={labelClass}>Target Deals (Next 12 Months)</label>
                    <select id="dealsTarget12Months" className={selectClass} {...register("dealsTarget12Months")}> 
                         <option value="">Select Target...</option>
                         {DEALS_TARGET_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                 </div>

                 {/* Q10: Notification Preferences */} 
                 <div>
                    <label className={labelClass}>Notification Preferences</label>
                    {renderCheckboxGroup('notificationPrefs', NOTIFICATION_PREFS)}
                 </div>

                 {/* Q11: Additional Info */} 
                <div>
                    <label htmlFor="additionalInfo" className={labelClass}>Anything else we should know?</label>
                    <textarea 
                        id="additionalInfo" 
                        className={`${inputClass} min-h-[60px]`} 
                        rows={3} 
                        placeholder="Specific criteria, partnership interests, etc."
                        {...register("additionalInfo")}
                    />
                </div>

                {/* --- Form Submission Button --- */}
                <div className="pt-6">
                    <button type="submit" disabled={isSubmitting} className="w-full btn btn-accent disabled:opacity-50">
                        {isSubmitting ? 'Saving Profile...' : 'Save Investor Profile'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default InvestorBuyBoxQuestions; 