import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FiGrid, 
  FiDollarSign, 
  FiChevronDown, 
  FiMessageSquare, 
  FiPlusCircle,
  FiShield, // Icon for Admin
  FiChevronsLeft, // Icon for collapse
  FiChevronsRight, // Icon for expand
  FiFolder,
  FiBriefcase, // Added missing imports
  FiSend, 
  FiCheckSquare, 
  FiSettings, 
  FiLogOut,
  FiUserCheck // Added missing icon
} from 'react-icons/fi';
import IconWrapper from '../atoms/IconWrapper';
import { useAuth } from '../../context/AuthContext'; // Import useAuth to check role

// Define Props for Sidebar
interface SideBarProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const SideBar: React.FC<SideBarProps> = ({ isCollapsed, toggleCollapse }) => {
  const [fundingDropdownOpen, setFundingDropdownOpen] = useState(false);
  const { currentUserProfile, logout } = useAuth(); // Get profile to check role and logout function
  const navigate = useNavigate();

  const activeClassName = "flex items-center px-4 py-2.5 bg-accent text-background rounded-md";
  const inactiveClassName = "flex items-center px-4 py-2.5 text-primary hover:bg-gray-100 rounded-md transition-colors duration-200";
  const dropdownLinkClassName = "block py-2 px-4 text-sm text-primary hover:bg-gray-100";
  
  // Classes for collapsed state
  const sidebarWidth = isCollapsed ? 'w-16' : 'w-64';
  const linkPadding = isCollapsed ? 'px-1 justify-center' : 'px-4'; // Adjust padding for icons
  const textVisibility = isCollapsed ? 'hidden' : 'inline';
  const justifyNav = isCollapsed ? 'justify-center' : 'justify-start';

  const toggleFundingDropdown = () => {
    if (isCollapsed) toggleCollapse(); // Expand sidebar if collapsed when clicking dropdown
    setFundingDropdownOpen(!fundingDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login'); // Redirect to login after logout
    } catch (error) {
      console.error("Logout failed:", error);
      // TODO: Add user feedback for logout failure
    }
  };

  const isAdmin = currentUserProfile?.role === 'admin';

  // Navigation items
  const commonLinks = [
    { path: "/deal-room", icon: FiGrid, label: "Deal Room" },
    { path: "/my-deals", icon: FiBriefcase, label: "My Deals" },
    { path: "/submit-deal", icon: FiSend, label: "Submit New Deal" },
    { path: "/funded-deals", icon: FiCheckSquare, label: "Funded Deals" },
    { path: "/document-center", icon: FiFolder, label: "Document Center" },
    { path: "/profile", icon: FiSettings, label: "Settings" },
  ];

  const adminLinks = [
    { path: "/admin", icon: FiUserCheck, label: "Admin Dashboard" },
    { path: "/admin/review", icon: FiUserCheck, label: "Deal Review Queue" },
    // Add other admin-specific links here
  ];

  const linksToRender = isAdmin ? [...adminLinks, ...commonLinks] : commonLinks;

  return (
    // Use calc for height: viewport height minus header height (4rem = h-16)
    // Ensure parent container in MainLayout allows this height.
    <aside 
      className={`bg-white shadow-md fixed top-16 left-0 pt-6 flex flex-col z-30 transition-all duration-300 ease-in-out ${sidebarWidth}`}
      style={{ height: 'calc(100vh - 4rem)' }} // Explicit height calculation
    >
      {/* Main Navigation Links */}
      <nav className={`flex-grow px-2 space-y-2 overflow-y-auto overflow-x-hidden ${justifyNav}`}> 
          {/* Deals Link */}
          <NavLink
            to="/deal-room" 
            title="Deals"
            className={({ isActive }) => `${isActive ? activeClassName : inactiveClassName} ${linkPadding}`}
          >
            <IconWrapper name="FiGrid" size={20} />
            <span className={`ml-3 ${textVisibility}`}>Deals</span>
          </NavLink>

          {/* My Funding Dropdown */}
          <div>
            <button
              onClick={toggleFundingDropdown}
              title="My Funding"
              className={`${inactiveClassName} ${linkPadding} w-full ${isCollapsed ? 'justify-center' : 'justify-between'}`}
            >
              <span className={`flex items-center ${isCollapsed ? 'w-full justify-center' : ''}`}>
                <IconWrapper name="FiDollarSign" size={20} />
                <span className={`ml-3 ${textVisibility}`}>My Funding</span>
              </span>
              {!isCollapsed && (
                <IconWrapper 
                  name="FiChevronDown" 
                  className={`transition-transform duration-200 ${fundingDropdownOpen ? 'rotate-180' : ''}`} 
                />
              )}
            </button>
            {/* Dropdown Content */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${fundingDropdownOpen && !isCollapsed ? 'max-h-40' : 'max-h-0'}`}>
              <ul className="pt-1 pl-8 space-y-1">
                 <li><NavLink to="/my-deals" className={({ isActive }) => isActive ? `font-semibold ${dropdownLinkClassName}` : dropdownLinkClassName}>My Submitted Deals</NavLink></li>
                 <li><NavLink to="/funded-deals" className={({ isActive }) => isActive ? `font-semibold ${dropdownLinkClassName}` : dropdownLinkClassName}>My Funded Deals</NavLink></li>
                 <li><NavLink to="/document-center" className={({ isActive }) => isActive ? `font-semibold ${dropdownLinkClassName}` : dropdownLinkClassName}>Document Center</NavLink></li>
               </ul>
            </div>
          </div>

          {/* Negotiations Link */} 
          <NavLink 
            to="/negotiations" 
            title="Negotiations"
            className={({ isActive }) => `${isActive ? activeClassName : inactiveClassName} ${linkPadding}`}
          >
            <IconWrapper name="FiMessageSquare" size={20} />
            <span className={`ml-3 ${textVisibility}`}>Negotiations</span>
          </NavLink>

          {/* Admin Link (Conditional) */}
          {isAdmin && (
             <NavLink 
              to="/admin/review" 
              title="Admin Review"
              className={({ isActive }) => `${isActive ? activeClassName : inactiveClassName} ${linkPadding} mt-4 border-t pt-4 border-gray-200`}
            >
              <IconWrapper name="FiUserCheck" size={20} /> 
              <span className={`ml-3 ${textVisibility}`}>Admin Review</span>
            </NavLink>
          )}
      </nav>

      {/* Submit Deal & Collapse Button Area (Pushed to bottom by flex-grow on nav) */} 
      <div className={`p-2 border-t border-gray-200 space-y-2 mt-auto ${isCollapsed ? 'px-1' : 'px-4'}`}> {/* Add mt-auto */}
         {/* Submit Deal Button */} 
        <NavLink 
          to="/submit-deal" 
          title="Submit New Deal"
          className={`flex items-center justify-center w-full px-4 py-2.5 bg-secondary text-background rounded-md hover:bg-secondary/90 transition-colors duration-200 font-medium ${isCollapsed ? 'py-2' : 'py-3'}`}
        >
          <IconWrapper name="FiPlusCircle" size={20} />
          <span className={`ml-2 ${textVisibility}`}>Submit Deal</span>
        </NavLink>
        {/* Collapse Toggle Button */} 
         <button
            onClick={toggleCollapse}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            className="flex items-center justify-center w-full px-4 py-1.5 text-gray-500 hover:bg-gray-100 rounded-md transition-colors duration-200"
          >
            <IconWrapper name={isCollapsed ? 'FiChevronsRight' : 'FiChevronsLeft'} size={18} />
          </button>
      </div>
    </aside>
  );
};

export default SideBar; 