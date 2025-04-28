import React from 'react';

interface ViewToggleProps {
  currentView: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({
  currentView,
  onViewChange
}) => {
  const baseClasses = "relative inline-flex items-center px-3 py-2 border text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors duration-150";
  const activeClasses = "bg-accent/10 dark:bg-accent/20 border-accent text-accent dark:text-accent-light";
  const inactiveClasses = "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-primary dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600";

  return (
    <div className="inline-flex rounded-md shadow-sm">
      <button
        type="button"
        onClick={() => onViewChange('grid')}
        title="Grid View"
        className={`${baseClasses} rounded-l-md ${currentView === 'grid' ? activeClasses : inactiveClasses}`}
      >
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        <span className="sr-only">Grid</span>
      </button>
      <button
        type="button"
        onClick={() => onViewChange('list')}
        title="List View"
        className={`${baseClasses} -ml-px rounded-r-md ${currentView === 'list' ? activeClasses : inactiveClasses}`}
      >
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
        <span className="sr-only">List</span>
      </button>
    </div>
  );
};

export default ViewToggle; 