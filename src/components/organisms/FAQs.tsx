import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiPlus, FiMinus, FiHelpCircle } from 'react-icons/fi';
import IconWrapper from '../atoms/IconWrapper';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Match interface from Home.tsx
interface FAQItemStructure {
  question: string;
  answer: string;
}

interface FAQItemProps {
  question: string;
  answer: string;
  index: number;
  addToRefs: (el: HTMLDivElement | null) => void;
}

// Single FAQ Item component for managing its own state and animation
const FAQItem: React.FC<FAQItemProps> = ({ question, answer, index, addToRefs }) => {
    const [isOpen, setIsOpen] = useState(false);
    const answerRef = useRef<HTMLDivElement>(null);
    const itemRef = useRef<HTMLDivElement>(null);
  
    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        if (!answerRef.current) return;
        if (isOpen) {
            gsap.to(answerRef.current, { height: 'auto', opacity: 1, duration: 0.3, ease: 'power2.out', marginTop: '0.75rem' });
        } else {
            gsap.to(answerRef.current, { height: 0, opacity: 0, duration: 0.3, ease: 'power2.in', marginTop: 0 });
        }
    }, [isOpen]);

    // Add ref to parent array
    useEffect(() => {
        addToRefs(itemRef.current);
    }, [addToRefs]);

    return (
        <div ref={itemRef} className="faq-item-wrapper mb-4">
             {/* Add border and ensure bg color applies */}
            <div
                className={`faq-item bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-lg p-5 cursor-pointer border dark:border-gray-700 transition-shadow duration-300 ${isOpen ? 'shadow-lg' : 'hover:shadow-lg'}`}
                onClick={toggleOpen}
            >
                <div className="flex items-center justify-between">
                    <h3 className="text-lg md:text-xl font-semibold text-primary dark:text-white pr-4">
                        {question}
                    </h3>
                    <div className="relative flex-shrink-0 w-6 h-6 text-accent dark:text-accent-light">
                        <IconWrapper name="FiPlus" size={24} className={`absolute transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
                        <IconWrapper name="FiMinus" size={24} className={`absolute transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} />
                    </div>
                </div>
                <div ref={answerRef} className="faq-answer overflow-hidden h-0 opacity-0">
                    <p className="text-primary/80 dark:text-gray-300 pt-3">{answer}</p>
                </div>
            </div>
        </div>
    );
};

// Add props to FAQs component
interface FAQsProps {
    faqs: FAQItemStructure[]; // Expect an array of FAQs
}

const FAQs: React.FC<FAQsProps> = ({ faqs }) => { // Destructure props
    const sectionRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const faqListRef = useRef<HTMLDivElement>(null);
    const faqItemRefs = useRef<(HTMLDivElement | null)[]>([]);
      
    // Reset refs array on mount
    faqItemRefs.current = []; 
    const addToRefs = (el: HTMLDivElement | null) => {
        if (el && !faqItemRefs.current.includes(el)) {
             faqItemRefs.current.push(el);
    }
  };
  
  useEffect(() => {
        const sectionEl = sectionRef.current;
        const titleEl = titleRef.current;
        const listEl = faqListRef.current;

        if (!sectionEl || !titleEl || !listEl) return;
    
    const ctx = gsap.context(() => {
            // Section entrance
            gsap.from(sectionEl, {
                opacity: 0, 
                y: 50, 
                duration: 0.8, 
                ease: 'power3.out',
          scrollTrigger: {
                    trigger: sectionEl, 
                    start: "top 85%" 
          }
        });

            // Animate FAQ items only after refs are populated
            // We use the refs array collected by the FAQItem component
             gsap.from(faqItemRefs.current, {
              opacity: 0,
                 y: 30,
                 duration: 0.6,
                 stagger: 0.1,
                 ease: 'power2.out',
              scrollTrigger: {
                     trigger: listEl, // Trigger when the list container is in view
                start: "top 85%",
              }
             });

    }, sectionRef);
    
        return () => ctx.revert();
    }, [faqs.length]); // Empty dependency array, runs once on mount
  
  return (
        <section ref={sectionRef} id="faqs" className="py-20 md:py-28 bg-gray-50 dark:bg-gray-900 opacity-100">
            <div className="container mx-auto px-4 relative z-10">
                 <div className="text-center mb-16">
                    <div className="inline-block p-3 bg-accent/10 dark:bg-accent/20 rounded-full mb-3">
                        <IconWrapper name="FiHelpCircle" size={32} className="text-accent dark:text-accent-light" />
      </div>
                    <h2 ref={titleRef} className="text-3xl md:text-4xl font-bold text-primary dark:text-white">
                        Frequently Asked <span className="text-accent dark:text-accent-light">Questions</span>
          </h2>
        </div>
        
                <div ref={faqListRef} className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
                        <FAQItem 
              key={index}
                            question={faq.question} 
                            answer={faq.answer} 
                            index={index}
                            addToRefs={addToRefs} // Pass the function to collect refs
                        />
                    ))}
              </div>
            </div>
             {/* Decorative elements - optional */}
            <div className="absolute right-0 top-0 w-96 h-96 rounded-full border-4 border-accent/10 dark:border-accent/20 -mr-48 -mt-48 transform rotate-45 opacity-30 dark:opacity-20 pointer-events-none" />
            <div className="absolute left-0 bottom-0 w-72 h-72 rounded-full border-4 border-primary/10 dark:border-gray-700/50 -ml-36 -mb-36 transform -rotate-12 opacity-30 dark:opacity-20 pointer-events-none" />
    </section>
  );
};

export default FAQs; 