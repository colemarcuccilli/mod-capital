import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Deal, getDealsBySubmitter } from '../lib/firebaseFirestore'; // Import Deal and fetch function
import DealCard from '../components/organisms/DealCard'; // Reuse DealCard
import LoadingSpinner from '../components/atoms/LoadingSpinner';
import DealDetailModal from '../components/organisms/DealDetailModal'; // Import Modal
import { Unsubscribe } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; // For clicking cards

const MyDealsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [myDeals, setMyDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // State for Modal
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let unsubscribe: Unsubscribe = () => {}; // Initialize with no-op

    if (currentUser?.uid) {
      setIsLoading(true);
      setError(null);
      unsubscribe = getDealsBySubmitter(currentUser.uid, 
        (deals) => {
          setMyDeals(deals);
          setIsLoading(false);
        }, 
        (err) => {
          console.error("Error fetching user's deals:", err);
          setError("Failed to load your submitted deals.");
          setIsLoading(false);
        }
      );
    } else {
      // Handle case where user is not logged in (though ProtectedRoute should prevent this)
      setError("You must be logged in to view your deals.");
      setIsLoading(false);
    }

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [currentUser]); // Re-run if user changes

  const handleDealClick = (deal: Deal) => {
    console.log("Clicked my deal (handleDealClick):", deal.id);
    setSelectedDeal(deal);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDeal(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-primary mb-4">My Submitted Deals</h1>
      
      {isLoading ? (
         <div className="flex justify-center p-4"><LoadingSpinner /></div>
      ) : error ? (
        <p className="text-red-600 p-4">{error}</p>
      ) : myDeals.length === 0 ? (
        <p className="text-gray-500">You have not submitted any deals yet.</p>
      ) : (
        <div className="space-y-4">
          {myDeals.map((deal) => (
            // Use DealCard in list view, pass click handler
            <DealCard key={deal.id} deal={deal} view="list" onClick={handleDealClick} />
          ))}
        </div>
      )}
      
      {/* Render Modal */} 
      <DealDetailModal 
        deal={selectedDeal} 
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />
    </div>
  );
};

export default MyDealsPage; 