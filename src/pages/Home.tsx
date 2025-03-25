import React, { useEffect, useRef } from 'react';
import Hero from '../components/organisms/Hero';
import HowItWorks from '../components/organisms/HowItWorks';
import FundingTypes from '../components/organisms/FundingTypes';
import Testimonials from '../components/organisms/Testimonials';
import FAQs from '../components/organisms/FAQs';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const Home: React.FC = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const howItWorksSectionRef = useRef<HTMLDivElement>(null);
  const fundingTypesSectionRef = useRef<HTMLDivElement>(null);
  const faqsSectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Set up page transitions if needed
    if (pageRef.current) {
      gsap.from(pageRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out"
      });
    }
    
    // Pin sections on desktop for better viewing experience
    const screenWidth = window.innerWidth;
    if (screenWidth >= 768 && howItWorksSectionRef.current && fundingTypesSectionRef.current) {
      // Create a seamless scroll experience between the two sections
      
      ScrollTrigger.create({
        trigger: howItWorksSectionRef.current,
        start: "top 10%",
        endTrigger: fundingTypesSectionRef.current,
        end: "bottom bottom",
        pin: true,
        pinSpacing: false,
        scrub: 0.5,
      });
      
      // Opacity transitions between sections
      gsap.to(howItWorksSectionRef.current, {
        scrollTrigger: {
          trigger: fundingTypesSectionRef.current,
          start: "top 50%",
          end: "top top",
          scrub: true,
        },
        opacity: 0.3,
        y: -30,
      });
      
      gsap.from(fundingTypesSectionRef.current, {
        scrollTrigger: {
          trigger: fundingTypesSectionRef.current,
          start: "top bottom",
          end: "top 50%",
          scrub: true,
        },
        opacity: 0,
        y: 50,
      });
      
      // Smooth transition to FAQs section
      if (faqsSectionRef.current) {
        gsap.from(faqsSectionRef.current, {
          opacity: 0,
          y: 50,
          scrollTrigger: {
            trigger: faqsSectionRef.current,
            start: "top 85%",
            end: "top 50%",
            scrub: 0.5,
          }
        });
      }
    }
    
    return () => {
      // Clean up animations
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
  
  return (
    <div ref={pageRef} className="overflow-hidden">
      <Hero 
        subtitle="Need funding to scale? We make it fast and simple."
        ctaText="View Funding Solutions"
        ctaLink="#funding-types"
      />
      
      <div id="how-it-works" ref={howItWorksSectionRef}>
        <HowItWorks />
      </div>
      
      <div id="funding-types" ref={fundingTypesSectionRef} className="relative z-10">
        <FundingTypes />
      </div>
      
      <div id="faqs" ref={faqsSectionRef} className="relative z-10">
        <FAQs />
      </div>
      
      <Testimonials />
    </div>
  );
};

export default Home; 