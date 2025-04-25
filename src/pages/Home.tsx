import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import Hero from '../components/organisms/Hero';
import HowItWorks from '../components/organisms/HowItWorks';
import FundingTypes from '../components/organisms/FundingTypes';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Testimonials from '../components/organisms/Testimonials';
import FAQs from '../components/organisms/FAQs';
// Firebase Imports removed
// import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"; 
// import { db } from '../lib/firebaseConfig';

// Register plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const Home: React.FC = () => {
  // Refs for sections
  const howItWorksSectionRef = useRef<HTMLDivElement>(null);
  const fundingTypesSectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // --- TEMPORARY FIRESTORE WRITE/READ TEST REMOVED --- 
    
    // Set up simple scroll snap without excessive resistance
    const ctx = gsap.context(() => {
      // Track scroll direction
      let lastScrollY = window.scrollY;
      let scrollDirection = 0;
      let isSnapping = false;
      
      const scrollHandler = () => {
        if (!isSnapping) {
          scrollDirection = window.scrollY > lastScrollY ? 1 : -1;
          lastScrollY = window.scrollY;
        }
      };
      
      window.addEventListener('scroll', scrollHandler);
      
      // Create animated entrance for each section
      const sections = [howItWorksSectionRef.current, fundingTypesSectionRef.current];
      sections.forEach((section, index) => {
        if (!section) return;
        
        // Simple entrance animation
        gsap.fromTo(section,
          { y: 50, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "top center",
              toggleActions: "play none none reverse"
            }
          }
        );
      });
      
      // Create a scroll snap observer for each section
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          // Only trigger when section is entering viewport
          if (entry.isIntersecting && scrollDirection > 0 && !isSnapping) {
            const section = entry.target;
            const navHeight = 70;
            
            // Prevent multiple snaps
            isSnapping = true;
            
            // Snap the section into view below the nav
            gsap.to(window, {
              scrollTo: {
                y: section.getBoundingClientRect().top + window.scrollY - navHeight,
                autoKill: false
              },
              duration: 0.5,
              ease: "power2.out",
              onComplete: () => {
                // Allow scrolling again after animation
                setTimeout(() => {
                  isSnapping = false;
                }, 600); // Longer delay to prevent glitches
              }
            });
          }
        });
      }, {
        threshold: 0.4, // Trigger when 40% of the section is visible
        rootMargin: '-10% 0px -40% 0px' // Adjust the detection area
      });
      
      // Observe each section
      sections.forEach(section => {
        if (section) observer.observe(section);
      });
      
      return () => {
        window.removeEventListener('scroll', scrollHandler);
        
        // Disconnect the observer
        sections.forEach(section => {
          if (section) observer.unobserve(section);
        });
        observer.disconnect();
      };
    });
    
    return () => ctx.revert();
  }, []);
  
  return (
    <div className="overflow-hidden">
      <Hero 
        subtitle="Simple Funding Solutions for Real Estate Investors" 
        ctaText="Request Funding" 
        ctaLink="#funding-types"
      />
      
      <div id="how-it-works" ref={howItWorksSectionRef}>
        <HowItWorks />
      </div>
      
      <div id="funding-types" ref={fundingTypesSectionRef}>
        <FundingTypes />
      </div>
      
      <FAQs />
      
      {/* Testimonials hidden as requested */}
      {/* <Testimonials /> */}
    </div>
  );
};

export default Home; 