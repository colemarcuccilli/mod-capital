import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from '../components/organisms/Hero';
import HowItWorks from '../components/organisms/HowItWorks';
import MoneyMolecule from '../components/organisms/MoneyMolecule';
import FundingTypes from '../components/organisms/FundingTypes';
import Testimonials from '../components/organisms/Testimonials';
import FAQs from '../components/organisms/FAQs';

// Register plugins
gsap.registerPlugin(ScrollTrigger);

const Home: React.FC = () => {
  // Refs for sections
  const howItWorksSectionRef = useRef<HTMLDivElement>(null);
  const fundingTypesSectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Set up page transition
    const ctx = gsap.context(() => {
      // On desktop, create a seamless scroll experience between How It Works and Funding Types
      if (window.innerWidth >= 768) {
        ScrollTrigger.create({
          trigger: howItWorksSectionRef.current,
          start: 'top top',
          endTrigger: fundingTypesSectionRef.current,
          end: 'bottom bottom',
          pin: true,
          pinSpacing: false
        });
      
        // Add opacity transitions between sections
        gsap.to(howItWorksSectionRef.current, {
          opacity: 0,
          scrollTrigger: {
            trigger: fundingTypesSectionRef.current,
            start: 'top 80%',
            end: 'top 30%',
            scrub: true
          }
        });
        
        gsap.from(fundingTypesSectionRef.current, {
          opacity: 0,
          scrollTrigger: {
            trigger: fundingTypesSectionRef.current,
            start: 'top 80%',
            end: 'top 30%',
            scrub: true
          }
        });
      }
    });
    
    return () => ctx.revert();
  }, []);
  
  return (
    <div className="overflow-hidden">
      <Hero 
        subtitle="Swift Funding Solutions for Real Estate Investors" 
        ctaText="Request Funding" 
        ctaLink="#funding-types"
      />
      
      <div ref={howItWorksSectionRef}>
        <MoneyMolecule />
      </div>
      
      <div ref={fundingTypesSectionRef}>
        <FundingTypes />
      </div>
      
      <FAQs />
      
      <Testimonials />
    </div>
  );
};

export default Home; 