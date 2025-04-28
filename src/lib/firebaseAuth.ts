import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile, // Import updateProfile
  User, // Import User type
  AuthError,
  UserCredential // Import UserCredential type
} from "firebase/auth";
import { app } from "./firebaseConfig";
import { createUserProfileDocument } from "./firebaseFirestore";

const auth = getAuth(app);

// TODO: Add Firestore logic to create user profile doc on signup

/**
 * Signs up a new user with email and password.
 * Creates a Firestore profile document upon successful signup.
 * @param email - User's email.
 * @param password - User's password.
 * @param firstName - User's first name.
 * @param lastName - User's last name.
 * @param role - User's selected role.
 * @returns The user credential.
 */
export const signUpWithEmail = async (email: string, password: string, firstName: string, lastName: string, role: 'investor' | 'lender') => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Auth Signup successful:", user.uid);

    // Update auth profile immediately with display name
    const displayName = `${firstName} ${lastName}`.trim();
    await updateProfile(user, { displayName });
    console.log("Auth profile displayName updated.");

    // Create Firestore profile document
    await createUserProfileDocument(user, { role });
    
    console.log("User signed up & profile creation initiated for:", user.uid);
    return userCredential;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error; // Re-throw error to be caught by the calling component
  }
};

/**
 * Signs in a user with email and password.
 * @param email - User's email.
 * @param password - User's password.
 * @returns The user credential.
 */
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Signin successful:", userCredential.user);
    return userCredential;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error; // Re-throw error
  }
};

/**
 * Signs out the current user.
 */
export const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log("Signout successful");
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

/**
 * Updates the user's Firebase Authentication profile.
 * @param user - The current Firebase Auth user object.
 * @param profileUpdates - An object containing fields to update (e.g., { displayName: 'New Name', photoURL: 'new/url.jpg' }).
 */
export const updateAuthProfile = async (user: User, profileUpdates: { displayName?: string | null; photoURL?: string | null }) => {
  if (!user) {
    throw new Error("User must be logged in to update profile.");
  }
  try {
    await updateProfile(user, profileUpdates);
    console.log("Firebase Auth profile updated successfully.");
  } catch (error) {
    console.error("Error updating Firebase Auth profile:", error);
    throw error; // Re-throw error to be caught by the calling component
  }
};

// Listener for authentication state changes (optional, if needed outside context)
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export { auth }; // Export auth instance if needed elsewhere, though often context is preferred 