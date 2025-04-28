import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { auth } from '../lib/firebaseConfig';
// Import UserProfile interface and fetch function
import { UserProfile, fetchUserProfile } from '../lib/firebaseFirestore'; 

interface AuthContextType {
  currentUser: User | null;
  currentUserProfile: UserProfile | null; // Add profile state
  loading: boolean;
  logout: () => Promise<void>; // Add logout function type
}

const AuthContext = createContext<AuthContextType>({ 
  currentUser: null, 
  currentUserProfile: null, // Default profile to null
  loading: true,
  logout: async () => {} // Default empty async function 
});

export const useAuth = () => {
  return useContext(AuthContext);
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true); 

  // Logout function definition
  const logout = async () => {
    try {
      console.log("[AuthProvider] Signing out...");
      await signOut(auth);
      console.log("[AuthProvider] Signout successful.");
      // State updates (currentUser, currentUserProfile) will be handled by onAuthStateChanged listener
    } catch (error) {
        console.error("[AuthProvider] Signout error:", error);
        throw error; // Re-throw error to be handled by caller if needed
    }
  };

  useEffect(() => {
    setLoading(true);
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("[AuthProvider] onAuthStateChanged triggered. User:", user?.uid);
      setCurrentUser(user);
      setCurrentUserProfile(null); // Reset profile initially
      
      if (user) {
        console.log(`[AuthProvider] User logged in (${user.uid}). Attempting profile fetch...`);
        try {
            const profile = await fetchUserProfile(user.uid);
            setCurrentUserProfile(profile); 
            console.log('[AuthProvider] Profile fetch attempt finished. Profile:', profile);
        } catch (fetchError) {
            console.error("[AuthProvider] Error during fetchUserProfile:", fetchError);
             // Profile remains null
        } finally {
             console.log("[AuthProvider] Setting loading to false (after fetch attempt).");
             setLoading(false); 
        }
      } else {
        console.log("[AuthProvider] No user found. Setting loading to false.");
        setLoading(false);
      }
    });

    return () => {
        console.log("[AuthProvider] Unsubscribing auth listener.");
        unsubscribe();
    };
  }, []);

  const value = {
    currentUser,
    currentUserProfile,
    loading,
    logout // Include logout in the context value
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <p className='text-center p-10'>Authenticating...</p>} {/* Show simple loading */}
    </AuthContext.Provider>
  );
}; 