import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import Hero from '../components/organisms/Hero';
import HowItWorks from '../components/organisms/HowItWorks';
import FundingTypes from '../components/organisms/FundingTypes';
import ValueProposition from '../components/organisms/ValueProposition';
import Testimonials from '../components/organisms/Testimonials';
import SolutionsOverview from '../components/organisms/SolutionsOverview';
import FAQs from '../components/organisms/FAQs';
// Import the new onboarding manager
import OnboardingFlowManager from '../components/onboarding/OnboardingFlowManager';
import { useOnboardingStore, InitialProfile } from '../store/onboardingStore';
import AnimatedHero from '../components/organisms/AnimatedHero';
import { FiFileText, FiCheckSquare, FiLifeBuoy, FiDollarSign, FiArrowDown, FiPhoneCall, FiUsers, FiSearch, FiShare2, FiLink, FiTarget, FiFilter, FiZap, FiEdit, FiMail, FiThumbsUp, FiEdit3, FiUploadCloud, FiCheckCircle, FiEye, FiHome, FiBarChart2, FiCheck } from 'react-icons/fi';
import IconWrapper from '../components/atoms/IconWrapper';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// Explicitly check paths relative to src/pages/Home.tsx
import WhatWeDo from '../components/organisms/WhatWeDo';
import GetStarted from '../components/organisms/GetStarted';
import { IconType } from 'react-icons';
// Import the modal
import SignupModal from '../components/modals/SignupModal';
// Import UserProfile type needed for state AND firestore function
import { UserProfile, updateUserProfileDetails, BuyBoxDetails, LendingCriteriaDetails, AgentProfileDetails } from '../lib/firebaseFirestore';
import InvestorBuyBoxQuestions from '../components/profiling/InvestorBuyBoxQuestions';
import LenderQuestionsPart1 from '../components/profiling/LenderQuestionsPart1';
import LenderQuestionsPart2 from '../components/profiling/LenderQuestionsPart2';
import LenderQuestionsPart3 from '../components/profiling/LenderQuestionsPart3';
import InvestorPostSignupModal from '../components/modals/InvestorPostSignupModal';
import LenderPostSignupModal from '../components/modals/LenderPostSignupModal';

// Register plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Define structures used by personalized components
// HowItWorks Step structure (already defined in HowItWorks.tsx, copy here for typing)
interface HowItWorksStep {
  icon: React.ReactNode;
  title: string;
  description: string;
}

// Add ValueItem interface definition back
interface ValueItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

// Define SolutionsContent structure expected by the SolutionsOverview component prop
interface SolutionsContent {
  heading: string; 
  items: SolutionDetail[]; 
  ctaText?: string; 
  ctaAction?: string; 
}
// Use string for icon name in SolutionDetail
interface SolutionDetail { title: string; description: string; icon?: string; }

// Updated Type definition for personalization details
interface PersonalizationDetails {
  // Hero
  heroScrollingPhrases: string[];
  heroCtaText: string;
  heroCtaActionIntent: string;
  // What We Do
  whatWeDoContent: WhatWeDoContent;
  // How It Works
  howItWorksTitle: string;
  howItWorksSteps: HowItWorksStep[];
  howItWorksCtaText?: string; // Optional CTA within section
  howItWorksCtaActionIntent?: string;
  // Value Proposition
  valuePropTitle: string;
  valuePropItems: ValueItem[];
  // Solutions/Opportunities
  solutionsOverviewContent: SolutionsContent;
  // Testimonials
  testimonials: TestimonialItem[];
  // FAQs
  faqs: FAQItem[];
  // Get Started
  getStartedContent: GetStartedContent;
  // Navigation (Future)
  // navEmphasis?: string[];
}

// --- Type Definitions (Expanded) ---

interface TestimonialItem { quote: string; name: string; role: string; image?: string; }
interface FAQItem { question: string; answer: string; }
interface WhatWeDoContent { heading: string; content: string; visual?: string; }
interface GetStartedContent { heading: string; content: string; primaryCtaText: string; primaryCtaActionIntent: string; secondaryCtaText?: string; secondaryCtaLink?: string; }

