import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  AuthError,
  UserCredential // Import UserCredential type
} from "firebase/auth";
import { auth } from "./firebaseConfig"; // Import your Firebase auth instance
import { createUserProfileDocument } from "./firebaseFirestore"; // Import the Firestore function

// TODO: Add Firestore logic to create user profile doc on signup

/**
 * Signs up a new user with email and password AND creates profile.
 * @param email - User's email.
 * @param password - User's password.
 * @param role - User's selected role ('investor' or 'lender').
 * @returns The user credential on success.
 * @throws AuthError on failure.
 */
export const signUpWithEmail = async (
    email: string, 
    password: string, 
    role: 'investor' | 'lender' // Add role parameter
): Promise<UserCredential> => { // Add return type
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('Auth Signup successful:', userCredential.user?.uid);

    // After successful signup, create user document in Firestore
    if (userCredential.user) {
      // Pass the role and any other essential starting data
      await createUserProfileDocument(userCredential.user, { role }); 
    }
    
    return userCredential;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error; 
  }
};

/**
 * Signs in an existing user with email and password.
 * @param email - User's email.
 * @param password - User's password.
 * @returns The user credential on success.
 * @throws AuthError on failure.
 */
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Signin successful:', userCredential.user);
    return userCredential;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error; 
  }
};

/**
 * Signs out the current user.
 * @throws AuthError on failure.
 */
export const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log('Signout successful');
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// Add other auth functions as needed (e.g., password reset) 