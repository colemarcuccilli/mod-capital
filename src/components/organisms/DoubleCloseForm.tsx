import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedButton from '../atoms/AnimatedButton'; // Reusing our button

// Interface for form data (optional but good practice)
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  propertyType: string;
  address: string;
  city: string;
  state: string;
  amountNeeded: string;
  offeredReturn: string;
  closingDate: string;
  additionalDetails?: string;
  abContract?: File | null;
  bcContract?: File | null;
}

const DoubleCloseForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    propertyType: 'Single Family', // Default value
    address: '',
    city: '',
    state: '',
    amountNeeded: '',
    offeredReturn: '',
    closingDate: '',
    additionalDetails: '',
    abContract: null,
    bcContract: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData(prevState => ({
        ...prevState,
        [name]: files[0]
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: null
      }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // --- TODO: Implement actual form submission logic here --- 
    // Example: Send formData to an API endpoint
    console.log("Form Data Submitted:", formData);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsSubmitting(false);
      // Redirect to thank you page on successful submission
      navigate('/thank-you'); // Ensure this route exists in App.tsx
    }, 1500); // Simulate 1.5 seconds delay
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-background p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h3 className="text-2xl font-semibold text-primary mb-6 text-center">Double Close Funding Request</h3>
      
      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-primary">First Name</label>
          <input type="text" name="firstName" id="firstName" required value={formData.firstName} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm" />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-primary">Last Name</label>
          <input type="text" name="lastName" id="lastName" required value={formData.lastName} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-primary">Email</label>
          <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm" />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-primary">Phone Number</label>
          <input type="tel" name="phone" id="phone" required value={formData.phone} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm" />
        </div>
      </div>

      {/* Property Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div>
           <label htmlFor="propertyType" className="block text-sm font-medium text-primary">Property Type</label>
           <select id="propertyType" name="propertyType" required value={formData.propertyType} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm">
             <option>Single Family</option>
             <option>Multi Family</option>
             <option>Other</option>
           </select>
         </div>
         <div className="md:col-span-2">
           <label htmlFor="address" className="block text-sm font-medium text-primary">Address</label>
           <input type="text" name="address" id="address" required value={formData.address} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm" />
         </div>
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-primary">City</label>
          <input type="text" name="city" id="city" required value={formData.city} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm" />
        </div>
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-primary">State</label>
          <input type="text" name="state" id="state" required value={formData.state} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm" />
        </div>
      </div>

      {/* Funding Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="amountNeeded" className="block text-sm font-medium text-primary">Amount Needed ($)</label>
          <input type="number" name="amountNeeded" id="amountNeeded" required value={formData.amountNeeded} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm" placeholder="e.g., 150000"/>
        </div>
        <div>
          <label htmlFor="offeredReturn" className="block text-sm font-medium text-primary">Offered Return (%)</label>
          <input type="number" name="offeredReturn" id="offeredReturn" required value={formData.offeredReturn} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm" placeholder="e.g., 10"/>
        </div>
        <div>
          <label htmlFor="closingDate" className="block text-sm font-medium text-primary">Closing Date</label>
          <input type="date" name="closingDate" id="closingDate" required value={formData.closingDate} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"/>
        </div>
      </div>

      {/* Additional Details */}
      <div>
        <label htmlFor="additionalDetails" className="block text-sm font-medium text-primary">Additional Details (Optional)</label>
        <textarea id="additionalDetails" name="additionalDetails" rows={4} value={formData.additionalDetails} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm" placeholder="Tell us more about the deal..."></textarea>
      </div>

      {/* File Uploads */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="abContract" className="block text-sm font-medium text-primary">A-B Contract Upload</label>
          <input type="file" name="abContract" id="abContract" required onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-accent-secondary/20 file:text-accent-secondary hover:file:bg-accent-secondary/30"/>
        </div>
        <div>
          <label htmlFor="bcContract" className="block text-sm font-medium text-primary">B-C Contract Upload</label>
          <input type="file" name="bcContract" id="bcContract" required onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-accent-secondary/20 file:text-accent-secondary hover:file:bg-accent-secondary/30"/>
        </div>
      </div>

      {/* Submit Button */}
      <div className="text-center pt-4">
          <button 
             type="submit" 
             disabled={isSubmitting}
             className={`inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-background bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
           >
             {isSubmitting ? 'Submitting...' : 'Submit Request'}
             {!isSubmitting && <span className="ml-2">→</span>}
           </button>
          {/* Note: Replaced AnimatedButton with standard button for disabled state handling */}
      </div>

    </form>
  );
};

export default DoubleCloseForm; 