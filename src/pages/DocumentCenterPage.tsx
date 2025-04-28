import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { DocumentMetadata } from '../lib/firebaseFirestore';
import { getUserDocuments, uploadDocument, deleteDocument } from '../lib/firebaseDocuments';
import LoadingSpinner from '../components/atoms/LoadingSpinner';
import { FiUpload, FiSearch, FiTrash2, FiFileText, FiTag, FiCalendar, FiDatabase } from 'react-icons/fi';
import IconWrapper from '../components/atoms/IconWrapper';
import UploadDocumentModal from '../components/organisms/UploadDocumentModal';

// TODO: Refine UI components (SearchBar, Filters, UploadModal, DocumentItem)

const DocumentCenterPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Documents');
  const [sortOption, setSortOption] = useState('createdAt-desc'); // e.g., 'createdAt-desc', 'fileName-asc'
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Categories definition
  const categories = [
    'All Documents', 
    'Loan Documents', 
    'Property Documents', 
    'Legal Documents', 
    'Tax Documents', 
    'Insurance Documents', 
    'Other Documents'
  ];

  // Fetch documents
  useEffect(() => {
    if (!currentUser?.uid) {
      setIsLoading(false);
      setError("Please log in to view documents.");
      return;
    }

    setIsLoading(true);
    setError(null);
    const unsubscribe = getUserDocuments(
      currentUser.uid,
      (fetchedDocs) => {
        setDocuments(fetchedDocs);
        setIsLoading(false);
      },
      (fetchError) => {
        setError("Failed to load documents: " + fetchError.message);
        setIsLoading(false);
      }
    );

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [currentUser]);

  // Filtering logic (example)
  const filteredDocuments = documents
    .filter(doc => 
      selectedCategory === 'All Documents' || doc.category === selectedCategory
    )
    .filter(doc => 
      !searchTerm || 
      doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      doc.associatedPropertyAddress?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Sorting logic (example)
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    const [field, direction] = sortOption.split('-');
    const desc = direction === 'desc';
    
    let valA: any;
    let valB: any;

    if (field === 'createdAt' || field === 'lastViewedAt') {
      valA = a[field]?.toMillis() || 0;
      valB = b[field]?.toMillis() || 0;
    } else if (field === 'fileSize') {
        valA = a.fileSize || 0;
        valB = b.fileSize || 0;
    } else { // Assume string comparison for fileName, category etc.
        valA = (a[field as keyof DocumentMetadata] as string)?.toLowerCase() || '';
        valB = (b[field as keyof DocumentMetadata] as string)?.toLowerCase() || '';
    }

    if (valA < valB) return desc ? 1 : -1;
    if (valA > valB) return desc ? -1 : 1;
    return 0;
  });

  // --- Modal Handling --- 
  const handleOpenUploadModal = () => {
    setIsUploadModalOpen(true);
  };

  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  // --- Upload Handling --- 
  const handleUploadSubmit = async (file: File, category: DocumentMetadata['category'], tags: string[]) => {
    if (!currentUser?.uid) {
        throw new Error("User not logged in."); // Should be caught by modal's catch block
    }
    
    setIsUploading(true); // Maybe show a global indicator
    setError(null);
    
    try {
      // We don't need the progress callback here unless we want a global progress bar
      await uploadDocument(currentUser.uid, file, category, tags);
      console.log("Document uploaded successfully via page handler.");
      // No need to manually add to state, Firestore listener will update it.
      // handleCloseUploadModal(); // Modal closes itself on success
    } catch (uploadError: any) {
      console.error("Upload failed via page handler:", uploadError);
      setError(`Upload failed: ${uploadError.message}`); // Set page-level error if needed
      // Re-throw the error so the modal can catch it and display it locally
      throw uploadError; 
    } finally {
      setIsUploading(false);
    }
  };

  // Handle Delete (simplified)
  const handleDeleteClick = async (docId: string, storagePath: string) => {
    if (window.confirm(`Are you sure you want to delete this document? This cannot be undone.`)) {
        try {
            setIsLoading(true); // Show loading indicator during deletion
            await deleteDocument(docId, storagePath);
            // No need to manually remove from state, Firestore listener will update it
            console.log(`Document ${docId} deletion initiated.`);
        } catch (deleteError: any) {
            setError(`Failed to delete document: ${deleteError.message}`);
            console.error("Deletion error:", deleteError);
        } finally {
             // Ensure loading state is reset even if deleteDocument doesn't trigger listener update quickly
             // You might fine-tune this based on listener behavior
            // setIsLoading(false); 
        }
    }
  };

  // --- UI Rendering --- 
  console.log("[DocumentCenterPage] Rendering..."); // Log start of render
  console.log(`[DocumentCenterPage] isLoading: ${isLoading}, error: ${error}, documents.length: ${documents.length}`);

  // Show initial loading spinner ONLY if loading AND no documents are present yet
  if (isLoading && documents.length === 0) {
    console.log("[DocumentCenterPage] Rendering: Initial Loading Spinner");
    return <div className="flex justify-center p-10"><LoadingSpinner /></div>;
  }

  // Show initial error ONLY if error occurred AND no documents loaded
  if (error && documents.length === 0) {
    console.log("[DocumentCenterPage] Rendering: Initial Error Message");
    return <p className="text-red-500 text-center p-4">Error loading documents: {error}</p>;
  }
  
  // If not initial load/error, render the main layout
  console.log("[DocumentCenterPage] Rendering: Main Layout");
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 relative">
      {/* Loading Overlay for subsequent loads/actions */} 
      {isLoading && (
         <div className="absolute inset-0 bg-white/70 dark:bg-black/50 flex items-center justify-center z-20 rounded-md">
             <LoadingSpinner />
         </div>
      )}
      
      {/* Sidebar - Categories & Recently Viewed */} 
      <aside className="w-full md:w-1/4 flex-shrink-0">
        <h2 className="text-xl font-semibold text-primary mb-4">Categories</h2>
        <ul className="space-y-1 mb-8">
          {categories.map(cat => (
            <li key={cat}>
              <button 
                onClick={() => setSelectedCategory(cat)}
                className={`w-full text-left px-3 py-1 rounded ${selectedCategory === cat ? 'bg-accent text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                {cat} 
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content - Search, Upload, List */} 
      <main className="flex-grow relative">
        {/* Top Bar: Search & Upload Button */} 
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative flex-grow w-full md:w-auto">
            <input 
              type="text" 
              placeholder="Search documents..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-1 focus:ring-accent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
             <IconWrapper name="FiSearch" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button 
            onClick={handleOpenUploadModal} 
            className="btn btn-primary flex items-center gap-2 w-full md:w-auto flex-shrink-0">
            <IconWrapper name="FiUpload" />
            Upload Document
          </button>
        </div>

        {/* Sort Options & Error */} 
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
             <span className="text-sm text-gray-500 dark:text-gray-400">
                 Showing {sortedDocuments.length} of {documents.length} documents
             </span>
             <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="text-sm border rounded px-2 py-1 bg-white dark:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-accent dark:border-gray-600 dark:text-white">
                <option value="createdAt-desc">Date Added (Newest)</option>
                <option value="createdAt-asc">Date Added (Oldest)</option>
                <option value="fileName-asc">Name (A-Z)</option>
                <option value="fileName-desc">Name (Z-A)</option>
                <option value="fileSize-desc">Size (Largest)</option>
                <option value="fileSize-asc">Size (Smallest)</option>
            </select>
        </div>
        {error && <p className="text-red-500 text-center p-2 mb-4 bg-red-50 rounded-md text-sm">Error: {error}</p>}
        
        {/* Document List */} 
        <div className="space-y-4">
            {sortedDocuments.length > 0 ? (
                sortedDocuments.map(doc => (
                    <div key={doc.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex items-center gap-4 relative">
                          <IconWrapper name="FiFileText" size={24} className="text-primary dark:text-gray-300 flex-shrink-0"/>
                         <div className="flex-grow overflow-hidden">
                              <a href={doc.downloadURL} target="_blank" rel="noopener noreferrer" className="font-medium text-primary dark:text-white hover:underline truncate block" title={doc.fileName}>{doc.fileName}</a>
                              <div className="text-xs text-gray-500 dark:text-gray-400 flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                                  <span><IconWrapper name="FiCalendar" className="inline mr-1"/> {doc.createdAt?.toDate().toLocaleDateString()}</span>
                                  <span><IconWrapper name="FiDatabase" className="inline mr-1"/> {(doc.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                                  <span><IconWrapper name="FiTag" className="inline mr-1"/> {doc.category}</span>
                                  {doc.associatedPropertyAddress && <span className="italic">({doc.associatedPropertyAddress})</span>}
                                  {doc.tags && doc.tags.length > 0 && (
                                      <div className="flex flex-wrap gap-1 mt-1">
                                          {doc.tags.map(tag => <span key={tag} className="bg-gray-200 dark:bg-gray-600 px-1.5 py-0.5 rounded text-xs">{tag}</span>)}
                                      </div>
                                  )}
                              </div>
                         </div>
                         <button 
                             onClick={() => handleDeleteClick(doc.id, doc.storagePath)}
                             title="Delete Document"
                             className="text-gray-400 hover:text-red-500 p-1 rounded-full flex-shrink-0">
                             <IconWrapper name="FiTrash2" />
                         </button>
                    </div>
                ))
            ) : (
                !isLoading && <p className="text-center text-gray-500 italic py-6">No documents found matching your criteria.</p>
            )}
        </div>
      </main>
      
      {/* Render the Upload Modal */} 
      <UploadDocumentModal 
        isOpen={isUploadModalOpen}
        onClose={handleCloseUploadModal}
        onSubmit={handleUploadSubmit}
      />
    </div>
  );
};

export default DocumentCenterPage; 