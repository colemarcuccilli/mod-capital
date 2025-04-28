import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { db } from '../lib/firebaseConfig'; // Import Firestore instance
import { collection, query, where, onSnapshot, QuerySnapshot, DocumentData, orderBy } from 'firebase/firestore'; // Import Firestore functions
import { NegotiationData } from '../lib/firebaseFirestore'; // Import the NegotiationData interface
import NegotiationCard from '../components/organisms/NegotiationCard'; // Import the new card component
import LoadingSpinner from '../components/atoms/LoadingSpinner'; // Import LoadingSpinner
import { FiMessageSquare } from 'react-icons/fi';
import IconWrapper from '../components/atoms/IconWrapper';

const NegotiationsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate(); // Initialize navigate
  const [negotiations, setNegotiations] = useState<NegotiationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) {
      setIsLoading(false);
      setError("Please log in to view negotiations.");
      return;
    }

    console.log('[NegotiationsPage] Subscribing to negotiations for user:', currentUser.uid);
    setIsLoading(true);
    setError(null);

    // Query for negotiations where the user is the lender OR the borrower
    const negotiationsCol = collection(db, 'negotiations');
    const q = query(negotiationsCol, 
        where('lenderId', '==', currentUser.uid)
        // We need separate queries or a composite index for OR queries involving different fields.
        // For simplicity, fetch where user is lender, then fetch where user is borrower, then combine.
        // Firestore doesn't support direct OR queries on different fields like (lenderId == uid || borrowerId == uid)
        // without composite indexes. A simpler approach initially is two listeners.
    );
    
    // Listener for negotiations where user is LENDER
    const unsubscribeLender = onSnapshot(q, 
      (snapshot: QuerySnapshot<DocumentData>) => {
        console.log(`[NegotiationsPage] Received ${snapshot.docs.length} negotiations where user is lender.`);
        const lenderNegotiations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NegotiationData));
        
        // Combine with borrower results (see below)
        setNegotiations(prev => {
            // Filter out duplicates if any (shouldn't happen with separate queries)
            const existingIds = new Set(prev.map(n => n.id));
            const uniqueNew = lenderNegotiations.filter(n => !existingIds.has(n.id));
            // Combine borrower list (from prev state if borrower listener ran first) and new lender list
            const borrowerList = prev.filter(p => p.borrowerId === currentUser.uid);
            return [...borrowerList, ...lenderNegotiations].sort((a, b) => (b.updatedAt?.toMillis() || 0) - (a.updatedAt?.toMillis() || 0)); // Sort by update time
        });
        setIsLoading(false);
      }, 
      (err) => {
        console.error("[NegotiationsPage] Error fetching lender negotiations:", err);
        setError("Failed to load negotiations.");
        setIsLoading(false);
      }
    );

    // Query and Listener for negotiations where user is BORROWER
    const qBorrower = query(negotiationsCol, 
        where('borrowerId', '==', currentUser.uid)
    );
    const unsubscribeBorrower = onSnapshot(qBorrower,
      (snapshot: QuerySnapshot<DocumentData>) => {
        console.log(`[NegotiationsPage] Received ${snapshot.docs.length} negotiations where user is borrower.`);
        const borrowerNegotiations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NegotiationData));

         // Combine with lender results
         setNegotiations(prev => {
            const existingIds = new Set(prev.map(n => n.id));
            const uniqueNew = borrowerNegotiations.filter(n => !existingIds.has(n.id));
            const lenderList = prev.filter(p => p.lenderId === currentUser.uid);
            return [...lenderList, ...borrowerNegotiations].sort((a, b) => (b.updatedAt?.toMillis() || 0) - (a.updatedAt?.toMillis() || 0)); // Sort by update time
        });
        setIsLoading(false);
      },
      (err) => {
        console.error("[NegotiationsPage] Error fetching borrower negotiations:", err);
        setError("Failed to load negotiations.");
        setIsLoading(false);
      }
    );

    // Cleanup function
    return () => {
      console.log('[NegotiationsPage] Unsubscribing from negotiations.');
      unsubscribeLender();
      unsubscribeBorrower();
    };

  }, [currentUser]);

  // Function to handle card click
  const handleNegotiationClick = (negotiation: NegotiationData) => {
    if (negotiation.id) {
      console.log("Navigating to negotiation:", negotiation.id);
      navigate(`/negotiations/${negotiation.id}`); // Use navigate function
    } else {
      console.error("Cannot navigate: Negotiation missing ID.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-6">My Negotiations</h1>

      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <LoadingSpinner size="lg" />
          <p className="ml-4 text-gray-500">Loading negotiations...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {!isLoading && !error && negotiations.length === 0 && (
        <div className="text-center py-10 px-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <IconWrapper name="FiMessageSquare" size={48} className="mx-auto text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No Active Negotiations</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">You are not currently involved in any deal negotiations.</p>
          {/* Optional: Link to Deal Room */}
          {/* <div className="mt-6">
            <Link to="/deal-room" className="btn btn-primary">
              Browse Deals
            </Link>
          </div> */}
        </div>
      )}

      {!isLoading && !error && negotiations.length > 0 && (
        <div className="space-y-4">
          {negotiations.map((neg) => (
            <NegotiationCard 
              key={neg.id} 
              negotiation={neg} 
              onClick={handleNegotiationClick} // Pass the handler
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NegotiationsPage; 