import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { createDealDocument } from '../../lib/firebaseFirestore';
import type { Deal } from '../../lib/firebaseFirestore';

// Interface for form data
interface EMDFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  propertyType: string;
  address: string;
  city: string;
  state: string;
  exitStrategy: string;
  rehabEstimate?: string; // Conditional
  arv?: string; // Conditional
  timeInBusiness: string;
  dealsCompleted: string;
  amountNeeded: string;
  offeredReturn: string;
  dealLength: string;
  inspectionEndDate: string;
  additionalDetails?: string;
  purchaseContract?: File | null;
  additionalDocs?: File | null;
}

const EMDForm: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, currentUserProfile } = useAuth();
  const [formData, setFormData] = useState<EMDFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    propertyType: 'Single Family',
    address: '',
    city: '',
    state: '',
    exitStrategy: 'Wholesale', // Default strategy
    rehabEstimate: '',
    arv: '',
    timeInBusiness: '',
    dealsCompleted: '0', // Default value
    amountNeeded: '',
    offeredReturn: '',
    dealLength: '',
    inspectionEndDate: '',
    additionalDetails: '',
    purchaseContract: null,
    additionalDocs: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Derived state to check if conditional fields should show
  const showRehabFields = formData.exitStrategy === 'Fix & Flip' || formData.exitStrategy === 'Refinance';

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
      setFormData(prevState => ({ ...prevState, [name]: files[0] }));
    } else {
      setFormData(prevState => ({ ...prevState, [name]: null }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentUser || !currentUserProfile) {
      alert("You must be logged in and have a profile to submit a deal.");
      return;
    }

    setIsSubmitting(true);
    console.log("Submitting EMD Form Data:", formData);

    // Prepare data for Firestore
    const dealData: Omit<Deal, 'id' | 'createdAt'> = {
      submitterUid: currentUser.uid,
      submitterRole: currentUserProfile.role,
      status: 'active',
      dealType: 'EMD',
      // Map form fields
      propertyType: formData.propertyType,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      exitStrategy: formData.exitStrategy,
      amountRequested: parseFloat(formData.amountNeeded) || 0,
      offeredReturn: parseFloat(formData.offeredReturn) || 0,
      dealLength: parseFloat(formData.dealLength) || 0,
      // Optional fields
      dealName: `EMD - ${formData.address}`,
      description: formData.additionalDetails,
      rehabEstimate: parseFloat(formData.rehabEstimate || '0') || 0,
      arv: parseFloat(formData.arv || '0') || 0,
      // EMD specific?
      // timeInBusiness: formData.timeInBusiness, 
      // dealsCompleted: formData.dealsCompleted,
      // inspectionEndDate: formData.inspectionEndDate, 
      attachments: [], // TODO: Handle files
    };

    try {
      const newDealId = await createDealDocument(dealData);
      if (newDealId) {
        console.log("Deal created successfully with ID:", newDealId);
        navigate('/deal-room'); // Navigate to deal room on success
      } else {
        throw new Error("Failed to create deal document.");
      }
    } catch (error) {
      console.error("Error submitting deal:", error);
      alert("Failed to submit deal. Please try again."); 
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-background p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h3 className="text-2xl font-semibold text-primary mb-6 text-center">EMD Funding Request</h3>
      
      {/* Personal Information - Same as Double Close */}
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

      {/* Property Information - Same as Double Close */}
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

      {/* Deal Specifics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="exitStrategy" className="block text-sm font-medium text-primary">Exit Strategy</label>
          <select id="exitStrategy" name="exitStrategy" required value={formData.exitStrategy} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm">
            <option>Wholesale</option>
            <option>Fix & Flip</option>
            <option>Refinance</option>
            <option>Buy & Hold</option>
          </select>
        </div>
        <div>
            <label htmlFor="timeInBusiness" className="block text-sm font-medium text-primary">Time In Business</label>
            <input type="text" name="timeInBusiness" id="timeInBusiness" required value={formData.timeInBusiness} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm" placeholder="e.g., 2 years"/>
        </div>
      </div>

      {/* Conditional Rehab Fields */} 
      {showRehabFields && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-200 pt-6 mt-6">
          <div>
            <label htmlFor="rehabEstimate" className="block text-sm font-medium text-primary">Rehab Estimate ($)</label>
            <input type="number" name="rehabEstimate" id="rehabEstimate" value={formData.rehabEstimate} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm" placeholder="e.g., 30000"/>
          </div>
          <div>
            <label htmlFor="arv" className="block text-sm font-medium text-primary">After Repair Value (ARV) ($)</label>
            <input type="number" name="arv" id="arv" value={formData.arv} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm" placeholder="e.g., 350000"/>
          </div>
        </div>
      )}

      {/* More Deal Specifics */} 
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div>
           <label htmlFor="dealsCompleted" className="block text-sm font-medium text-primary">Deals Completed (Last 12 Mo)</label>
           <select id="dealsCompleted" name="dealsCompleted" required value={formData.dealsCompleted} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm">
             <option>0</option>
             <option>1-5</option>
             <option>6-11</option>
             <option>12+</option>
           </select>
         </div>
          <div>
            <label htmlFor="amountNeeded" className="block text-sm font-medium text-primary">Amount Needed ($)</label>
            <input type="number" name="amountNeeded" id="amountNeeded" required value={formData.amountNeeded} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm" placeholder="e.g., 10000"/>
          </div>
      </div>

      {/* Funding Details */} 
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div>
           <label htmlFor="offeredReturn" className="block text-sm font-medium text-primary">Offered Return (%)</label>
           <input type="number" name="offeredReturn" id="offeredReturn" required value={formData.offeredReturn} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm" placeholder="e.g., 12"/>
         </div>
         <div>
           <label htmlFor="dealLength" className="block text-sm font-medium text-primary">Est. Deal Length (Months)</label>
           <input type="number" name="dealLength" id="dealLength" required value={formData.dealLength} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm" placeholder="e.g., 6"/>
         </div>
         <div>
            <label htmlFor="inspectionEndDate" className="block text-sm font-medium text-primary">When does inspection end?</label>
            <input type="date" name="inspectionEndDate" id="inspectionEndDate" required value={formData.inspectionEndDate} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"/>
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
          <label htmlFor="purchaseContract" className="block text-sm font-medium text-primary">Purchase Contract Upload</label>
          <input type="file" name="purchaseContract" id="purchaseContract" required onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-accent-secondary/20 file:text-accent-secondary hover:file:bg-accent-secondary/30"/>
        </div>
        <div>
          <label htmlFor="additionalDocs" className="block text-sm font-medium text-primary">Additional Documents Upload (Optional)</label>
          <input type="file" name="additionalDocs" id="additionalDocs" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-accent-secondary/20 file:text-accent-secondary hover:file:bg-accent-secondary/30"/>
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
      </div>

    </form>
  );
};

export default EMDForm; 