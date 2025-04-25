import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { signOutUser } from '../lib/firebaseAuth';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from "firebase/firestore";
import { db } from '../lib/firebaseConfig';
import { UserProfile } from '../lib/firebaseFirestore';

const Profile: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDirectProfile = async (uid: string) => {
      setIsLoadingProfile(true);
      setFetchError(null);
      console.log(`[Profile Page] Attempting direct fetch for UID: ${uid}`);
      const userDocRef = doc(db, "users", uid);
      try {
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          setProfileData({ uid, ...docSnap.data() } as UserProfile);
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

    if (currentUser?.uid) {
      fetchDirectProfile(currentUser.uid);
    } else {
      setIsLoadingProfile(false);
    }
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await signOutUser();
      navigate('/');
    } catch (error) {
      console.error("Error signing out from profile:", error);
    }
  };

  return (
    <div className="container mx-auto py-16 min-h-[60vh]">
      <h1 className="text-3xl font-bold text-primary mb-4">Your Profile</h1>
      
      {isLoadingProfile ? (
        <p className="text-primary/80">Loading profile data...</p>
      ) : fetchError ? (
        <p className="text-red-600">Error: {fetchError}</p>
      ) : currentUser && profileData ? (
        <div>
          <p className="text-primary/80 mb-2">
            <span className="font-medium">Email:</span> {currentUser.email}
          </p>
          <p className="text-primary/80 mb-2">
             <span className="font-medium">Role:</span> <span className="capitalize">{profileData.role}</span>
          </p>
          <p className="text-primary/80 mb-4">
             <span className="font-medium">Status:</span> 
             {profileData.isVerified ? 
               <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Verified</span> 
               : 
               <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending Verification</span>
             }
          </p>
          
          {/* TODO: Add profile editing form */}
          {/* TODO: Display submitted deals */}
          {/* TODO: Display expressed interests (sent/received) */}

          <button 
            onClick={handleLogout}
            className="mt-6 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent hover:bg-accent/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
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