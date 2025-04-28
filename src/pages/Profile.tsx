import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { signOutUser, updateAuthProfile } from '../lib/firebaseAuth';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from '../lib/firebaseConfig';
import { UserProfile } from '../lib/firebaseFirestore';
import LoadingSpinner from '../components/atoms/LoadingSpinner';

const Profile: React.FC = () => {
  const { currentUser, currentUserProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  // Local state for editing
  const [isEditing, setIsEditing] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editPhoneNumber, setEditPhoneNumber] = useState('');
  // Add state for bio later
  // const [editBio, setEditBio] = useState('');

  // State for profile data (can still keep direct fetch as fallback/refresher)
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false); // Loading state for save
  const [saveError, setSaveError] = useState<string | null>(null); // Error state for save

  // Initialize edit fields when currentUserProfile loads or changes
  useEffect(() => {
    if (currentUserProfile) {
      setEditDisplayName(currentUserProfile.displayName || '');
      setEditPhoneNumber(currentUserProfile.phoneNumber || '');
      // Initialize bio later: setEditBio(currentUserProfile.bio || '');
      setProfileData(currentUserProfile); // Use context data primarily
      setIsLoadingProfile(false); // Profile loaded from context
      setFetchError(null);
    } else if (!authLoading && currentUser) {
      // If context didn't load it but user exists, try direct fetch
      // (This logic might need refinement depending on context behavior)
      const fetchDirectProfile = async (uid: string) => {
        setIsLoadingProfile(true);
        setFetchError(null);
        console.log(`[Profile Page] Attempting direct fetch for UID: ${uid}`);
        const userDocRef = doc(db, "users", uid);
        try {
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const fetched = { uid, ...docSnap.data() } as UserProfile;
            setProfileData(fetched);
            setEditDisplayName(fetched.displayName || '');
            setEditPhoneNumber(fetched.phoneNumber || '');
            console.log("[Profile Page] Direct fetch SUCCESS:", docSnap.data());
          } else {
            setFetchError("Profile document not found.");
            console.log("[Profile Page] Direct fetch FAILED: No document.");
          }
        } catch (error) {
          setFetchError("Error fetching profile directly.");
          console.error("[Profile Page] Direct fetch ERROR:", error);
        } finally {
          setIsLoadingProfile(false);
        }
      };
      fetchDirectProfile(currentUser.uid);
    } else if (!authLoading && !currentUser) {
      setIsLoadingProfile(false); // Not loading if no user
    }
    // Dependency on currentUserProfile ensures fields reset if profile changes
  }, [currentUserProfile, authLoading, currentUser]);

  const handleLogout = async () => {
    try {
      await signOutUser();
      navigate('/');
    } catch (error) {
      console.error("Error signing out from profile:", error);
    }
  };

  const handleSaveProfile = async () => {
    if (!currentUser) return; // Should not happen if edit button is shown

    setIsSaving(true);
    setSaveError(null);

    try {
      // 1. Update Firebase Auth Profile (optional, but good practice)
      await updateAuthProfile(currentUser, { 
        displayName: editDisplayName, 
        // photoURL: newPhotoURL // Add later for photo upload
      });
      console.log("[Profile Page] Auth profile updated.");

      // 2. Update Firestore Document
      const userDocRef = doc(db, "users", currentUser.uid);
      await updateDoc(userDocRef, {
        displayName: editDisplayName,
        phoneNumber: editPhoneNumber,
        // bio: editBio, // Add later
        // profilePictureUrl: newPhotoURL // Add later
      });
      console.log("[Profile Page] Firestore profile updated.");

      // Update local state immediately (or rely on AuthContext to refresh)
      setProfileData(prev => prev ? { ...prev, displayName: editDisplayName, phoneNumber: editPhoneNumber } : null);
      setIsEditing(false); // Exit edit mode on success

    } catch (error: any) {
      console.error("[Profile Page] Error saving profile:", error);
      setSaveError(error.message || "Failed to save profile.");
    } finally {
      setIsSaving(false);
    }
  };

  // Determine loading state (either auth loading or profile loading)
  const isLoading = authLoading || isLoadingProfile;

  return (
    <div className="container mx-auto px-4 py-8 pt-24 min-h-screen">
      <h1 className="text-3xl font-bold text-primary mb-6">Your Profile</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center"><LoadingSpinner /></div>
      ) : fetchError ? (
        <p className="text-red-600">Error: {fetchError}</p>
      ) : currentUser && profileData ? (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
          
          {/* Display Mode */} 
          {!isEditing && (
            <div className="space-y-4">
              <p><span className="font-semibold text-gray-600">Display Name:</span> {profileData.displayName || "Not Set"}</p>
              <p><span className="font-semibold text-gray-600">Email:</span> {profileData.email}</p>
              <p><span className="font-semibold text-gray-600">Phone Number:</span> {profileData.phoneNumber || "Not Set"}</p>
              <p><span className="font-semibold text-gray-600">Role:</span> <span className="capitalize">{profileData.role}</span></p>
              <p><span className="font-semibold text-gray-600">Status:</span> 
                {profileData.isVerified ? 
                  <span className="ml-2 status-badge-verified">Verified</span> : 
                  <span className="ml-2 status-badge-pending">Pending Verification</span>
                }
              </p>
              {/* Display Bio Later: <p><span className="font-semibold text-gray-600">Bio:</span> {profileData.bio || "-"}</p> */}
              <button onClick={() => setIsEditing(true)} className="btn btn-secondary">Edit Profile</button>
            </div>
          )}

          {/* Edit Mode */} 
          {isEditing && (
            <div className="space-y-4">
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">Display Name</label>
                <input 
                  type="text" 
                  id="displayName" 
                  value={editDisplayName}
                  onChange={(e) => setEditDisplayName(e.target.value)}
                  className="mt-1 block w-full input-field"
                />
              </div>
               <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input 
                  type="tel" 
                  id="phoneNumber" 
                  value={editPhoneNumber}
                  onChange={(e) => setEditPhoneNumber(e.target.value)} 
                  className="mt-1 block w-full input-field"
                />
              </div>
               {/* Edit Bio Later: <div><label>Bio</label><textarea /></div> */}
              <div className="flex space-x-4 mt-4">
                <button onClick={handleSaveProfile} disabled={isSaving} className="btn btn-primary">
                  {isSaving ? <LoadingSpinner size="w-5 h-5" /> : 'Save Changes'}
                </button>
                <button onClick={() => setIsEditing(false)} disabled={isSaving} className="btn btn-outline">Cancel</button>
              </div>
              {saveError && <p className="text-red-600 text-sm mt-2">{saveError}</p>}
            </div>
          )}
          
          <button 
            onClick={handleLogout}
            className="mt-8 text-sm text-gray-500 hover:text-accent"
          >
            Logout
          </button>
        </div>
      ) : (
        <p className="text-primary/80">Could not load profile data. Are you logged in?</p>
      )}
    </div>
  );
};

export default Profile; 