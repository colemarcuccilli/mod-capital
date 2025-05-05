import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import RoleSelection from './RoleSelection'; 
import StrategySelection, { InvestmentStrategy } from './StrategySelection'; 
// Import the Zustand store and types
import { useOnboardingStore, InitialProfile } from '../../store/onboardingStore';
// Removed imports for placeholder components - defined below for now
// import FundingTypeSelection from './FundingTypeSelection'; 
// import HasPropertyNowSelection from './HasPropertyNowSelection'; 
// import OtherInterestInput from './OtherInterestInput'; 

// Placeholders for detailed question components - create these later
// import InvestorBuyBoxQuestions from '../components/profiling/InvestorBuyBoxQuestions';
// import LenderCriteriaQuestions from '../components/profiling/LenderCriteriaQuestions';
// import AgentSellerQuestions from '../components/profiling/AgentSellerQuestions';
import InvestorBuyBoxQuestions from '../profiling/InvestorBuyBoxQuestions'; // Import the actual component

// Keep UserProfileDraft for internal state management during the flow
export interface UserProfileDraft {
  role?: InitialProfile['role']; // Use type from store
  q2Answer?: string; // Use string to store Q2 answer generically
  [key: string]: any; 
}

// Update onComplete prop type
interface OnboardingFlowManagerProps {
  flowType: string; // Add flowType prop
  onComplete: (data: UserProfileDraft) => void; // Expect data on completion
}

// Default onComplete function (does nothing)
const noopComplete = (data: UserProfileDraft) => { console.log("Onboarding complete (no-op handler):", data); };

const OnboardingFlowManager: React.FC<OnboardingFlowManagerProps> = ({ 
    flowType = 'initial', // Default to initial flow
    onComplete = noopComplete // Use default handler if none provided
 }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  // Initialize with potential data if needed for multi-step flows later
  const [profileDraft, setProfileDraft] = useState<UserProfileDraft>({}); 
  const containerRef = useRef<HTMLDivElement>(null);
  const setZustandInitialProfile = useOnboardingStore((state) => state.setInitialProfile);

  // --- Transition Logic --- 
  const transitionToStep = (nextStep: number) => {
    const currentStepElement = containerRef.current?.firstChild as HTMLElement;
    if (!currentStepElement) {
      setCurrentStep(nextStep);
      return;
    }
    gsap.to(currentStepElement, {
      opacity: 0,
      y: -30,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        setCurrentStep(nextStep);
      },
    });
  };

  // --- Flow Completion ---
  const completeOnboarding = (finalProfileDraft: UserProfileDraft) => {
     // If it's the initial homepage flow, update the Zustand store
    if (flowType === 'initial') {
        const finalProfile: InitialProfile = {
            role: finalProfileDraft.role,
            q2Answer: finalProfileDraft.q2Answer,
        };
        console.log("Initial Onboarding Complete. Setting Zustand initialProfile:", finalProfile);
        setZustandInitialProfile(finalProfile); 
    }
    
    // Animate out the component and call the parent's onComplete with the data
    if (containerRef.current) {
        gsap.to(containerRef.current, {
            opacity: 0,
            y: -50, 
            duration: 0.5,
            ease: 'power2.in',
            onComplete: () => {
                console.log("Calling parent onComplete with:", finalProfileDraft);
                onComplete(finalProfileDraft); // Pass data to parent handler
            }
        });
    } else {
        console.log("Calling parent onComplete (no animation) with:", finalProfileDraft);
        onComplete(finalProfileDraft); // If no ref, just notify immediately
    }
  };

  // --- Handlers ---
  const handleRoleSelect = (role: UserProfileDraft['role']) => {
    const newDraft = { ...profileDraft, role };
    setProfileDraft(newDraft);
    console.log(`Flow '${flowType}': Selected Role:`, role);
    transitionToStep(currentStep + 1); 
  };

  // Generic handler for final step answers
  const handleFinalStepSelect = (answer: string | object) => { // Allow object for complex data
      // Determine the key based on flow type (example)
      let dataKey = 'q2Answer';
      if (flowType === 'deepProfile-investor') dataKey = 'buyBox';
      else if (flowType === 'deepProfile-lender') dataKey = 'lendingCriteria';
      // ... add other flow types

      const finalDraft = { ...profileDraft, [dataKey]: answer };
      setProfileDraft(finalDraft);
      console.log(`Flow '${flowType}': Final Answer/Data:`, answer);
      completeOnboarding(finalDraft); // Complete the flow
  };


  // --- Render Logic (Uses flowType) ---
  const renderCurrentStep = () => {
      // --- Initial Homepage Flow --- 
      if (flowType === 'initial') {
           switch (currentStep) {
            case 0:
                return <RoleSelection onSelectRole={handleRoleSelect} />;
            case 1: // Q2 based on Role
                switch (profileDraft.role) {
                case 'Investor / Buyer':
                    return <StrategySelection onSelectStrategy={handleFinalStepSelect} />;
                case 'Lender / Capital Provider':
                    return <FundingTypeSelection onSelectFundingType={handleFinalStepSelect} />;
                case 'Agent':
                case 'Wholesaler':
                case 'Property Owner / Seller':
                    return <HasPropertyNowSelection onSelectHasProperty={handleFinalStepSelect} />;
                case 'Other':
                    return <OtherInterestInput onSubmitDescription={handleFinalStepSelect} />;
                default:
                    console.error("OnboardingFlowManager ('initial'): Role not set for Step 1");
                    return <div>Error: Role not selected.</div>;
                }
            }
            return null; // Should not be reached
      }

      // --- Post-Signup Flows (Examples) ---
      else if (flowType === 'deepProfile-investor') {
           // Render the actual component, passing the final step handler
           return <InvestorBuyBoxQuestions onSubmit={handleFinalStepSelect} />;
      } 
      else if (flowType === 'deepProfile-lender') {
          // Render LenderCriteriaQuestions component steps here
           return <div>Lender Criteria Questions Placeholder (Flow: {flowType})<button onClick={() => handleFinalStepSelect({ region: 'All', loanMax: 1000000 })} className='p-2 bg-blue-200'>Finish Temp</button></div>;
      } 
      else if (flowType === 'profile-agentSeller') {
           // Render AgentSellerQuestions component steps here
           return <div>Agent/Seller Questions Placeholder (Flow: {flowType})<button onClick={() => handleFinalStepSelect({ primaryMarket: 'Test'})} className='p-2 bg-blue-200'>Finish Temp</button></div>;
      }
       else if (flowType === 'profile-other') {
           // Render questions specific to 'Other' role
           return <div>'Other' Role Questions Placeholder (Flow: {flowType})<button onClick={() => handleFinalStepSelect({ interest: 'Networking' })} className='p-2 bg-blue-200'>Finish Temp</button></div>;
      }

      // Fallback for unknown flowType
      console.error("OnboardingFlowManager: Unknown flowType:", flowType);
      return <div>Error: Invalid flow type.</div>;
  };

  // --- Effect for Incoming Animation --- 
  useEffect(() => {
    const newStepElement = containerRef.current?.firstChild as HTMLElement;
    if (newStepElement) {
      gsap.set(newStepElement, { opacity: 0, y: 30 });
      gsap.to(newStepElement, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        delay: 0.1,
      });
    }
  }, [currentStep]);

  return (
    // Add flowType class for potential specific styling
    <div ref={containerRef} className={`onboarding-step-container flow-${flowType} w-full max-w-3xl flex justify-center items-start p-4`}>
      {renderCurrentStep()}
    </div>
  );
};

