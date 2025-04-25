import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiChevronDown, FiMenu, FiX } from 'react-icons/fi';
import gsap from 'gsap';
import IconWrapper from '../atoms/IconWrapper';
import { useAuth } from '../../context/AuthContext';
import { signOutUser } from '../../lib/firebaseAuth';

interface NavigationProps {
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({ className = '' }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fundingDropdownOpen, setFundingDropdownOpen] = useState(false);
  
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const desktopLinksRef = useRef<HTMLUListElement>(null);
  const fundingDropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Animate desktop links on load
    if (desktopLinksRef.current) {
      gsap.from(desktopLinksRef.current.children, {
        opacity: 0,
        y: -20,
        stagger: 0.1,
        duration: 0.5,
        ease: 'power3.out',
        delay: 0.3
      });
    }
  }, []);
  
  useEffect(() => {
    // Animate mobile menu
    if (mobileMenuRef.current) {
      if (mobileMenuOpen) {
        gsap.to(mobileMenuRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.3,
          ease: 'power3.out'
        });
      } else {
        gsap.to(mobileMenuRef.current, {
          y: -20,
          opacity: 0,
          duration: 0.3,
          ease: 'power3.in'
        });
      }
    }
  }, [mobileMenuOpen]);
  
  useEffect(() => {
    // Animate funding dropdown
    if (fundingDropdownRef.current) {
      if (fundingDropdownOpen) {
        gsap.to(fundingDropdownRef.current, {
          height: 'auto',
          opacity: 1,
          duration: 0.3,
          ease: 'power3.out'
        });
      } else {
        gsap.to(fundingDropdownRef.current, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: 'power3.in'
        });
      }
    }
  }, [fundingDropdownOpen]);
  
  const handleLogout = async () => {
    try {
      await signOutUser();
      setMobileMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const fundingTypes = [
    { name: 'Double Close', path: '/double-close' },
    { name: 'EMD', path: '/emd' },
    { name: 'Gap', path: '/gap' },
    { name: 'Private Money Loans', path: '/private-money' }
  ];
  
  const commonNavLinks = [
    { name: 'Home', path: '/' },
    { name: 'Referrals', path: '/referrals' },
    { name: 'Contact Us', path: '/contact' }
  ];

  const loggedOutLinks = [
    { name: 'Login', path: '/login' },
    { name: 'Sign Up', path: '/signup' }
  ];

  const loggedInLinks = [
    { name: 'Deal Room', path: '/deal-room' },
    { name: 'Submit Deal', path: '/submit-deal' },
    { name: 'Profile', path: '/profile' }
  ];

  const navLinks = currentUser ? [...commonNavLinks, ...loggedInLinks] : [...commonNavLinks, ...loggedOutLinks];
  
  const chevronDownIcon = <IconWrapper 
    name="FiChevronDown" 
    className={`text-primary transition-transform duration-300 ${fundingDropdownOpen ? 'rotate-180' : ''}`} 
  />;
  const menuIcon = <IconWrapper name="FiMenu" size={24} className="text-primary" />;
  const closeIcon = <IconWrapper name="FiX" size={24} className="text-primary" />;
  
  return (
    <nav className={`relative ${className}`}>
      {/* Desktop Navigation */}
      <ul ref={desktopLinksRef} className="hidden md:flex space-x-6 items-center">
        {navLinks.map((link, index) => (
          <li key={index}>
            <Link 
              to={link.path}
              className="text-primary hover:text-accent transition-colors duration-300"
            >
              {link.name}
            </Link>
          </li>
        ))}
        
        {/* Funding Types Dropdown */}
        <li className="relative">
          <button
            className="flex items-center space-x-1 text-primary hover:text-accent transition-colors duration-300"
            onClick={() => setFundingDropdownOpen(!fundingDropdownOpen)}
          >
            <span>Get Funding</span>
            {chevronDownIcon}
          </button>
          
          <div 
            ref={fundingDropdownRef}
            className="absolute top-full left-0 w-60 mt-2 bg-background shadow-lg rounded-md overflow-hidden z-10 opacity-0 h-0 text-primary"
            style={{ pointerEvents: fundingDropdownOpen ? 'auto' : 'none' }}
          >
            <ul className="py-2">
              {fundingTypes.map((type, index) => (
                <li key={index}>
                  <Link 
                    to={type.path}
                    className="block px-4 py-2 hover:bg-primary hover:text-background transition-colors duration-200"
                    onClick={() => setFundingDropdownOpen(false)}
                  >
                    {type.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </li>

        {/* Logout Button (if logged in) */}
        {currentUser && (
          <li>
            <button 
              onClick={handleLogout}
              className="text-primary hover:text-accent transition-colors duration-300"
            >
              Logout
            </button>
          </li>
        )}
      </ul>
      
      {/* Mobile Menu Button */}
      <button 
        className="md:hidden text-primary hover:text-accent"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? closeIcon : menuIcon}
      </button>
      
      {/* Mobile Menu */}
      <div 
        ref={mobileMenuRef}
        className={`absolute top-full right-0 w-full bg-background shadow-lg rounded-md mt-2 py-4 z-20 md:hidden transform opacity-0 -translate-y-5 text-primary`}
        style={{ display: mobileMenuOpen ? 'block' : 'none' }}
      >
        <ul className="space-y-2">
          {navLinks.map((link, index) => (
            <li key={index}>
              <Link 
                to={link.path}
                className="block px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            </li>
          ))}
          
          {/* Mobile Funding Types Dropdown */}
          <li>
            <button
              className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setFundingDropdownOpen(!fundingDropdownOpen)}
            >
              <span>Get Funding</span>
              {chevronDownIcon}
            </button>
            
            <div className={`overflow-hidden transition-all duration-300 ${fundingDropdownOpen ? 'max-h-60' : 'max-h-0'}`}>
              <ul className="bg-gray-50 py-1">
                {fundingTypes.map((type, index) => (
                  <li key={index}>
                    <Link 
                      to={type.path}
                      className="block px-8 py-2 hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => {
                        setFundingDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
                    >
                      {type.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>

          {/* Mobile Logout Button */} 
          {currentUser && (
            <li>
              <button 
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition-colors duration-200"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation; 