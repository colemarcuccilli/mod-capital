import { 
    collection, 
    addDoc, 
    query, 
    where, 
    onSnapshot, 
    orderBy, 
    serverTimestamp, 
    deleteDoc, 
    doc, 
    Timestamp,
    Unsubscribe
} from 'firebase/firestore';
import {
    ref,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject
} from 'firebase/storage';
import { db, storage } from './firebaseConfig'; // Assuming firebaseConfig exports db and storage
import { DocumentMetadata } from './firebaseFirestore'; // Import the type we just defined

const DOCUMENTS_COLLECTION = 'documents';

/**
 * Uploads a file to Firebase Storage and its metadata to Firestore.
 * 
 * @param userId - UID of the user uploading the document.
 * @param file - The File object to upload.
 * @param category - The selected category for the document.
 * @param tags - An array of user-defined tags.
 * @param onProgress - Optional callback for upload progress updates (0-100).
 * @returns Promise resolving with the new document ID.
 * @throws Throws an error if the upload or Firestore write fails.
 */
export const uploadDocument = async (
    userId: string,
    file: File,
    category: DocumentMetadata['category'],
    tags: string[],
    onProgress?: (progress: number) => void
): Promise<string> => {
    if (!userId || !file) {
        throw new Error('User ID and file are required for upload.');
    }

    const uniqueId = doc(collection(db, '_internal')).id; // Generate a unique ID prefix/part
    const storagePath = `documents/${userId}/${uniqueId}-${file.name}`;
    const storageRef = ref(storage, storagePath);

    console.log(`[FirebaseDocuments] Uploading ${file.name} to ${storagePath}...`);

    return new Promise((resolve, reject) => {
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('[FirebaseDocuments] Upload is ' + progress + '% done');
                if (onProgress) {
                    onProgress(progress);
                }
            },
            (error) => {
                console.error("[FirebaseDocuments] Upload failed:", error);
                reject(new Error(`Upload failed: ${error.code}`));
            },
            async () => {
                // Upload completed successfully, now get the download URL
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    console.log('[FirebaseDocuments] File available at', downloadURL);

                    // Prepare metadata for Firestore
                    const docData: Omit<DocumentMetadata, 'id'> = {
                        userId,
                        fileName: file.name,
                        storagePath,
                        downloadURL,
                        fileType: file.type || 'application/octet-stream',
                        fileSize: file.size,
                        category,
                        tags,
                        createdAt: serverTimestamp() as Timestamp,
                        // associatedDealId and associatedPropertyAddress can be added later if needed
                    };

                    // Add metadata document to Firestore
                    const docRef = await addDoc(collection(db, DOCUMENTS_COLLECTION), docData);
                    console.log("[FirebaseDocuments] Metadata added with ID:", docRef.id);
                    resolve(docRef.id); // Return the Firestore document ID
                } catch (error) {
                    console.error("[FirebaseDocuments] Failed to get download URL or write metadata:", error);
                    // Attempt to delete the orphaned file from storage if metadata write fails
                    try {
                        await deleteObject(storageRef);
                        console.warn('[FirebaseDocuments] Cleaned up orphaned file from storage.');
                    } catch (cleanupError) {
                        console.error('[FirebaseDocuments] Failed to cleanup orphaned file:', cleanupError);
                    }
                    reject(new Error('Failed to finalize upload and save metadata.'));
                }
            }
        );
    });
};

/**
 * Subscribes to real-time updates for a user's documents.
 * 
 * @param userId - The UID of the user whose documents to fetch.
 * @param onDocumentsReceived - Callback function invoked with the array of documents.
 * @param onError - Callback function invoked if an error occurs.
 * @returns An unsubscribe function to detach the listener.
 */
export const getUserDocuments = (
    userId: string,
    onDocumentsReceived: (docs: DocumentMetadata[]) => void,
    onError: (error: Error) => void
): Unsubscribe => {
    if (!userId) {
        onError(new Error('User ID is required to fetch documents.'));
        return () => {}; // Return a no-op unsubscribe function
    }

    console.log(`[FirebaseDocuments] Subscribing to documents for user: ${userId}`);
    const q = query(
        collection(db, DOCUMENTS_COLLECTION),
        where("userId", "==", userId),
        orderBy("createdAt", "desc") // Default sort by newest first
    );

    const unsubscribe = onSnapshot(q, 
        (querySnapshot) => {
            const documents: DocumentMetadata[] = [];
            querySnapshot.forEach((doc) => {
                documents.push({ id: doc.id, ...doc.data() } as DocumentMetadata);
            });
            console.log(`[FirebaseDocuments] Received ${documents.length} documents for user ${userId}`);
            onDocumentsReceived(documents);
        },
        (error) => {
            console.error(`[FirebaseDocuments] Error fetching documents for user ${userId}:`, error);
            onError(error);
        }
    );

    return unsubscribe;
};

/**
 * Deletes a document's metadata from Firestore and the associated file from Storage.
 * 
 * @param documentId - The Firestore ID of the document metadata.
 * @param storagePath - The full path of the file in Firebase Storage.
 * @returns Promise resolving when deletion is complete.
 * @throws Throws an error if deletion fails.
 */
export const deleteDocument = async (documentId: string, storagePath: string): Promise<void> => {
    if (!documentId || !storagePath) {
        throw new Error('Document ID and Storage Path are required for deletion.');
    }

    console.log(`[FirebaseDocuments] Deleting document ${documentId} and file ${storagePath}...`);
    
    // Delete Firestore document
    const docRef = doc(db, DOCUMENTS_COLLECTION, documentId);
    await deleteDoc(docRef);
    console.log(`[FirebaseDocuments] Firestore document ${documentId} deleted.`);

    // Delete file from Storage
    const storageRef = ref(storage, storagePath);
    try {
        await deleteObject(storageRef);
        console.log(`[FirebaseDocuments] Storage file ${storagePath} deleted.`);
    } catch (error: any) {
        // Log error but don't necessarily fail if file doesn't exist (it might already be deleted)
        if (error.code === 'storage/object-not-found') {
            console.warn(`[FirebaseDocuments] Storage file ${storagePath} not found, assumed already deleted.`);
        } else {
            console.error(`[FirebaseDocuments] Error deleting storage file ${storagePath}:`, error);
            // Depending on requirements, you might want to re-throw here 
            // or handle the case where the Firestore doc is deleted but the file isn't.
            throw error; 
        }
    }
}; 