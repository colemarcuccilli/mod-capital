import { doc, setDoc, serverTimestamp, getDoc, updateDoc, collection, addDoc, query, where, onSnapshot, Timestamp, Unsubscribe, orderBy } from "firebase/firestore"; 
import { User } from "firebase/auth";
import { db } from "./firebaseConfig"; // Import your Firebase db instance

// Define the structure of our User Profile data in Firestore
export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  phoneNumber: string | null;
  role: 'investor' | 'lender' | 'admin';
  isVerified: boolean;
  createdAt: Timestamp; // Use Firestore Timestamp type
  bio?: string;
  profilePictureUrl?: string;
  // Add other fields as needed later (e.g., company, experience)
}

// Export nested interfaces so they can be imported elsewhere
export interface BasicPropertyInfo { address: string; city: string; state: string; zip: string; propertyType: 'SFR' | 'Multi-family 2-4' | 'Multi-family 5+' | 'Commercial' | 'Land' | ''; condition: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Needs Full Rehab' | ''; bedrooms: string; bathrooms: string; buildingSize: string; lotSize: string; ownershipStatus: 'Owned' | 'Under Contract' | 'Making Offer' | 'Wholesaler' | ''; }
export interface FundingDetails { fundingType: 'EMD' | 'Double Close' | 'Gap Funding' | 'Bridge Loan' | 'New Construction' | 'Rental Loan' | ''; amountRequested: string; lengthOfFunding: string; projectedReturn: string; exitStrategy: 'Sell' | 'Refinance' | ''; purchasePrice: string; rehabCost: string; arv: string; }
export interface DescriptionInfo { briefDescription: string; marketDescription: string; neighborhoodDescription: string; investmentHighlights: string; riskFactors: string; }
export interface AttachmentMetadata { name: string; url: string; type: string; size: number; }

// Define the structure of our Deal data in Firestore (with nesting)
export interface Deal {
  id?: string; 
  submitterUid: string;
  submitterRole: 'investor' | 'lender' | 'admin' | string; 
  createdAt: Timestamp;
  status: 'pending_review' | 'approved' | 'rejected' | 'funded' | 'expired' | 'inactive' | 'needs_info' | string; 
  updatedAt?: Timestamp; // Optional: Track last update
  adminFeedback?: string; // Added field for admin feedback
  
  // Nested form data
  basicInfo?: BasicPropertyInfo;
  fundingInfo?: FundingDetails;
  descriptionInfo?: DescriptionInfo;
  attachments?: AttachmentMetadata[]; 
  
