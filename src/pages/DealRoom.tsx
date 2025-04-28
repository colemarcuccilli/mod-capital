import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { getApprovedDeals, Deal } from '../lib/firebaseFirestore';
import SearchFilterBar from '../components/molecules/SearchFilterBar';
import ViewToggle from '../components/molecules/ViewToggle';
import DealCard from '../components/organisms/DealCard';
import LoadingSpinner from '../components/atoms/LoadingSpinner';
import DealDetailModal from '../components/organisms/DealDetailModal';
import { Unsubscribe } from 'firebase/firestore';

const DealRoom: React.FC = () => {
  const { currentUser } = useAuth();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for view, search, filter, sort
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [sortOption, setSortOption] = useState('createdAt-desc'); // Default sort

  // State for Modal
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch deals in real-time
  useEffect(() => {
    console.log("[DealRoom] Subscribing to approved deals...");
    setIsLoading(true);
    setError(null);
    
    const unsubscribe: Unsubscribe = getApprovedDeals((fetchedDeals) => {
      console.log(`[DealRoom] Received approved deals: ${fetchedDeals.length}`);
      setDeals(fetchedDeals);
      setIsLoading(false);
    }, (fetchError) => {
      console.error("[DealRoom] Firestore subscription error (approved deals):", fetchError);
      setError("Failed to load deals. Please try again later.");
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      console.log("[DealRoom] Unsubscribing from approved deals.");
      unsubscribe();
    };
  }, []); // Empty dependency array ensures this runs once on mount

  // Filtering logic
  const filterDeals = (deal: Deal): boolean => {
    // Search query check
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      const checkBasic = deal.basicInfo && (
        deal.basicInfo.address?.toLowerCase().includes(lowerQuery) ||
        deal.basicInfo.city?.toLowerCase().includes(lowerQuery) ||
        deal.basicInfo.state?.toLowerCase().includes(lowerQuery)
      );
      const checkFunding = deal.fundingInfo?.fundingType?.toLowerCase().includes(lowerQuery);

      if (!(checkBasic || checkFunding)) {
        return false;
      }
    }
    
    // Filter checks
    for (const key in filters) {
      if (filters[key] === 'all' || !filters[key]) continue; 
      const filterValue = filters[key];
      
      if (key === 'fundingType') {
        if (!deal.fundingInfo || deal.fundingInfo.fundingType?.toLowerCase() !== filterValue.toLowerCase()) return false;
      }
      if (key === 'projectedReturn') {
        const dealReturn = deal.fundingInfo ? (Number(deal.fundingInfo.projectedReturn) ?? -1) : -1; 
        if (filterValue === '0-10' && (dealReturn < 0 || dealReturn > 10)) return false;
        if (filterValue === '10-15' && (dealReturn < 10 || dealReturn > 15)) return false;
        if (filterValue === '15-20' && (dealReturn < 15 || dealReturn > 20)) return false;
        if (filterValue === '20+' && dealReturn < 20) return false;
      }
      if (key === 'amountRequested') {
        const dealAmount = deal.fundingInfo ? (Number(deal.fundingInfo.amountRequested) ?? 0) : 0;
        if (filterValue === '0-50000' && (dealAmount < 0 || dealAmount > 50000)) return false;
        if (filterValue === '50001-100000' && (dealAmount < 50001 || dealAmount > 100000)) return false;
        if (filterValue === '100001-250000' && (dealAmount < 100001 || dealAmount > 250000)) return false;
        if (filterValue === '250001-500000' && (dealAmount < 250001 || dealAmount > 500000)) return false;
        if (filterValue === '500001+' && dealAmount < 500001) return false;
      }
    }
    return true; 
  };

  // Sorting logic
  const sortDeals = (a: Deal, b: Deal): number => {
    const [field, direction] = sortOption.split('-');
    const desc = direction === 'desc';

    let valA: any;
    let valB: any;

    if (field === 'createdAt') {
      valA = a.createdAt?.toMillis() || 0;
      valB = b.createdAt?.toMillis() || 0;
    } else if (field === 'projectedReturn') {
      // Safely access nested potentially string/null values and convert to number
      valA = a.fundingInfo ? (Number(a.fundingInfo.projectedReturn) ?? -1) : -1;
      valB = b.fundingInfo ? (Number(b.fundingInfo.projectedReturn) ?? -1) : -1;
    } else if (field === 'amountRequested') {
       // Safely access nested potentially string/null values and convert to number
      valA = a.fundingInfo ? (Number(a.fundingInfo.amountRequested) ?? 0) : 0;
      valB = b.fundingInfo ? (Number(b.fundingInfo.amountRequested) ?? 0) : 0;
    } else {
      valA = a[field as keyof Deal]; 
      valB = b[field as keyof Deal];
    }

    // Handling undefined/null for sorting remains the same
    if (valA === undefined || valA === null) valA = desc ? -Infinity : Infinity;
    if (valB === undefined || valB === null) valB = desc ? -Infinity : Infinity;

    if (valA < valB) return desc ? 1 : -1;
    if (valA > valB) return desc ? -1 : 1;
    return 0;
  };

  // Apply filtering and sorting
  const displayedDeals = useMemo(() => {
    return deals.filter(filterDeals).sort(sortDeals);
  }, [deals, searchQuery, filters, sortOption]);

  // Handlers for search/filter/sort changes
  const handleSearch = (query: string) => setSearchQuery(query);
  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };
  const handleSortChange = (option: string) => setSortOption(option);
  const handleViewChange = (view: 'grid' | 'list') => setViewMode(view);
  
  // Updated click handler to open modal
  const handleDealClick = (deal: Deal) => {
    console.log("Clicked deal:", deal.id);
    setSelectedDeal(deal);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDeal(null);
  };

  if (!currentUser) {
    // Shouldn't happen with ProtectedRoute, but good practice
    return <p className="text-center p-10">Please log in to view the deal room.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-6">Deal Room</h1>

      {/* Top Controls */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchFilterBar 
          onSearch={handleSearch} 
          onFilterChange={handleFilterChange} 
          onSortChange={handleSortChange} 
        />
        <ViewToggle currentView={viewMode} onViewChange={handleViewChange} />
      </div>

      {/* Deals Display */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="w-12 h-12" />
        </div>
      ) : error ? (
        <p className="text-center text-red-600 bg-red-100 p-4 rounded-md">{error}</p>
      ) : displayedDeals.length === 0 ? (
        <p className="text-center text-gray-500 bg-gray-50 p-4 rounded-md">No active deals match your criteria.</p>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedDeals.map(deal => (
            <DealCard key={deal.id} deal={deal} view="grid" onClick={handleDealClick} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {displayedDeals.map(deal => (
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

export default DealRoom; 