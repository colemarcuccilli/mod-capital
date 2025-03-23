import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Button from '../components/atoms/Button';
import gsap from 'gsap';

interface FormValues {
  name: string;
  email: string;
  phone: string;
  fundingType: string;
  message: string;
  amount: string;
  timeline: string;
}

const Contact: React.FC = () => {
  const location = useLocation();
  const formRef = useRef<HTMLFormElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  
  // Parse query parameters to pre-select funding type
  const queryParams = new URLSearchParams(location.search);
  const fundingTypeParam = queryParams.get('type');
  
  const [formValues, setFormValues] = useState<FormValues>({
    name: '',
    email: '',
    phone: '',
    fundingType: fundingTypeParam || 'general',
    message: '',
    amount: '',
    timeline: ''
  });
  
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  useEffect(() => {
    // Animation for header
    if (headerRef.current) {
      gsap.from(headerRef.current.children, {
        y: 30,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "power2.out"
      });
    }
    
    // Animation for form
    if (formRef.current) {
      const formElements = formRef.current.querySelectorAll('.form-animate');
      gsap.from(formElements, {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        delay: 0.4
      });
    }
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    // Basic form validation
    if (!formValues.name || !formValues.email) {
      setFormError('Please fill in all required fields');
      return;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formValues.email)) {
      setFormError('Please enter a valid email address');
      return;
    }
    
    // Simulate form submission
    console.log('Form submitted:', formValues);
    
    // In a real application, you'd send the form data to your backend here
    // For demonstration purposes, we'll just show a success message
    setFormSubmitted(true);
  };
  
  const fundingOptions = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'double-close', label: 'Double Close Funding' },
    { value: 'emd', label: 'Earnest Money Deposit (EMD) Funding' },
    { value: 'gap', label: 'Gap Funding' },
    { value: 'private-money', label: 'Private Money Loans' }
  ];
  
  const timelineOptions = [
    { value: 'asap', label: 'As soon as possible (urgent)' },
    { value: '1-2-weeks', label: '1-2 weeks' },
    { value: '2-4-weeks', label: '2-4 weeks' },
    { value: '1-3-months', label: '1-3 months' },
    { value: 'flexible', label: 'Flexible / Not time-sensitive' }
  ];
  
  return (
    <div className="bg-background py-20">
      <div className="container">
        <div ref={headerRef} className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-lg text-gray-600 mb-8">
            Ready to discuss your funding needs? Fill out the form below and one of our funding specialists will contact you within 24 hours.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Contact Info Panel */}
              <div className="bg-primary text-white p-8 md:p-12 md:w-2/5">
                <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-accent font-semibold mb-1">Address</h4>
                    <p>1234 Finance Avenue, Suite 500<br />Miami, FL 33101</p>
                  </div>
                  
                  <div>
                    <h4 className="text-accent font-semibold mb-1">Email</h4>
                    <p>funding@modcapital.com</p>
                  </div>
                  
                  <div>
                    <h4 className="text-accent font-semibold mb-1">Phone</h4>
                    <p>(800) 555-FUND</p>
                  </div>
                  
                  <div>
                    <h4 className="text-accent font-semibold mb-1">Hours</h4>
                    <p>Monday - Friday: 8am - 6pm EST<br />Saturday: 10am - 2pm EST</p>
                  </div>
                </div>
                
                <div className="mt-12">
                  <h4 className="text-accent font-semibold mb-2">Connect With Us</h4>
                  <div className="flex space-x-4">
                    <a href="#" className="hover:text-accent transition-colors">
                      <span className="sr-only">Facebook</span>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a href="#" className="hover:text-accent transition-colors">
                      <span className="sr-only">Twitter</span>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                    <a href="#" className="hover:text-accent transition-colors">
                      <span className="sr-only">LinkedIn</span>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Contact Form */}
              <div className="p-8 md:p-12 md:w-3/5">
                {formSubmitted ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500 mb-6">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Thank You!</h3>
                    <p className="text-gray-600 mb-6">
                      Your message has been received. One of our funding specialists will contact you within 24 hours.
                    </p>
                    <Button
                      variant="primary"
                      onClick={() => setFormSubmitted(false)}
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                    <h3 className="text-2xl font-bold mb-6">Send Us a Message</h3>
                    
                    {formError && (
                      <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
                        {formError}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="form-animate">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Your Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formValues.name}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent"
                          required
                        />
                      </div>
                      
                      <div className="form-animate">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formValues.email}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="form-animate">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formValues.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent"
                        />
                      </div>
                      
                      <div className="form-animate">
                        <label htmlFor="fundingType" className="block text-sm font-medium text-gray-700 mb-1">
                          Funding Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="fundingType"
                          name="fundingType"
                          value={formValues.fundingType}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent"
                          required
                        >
                          {fundingOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="form-animate">
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                          Funding Amount Needed
                        </label>
                        <input
                          type="text"
                          id="amount"
                          name="amount"
                          value={formValues.amount}
                          onChange={handleChange}
                          placeholder="e.g. $250,000"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent"
                        />
                      </div>
                      
                      <div className="form-animate">
                        <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-1">
                          Timeline
                        </label>
                        <select
                          id="timeline"
                          name="timeline"
                          value={formValues.timeline}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent"
                        >
                          <option value="">Select timeline</option>
                          {timelineOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="form-animate">
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formValues.message}
                        onChange={handleChange}
                        rows={5}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent"
                        required
                      ></textarea>
                    </div>
                    
                    <div className="form-animate">
                      <Button 
                        type="submit"
                        variant="primary"
                        className="w-full md:w-auto"
                      >
                        Send Message
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 