// --- Icon Helpers (Return ReactNode using IconWrapper) ---
const createIcon = (iconName: string, className: string = "text-accent dark:text-accent-light") => {
  // Return the IconWrapper component directly
  return <IconWrapper name={iconName} size={40} className={className} />;
};
const createHiwIcon = (iconName: string, className: string = "text-white dark:text-gray-900") => {
  // Return the IconWrapper component directly
  return <IconWrapper name={iconName} size={24} className={className} />;
};

// --- Default Content Definitions (Use string names for icons) ---
const defaultWhatWeDo: WhatWeDoContent = {
    heading: "Connecting Real Estate Capital & Opportunity",
    content: "Domentra acts as a central hub, facilitating connections between investors, lenders, agents, and wholesalers to streamline real estate transactions.",
    visual: "default"
};

const defaultHowItWorksSteps: HowItWorksStep[] = [
    // Pass string names to helpers
    { icon: createHiwIcon('FiSearch'), title: "Explore", description: "Discover opportunities..." },
    { icon: createHiwIcon('FiShare2'), title: "Engage", description: "Interact or define criteria..." },
    { icon: createHiwIcon('FiLink'), title: "Connect", description: "Domentra facilitates connections..." },
    { icon: createHiwIcon('FiCheckSquare'), title: "Transact", description: "Close deals efficiently..." },
];

const defaultHowItWorks: { title: string; steps: HowItWorksStep[] } = {
    title: "How <span class='text-accent'>Domentra</span> Works",
    steps: defaultHowItWorksSteps
};

const defaultValuePropItems: ValueItem[] = [
    // Pass string names to helpers
    { icon: createIcon('FiUsers'), title: "Curated Network", description: "Access vetted professionals..." },
    { icon: createIcon('FiBarChart2'), title: "Efficient Process", description: "Streamlined workflows..." },
    { icon: createIcon('FiCheck'), title: "Targeted Connections", description: "Connect with the right people..." },
];

const defaultValueProp: { title: string; items: ValueItem[] } = {
    title: "Why Choose <span class='text-accent'>Domentra</span>?",
    items: defaultValuePropItems
};

// Update defaultSolutions items to store icon name STRING
const defaultSolutions: SolutionsContent = {
    heading: "Diverse Opportunities & Solutions",
    items: [
        { title: "Deal Sourcing", description: "Find off-market investment opportunities.", icon: 'FiTarget' },
        { title: "Funding Access", description: "Connect with various capital types (EMD, Gap, Private Money).", icon: 'FiDollarSign' },
        { title: "Deal Placement", description: "Present your deals to vetted buyers and lenders.", icon: 'FiShare2' },
    ],
    ctaText: "Learn More",
    ctaAction: '/info/how-it-works'
};

const defaultTestimonials: TestimonialItem[] = [
    { quote: "Domentra streamlined the funding process for my flip. Highly recommend!", name: "Jane D.", role: "Investor" },
    { quote: "Found a great off-market deal perfectly matching my criteria.", name: "Mark S.", role: "Investor" },
    { quote: "The platform connected me with a reliable lender quickly.", name: "Carlos R.", role: "Wholesaler" },
];

const defaultFaqs: FAQItem[] = [
    { question: "How does Domentra make money?", answer: "Domentra primarily charges matchmaking fees upon successful connection or closing, ensuring alignment with user success." },
    { question: "Is my information secure?", answer: "Yes, we prioritize data security using industry best practices to protect your information." },
    { question: "How do I get verified?", answer: "After signup, our admin team will review your profile and may reach out for verification details to ensure network quality." },
    { question: "Can I be both an Investor and a Lender?", answer: "Currently, profiles are role-specific. Please contact support if you operate in multiple capacities." },
];

const defaultGetStarted: GetStartedContent = {
    heading: "Ready to Connect?",
    content: "Join the Domentra network to access curated opportunities and streamline your real estate transactions.",
    primaryCtaText: "Sign Up Now",
    primaryCtaActionIntent: "triggerFlow:signup",
    secondaryCtaText: "Contact Us",
    secondaryCtaLink: "/contact"
};

