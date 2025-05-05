import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import { FiChevronLeft, FiChevronRight, FiStar } from 'react-icons/fi';
import IconWrapper from '../atoms/IconWrapper';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, Draggable);

// Update interface to match Home.tsx
interface TestimonialItem {
  quote: string;
  name: string;
  role: string; // Was 'title'
  image?: string; // Optional image
}

// Update props
interface TestimonialsProps {
    testimonials: TestimonialItem[];
}

const Testimonials: React.FC<TestimonialsProps> = ({ testimonials }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  
  // Use passed testimonials, no internal default needed if Home.tsx handles it
  // const testimonials: TestimonialItem[] = [ ... ]; 
  
  useEffect(() => {
    const sectionEl = sectionRef.current;
    const titleEl = titleRef.current;
    const trackEl = trackRef.current;
    const carouselEl = carouselRef.current;

    if (!sectionEl || !titleEl || !carouselEl || !trackEl || testimonials.length === 0) return;

    const cards = gsap.utils.toArray<HTMLElement>(trackEl.children);

    const ctx = gsap.context(() => {
        // Animate Title
        gsap.from(titleEl, { 
            opacity: 0, y: 30, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: sectionEl, start: "top 85%" }
        });

        // Stagger animation for cards
        gsap.from(cards, { 
          opacity: 0, y: 50, stagger: 0.1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: carouselEl, start: "top 85%" }
        });
      
        // Setup Draggable (only if needed - more than 1 card fits)
        const setupDraggable = () => {
             if (!trackEl || !carouselEl) return;
              const trackWidth = trackEl.scrollWidth;
              const carouselWidth = carouselEl.offsetWidth;
              
              // Only enable draggable if content overflows
              if (trackWidth > carouselWidth) {
                  const maxX = -(trackWidth - carouselWidth);
                  Draggable.create(trackEl, {
                    type: "x",
                    bounds: { minX: maxX, maxX: 0 },
                    edgeResistance: 0.85,
                    throwProps: true,
                    inertia: true
                  });
              } else {
                  // If no overflow, ensure track is positioned at start
                  gsap.set(trackEl, { x: 0 });
                  // Optionally disable previous Draggable instance if window resize causes non-overflow
                  const draggables = Draggable.get(trackEl);
                  if (draggables) {
                    draggables.disable(); // Disable instead of kill if you might re-enable
                  }
              }
        };

        // Set up Draggable initially and on resize
        setupDraggable();
        window.addEventListener('resize', setupDraggable);

        // Return cleanup function
        return () => {
            window.removeEventListener('resize', setupDraggable);
            const draggables = Draggable.get(trackEl);
            if (draggables) draggables.kill(); // Kill on unmount
        };

    }, sectionRef); // Scope to section ref
    
    return () => {
        ctx.revert(); // Cleans up animations and ScrollTriggers
    };

  // Rerun effect if testimonials change
  }, [testimonials]); 
  
  // ... (handleNext, handlePrev remain largely the same, ensure they check refs) ...
  const handleNext = () => {
    if (carouselRef.current && trackRef.current) {
      const carouselWidth = carouselRef.current.offsetWidth;
      const currentX = gsap.getProperty(trackRef.current, "x") as number;
      const trackWidth = trackRef.current.scrollWidth;
      const maxX = trackWidth > carouselWidth ? -(trackWidth - carouselWidth) : 0;
      
      let newX = currentX - carouselWidth;
      if (newX < maxX) newX = maxX;
      
      gsap.to(trackRef.current, { x: newX, duration: 0.5, ease: "power2.out" });
    }
  };
  
  const handlePrev = () => {
     if (carouselRef.current && trackRef.current) { // Check both refs
      const carouselWidth = carouselRef.current.offsetWidth;
      const currentX = gsap.getProperty(trackRef.current, "x") as number;
      
      let newX = currentX + carouselWidth;
      if (newX > 0) newX = 0;
      
      gsap.to(trackRef.current, { x: newX, duration: 0.5, ease: "power2.out" });
    }
  };
  
  const chevronLeftIcon = <IconWrapper name="FiChevronLeft" size={24} />;
  const chevronRightIcon = <IconWrapper name="FiChevronRight" size={24} />;
  
  return (
    // Use bg-gray-50 for light mode consistency
    <section ref={sectionRef} className="py-20 bg-gray-50 dark:bg-gray-900 opacity-100">
      <div className="container mx-auto px-4">
        <h2 
          ref={titleRef}
          className="text-3xl md:text-4xl font-bold text-center mb-16 text-primary dark:text-white"
        >
          What Our <span className="text-accent dark:text-accent-light">Partners</span> Say
        </h2>
        
        <div className="relative">
           {/* Carousel Navigation - conditional rendering based on content */}
          {testimonials.length > 1 && (
            <>
                <button 
                    className="absolute top-1/2 -left-4 md:-left-6 transform -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white dark:bg-gray-700 shadow-lg flex items-center justify-center text-primary dark:text-gray-300 hover:text-accent dark:hover:text-accent-light transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
                    onClick={handlePrev} aria-label="Previous Testimonial"
                >
                    {chevronLeftIcon}
                </button>
                <button 
                    className="absolute top-1/2 -right-4 md:-right-6 transform -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white dark:bg-gray-700 shadow-lg flex items-center justify-center text-primary dark:text-gray-300 hover:text-accent dark:hover:text-accent-light transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
                    onClick={handleNext} aria-label="Next Testimonial"
                >
                    {chevronRightIcon}
                </button>
            </>
          )}
          
          {/* Carousel */}
          <div 
            ref={carouselRef}
            className="overflow-hidden"
          >
            <div 
              ref={trackRef}
              // Add gap for spacing handled by padding on items now
              className="flex cursor-grab active:cursor-grabbing"
              style={{ touchAction: "pan-y" }} // Allow vertical scroll on touch
            >
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index}
                  // Adjust width and padding for spacing
                  className="flex-shrink-0 w-[90%] sm:w-[70%] md:w-[50%] lg:w-[33.33%] px-3"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8 h-full flex flex-col border border-gray-200 dark:border-gray-700">
                    {/* Optional Image/Placeholder */}
                    <div className="flex items-center mb-4">
                         {testimonial.image ? (
                            <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4 object-cover flex-shrink-0" />
                         ) : (
                            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mr-4 flex-shrink-0">
                                <IconWrapper name="FiUser" className="text-accent" size={24}/>
                            </div>
                         )}
                         <div className="overflow-hidden">
                            <p className="font-semibold text-primary dark:text-white truncate">{testimonial.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{testimonial.role}</p> {/* Use role prop */}
                         </div>
                    </div>
                     {/* Star Rating (Example - static 5 stars) */}
                     <div className="flex text-yellow-400 mb-4">
                        {/* Use IconWrapper or direct usage */}
                        {[...Array(5)].map((_, i) => <IconWrapper key={i} name="FiStar" className="fill-current w-4 h-4" />)}
                     </div>
                    {/* Quote */}
                    <blockquote className="mb-4 flex-grow italic text-gray-700 dark:text-gray-300 text-base">
                      "{testimonial.quote}"
                    </blockquote>
                    
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Mobile Navigation Dots - conditional rendering */}
          {testimonials.length > 1 && (
             <div className="flex justify-center space-x-2 mt-8">
                {/* Basic dots, functionality needs refinement if implementing proper slide-to */}
                {testimonials.map((_, index) => (
                <button 
                    key={index}
                    className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600 hover:bg-accent dark:hover:bg-accent-light focus:bg-accent dark:focus:bg-accent-light transition-colors opacity-75"
                    // onClick={() => scrollToCard(index)} // Add proper scroll logic later
                    aria-label={`Go to testimonial ${index + 1}`}
                />
                ))}
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default Testimonials; 