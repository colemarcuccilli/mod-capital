import React, { useState, useEffect } from 'react';
import { getActiveDeals } from '../lib/firebaseFirestore'; // Ensure active
import type { Deal } from '../lib/firebaseFirestore'; // Import the Deal interface
import { Link } from 'react-router-dom'; // For linking to deal details later
import { useAuth } from '../context/AuthContext'; // To check if user is logged in

const DealRoom: React.FC = () => {
  const { currentUser, currentUserProfile } = useAuth(); // Also get profile for role check later
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true); // Start loading
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // --- ENSURE FIRESTORE LISTENER IS ACTIVE ---
    if (!currentUser) { 
      setLoading(false);
      setError("Please log in to view the Deal Room."); 
      return;
    }
    
    // Add verification check later based on currentUserProfile.isVerified
    // if (!currentUserProfile?.isVerified) { ... }
    
    setLoading(true);
    setError(null);

    console.log("[DealRoom] Subscribing to active deals...");
    const unsubscribe = getActiveDeals((fetchedDeals) => {
      console.log("[DealRoom] Received deals:", fetchedDeals.length);
      setDeals(fetchedDeals);
      setLoading(false); 
      setError(null); 
    });

    return () => {
        console.log("[DealRoom] Unsubscribing from deals.");
        unsubscribe();
    }
    // --- END ENSURE ---
  }, [currentUser, currentUserProfile]); // Add profile to dependencies 

  return (
    <div className="container mx-auto py-16 min-h-[60vh]">
      <h1 className="text-3xl font-bold text-primary mb-8">Deal Room</h1>
      
      {loading && <p className="text-primary/80">Loading deals...</p>} 
      {error && <p className="text-red-600">{error}</p>}
      
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {/* Restore deal mapping logic */}
           {
             deals.length === 0 ? (
               <p className="text-primary/80 md:col-span-2 lg:col-span-3 text-center">
                 No active deals found at the moment. Submit one!
               </p>
             ) : (
               deals.map((deal) => (
                 <div key={deal.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col">
                   <h3 className="text-xl font-semibold text-primary mb-2">{deal.dealName || `Deal ID: ${deal.id?.substring(0,6)}`}</h3>
                   <p className="text-sm text-gray-500 mb-1">Type: {deal.dealType}</p>
                   <p className="text-sm text-gray-500 mb-3">Location: {deal.city}, {deal.state}</p>
                   <p className="text-lg font-bold text-accent mb-4">
                     ${deal.amountRequested?.toLocaleString() ?? 'N/A'}
                   </p>
                   <p className="text-sm text-primary/80 mb-4 line-clamp-3 flex-grow">
                     {deal.description || 'No description provided.'} 
                   </p>
                   {/* TODO: Add Express Interest Logic */}
                   <button 
                       className="mt-auto text-accent hover:text-accent/80 font-medium text-sm self-start"
                       onClick={() => alert(`Expressing interest for deal ${deal.id}`)} 
                   >
                     View Details & Express Interest
                   </button>
                 </div>
               ))
             )
           } 
        </div>
      )}
    </div>
  );
};

export default DealRoom; 