  // Optional top-level fields
  address?: string; 
  city?: string;
  state?: string;
  amountRequested?: number; 
  projectedReturn?: number;
  imageUrl?: string; 
}

// Define the structure of our Interest data in Firestore
export interface Interest {
  id?: string; // Firestore document ID (optional)
  dealId: string;
  dealOwnerUid: string;
  interestedUserUid: string;
  interestedUserRole: 'investor' | 'lender';
  status: 'new' | 'contacted' | 'rejected'; // Example statuses
  createdAt: Timestamp;
}

// Structure for storing document metadata in Firestore
export interface DocumentMetadata {
  id: string; // Firestore document ID
  userId: string; // UID of the uploading user
  fileName: string; // Original name of the file
  storagePath: string; // Full path in Firebase Storage
  downloadURL: string; // Publicly accessible URL for the file
  fileType: string; // MIME type (e.g., 'application/pdf')
  fileSize: number; // Size in bytes
  category: 'Loan Documents' | 'Property Documents' | 'Legal Documents' | 'Tax Documents' | 'Insurance Documents' | 'Other Documents';
  tags: string[]; // User-defined tags
  associatedDealId?: string; // Optional: Link to a deal
  associatedPropertyAddress?: string; // Optional: Quick reference
  createdAt: Timestamp; // Firestore Timestamp
  lastViewedAt?: Timestamp; // Optional: For 'Recently Viewed' feature
}

// Interface for the structure of a Negotiation document
export interface NegotiationTermDetails {
  amount: number;
  returnRate: number; // e.g., 12 for 12%
  fundingType: 'EMD' | 'Double Close' | 'Gap Funding' | 'Bridge Loan' | 'New Construction' | 'Rental Loan' | '';
  exitStrategy: 'Sell' | 'Refinance' | '';
  lengthOfFunding: number; // In days
}

export interface NegotiationData {
  id?: string; // Firestore document ID, added after creation
  dealId: string;
  dealAddress: string; // Denormalized for easier display
  borrowerId: string;
  lenderId: string;
  status: 
    | 'pending_borrower_response' 
    | 'pending_lender_response' 
    | 'rejected_pending_lender_revision' // Added status
    | 'rejected_pending_borrower_revision' // Added status
    | 'accepted' 
    | 'rejected' // This will now signify a final rejection (maybe only via Withdraw? TBD)
    | 'withdrawn';
  initialProposal: {
    terms: NegotiationTermDetails;
    proposedAt: any; // Firestore Timestamp
    proposedBy: 'lender'; // Initial proposal is always by lender in this flow
  };
  counterProposals?: Array<{
    terms: NegotiationTermDetails;
    proposedAt: any; // Firestore Timestamp
    proposedBy: 'borrower' | 'lender';
    message?: string; // Optional message with the counter
  }>;
  acceptedTerms?: NegotiationTermDetails; // Store final terms upon acceptance
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
  // Link to original deal for context
  originalDealTerms: NegotiationTermDetails;
}

/**
 * Creates a user profile document in Firestore.
 * @param user - The Firebase Auth User object.
 * @param additionalData - Any additional data to store (like role).
 */
export const createUserProfileDocument = async (user: User, additionalData: { role: 'investor' | 'lender' }) => {
  if (!user) return;

  // Get a reference to the document path: /users/{userId}
  const userDocRef = doc(db, "users", user.uid);

  // Check if the document already exists (shouldn't happen with signup, but good practice)
  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    // Get values from the Auth user object (might be null)
    const { email, displayName, phoneNumber, uid } = user;
    const createdAt = serverTimestamp(); // Get Firestore server timestamp
    const isVerified = false; // Default to not verified

    try {
      // Create the document with initial data
      await setDoc(userDocRef, {
        uid, // Use destructured uid
        email,
        displayName: displayName || '', // Use provided name or empty string
        phoneNumber: phoneNumber || '', // Use provided phone or empty string
        profilePictureUrl: null, // Initialize as null
        bio: '', // Initialize as empty
        isVerified,
        createdAt,
        ...additionalData // Merge role and any other data passed
      });
      console.log("User profile created in Firestore for UID:", uid);
    } catch (error) {
      console.error("Error creating user profile in Firestore:", error);
      // Optionally re-throw or handle the error appropriately
    }
  }
};

/**
 * Updates the verification status for a user in Firestore.
 * Used by the admin verification process.
 * @param uid - The User UID to verify.
 * @param status - The verification status (usually true).
 */
export const updateUserVerificationStatus = async (uid: string, status: boolean) => {
  if (!uid) return;
  const userDocRef = doc(db, "users", uid);
  try {
    await updateDoc(userDocRef, { isVerified: status });
    console.log(`User ${uid} verification status updated to ${status}`);
  } catch (error) {
    console.error("Error updating user verification status:", error);
  }
};

/**
 * Fetches a user's profile from Firestore.
 * @param uid - The User UID.
 * @returns The UserProfile data or null if not found/error.
 */
export const fetchUserProfile = async (uid: string): Promise<UserProfile | null> => {
  if (!uid) {
    console.log("fetchUserProfile: No UID provided.");
    return null;
  }
  console.log(`fetchUserProfile: Attempting to get doc for UID: ${uid}`);
  const userDocRef = doc(db, "users", uid);
  try {
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      console.log("fetchUserProfile: Document found for UID:", uid);
      return { uid, ...docSnap.data() } as UserProfile;
    } else {
      console.log("fetchUserProfile: No profile document found for UID:", uid);
      return null;
    }
  } catch (error) {
    console.error(`fetchUserProfile: Error getting document for UID ${uid}:`, error);
    return null;
  }
};

/**
 * Creates a new deal document in Firestore.
 * @param dealData - The data for the new deal (excluding id, createdAt).
 */
