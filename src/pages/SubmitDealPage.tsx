import React from 'react';
import SubmitDealForm from '../components/organisms/SubmitDealForm';

const SubmitDealPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 pt-24 min-h-screen"> {/* Added pt-24 for nav overlap */}
      <h1 className="text-3xl font-bold text-primary mb-6 text-center">Submit a New Deal</h1>
      <SubmitDealForm />
    </div>
  );
};

export default SubmitDealPage; 