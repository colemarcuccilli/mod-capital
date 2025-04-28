import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../atoms/Logo';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { FiArrowUp, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';
import IconWrapper from '../atoms/IconWrapper';
import { useAuth } from '../../context/AuthContext';
import { signOutUser } from '../../lib/firebaseAuth';
import { useNavigate } from 'react-router-dom';

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
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
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
  
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    { name: 'Facebook', icon: 'FiFacebook', url: 'https://facebook.com' },
    { name: 'Twitter', icon: 'FiTwitter', url: 'https://twitter.com' },
    { name: 'LinkedIn', icon: 'FiLinkedin', url: 'https://linkedin.com' },
    { name: 'Instagram', icon: 'FiInstagram', url: 'https://instagram.com' }
  ];

  const footerLinks = [
    {
      title: 'Funding',
      links: [
        { name: 'Double Close', path: '/double-close' },
        { name: 'EMD Funding', path: '/emd' },
        { name: 'Gap Funding', path: '/gap' },
        { name: 'Private Money', path: '/private-money' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', path: '/about' },
        { name: 'Contact', path: '/contact' },
        // { name: 'Referrals', path: '/referrals' },
        // { name: 'Blog', path: '/blog' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Terms of Service', path: '/terms' }
      ]
    }
  ];
  
  const handleLogout = async () => {
    try {
      await signOutUser();
      navigate('/');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
  
  return (
    <footer className="bg-primary text-background py-16 relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <Link to="/">
                <Logo className="h-12" />
              </Link>
            </div>
            <p className="text-background/80 mb-6 max-w-md">
              Empowering real estate investors with innovative funding solutions. Fast, reliable, and tailored to your needs.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map(link => (
                <a 
                  key={link.name} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-background/60 hover:text-accent transition-colors duration-300"
                >
                  <IconWrapper name={link.icon} size={24} />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold text-background mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map(link => (
                  <li key={link.name}>
                    <Link 
                      to={link.path}
                      className="text-background/80 hover:text-accent transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Account Links Column */} 
          <div>
            <h4 className="font-semibold text-background mb-4">Account</h4>
            <ul className="space-y-2">
              {currentUser ? (
                <>
                  <li>
                    <Link to="/profile" className="text-background/80 hover:text-accent transition-colors duration-300">
                      My Profile
                    </Link>
                  </li>
                   <li>
                    <Link to="/deal-room" className="text-background/80 hover:text-accent transition-colors duration-300">
                      Deal Room
                    </Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="text-background/80 hover:text-accent transition-colors duration-300">
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" className="text-background/80 hover:text-accent transition-colors duration-300">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link to="/signup" className="text-background/80 hover:text-accent transition-colors duration-300">
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        <div className="text-center border-t border-background/10 pt-8 mt-12">
          <p className="text-sm text-background/60">
            &copy; {currentYear} Domentra. All rights reserved.
          </p>
        </div>
      </div>
      
      {/* Back to top button */}
      <button
        ref={backToTopRef}
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-accent text-background shadow-xl flex items-center justify-center opacity-0 invisible transition-all z-50 hover:bg-accent/90"
        onClick={handleBackToTop}
        aria-label="Back to top"
      >
        <IconWrapper name="FiArrowUp" size={20} />
      </button>
    </footer>
  );
};

export default Footer; 