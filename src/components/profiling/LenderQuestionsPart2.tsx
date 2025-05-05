import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { LendingCriteriaDetails } from '../../lib/firebaseFirestore'; // Import base type

// Define input type for Part 2 questions
type LenderPart2Inputs = {
    // Hard Money Fields
    hmRatePoints?: string; 
    hmLoanTerm?: string; 
    // Private Money Fields
    pmRatePoints?: string;
    pmLoanTerm?: string;
    // Equity Fields
    equitySplit?: string;
    equityPreferredReturn?: number; // Percentage
    equityHoldPeriod?: string;
};

interface LenderQuestionsPart2Props {
    onSubmitPart: (data: Partial<LendingCriteriaDetails>) => void;
    // Pass selected funding types from Part 1 to conditionally render questions
    fundingTypes: string[]; 
    defaultValues?: Partial<LenderPart2Inputs>; // For pre-fill if needed
}

const LenderQuestionsPart2: React.FC<LenderQuestionsPart2Props> = ({ 
    onSubmitPart, 
    fundingTypes,
    defaultValues 
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LenderPart2Inputs>({ defaultValues });

    // Determine which sections to show
    const showHardMoney = fundingTypes.includes('Hard Money');
    const showPrivateMoney = fundingTypes.includes('Private Money');
    const showEquity = fundingTypes.includes('Equity');

    const handleFormSubmit: SubmitHandler<LenderPart2Inputs> = (data) => {
        // Only submit data for the relevant sections shown
        const relevantData: Partial<LendingCriteriaDetails> = {};
        if (showHardMoney) {
            relevantData.hmRatePoints = data.hmRatePoints;
            relevantData.hmLoanTerm = data.hmLoanTerm;
        }
        if (showPrivateMoney) {
            relevantData.pmRatePoints = data.pmRatePoints;
            relevantData.pmLoanTerm = data.pmLoanTerm;
        }
        if (showEquity) {
            relevantData.equitySplit = data.equitySplit;
            relevantData.equityPreferredReturn = data.equityPreferredReturn ? Number(data.equityPreferredReturn) : undefined;
            relevantData.equityHoldPeriod = data.equityHoldPeriod;
        }
        onSubmitPart(relevantData);
    };

    return (
         <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
            <h3 className="text-xl font-semibold text-primary dark:text-white border-b pb-2 mb-4">Specific Funding Criteria</h3>

            {showHardMoney && (
                 <fieldset className="space-y-3 p-4 border dark:border-gray-600 rounded-md">
                    <legend className="text-lg font-medium text-accent dark:text-accent-light px-1">Hard Money Details</legend>
                    <div>
                        <label htmlFor="hmRatePoints" className="label">Typical Rate & Points</label>
                        <input id="hmRatePoints" type="text" className="input-field" placeholder="e.g., 10% + 2 points" {...register("hmRatePoints")} />
                    </div>
                     <div>
                        <label htmlFor="hmLoanTerm" className="label">Typical Loan Term</label>
                        <input id="hmLoanTerm" type="text" className="input-field" placeholder="e.g., 6 months, 12 months" {...register("hmLoanTerm")} />
                    </div>
                 </fieldset>
            )}

            {showPrivateMoney && (
                 <fieldset className="space-y-3 p-4 border dark:border-gray-600 rounded-md">
                     <legend className="text-lg font-medium text-accent dark:text-accent-light px-1">Private Money Details</legend>
                    <div>
                        <label htmlFor="pmRatePoints" className="label">Typical Rate & Points</label>
                        <input id="pmRatePoints" type="text" className="input-field" placeholder="e.g., 8-12% + 1-3 points" {...register("pmRatePoints")} />
                    </div>
                     <div>
                        <label htmlFor="pmLoanTerm" className="label">Typical Loan Term</label>
                        <input id="pmLoanTerm" type="text" className="input-field" placeholder="e.g., 1-3 years" {...register("pmLoanTerm")} />
                    </div>
                 </fieldset>
            )}

            {showEquity && (
                 <fieldset className="space-y-3 p-4 border dark:border-gray-600 rounded-md">
                     <legend className="text-lg font-medium text-accent dark:text-accent-light px-1">Equity Details</legend>
                    <div>
                        <label htmlFor="equitySplit" className="label">Typical Equity Split Range</label>
                        <input id="equitySplit" type="text" className="input-field" placeholder="e.g., 50/50, 70/30 (LP/GP)" {...register("equitySplit")} />
                    </div>
                     <div>
                        <label htmlFor="equityPreferredReturn" className="label">Typical Preferred Return (%)</label>
                        <input id="equityPreferredReturn" type="number" step="0.1" className="input-field" placeholder="e.g., 8" {...register("equityPreferredReturn", { valueAsNumber: true })} />
                    </div>
                     <div>
                        <label htmlFor="equityHoldPeriod" className="label">Typical Investment Hold Period</label>
                        <input id="equityHoldPeriod" type="text" className="input-field" placeholder="e.g., 3-5 years" {...register("equityHoldPeriod")} />
                    </div>
                 </fieldset>
            )}
            
             {/* Submit Button */} 
             <div className="pt-4">
                 <button type="submit" disabled={isSubmitting} className="w-full btn btn-accent disabled:opacity-50">
                     {isSubmitting ? 'Saving...' : 'Next'}
                 </button>
             </div>
        </form>
    );
};

export default LenderQuestionsPart2; 