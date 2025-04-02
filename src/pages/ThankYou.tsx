import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedButton from '../components/atoms/AnimatedButton';
import { FiCheckCircle } from 'react-icons/fi';
import IconWrapper from '../components/atoms/IconWrapper';

const ThankYou: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center bg-white p-10 rounded-xl shadow-lg">
        <div>
          <IconWrapper 
            name="FiCheckCircle" 
            size={64} 
            className="mx-auto text-green-500" 
          />
          <h2 className="mt-6 text-3xl font-extrabold text-primary">
            Request Submitted!
          </h2>
          <p className="mt-2 text-lg text-primary/80">
            Thank you for submitting your request, our team will reach out to you within the next 48 hours.
          </p>
        </div>
        <div className="mt-8">
          <AnimatedButton to="/" className="w-full flex justify-center">
            Return to Homepage
          </AnimatedButton>
        </div>
      </div>
    </div>
  );
};

export default ThankYou; 