import React from 'react';
import Modal from './Modal'; // Use the base modal
import InvestorBuyBoxQuestions from '../profiling/InvestorBuyBoxQuestions';
import { BuyBoxDetails } from '../../lib/firebaseFirestore';

interface InvestorPostSignupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCompleteFlow: (data: BuyBoxDetails) => void; // Callback when form is submitted
}

const InvestorPostSignupModal: React.FC<InvestorPostSignupModalProps> = ({ 
    isOpen, 
    onClose, 
    onCompleteFlow 
}) => {

    // This modal currently only has one step (the BuyBox form)
    // So, submitting the form directly completes the flow for this modal.
    const handleFormSubmit = (data: BuyBoxDetails) => {
        console.log("Investor Buy Box Submitted within Modal:", data);
        onCompleteFlow(data); // Pass data up to Home component handler
        // onClose(); // Home component will close the modal after saving
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Investor Profile Details"
            maxWidthClass="max-w-3xl" // Adjust width as needed
        >
            {/* Render the Investor Buy Box form inside the modal */}
            <InvestorBuyBoxQuestions onSubmit={handleFormSubmit} />
        </Modal>
    );
};

export default InvestorPostSignupModal; 