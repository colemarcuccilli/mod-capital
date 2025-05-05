import React, { useState, useEffect, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { signUpWithEmail } from '../../lib/firebaseAuth';
import { AuthError } from 'firebase/auth';
import { useAuth } from '../../context/AuthContext'; 
import { UserProfile } from '../../lib/firebaseFirestore';
import Modal from './Modal'; // Import the base Modal

// Input type remains the same
type SignupFormInputs = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserProfile['role'];
};

interface SignupModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialRole?: UserProfile['role'];
    initialQ2Answer?: string;
    intendedAction?: string; // Action to perform after successful signup/login
    onSignupSuccess: (confirmedRole: UserProfile['role']) => void; // ADDED: Callback for success
}

const SignupModal: React.FC<SignupModalProps> = ({ 
    isOpen,
    onClose,
    initialRole,
    initialQ2Answer,
    intendedAction,
    onSignupSuccess // Destructure the new prop
}) => {
  const { setPostSignupFlowRole } = useAuth(); // To trigger next step

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setValue,
    reset, // Add reset to clear form on close
  } = useForm<SignupFormInputs>({
    defaultValues: {
      role: initialRole || 'investor',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const [firebaseError, setFirebaseError] = useState<string | null>(null);
  const password = watch('password'); 

  // Effect to update default role if initialRole prop changes or is set after mount
  useEffect(() => {
    if (initialRole) {
        setValue('role', initialRole);
    }
     // Reset form when modal is opened with potentially new initialRole
     if (isOpen) {
         reset({ 
             role: initialRole || 'investor',
             firstName: '',
             lastName: '',
             email: '',
             password: '',
             confirmPassword: ''
          });
         setFirebaseError(null); // Clear previous errors
     }
  }, [isOpen, initialRole, setValue, reset]);

  // --- Form Submission Handler --- 
  const onSubmit: SubmitHandler<SignupFormInputs> = async (data) => {
    setFirebaseError(null);
    try {
      const confirmedRole = await signUpWithEmail(
        data.email, 
        data.password, 
        data.firstName,
        data.lastName,
        data.role,
        initialQ2Answer 
      );
      
      console.log('Signup successful, role confirmed:', confirmedRole);
      // Call the success callback instead of setting context directly here
      onSignupSuccess(confirmedRole); 
      // setPostSignupFlowRole(confirmedRole); // Let parent handle this
      // reset(); // Reset can happen in onClose or useEffect based on isOpen
      // onClose(); // Parent will close modal via onSignupSuccess typically

      // Post-login action (like redirecting based on intendedAction)
      // would typically be handled by the component watching the auth state,
      // OR we could potentially pass the intendedAction to the AuthProvider
      // to handle after profile is loaded. For now, App.tsx handles the post-signup flow.

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
    }
  };

  return (
    <Modal 
        isOpen={isOpen} 
        onClose={onClose} // Pass onClose to Modal
        title="Create Account" 
        maxWidthClass="max-w-lg" // Slightly wider for form
    >
        {/* Form content goes inside the Modal children */}
        <> 
            {initialRole && (
                <p className="text-sm text-center text-gray-600 dark:text-gray-400 -mt-2 mb-4">
                    Joining as: <span className="font-medium">{initialRole.replace(/\b\w/g, l => l.toUpperCase())}</span>
                </p>
            )}
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                {/* Role Selection Dropdown */}
                <div>
                    <label htmlFor="role-modal" className="block text-sm font-medium text-primary dark:text-gray-300 mb-1">Account Type</label>
                    <select 
                        id="role-modal" 
                        className="input-field" 
                        {...register("role", { required: "Please select an account type" })}
                    >
                        <option value="investor">Investor / Buyer</option>
                        <option value="lender">Lender / Capital Provider</option>
                        <option value="agent">Agent</option>
                        <option value="wholesaler">Wholesaler</option>
                        <option value="owner">Property Owner / Seller</option>
                        <option value="other">Other</option>
                    </select>
                    {errors.role && <p className="mt-1 text-xs text-red-600">{errors.role.message}</p>}
                </div>
                
                {/* Name Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="firstName-modal" className="block text-sm font-medium text-primary dark:text-gray-300 mb-1">First Name</label>
                        <input id="firstName-modal" type="text" autoComplete="given-name" required className="input-field" placeholder="First Name" {...register("firstName", { required: "First name is required" })} />
                        {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="lastName-modal" className="block text-sm font-medium text-primary dark:text-gray-300 mb-1">Last Name</label>
                        <input id="lastName-modal" type="text" autoComplete="family-name" required className="input-field" placeholder="Last Name" {...register("lastName", { required: "Last name is required" })} />
                        {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName.message}</p>}
                    </div>
                </div>

                 {/* Email Input */}
                <div>
                    <label htmlFor="email-address-modal" className="block text-sm font-medium text-primary dark:text-gray-300 mb-1">Email</label>
                    <input id="email-address-modal" type="email" autoComplete="email" required className="input-field" placeholder="Email address" {...register("email", { required: "Email is required" })} />
                    {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
                </div>

                {/* Password Inputs */}
                <div>
                    <label htmlFor="password-modal" className="block text-sm font-medium text-primary dark:text-gray-300 mb-1">Password</label>
                    <input id="password-modal" type="password" autoComplete="new-password" required className="input-field" placeholder="Password (min. 6 characters)" {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })} />
                    {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
                </div>
                <div>
                    <label htmlFor="confirmPassword-modal" className="block text-sm font-medium text-primary dark:text-gray-300 mb-1">Confirm Password</label>
                    <input id="confirmPassword-modal" type="password" autoComplete="new-password" required className="input-field" placeholder="Confirm Password" {...register("confirmPassword", { required: "Please confirm your password", validate: value => value === password || "Passwords do not match" })} />
                    {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>}
                </div>

                {/* Firebase Error Display */}
                {firebaseError && (
                    <div className="text-red-600 text-sm text-center p-2 bg-red-50 dark:bg-red-900/30 rounded">
                       {firebaseError}
                    </div>
                )}

                 {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        disabled={isSubmitting} 
                        className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent dark:focus:ring-offset-gray-800 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? 'Creating Account...' : 'Sign up'}
                    </button>
                </div>

                 {/* Login Link */}
                 <div className="text-sm text-center">
                    <span className="text-primary/80 dark:text-gray-400">Already have an account? </span>
                    <Link to="/login" onClick={onClose} className="font-medium text-accent hover:text-accent/90">
                         Log in
                    </Link>
                 </div>
            </form>
        </>
    </Modal>
  );
};

export default SignupModal; 