import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import { FiChevronLeft, FiChevronRight, FiStar } from 'react-icons/fi';
import IconWrapper from '../atoms/IconWrapper';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, Draggable);

interface Testimonial {
  quote: string;
  name: string;
  title: string;
  image: string;
}

const Testimonials: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  
  const testimonials: Testimonial[] = [
    {
      name: "Sarah Chen",
      title: "Real Estate Investor",
      quote: "Domentra helped me secure funding for my double close in just 3 days. Their network of lenders is impressive!",
      image: "/images/testimonials/sarah-chen.jpg"
    },
    {
      name: "Michael Ramirez",
      title: "Property Developer",
      quote: "I needed gap funding for a complex project, and Domentra matched me with the perfect lender. Highly recommend!",
      image: "/images/testimonials/michael-ramirez.jpg"
    },
    {
      name: "David Lee",
      title: "House Flipper",
      quote: "The EMD funding I received through Domentra allowed me to secure a competitive property before others could act.",
      image: "/images/testimonials/david-lee.jpg"
    },
    {
      name: "Jessica Nguyen",
      title: "Wholesaler",
      quote: "Working with Domentra was a game-changer for my investment strategy. Their private money loans have better terms than anything I found elsewhere.",
      image: "/images/testimonials/jessica-nguyen.jpg"
    }
  ];
  
  useEffect(() => {
    // Title animation
    if (titleRef.current) {
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 80%",
        }
      });
    }
    
    // Carousel animation
    if (carouselRef.current && trackRef.current) {
      const cards = trackRef.current.children;
      
      // Initial animation
      gsap.fromTo(cards, 
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          stagger: 0.1,
          duration: 0.8,
          scrollTrigger: {
            trigger: carouselRef.current,
            start: "top 80%"
          }
        }
      );
      
      // Set up Draggable
      const trackWidth = trackRef.current.scrollWidth;
      const carouselWidth = carouselRef.current.offsetWidth;
      const maxX = -(trackWidth - carouselWidth);
      
      Draggable.create(trackRef.current, {
        type: "x",
        bounds: { minX: maxX, maxX: 0 },
        edgeResistance: 0.85,
        throwProps: true,
        inertia: true
      });
    }
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
  
  // Carousel control functions
  const handleNext = () => {
    if (carouselRef.current && trackRef.current) {
      const carouselWidth = carouselRef.current.offsetWidth;
      const currentX = gsap.getProperty(trackRef.current, "x") as number;
      const trackWidth = trackRef.current.scrollWidth;
      const maxX = -(trackWidth - carouselWidth);
      
      // Calculate next position
      let newX = currentX - carouselWidth;
      
      // Ensure we don't exceed bounds
      if (newX < maxX) newX = maxX;
      
      // Animate to new position
      gsap.to(trackRef.current, {
        x: newX,
        duration: 0.5,
        ease: "power2.out"
      });
    }
  };
  
  const handlePrev = () => {
    if (trackRef.current) {
      const carouselWidth = carouselRef.current?.offsetWidth || 0;
      const currentX = gsap.getProperty(trackRef.current, "x") as number;
      
      // Calculate previous position
      let newX = currentX + carouselWidth;
      
      // Ensure we don't exceed bounds
      if (newX > 0) newX = 0;
      
      // Animate to new position
      gsap.to(trackRef.current, {
        x: newX,
        duration: 0.5,
        ease: "power2.out"
      });
    }
  };
  
  // Create icon element variables
  const chevronLeftIcon = <IconWrapper name="FiChevronLeft" size={24} />;
  const chevronRightIcon = <IconWrapper name="FiChevronRight" size={24} />;
  
  return (
    <section ref={sectionRef} className="py-20 bg-background">
      <div className="container">
        <h2 
          ref={titleRef}
          className="text-3xl md:text-4xl font-bold text-center mb-16"
        >
          What Our <span className="text-accent">Clients</span> Say
        </h2>
        
        <div className="relative">
          {/* Carousel Navigation */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-6 z-10 hidden md:block">
            <button 
              className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-primary hover:text-accent transition-colors"
              onClick={handlePrev}
            >
              {chevronLeftIcon}
            </button>
          </div>
          
          <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-6 z-10 hidden md:block">
            <button 
              className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-primary hover:text-accent transition-colors"
              onClick={handleNext}
            >
              {chevronRightIcon}
            </button>
          </div>
          
          {/* Carousel */}
          <div 
            ref={carouselRef}
            className="overflow-hidden"
          >
            <div 
              ref={trackRef}
              className="flex cursor-grab active:cursor-grabbing"
              style={{ touchAction: "none" }}
            >
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index}
                  className="min-w-[300px] md:min-w-[450px] px-4"
                >
                  <div className="bg-white rounded-lg shadow-lg p-8 h-full flex flex-col">
                    {/* Quote */}
                    <blockquote className="mb-6 flex-grow italic text-gray-700">
                      "{testimonial.quote}"
                    </blockquote>
                    
                    {/* Author */}
                    <div>
                      <p className="font-bold text-primary">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Mobile Navigation Dots */}
          <div className="flex justify-center space-x-2 mt-8 md:hidden">
            {testimonials.map((_, index) => (
              <button 
                key={index}
                className="w-3 h-3 rounded-full bg-gray-300 hover:bg-accent transition-colors"
                onClick={() => {
                  // Scroll to specific testimonial on mobile
                  if (trackRef.current && carouselRef.current) {
                    const cardWidth = 300; // min-w-[300px]
                    gsap.to(trackRef.current, {
                      x: -(cardWidth + 16) * index, // 16 = px-4*2
                      duration: 0.5,
                      ease: "power2.out"
                    });
                  }
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 