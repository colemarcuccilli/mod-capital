import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Button from '../atoms/Button';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiCheckCircle } from 'react-icons/fi';
import IconWrapper from '../atoms/IconWrapper';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface Benefit {
  title: string;
  description: string;
}

interface ProcessStep {
  number: number;
  title: string;
  description: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface FundingTypePageProps {
  title: string;
  subtitle: string;
  description: string;
  benefits: Benefit[];
  process: ProcessStep[];
  faqs: FAQ[];
  backgroundImage: string;
  ctaText?: string;
  ctaLink?: string;
  customSections?: React.ReactNode;
}

const FundingTypePage: React.FC<FundingTypePageProps> = ({
  title,
  subtitle,
  description,
  benefits,
  process,
  faqs,
  backgroundImage,
  ctaText = "Apply Now",
  ctaLink = "/contact",
  customSections
}) => {
  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const faqsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Hero section animations
    if (titleRef.current && subtitleRef.current && descriptionRef.current && ctaRef.current) {
      // Hero timeline
      const heroTl = gsap.timeline();
      
      // Animate title with a simple fade in
      heroTl.from(titleRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8
      });
      
      // Fade in subtitle and description
      heroTl.from(subtitleRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.6
      }, "-=0.4");
      
      heroTl.from(descriptionRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.6
      }, "-=0.4");
      
      // Bounce the CTA button
      heroTl.from(ctaRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        onComplete: () => {
          // Add bounce effect after initial animation
          gsap.to(ctaRef.current, {
            y: "-=10",
            repeat: 1,
            yoyo: true,
            duration: 0.3,
            ease: "power1.inOut"
          });
        }
      }, "-=0.2");
    }
    
    // Benefits section animations
    if (benefitsRef.current && benefitsRef.current.children.length > 0) {
      const benefits = Array.from(benefitsRef.current.children);
      
      benefits.forEach((benefit, index) => {
        const direction = index % 2 === 0 ? -100 : 100;
        
        gsap.from(benefit, {
          opacity: 0,
          x: direction,
          duration: 0.8,
          scrollTrigger: {
            trigger: benefit,
            start: "top 75%",
          }
        });
      });
    }
    
    // Process section animations
    if (processRef.current && processRef.current.children.length > 0) {
      const steps = Array.from(processRef.current.children);
      
      gsap.from(steps, {
        opacity: 0,
        y: 50,
        stagger: 0.2,
        duration: 0.8,
        scrollTrigger: {
          trigger: processRef.current,
          start: "top 70%",
        }
      });
    }
    
    // FAQs section animations
    if (faqsRef.current && faqsRef.current.children.length > 0) {
      const faqs = Array.from(faqsRef.current.children);
      
      gsap.from(faqs, {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.6,
        scrollTrigger: {
          trigger: faqsRef.current,
          start: "top 75%",
        }
      });
    }
    
    return () => {
      // Clean up all ScrollTrigger instances
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [title]);
  
  // Create icon element
  const checkCircleIcon = <IconWrapper name="FiCheckCircle" size={32} className="text-accent" />;
  
  return (
    <div ref={pageRef}>
      {/* Hero Section */}
      <div 
        ref={heroRef}
        className="relative min-h-[80vh] flex items-center pt-24 pb-16"
      >
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-primary/70"></div>
        </div>
        
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 
              ref={titleRef}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
            >
              {title}
            </h1>
            
            <h2 
              ref={subtitleRef}
              className="text-2xl md:text-3xl font-semibold mb-6"
            >
              {subtitle}
            </h2>
            
            <p 
              ref={descriptionRef}
              className="text-lg md:text-xl text-white/90 mb-10"
            >
              {description}
            </p>
            
            <div ref={ctaRef}>
              <Button 
                variant="primary"
                className="text-lg px-8 py-4"
                onClick={() => window.location.href = ctaLink}
              >
                {ctaText}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Key <span className="text-accent">Benefits</span>
          </h2>
          
          <div 
            ref={benefitsRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="bg-background rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-6 mx-auto">
                  {checkCircleIcon}
                </div>
                
                <h3 className="text-xl font-bold text-center mb-4">{benefit.title}</h3>
                <p className="text-gray-600 text-center">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Process Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            How It <span className="text-accent">Works</span>
          </h2>
          
          <div 
            ref={processRef}
            className="max-w-4xl mx-auto space-y-12"
          >
            {process.map((step, index) => (
              <div 
                key={index}
                className="flex flex-col md:flex-row items-center md:items-start gap-6"
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold">
                    {step.number}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* FAQs Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Frequently Asked <span className="text-accent">Questions</span>
          </h2>
          
          <div 
            ref={faqsRef}
            className="max-w-4xl mx-auto space-y-6"
          >
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-background rounded-lg shadow-md overflow-hidden"
              >
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer p-6 font-bold">
                    <span>{faq.question}</span>
                    <span className="transition-transform group-open:rotate-180">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        strokeWidth={1.5} 
                        stroke="currentColor" 
                        className="w-6 h-6"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </span>
                  </summary>
                  
                  <div className="p-6 pt-0 text-gray-600">
                    {faq.answer}
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Add custom sections if provided */}
      {customSections}
      
      {/* Final CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          
          <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto">
            Take the first step toward securing the funding you need for your next real estate project.
          </p>
          
          <Button 
            variant="primary"
            className="text-lg px-8 py-4 bg-accent"
            onClick={() => window.location.href = ctaLink}
          >
            {ctaText}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default FundingTypePage; 