// --- Personalization Mapping Function ---
const getPersonalization = (profile: InitialProfile | null): PersonalizationDetails => {
    // Start with ALL defaults (including icons)
    let details: PersonalizationDetails = {
        heroScrollingPhrases: ["Real Estate Deals", "Simplified Funding", "Connect & Grow"],
        heroCtaText: "Learn More",
        heroCtaActionIntent: 'navigate:/info/how-it-works',
        whatWeDoContent: { ...defaultWhatWeDo },
        howItWorksTitle: defaultHowItWorks.title,
        howItWorksSteps: defaultHowItWorks.steps.map(step => ({...step})), // Shallow copy needed?
        valuePropTitle: defaultValueProp.title,
        valuePropItems: defaultValueProp.items.map(item => ({...item})),
        solutionsOverviewContent: { 
            ...defaultSolutions, 
            items: defaultSolutions.items.map(item => ({...item})) // Shallow copy items
        },
        testimonials: defaultTestimonials.map(t => ({...t})),
        faqs: defaultFaqs.map(f => ({...f})),
        getStartedContent: { ...defaultGetStarted }
    };

    if (!profile || !profile.role) {
         return details; // Return defaults if no profile
    }
    const { role, q2Answer } = profile;

    // --- Role-Specific Overrides (Directly assign new objects/arrays with icons) ---
    if (role === 'Investor / Buyer') {
        details.whatWeDoContent = { heading: "How Domentra Works for Investors", content: "We source and curate off-market deals and funding options, presenting you with opportunities that match your criteria. We handle the initial vetting and facilitate connections.", visual: "investor" };
        details.howItWorksTitle = "Your <span class='text-accent'>Investor</span> Process";
        details.howItWorksSteps = [
            { icon: createHiwIcon('FiEdit'), title: "Define Criteria", description: "Complete your profile & buy box." },
            { icon: createHiwIcon('FiEye'), title: "Browse / Match", description: "Review deals presented by Domentra." },
            { icon: createHiwIcon('FiThumbsUp'), title: "Express Interest", description: "Indicate interest in specific deals." },
            { icon: createHiwIcon('FiLink'), title: "Get Connected", description: "Domentra facilitates the next steps." },
        ];
        details.howItWorksCtaText = "Define Your Criteria";
        details.howItWorksCtaActionIntent = "triggerFlow:deepProfile-investor"; 
        details.valuePropTitle = "Domentra <span class='text-accent'>Investor</span> Advantages";
        details.valuePropItems = [
            { icon: createIcon('FiTarget'), title: "Off-Market Deals", description: "Access curated opportunities not on the open market." },
            { icon: createIcon('FiFilter'), title: "Vetted Opportunities", description: "Deals aligned with your specified buy box criteria." },
            { icon: createIcon('FiDollarSign'), title: "Efficient Funding", description: "Streamlined access to relevant capital partners." },
        ];
        details.solutionsOverviewContent = {
            heading: "Funding & Deal Types",
            items: [
                { title: "Double Close", description: "Seamless funding.", icon: 'FiUsers' }, 
                { title: "EMD Funding", description: "Secure deals.", icon: 'FiDollarSign' },
                { title: "Gap Funding", description: "Bridge financing gaps.", icon: 'FiLink' },
                { title: "Private Money", description: "Access private capital.", icon: 'FiUsers' },
                { title: "Fix & Flip Deals", description: "Find rehab projects.", icon: 'FiTarget' },
            ],
            ctaText: "Request Funding Now",
            ctaAction: 'triggerFlow:requestFunding'
        };
        details.testimonials = defaultTestimonials.filter(t => t.role === 'Investor').slice(0, 2);
        details.faqs = [
             { question: "How are deals matched to me?", answer: "Matching is based on the detailed Buy Box criteria you provide in your profile compared against deal submissions." },
             { question: "What funding types do you offer?", answer: "We facilitate connections for various types, including Double Close, EMD, Gap Funding, and Private Money Loans. Specify your needs in your profile or request." },
             { question: "What are the fees for investors?", answer: "Fees are typically structured as success-based charges upon closing. Specifics depend on the deal and funding type." },
        ];
        details.getStartedContent = {
            heading: "Ready to Find Your Next Deal?",
            content: "Complete your investor profile to start receiving matched deals and funding opportunities.",
            primaryCtaText: "Complete Investor Profile",
            primaryCtaActionIntent: "triggerFlow:deepProfile-investor",
            secondaryCtaText: "View Funding Types",
            secondaryCtaLink: "#funding-types"
        };
         switch (q2Answer) {
            case 'Fix & Flip':
            details.heroScrollingPhrases = ["Find Fix & Flip Deals", "Fast Funding for Flips", "Domentra Investor Network", "Maximize Rehab ROI"];
            details.heroCtaText = "Find Fix & Flip Deals";
            details.heroCtaActionIntent = "triggerFlow:deepProfile-investor";
            break;
          case 'Buy & Hold':
            details.heroScrollingPhrases = ["Secure Property Allowance", "Long-Term Funding", "Build Passive Income", "Buy & Hold Financing Solutions"];
            details.heroCtaText = "Find Buy & Hold Deals";
            details.heroCtaActionIntent = "triggerFlow:deepProfile-investor";
            break;
          case 'BRRRR':
            details.heroScrollingPhrases = ["Fund Your BRRRR Strategy", "Rehab & Refinance Funding", "Build Rental Portfolios", "BRRRR with Domentra"];
            details.heroCtaText = "Explore BRRRR Funding";
            details.heroCtaActionIntent = "triggerFlow:requestFunding";
            break;
          default: // Includes 'Other'
            details.heroScrollingPhrases = ["Explore Investor Opportunities", "Custom Funding Solutions", "Domentra for Investors", "Your Strategy, Our Support"];
            details.heroCtaText = "Complete Investor Profile";
            details.heroCtaActionIntent = "triggerFlow:deepProfile-investor";
            break;
        }
    }
    else if (role === 'Lender / Capital Provider') {
        details.whatWeDoContent = { heading: "Our Model for Capital Providers", content: "We connect you with vetted funding requests from qualified borrowers. We present opportunities matching your specific lending criteria, saving you time and sourcing efforts.", visual: "lender" };
        details.howItWorksTitle = "Your <span class='text-accent'>Lending</span> Process";
        details.howItWorksSteps = [
            { icon: createHiwIcon('FiEdit3'), title: "Define Criteria", description: "Specify your lending parameters in your profile." },
            { icon: createHiwIcon('FiMail'), title: "Receive Deals", description: "Get notified about vetted deals matching your box." },
            { icon: createHiwIcon('FiThumbsUp'), title: "Express Interest", description: "Indicate interest through the platform." },
            { icon: createHiwIcon('FiLink'), title: "Get Connected & Fund", description: "Domentra facilitates connection to finalize funding." },
        ];
        details.howItWorksCtaText = "Define Your Criteria";
        details.howItWorksCtaActionIntent = "triggerFlow:deepProfile-lender";
        details.valuePropTitle = "Domentra <span class='text-accent'>Lender</span> Advantages";
        details.valuePropItems = [
            { icon: createIcon('FiFilter'), title: "Qualified Borrowers", description: "Connect with vetted investors seeking funding now." },
            { icon: createIcon('FiTarget'), title: "Curated Deal Flow", description: "Receive opportunities matching your exact criteria." },
            { icon: createIcon('FiZap'), title: "Efficient Deployment", description: "Save time sourcing and focus on funding quality deals." },
        ];
        details.solutionsOverviewContent = {
            heading: "Targeted Funding Opportunities",
            items: [
                 { title: "Rehab Loans", description: "Fund fix-and-flip projects.", icon: 'FiDollarSign' },
                 { title: "Acquisition Funding", description: "Provide capital for purchases.", icon: 'FiTarget' },
                 { title: "Bridge Loans", description: "Offer short-term solutions.", icon: 'FiLink' },
                 { title: "New Construction", description: "Finance development projects.", icon: 'FiCheckSquare' }
            ],
            ctaText: "Define Your Lending Criteria",
            ctaAction: 'triggerFlow:deepProfile-lender'
        };
         details.testimonials = defaultTestimonials.filter(t => t.role === 'Lender' || t.role === 'Capital Provider').slice(0, 2);
        details.faqs = [
            { question: "How are borrowers vetted?", answer: "Domentra performs initial screening based on submitted information and criteria. Lenders perform their own final due diligence." },
            { question: "How do I define my lending criteria?", answer: "You can specify property types, loan amounts, LTV ratios, geographic areas, and more in your lender profile." },
            { question: "What fees are involved for lenders?", answer: "Domentra may charge a finder's fee upon successful funding of a presented deal. Terms are outlined in the partnership agreement." },
        ];
        details.getStartedContent = {
            heading: "Ready to Fund Your Next Deal?",
            content: "Complete your lender profile to start receiving curated funding requests that match your criteria.",
            primaryCtaText: "Become a Domentra Lender",
            primaryCtaActionIntent: "triggerFlow:deepProfile-lender",
             secondaryCtaText: "How Lending Works",
             secondaryCtaLink: "#how-it-works"
        };

        switch (q2Answer) {
           case 'Hard Money':
            details.heroScrollingPhrases = ["Fund Hard Money Deals", "Connect with Active Borrowers", "Fast Closings", "Hard Money Opportunities"];
            details.heroCtaText = "Define Your Hard Money Criteria";
            details.heroCtaActionIntent = "triggerFlow:deepProfile-lender";
            break;
          case 'Private Money':
            details.heroScrollingPhrases = ["Fund Private Money Deals", "Connect with Borrowers", "Passive Income Opportunities", "Private Lending on Domentra"];
            details.heroCtaText = "Define Your Private Money Criteria";
            details.heroCtaActionIntent = "triggerFlow:deepProfile-lender";
            break;
          case 'Equity':
            details.heroScrollingPhrases = ["Invest in Real Estate Projects", "Connect with Developers", "Grow Your Portfolio", "Equity Opportunities on Domentra"];
            details.heroCtaText = "Define Your Investment Criteria";
            details.heroCtaActionIntent = "triggerFlow:deepProfile-lender";
            break;
          default: // Includes 'Other'
            details.heroScrollingPhrases = ["Alternative Capital Opportunities", "Lend Your Way", "Domentra for Capital Providers", "Fund Your Niche"];
            details.heroCtaText = "Define Your Lending Focus";
            details.heroCtaActionIntent = "triggerFlow:deepProfile-lender";
            break;
        }
    }
    else if (['Agent', 'Wholesaler', 'Property Owner / Seller'].includes(role)) {
         details.whatWeDoContent = { heading: "Partnering with Deal Sources", content: "Submit your property or contract to Domentra. We review and present your deal directly to our network of qualified, motivated buyers and investors.", visual: "agent" };
        details.howItWorksTitle = "Your <span class='text-accent'>Deal Submission</span> Process";
        details.howItWorksSteps = [
            { icon: createHiwIcon('FiUploadCloud'), title: "Submit Deal", description: "Provide property/contract details via our form." },
            { icon: createHiwIcon('FiCheckCircle'), title: "Domentra Review", description: "We verify info and assess market fit." },
            { icon: createHiwIcon('FiUsers'), title: "Buyer Matching", description: "We present your deal to relevant buyers." },
            { icon: createHiwIcon('FiDollarSign'), title: "Get It Closed", description: "Receive offers and facilitate closing." },
        ];
        details.howItWorksCtaText = "Submit Your Deal Now";
        details.howItWorksCtaActionIntent = "triggerFlow:submitDeal";
        details.valuePropTitle = "Domentra <span class='text-accent'>Deal Source</span> Advantages";
        details.valuePropItems = [
            { icon: createIcon('FiUsers'), title: "Access Qualified Buyers", description: "Connect with verified investors actively seeking deals." },
            { icon: createIcon('FiZap'), title: "Efficient Placement", description: "Let Domentra handle presenting your deal to the right audience." },
            { icon: createIcon('FiCheck'), title: "Streamlined Closing", description: "Facilitate faster closings through our network." },
        ];
        details.solutionsOverviewContent = {
            heading: "Showcase Your Deals",
            items: [
                { title: "Wholesale Contracts", description: "Find cash buyers...", icon: 'FiFileText' },
                { title: "Fix & Flips", description: "Connect with investors...", icon: 'FiTarget' },
                { title: "Rental Properties", description: "Source buyers...", icon: 'FiHome' },
                { title: "Development Projects", description: "Present land deals...", icon: 'FiCheckSquare' },
            ],
            ctaText: "Submit Your Property",
            ctaAction: 'triggerFlow:submitDeal'
        };
         details.testimonials = defaultTestimonials.filter(t => t.role !== 'Investor' && t.role !== 'Lender').slice(0, 2);
        details.faqs = [
            { question: "Who sees my submitted deal?", answer: "Deals are reviewed internally and presented only to matched, verified buyers/investors within the Domentra network based on their criteria." },
            { question: "What types of deals can I submit?", answer: "We accept various residential and commercial properties, including wholesale contracts, fix & flips, rentals, and development opportunities." },
            { question: "What are the fees for submitting a deal?", answer: "Domentra typically charges a success-based fee upon the successful closing or funding of a deal sourced through the platform." },
        ];
        details.getStartedContent = {
            heading: "Ready to Submit Your Deal?",
            content: "Sign up and submit your property or contract details to connect with buyers and investors quickly.",
            primaryCtaText: "Submit Your Property Now",
            primaryCtaActionIntent: "triggerFlow:submitDeal",
            secondaryCtaText: "Learn How it Works",
            secondaryCtaLink: "#how-it-works"
        };

        if (q2Answer === 'Yes') {
             details.heroScrollingPhrases = ["Submit Your Property", "Access Qualified Buyers", "Fast Deal Review", "Sell with Domentra"];
            details.heroCtaText = "Submit Your Property Now";
            details.heroCtaActionIntent = "triggerFlow:submitDeal";
        } else { // No
             details.heroScrollingPhrases = ["Partner with Domentra", "Learn About Our Buyers", "Submit Future Deals", "Grow Your Network"];
            details.heroCtaText = "Learn How to Submit Deals";
            details.heroCtaActionIntent = "navigate:/info/how-to-submit";
            details.getStartedContent.heading = "Ready to Partner?";
            details.getStartedContent.content = "Learn more about how Domentra connects deal sources with capital, and sign up to submit future deals.";
            details.getStartedContent.primaryCtaText = "Learn How to Submit";
            details.getStartedContent.primaryCtaActionIntent = "navigate:/info/how-to-submit";
           details.valuePropTitle = defaultValueProp.title;
           details.valuePropItems = defaultValueProp.items.map(item => ({...item})); // Use default items (already have ReactNodes)
        }
    }
    else if (role === 'Other') {
       details.heroScrollingPhrases = ["Explore Domentra Opportunities", "Connect in Real Estate", "Find Your Place on Domentra", "Real Estate, Simplified"];
       details.heroCtaText = "Explore Domentra";
       details.heroCtaActionIntent = "navigate:/info/how-it-works"; 
    }

    return details;
};

