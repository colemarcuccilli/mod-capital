import React, { useState, useEffect, useRef, FunctionComponent, SVGProps, FormEvent } from 'react';
import { Deal, BasicPropertyInfo, FundingDetails, DescriptionInfo, AttachmentMetadata, startNegotiation, NegotiationTermDetails } from '../../lib/firebaseFirestore'; // Import types and startNegotiation, added NegotiationTermDetails
import { FiX, FiInfo, FiFileText, FiDollarSign, FiMapPin, FiBarChart2, FiTrendingUp, FiAlertTriangle, FiCheckCircle, FiMessageSquare, FiDownloadCloud, FiUser } from 'react-icons/fi';
import IconWrapper from '../atoms/IconWrapper';
import LoadingSpinner from '../atoms/LoadingSpinner'; // Assuming this exists
import { useAuth } from '../../context/AuthContext'; // Import useAuth to get lender ID

interface DealDetailModalProps {
  deal: Deal | null;
  isOpen: boolean;
  onClose: () => void;
  // Add props for actions later, e.g., onFundDeal, onContactInvestor
}

// Interface for the tab structure using icon name (string)
interface TabInfo {
  id: string;
  label: string;
  icon: string; // Store icon name as string
}

// Interface for the funding proposal form data
interface FundProposalFormState {
  proposedAmount: string;
  proposedReturn: string;
  proposedFundingType: 'EMD' | 'Double Close' | 'Gap Funding' | 'Bridge Loan' | 'New Construction' | 'Rental Loan' | '';
  proposedExitStrategy: 'Sell' | 'Refinance' | '';
  proposedLengthOfFunding: string;
}

// Placeholder for risk score calculation/fetching
const getRiskDetails = (deal: Deal | null): { score: number; level: 'Low' | 'Medium' | 'High'; color: string } => {
    // TODO: Implement actual risk calculation based on deal data
    const score = 85; // Placeholder
    let level: 'Low' | 'Medium' | 'High' = 'Medium';
    let color = 'bg-yellow-100 text-yellow-800';
    if (score >= 75) { level = 'Low'; color = 'bg-green-100 text-green-800'; }
    else if (score < 50) { level = 'High'; color = 'bg-red-100 text-red-800'; }
    return { score, level, color };
};