export const createDealDocument = async (
    dealData: { // Define input param type inline for clarity
        submitterUid: string;
        submitterRole: 'investor' | 'lender' | 'admin';
        basicInfo: BasicPropertyInfo;
        fundingInfo: FundingDetails;
        descriptionInfo: DescriptionInfo;
        attachments?: AttachmentMetadata[];
        imageUrl?: string | null; // Allow null explicitly
    }
): Promise<string | null> => {
  try {
    const dealsCollectionRef = collection(db, "submittedDeals");
    
    // Construct the object to save, converting necessary fields
    const dataToSave = {
        submitterUid: dealData.submitterUid,
        submitterRole: dealData.submitterRole,
        basicInfo: dealData.basicInfo, // Pass directly
        fundingInfo: {
            ...dealData.fundingInfo,
            // Convert numeric fields stored as strings in the form/interface back to numbers for Firestore if needed
            // Note: Adjust based on whether your Deal interface expects numbers or strings for these
            amountRequested: Number(dealData.fundingInfo.amountRequested) || 0,
            projectedReturn: Number(dealData.fundingInfo.projectedReturn) || 0,
            purchasePrice: Number(dealData.fundingInfo.purchasePrice) || 0,
            rehabCost: Number(dealData.fundingInfo.rehabCost) || 0,
            arv: Number(dealData.fundingInfo.arv) || 0,
            // Keep others as strings if defined that way in FundingDetails
            lengthOfFunding: dealData.fundingInfo.lengthOfFunding,
            fundingType: dealData.fundingInfo.fundingType,
            exitStrategy: dealData.fundingInfo.exitStrategy
        },
        descriptionInfo: dealData.descriptionInfo, // Pass directly
        attachments: dealData.attachments || [], // Default to empty array
        imageUrl: dealData.imageUrl || null, // Use provided or null
        
        // Explicitly set status and timestamp
        status: 'pending_review' as const, // Ensure literal type
        createdAt: serverTimestamp(), 
    };

    const docRef = await addDoc(dealsCollectionRef, dataToSave);
    console.log("Deal document created with ID: ", docRef.id, " Data: ", dataToSave);
    return docRef.id;
  } catch (error) {
    console.error("Error creating deal document:", error);
    return null;
  }
};

/**
 * Fetches active deals from Firestore in real-time.
 * @param callback - Function to call with the deals array whenever it updates.
 * @param onError - Optional function to call if there is an error.
 * @returns Unsubscribe function.
 */
export const getApprovedDeals = (
  callback: (deals: Deal[]) => void, 
  onError?: (error: Error) => void 
): Unsubscribe => {
  console.log("[Firestore] Fetching APPROVED deals..."); 
  const dealsCollectionRef = collection(db, "submittedDeals");
  const q = query(
    dealsCollectionRef, 
    where("status", "==", "approved"), // Fetch APPROVED deals
    orderBy("createdAt", "desc") 
  );
  const unsubscribe = onSnapshot(q, (querySnapshot) => { const deals: Deal[] = []; querySnapshot.forEach((doc) => { deals.push({ id: doc.id, ...doc.data() } as Deal); }); callback(deals); }, (error) => { console.error("Error fetching approved deals: ", error); if (onError) { onError(error); } else { callback([]); } });
  return unsubscribe; 
};

/**
 * Creates a new interest document in Firestore.
 * @param interestData - Data for the interest record.
 */
export const createInterestDocument = async (interestData: Omit<Interest, 'id' | 'createdAt'>): Promise<string | null> => {
   try {
    const interestsCollectionRef = collection(db, "interests");
    const docRef = await addDoc(interestsCollectionRef, {
      ...interestData,
      createdAt: serverTimestamp(),
      status: 'new' // Default status
    });
    console.log("Interest document created with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error creating interest document:", error);
    return null;
  }
};

/**
 * Updates the status of a specific deal document.
 * @param dealId - The ID of the deal document to update.
 * @param newStatus - The new status string (e.g., 'approved', 'rejected', 'funded').
 */
export const updateDealStatus = async (dealId: string, newStatus: string): Promise<void> => {
  if (!dealId) {
    throw new Error("Deal ID is required to update status.");
  }
  const dealDocRef = doc(db, "submittedDeals", dealId);
  try {
    await updateDoc(dealDocRef, { 
      status: newStatus 
      // Optionally add an 'updatedAt' timestamp here as well
      // updatedAt: serverTimestamp()
    });
    console.log(`Deal ${dealId} status updated to ${newStatus}`);
  } catch (error) {
    console.error(`Error updating deal ${dealId} status to ${newStatus}:`, error);
    throw error; // Re-throw error to be handled by the calling component
  }
};

// NEW: Function to fetch deals pending review for Admin
export const getPendingReviewDeals = (
  callback: (deals: Deal[]) => void, 
  onError?: (error: Error) => void 
): Unsubscribe => {
  console.log("[Firestore] Fetching PENDING_REVIEW deals..."); 
  const dealsCollectionRef = collection(db, "submittedDeals");
  const q = query(
    dealsCollectionRef, 
    where("status", "==", "pending_review"), // Fetch PENDING_REVIEW deals
    orderBy("createdAt", "asc") // Order by oldest first for review queue
  );
  const unsubscribe = onSnapshot(q, (querySnapshot) => { const deals: Deal[] = []; querySnapshot.forEach((doc) => { deals.push({ id: doc.id, ...doc.data() } as Deal); }); callback(deals); }, (error) => { console.error("Error fetching pending review deals: ", error); if (onError) { onError(error); } else { callback([]); } });
  return unsubscribe; 
};