const Home: React.FC = () => {
    // --- States and Refs ---
    const [showOnboardingOverlay, setShowOnboardingOverlay] = useState(true);
    const [isInitialOverlayVisible, setIsInitialOverlayVisible] = useState(false);
    const { initialProfile } = useOnboardingStore();
    const [personalization, setPersonalization] = useState<PersonalizationDetails | null>(null);
    const onboardingContainerRef = React.useRef<HTMLDivElement>(null);
    const homeContentRef = useRef<HTMLDivElement>(null);
    const whatWeDoSectionRef = useRef<HTMLDivElement>(null);
    const howItWorksSectionRef = useRef<HTMLDivElement>(null);
    const valuePropSectionRef = useRef<HTMLDivElement>(null);
    const solutionsOverviewSectionRef = useRef<HTMLDivElement>(null);
    const testimonialsSectionRef = useRef<HTMLDivElement>(null);
    const faqsSectionRef = useRef<HTMLDivElement>(null);
    const getStartedSectionRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { currentUser, loading: authLoading, currentUserProfile } = useAuth();
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [modalIntent, setModalIntent] = useState<any | null>(null);
    const [isSavingProfile, setIsSavingProfile] = useState(false);

    // --- Handlers ---
    const openModal = (modalName: string, initialIntentData: any = {}) => {
        console.log(`Opening modal: ${modalName}, Intent:`, initialIntentData);
        setModalIntent(initialIntentData);
        setActiveModal(modalName);
    };
    const closeModal = () => {
        console.log("Closing modal");
        setActiveModal(null);
        setModalIntent(null);
    };

    const handleCtaClick = (actionIntent: string | undefined) => {
        if (!actionIntent) return;
        const [actionType, target] = actionIntent.split(':');
        const requiresAuth = 
            actionType === 'triggerFlow' ||
            (actionType === 'navigate' && 
             (target === '/profile' || target === '/deal-room' || target === '/submit-deal')
            );

        if (requiresAuth && !authLoading && !currentUser) {
            console.log("Auth required, opening SIGNUP modal.");
            const roleKey = personalization?.whatWeDoContent?.visual;
            const preSelectedRole = roleKey === 'investor' ? 'investor' : 
                                  roleKey === 'lender' ? 'lender' :
                                  roleKey === 'agent' ? 'agent' : 
                                  initialProfile?.role || undefined;
            openModal('signup', { 
                actionIntent, 
                preSelectedRole, 
                initialQ2Answer: initialProfile?.q2Answer 
            });
            return; 
        }
        
        if (actionType === 'navigate') {
            if (target.startsWith('#')) {
                const element = document.getElementById(target.substring(1));
                if (element) {
                    const headerOffset = 70; 
                    gsap.to(window, { duration: 1, scrollTo: { y: element, offsetY: headerOffset }, ease: 'power3.inOut' });
                }
            } else {
                navigate(target);
            }
        } else if (actionType === 'triggerFlow') {
            console.log("Triggering flow for authenticated user:", target);
            const userRole = currentUserProfile?.role; 
            if (!userRole) {
                 console.error("Cannot trigger flow: User role not loaded.");
                 alert("Please wait for your profile to load or try logging in again.");
                 return;
            }
            let modalName: string | null = null;
            if (target === 'deepProfile-investor' && userRole === 'investor') modalName = 'postSignupInvestor';
            else if (target === 'deepProfile-lender' && userRole === 'lender') modalName = 'postSignupLender';
            else if (target === 'submitDeal') modalName = 'submitDeal';
            else if (target === 'requestFunding') modalName = 'requestFunding';
            else if (target === 'signup') modalName = 'signup';
            
            if (modalName) {
                console.log(`Opening modal '${modalName}' for flow '${target}'`);
                openModal(modalName, { triggerFlow: target, role: userRole }); 
            } else {
                 alert(`Flow '${target}' is not applicable for your role (${userRole}) or not implemented yet.`);
            }
        } else {
            console.warn("Unknown CTA action type:", actionType);
        }
    };

    const handleOnboardingOverlayComplete = () => { setShowOnboardingOverlay(false); };

     const handleSignupSuccess = (confirmedRole: UserProfile['role']) => {
         closeModal();
         console.log('[handleSignupSuccess] Signup success, opening post-signup flow for role:', confirmedRole);
         const modalName = `postSignup${confirmedRole.charAt(0).toUpperCase() + confirmedRole.slice(1)}`;
         openModal(modalName, { role: confirmedRole }); 
     };

     const handlePostSignupSave = async (finalData: any, role: UserProfile['role']) => {
        if (!currentUser?.uid) return false; 
        console.log("Post-signup flow SAVE. Role:", role, "Data:", finalData);
        setIsSavingProfile(true);
        
        let updatePayload: Partial<UserProfile> = {};
        if (role === 'investor') updatePayload.buyBox = finalData;
        else if (role === 'lender') updatePayload.lendingCriteria = finalData;
        else if (['agent', 'wholesaler', 'owner'].includes(role || '')) updatePayload.agentProfile = finalData;

        const success = await updateUserProfileDetails(currentUser.uid, updatePayload);
        setIsSavingProfile(false);
        closeModal(); 

        if (success) {
            console.log("PostSignupFlow: Profile details saved.");
            navigate('/profile'); 
        } else {
            console.error("PostSignupFlow: Failed to save profile details.");
            alert("Failed to save profile details. Please try again later.");
        }
        return success;
     };

    // --- Effects ---
    useEffect(() => {
        if (!showOnboardingOverlay || authLoading || currentUser) return;
        const timer = setTimeout(() => {
            setIsInitialOverlayVisible(true);
            if (onboardingContainerRef.current) {
                gsap.set(onboardingContainerRef.current, { display: 'flex', opacity: 0 });
                gsap.to(onboardingContainerRef.current, { opacity: 1, duration: 0.7, ease: 'power2.out' });
            }
        }, 5000); 
        return () => clearTimeout(timer);
    }, [showOnboardingOverlay, authLoading, currentUser]);

    useEffect(() => {
        if (authLoading) return; 
        let sourceProfile: InitialProfile | null = null;
        if (initialProfile) { 
            sourceProfile = initialProfile;
        } else if (currentUserProfile) { 
             sourceProfile = {
                 role: currentUserProfile.role as InitialProfile['role'], 
                 q2Answer: undefined 
             };
        }
        const details = getPersonalization(sourceProfile);
        setPersonalization(details);
    }, [authLoading, currentUserProfile, initialProfile]); 

  return (
    <div className="relative">
      {/* Initial Onboarding Q&A Overlay */} 
       {showOnboardingOverlay && !currentUser && (
        <div
          ref={onboardingContainerRef}
          className="fixed inset-0 z-[70] bg-black bg-opacity-70 flex items-center justify-center backdrop-blur-sm"
          style={{ display: isInitialOverlayVisible ? 'flex' : 'none', opacity: 0 }}
        >
          <OnboardingFlowManager 
              flowType="initial" 
              onComplete={handleOnboardingOverlayComplete} 
           />
        </div>
      )}

      {/* SIGNUP MODAL - Render based on local state */}
       <SignupModal 
            isOpen={activeModal === 'signup'}
            onClose={closeModal}
            initialRole={modalIntent?.preSelectedRole}
            initialQ2Answer={modalIntent?.initialQ2Answer}
            intendedAction={modalIntent?.actionIntent}
            onSignupSuccess={handleSignupSuccess}
       />

      {/* Render Hero */} 
      {(!showOnboardingOverlay || personalization) && (
        <div className="hero-section-identifier">
            {personalization ? (
                <Hero
                scrollingPhrases={personalization.heroScrollingPhrases}
                subtitle="" 
                ctaText={personalization.heroCtaText}
                onCtaClick={() => handleCtaClick(personalization.heroCtaActionIntent)}
                ctaLink="#"
                />
            ) : (
                 <AnimatedHero /> 
            )}
        </div>
      )}

      {/* Render other sections when personalization is ready */} 
      {personalization && (
          <div ref={homeContentRef} className="relative z-[1]">
            <div ref={whatWeDoSectionRef} >
                <WhatWeDo content={personalization.whatWeDoContent} />
            </div>
            <div ref={howItWorksSectionRef} >
              <HowItWorks
                title={personalization.howItWorksTitle}
                steps={personalization.howItWorksSteps}
                ctaText={personalization.howItWorksCtaText}
                onCtaClick={() => handleCtaClick(personalization.howItWorksCtaActionIntent)}
              />
            </div>
            <div ref={valuePropSectionRef} >
              <ValueProposition 
                 title={personalization.valuePropTitle}
                 propositions={personalization.valuePropItems}
              />
            </div>
            <div ref={solutionsOverviewSectionRef} >
              <SolutionsOverview 
                 content={personalization.solutionsOverviewContent}
              /> 
            </div>
            {/* FundingTypes is static, render it regardless of personalization? Or hide initially? */}
            {/* Let's assume it should show once personalization is ready */}
            <FundingTypes /> 
            <div ref={testimonialsSectionRef} >
                <Testimonials testimonials={personalization.testimonials} />
            </div>
            <div ref={faqsSectionRef} >
                <FAQs faqs={personalization.faqs} />
            </div>
             <div ref={getStartedSectionRef} >
                <GetStarted 
                    content={personalization.getStartedContent} 
                    onPrimaryCtaClick={() => handleCtaClick(personalization.getStartedContent.primaryCtaActionIntent)}
                />
            </div>
          </div>
      )}

      {/* Post-Signup Modals */}
      <InvestorPostSignupModal 
          isOpen={activeModal === 'postSignupInvestor'}
          onClose={closeModal}
          onCompleteFlow={(data) => handlePostSignupSave(data, 'investor')}
      />
      <LenderPostSignupModal 
          isOpen={activeModal === 'postSignupLender'}
          onClose={closeModal}
          onCompleteFlow={(data) => handlePostSignupSave(data, 'lender')}
          initialData={modalIntent} 
      />
    </div>
  );
};

export default Home; 