import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { FiX } from 'react-icons/fi';
import IconWrapper from '../atoms/IconWrapper';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
    maxWidthClass?: string; // e.g., 'max-w-md', 'max-w-2xl'
}

const Modal: React.FC<ModalProps> = ({ 
    isOpen,
    onClose,
    children,
    title,
    maxWidthClass = 'max-w-md' // Default width
}) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            gsap.set(backdropRef.current, { display: 'flex' });
            gsap.to(backdropRef.current, { opacity: 1, duration: 0.3 });
            gsap.set(modalRef.current, { y: -30, scale: 0.95, opacity: 0 });
            gsap.to(modalRef.current, { opacity: 1, y: 0, scale: 1, duration: 0.3, delay: 0.1, ease: 'power2.out' });
        } else {
            gsap.to(modalRef.current, { opacity: 0, y: -30, scale: 0.95, duration: 0.2, ease: 'power2.in', onComplete: () => {
                 // Only set overflow and hide backdrop after modal animation completes
                 document.body.style.overflow = 'auto';
                 gsap.set(backdropRef.current, { display: 'none' }); 
            }}); 
            gsap.to(backdropRef.current, { opacity: 0, duration: 0.3 });
        }
    }, [isOpen]);

    // Don't render the DOM element at all if not open initially
    // GSAP handles display:flex/none for transitions
    if (!isOpen && !gsap.isTweening(backdropRef.current)) return null; 

    return (
        <div
            ref={backdropRef}
            className="fixed inset-0 z-50 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 opacity-0"
            style={{ display: 'none' }} // Initially hidden
            onClick={onClose} // Close on backdrop click
        >
            <div
                ref={modalRef}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-2xl ${maxWidthClass} w-full max-h-[90vh] flex flex-col overflow-hidden transform opacity-0 scale-95`}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
                {/* Modal Header */} 
                <div className="flex justify-between items-center p-4 md:p-5 border-b dark:border-gray-700 flex-shrink-0">
                    {title ? (
                         <h3 className="text-xl font-semibold text-primary dark:text-white">
                            {title}
                         </h3>
                    ) : <div /> /* Placeholder for alignment */} 
                    <button 
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        aria-label="Close modal"
                    >
                        <IconWrapper name="FiX" size={20} />
                    </button>
                </div>
                {/* Modal Body (Scrollable) */}
                <div className="p-4 md:p-6 space-y-4 overflow-y-auto flex-grow">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal; 