// NEW: Function to fetch deals submitted by a specific user
export const getDealsBySubmitter = (
  userId: string, 
  callback: (deals: Deal[]) => void, 
  onError?: (error: Error) => void 
): Unsubscribe => {
  console.log(`[Firestore] Fetching deals submitted by user: ${userId}`); 
  const dealsCollectionRef = collection(db, "submittedDeals");
  const q = query(
    dealsCollectionRef, 
    where("submitterUid", "==", userId), // Filter by submitterUid
    orderBy("createdAt", "desc") // Order by newest first
  );
  
  const unsubscribe = onSnapshot(q, (querySnapshot) => { 
    const deals: Deal[] = []; 
    querySnapshot.forEach((doc) => { 
      deals.push({ id: doc.id, ...doc.data() } as Deal); 
    }); 
    callback(deals); 
  }, (error) => { 
    console.error(`Error fetching deals for submitter ${userId}: `, error);
    if (onError) {
      onError(error);
    } else {
      callback([]); // Send empty array on error
    }
  });
  
  return unsubscribe; 
};

// TODO: Add functions to fetch interests (sent/received)

// --- Function to Start a Negotiation ---
interface StartNegotiationParams {
  dealId: string;
  borrowerId: string;
  lenderId: string;
  proposedTerms: NegotiationTermDetails;
  originalDealTerms: NegotiationTermDetails;
  dealAddress: string; // Pass address for denormalization
}

