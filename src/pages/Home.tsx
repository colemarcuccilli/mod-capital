import React, { useEffect, useRef } from 'react';
import Hero from '../components/organisms/Hero';
import ValueProposition from '../components/organisms/ValueProposition';
import HowItWorks from '../components/organisms/HowItWorks';
import FundingTypes from '../components/organisms/FundingTypes';
import Testimonials from '../components/organisms/Testimonials';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Sample hero background image (you'll need to add a real image to your assets folder)
// import heroBg from '../assets/hero-bg.jpg';

const Home: React.FC = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Set up page transitions if needed
    if (pageRef.current) {
      gsap.from(pageRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out"
      });
    }
    
    return () => {
      // Clean up animations
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
  
  return (
    <div ref={pageRef}>
      <Hero 
        title="Connecting Real Estate Investors with Private Lenders"
        subtitle="Get your deals funded faster and more securely with our creative financing solutions."
        ctaText="Find Funding Now"
        ctaLink="#funding-types"
        backgroundImage="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1673&q=80"
      />
      
      <ValueProposition />
      
      <HowItWorks />
      
      <div id="funding-types">
        <FundingTypes />
      </div>
      
      <Testimonials />
    </div>
  );
};

export default Home; 