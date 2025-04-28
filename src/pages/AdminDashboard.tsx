import React from 'react';
import AdminDealQueue from '../components/organisms/AdminDealQueue';

const AdminDashboard: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
      
      {/* Deal Review Section */}
      <AdminDealQueue />
      
      {/* Placeholder for User Management Section */}
      <div className="bg-white p-4 rounded shadow-md">
         <h2 className="text-xl font-semibold text-primary mb-4">User Management</h2>
         <p className="text-gray-500">User verification and role management controls will go here.</p>
         {/* TODO: Add user list and management components */}
      </div>

    </div>
  );
};

export default AdminDashboard; 