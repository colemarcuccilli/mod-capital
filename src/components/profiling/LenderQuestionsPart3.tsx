import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { LendingCriteriaDetails } from '../../lib/firebaseFirestore';

// Input type for Part 3
type LenderPart3Inputs = {
    bridgeLoanTerms?: string;
    conventionalLoanTerms?: string;
    avoidedScenarios?: string;
};

interface LenderQuestionsPart3Props {
    onSubmitPart: (data: Partial<LendingCriteriaDetails>) => void;
    // Pass selected funding types from Part 1 to conditionally render questions
    fundingTypes: string[]; 
    defaultValues?: Partial<LenderPart3Inputs>;
}

const LenderQuestionsPart3: React.FC<LenderQuestionsPart3Props> = ({ 
    onSubmitPart, 
    fundingTypes,
    defaultValues 
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LenderPart3Inputs>({ defaultValues });

    // Determine which sections to show
    const showBridge = fundingTypes.includes('Bridge Loans');
    const showConventional = fundingTypes.includes('Conventional');

    const handleFormSubmit: SubmitHandler<LenderPart3Inputs> = (data) => {
        // Only submit data for the relevant sections shown
        const relevantData: Partial<LendingCriteriaDetails> = {};
        if (showBridge) {
            relevantData.bridgeLoanTerms = data.bridgeLoanTerms;
        }
        if (showConventional) {
            relevantData.conventionalLoanTerms = data.conventionalLoanTerms;
        }
        // Avoided Scenarios applies if either is shown
        if (showBridge || showConventional) {
             relevantData.avoidedScenarios = data.avoidedScenarios;
        }
        onSubmitPart(relevantData);
    };

    // Only render the form if relevant sections are needed
    if (!showBridge && !showConventional) {
        // This case should ideally be handled by the step logic in the parent,
        // but as a fallback, we can submit empty data to finish the flow.
        console.warn("LenderQuestionsPart3 rendered but no relevant funding types selected.");
        // Immediately call onSubmitPart with empty data to proceed
        // onSubmitPart({}); 
        // Or return null - Let's return null and rely on parent logic
        return null; 
    }

    return (
         <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
            <h3 className="text-xl font-semibold text-primary dark:text-white border-b pb-2 mb-4">Additional Funding Criteria</h3>

            {showBridge && (
                 <fieldset className="space-y-3 p-4 border dark:border-gray-600 rounded-md">
                     <legend className="text-lg font-medium text-accent dark:text-accent-light px-1">Bridge Loan Details</legend>
                    <div>
                        <label htmlFor="bridgeLoanTerms" className="label">Typical Terms for Bridge Loans</label>
                        <textarea id="bridgeLoanTerms" className="input-field" rows={3} placeholder="Describe typical rates, terms, fees, use cases..." {...register("bridgeLoanTerms")} />
                    </div>
                 </fieldset>
            )}

            {showConventional && (
                 <fieldset className="space-y-3 p-4 border dark:border-gray-600 rounded-md">
                     <legend className="text-lg font-medium text-accent dark:text-accent-light px-1">Conventional Loan Details</legend>
                     <div>
                        <label htmlFor="conventionalLoanTerms" className="label">Typical Terms for Conventional Loans</label>
                        <textarea id="conventionalLoanTerms" className="input-field" rows={3} placeholder="Describe typical rates, terms, LTV, DSCR requirements..." {...register("conventionalLoanTerms")} />
                    </div>
                </fieldset>
            )}

            {(showBridge || showConventional) && (
                <div>
                    <label htmlFor="avoidedScenarios" className="label">Specific Property Conditions or Borrower Profiles You Avoid?</label>
                    <textarea id="avoidedScenarios" className="input-field" rows={3} placeholder="e.g., Properties needing structural repair, borrowers with recent bankruptcies..." {...register("avoidedScenarios")} />
                </div>
            )}
            
             {/* Submit Button */} 
             <div className="pt-4">
                 <button type="submit" disabled={isSubmitting} className="w-full btn btn-accent disabled:opacity-50">
                     {isSubmitting ? 'Saving...' : 'Finish & Save Profile'}
                 </button>
             </div>
        </form>
    );
};

export default LenderQuestionsPart3; 