export const startNegotiation = async ({ 
  dealId, 
  borrowerId, 
  lenderId, 
  proposedTerms, 
  originalDealTerms,
  dealAddress
}: StartNegotiationParams): Promise<string> => {
  console.log(`[Firestore] Starting negotiation for deal ${dealId} by lender ${lenderId}...`);
  try {
    const negotiationCol = collection(db, 'negotiations');
    const timestamp = serverTimestamp();

    const newNegotiationData: Omit<NegotiationData, 'id'> = {
      dealId,
      dealAddress, // Store denormalized address
      borrowerId,
      lenderId,
      status: 'pending_borrower_response', // Initial status
      initialProposal: {
        terms: proposedTerms,
        proposedAt: timestamp,
        proposedBy: 'lender',
      },
      counterProposals: [], // Initialize as empty array
      createdAt: timestamp,
      updatedAt: timestamp,
      originalDealTerms: originalDealTerms
    };

    const docRef = await addDoc(negotiationCol, newNegotiationData);
    console.log(`[Firestore] Negotiation document created with ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error("[Firestore] Error starting negotiation:", error);
    // Consider more specific error handling or re-throwing
    throw new Error("Failed to start negotiation in Firestore.");
  }
};

// --- Function to Accept a Proposal ---
export const acceptProposal = async (negotiationId: string, acceptingUserId: string): Promise<void> => {
  console.log(`[Firestore] Attempting to accept proposal for negotiation ${negotiationId} by user ${acceptingUserId}`);
  const negotiationDocRef = doc(db, 'negotiations', negotiationId);

  try {
    const docSnap = await getDoc(negotiationDocRef);
    if (!docSnap.exists()) {
      throw new Error("Negotiation document not found.");
    }

    const negotiation = docSnap.data() as NegotiationData;

    // Determine who should be accepting based on status
    const expectedAcceptorId = 
      negotiation.status === 'pending_borrower_response' ? negotiation.borrowerId :
      negotiation.status === 'pending_lender_response' ? negotiation.lenderId :
      null;

    // Validation
    if (!expectedAcceptorId) {
      throw new Error(`Negotiation status '${negotiation.status}' does not allow acceptance.`);
    }
    if (acceptingUserId !== expectedAcceptorId) {
      throw new Error(`User ${acceptingUserId} is not the expected party to accept this proposal.`);
    }

    // Determine the terms being accepted
    const termsToAccept = negotiation.counterProposals && negotiation.counterProposals.length > 0
      ? negotiation.counterProposals[negotiation.counterProposals.length - 1].terms
      : negotiation.initialProposal.terms;

    await updateDoc(negotiationDocRef, {
      status: 'accepted',
      acceptedTerms: termsToAccept,
      updatedAt: serverTimestamp()
    });

    console.log(`[Firestore] Negotiation ${negotiationId} successfully accepted.`);

    // TODO: Trigger notifications, update related deal status if needed

  } catch (error) {
    console.error(`[Firestore] Error accepting negotiation ${negotiationId}:`, error);
    throw new Error("Failed to accept negotiation proposal."); // Re-throw for frontend handling
  }
};

// --- Function to Reject a Proposal (Sends back to proposer for revision) ---
export const rejectProposalReturnToSender = async (negotiationId: string, rejectingUserId: string): Promise<void> => {
  console.log(`[Firestore] Attempting to reject (return) proposal for negotiation ${negotiationId} by user ${rejectingUserId}`);
  const negotiationDocRef = doc(db, 'negotiations', negotiationId);

  try {
    const docSnap = await getDoc(negotiationDocRef);
    if (!docSnap.exists()) {
      throw new Error("Negotiation document not found.");
    }

    const negotiation = docSnap.data() as NegotiationData;

    let newStatus: NegotiationData['status'];
    let expectedRejectorId: string | null;

    // Determine expected rejector and new status
    if (negotiation.status === 'pending_borrower_response') {
      expectedRejectorId = negotiation.borrowerId;
      newStatus = 'rejected_pending_lender_revision'; // Lender needs to revise
    } else if (negotiation.status === 'pending_lender_response') {
      expectedRejectorId = negotiation.lenderId;
      newStatus = 'rejected_pending_borrower_revision'; // Borrower needs to revise
    } else {
       throw new Error(`Negotiation status '${negotiation.status}' cannot be rejected in this manner.`);
    }

    // Validation
    if (rejectingUserId !== expectedRejectorId) {
      throw new Error(`User ${rejectingUserId} is not the expected party to reject this proposal.`);
    }

    await updateDoc(negotiationDocRef, {
      status: newStatus,
      updatedAt: serverTimestamp()
    });

    console.log(`[Firestore] Negotiation ${negotiationId} successfully rejected (returned to sender). New status: ${newStatus}`);

    // TODO: Trigger notifications

  } catch (error) {
    console.error(`[Firestore] Error rejecting (returning) negotiation ${negotiationId}:`, error);
    throw new Error("Failed to reject negotiation proposal."); // Re-throw for frontend handling
  }
};

// --- Function to Submit a Counter-Proposal ---
export const submitCounterProposal = async (
  negotiationId: string, 
  proposingUserId: string, 
  newTerms: NegotiationTermDetails,
  message?: string // Optional message
): Promise<void> => {
  console.log(`[Firestore] Attempting to submit counter-proposal for negotiation ${negotiationId} by user ${proposingUserId}`);
  const negotiationDocRef = doc(db, 'negotiations', negotiationId);

  try {
    const docSnap = await getDoc(negotiationDocRef);
    if (!docSnap.exists()) {
      throw new Error("Negotiation document not found.");
    }

    const negotiation = docSnap.data() as NegotiationData;

    // Determine who should be proposing and the next status
    let expectedProposerId: string | null;
    let nextStatus: NegotiationData['status'];
    let proposedByRole: 'lender' | 'borrower';

    if (negotiation.status === 'pending_borrower_response' || negotiation.status === 'rejected_pending_borrower_revision') {
      expectedProposerId = negotiation.borrowerId;
      proposedByRole = 'borrower';
      nextStatus = 'pending_lender_response'; // Now lender needs to respond
    } else if (negotiation.status === 'pending_lender_response' || negotiation.status === 'rejected_pending_lender_revision') {
      expectedProposerId = negotiation.lenderId;
      proposedByRole = 'lender';
      nextStatus = 'pending_borrower_response'; // Now borrower needs to respond
    } else {
      throw new Error(`Negotiation status '${negotiation.status}' does not allow counter-proposals.`);
    }

    // Validation
    if (proposingUserId !== expectedProposerId) {
      throw new Error(`User ${proposingUserId} is not the expected party (${expectedProposerId}) to make a counter-proposal in the current status (${negotiation.status}).`);
    }

    // Prepare the new proposal object
    const newProposalEntry = {
      terms: newTerms,
      proposedAt: serverTimestamp(),
      proposedBy: proposedByRole,
      ...(message && { message: message }) // Include message only if provided
    };

    // Get existing proposals or initialize empty array
    const existingProposals = negotiation.counterProposals || [];

    await updateDoc(negotiationDocRef, {
      counterProposals: [...existingProposals, newProposalEntry], // Append new proposal
      status: nextStatus,
      updatedAt: serverTimestamp()
    });

    console.log(`[Firestore] Negotiation ${negotiationId} successfully updated with counter-proposal. New status: ${nextStatus}`);

    // TODO: Trigger notifications

  } catch (error) {
    console.error(`[Firestore] Error submitting counter-proposal for negotiation ${negotiationId}:`, error);
    throw new Error("Failed to submit counter-proposal."); // Re-throw for frontend handling
  }
};

// Add other Firestore functions later (e.g., fetchUserProfile, createDeal, getDeals) 