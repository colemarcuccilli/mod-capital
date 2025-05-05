import React, { useState } from 'react';
import Modal from './Modal'; // Use the base modal
import LenderQuestionsPart1 from '../profiling/LenderQuestionsPart1';
import LenderQuestionsPart2 from '../profiling/LenderQuestionsPart2';
import LenderQuestionsPart3 from '../profiling/LenderQuestionsPart3';
import { LendingCriteriaDetails } from '../../lib/firebaseFirestore';

interface LenderPostSignupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCompleteFlow: (data: LendingCriteriaDetails) => void; // Callback when all steps are done
    initialData?: Partial<LendingCriteriaDetails>; // Optional initial data
}

const LenderPostSignupModal: React.FC<LenderPostSignupModalProps> = ({ 
    isOpen, 
    onClose, 
    onCompleteFlow,
    initialData = {}
}) => {
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [flowData, setFlowData] = useState<Partial<LendingCriteriaDetails>>(initialData || {});

    // Reset step when modal opens/closes or initial data changes
    React.useEffect(() => {
        if (isOpen) {
            setCurrentStep(1);
            setFlowData(initialData || {});
        } else {
            // Optional: reset state fully on close if desired
            // setCurrentStep(1);
            // setFlowData({}); 
        }
    }, [isOpen, initialData]); 

    const handlePartSubmit = (partData: Partial<LendingCriteriaDetails>) => {
        const currentFlowData = flowData || {};
        const newData = { ...currentFlowData, ...partData };
        setFlowData(newData);
        console.log(`Lender Flow - Part ${currentStep} Submitted:`, partData, "New Data:", newData);

        // Determine next step based on data from Part 1 (stored in newData)
        let nextStep = currentStep + 1;
        let isComplete = false;
        const fundingTypes = newData.fundingTypes || [];
        const needsPart2 = fundingTypes.includes('Hard Money') || fundingTypes.includes('Private Money') || fundingTypes.includes('Equity');
        const needsPart3 = fundingTypes.includes('Bridge Loans') || fundingTypes.includes('Conventional');

        if (currentStep === 1) {
            if (needsPart2) nextStep = 2;
            else if (needsPart3) nextStep = 3;
            else isComplete = true;
        } else if (currentStep === 2) {
            if (needsPart3) nextStep = 3;
            else isComplete = true;
        } else if (currentStep === 3) {
            isComplete = true;
        }

        if (isComplete) {
            console.log("Lender Flow Complete. Final Data:", newData);
            onCompleteFlow(newData as LendingCriteriaDetails); // Assert type on final submit
        } else {
            setCurrentStep(nextStep);
        }
    };

    const getModalTitle = () => {
        if (currentStep === 1) return "Lender Profile (Step 1/3)";
        if (currentStep === 2) return "Lender Profile (Step 2/3)";
        if (currentStep === 3) return "Lender Profile (Step 3/3)";
        return "Complete Lender Profile";
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={getModalTitle()}
            maxWidthClass="max-w-3xl" 
        >
            {/* Render the correct step based on currentStep state */}
            {currentStep === 1 && (
                <LenderQuestionsPart1 
                    onSubmitPart={handlePartSubmit} 
                    defaultValues={{
                        ...(flowData || {}),
                        regions: (flowData?.regions)?.join(', ') || '' 
                    }} 
                />
            )}
            {currentStep === 2 && (
                <LenderQuestionsPart2 
                    onSubmitPart={handlePartSubmit} 
                    fundingTypes={flowData?.fundingTypes || []} 
                    defaultValues={flowData || {}}
                />
            )}
             {currentStep === 3 && (
                <LenderQuestionsPart3 
                    onSubmitPart={handlePartSubmit} 
                    fundingTypes={flowData?.fundingTypes || []} 
                    defaultValues={flowData || {}}
                />
            )}
            {/* Add loading indicator? */} 
        </Modal>
    );
};

export default LenderPostSignupModal; 