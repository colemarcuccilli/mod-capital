import React from 'react';
import { NegotiationData } from '../../lib/firebaseFirestore';
import { FiArrowRight, FiClock, FiUser, FiUsers, FiCheckCircle, FiXCircle, FiMessageSquare } from 'react-icons/fi';
import IconWrapper from '../atoms/IconWrapper';
import { useAuth } from '../../context/AuthContext'; // To determine user's role in negotiation

interface NegotiationCardProps {
  negotiation: NegotiationData;
  onClick?: (negotiation: NegotiationData) => void; // For opening details later
}

const getStatusInfo = (status: NegotiationData['status'], currentUserRole: 'lender' | 'borrower'): { text: string; icon: string; color: string } => {
  switch (status) {
    case 'pending_borrower_response':
      return { text: currentUserRole === 'lender' ? 'Awaiting Borrower Response' : 'Action Required: Respond to Proposal', icon: 'FiClock', color: 'text-yellow-600' };
    case 'pending_lender_response':
      return { text: currentUserRole === 'borrower' ? 'Awaiting Lender Response' : 'Action Required: Respond to Counter-proposal', icon: 'FiClock', color: 'text-yellow-600' };
    case 'accepted':
      return { text: 'Accepted', icon: 'FiCheckCircle', color: 'text-green-600' };
    case 'rejected':
      return { text: 'Rejected', icon: 'FiXCircle', color: 'text-red-600' };
    case 'withdrawn':
       return { text: 'Withdrawn', icon: 'FiXCircle', color: 'text-gray-500' };
    default:
      return { text: 'Unknown', icon: 'FiMessageSquare', color: 'text-gray-500' };
  }
};

const NegotiationCard: React.FC<NegotiationCardProps> = ({ negotiation, onClick }) => {
  const { currentUser } = useAuth();
  const { id, dealAddress, initialProposal, status, lenderId, borrowerId, counterProposals } = negotiation;

  if (!currentUser) return null; // Should not happen if page is protected

  const currentUserRole = currentUser.uid === lenderId ? 'lender' : 'borrower';
  const statusInfo = getStatusInfo(status, currentUserRole);
  const latestProposal = counterProposals && counterProposals.length > 0 
                         ? counterProposals[counterProposals.length - 1] 
                         : initialProposal;

  const handleClick = () => {
    if (onClick) {
      onClick(negotiation);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer mb-4 border border-transparent hover:border-accent"
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-md font-semibold text-gray-900 dark:text-white truncate pr-4">
            Negotiation for: {dealAddress}
          </h3>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${statusInfo.color.split('-')[1]}/10 ${statusInfo.color}`}>
            <IconWrapper name={statusInfo.icon} size={12} className="mr-1" />
            {statusInfo.text}
          </span>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1 mb-3">
           <p><strong>Deal ID:</strong> {negotiation.dealId}</p> 
           <p><strong>Parties:</strong> You ({currentUserRole}) & {currentUserRole === 'lender' ? 'Borrower' : 'Lender'} </p>
           {/* Display latest proposed terms */}
           <p>
             <strong>Latest Offer:</strong> 
             ${latestProposal.terms.amount.toLocaleString()} at {latestProposal.terms.returnRate}% <br />
             Type: {latestProposal.terms.fundingType || 'N/A'} | 
             Term: {latestProposal.terms.lengthOfFunding} days | 
             Exit: {latestProposal.terms.exitStrategy || 'N/A'}
             <br />
             <span className="text-xs">(Proposed by: {latestProposal.proposedBy})</span>
           </p>
        </div>

        {/* Add Actions or View Details Button */}
        <div className="flex justify-end">
            <button
              className="btn btn-secondary btn-sm flex items-center"
              onClick={handleClick}
            >
              View Details <IconWrapper name={'FiArrowRight'} size={14} className="ml-1" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default NegotiationCard; 