// --- Placeholder Components (Define inline for now, create separate files later) ---

// Placeholder for: src/components/onboarding/FundingTypeSelection.tsx
const FundingTypeSelection: React.FC<{onSelectFundingType: (type: string) => void}> = ({onSelectFundingType}) => {
    const types = ["Hard Money", "Private Money", "Equity", "Other"];
    // Basic styling for placeholder buttons
    const buttonClass = "block w-full text-left p-3 border rounded hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600 mb-2";
    return (
        <div className="p-6 md:p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center w-full">
            <h2 className="text-2xl font-semibold text-primary dark:text-white mb-4">Lender Focus</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">What type of funding do you primarily offer?</p>
            <div className="grid grid-cols-2 gap-4">
                {types.map(type => (
                    <button key={type} onClick={() => onSelectFundingType(type)} className={buttonClass}>
                        {type}
                    </button>
                ))}
            </div>
        </div>
    );
};

// Placeholder for: src/components/onboarding/HasPropertyNowSelection.tsx
const HasPropertyNowSelection: React.FC<{onSelectHasProperty: (hasProperty: string) => void}> = ({onSelectHasProperty}) => {
    // Basic styling for placeholder buttons
    const buttonClass = "p-3 border rounded hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600 px-8";
    return (
        <div className="p-6 md:p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center w-full">
            <h2 className="text-2xl font-semibold text-primary dark:text-white mb-4">Current Property</h2>
             <p className="text-gray-600 dark:text-gray-300 mb-8">Do you have a specific property to submit right now?</p>
            <div className="flex justify-center gap-4">
                <button onClick={() => onSelectHasProperty('Yes')} className={buttonClass}>Yes</button>
                <button onClick={() => onSelectHasProperty('No')} className={buttonClass}>No (Just Exploring)</button>
            </div>
        </div>
    );
};

// Placeholder for: src/components/onboarding/OtherInterestInput.tsx
const OtherInterestInput: React.FC<{onSubmitDescription: (desc: string) => void}> = ({onSubmitDescription}) => {
    const [description, setDescription] = useState('');
    // Basic styling for placeholder buttons
    const buttonClass = "p-3 border rounded hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600 px-8 disabled:opacity-50";
    return (
        <div className="p-6 md:p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center w-full">
            <h2 className="text-2xl font-semibold text-primary dark:text-white mb-4">Your Role/Interest</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Could you briefly describe your role or interest in Domentra?</p>
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded mb-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                rows={3}
                placeholder="e.g., Real estate attorney, Appraiser, Service provider..."
            />
            <button onClick={() => onSubmitDescription(description || 'Other - Not Specified')} disabled={!description} className={buttonClass}>
                Continue
            </button>
        </div>
    );
};


export default OnboardingFlowManager;