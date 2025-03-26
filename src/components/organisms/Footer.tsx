import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../atoms/Logo';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { FiArrowUp, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';
import IconWrapper from '../atoms/IconWrapper';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const Footer: React.FC = () => {
  const footerRef = useRef<HTMLElement>(null);
  const columnRefs = useRef<Array<HTMLDivElement | null>>([]);
  const backToTopRef = useRef<HTMLButtonElement>(null);
  const waveRef = useRef<SVGSVGElement>(null);
  
  // Reset columnRefs to ensure it's empty
  columnRefs.current = [];
  
  // Add to column refs array
  const addToColumnRefs = (el: HTMLDivElement | null) => {
    if (el && !columnRefs.current.includes(el)) {
      columnRefs.current.push(el);
    }
  };
  
  // Create element variables for icons
  const facebookIcon = <IconWrapper name="FiFacebook" size={20} />;
  const twitterIcon = <IconWrapper name="FiTwitter" size={20} />;
  const instagramIcon = <IconWrapper name="FiInstagram" size={20} />;
  const linkedinIcon = <IconWrapper name="FiLinkedin" size={20} />;
  const arrowUpIcon = <IconWrapper name="FiArrowUp" size={20} />;
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Wave animation
      if (waveRef.current) {
        gsap.fromTo(waveRef.current,
          { y: "100%" },
          {
            y: "0%",
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top 98%",
            }
          }
        );
      }
      
      // Footer columns animation with stagger effect
      if (columnRefs.current.length > 0) {
        gsap.from(columnRefs.current, {
          opacity: 0,
          y: 50,
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 85%",
          }
        });
        
        // Animate social icons
        const socialIcons = footerRef.current?.querySelectorAll('.social-icon');
        if (socialIcons && socialIcons.length > 0) {
          gsap.from(socialIcons, {
            scale: 0,
            opacity: 0,
            stagger: 0.1,
            duration: 0.5,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: socialIcons[0],
              start: "top 90%",
            }
          });
        }
      }
      
      // Back to top button animation
      if (backToTopRef.current) {
        gsap.set(backToTopRef.current, { opacity: 0, visibility: 'hidden' });
        
        ScrollTrigger.create({
          start: 300,
          toggleActions: "restart none none reverse",
          onUpdate: (self) => {
            if (self.progress > 0) {
              gsap.to(backToTopRef.current, { 
                opacity: 1, 
                visibility: 'visible',
                duration: 0.3,
                yPercent: 0
              });
            } else {
              gsap.to(backToTopRef.current, { 
                opacity: 0, 
                visibility: 'hidden',
                duration: 0.3,
                yPercent: 20
              });
            }
          }
        });
        
        // Button hover animation
        backToTopRef.current.addEventListener('mouseenter', () => {
          gsap.to(backToTopRef.current, {
            scale: 1.1,
            duration: 0.3,
            ease: "power1.out"
          });
        });
        
        backToTopRef.current.addEventListener('mouseleave', () => {
          gsap.to(backToTopRef.current, {
            scale: 1,
            duration: 0.3,
            ease: "power1.out"
          });
        });
      }
    }, footerRef);
    
    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
  
  const handleBackToTop = () => {
    gsap.to(window, { 
      duration: 1, 
      scrollTo: 0,
      ease: "power3.inOut"
    });
  };
  
  return (
    <footer className="bg-gray-900 text-white relative">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-6">
              <Logo className="w-40 h-auto" />
            </div>
            <p className="text-gray-400 mb-6">
              Empowering businesses with innovative funding solutions. Fast, reliable, and tailored to your needs.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                {facebookIcon}
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                {twitterIcon}
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                {linkedinIcon}
              </a>
            </div>
          </div>
          
          {/* Column 2: Funding Types */}
          <div ref={addToColumnRefs}>
            <h3 className="text-xl font-bold mb-6 border-b border-white/20 pb-2">Funding Types</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/double-close" className="inline-block text-white/80 hover:text-accent transition-colors hover:translate-x-1 transform duration-200">
                  Double Close
                </Link>
              </li>
              <li>
                <Link to="/emd" className="inline-block text-white/80 hover:text-accent transition-colors hover:translate-x-1 transform duration-200">
                  EMD
                </Link>
              </li>
              <li>
                <Link to="/gap" className="inline-block text-white/80 hover:text-accent transition-colors hover:translate-x-1 transform duration-200">
                  Gap Funding
                </Link>
              </li>
              <li>
                <Link to="/private-money" className="inline-block text-white/80 hover:text-accent transition-colors hover:translate-x-1 transform duration-200">
                  Private Money Loans
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 3: Company */}
          <div ref={addToColumnRefs}>
            <h3 className="text-xl font-bold mb-6 border-b border-white/20 pb-2">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="inline-block text-white/80 hover:text-accent transition-colors hover:translate-x-1 transform duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="inline-block text-white/80 hover:text-accent transition-colors hover:translate-x-1 transform duration-200">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="inline-block text-white/80 hover:text-accent transition-colors hover:translate-x-1 transform duration-200">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link to="/blog" className="inline-block text-white/80 hover:text-accent transition-colors hover:translate-x-1 transform duration-200">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 4: Contact */}
          <div ref={addToColumnRefs}>
            <h3 className="text-xl font-bold mb-6 border-b border-white/20 pb-2">Contact Us</h3>
            <ul className="space-y-3">
              <li className="text-white/80 flex items-start">
                <span className="inline-block mt-1 mr-2">📍</span>
                <span>123 Finance Street, Suite 100<br/>New York, NY 10001</span>
              </li>
              <li>
                <a href="tel:+1234567890" className="inline-flex items-center text-white/80 hover:text-accent transition-colors">
                  <span className="mr-2">📞</span> (123) 456-7890
                </a>
              </li>
              <li>
                <a href="mailto:info@modcapital.com" className="inline-flex items-center text-white/80 hover:text-accent transition-colors">
                  <span className="mr-2">✉️</span> info@modcapital.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Divider */}
        <hr className="border-white/10 mb-8" />
        
        {/* Bottom Area */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Mod Capital. All rights reserved.
          </p>
          
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-white/60 hover:text-accent transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-white/60 hover:text-accent transition-colors text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
      
      {/* Back to top button */}
      <button
        ref={backToTopRef}
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-accent text-white shadow-xl flex items-center justify-center opacity-0 invisible transition-all z-50 hover:bg-accent/90"
        onClick={handleBackToTop}
        aria-label="Back to top"
      >
        {arrowUpIcon}
      </button>
    </footer>
  );
};

export default Footer; 