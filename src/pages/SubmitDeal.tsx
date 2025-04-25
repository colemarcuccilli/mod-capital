import React from 'react';

// TODO: Maybe reuse one of the specific deal forms?
// For now, just a placeholder

const SubmitDeal: React.FC = () => {
  return (
    <div className="container mx-auto py-16 min-h-[60vh]">
      <h1 className="text-3xl font-bold text-primary mb-4">Submit a New Deal</h1>
      <p className="text-primary/80">
        Deal submission forms (Double Close, EMD, Gap, PML) will be accessible from here or directly from funding type pages.
      </p>
      {/* TODO: Implement logic to select and display the correct form */}
    </div>
  );
};

export default SubmitDeal; 