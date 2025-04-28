import React from 'react';

const FundedDealsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-primary mb-4">My Funded Deals</h1>
      <p className="text-gray-600">This page will display deals you have successfully funded as a lender.</p>
      {/* TODO: Fetch and display deals where lenderUid === currentUser.uid (or similar logic) */}
    </div>
  );
};

export default FundedDealsPage; 