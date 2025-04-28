import React from 'react';
import { FiX } from 'react-icons/fi';
import IconWrapper from '../atoms/IconWrapper';

interface NotificationPanelProps {
  isOpen: boolean;
  togglePanel: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, togglePanel }) => {
  // Basic structure, replace with actual notification list later
  return (
    <aside 
      className={`fixed top-0 right-0 h-full w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-200 pt-20"> {/* pt-20 to clear nav */} 
        <h2 className="text-lg font-semibold text-primary">Notifications</h2>
        <button onClick={togglePanel} className="text-gray-500 hover:text-primary">
          <IconWrapper name="FiX" size={20} />
        </button>
      </div>
      <div className="p-4">
        <p className="text-gray-500 text-sm">No new notifications.</p>
        {/* TODO: Map through actual notifications here */}
      </div>
    </aside>
  );
};

export default NotificationPanel; 