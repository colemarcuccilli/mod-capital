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
          start: "top 100%",
          end: "bottom -200px", // Delay fade-out by changing from -10px to -200px
          scrub: true,
          onUpdate: (self) => {
            // Ensure the opacity only starts to decrease when the section is leaving the viewport
            if (self.progress > 0.7) { // Changed from 0.5 to 0.7 to delay the fade effect
              const opacity = gsap.utils.clamp(0, 1, gsap.utils.mapRange(0.7, 1, 1, 0, self.progress));
              gsap.to(howItWorksSectionRef.current, {
                opacity,
                duration: 0.1,
                overwrite: true
              });
            } else {
              gsap.to(howItWorksSectionRef.current, {
                opacity: 1,
                duration: 0.1,
                overwrite: true
              });
            }
          }
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
        <HowItWorks />
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