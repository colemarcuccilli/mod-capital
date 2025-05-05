import { create } from 'zustand';

// Define the structure of the initial profile data collected from onboarding
export interface InitialProfile {
  role?: 'Investor / Buyer' | 'Lender / Capital Provider' | 'Agent' | 'Wholesaler' | 'Property Owner / Seller' | 'Other';
  q2Answer?: string; // Store the answer to the second question (Strategy, Funding Type, Has Property Now?, Other Description)
}

interface OnboardingState {
  initialProfile: InitialProfile | null;
  setInitialProfile: (profile: InitialProfile) => void;
  resetInitialProfile: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  initialProfile: null,
  setInitialProfile: (profile) => set({ initialProfile: profile }),
  resetInitialProfile: () => set({ initialProfile: null }),
})); 