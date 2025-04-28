import React from 'react';
import { Link } from 'react-router-dom';
import { Deal } from '../../lib/firebaseFirestore'; // Use the actual Deal interface
// import IconWrapper from '../atoms/IconWrapper'; // If needed for verified icons

interface DealCardProps {
  deal: Deal;
  view?: 'grid' | 'list';
  onClick?: (deal: Deal) => void;
}

// Helper to get risk score color (Placeholder - requires risk score logic later)
const getRiskScoreColor = (score: string | undefined) => {
  // Add logic here when risk score is available on the Deal object
  // For now, default to gray
  return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
};

const DealCard: React.FC<DealCardProps> = ({
  deal,
  view = 'grid',
  onClick,
}) => {

  const { 
    id,
    // Access nested fields via deal.basicInfo and deal.fundingInfo
    // address, 
    // city, 
    // state,
    // amountRequested, // Access via fundingInfo
    projectedReturn, // Keep top-level if denormalized, otherwise access via fundingInfo
    // dealType, // Access via fundingInfo
    imageUrl = 'https://via.placeholder.com/400x300?text=Property+Image',
  } = deal;

  // Access nested data with fallbacks
  const address = deal.basicInfo?.address || 'Address N/A';
  const city = deal.basicInfo?.city || 'City N/A';
  const state = deal.basicInfo?.state || 'N/A';
  const dealType = deal.fundingInfo?.fundingType || 'Type N/A';
  const amountRequested = Number(deal.fundingInfo?.amountRequested || 0);
  const projReturn = deal.fundingInfo?.projectedReturn !== undefined ? Number(deal.fundingInfo.projectedReturn) : null;

  const handleClick = () => {
    if (onClick) {
      onClick(deal);
    }
  };

  const riskScoreDisplay = 'Medium'; // Placeholder

  // Grid view card
  if (view === 'grid') {
    return (
      <div 
        onClick={handleClick}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 cursor-pointer"
      >
        {/* Card Image with Overlays */}
        <div className="relative h-48 overflow-hidden"> 
          <img 
            src={imageUrl} 
            alt={address} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
          {/* Bottom Overlays */} 
          <div className="absolute bottom-0 left-0 p-3 w-full flex justify-between items-end">
            <span className="text-white font-semibold text-lg bg-black/30 px-2 py-1 rounded">
              ${amountRequested.toLocaleString()} {/* Use variable */}
            </span>
            <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getRiskScoreColor(riskScoreDisplay)}`}>
              {riskScoreDisplay} Risk {/* Placeholder */}
            </div>
          </div>
        </div>
        
        {/* Card Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate mb-1">
            {address} {/* Use variable */}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {city}, {state} &bull; {dealType} {/* Use variables */}
          </p>
          
          {/* Projected Return */} 
          <div className="mb-3">
            <span className="text-xl font-bold text-accent dark:text-accent-light">
              {projReturn !== null ? `${projReturn}%` : 'N/A'} {/* Use variable */}
            </span>
            <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">Projected ROI</span>
             {/* TODO: Add verification badge if needed */}
          </div>
          
          {/* View Deal Button */}
          <button
            onClick={handleClick} // Can also use Link component if preferred
            className="w-full btn btn-primary btn-sm mt-1" // Use button styling
          >
            View Deal
          </button>
        </div>
      </div>
    );
  }
  
  // List view card (Adapting from the second example provided)
  return (
    <div 
      onClick={handleClick}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md mb-4 flex cursor-pointer"
    >
        {/* Image */}
        <div className="w-32 h-full flex-shrink-0 hidden sm:block">
             <img src={imageUrl} alt={address} className="w-full h-full object-cover"/>
        </div>
        {/* Content */}
        <div className="flex-grow p-4 flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-1">
                    <h3 className="text-md font-semibold text-gray-900 dark:text-white">
                         {address}, {city}, {state} {/* Use variables */}
                    </h3>
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getRiskScoreColor(riskScoreDisplay)}`}>
                         {riskScoreDisplay} Risk {/* Placeholder */}
                    </span>
                </div>
                 <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {dealType} {/* Use variable */}
                 </p>
            </div>
            <div className="flex flex-wrap items-center justify-between text-sm mt-2">
                <div className="mr-4 mb-1">
                    <span className="font-semibold text-primary dark:text-accent-light">${amountRequested.toLocaleString()}</span> {/* Use variable */}
                    <span className="text-gray-500 ml-1">Requested</span>
                </div>
                 <div className="mr-4 mb-1">
                     <span className="font-semibold text-primary dark:text-accent-light">
                       {projReturn !== null ? `${projReturn}%` : 'N/A'} {/* Use variable */}
                     </span>
                     <span className="text-gray-500 ml-1">Proj. ROI</span>
                 </div>
                 {/* Add other relevant details like term if needed */}
                {/* <div className="mr-4 mb-1">
                     <span className="font-semibold text-primary dark:text-accent-light">{deal.dealLength || 'N/A'} days</span>
                     <span className="text-gray-500 ml-1">Term</span>
                 </div> */} 
                 <button className="btn btn-primary btn-xs">View Deal</button>
            </div>
        </div>
    </div>
  );
};

export default DealCard; 