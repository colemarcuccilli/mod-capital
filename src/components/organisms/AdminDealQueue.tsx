import React, { useState, useEffect } from 'react';
import { Deal, getPendingReviewDeals, updateDealStatus } from '../../lib/firebaseFirestore'; // Assuming updateDealStatus will be created
import LoadingSpinner from '../atoms/LoadingSpinner';
import { Unsubscribe, Timestamp, collection, getDocs, query, where } from 'firebase/firestore'; // Import needed functions
import { db } from '../../lib/firebaseConfig'; // Import db
import { Link } from 'react-router-dom'; // Import Link

const AdminDealQueue: React.FC = () => {
  const [pendingDeals, setPendingDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    // Use the new function to fetch deals awaiting review
    const unsubscribe: Unsubscribe = getPendingReviewDeals((deals) => {
      setPendingDeals(deals);
      setIsLoading(false);
    }, (err) => {
      console.error("Error fetching deals for admin queue:", err);
      setError("Failed to load deals.");
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const formatDate = (timestamp: Timestamp | undefined): string => {
      if (!timestamp) return 'N/A';
      return timestamp.toDate().toLocaleDateString();
  }

  // --- TEST FUNCTION --- 
  const runDirectFetchTest = async () => {
    console.log("[AdminDealQueue] Running direct fetch test...");
    setError(null);
    try {
      const dealsRef = collection(db, "submittedDeals");
      // Try fetching ALL deals, regardless of status, limit 1 for test
      const q = query(dealsRef, where("status", "==", "pending_review")); 
      const querySnapshot = await getDocs(q);
      console.log(`[AdminDealQueue] Direct fetch query executed. Found ${querySnapshot.size} documents.`);
      querySnapshot.forEach((doc) => {
        console.log("[AdminDealQueue] Direct fetch doc:", doc.id, "=>", doc.data());
      });
      alert(`Direct fetch test successful! Found ${querySnapshot.size} pending deals. Check console.`);
    } catch (err: any) {
      console.error("[AdminDealQueue] Direct fetch FAILED:", err);
      setError(`Direct fetch failed: ${err.message}`);
      alert(`Direct fetch FAILED! Check console. Error: ${err.message}`);
    }
  }
  // --- END TEST FUNCTION ---

  if (isLoading) {
    return <div className="flex justify-center p-4"><LoadingSpinner /></div>;
  }

  if (error) {
    return <p className="text-red-600 p-4">{error}</p>;
  }

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-primary">Pending Deal Review</h2>
        <button onClick={runDirectFetchTest} className="btn btn-secondary btn-sm">Run Direct Fetch Test</button>
      </div>
      {error && <p className="text-red-600 p-4 mb-4">Listener Error: {error}</p>} 
      {pendingDeals.length === 0 && !isLoading && !error ? (
        <p className="text-gray-500">No deals currently awaiting review (according to listener).</p>
      ) : (
        <div className="space-y-3">
          {pendingDeals.map((deal) => (
            <Link 
              key={deal.id} 
              to={`/admin/review/${deal.id}`}
              className="block border border-gray-200 p-4 rounded-md hover:bg-gray-50 transition-colors duration-150"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <p className="font-medium text-primary">{deal.basicInfo?.address || 'N/A'}, {deal.basicInfo?.city || 'N/A'}, {deal.basicInfo?.state || 'N/A'}</p>
                  <p className="text-sm text-gray-600">Type: {deal.fundingInfo?.fundingType || 'N/A'} | Amount: ${Number(deal.fundingInfo?.amountRequested || 0).toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Submitted: {formatDate(deal.createdAt)} by {deal.submitterUid.substring(0, 6)}...</p>
                </div>
                <span className="text-xs text-accent mt-2 md:mt-0">Review Deal &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDealQueue; 