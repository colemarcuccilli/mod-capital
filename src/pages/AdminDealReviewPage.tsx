import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, addDoc, collection } from "firebase/firestore";
import { db } from '../lib/firebaseConfig';
import { Deal, updateDealStatus, UserProfile, fetchUserProfile, BasicPropertyInfo, FundingDetails, DescriptionInfo, AttachmentMetadata } from '../lib/firebaseFirestore';
import LoadingSpinner from '../components/atoms/LoadingSpinner';
import { Timestamp, serverTimestamp } from 'firebase/firestore';

const AdminDealReviewPage: React.FC = () => {
  const { dealId } = useParams<{ dealId: string }>();
  const navigate = useNavigate();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [submitterProfile, setSubmitterProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackAction, setFeedbackAction] = useState<'rejected' | 'needs_info' | null>(null);
  const [feedbackText, setFeedbackText] = useState('');

  useEffect(() => {
    const fetchDealAndSubmitter = async () => {
      if (!dealId) {
        setError("No Deal ID");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      setActionError(null);
      try {
        const dealDocRef = doc(db, "submittedDeals", dealId);
        const docSnap = await getDoc(dealDocRef);
        if (docSnap.exists()) {
          const fetchedDeal = { id: docSnap.id, ...docSnap.data() } as Deal;
          setDeal(fetchedDeal);
          if (fetchedDeal.submitterUid) {
            const profile = await fetchUserProfile(fetchedDeal.submitterUid);
            setSubmitterProfile(profile);
          }
        } else {
          setError("Deal not found.");
        }
      } catch (err) {
        console.error("Err fetching deal:", err);
        setError("Failed fetch.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDealAndSubmitter();
  }, [dealId]);

  const handleStatusUpdate = async (newStatus: 'approved' | 'rejected' | 'needs_info', feedback?: string) => {
    if (!dealId || !submitterProfile?.email) return;
    if ((newStatus === 'rejected' || newStatus === 'needs_info') && !submitterProfile?.email) {
        setActionError("Cannot process action: Submitter email not found.");
        return; 
    }

    setIsActionLoading(true);
    setActionError(null);
    let statusUpdateSucceeded = false;

    const updateData: { status: string; adminFeedback?: string; updatedAt?: any } = {
        status: newStatus,
        updatedAt: serverTimestamp()
    };
    if (feedback !== undefined && (newStatus === 'rejected' || newStatus === 'needs_info')) {
        updateData.adminFeedback = feedback;
    }

    try {
      const dealDocRef = doc(db, "submittedDeals", dealId);
      await updateDoc(dealDocRef, updateData); 
      console.log(`Deal ${dealId} status updated successfully to ${newStatus}.`);
      statusUpdateSucceeded = true;

      if ((newStatus === 'rejected' || newStatus === 'needs_info') && submitterProfile?.email) {
          console.log("Attempting to queue email notification...");
          const emailSubject = newStatus === 'rejected' 
              ? `Update on your Domentra Deal Submission: ${deal?.basicInfo?.address || dealId}`
              : `Action Required for your Domentra Deal: ${deal?.basicInfo?.address || dealId}`;
          const emailHtmlBody = `
              <p>Hello ${submitterProfile.displayName || 'User'},</p>
              <p>Update regarding deal submission: <strong>${deal?.basicInfo?.address || 'N/A'}</strong>.</p>
              <p>Status: <strong>${newStatus.replace('_', ' ').toUpperCase()}</strong></p>
              ${feedback ? `<p><strong>Admin Feedback:</strong><br/>${feedback.replace(/\n/g, '<br/>')}</p>` : ''}
              ${newStatus === 'needs_info' ? '<p>Please review feedback and contact support if needed.</p>' : ''}
              <p>Thank you,<br/>The Domentra Team</p>
          `;
          const mailCollectionRef = collection(db, "dealNotifications");
          await addDoc(mailCollectionRef, {
              to: [submitterProfile.email], 
              message: { subject: emailSubject, html: emailHtmlBody },
          });
          console.log(`Email notification queued successfully for deal ${dealId} status ${newStatus}.`);
      }

      alert(`Deal status updated to ${newStatus}. Email notification queued successfully.`);
      closeFeedbackModal(); 
      navigate('/admin/review');
      
    } catch (err: any) {
      console.error(`Error during status update/email trigger for ${newStatus}:`, err);
      if (!statusUpdateSucceeded) {
          setActionError(`Failed to update deal status: ${err.message}`);
      } else {
          setActionError(`Deal status updated, but failed to queue notification: ${err.message}`);
          closeFeedbackModal();
          navigate('/admin/review');
      }
      setIsActionLoading(false);
    }
  };

  const openFeedbackModal = (action: 'rejected' | 'needs_info') => {
    setFeedbackAction(action);
    setFeedbackText('');
    setShowFeedbackModal(true);
  };

  const closeFeedbackModal = () => {
    setShowFeedbackModal(false);
    setFeedbackAction(null);
    setFeedbackText('');
  };

  const submitModalAction = () => {
      console.log("[submitModalAction] Clicked!", { feedbackAction, feedbackText, isActionLoading });
      if (feedbackAction) {
          handleStatusUpdate(feedbackAction, feedbackText);
      }
  }

  const formatDate = (timestamp: Timestamp | undefined): string => {
      if (!timestamp) return 'N/A';
      return timestamp.toDate().toLocaleString();
  }

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen"><LoadingSpinner /></div>;
  }

  if (error) {
    return <p className="text-red-600 p-4 text-center">Error: {error}</p>;
  }

  if (!deal) {
    return <p className="text-gray-500 p-4 text-center">Deal data could not be loaded.</p>;
  }

  const attachments = deal.attachments || [];

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-primary mb-4">Review Deal: {deal.basicInfo?.address ?? deal.id}</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
            <section>
                <h2 className="text-xl font-semibold border-b pb-2 mb-3">Submitter Info</h2>
                {submitterProfile ? (
                    <div className="text-sm space-y-1">
                        <p><strong>Name:</strong> {submitterProfile.displayName ?? 'N/A'}</p>
                        <p><strong>Email:</strong> {submitterProfile.email ?? 'N/A'}</p>
                        <p><strong>Phone:</strong> {submitterProfile.phoneNumber ?? 'N/A'}</p>
                        <p><strong>Role:</strong> <span className="capitalize">{submitterProfile.role}</span></p>
                        <p><strong>Verified:</strong> {submitterProfile.isVerified ? 'Yes' : 'No'}</p>
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 italic">Submitter profile loading or not found (UID: {deal.submitterUid}).</p>
                )}
            </section>
            
            <section>
                <h2 className="text-xl font-semibold border-b pb-2 mb-3">Property Info</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <p><strong>Address:</strong> {deal.basicInfo?.address ?? 'N/A'}, {deal.basicInfo?.city ?? 'N/A'}, {deal.basicInfo?.state ?? 'N/A'} {deal.basicInfo?.zip ?? 'N/A'}</p>
                    <p><strong>Type:</strong> {deal.basicInfo?.propertyType ?? 'N/A'}</p>
                    <p><strong>Condition:</strong> {deal.basicInfo?.condition ?? 'N/A'}</p>
                    <p><strong>Bedrooms:</strong> {deal.basicInfo?.bedrooms ?? 'N/A'}</p>
                    <p><strong>Bathrooms:</strong> {deal.basicInfo?.bathrooms ?? 'N/A'}</p>
                    <p><strong>Building Size:</strong> {deal.basicInfo?.buildingSize ? `${deal.basicInfo.buildingSize} sqft` : 'N/A'}</p>
                    <p><strong>Lot Size:</strong> {deal.basicInfo?.lotSize ? `${deal.basicInfo.lotSize} sqft` : 'N/A'}</p>
                    <p><strong>Ownership:</strong> {deal.basicInfo?.ownershipStatus ?? 'N/A'}</p>
                </div>
            </section>
            
            <section>
                <h2 className="text-xl font-semibold border-b pb-2 mt-4 mb-3">Funding Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <p><strong>Funding Type:</strong> {deal.fundingInfo?.fundingType ?? 'N/A'}</p>
                    <p><strong>Amount Requested:</strong> ${Number(deal.fundingInfo?.amountRequested || 0).toLocaleString() ?? 'N/A'}</p>
                    <p><strong>Length (Days):</strong> {deal.fundingInfo?.lengthOfFunding ?? 'N/A'}</p>
                    <p><strong>Projected Return:</strong> {deal.fundingInfo?.projectedReturn ? `${deal.fundingInfo.projectedReturn}%` : 'N/A'}</p>
                    <p><strong>Exit Strategy:</strong> {deal.fundingInfo?.exitStrategy ?? 'N/A'}</p>
                    <p><strong>Purchase Price:</strong> ${Number(deal.fundingInfo?.purchasePrice || 0).toLocaleString() ?? 'N/A'}</p>
                    <p><strong>Rehab Cost:</strong> ${Number(deal.fundingInfo?.rehabCost || 0).toLocaleString() ?? 'N/A'}</p>
                    <p><strong>ARV:</strong> ${Number(deal.fundingInfo?.arv || 0).toLocaleString() ?? 'N/A'}</p>
                </div>
            </section>

            <section>
                <h2 className="text-xl font-semibold border-b pb-2 mt-4 mb-3">Descriptions</h2>
                <div className="space-y-3 text-sm">
                    <p><strong>Brief Description:</strong> {deal.descriptionInfo?.briefDescription ?? 'N/A'}</p>
                    <p><strong>Market:</strong> {deal.descriptionInfo?.marketDescription ?? 'N/A'}</p>
                    <p><strong>Neighborhood:</strong> {deal.descriptionInfo?.neighborhoodDescription ?? 'N/A'}</p>
                    <p><strong>Highlights:</strong> {deal.descriptionInfo?.investmentHighlights ?? 'N/A'}</p>
                    <p><strong>Risks:</strong> {deal.descriptionInfo?.riskFactors ?? 'N/A'}</p>
                </div>
            </section>
            
            <section>
                <h2 className="text-xl font-semibold border-b pb-2 mt-4 mb-3">Attachments</h2>
                {attachments.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1 text-sm"> 
                        {attachments.map((att, index) => ( 
                            <li key={index}>
                                <a href={att.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">{att.name}</a> 
                                <span className="text-xs text-gray-500 ml-2">({att.type}, {(att.size / 1024).toFixed(1)} KB)</span>
                            </li> 
                        ))} 
                    </ul> 
                ) : <p className="text-gray-500 italic text-sm">No attachments uploaded.</p>}
            </section>

            <section>
                <h2 className="text-xl font-semibold border-b pb-2 mt-4 mb-3">Submission Info</h2>
                <div className="text-sm">
                    <p><strong>Submitted By UID:</strong> {deal.submitterUid}</p>
                    <p><strong>Submitted At:</strong> {formatDate(deal.createdAt)}</p>
                    <p><strong>Current Status:</strong> <span className="font-medium capitalize">{deal.status}</span></p>
                </div>
            </section>

            <div className="flex flex-wrap gap-4 pt-4 border-t mt-6">
                {deal.status === 'pending_review' && (
                    <>
                        <button onClick={() => handleStatusUpdate('approved')} disabled={isActionLoading} className={`btn btn-success ${isActionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>{isActionLoading ? <LoadingSpinner size="w-5 h-5"/> : 'Approve Deal'}</button>
                        <button onClick={() => openFeedbackModal('rejected')} disabled={isActionLoading} className={`btn btn-danger ${isActionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>{isActionLoading ? <LoadingSpinner size="w-5 h-5"/> : 'Reject Deal'}</button>
                        <button onClick={() => openFeedbackModal('needs_info')} disabled={isActionLoading} className={`btn btn-warning ${isActionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>{isActionLoading ? <LoadingSpinner size="w-5 h-5"/> : 'Request More Info'}</button>
                    </>
                )}
                {deal?.status && deal.status !== 'pending_review' && (
                    <p className="text-lg font-medium">Status: <span className="capitalize font-semibold">{deal.status.replace('_', ' ')}</span></p>
                )}
                <button onClick={() => navigate('/admin/review')} disabled={isActionLoading} className="btn btn-outline ml-auto">Back to Queue</button>
            </div>
             {actionError && <p className="text-red-600 text-sm mt-2">Action failed: {actionError}</p>} 
        </div> 
      </div>

      {showFeedbackModal && feedbackAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4">
            <h3 className="text-lg font-semibold mb-4 text-primary">
              {feedbackAction === 'rejected' ? 'Reason for Rejection' : 'Request for More Information'}
            </h3>
            <textarea
              rows={5}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder={`Provide feedback for the submitter regarding the ${feedbackAction === 'rejected' ? 'rejection' : 'request for info'}...`}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-accent focus:border-accent"
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button onClick={closeFeedbackModal} disabled={isActionLoading} className="btn btn-outline">Cancel</button>
              {(console.log("[Feedback Modal Render] Button State:", { 
                  isActionLoading, 
                  isFeedbackEmpty: feedbackText.trim().length === 0, 
                  shouldBeDisabled: isActionLoading || feedbackText.trim().length === 0 
              }), null) /* Log doesn't render anything */ }
              <button 
                onClick={submitModalAction} 
                disabled={isActionLoading || feedbackText.trim().length === 0}
                className={`btn ${feedbackAction === 'rejected' ? 'btn-danger' : 'btn-warning'} ${isActionLoading || feedbackText.trim().length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {isActionLoading ? <LoadingSpinner size="w-5 h-5"/> : 
                 (feedbackAction === 'rejected' ? 'Submit Rejection' : 'Submit Request')}
              </button>
            </div>
            {actionError && <p className="text-red-600 text-sm mt-2">{actionError}</p>} 
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDealReviewPage; 