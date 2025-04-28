import React from 'react';
import AdminDealQueue from '../components/organisms/AdminDealQueue';

// This page primarily acts as a container for the deal queue component within the admin layout
const AdminDealQueuePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Title might be handled by Admin layout or kept simple here */}
      <h1 className="text-2xl font-semibold text-primary mb-4">Deals Awaiting Review</h1> 
      <AdminDealQueue />
    </div>
  );
};

export default AdminDealQueuePage; 