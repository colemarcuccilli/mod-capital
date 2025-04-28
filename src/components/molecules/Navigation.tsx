import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, NavLink, useLocation } from 'react-router-dom';
import { 
  FiChevronDown, 
  FiMenu, 
  FiX, 
  FiUser, // For Profile Placeholder
  FiBell, // For Notifications
  FiHelpCircle, // For Help
  FiSettings, // For Settings
  FiLogOut, // For Logout
  FiHome, // For Home Link
  FiGrid // Import FiGrid for the app/deals view icon
} from 'react-icons/fi';
import gsap from 'gsap';
import IconWrapper from '../atoms/IconWrapper';
import { useAuth } from '../../context/AuthContext';
import { signOutUser } from '../../lib/firebaseAuth';

interface NavigationProps {
  className?: string;
  toggleNotificationPanel: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ className = '', toggleNotificationPanel }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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
  
  // Logged Out links (excluding Get Funding dropdown)
  const loggedOutNavItems = [
    { type: 'link', name: 'Login', path: '/login' },
    { type: 'link', name: 'Sign Up', path: '/signup' }
  ];

  // Determine if on the root homepage
  const isHomePage = location.pathname === '/';

  // Dynamically set the icon AND path for the first action based on route
  const loggedInActions = [
    { 
      type: 'link', 
      name: isHomePage ? 'Deal Room' : 'Home', // Change name for clarity/title
      path: isHomePage ? '/deal-room' : '/', // Link to deal room if on home, else link home
      icon: isHomePage ? FiGrid : FiHome 
    },
    { type: 'button', name: 'Help', action: () => alert('Help clicked!'), icon: FiHelpCircle }, 
    { type: 'button', name: 'Settings', action: () => alert('Settings clicked!'), icon: FiSettings }, 
    { type: 'button', name: 'Notifications', action: toggleNotificationPanel, icon: FiBell },
    { type: 'link', name: 'Profile', path: '/profile', icon: FiUser }, 
    { type: 'button', name: 'Logout', action: handleLogout, icon: FiLogOut }
  ];
  
  const chevronDownIcon = <IconWrapper name="FiChevronDown" className={`text-primary transition-transform duration-300 ${fundingDropdownOpen ? 'rotate-180' : ''}`} />;
  const menuIcon = <IconWrapper name="FiMenu" size={24} className="text-primary" />;
  const closeIcon = <IconWrapper name="FiX" size={24} className="text-primary" />;
  
  // --- Render Helpers ---
  const renderLoggedOutLink = (item: any, index: number, isMobile: boolean) => (
    <li key={index}>
      <Link 
        to={item.path}
        className={isMobile ? "block px-4 py-2 hover:bg-gray-100" : "text-primary hover:text-accent transition-colors duration-300"}
        onClick={() => isMobile && setMobileMenuOpen(false)}
      >
        {item.name}
      </Link>
    </li>
  );

  const renderLoggedInAction = (item: any, index: number, isMobile: boolean) => {
    const commonClasses = isMobile 
      ? "flex items-center w-full px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
      : "text-primary hover:text-accent transition-colors duration-300 p-2 rounded-full hover:bg-gray-100"; // Icon button style
    const iconSize = isMobile ? 20 : 22;
    const Icon = item.icon; // Get the icon component

    if (item.type === 'link') {
      return (
        <li key={index}>
          <Link to={item.path} className={commonClasses} title={item.name} onClick={() => isMobile && setMobileMenuOpen(false)}>
            <Icon size={iconSize} /> {isMobile && <span className="ml-3">{item.name}</span>}
          </Link>
        </li>
      );
    } else if (item.type === 'button') {
       // Special handling for mobile logout text color
       const mobileLogoutClass = (item.name === 'Logout' && isMobile) ? 'text-red-600' : '';
      return (
        <li key={index}>
          <button onClick={() => { item.action(); isMobile && setMobileMenuOpen(false); }} className={`${commonClasses} ${mobileLogoutClass}`} title={item.name}>
             <Icon size={iconSize} /> {isMobile && <span className="ml-3">{item.name}</span>}
          </button>
        </li>
      );
    }
    return null;
  };

  return (
    <nav className={`relative ${className}`}>
      {/* Desktop Navigation */}
      <ul className="hidden md:flex space-x-2 items-center"> {/* Reduced space for icons */} 
        
        {/* Logged Out Items */} 
        {!currentUser && (
          <>
            {/* Get Funding Dropdown */} 
            <li className="relative">
              <button
                className="flex items-center space-x-1 text-primary hover:text-accent transition-colors duration-300 px-2 py-1" // Added padding
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
                 {/* Dropdown content */} 
                 <ul className="py-2">
                   {fundingTypes.map((type, index) => (
                     <li key={index}><Link to={type.path} className="block px-4 py-2 hover:bg-primary hover:text-background transition-colors duration-200" onClick={() => setFundingDropdownOpen(false)}>{type.name}</Link></li>
                   ))}
                 </ul>
              </div>
            </li>
             {/* Login/Signup Links */} 
            {loggedOutNavItems.map((item, index) => renderLoggedOutLink(item, index, false))}
          </>
        )}

        {/* Logged In Items (Icons on the right) - Rendered directly, not via map */} 
        {currentUser && (
          <div className="flex items-center space-x-1"> {/* Container for icons */} 
            {loggedInActions.map((item, index) => renderLoggedInAction(item, index, false))}
          </div>
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
        <ul className="space-y-1">
          {/* Logged Out Mobile Items */} 
          {!currentUser && (
            <>
              {/* Mobile Funding Dropdown */} 
              <li>
                <button className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-100" onClick={() => setFundingDropdownOpen(!fundingDropdownOpen)}><span>Get Funding</span>{chevronDownIcon}</button>
                <div className={`overflow-hidden transition-all duration-300 ${fundingDropdownOpen ? 'max-h-40' : 'max-h-0'}`}><ul className="bg-gray-50 py-1 pl-4">{fundingTypes.map((type, index) => (<li key={index}><Link to={type.path} className="block px-4 py-2 text-sm hover:bg-gray-100" onClick={() => {setFundingDropdownOpen(false); setMobileMenuOpen(false);}}>{type.name}</Link></li>))}</ul></div>
              </li>
              {/* Mobile Login/Signup */} 
              {loggedOutNavItems.map((item, index) => renderLoggedOutLink(item, index, true))}
            </>
          )}

          {/* Logged In Mobile Items */} 
          {currentUser && (
             loggedInActions.map((item, index) => renderLoggedInAction(item, index, true))
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation; 