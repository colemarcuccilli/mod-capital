import React, { useState, useRef, useCallback } from 'react';
import { FiX, FiUploadCloud, FiFile, FiTag, FiLoader } from 'react-icons/fi';
import IconWrapper from '../atoms/IconWrapper';
import { DocumentMetadata } from '../../lib/firebaseFirestore'; // For category type

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (file: File, category: DocumentMetadata['category'], tags: string[]) => Promise<void>; // onSubmit returns a promise to handle async upload
}

// Define categories matching DocumentMetadata type
const categories: DocumentMetadata['category'][] = [
    'Loan Documents', 
    'Property Documents', 
    'Legal Documents', 
    'Tax Documents', 
    'Insurance Documents', 
    'Other Documents'
];

const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [category, setCategory] = useState<DocumentMetadata['category']>(categories[0]); // Default to first category
  const [tags, setTags] = useState<string>(''); // Store tags as comma-separated string for simplicity
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0); // Progress percentage
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setError(null); // Clear previous errors on new file selection
    }
  };

  // Trigger hidden file input click
  const handleSelectFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleTagsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTags(event.target.value);
  };

  const resetForm = useCallback(() => {
    setSelectedFile(null);
    setCategory(categories[0]);
    setTags('');
    setIsUploading(false);
    setUploadProgress(0);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear the file input value
    }
  }, []);

  const handleClose = () => {
    if (isUploading) return; // Don't close if uploading
    resetForm();
    onClose();
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }
    if (!category) {
      setError('Please select a category.');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(0); // Reset progress before starting

    // Split tags string into array, trim whitespace, remove empty strings
    const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

    try {
      await onSubmit(selectedFile, category, tagArray);
      // Wait a tiny bit for UI update before closing, or rely on parent state update
      // setTimeout(() => {
      //   handleClose();
      // }, 200); 
      handleClose(); // Close immediately after onSubmit promise resolves
    } catch (uploadError: any) {
      setError(`Upload failed: ${uploadError.message || 'Please try again.'}`);
      console.error("Upload Error in Modal:", uploadError);
      setIsUploading(false); // Ensure uploading state is reset on error
      setUploadProgress(0);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */} 
      <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm" onClick={handleClose} />
      
      {/* Modal Panel */} 
      <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
        {/* Header */} 
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-primary dark:text-white">Upload New Document</h3>
          <button onClick={handleClose} disabled={isUploading} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50">
            <IconWrapper name="FiX" size={20} />
          </button>
        </div>

        {/* Form Body */} 
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
           {/* File Input Area */} 
           <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">File</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md cursor-pointer hover:border-accent dark:hover:border-accent-light" onClick={handleSelectFileClick}>
                <div className="space-y-1 text-center">
                  <IconWrapper name="FiUploadCloud" className="mx-auto h-12 w-12 text-gray-400" />
                  {selectedFile ? (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <IconWrapper name="FiFile" className="mr-1"/> 
                        <span className='font-medium text-primary dark:text-accent-light truncate max-w-xs'>{selectedFile.name}</span> 
                        <span className='ml-1'>({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium text-accent dark:text-accent-light">Click to select a file</span> or drag and drop
                    </p>
                    // TODO: Add drag and drop functionality later if needed
                  )}
                  {/* Hidden actual file input */}
                  <input 
                    ref={fileInputRef} 
                    id="file-upload" 
                    name="file-upload" 
                    type="file" 
                    className="sr-only" 
                    onChange={handleFileChange} 
                  />
                </div>
              </div>
           </div>

           {/* Category Selection */} 
           <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
              <select
                id="category"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as DocumentMetadata['category'])}
                required
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-accent focus:border-accent rounded-md dark:text-white"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
           </div>

           {/* Tags Input */} 
           <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tags (comma-separated)</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IconWrapper name="FiTag" className="text-gray-400" size={16}/>
                 </div>
                 <input
                    type="text"
                    name="tags"
                    id="tags"
                    value={tags}
                    onChange={handleTagsChange}
                    className="focus:ring-accent focus:border-accent block w-full pl-10 sm:text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md py-2 dark:text-white"
                    placeholder="e.g., appraisal, contract, 123_main_st"
                 />
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Help organize your documents with relevant keywords.</p>
           </div>
           
           {/* Error Display */}
           {error && (
             <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
           )}

            {/* Upload Progress */} 
           {isUploading && (
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div className="bg-accent h-2.5 rounded-full transition-width duration-300" style={{ width: `${uploadProgress}%` }}></div>
                    <p className="text-xs text-center text-gray-500 mt-1">Uploading... {uploadProgress.toFixed(0)}%</p>
                </div>
            )}

           {/* Footer Buttons */} 
           <div className="pt-4 flex justify-end space-x-3 border-t border-gray-200 dark:border-gray-700">
              <button 
                type="button" 
                onClick={handleClose}
                disabled={isUploading}
                className="btn btn-outline disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isUploading || !selectedFile}
                className="btn btn-primary disabled:opacity-50 flex items-center"
              >
                {isUploading ? (
                  <><IconWrapper name="FiLoader" className="animate-spin mr-2"/> Uploading...</>
                ) : (
                  'Upload Document'
                )}
              </button>
           </div>
        </form>
      </div>
    </div>
  );
};

export default UploadDocumentModal; 