const DealDetailModal: React.FC<DealDetailModalProps> = ({ deal, isOpen, onClose }) => {
  const { currentUser } = useAuth(); // Get current user (lender)
  const [activeTab, setActiveTab] = useState('overview');
  const modalContentRef = useRef<HTMLDivElement>(null);
  // State for the funding proposal form
  const [proposalForm, setProposalForm] = useState<FundProposalFormState>({
    proposedAmount: '',
    proposedReturn: '',
    proposedFundingType: '',
    proposedExitStrategy: '',
    proposedLengthOfFunding: '',
  });
  const [isSubmittingProposal, setIsSubmittingProposal] = useState(false);
  const [proposalError, setProposalError] = useState<string | null>(null);

  useEffect(() => {
    // Prevent body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    // Reset scroll position of modal content when deal changes or modal opens
    if (isOpen && modalContentRef.current) {
        modalContentRef.current.scrollTop = 0;
        setActiveTab('overview'); // Reset to overview tab
    }

    // Initialize form when deal data is available or changes
    if (deal?.fundingInfo) {
      setProposalForm({
        proposedAmount: String(deal.fundingInfo.amountRequested || 0),
        proposedReturn: String(deal.fundingInfo.projectedReturn || 0),
        proposedFundingType: deal.fundingInfo.fundingType || '',
        proposedExitStrategy: deal.fundingInfo.exitStrategy || '',
        proposedLengthOfFunding: String(deal.fundingInfo.lengthOfFunding || ''),
      });
      setProposalError(null); // Clear previous errors
      setIsSubmittingProposal(false); // Reset submission state
    }

    return () => {
      document.body.style.overflow = 'auto'; // Cleanup
    };
  }, [isOpen, deal]); // Rerun when isOpen or deal changes

  if (!isOpen || !deal) return null;

  // Safely access nested data
  const basicInfo: Partial<BasicPropertyInfo> = deal.basicInfo || {};
  const fundingInfo: Partial<FundingDetails> = deal.fundingInfo || {};
  const descriptionInfo: Partial<DescriptionInfo> = deal.descriptionInfo || {};
  const attachments: AttachmentMetadata[] = deal.attachments || [];
  const riskDetails = getRiskDetails(deal);
  const amountRequested = Number(fundingInfo.amountRequested || 0);
  const projectedReturn = Number(fundingInfo.projectedReturn || 0);
  const arv = Number(fundingInfo.arv || 0);
  const purchasePrice = Number(fundingInfo.purchasePrice || 0);
  const rehabCost = Number(fundingInfo.rehabCost || 0);
  const potentialInvestorProfit = arv - purchasePrice - rehabCost - amountRequested; // Simplified example
  const potentialLenderProfit = amountRequested * (projectedReturn / 100); // Simplified example

  // TODO: Fetch submitter/investor details separately based on deal.submitterUid
  const investor = {
      name: "Michael Johnson",
      company: "Golden Gate Investments",
      yearsInBusiness: 8,
      completedDeals: 25,
      rating: 4.8,
      isVerified: true // Placeholder
  }

  // Handler for proposal form input changes
  const handleProposalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Basic validation for numeric fields
    if ((name === 'proposedAmount' || name === 'proposedReturn' || name === 'proposedLengthOfFunding') && value !== '' && isNaN(Number(value))) {
      // Prevent non-numeric input
      return;
    }
    setProposalForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handler for submitting the funding proposal
  const handleProposalSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!deal || !currentUser || !deal.id || !deal.submitterUid || !deal.basicInfo?.address) { // Added checks for required fields
      setProposalError("Cannot submit proposal: Required deal data (ID, Submitter UID, Address) or user data missing.");
      return;
    }
    setIsSubmittingProposal(true);
    setProposalError(null);
    console.log("[DealDetailModal] Submitting funding proposal:", proposalForm);

    // --- Call Firestore 'startNegotiation' --- 
    try {
      // Prepare terms, converting form strings to numbers where needed
      const proposedTerms: NegotiationTermDetails = { // Explicitly type
        amount: Number(proposalForm.proposedAmount),
        returnRate: Number(proposalForm.proposedReturn),
        fundingType: proposalForm.proposedFundingType, // Already correct type
        exitStrategy: proposalForm.proposedExitStrategy, // Already correct type
        lengthOfFunding: Number(proposalForm.proposedLengthOfFunding), // Convert to number
      };
      const originalTerms: NegotiationTermDetails = { // Explicitly type
        amount: Number(deal.fundingInfo?.amountRequested || 0),
        returnRate: Number(deal.fundingInfo?.projectedReturn || 0),
        fundingType: deal.fundingInfo?.fundingType || '',
        exitStrategy: deal.fundingInfo?.exitStrategy || '',
        lengthOfFunding: Number(deal.fundingInfo?.lengthOfFunding || 0),
      };

      // Ensure required fields are present before calling
      if (!deal.id || !deal.submitterUid || !deal.basicInfo?.address) {
          throw new Error("Missing critical deal information (ID, submitterUid, or address) required to start negotiation.");
      }

      const negotiationId = await startNegotiation({
        dealId: deal.id, 
        borrowerId: deal.submitterUid, // Ensure submitterUid is available on deal object
        lenderId: currentUser.uid,
        proposedTerms: proposedTerms,
        originalDealTerms: originalTerms,
        dealAddress: deal.basicInfo.address // Pass denormalized address
      });
      
      console.log(`Negotiation started successfully! ID: ${negotiationId}`);
      alert("Funding proposal submitted successfully!"); // Simple feedback for now
      // Optionally close modal or switch tab after success
      onClose(); 

    } catch (error) {
      console.error("Error starting negotiation:", error);
      setProposalError(error instanceof Error ? error.message : "Failed to submit proposal. Please try again.");
    } finally {
      setIsSubmittingProposal(false);
    }
    // --- End Firestore call ---

    // --- Remove Placeholder Logic ---
    // await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
    // console.warn("[DealDetailModal] Placeholder: Negotiation submission logic not yet implemented.");
    // setIsSubmittingProposal(false);
    // setProposalError("Submission functionality is under development."); // Uncomment to show user message
    // --------------------------
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-4 text-sm">
            <p>{descriptionInfo.briefDescription || 'No overview provided.'}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-500">Funding Type</p>
                    <p className="font-medium text-primary">{fundingInfo.fundingType || 'N/A'}</p>
                </div>
                 <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-500">Amount</p>
                    <p className="font-medium text-primary">${amountRequested.toLocaleString()}</p>
                </div>
                 <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-500">Offered Return</p>
                    <p className="font-medium text-primary">{projectedReturn}%</p>
                </div>
                 <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-500">Risk Score</p>
                    <p className={`font-medium ${riskDetails.color.replace('bg-', 'text-').replace('-100', '-700')}`}>{riskDetails.level} ({riskDetails.score}/100)</p>
                </div>
            </div>
          </div>
        );
      case 'property':
         return (
            <div className="space-y-3 text-sm">
                <h4 className="font-semibold text-primary mb-1">Property Details</h4>
                <p><strong>Type:</strong> {basicInfo.propertyType || 'N/A'}</p>
                <p><strong>Condition:</strong> {basicInfo.condition || 'N/A'}</p>
                <p><strong>Bedrooms:</strong> {basicInfo.bedrooms || 'N/A'}</p>
                <p><strong>Bathrooms:</strong> {basicInfo.bathrooms || 'N/A'}</p>
                <p><strong>Building Size:</strong> {basicInfo.buildingSize ? `${basicInfo.buildingSize} sqft` : 'N/A'}</p>
                <p><strong>Lot Size:</strong> {basicInfo.lotSize ? `${basicInfo.lotSize} sqft` : 'N/A'}</p>
                {/* TODO: Add structural integrity if available */}
                <p><strong>Structural Integrity:</strong> Solid foundation (Placeholder)</p>
                <h4 className="font-semibold text-primary mt-4 mb-1">Investment Breakdown</h4>
                 <p><strong>Purchase Price:</strong> ${purchasePrice.toLocaleString()}</p>
                 <p><strong>Rehab Cost:</strong> ${rehabCost.toLocaleString()}</p>
                 <p><strong>After Repair Value (ARV):</strong> ${arv.toLocaleString()}</p>
                 <p><strong>Potential Investor Profit:</strong> ${potentialInvestorProfit.toLocaleString()}</p>
            </div>
        );
      case 'market':
         return (
             <div className="space-y-3 text-sm">
                 <h4 className="font-semibold text-primary mb-1">Market Overview</h4>
                 <p>{descriptionInfo.marketDescription || 'No market description provided.'}</p>
                 <h4 className="font-semibold text-primary mt-4 mb-1">Comparable Sales Range</h4>
                 {/* TODO: Fetch/display actual comps */} 
                 <p>$300,000 - $350,000 (Placeholder)</p>
                 <p><strong>Projected ARV:</strong> ${arv.toLocaleString()}</p>
             </div>
        );
      case 'neighborhood':
         return (
             <div className="space-y-3 text-sm">
                 <h4 className="font-semibold text-primary mb-1">Neighborhood</h4>
                 <p>{descriptionInfo.neighborhoodDescription || 'No neighborhood description provided.'}</p>
                 {/* TODO: Add map component */}
                 {/* <PropertyMap address={...} /> */} 
             </div>
         );
      case 'investment':
         return (
             <div className="space-y-3 text-sm">
                 <h4 className="font-semibold text-primary mb-1">Funding Details</h4>
                 <p><strong>Funding Type:</strong> {fundingInfo.fundingType || 'N/A'}</p>
                 <p><strong>Amount Requested:</strong> ${amountRequested.toLocaleString()}</p>
                 <p><strong>Exit Strategy:</strong> {fundingInfo.exitStrategy || 'N/A'}</p>
                 <p><strong>Length of Funding:</strong> {fundingInfo.lengthOfFunding || 'N/A'} days</p>
                 {/* <p><strong>Time Remaining:</strong> {deal.timeRemaining} days</p> */} 

                 <h4 className="font-semibold text-primary mt-4 mb-1">Returns</h4>
                 <p><strong>Offered Return:</strong> {projectedReturn}%</p>
                 <p><strong>Potential Lender Profit:</strong> ${potentialLenderProfit.toLocaleString()}</p>
                 <p><strong>Potential Investor Profit:</strong> ${potentialInvestorProfit.toLocaleString()}</p>

                 <h4 className="font-semibold text-primary mt-4 mb-1">Risk Assessment</h4>
                 <p><strong>{riskDetails.level} Risk</strong> ({riskDetails.score}/100)</p>
                 <p className="text-xs text-gray-500">Calculated based on property, market, and investor track record.</p>

                 <h4 className="font-semibold text-primary mt-4 mb-1">Investor Information</h4>
                 {/* Placeholder - Fetch investor details later */}
                 <div className="flex items-center">
                     <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 flex items-center justify-center font-bold text-primary">{investor.name.charAt(0)}</div>
                     <div>
                         <p className="font-medium">{investor.name} {investor.isVerified && <IconWrapper name="FiCheckCircle" className="inline-block ml-1 text-green-500" />}</p>
                         <p className="text-xs text-gray-500">{investor.company}</p>
                         <p className="text-xs text-gray-500">{investor.yearsInBusiness} years | {investor.completedDeals} deals | {investor.rating}/5 rating</p>
                     </div>
                 </div>
             </div>
         );
      case 'documents':
        return (
          <div>
            <h4 className="font-semibold text-primary mb-2">Available Documents</h4>
            {attachments.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {attachments.map((att, index) => (
                  <li key={index}>
                    <a href={att.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline flex items-center">
                      <IconWrapper name="FiFileText" className="mr-2" /> {att.name}
                      <IconWrapper name="FiDownloadCloud" className="ml-auto text-gray-400 hover:text-accent" />
                    </a> 
                    <span className="text-xs text-gray-500 ml-6">({att.type}, {(att.size / 1024).toFixed(1)} KB)</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic text-sm">No documents uploaded for this deal yet.</p>
            )}
          </div>
        );
      case 'fund':
        return (
          <div className="space-y-4">
            <h4 className="font-semibold text-primary mb-3">Propose Funding Terms</h4>
            <form onSubmit={handleProposalSubmit} className="space-y-4">
              {proposalError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <strong className="font-bold">Error: </strong>
                  <span className="block sm:inline">{proposalError}</span>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Proposed Amount */}
                <div>
                  <label htmlFor="proposedAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Funding Amount ($)
                    <span className="text-xs text-gray-500 ml-1">(Original: ${Number(deal?.fundingInfo?.amountRequested || 0).toLocaleString()})</span>
                  </label>
                  <input
                    type="number"
                    name="proposedAmount"
                    id="proposedAmount"
                    value={proposalForm.proposedAmount}
                    onChange={handleProposalChange}
                    required
                    disabled={isSubmittingProposal}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm disabled:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    placeholder="e.g., 100000"
                    step="1000" // Optional: Add step for number input
                  />
                </div>

                {/* Proposed Return */}
                <div>
                  <label htmlFor="proposedReturn" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Proposed Return (%)
                     <span className="text-xs text-gray-500 ml-1">(Original: {Number(deal?.fundingInfo?.projectedReturn || 0)}%)</span>
                  </label>
                  <input
                    type="number"
                    name="proposedReturn"
                    id="proposedReturn"
                    value={proposalForm.proposedReturn}
                    onChange={handleProposalChange}
                    required
                    disabled={isSubmittingProposal}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm disabled:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    placeholder="e.g., 12"
                    step="0.1" // Optional: Allow decimal returns
                  />
                </div>
              </div>

              {/* --- New Negotiable Fields --- */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {/* Proposed Length of Funding */}
                <div>
                  <label htmlFor="proposedLengthOfFunding" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Funding Length (Days)
                     <span className="text-xs text-gray-500 ml-1">(Original: {deal?.fundingInfo?.lengthOfFunding || 'N/A'} days)</span>
                  </label>
                  <input
                    type="number"
                    name="proposedLengthOfFunding"
                    id="proposedLengthOfFunding"
                    value={proposalForm.proposedLengthOfFunding}
                    onChange={handleProposalChange}
                    required
                    disabled={isSubmittingProposal}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm disabled:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    placeholder="e.g., 30"
                    min="1"
                  />
                </div>

                {/* Proposed Funding Type */}
                <div>
                  <label htmlFor="proposedFundingType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Funding Type
                     <span className="text-xs text-gray-500 ml-1">(Original: {deal?.fundingInfo?.fundingType || 'N/A'})</span>
                  </label>
                  <select
                    name="proposedFundingType"
                    id="proposedFundingType"
                    value={proposalForm.proposedFundingType}
                    onChange={handleProposalChange}
                    required
                    disabled={isSubmittingProposal}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm rounded-md disabled:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Select Type...</option>
                    <option value="EMD">EMD</option>
                    <option value="Double Close">Double Close</option>
                    <option value="Gap Funding">Gap Funding</option>
                    <option value="Bridge Loan">Bridge Loan</option>
                    <option value="New Construction">New Construction</option>
                    <option value="Rental Loan">Rental Loan</option>
                  </select>
                </div>

                {/* Proposed Exit Strategy */}
                <div>
                  <label htmlFor="proposedExitStrategy" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Exit Strategy
                     <span className="text-xs text-gray-500 ml-1">(Original: {deal?.fundingInfo?.exitStrategy || 'N/A'})</span>
                  </label>
                  <select
                    name="proposedExitStrategy"
                    id="proposedExitStrategy"
                    value={proposalForm.proposedExitStrategy}
                    onChange={handleProposalChange}
                    required
                    disabled={isSubmittingProposal}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm rounded-md disabled:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Select Strategy...</option>
                    <option value="Sell">Sell</option>
                    <option value="Refinance">Refinance</option>
                  </select>
                </div>
              </div>
              {/* --- End New Fields --- */}

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmittingProposal}
                  className="btn btn-primary w-full flex justify-center items-center disabled:opacity-50"
                >
                  {isSubmittingProposal ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Submitting...</span>
                    </>
                  ) : (
                    'Submit Funding Proposal'
                  )}
                </button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  You can propose different terms or submit the original requested terms to start the funding process.
                </p>
              </div>
            </form>
          </div>
        );
      default:
        return null;
    }
  };

  // Use the TabInfo interface with icon name (string)
  const tabs: TabInfo[] = [
    { id: 'overview', label: 'Overview', icon: 'FiInfo' },
    { id: 'property', label: 'Property', icon: 'FiMapPin' },
    { id: 'market', label: 'Market', icon: 'FiBarChart2' },
    { id: 'investment', label: 'Investment', icon: 'FiTrendingUp' },
    { id: 'documents', label: 'Documents', icon: 'FiFileText' },
    { id: 'fund', label: 'Fund / Negotiate', icon: 'FiDollarSign' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */} 
      <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Panel */} 
      <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */} 
        <div className="flex items-start justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
           <div>
                <h2 className="text-xl font-semibold text-primary dark:text-white">{basicInfo.address}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{basicInfo.city}, {basicInfo.state} &bull; {fundingInfo.fundingType}</p>
           </div>
           <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
                <IconWrapper name="FiX" size={20} />
           </button>
        </div>

        {/* Main Content Area (Scrollable) */} 
        <div ref={modalContentRef} className="flex-grow overflow-y-auto p-6">
            {/* Top Section */} 
            <div className="flex flex-col md:flex-row gap-6 mb-6">
                {/* Key Info Block */} 
                <div className="flex-grow space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Funding Amount</span>
                        <span className="text-lg font-semibold text-primary dark:text-white">${amountRequested.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Offered Return</span>
                        <span className="text-lg font-semibold text-accent dark:text-accent-light">{projectedReturn}%</span>
                    </div>
                     <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Risk Score</span>
                        <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${riskDetails.color}`}>{riskDetails.level} ({riskDetails.score}/100)</span>
                    </div>
                    {/* Add Time Remaining later */} 
                     {/* <div className="flex justify-between items-center">...Time Remaining...</div> */}
                     
                </div>
                 {/* Action Buttons */} 
                <div className="flex-shrink-0 flex flex-col space-y-2 w-full md:w-auto">
                    <button className="btn btn-outline w-full">Contact Investor</button>
                    <button className="btn btn-link btn-sm w-full">View Verified Contracts</button>
                     {/* Add button to jump to Fund tab? */}
                     <button
                        onClick={() => setActiveTab('fund')}
                        className="btn btn-secondary btn-sm w-full mt-1 md:mt-0"
                    >
                        Go to Funding Proposal
                    </button>
                </div>
            </div>

            {/* Tab Navigation */} 
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                 <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
                    {tabs.map((tab) => {
                       const isActive = activeTab === tab.id;
                       return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center 
                                    ${isActive
                                        ? 'border-accent text-accent'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'
                                    }`}
                            >
                                {/* Use IconWrapper with the icon name string */} 
                                <IconWrapper 
                                    name={tab.icon} 
                                    className={`mr-2 ${isActive ? 'text-accent' : 'text-gray-400'}`} 
                                    size={16} 
                                />
                                {tab.label}
                            </button>
                        );
                    })}
                 </nav>
            </div>

            {/* Tab Content */} 
            <div className="prose dark:prose-invert max-w-none">
                {renderTabContent()}
            </div>
        </div>
      </div>
    </div>
  );
};

export default DealDetailModal; 