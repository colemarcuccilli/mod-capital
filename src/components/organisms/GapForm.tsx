import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

// Interface for form data
interface GapFormData {
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
  lienPosition: string; // New field
  hasCollateral: string; // New field (Yes/No)
  fundsUsage: string; // New field
  additionalDetails?: string;
  dealDocuments?: File | null; // New field
}

const GapForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<GapFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    propertyType: 'Single Family',
    address: '',
    city: '',
    state: '',
    exitStrategy: 'Wholesale', 
    rehabEstimate: '',
    arv: '',
    timeInBusiness: '',
    dealsCompleted: '0',
    amountNeeded: '',
    offeredReturn: '',
    dealLength: '',
    lienPosition: '1st', // Default Lien Position
    hasCollateral: 'No', // Default Collateral
    fundsUsage: '',
    additionalDetails: '',
    dealDocuments: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showRehabFields = formData.exitStrategy === 'Fix & Flip' || formData.exitStrategy === 'Refinance';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData(prevState => ({ ...prevState, [name]: files[0] }));
    } else {
      setFormData(prevState => ({ ...prevState, [name]: null }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("Gap Form Data Submitted:", formData);
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/thank-you');
    }, 1500); 
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-background p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h3 className="text-2xl font-semibold text-primary mb-6 text-center">Gap Funding Request</h3>
      
      {/* Personal Info - Reuse styles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-primary">First Name</label>
          <input type="text" name="firstName" id="firstName" required value={formData.firstName} onChange={handleChange} className="input-field" />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-primary">Last Name</label>
          <input type="text" name="lastName" id="lastName" required value={formData.lastName} onChange={handleChange} className="input-field" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-primary">Email</label>
          <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className="input-field" />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-primary">Phone Number</label>
          <input type="tel" name="phone" id="phone" required value={formData.phone} onChange={handleChange} className="input-field" />
        </div>
      </div>

      {/* Property Info - Reuse styles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div>
           <label htmlFor="propertyType" className="block text-sm font-medium text-primary">Property Type</label>
           <select id="propertyType" name="propertyType" required value={formData.propertyType} onChange={handleChange} className="input-field">
             <option>Single Family</option>
             <option>Multi Family</option>
             <option>Other</option>
           </select>
         </div>
         <div className="md:col-span-2">
           <label htmlFor="address" className="block text-sm font-medium text-primary">Address</label>
           <input type="text" name="address" id="address" required value={formData.address} onChange={handleChange} className="input-field" />
         </div>
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-primary">City</label>
          <input type="text" name="city" id="city" required value={formData.city} onChange={handleChange} className="input-field" />
        </div>
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-primary">State</label>
          <input type="text" name="state" id="state" required value={formData.state} onChange={handleChange} className="input-field" />
        </div>
      </div>

      {/* Deal Specifics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="exitStrategy" className="block text-sm font-medium text-primary">Exit Strategy</label>
          <select id="exitStrategy" name="exitStrategy" required value={formData.exitStrategy} onChange={handleChange} className="input-field">
            <option>Wholesale</option>
            <option>Fix & Flip</option>
            <option>Refinance</option>
            <option>Buy & Hold</option>
          </select>
        </div>
        <div>
            <label htmlFor="timeInBusiness" className="block text-sm font-medium text-primary">Time In Business</label>
            <input type="text" name="timeInBusiness" id="timeInBusiness" required value={formData.timeInBusiness} onChange={handleChange} className="input-field" placeholder="e.g., 2 years"/>
        </div>
      </div>

      {/* Conditional Rehab Fields */} 
      {showRehabFields && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-200 pt-6 mt-6">
          <div>
            <label htmlFor="rehabEstimate" className="block text-sm font-medium text-primary">Rehab Estimate ($)</label>
            <input type="number" name="rehabEstimate" id="rehabEstimate" value={formData.rehabEstimate} onChange={handleChange} className="input-field" placeholder="e.g., 30000"/>
          </div>
          <div>
            <label htmlFor="arv" className="block text-sm font-medium text-primary">After Repair Value (ARV) ($)</label>
            <input type="number" name="arv" id="arv" value={formData.arv} onChange={handleChange} className="input-field" placeholder="e.g., 350000"/>
          </div>
        </div>
      )}

      {/* More Deal Specifics */} 
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div>
           <label htmlFor="dealsCompleted" className="block text-sm font-medium text-primary">Deals Completed (Last 12 Mo)</label>
           <select id="dealsCompleted" name="dealsCompleted" required value={formData.dealsCompleted} onChange={handleChange} className="input-field">
             <option>0</option>
             <option>1-5</option>
             <option>6-11</option>
             <option>12+</option>
           </select>
         </div>
          <div>
            <label htmlFor="amountNeeded" className="block text-sm font-medium text-primary">Amount Needed ($)</label>
            <input type="number" name="amountNeeded" id="amountNeeded" required value={formData.amountNeeded} onChange={handleChange} className="input-field" placeholder="e.g., 50000"/>
          </div>
      </div>

      {/* Funding Details */} 
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div>
           <label htmlFor="offeredReturn" className="block text-sm font-medium text-primary">Offered Return (%)</label>
           <input type="number" name="offeredReturn" id="offeredReturn" required value={formData.offeredReturn} onChange={handleChange} className="input-field" placeholder="e.g., 15"/>
         </div>
         <div>
           <label htmlFor="dealLength" className="block text-sm font-medium text-primary">Est. Deal Length (Months)</label>
           <input type="number" name="dealLength" id="dealLength" required value={formData.dealLength} onChange={handleChange} className="input-field" placeholder="e.g., 9"/>
         </div>
         <div>
            <label htmlFor="lienPosition" className="block text-sm font-medium text-primary">Lien Position</label>
            <select id="lienPosition" name="lienPosition" required value={formData.lienPosition} onChange={handleChange} className="input-field">
                <option>1st</option>
                <option>2nd</option>
            </select>
        </div>
      </div>

      {/* New Gap Fields */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <div>
            <label htmlFor="hasCollateral" className="block text-sm font-medium text-primary">Do you own other properties that can be used as collateral?</label>
            <select id="hasCollateral" name="hasCollateral" required value={formData.hasCollateral} onChange={handleChange} className="input-field">
                <option>No</option>
                <option>Yes</option>
            </select>
        </div>
         <div>
            <label htmlFor="fundsUsage" className="block text-sm font-medium text-primary">How will funds be used? (Detailed cost breakdown)</label>
            <textarea id="fundsUsage" name="fundsUsage" rows={4} required value={formData.fundsUsage} onChange={handleChange} className="input-field" placeholder="e.g., Rehab: $20k, Closing Costs: $5k, Holding Costs: $3k..."></textarea>
        </div>
      </div>

      {/* Additional Details */} 
      <div>
        <label htmlFor="additionalDetails" className="block text-sm font-medium text-primary">Additional Details (Optional)</label>
        <textarea id="additionalDetails" name="additionalDetails" rows={4} value={formData.additionalDetails} onChange={handleChange} className="input-field" placeholder="Tell us more about the deal..."></textarea>
      </div>

      {/* File Upload */} 
      <div>
        <label htmlFor="dealDocuments" className="block text-sm font-medium text-primary">Deal Documents + Attachments Upload</label>
        <input type="file" name="dealDocuments" id="dealDocuments" required onChange={handleFileChange} className="file-input-field"/>
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

export default GapForm; 