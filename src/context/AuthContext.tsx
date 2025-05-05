import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { auth } from '../lib/firebaseConfig';
// Import UserProfile interface and fetch function
import { UserProfile, fetchUserProfile } from '../lib/firebaseFirestore'; 
// Import Zustand store and specific actions
import { useOnboardingStore } from '../store/onboardingStore'; // Assuming path is correct relative to context/

interface AuthContextType {
  currentUser: User | null;
  currentUserProfile: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
  // State for post-signup flow
  postSignupFlowRole: UserProfile['role'] | null;
  setPostSignupFlowRole: (role: UserProfile['role'] | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  currentUserProfile: null,
  loading: true,
  logout: async () => {},
  // Default values for new state
  postSignupFlowRole: null,
  setPostSignupFlowRole: () => {}
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
  // Add state and setter for post-signup flow
  const [postSignupFlowRole, setPostSignupFlowRole] = useState<UserProfile['role'] | null>(null);
  // Get the reset function from Zustand store
  const resetZustandInitialProfile = useOnboardingStore((state) => state.resetInitialProfile);

  const logout = async () => {
    try {
      console.log("[AuthProvider] Signing out...");
      await signOut(auth);
      // Clear post-signup state on logout too
      setPostSignupFlowRole(null);
      // Use the reset function
      resetZustandInitialProfile();
      console.log("[AuthProvider] Signout successful.");
    } catch (error) {
        console.error("[AuthProvider] Signout error:", error);
        throw error;
    }
  };

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("[AuthProvider] onAuthStateChanged triggered. User:", user?.uid);
      // Clear post-signup flow state whenever auth state changes unless signup just happened
      if (user?.uid !== currentUser?.uid) { // Only clear if user actually changed
          // We might need more sophisticated logic if postSignupFlowRole needs to persist briefly
          setPostSignupFlowRole(null);
      }
      setCurrentUser(user);
      setCurrentUserProfile(null);

      if (user) {
        console.log(`[AuthProvider] User logged in (${user.uid}). Attempting profile fetch...`);
        try {
            const profile = await fetchUserProfile(user.uid);
            setCurrentUserProfile(profile);
             // Reset Zustand onboarding profile if a profile exists and we aren't in the post-signup flow
             if (profile && !postSignupFlowRole) { // Check postSignupFlowRole
                 resetZustandInitialProfile();
             }
            console.log('[AuthProvider] Profile fetch attempt finished. Profile:', profile);
        } catch (fetchError) {
            console.error("[AuthProvider] Error during fetchUserProfile:", fetchError);
        } finally {
             console.log("[AuthProvider] Setting loading to false (after fetch attempt).");
             setLoading(false); 
        }
      } else {
        console.log("[AuthProvider] No user found. Setting loading to false.");
         // Use the reset function
         resetZustandInitialProfile();
        setLoading(false);
      }
    });

    return () => {
        console.log("[AuthProvider] Unsubscribing auth listener.");
        unsubscribe();
    };
    // Depend only on UID to prevent loops from profile/role updates
    // Also depend on resetZustandInitialProfile to ensure it's stable
  }, [currentUser?.uid, resetZustandInitialProfile]);

  const value = {
    currentUser,
    currentUserProfile,
    loading,
    logout,
    postSignupFlowRole,
    setPostSignupFlowRole
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <p className='text-center p-10'>Authenticating...</p>}
    </AuthContext.Provider>
  );
}; 