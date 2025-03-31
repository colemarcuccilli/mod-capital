import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import DoubleClose from './pages/DoubleClose';
import EMD from './pages/EMD';
import Gap from './pages/Gap';
import PrivateMoney from './pages/PrivateMoney';
import Contact from './pages/Contact';
import ScrollToTop from './utils/ScrollToTop';
import IntroAnimation from './components/organisms/IntroAnimation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

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
      
      <Router>
        <ScrollToTop />
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/double-close" element={<DoubleClose />} />
            <Route path="/emd" element={<EMD />} />
            <Route path="/gap" element={<Gap />} />
            <Route path="/private-money" element={<PrivateMoney />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Additional pages */}
            {/* <Route path="/blog" element={<Blog />} /> */}
            
            {/* 404 Page */}
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </MainLayout>
      </Router>
    </>
  );
};

export default App;
