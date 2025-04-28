import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebaseConfig';
import { doc, onSnapshot, DocumentSnapshot, DocumentData, Timestamp, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { NegotiationData, NegotiationTermDetails, acceptProposal, rejectProposalReturnToSender, submitCounterProposal } from '../lib/firebaseFirestore';
import LoadingSpinner from '../components/atoms/LoadingSpinner';
import IconWrapper from '../components/atoms/IconWrapper';
import { FiCheckCircle, FiXCircle, FiMessageSquare, FiClock, FiArrowLeft } from 'react-icons/fi';
import CounterProposalModal from '../components/organisms/CounterProposalModal';

// Helper function to format Firestore Timestamps
const formatTimestamp = (timestamp: any): string => {
  if (!timestamp) return 'N/A';
  // Check if it's a Firestore Timestamp object
  if (timestamp.seconds) {
    return new Date(timestamp.seconds * 1000).toLocaleString();
  } 
  // If it's already a Date object or string (less likely but possible)
  if (timestamp instanceof Date) {
    return timestamp.toLocaleString();
  }
  return String(timestamp); // Fallback
};

// Helper component to display proposal terms consistently
interface ProposalTermsProps {
  terms: NegotiationTermDetails;
}
// Explicitly type the return value as React.ReactElement
const ProposalTermsDisplay: React.FC<ProposalTermsProps> = ({ terms }): React.ReactElement => (
  <ul className="list-disc pl-5 text-sm space-y-1 mt-1">
    <li><strong>Amount:</strong> ${terms.amount.toLocaleString()}</li>
    <li><strong>Return Rate:</strong> {terms.returnRate}%</li>
    <li><strong>Length:</strong> {terms.lengthOfFunding} days</li>
    <li><strong>Funding Type:</strong> {terms.fundingType || 'N/A'}</li>
    <li><strong>Exit Strategy:</strong> {terms.exitStrategy || 'N/A'}</li>
  </ul>
);

const NegotiationDetailPage: React.FC = () => {
  const { negotiationId } = useParams<{ negotiationId: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [negotiation, setNegotiation] = useState<NegotiationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isCounterModalOpen, setIsCounterModalOpen] = useState(false);

  useEffect(() => {
    if (!negotiationId || !currentUser) {
      setError("Negotiation ID missing or user not logged in.");
      setIsLoading(false);
      return;
    }

    console.log(`[NegotiationDetailPage] Subscribing to negotiation: ${negotiationId}`);
    setIsLoading(true);
    setError(null);

    const negotiationDocRef = doc(db, 'negotiations', negotiationId);

    const unsubscribe = onSnapshot(negotiationDocRef, 
      (docSnap: DocumentSnapshot<DocumentData>) => {
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() } as NegotiationData;
          // Basic security check: Ensure current user is part of this negotiation
          if (data.lenderId === currentUser.uid || data.borrowerId === currentUser.uid) {
            setNegotiation(data);
            setError(null);
          } else {
            setError("You do not have permission to view this negotiation.");
            setNegotiation(null);
          }
        } else {
          setError("Negotiation not found.");
          setNegotiation(null);
        }
        setIsLoading(false);
      }, 
      (err) => {
        console.error("[NegotiationDetailPage] Error fetching negotiation:", err);
        setError("Failed to load negotiation details.");
        setIsLoading(false);
      }
    );

    // Cleanup listener on component unmount
    return () => {
      console.log(`[NegotiationDetailPage] Unsubscribing from negotiation: ${negotiationId}`);
      unsubscribe();
    };

  }, [negotiationId, currentUser]);

  // --- Action Handlers --- 
  const handleAccept = async () => {
    if (!negotiationId || !currentUser) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await acceptProposal(negotiationId, currentUser.uid);
      // Optionally provide feedback or navigate away
      alert("Proposal Accepted!"); 
      // No navigation change needed as the listener will update the UI status
    } catch (err: any) {
      console.error("Accept Error:", err);
      setActionError(err.message || "Failed to accept proposal.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!negotiationId || !currentUser) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await rejectProposalReturnToSender(negotiationId, currentUser.uid);
      alert("Proposal Rejected. Waiting for other party to revise."); // Feedback
      // Status updates via listener
    } catch (err: any) {
      console.error("Reject Error:", err);
      setActionError(err.message || "Failed to reject proposal.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleMakeCounter = () => {
    setActionError(null); // Clear previous action errors
    setIsCounterModalOpen(true); // Open the modal
    // alert('Make Counter-Proposal action - Not implemented');
  };

  // New handler for submitting the counter proposal from the modal
  const handleCounterSubmit = async (newTerms: NegotiationTermDetails, message: string) => {
    if (!negotiationId || !currentUser) return;
    setActionLoading(true); // Use the existing action loading state
    setActionError(null);
    try {
      await submitCounterProposal(negotiationId, currentUser.uid, newTerms, message);
      alert("Counter-proposal submitted successfully!");
      setIsCounterModalOpen(false); // Close modal on success
    } catch (err: any) {
      console.error("Counter Proposal Error:", err);
      // Display error within the modal? Or keep it on the main page?
      // For now, keeping it on the main page via setActionError
      setActionError(err.message || "Failed to submit counter-proposal.");
      // Optionally keep modal open on error? For now, we close it.
      setIsCounterModalOpen(false); 
    } finally {
      setActionLoading(false);
    }
  };

  const handleWithdraw = () => {
      setActionError(null);
      alert('Withdraw action - Not implemented');
  }

  // Render Logic
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-10">
          <LoadingSpinner size="lg" />
          <p className="ml-4 text-gray-500">Loading negotiation details...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      );
    }

    if (!negotiation || !currentUser) {
       return <p>Negotiation data or user information could not be loaded.</p>;
    }

    const currentUserRole = negotiation.lenderId === currentUser.uid ? 'lender' : 'borrower';
    
    // Determine whose turn it is, considering the new rejection statuses
    const isMyTurn = 
        (negotiation.status === 'pending_borrower_response' && currentUserRole === 'borrower') ||
        (negotiation.status === 'pending_lender_response' && currentUserRole === 'lender') ||
        (negotiation.status === 'rejected_pending_lender_revision' && currentUserRole === 'lender') || // Lender must revise
        (negotiation.status === 'rejected_pending_borrower_revision' && currentUserRole === 'borrower'); // Borrower must revise
    
    const waitingForRevision = 
        (negotiation.status === 'rejected_pending_lender_revision' && currentUserRole === 'borrower') || // Borrower waits for lender
        (negotiation.status === 'rejected_pending_borrower_revision' && currentUserRole === 'lender'); // Lender waits for borrower

    // Original withdraw logic (can be refined later for universal withdraw)
    const canWithdraw = 
        (negotiation.status === 'pending_borrower_response' && negotiation.initialProposal.proposedBy === currentUserRole && negotiation.counterProposals?.length === 0) || // Lender withdraw initial
        (negotiation.status === 'pending_lender_response' && negotiation.counterProposals && negotiation.counterProposals[negotiation.counterProposals.length - 1]?.proposedBy === currentUserRole) || // Lender withdraw counter
        (negotiation.status === 'pending_borrower_response' && negotiation.counterProposals && negotiation.counterProposals[negotiation.counterProposals.length - 1]?.proposedBy === currentUserRole); // Borrower withdraw counter

    const getStatusInfo = () => {
      switch (negotiation.status) {
        case 'pending_borrower_response': return { text: 'Awaiting Borrower Response', icon: 'FiClock', color: 'text-yellow-600 bg-yellow-100' };
        case 'pending_lender_response': return { text: 'Awaiting Lender Response', icon: 'FiClock', color: 'text-yellow-600 bg-yellow-100' };
        // --- New Statuses --- 
        case 'rejected_pending_lender_revision': return { text: 'Rejected - Lender Revising', icon: 'FiClock', color: 'text-orange-600 bg-orange-100' }; 
        case 'rejected_pending_borrower_revision': return { text: 'Rejected - Borrower Revising', icon: 'FiClock', color: 'text-orange-600 bg-orange-100' };
        // --- End New Statuses --- 
        case 'accepted': return { text: 'Accepted', icon: 'FiCheckCircle', color: 'text-green-600 bg-green-100' };
        case 'rejected': return { text: 'Rejected (Final)', icon: 'FiXCircle', color: 'text-red-600 bg-red-100' }; // Clarify finality
        case 'withdrawn': return { text: 'Withdrawn', icon: 'FiXCircle', color: 'text-gray-500 bg-gray-100' };
        default: return { text: 'Unknown', icon: 'FiMessageSquare', color: 'text-gray-500 bg-gray-100' };
      }
    };
    const statusInfo = getStatusInfo();

    // Determine the latest terms to pre-fill the counter modal
    const latestTerms = 
      negotiation?.counterProposals && negotiation.counterProposals.length > 0
        ? negotiation.counterProposals[negotiation.counterProposals.length - 1].terms
        : negotiation?.initialProposal.terms;

    return (
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
         {/* ... Header Info ... */} 

        {/* Proposal History - Improved Layout */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-primary mb-3">Proposal History</h3>
          <div className="space-y-4 border-l-2 border-gray-200 dark:border-gray-600 pl-4 ml-1">
            {/* Initial Proposal */}
            <div className="relative p-4 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm bg-primary/5 dark:bg-gray-700/20">
              {/* Dot on timeline */}
              <div className="absolute -left-[23px] top-5 h-3 w-3 rounded-full bg-primary"></div>
              <p className="text-sm font-semibold text-primary dark:text-blue-300 mb-1">
                Initial Proposal
                <span className="text-xs font-normal text-gray-500 dark:text-gray-400 ml-2">
                  by {negotiation.initialProposal.proposedBy === currentUserRole ? 'You' : negotiation.initialProposal.proposedBy} on {formatTimestamp(negotiation.initialProposal.proposedAt)}
                </span>
              </p>
              <ProposalTermsDisplay terms={negotiation.initialProposal.terms} />
            </div>
            
            {/* Counter Proposals */} 
            {negotiation.counterProposals?.map((proposal, index) => (
              <div key={index} className="relative p-4 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm bg-secondary/5 dark:bg-gray-700/30">
                 {/* Dot on timeline */}
                 <div className="absolute -left-[23px] top-5 h-3 w-3 rounded-full bg-accent"></div>
                <p className="text-sm font-semibold text-accent dark:text-yellow-300 mb-1">
                  Counter-Proposal #{index + 1}
                   <span className="text-xs font-normal text-gray-500 dark:text-gray-400 ml-2">
                    by {proposal.proposedBy === currentUserRole ? 'You' : proposal.proposedBy} on {formatTimestamp(proposal.proposedAt)}
                  </span>
                </p>
                {proposal.message && (
                  <p className="text-sm italic text-gray-700 dark:text-gray-300 mb-2 border-l-4 border-gray-300 pl-2 py-1">
                    <strong>Message:</strong> {proposal.message}
                  </p>
                )}
                <ProposalTermsDisplay terms={proposal.terms} />
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons / Status Messages - Wrapped in a single conditional block */}
        {negotiation.status !== 'accepted' && negotiation.status !== 'rejected' && negotiation.status !== 'withdrawn' && (
          <div className="border-t pt-4 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-primary mb-3">Actions</h3>
            {/* Action Error Display */}
            {actionError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mb-3 text-sm" role="alert">
                {actionError}
              </div>
            )}

            {/* Content based on whose turn it is */}
            {isMyTurn ? (
              // Check if it's a revision turn after rejection
              negotiation.status === 'rejected_pending_lender_revision' || negotiation.status === 'rejected_pending_borrower_revision' 
              ? (
                  // Revision Turn: Only allow Counter or Withdraw
                  <div className="flex flex-col sm:flex-row gap-3 items-center">
                      <p className="text-sm text-orange-700 dark:text-orange-400 flex-grow italic">Your previous proposal was rejected. Please submit a revised counter-proposal.</p>
                      <button 
                          onClick={handleMakeCounter} 
                          disabled={actionLoading}
                          className="btn btn-primary flex-shrink-0 flex items-center justify-center disabled:opacity-50">
                          {actionLoading ? <LoadingSpinner size="sm" color="border-white"/> : <IconWrapper name="FiMessageSquare" className="mr-2"/>} Revise Proposal
                      </button>
                      {/* TODO: Add Universal Withdraw Button here too */} 
                  </div>
              ) : (
                  // Standard Turn: Accept / Reject (Return) / Counter
                  <div className="flex flex-col sm:flex-row gap-3">
                      <button /* Accept Button */ onClick={handleAccept} disabled={actionLoading} className="btn btn-success flex-1 flex items-center justify-center disabled:opacity-50">
                         {actionLoading ? <LoadingSpinner size="sm" color="border-white"/> : <IconWrapper name="FiCheckCircle" className="mr-2"/>} Accept Current Proposal
                      </button>
                      <button /* Reject Button */ onClick={handleReject} disabled={actionLoading} className="btn btn-danger flex-1 flex items-center justify-center disabled:opacity-50">
                        {actionLoading ? <LoadingSpinner size="sm" color="border-white"/> : <IconWrapper name="FiXCircle" className="mr-2"/>} Reject (Return for Revision)
                      </button>
                      <button /* Counter Button */ onClick={handleMakeCounter} disabled={actionLoading} className="btn btn-primary flex-1 flex items-center justify-center disabled:opacity-50">
                        {actionLoading ? <LoadingSpinner size="sm" color="border-white"/> : <IconWrapper name="FiMessageSquare" className="mr-2"/>} Make Counter-Proposal
                      </button>
                  </div>
              )
            ) : waitingForRevision ? (
              // Waiting for other party to revise after you rejected
              <p className="text-orange-600 italic text-sm">You rejected the last proposal. Waiting for the other party to revise.</p>
            ) : (
              // Standard waiting message
              <p className="text-gray-500 italic text-sm">Waiting for the other party to respond.</p>
            )}
            
            {/* Universal Withdraw Button Placeholder */}
            {/* Add the button outside the isMyTurn logic, but inside the main conditional block */} 
            <div className="mt-4 flex justify-end"> {/* Positioned at the end */} 
                 <button 
                   onClick={handleWithdraw} 
                   disabled={actionLoading} // Disable if another action is in progress
                   className="btn btn-outline btn-danger btn-sm disabled:opacity-50">
                   {actionLoading ? <LoadingSpinner size="xs"/> : 'Withdraw from Negotiation'}
                 </button>
             </div>
             
          </div> // End Actions Section Div
        )} 

        {/* Fallback message if negotiation is completed */}
        {(negotiation.status === 'accepted' || negotiation.status === 'rejected' || negotiation.status === 'withdrawn') && (
            <p className="text-gray-500 italic text-sm mt-4">This negotiation is closed.</p>
        )}

        {/* Render Counter Proposal Modal */} 
        {latestTerms && (
             <CounterProposalModal
                isOpen={isCounterModalOpen}
                onClose={() => setIsCounterModalOpen(false)}
                onSubmit={handleCounterSubmit}
                initialTerms={latestTerms} // Pass the latest terms
                isSubmitting={actionLoading} // Use main page action loading state
            />
        )}
      </div> // End Main Content Div
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
       <div className="mb-4">
           <Link to="/negotiations" className="inline-flex items-center text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-white">
               <IconWrapper name="FiArrowLeft" className="mr-1" size={16} /> Back to Negotiations List
           </Link>
       </div>
      <h1 className="text-3xl font-bold text-primary mb-6">Negotiation Process</h1>
      {renderContent()}
    </div>
  );
};

export default NegotiationDetailPage; 