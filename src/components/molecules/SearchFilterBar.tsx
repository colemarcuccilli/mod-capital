import React, { useState } from 'react';

interface SearchFilterBarProps {
  onSearch: (query: string) => void;
  onFilterChange: (filterType: string, value: string) => void;
  onSortChange: (sortOption: string) => void;
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  onSearch,
  onFilterChange,
  onSortChange
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };
  
  const handleFilterToggle = () => {
    setShowFilters(!showFilters);
  };
  
  // Tailwind classes for reuse
  const selectClasses = "block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm rounded-md bg-white dark:bg-gray-700 text-primary dark:text-white";
  const labelClasses = "block text-sm font-medium text-primary dark:text-gray-300 mb-1";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Search Field */}
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-primary dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"
            placeholder="Search deals by address, city, type..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        
        {/* Filter Toggle Button */}
        <button
          type="button"
          onClick={handleFilterToggle}
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-primary dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
        >
          <svg className="-ml-1 mr-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
          </svg>
          Filters
          <svg className={`ml-1 h-5 w-5 transform transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        
        {/* Sort Dropdown */}
        <div className="relative">
          <select
            onChange={(e) => onSortChange(e.target.value)}
            className={selectClasses}
          >
            <option value="createdAt-desc">Newest</option>
            <option value="createdAt-asc">Oldest</option>
            <option value="projectedReturn-desc">Highest Projected Return</option> // Adapt field name if different
            <option value="projectedReturn-asc">Lowest Projected Return</option> // Adapt field name
            {/* Add Risk Score sort later */}
            {/* <option value="risk-score-asc">Lowest Risk</option> */}
            {/* <option value="risk-score-desc">Highest Risk</option> */}
            {/* Add Ending Soon sort later */}
            {/* <option value="time-remaining-asc">Ending Soon</option> */}
            <option value="amountRequested-desc">Highest Amount</option>
            <option value="amountRequested-asc">Lowest Amount</option>
          </select>
        </div>
      </div>
      
      {/* Expandable Filters */} 
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in">
          {/* Funding Type Filter */}
          <div>
            <label htmlFor="funding-type" className={labelClasses}>
              Funding Type
            </label>
            <select
              id="funding-type"
              onChange={(e) => onFilterChange('fundingType', e.target.value)}
              className={selectClasses}
            >
              <option value="all">All Types</option>
              <option value="EMD">EMD</option>
              <option value="Double Close">Double Close</option>
              <option value="Gap Funding">Gap Funding</option>
              <option value="Bridge Loan">Bridge Loan</option>
              <option value="New Construction">New Construction</option>
              <option value="Rental Loan">Rental Loan</option>
            </select>
          </div>
          
          {/* Offered Return Range */}
          <div>
            <label htmlFor="return-range" className={labelClasses}>
              Projected Return
            </label>
            <select
              id="return-range"
              onChange={(e) => onFilterChange('projectedReturn', e.target.value)} // Key matches sort key
              className={selectClasses}
            >
              <option value="all">All Returns</option>
              <option value="0-10">0% - 10%</option>
              <option value="10-15">10% - 15%</option>
              <option value="15-20">15% - 20%</option>
              <option value="20+">20%+</option>
            </select>
          </div>
          
          {/* Risk Score */}
          <div>
            <label htmlFor="risk-score" className={labelClasses}>
              Risk Score (Coming Soon)
            </label>
            <select
              id="risk-score"
              onChange={(e) => onFilterChange('riskScore', e.target.value)}
              className={selectClasses}
              disabled // Disable until risk score is implemented
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
            </select>
          </div>
          
          {/* Deal Size */}
          <div>
            <label htmlFor="deal-size" className={labelClasses}>
              Deal Size (Amount Req.)
            </label>
            <select
              id="deal-size"
              onChange={(e) => onFilterChange('amountRequested', e.target.value)} // Key matches sort key
              className={selectClasses}
            >
              <option value="all">All Sizes</option>
              <option value="0-50000">$0 - $50k</option>
              <option value="50001-100000">$50k - $100k</option>
              <option value="100001-250000">$100k - $250k</option>
              <option value="250001-500000">$250k - $500k</option>
              <option value="500001+">$500k+</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilterBar; 