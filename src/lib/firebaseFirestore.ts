import { doc, setDoc, serverTimestamp, getDoc, updateDoc, collection, addDoc, query, where, onSnapshot, Timestamp, Unsubscribe, orderBy } from "firebase/firestore"; 
import { User } from "firebase/auth";
import { db } from "./firebaseConfig"; // Import your Firebase db instance

// Define the structure of our User Profile data in Firestore
export interface UserProfile {
  uid: string;
  email: string | null;
  role: 'investor' | 'lender';
  isVerified: boolean;
  createdAt: Timestamp; // Use Firestore Timestamp type
  // Add other fields as needed later (e.g., name, company)
}

// Define the structure of our Deal data in Firestore
export interface Deal {
  id?: string; // Firestore document ID (optional)
  submitterUid: string;
  submitterRole: 'investor' | 'lender';
  createdAt: Timestamp;
  status: 'active' | 'inactive' | 'funded' | 'expired'; // Example statuses
  
  // Core Deal Info
  dealName?: string; // Optional, maybe generate later
  propertyType: string; // Single Family, Multi Family, Other
  address: string;
  city: string;
  state: string;
  dealType: 'Double Close' | 'EMD' | 'Gap' | 'PML'; // From form type
  amountRequested: number;
  description?: string; // From 'Additional Details'?
  
  // Funding/Return Info
  offeredReturn?: number; // Percentage
  dealLength?: number; // Months
  roiEstimate?: number; // Optional, maybe calculated later
  
  // Conditional Fields (Add others as needed)
  exitStrategy?: string; // Wholesale, Fix & Flip, etc.
  rehabEstimate?: number;
  arv?: number;
  lienPosition?: string; // 1st, 2nd, Other
  
  // Attachments (Store URLs from Firebase Storage later)
  attachments?: { name: string; url: string }[];
  dealPitch?: string;
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
    const { email } = user;
    const createdAt = serverTimestamp(); // Get Firestore server timestamp
    const isVerified = false; // Default to not verified

    try {
      // Create the document with initial data
      await setDoc(userDocRef, {
        uid: user.uid,
        email,
        isVerified,
        createdAt,
        ...additionalData // Merge role and any other data passed
      });
      console.log("User profile created in Firestore for UID:", user.uid);
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
export const createDealDocument = async (dealData: Omit<Deal, 'id' | 'createdAt'>): Promise<string | null> => {
  try {
    const dealsCollectionRef = collection(db, "deals");
    const docRef = await addDoc(dealsCollectionRef, {
      ...dealData,
      amountRequested: Number(dealData.amountRequested) || 0, // Ensure number
      offeredReturn: Number(dealData.offeredReturn) || 0,
      dealLength: Number(dealData.dealLength) || 0,
      rehabEstimate: Number(dealData.rehabEstimate) || 0,
      arv: Number(dealData.arv) || 0,
      createdAt: serverTimestamp(), // Add server timestamp
      status: 'active' // Default status
    });
    console.log("Deal document created with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error creating deal document:", error);
    return null;
  }
};

/**
 * Fetches active deals from Firestore in real-time.
 * @param callback - Function to call with the deals array whenever it updates.
 * @returns Unsubscribe function.
 */
export const getActiveDeals = (callback: (deals: Deal[]) => void): Unsubscribe => {
  const dealsCollectionRef = collection(db, "deals");
  const q = query(
    dealsCollectionRef, 
    where("status", "==", "active"), // Only get active deals
    orderBy("createdAt", "desc") // Order by newest first
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const deals: Deal[] = [];
    querySnapshot.forEach((doc) => {
      deals.push({ id: doc.id, ...doc.data() } as Deal);
    });
    callback(deals);
  }, (error) => {
    console.error("Error fetching active deals: ", error);
    // Handle error appropriately in the UI if needed
    callback([]); // Send empty array on error
  });

  return unsubscribe; // Return the unsubscribe function for cleanup
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

// TODO: Add functions to fetch interests (sent/received)

// Add other Firestore functions later (e.g., fetchUserProfile, createDeal, getDeals) 