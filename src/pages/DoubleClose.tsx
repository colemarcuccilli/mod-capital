import React from 'react';
import FundingTypePage from '../components/templates/FundingTypePage';
import IconWrapper from '../components/atoms/IconWrapper';
import { FiCheckCircle, FiDollarSign, FiTrendingUp, FiCalendar, FiHome, FiFileText, FiSearch } from 'react-icons/fi';

const DoubleClose: React.FC = () => {
  const benefits = [
    {
      title: "Quick Turnaround",
      description: "Get funding for your double close transactions in as little as 48 hours."
    },
    {
      title: "Flexible Terms",
      description: "Customized financing solutions tailored to your specific transaction needs."
    },
    {
      title: "No Income Verification",
      description: "We focus on the property value and deal structure, not your personal income."
    },
    {
      title: "Higher Leverage",
      description: "Finance up to 100% of the purchase price in certain situations."
    },
    {
      title: "No Pre-Payment Penalties",
      description: "Pay off the loan early without incurring additional fees or penalties."
    },
    {
      title: "Trusted Network",
      description: "Access our vetted network of private lenders specializing in double close transactions."
    }
  ];
  
  const process = [
    {
      number: 1,
      title: "Submit Your Deal Details",
      description: "Share information about both transactions, including property details, purchase prices, and timeline."
    },
    {
      number: 2,
      title: "Get Matched With Lenders",
      description: "We'll connect you with lenders experienced in double closing who can meet your specific needs."
    },
    {
      number: 3,
      title: "Review Funding Options",
      description: "Compare terms, rates, and conditions from multiple lenders to find the best fit for your transaction."
    },
    {
      number: 4,
      title: "Finalize Funding for Both Closings",
      description: "Close on both transactions simultaneously with our streamlined funding process."
    }
  ];
  
  const faqs = [
    {
      question: "What is a double close in real estate?",
      answer: "A double close (also known as a simultaneous closing or back-to-back closing) is a transaction where an investor purchases a property and then immediately resells it to an end buyer. Both transactions happen very close together, sometimes on the same day."
    },
    {
      question: "How fast can I get funded for a double close?",
      answer: "With Domentra, funding for double close transactions can be arranged in as little as 48 hours, depending on the complexity of the deal and documentation readiness."
    },
    {
      question: "Do I need good credit to qualify for double close funding?",
      answer: "While credit is considered, it's not the primary factor. Our lenders focus more on the quality of the deal, the property value, and your exit strategy rather than personal credit history."
    },
    {
      question: "What documentation do I need to provide?",
      answer: "Typically, you'll need to provide details on both properties, purchase agreements, proof of funds for your buyer, estimates of repair costs (if applicable), and your exit strategy. Our team will guide you through the specific requirements."
    },
    {
      question: "How much does double close funding cost?",
      answer: "Costs vary based on the transaction size, risk level, and timeline. Generally, you can expect interest rates between 8-12% and origination fees of 1-3 points. We provide transparent pricing with no hidden fees."
    }
  ];
  
  // Case study data
  const caseStudy = {
    title: "How We Helped John Close a $450K Deal Without Using His Own Capital",
    problem: "John found a distressed property with significant equity potential but lacked the capital to close the deal. He had already lined up an end buyer willing to pay $450,000, but needed to secure the initial purchase at $375,000.",
    solution: "We provided John with 100% financing for his initial purchase, allowing him to complete both transactions on the same day.",
    results: [
      "John made $75,000 profit without using any of his own funds",
      "Both transactions closed within 10 days of application",
      "No income verification or extensive credit checks required",
      "Property transferred smoothly with minimal paperwork"
    ],
    quote: "Domentra made my first double close deal possible. Without their funding, I would have missed out on a $75K profit opportunity. Their process was fast, transparent, and straightforward.",
    author: "John D., Real Estate Investor"
  };
  
  // Transaction flow illustration steps
  const transactionFlow = [
    {
      icon: <IconWrapper name="FiHome" size={32} className="text-accent" />,
      title: "Property Acquisition",
      description: "You secure a property at below market value from a motivated seller (A → B transaction)"
    },
    {
      icon: <IconWrapper name="FiDollarSign" size={32} className="text-accent" />,
      title: "Domentra Funding",
      description: "We provide the capital to fund your purchase with quick approval and minimal documentation"
    },
    {
      icon: <IconWrapper name="FiTrendingUp" size={32} className="text-accent" />,
      title: "Sale to End Buyer",
      description: "You immediately sell the property to your end buyer at a higher price (B → C transaction)"
    },
    {
      icon: <IconWrapper name="FiCalendar" size={32} className="text-accent" />,
      title: "Same-Day Closing",
      description: "Both transactions close simultaneously or within a very short timeframe"
    },
    {
      icon: <IconWrapper name="FiCheckCircle" size={32} className="text-accent" />,
      title: "Profit & Repayment",
      description: "You collect your profit and repay the funding, often with no money out of pocket"
    }
  ];
  
  // Custom sections to pass to the FundingTypePage
  const customSections = (
    <>
      {/* Transaction Flow Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Double Close <span className="text-accent">Transaction Flow</span>
          </h2>
          
          <div className="relative max-w-5xl mx-auto">
            {/* Connection Line */}
            <div className="absolute left-[30px] md:left-1/2 top-10 bottom-10 w-1 md:w-[1px] bg-accent/30 z-0 md:transform md:-translate-x-1/2"></div>
            
            {/* Flow Steps */}
            <div className="space-y-12">
              {transactionFlow.map((step, index) => (
                <div 
                  key={index} 
                  className={`relative flex flex-col md:flex-row items-start md:items-center gap-8 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center z-10">
                    {step.icon}
                  </div>
                  
                  {/* Content */}
                  <div className={`bg-white p-6 rounded-xl shadow-md max-w-lg ${
                    index % 2 === 0 ? 'md:text-left' : 'md:text-right'
                  }`}>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Case Study Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Real <span className="text-accent">Success Story</span>
          </h2>
          
          <div className="bg-primary/5 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-6">{caseStudy.title}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h4 className="text-lg font-semibold text-primary mb-3">The Challenge</h4>
                <p className="text-gray-700">{caseStudy.problem}</p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-primary mb-3">Our Solution</h4>
                <p className="text-gray-700">{caseStudy.solution}</p>
              </div>
            </div>
            
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-primary mb-3">The Results</h4>
              <ul className="space-y-2">
                {caseStudy.results.map((result, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 text-accent mr-2">✓</span>
                    <span className="text-gray-700">{result}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <blockquote className="border-l-4 border-accent pl-4 italic text-gray-700 mb-4">
              "{caseStudy.quote}"
            </blockquote>
            
            <p className="text-right font-medium">— {caseStudy.author}</p>
          </div>
        </div>
      </section>
    </>
  );
  
  return (
    <FundingTypePage 
      title="Double Close Funding Solutions"
      subtitle="Fund Two Transactions Seamlessly"
      description="Our double close funding solutions allow you to close on the purchase and sale of a property simultaneously, without using your own capital."
      benefits={benefits}
      process={process}
      faqs={faqs}
      backgroundImage="https://images.unsplash.com/photo-1560518883-f2b94d7a3e2e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1673&q=80"
      ctaText="Apply for Double Close Funding"
      ctaLink="/contact?type=double-close"
      customSections={customSections}
    />
  );
};

export default DoubleClose; 