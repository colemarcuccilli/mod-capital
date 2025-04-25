import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { signUpWithEmail } from '../lib/firebaseAuth'; // Import the sign-up function
import { AuthError } from 'firebase/auth';
// TODO: Import function to create Firestore user document
// import { createUserProfileDocument } from '../lib/firebaseFirestore'; 

// Define form input type
type SignupFormInputs = {
  email: string;
  password: string;
  confirmPassword: string;
  role: 'investor' | 'lender'; // Role selection
};

const Signup: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormInputs>({
    defaultValues: {
      role: 'investor' // Default role
    }
  });
  const navigate = useNavigate();
  const [firebaseError, setFirebaseError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Watch password field for confirmation validation
  const password = watch('password'); 

  const onSubmit: SubmitHandler<SignupFormInputs> = async (data) => {
    if (data.password !== data.confirmPassword) {
      // This validation is technically handled by react-hook-form below,
      // but adding an explicit check is good practice.
      setFirebaseError("Passwords do not match.");
      return;
    }
    
    setIsLoading(true);
    setFirebaseError(null);
    try {
      const userCredential = await signUpWithEmail(data.email, data.password, data.role);
      // --- Firestore user document creation is now handled inside signUpWithEmail ---
      console.log('User signed up & profile creation initiated for:', userCredential.user.uid);
      
      // Redirect to login after signup
      navigate('/login'); 
    } catch (error) {
      const authError = error as AuthError;
      if (authError.code === 'auth/email-already-in-use') {
        setFirebaseError('This email address is already registered.');
      } else if (authError.code === 'auth/weak-password') {
        setFirebaseError('Password should be at least 6 characters.');
      } else {
        setFirebaseError('An unexpected error occurred. Please try again.');
      }
      console.error("Signup failed:", authError);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-primary">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Role Selection */}
          <div className="rounded-md shadow-sm">
             <label htmlFor="role" className="block text-sm font-medium text-primary mb-1">I am a...</label>
             <select 
               id="role" 
               className="input-field"
               {...register("role")}
             >
               <option value="investor">Investor / Borrower</option>
               <option value="lender">Lender</option>
             </select>
          </div>
          
          {/* Email and Passwords */} 
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                type="email"
                autoComplete="email"
                required
                className="input-field rounded-t-md"
                placeholder="Email address"
                {...register("email", { required: "Email is required" })}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                className="input-field rounded-none"
                placeholder="Password (min. 6 characters)"
                {...register("password", { 
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" }
                })}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="input-field rounded-b-md"
                placeholder="Confirm Password"
                {...register("confirmPassword", { 
                  required: "Please confirm your password",
                  validate: value => value === password || "Passwords do not match"
                })}
              />
            </div>
          </div>

          {/* Display form errors */} 
          {(errors.email || errors.password || errors.confirmPassword || errors.role || firebaseError) && (
            <div className="text-red-600 text-sm space-y-1">
              {errors.role && <p>{errors.role.message}</p>}
              {errors.email && <p>{errors.email.message}</p>}
              {errors.password && <p>{errors.password.message}</p>}
              {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
              {firebaseError && <p>{firebaseError}</p>}
            </div>
          )}

          <div className="flex items-center justify-end">
            <div className="text-sm">
              <Link to="/login" className="font-medium text-accent hover:text-accent/90">
                Already have an account? Log in
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-background bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Creating Account...' : 'Sign up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup; 