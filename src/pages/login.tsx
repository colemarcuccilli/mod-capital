import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmail } from '../lib/firebaseAuth'; // Import the sign-in function
import { AuthError } from 'firebase/auth';

// Define form input type
type LoginFormInputs = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const navigate = useNavigate();
  const [firebaseError, setFirebaseError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setIsLoading(true);
    setFirebaseError(null);
    try {
      await signInWithEmail(data.email, data.password);
      navigate('/deal-room'); // Redirect to deal room after successful login
    } catch (error) {
      const authError = error as AuthError;
      // Provide user-friendly error messages
      if (authError.code === 'auth/user-not-found' || authError.code === 'auth/wrong-password' || authError.code === 'auth/invalid-credential') {
        setFirebaseError('Invalid email or password. Please try again.');
      } else {
        setFirebaseError('An unexpected error occurred. Please try again.');
      }
      console.error("Login failed:", authError);
      setIsLoading(false);
    }
    // No need to setIsLoading(false) on success because of navigation
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-primary">
            Log in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                type="email"
                autoComplete="email"
                required
                className="input-field rounded-t-md" // Use shared style
                placeholder="Email address"
                {...register("email", { required: "Email is required" })}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                className="input-field rounded-b-md" // Use shared style
                placeholder="Password"
                {...register("password", { required: "Password is required" })}
              />
            </div>
          </div>

          {/* Display form errors */} 
          {(errors.email || errors.password || firebaseError) && (
            <div className="text-red-600 text-sm">
              {errors.email && <p>{errors.email.message}</p>}
              {errors.password && <p>{errors.password.message}</p>}
              {firebaseError && <p>{firebaseError}</p>}
            </div>
          )}

          <div className="flex items-center justify-between">
            {/* Add remember me / forgot password later if needed */}
            <div className="text-sm">
              <Link to="/signup" className="font-medium text-accent hover:text-accent/90">
                Don't have an account? Sign up
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-background bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Logging in...' : 'Log in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 