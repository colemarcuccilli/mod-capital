import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import DoubleClose from './pages/DoubleClose';
import EMD from './pages/EMD';
import Gap from './pages/Gap';
import PrivateMoney from './pages/PrivateMoney';
import Contact from './pages/Contact';
import ScrollToTop from './utils/ScrollToTop';
import IntroAnimation from './components/organisms/IntroAnimation';
import ThankYou from './pages/ThankYou';
import Login from './pages/login';
import Signup from './pages/signup';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { AuthProvider } from './context/AuthContext';
import DealRoom from './pages/DealRoom';
import SubmitDeal from './pages/SubmitDeal';
import Profile from './pages/Profile';
import SubmitDealPage from './pages/SubmitDealPage';
import ProtectedRoute from './components/atoms/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import AdminDealQueuePage from './pages/AdminDealQueuePage';
import AdminDealReviewPage from './pages/AdminDealReviewPage';
import AdminRoute from './components/atoms/AdminRoute';
import MyDealsPage from './pages/MyDealsPage';
import FundedDealsPage from './pages/FundedDealsPage';
import DocumentCenterPage from './pages/DocumentCenterPage';
import NegotiationsPage from './pages/NegotiationsPage';
import NegotiationHubPage from './pages/NegotiationHubPage';
import NegotiationDetailPage from './pages/NegotiationDetailPage';

// Register GSAP plugins globally
gsap.registerPlugin(
  ScrollTrigger,
  ScrollToPlugin
);

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [appLoaded, setAppLoaded] = useState(false);

  useEffect(() => {
    // Set default GSAP settings
    gsap.defaults({
      ease: 'power3.out',
      duration: 1
    });
    
    // Enable ScrollTrigger on mobile (it's disabled by default)
    ScrollTrigger.config({
      ignoreMobileResize: true
    });

    // Set app as loaded
    setAppLoaded(true);
    
    return () => {
      // Clean up all GSAP animations on unmount
      const allAnimations = gsap.globalTimeline.getChildren();
      allAnimations.forEach(animation => animation.kill());
      
      // Kill all ScrollTriggers
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
  
  const handleIntroComplete = () => {
    setShowIntro(false);
  };
  
  return (
    <>
      {/* Show intro animation on initial page load */}
      {appLoaded && showIntro && (
        <IntroAnimation onComplete={handleIntroComplete} />
      )}
      
      {/* Wrap the entire Router/App with AuthProvider */}
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <MainLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/double-close" element={<DoubleClose />} />
              <Route path="/emd" element={<EMD />} />
              <Route path="/gap" element={<Gap />} />
              <Route path="/private-money" element={<PrivateMoney />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/thank-you" element={<ThankYou />} />
              
              {/* User Protected Routes */}
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/deal-room" element={<ProtectedRoute><DealRoom /></ProtectedRoute>} />
              <Route path="/submit-deal" element={<ProtectedRoute><SubmitDealPage /></ProtectedRoute>} />
              <Route path="/my-deals" element={<ProtectedRoute><MyDealsPage /></ProtectedRoute>} />
              <Route path="/funded-deals" element={<ProtectedRoute><FundedDealsPage /></ProtectedRoute>} />
              <Route path="/document-center" element={<ProtectedRoute><DocumentCenterPage /></ProtectedRoute>} />
              <Route path="/negotiations" element={<ProtectedRoute><NegotiationsPage /></ProtectedRoute>} />
              <Route path="/negotiation-hub" element={<ProtectedRoute><NegotiationHubPage /></ProtectedRoute>} />
              <Route path="/negotiations/:negotiationId" element={<ProtectedRoute><NegotiationDetailPage /></ProtectedRoute>} />
              
              {/* Admin Protected Routes */}
              <Route path="/admin/review" element={<AdminRoute><AdminDealQueuePage /></AdminRoute>} />
              <Route path="/admin/review/:dealId" element={<AdminRoute><AdminDealReviewPage /></AdminRoute>} />
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              
              {/* Additional pages */}
              {/* <Route path="/blog" element={<Blog />} /> */}
              
              {/* 404 Page */}
              {/* <Route path="*" element={<NotFound />} /> */}
            </Routes>
          </MainLayout>
        </Router>
      </AuthProvider>
    </>
  );
};

export default App;
