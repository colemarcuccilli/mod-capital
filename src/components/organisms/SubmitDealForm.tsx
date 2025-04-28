import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { FiUploadCloud } from 'react-icons/fi';
import IconWrapper from '../atoms/IconWrapper';
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore"; 
import { db } from '../../lib/firebaseConfig';
// Import Firebase Storage functions
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { createDealDocument } from '../../lib/firebaseFirestore';
import LoadingSpinner from '../atoms/LoadingSpinner';

// Register ScrollToPlugin
gsap.registerPlugin(ScrollToPlugin);

// Interfaces for form state
interface BasicPropertyInfo {
  address: string;
  city: string;
  state: string;
  zip: string;
  propertyType: 'SFR' | 'Multi-family 2-4' | 'Multi-family 5+' | 'Commercial' | 'Land' | '';
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Needs Full Rehab' | '';
  bedrooms: string;
  bathrooms: string;
  buildingSize: string; // sqft
  lotSize: string; // sqft
  ownershipStatus: 'Owned' | 'Under Contract' | 'Making Offer' | 'Wholesaler' | '';
}

interface FundingDetails {
  fundingType: 'EMD' | 'Double Close' | 'Gap Funding' | 'Bridge Loan' | 'New Construction' | 'Rental Loan' | '';
  amountRequested: string;
  lengthOfFunding: string; // days
  projectedReturn: string; // %
  exitStrategy: 'Sell' | 'Refinance' | '';
  purchasePrice: string;
  rehabCost: string;
  arv: string;
}

interface PhotosDescription {
  // For file input, we'll store the FileList object
  photos: FileList | null;
  briefDescription: string;
  marketDescription: string;
  neighborhoodDescription: string;
  investmentHighlights: string;
  riskFactors: string;
}

// Interface for attachment metadata stored in Firestore
interface AttachmentMetadata {
  name: string;
  url: string;
  type: string;
  size: number;
}

