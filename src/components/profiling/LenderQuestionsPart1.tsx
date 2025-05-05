import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { LendingCriteriaDetails } from '../../lib/firebaseFirestore';

// Define options
const LENDER_FUNDING_TYPES = ["Hard Money", "Private Money", "Equity", "Bridge Loans", "Conventional", "Other"];
const EXPERIENCE_OPTIONS = ["Yes", "No", "Depends"];
const TIMELINE_OPTIONS = ["< 7 days", "7-14 days", "15-30 days", "30+ days"];
const DEPLOY_TARGET_OPTIONS = ["< $500k", "$500k - $1M", "$1M - $5M", "$5M+"];
const PROPERTY_TYPES = ["Single Family", "Multi-Family (2-4 units)", "Multi-Family (5+ units)", "Commercial", "Land", "Industrial", "Other"];
const NOTIFICATION_PREFS = ["Email", "SMS/Text", "In-App Notification"];

// Form input type for Part 1
type LenderPart1Inputs = {
    fundingTypes: string[];
    fundingTypesOther: string;
    regions: string; // Comma-separated for now
    loanMin?: number;
    loanMax?: number;
    ltvMax?: number;
    arvMax?: number;
    propertyTypes: string[];
    reqBorrowerExperience: string;
    experienceDetails?: string; // Shown if Yes/Depends
    closingTimeline: string;
    capitalToDeploy: string;
    notificationPrefs: string[];
    additionalInfo: string;
};

interface LenderQuestionsPart1Props {
    onSubmitPart: (data: Partial<LendingCriteriaDetails>) => void;
    defaultValues?: Partial<LenderPart1Inputs>; // For potential pre-fill
}

