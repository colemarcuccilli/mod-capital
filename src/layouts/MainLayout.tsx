import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/organisms/Header';
import Footer from '../components/organisms/Footer';
import SideBar from '../components/organisms/SideBar';
import NotificationPanel from '../components/organisms/NotificationPanel';
import { useAuth } from '../context/AuthContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { currentUser, loading: authLoading } = useAuth();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);

  const isHomePage = location.pathname === '/';
  const shouldShowSidebar = currentUser && !isHomePage;

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleNotificationPanel = () => {
    setIsNotificationPanelOpen(!isNotificationPanelOpen);
  };

  let mainContentMargin = 'ml-0';
  if (shouldShowSidebar) {
    mainContentMargin = isSidebarCollapsed ? 'md:ml-16' : 'md:ml-64';
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header toggleNotificationPanel={toggleNotificationPanel} />
      <div className="flex flex-1 pt-16">
        {shouldShowSidebar && (
          <SideBar 
            isCollapsed={isSidebarCollapsed} 
            toggleCollapse={toggleSidebarCollapse} 
          />
        )}
        <main className={`flex-grow transition-all duration-300 ease-in-out ${mainContentMargin} overflow-y-auto`}>
          <div className="p-4 md:p-6">
            {children}
          </div>
        </main>
        <NotificationPanel 
          isOpen={isNotificationPanelOpen} 
          togglePanel={toggleNotificationPanel} 
        />
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout; 