const SubmitDealForm: React.FC = () => {
  const { currentUser, currentUserProfile } = useAuth();
  const [currentFocusStep, setCurrentFocusStep] = useState(1); // Track which step has visual focus
  const totalSteps = 3;
  const formRef = useRef<HTMLFormElement>(null);
  const stepRefs = useRef<(HTMLFieldSetElement | null)[]>([]); // Use fieldset for refs
  const isScrolling = useRef(false); // Prevent focus triggers during scroll animation

  // Initialize state for each section
  const [basicInfo, setBasicInfo] = useState<BasicPropertyInfo>({
    address: '', city: '', state: '', zip: '', propertyType: '', condition: '', 
    bedrooms: '', bathrooms: '', buildingSize: '', lotSize: '', ownershipStatus: ''
  });
  const [fundingInfo, setFundingInfo] = useState<FundingDetails>({
    fundingType: '', amountRequested: '', lengthOfFunding: '', projectedReturn: '', 
    exitStrategy: '', purchasePrice: '', rehabCost: '', arv: ''
  });
  const [photosInfo, setPhotosInfo] = useState<PhotosDescription>({
    photos: null, briefDescription: '', marketDescription: '', 
    neighborhoodDescription: '', investmentHighlights: '', riskFactors: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Add state for upload progress (optional but good UX)
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  // Simplified Scroll Logic triggered by focus
  const focusStep = (step: number) => {
    if (step < 1 || step > totalSteps || step === currentFocusStep || isScrolling.current) return;

    const targetStepIndex = step - 1;
    const targetEl = stepRefs.current[targetStepIndex];

    if (targetEl) {
      isScrolling.current = true; // Prevent nested triggers
      const navHeight = 70; 
      const targetY = targetEl.offsetTop - navHeight - 20;

      gsap.to(window, {
        scrollTo: { y: targetY, autoKill: false },
        duration: 0.7,
        ease: 'power3.inOut',
        onComplete: () => {
          setCurrentFocusStep(step); // Update focused step state
          gsap.fromTo(targetEl, 
            { borderColor: '#6366F1' /* Use actual theme accent color */ }, 
            { borderColor: '#4F46E5', duration: 0.3, ease: 'power1.inOut', yoyo: true, repeat: 1 }
          );
          setTimeout(() => { isScrolling.current = false; }, 100); // Short delay after scroll
        }
      });
    }
  };
  
  // Assign refs
  const assignRef = (el: HTMLFieldSetElement | null, index: number) => {
    stepRefs.current[index] = el;
  };

  // --- Input Handlers ---
  const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setBasicInfo({ ...basicInfo, [e.target.name]: e.target.value });
  };
  const handleFundingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFundingInfo({ ...fundingInfo, [e.target.name]: e.target.value });
  };
  const handlePhotosChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.type === 'file') {
        const inputElement = e.target as HTMLInputElement;
        setPhotosInfo({ ...photosInfo, photos: inputElement.files });
    } else {
        setPhotosInfo({ ...photosInfo, [e.target.name]: e.target.value });
    }
  };

  const formatNumberInput = (value: string) => value.replace(/[^\d.]/g, '');
  const formatIntegerInput = (value: string) => value.replace(/\D/g, '');

  // --- File Upload Function ---
  const uploadFile = (file: File, dealId: string, userId: string): Promise<AttachmentMetadata> => {
    return new Promise((resolve, reject) => {
      const storage = getStorage();
      // Create a unique path: dealUploads/{userId}/{dealId}/{timestamp}-{filename}
      const filePath = `dealUploads/${userId}/${dealId}/${Date.now()}-${file.name}`;
      const storageRef = ref(storage, filePath);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done for ', file.name);
          setUploadProgress(prev => ({ ...prev, [file.name]: progress }));
        }, 
        (error) => {
          console.error("Upload failed for ", file.name, error);
          reject(error); 
        }, 
        async () => {
          console.log("Upload successful for ", file.name);
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({
              name: file.name,
              url: downloadURL,
              type: file.type,
              size: file.size
            });
          } catch (urlError) {
            console.error("Failed to get download URL for ", file.name, urlError);
            reject(urlError);
          }
        }
      );
    });
  };

  // --- Form Submission --- 
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
        setError("You must be logged in to submit a deal.");
        return; 
    } 
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setUploadProgress({}); // Reset progress

    // 1. Generate a new Deal ID first (needed for storage path)
    const newDealRef = doc(collection(db, "submittedDeals")); 
    const dealId = newDealRef.id;
    const userId = currentUser.uid;
    
    let uploadedAttachments: AttachmentMetadata[] = [];

    try {
      // 2. Upload Files to Storage
      if (photosInfo.photos && photosInfo.photos.length > 0) {
        const uploadPromises: Promise<AttachmentMetadata>[] = [];
        for (let i = 0; i < photosInfo.photos.length; i++) {
           const file = photosInfo.photos[i];
           // Simple size check (e.g., 5MB)
           if (file.size > 5 * 1024 * 1024) {
              throw new Error(`File ${file.name} is too large (max 5MB).`);
           }
           uploadPromises.push(uploadFile(file, dealId, userId));
        }
        // Wait for all uploads to complete
        uploadedAttachments = await Promise.all(uploadPromises);
        console.log("All files uploaded successfully:", uploadedAttachments);
      }

      // 3. Prepare Firestore Data - Match the function signature
      const dealDataForFunction = {
        submitterUid: userId,
        submitterRole: currentUserProfile?.role || 'investor', // Default role if profile not loaded?
        basicInfo: basicInfo, // Pass the state object
        fundingInfo: fundingInfo, // Pass the state object
        descriptionInfo: { // Create this object from photosInfo state
          briefDescription: photosInfo.briefDescription,
          marketDescription: photosInfo.marketDescription,
          neighborhoodDescription: photosInfo.neighborhoodDescription,
          investmentHighlights: photosInfo.investmentHighlights,
          riskFactors: photosInfo.riskFactors,
        },
        attachments: uploadedAttachments, 
        imageUrl: uploadedAttachments.find(att => att.type.startsWith('image/'))?.url || null,
        // DO NOT include status or createdAt here
      };

      console.log("Data object being passed to createDealDocument:", dealDataForFunction);

      // 4. Call createDealDocument with the correctly structured object
      const createdDealId = await createDealDocument(dealDataForFunction);
      
      if (!createdDealId) {
        throw new Error("Failed to create deal document in Firestore after upload.");
      }
      
      setSuccess(`Deal submitted successfully! ID: ${createdDealId}`);
      console.log("Deal submitted successfully! ID: ", createdDealId);
      // Clear form?
      // setBasicInfo({ ... }); setFundingInfo({ ... }); setPhotosInfo({ photos: null, ... }); setCurrentFocusStep(1);

    } catch (err: any) {
      console.error("Submission process Error:", err);
      
      // Check if it's specifically a Firestore permission error
      if (err.code === 'permission-denied') { 
         setError("Permission Denied: Could not save deal data after upload. Check Firestore rules.");
      } else if (err.code === 'unavailable' || err.message.includes('offline')) { // Check for general connection issues
         setError("Connection Error: Could not reach Firestore to save deal data. Please check internet or try again.");
      } else if (err.message.includes('too large')) { // Check for our custom file size error
         setError(err.message); // Show the specific file size error
      } else { // Generic fallback for other errors (e.g., during upload itself)
         setError(err.message || "Failed to submit deal during upload or save. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md space-y-8 overflow-x-hidden">

      {/* Step 1: Basic Property Information */}
      <fieldset 
        ref={(el) => assignRef(el, 0)} 
        id="step-1" 
        onFocus={() => focusStep(1)} // Trigger scroll/focus on focus within the fieldset
        className={`border p-4 rounded-md transition-all duration-300 ease-in-out ${ 
          currentFocusStep === 1 ? 'border-accent border-2 shadow-lg' : 'border-gray-300' // Highlight active, remove opacity change
        }`}
      >
        <legend className="text-xl font-semibold text-primary px-2">Step 1: Property Information</legend>
        <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">Property Location</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label htmlFor="address" className="block text-sm font-medium text-gray-700">Property Address</label><input type="text" id="address" name="address" value={basicInfo.address} onChange={handleBasicInfoChange} required className="mt-1 block w-full input-field" /></div>
          <div><label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label><input type="text" id="city" name="city" value={basicInfo.city} onChange={handleBasicInfoChange} required className="mt-1 block w-full input-field" /></div>
          <div><label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label><input type="text" id="state" name="state" value={basicInfo.state} onChange={handleBasicInfoChange} required maxLength={2} className="mt-1 block w-full input-field" placeholder="e.g., CA" /></div>
          <div><label htmlFor="zip" className="block text-sm font-medium text-gray-700">ZIP Code</label><input type="text" id="zip" name="zip" value={basicInfo.zip} onChange={(e) => setBasicInfo({...basicInfo, zip: formatIntegerInput(e.target.value)})} required inputMode="numeric" pattern="\d{5}" className="mt-1 block w-full input-field" /></div>
        </div>

        <h3 className="text-lg font-medium text-gray-800 mt-6 mb-2">Property Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label htmlFor="propertyType" className="block text-sm font-medium text-gray-700">Property Type</label><select id="propertyType" name="propertyType" value={basicInfo.propertyType} onChange={handleBasicInfoChange} required className="mt-1 block w-full input-field select-field"><option value="" disabled>Select type...</option><option value="SFR">SFR</option><option value="Multi-family 2-4">Multi (2-4)</option><option value="Multi-family 5+">Multi (5+)</option><option value="Commercial">Commercial</option><option value="Land">Land</option></select></div>
          <div><label htmlFor="condition" className="block text-sm font-medium text-gray-700">Property Condition</label><select id="condition" name="condition" value={basicInfo.condition} onChange={handleBasicInfoChange} required className="mt-1 block w-full input-field select-field"><option value="" disabled>Select condition...</option><option value="Excellent">Excellent</option><option value="Good">Good</option><option value="Fair">Fair</option><option value="Poor">Poor</option><option value="Needs Full Rehab">Needs Full Rehab</option></select></div>
          <div><label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">Bedrooms</label><input type="number" id="bedrooms" name="bedrooms" value={basicInfo.bedrooms} onChange={(e) => setBasicInfo({...basicInfo, bedrooms: formatIntegerInput(e.target.value)})} required min="0" className="mt-1 block w-full input-field" /></div>
          <div><label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">Bathrooms</label><input type="number" id="bathrooms" name="bathrooms" value={basicInfo.bathrooms} onChange={(e) => setBasicInfo({...basicInfo, bathrooms: formatNumberInput(e.target.value)})} required min="0" step="0.5" className="mt-1 block w-full input-field" /></div>
          <div><label htmlFor="buildingSize" className="block text-sm font-medium text-gray-700">Building Size (sqft)</label><input type="text" id="buildingSize" name="buildingSize" value={basicInfo.buildingSize} onChange={(e) => setBasicInfo({...basicInfo, buildingSize: formatIntegerInput(e.target.value)})} required inputMode="numeric" className="mt-1 block w-full input-field" /></div>
          <div><label htmlFor="lotSize" className="block text-sm font-medium text-gray-700">Lot Size (sqft)</label><input type="text" id="lotSize" name="lotSize" value={basicInfo.lotSize} onChange={(e) => setBasicInfo({...basicInfo, lotSize: formatIntegerInput(e.target.value)})} required inputMode="numeric" className="mt-1 block w-full input-field" /></div>
        </div>

        <h3 className="text-lg font-medium text-gray-800 mt-6 mb-2">Current Ownership Status</h3>
        <div><label htmlFor="ownershipStatus" className="sr-only">Current Ownership Status</label><select id="ownershipStatus" name="ownershipStatus" value={basicInfo.ownershipStatus} onChange={handleBasicInfoChange} required className="mt-1 block w-full input-field select-field"><option value="" disabled>Select status...</option><option value="Owned">Owned</option><option value="Under Contract">Under Contract</option><option value="Making Offer">Making Offer</option><option value="Wholesaler">Wholesaler (Assigning Contract)</option></select></div>
      </fieldset>

      {/* Step 2: Funding Details */} 
      <fieldset 
        ref={(el) => assignRef(el, 1)} 
        id="step-2" 
        onFocus={() => focusStep(2)} // Trigger scroll/focus
        className={`border p-4 rounded-md transition-all duration-300 ease-in-out ${ 
          currentFocusStep === 2 ? 'border-accent border-2 shadow-lg' : 'border-gray-300' // Highlight active
        }`}
      >
        <legend className="text-xl font-semibold text-primary px-2">Step 2: Funding Details</legend>
        <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">Funding Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div><label htmlFor="fundingType" className="block text-sm font-medium text-gray-700">Funding Type</label><select id="fundingType" name="fundingType" value={fundingInfo.fundingType} onChange={handleFundingChange} required className="mt-1 block w-full input-field select-field"><option value="" disabled>Select type...</option><option value="EMD">EMD</option><option value="Double Close">Double Close</option><option value="Gap Funding">Gap Funding</option><option value="Bridge Loan">Bridge Loan</option><option value="New Construction">New Construction</option><option value="Rental Loan">Rental Loan</option></select></div>
           <div><label htmlFor="amountRequested" className="block text-sm font-medium text-gray-700">Amount Requested ($)</label><input type="text" id="amountRequested" name="amountRequested" value={fundingInfo.amountRequested} onChange={(e) => setFundingInfo({...fundingInfo, amountRequested: formatNumberInput(e.target.value)})} required inputMode="decimal" className="mt-1 block w-full input-field" /></div>
           <div><label htmlFor="lengthOfFunding" className="block text-sm font-medium text-gray-700">Length of Funding (days)</label><input type="text" id="lengthOfFunding" name="lengthOfFunding" value={fundingInfo.lengthOfFunding} onChange={(e) => setFundingInfo({...fundingInfo, lengthOfFunding: formatIntegerInput(e.target.value)})} required inputMode="numeric" className="mt-1 block w-full input-field" /></div>
           <div><label htmlFor="projectedReturn" className="block text-sm font-medium text-gray-700">Projected Return (%)</label><input type="text" id="projectedReturn" name="projectedReturn" value={fundingInfo.projectedReturn} onChange={(e) => setFundingInfo({...fundingInfo, projectedReturn: formatNumberInput(e.target.value)})} required inputMode="decimal" className="mt-1 block w-full input-field" /></div>
           <div className="md:col-span-2"><label htmlFor="exitStrategy" className="block text-sm font-medium text-gray-700">Exit Strategy</label><select id="exitStrategy" name="exitStrategy" value={fundingInfo.exitStrategy} onChange={handleFundingChange} required className="mt-1 block w-full input-field select-field"><option value="" disabled>Select strategy...</option><option value="Sell">Sell</option><option value="Refinance">Refinance</option></select></div>
        </div>
        <h3 className="text-lg font-medium text-gray-800 mt-6 mb-2">Financial Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <div><label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-700">Purchase Price ($)</label><input type="text" id="purchasePrice" name="purchasePrice" value={fundingInfo.purchasePrice} onChange={(e) => setFundingInfo({...fundingInfo, purchasePrice: formatNumberInput(e.target.value)})} required inputMode="decimal" className="mt-1 block w-full input-field" /></div>
           <div><label htmlFor="rehabCost" className="block text-sm font-medium text-gray-700">Rehab Cost ($)</label><input type="text" id="rehabCost" name="rehabCost" value={fundingInfo.rehabCost} onChange={(e) => setFundingInfo({...fundingInfo, rehabCost: formatNumberInput(e.target.value)})} required inputMode="decimal" className="mt-1 block w-full input-field" /></div>
           <div><label htmlFor="arv" className="block text-sm font-medium text-gray-700">After Repair Value (ARV) ($)</label><input type="text" id="arv" name="arv" value={fundingInfo.arv} onChange={(e) => setFundingInfo({...fundingInfo, arv: formatNumberInput(e.target.value)})} required inputMode="decimal" className="mt-1 block w-full input-field" /></div>
        </div>
      </fieldset>

      {/* Step 3: Photos & Description (Including Upload Progress) */}
      <fieldset 
        ref={(el) => assignRef(el, 2)} 
        id="step-3" 
        onFocus={() => focusStep(3)} // Trigger scroll/focus
        className={`border p-4 rounded-md transition-all duration-300 ease-in-out ${ 
          currentFocusStep === 3 ? 'border-accent border-2 shadow-lg' : 'border-gray-300' // Highlight active
        }`}
      >
          <legend className="text-xl font-semibold text-primary px-2">Step 3: Photos & Description</legend>
          <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">Property Photos/Documents (PDF, PNG, JPG - Max 5MB each)</h3>
          <div><label htmlFor="photos" className="block text-sm font-medium text-gray-700 mb-1">Upload files or drag and drop</label><div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"><div className="space-y-1 text-center"><IconWrapper name="FiUploadCloud" className="mx-auto h-12 w-12 text-gray-400" /><div className="flex text-sm text-gray-600"><label htmlFor="photos" className="relative cursor-pointer bg-white rounded-md font-medium text-accent hover:text-accent-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-accent"><span>Upload files</span><input id="photos" name="photos" type="file" className="sr-only" onChange={handlePhotosChange} multiple accept="image/png, image/jpeg" /></label><p className="pl-1">or drag and drop</p></div><p className="text-xs text-gray-500">PNG, JPG up to 5MB each</p></div></div>{photosInfo.photos && photosInfo.photos.length > 0 && (<div className="mt-2 text-sm text-gray-600">Selected: {Array.from(photosInfo.photos).map(f => f.name).join(', ')}</div>)}</div>
          {/* Display Upload Progress */} 
          {isLoading && Object.keys(uploadProgress).length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-primary">Upload Progress:</p>
              {Object.entries(uploadProgress).map(([fileName, progress]) => (
                <div key={fileName} className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 ml-2">{fileName} ({Math.round(progress)}%)</span>
                </div>
              ))}
            </div>
          )}
          <div className="space-y-4 mt-6">
            <div><label htmlFor="briefDescription" className="block text-sm font-medium text-gray-700">Brief Description for Lenders</label><textarea id="briefDescription" name="briefDescription" rows={3} maxLength={500} value={photosInfo.briefDescription} onChange={handlePhotosChange} required className="mt-1 block w-full input-field textarea-field" placeholder="e.g., 'Fix-and-flip opportunity...'"></textarea><p className="text-xs text-gray-500 text-right">{photosInfo.briefDescription.length}/500</p></div>
            <div><label htmlFor="marketDescription" className="block text-sm font-medium text-gray-700">Market Description</label><textarea id="marketDescription" name="marketDescription" rows={3} maxLength={300} value={photosInfo.marketDescription} onChange={handlePhotosChange} required className="mt-1 block w-full input-field textarea-field" placeholder="Describe market conditions...'"></textarea><p className="text-xs text-gray-500 text-right">{photosInfo.marketDescription.length}/300</p></div>
            <div><label htmlFor="neighborhoodDescription" className="block text-sm font-medium text-gray-700">Neighborhood Description</label><textarea id="neighborhoodDescription" name="neighborhoodDescription" rows={3} maxLength={300} value={photosInfo.neighborhoodDescription} onChange={handlePhotosChange} required className="mt-1 block w-full input-field textarea-field" placeholder="Describe the neighborhood...'"></textarea><p className="text-xs text-gray-500 text-right">{photosInfo.neighborhoodDescription.length}/300</p></div>
            <div><label htmlFor="investmentHighlights" className="block text-sm font-medium text-gray-700">Investment Highlights</label><textarea id="investmentHighlights" name="investmentHighlights" rows={3} maxLength={300} value={photosInfo.investmentHighlights} onChange={handlePhotosChange} required className="mt-1 block w-full input-field textarea-field" placeholder="Highlight key points...'"></textarea><p className="text-xs text-gray-500 text-right">{photosInfo.investmentHighlights.length}/300</p></div>
            <div><label htmlFor="riskFactors" className="block text-sm font-medium text-gray-700">Risk Factors</label><textarea id="riskFactors" name="riskFactors" rows={3} maxLength={300} value={photosInfo.riskFactors} onChange={handlePhotosChange} required className="mt-1 block w-full input-field textarea-field" placeholder="Be transparent about risks...'"></textarea><p className="text-xs text-gray-500 text-right">{photosInfo.riskFactors.length}/300</p></div>
          </div>
      </fieldset>

      {/* Navigation & Submission Area */}
      <div className="flex justify-between items-center mt-8 pt-5 border-t border-gray-200">
         {/* Previous Button (disabled during loading) */} 
         <div><button type="button" onClick={() => focusStep(currentFocusStep - 1)} disabled={currentFocusStep === 1 || isLoading} className={`btn btn-outline ${currentFocusStep === 1 || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>Previous</button></div>
         <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">Step {currentFocusStep} of {totalSteps}</span>
            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && <p className="text-sm text-green-600">{success}</p>}
            {/* Next Button (disabled during loading) */} 
            {currentFocusStep < totalSteps && (<button type="button" onClick={() => focusStep(currentFocusStep + 1)} disabled={isLoading} className="btn btn-primary">Next</button>)}
            {/* Submit Button */} 
            {currentFocusStep === totalSteps && (<button type="submit" disabled={isLoading} className={`btn btn-primary ${isLoading ? 'opacity-50 cursor-wait' : ''}`}>{isLoading ? <><LoadingSpinner size="w-5 h-5 mr-2" /> Submitting...</> : 'Submit Deal'}</button>)}
         </div>
      </div>

    </form>
  );
};

export default SubmitDealForm; 