const LenderQuestionsPart1: React.FC<LenderQuestionsPart1Props> = ({ onSubmitPart, defaultValues }) => {
    const {
        register,
        handleSubmit,
        watch,
        control,
        formState: { errors, isSubmitting },
    } = useForm<LenderPart1Inputs>({
        defaultValues: { 
            fundingTypes: [], 
            propertyTypes: [], 
            notificationPrefs: [], 
            ...defaultValues 
        }
    });

    const watchFundingTypes = watch("fundingTypes", []);
    const watchReqExperience = watch("reqBorrowerExperience");

    const handleFormSubmit: SubmitHandler<LenderPart1Inputs> = (data) => {
        // Format the data before passing it up
        const formattedData: Partial<LendingCriteriaDetails> = {
            fundingTypes: data.fundingTypes || [],
            regions: data.regions?.split(',').map(r => r.trim()).filter(Boolean) || [],
            loanMin: data.loanMin, 
            loanMax: data.loanMax,
            ltvMax: data.ltvMax,
            arvMax: data.arvMax,
            propertyTypes: data.propertyTypes || [], 
            reqBorrowerExperience: data.reqBorrowerExperience,
            experienceDetails: data.experienceDetails,
            closingTimeline: data.closingTimeline,
            capitalToDeploy: data.capitalToDeploy,
            notificationPrefs: data.notificationPrefs || [], 
            additionalInfo: data.additionalInfo,
        };
        onSubmitPart(formattedData); 
    };

    // Reusable Checkbox Group Helper
     const renderCheckboxGroup = (name: keyof LenderPart1Inputs, options: string[], otherOption = false) => (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {options.map((option) => (
                <label key={option} className="flex items-center space-x-2">
                    <input type="checkbox" value={option} {...register(name)} className="form-checkbox checkbox checkbox-accent checkbox-sm"/>
                    <span className="text-sm text-primary dark:text-gray-300">{option}</span>
                </label>
            ))}
            {otherOption && (
                <label key="Other" className="flex items-center space-x-2">
                    <input type="checkbox" value="Other" {...register(name)} className="form-checkbox checkbox checkbox-accent checkbox-sm"/>
                    <span className="text-sm text-primary dark:text-gray-300">Other</span>
                </label>
            )}
        </div>
    );
     // Reusable Radio Group Helper
     const renderRadioGroup = (name: keyof LenderPart1Inputs, options: string[]) => (
        <div className="flex flex-wrap gap-x-4 gap-y-2">
            {options.map((option) => (
                 <label key={option} className="flex items-center space-x-2">
                     <input type="radio" value={option} {...register(name)} className="form-radio radio radio-accent radio-sm"/>
                     <span className="text-sm text-primary dark:text-gray-300">{option}</span>
                </label>
            ))}
        </div>
     );

    return (
         <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
            <h3 className="text-xl font-semibold text-primary dark:text-white border-b pb-2 mb-4">Core Lending Criteria</h3>

            {/* Q1: Funding Types */} 
            <div>
                <label className="label font-medium">Funding Types Provided?</label>
                {renderCheckboxGroup('fundingTypes', LENDER_FUNDING_TYPES, true)}
                {watchFundingTypes.includes('Other') && (
                    <input type="text" className="input-field mt-2" placeholder="Please specify other funding type" {...register("fundingTypesOther")} />
                )}
            </div>

            {/* Q2: Regions */} 
            <div>
                <label htmlFor="regions" className="label">States/Regions You Lend In (comma-separated)</label>
                <input id="regions" type="text" className="input-field" placeholder="e.g., FL, TX, Southeast" {...register("regions")} />
                {/* TODO: Replace with multi-select component using market list */} 
            </div>

            {/* Q3: Loan Amount Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="loanMin" className="label">Min Loan Amount ($)</label>
                    <input id="loanMin" type="number" className="input-field" placeholder="e.g., 50000" {...register("loanMin", { valueAsNumber: true })} />
                </div>
                <div>
                    <label htmlFor="loanMax" className="label">Max Loan Amount ($)</label>
                    <input id="loanMax" type="number" className="input-field" placeholder="e.g., 1000000" {...register("loanMax", { valueAsNumber: true })} />
                </div>
            </div>

            {/* Q4: LTV/LTARV */} 
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="ltvMax" className="label">Max LTV (%)</label>
                    <input id="ltvMax" type="number" max={100} min={0} className="input-field" placeholder="e.g., 75" {...register("ltvMax", { valueAsNumber: true })} />
                </div>
                <div>
                    <label htmlFor="arvMax" className="label">Max LTARV (%)</label>
                    <input id="arvMax" type="number" max={100} min={0} className="input-field" placeholder="e.g., 70" {...register("arvMax", { valueAsNumber: true })} />
                </div>
            </div>

            {/* Q5: Property Types */} 
            <div>
                <label className="label">Property Types You Lend On</label>
                {renderCheckboxGroup('propertyTypes', PROPERTY_TYPES)}
            </div>

             {/* Q6: Borrower Experience */} 
             <div>
                 <label className="label">Require Borrower Experience?</label>
                 {renderRadioGroup('reqBorrowerExperience', EXPERIENCE_OPTIONS)}
                 {(watchReqExperience === 'Yes' || watchReqExperience === 'Depends') && (
                      <input type="text" className="input-field mt-2" placeholder="Specify experience requirements (optional)" {...register("experienceDetails")} />
                 )}
             </div>

             {/* Q7: Closing Timeline */} 
             <div>
                <label htmlFor="closingTimeline" className="label">Typical Closing Timeline (from signed term sheet)</label>
                <select id="closingTimeline" className="input-field" {...register("closingTimeline")}>
                    <option value="">Select Timeline...</option>
                    {TIMELINE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
             </div>

            {/* Q8: Capital to Deploy */} 
            <div>
                <label htmlFor="capitalToDeploy" className="label">Capital to Deploy (Next 12 Months)</label>
                <select id="capitalToDeploy" className="input-field" {...register("capitalToDeploy")}> 
                    <option value="">Select Range...</option>
                    {DEPLOY_TARGET_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
             </div>

             {/* Q9: Notification Prefs */} 
             <div>
                <label className="label">Notification Preferences</label>
                {renderCheckboxGroup('notificationPrefs', NOTIFICATION_PREFS)}
             </div>

             {/* Q10: Additional Info */} 
             <div>
                <label htmlFor="additionalInfo" className="label">Anything else?</label>
                <textarea id="additionalInfo" className="input-field" rows={3} placeholder="Specific criteria, preferences, etc." {...register("additionalInfo")}/>
            </div>

             {/* --- Submit Button --- */}
             <div className="pt-4">
                 <button type="submit" disabled={isSubmitting} className="w-full btn btn-accent disabled:opacity-50">
                     {isSubmitting ? 'Saving...' : 'Next'}
                 </button>
             </div>
        </form>
    );
};

export default LenderQuestionsPart1; 