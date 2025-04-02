import React, { useState } from 'react';
import FundingTypePage from '../components/templates/FundingTypePage';
import EMDForm from '../components/organisms/EMDForm';

const EMD: React.FC = () => {
  // EMD Calculator state
  const [propertyPrice, setPropertyPrice] = useState<string>('500000');
  const [emdPercent, setEmdPercent] = useState<string>('3');
  const [fundingPercent, setFundingPercent] = useState<string>('100');
  
  // Calculate values
  const calculateValues = () => {
    const propertyValue = parseFloat(propertyPrice) || 0;
    const emdPercentValue = parseFloat(emdPercent) || 0;
    const fundingPercentValue = parseFloat(fundingPercent) || 0;
    
    const emdAmount = (propertyValue * (emdPercentValue / 100));
    const fundingAmount = (emdAmount * (fundingPercentValue / 100));
    const outOfPocketAmount = emdAmount - fundingAmount;
    
    return {
      emdAmount: emdAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      fundingAmount: fundingAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      outOfPocketAmount: outOfPocketAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
    };
  };
  
  const { emdAmount, fundingAmount, outOfPocketAmount } = calculateValues();
  
  const benefits = [
    {
      title: "Fast Funding",
      description: "Get your earnest money deposit funded within 24-48 hours to secure hot deals quickly."
    },
    {
      title: "No Personal Guarantees",
      description: "Our EMD funding solutions are secured by the property, not your personal assets."
    },
    {
      title: "100% Financing",
      description: "We can fund up to 100% of your earnest money deposit to preserve your working capital."
    },
    {
      title: "Non-Refundable EMD Protection",
      description: "Safeguard against lost deposits with our specialized funding protection plans."
    },
    {
      title: "Streamlined Process",
      description: "Simple application and quick approval process to meet tight contract deadlines."
    },
    {
      title: "No Credit Checks",
      description: "We focus on the property deal rather than your personal credit history."
    }
  ];
  
  const process = [
    {
      number: 1,
      title: "Submit Deal Information",
      description: "Share your purchase contract, property details, and desired EMD amount with our team."
    },
    {
      number: 2,
      title: "Fast Underwriting",
      description: "Our team will quickly review the property and deal terms to approve your EMD funding."
    },
    {
      number: 3,
      title: "Funding Approval",
      description: "Receive a funding commitment for your earnest money deposit, typically within 24 hours."
    },
    {
      number: 4,
      title: "EMD Transfer",
      description: "We'll transfer the funds directly to the escrow or title company to secure your deal."
    }
  ];
  
  const faqs = [
    {
      question: "What is EMD funding?",
      answer: "EMD (Earnest Money Deposit) funding is a financial solution that provides the capital needed for the deposit that secures a real estate contract. This allows investors to secure properties without using their own capital."
    },
    {
      question: "How much EMD will you fund?",
      answer: "Domentra can fund up to 100% of your earnest money deposit, depending on the deal's specifics and property valuation."
    },
    {
      question: "How quickly can I get EMD funding?",
      answer: "In most cases, we can arrange funding within 24-48 hours of submission, allowing you to meet tight contract deadlines."
    },
    {
      question: "What if I lose my earnest money deposit?",
      answer: "Our EMD protection plans can help mitigate risks associated with non-refundable earnest money deposits, depending on the circumstances and terms of your funding agreement."
    },
    {
      question: "What documentation do I need to provide for EMD funding?",
      answer: "Typically, you'll need to provide the purchase contract, property information, preliminary title report (if available), and your exit strategy. Our team will guide you through the specific requirements."
    }
  ];
  
  // EMD protection plans
  const protectionPlans = [
    {
      title: "Basic Protection",
      coverage: "50%",
      description: "Covers 50% of your earnest money deposit if the deal falls through due to property condition issues discovered during inspection.",
      cost: "1% of deposit amount",
      bestFor: "First-time investors or those working with relatively stable deals"
    },
    {
      title: "Advanced Protection",
      coverage: "75%",
      description: "Covers 75% of your earnest money deposit for a broader range of issues, including financing contingencies and appraisal shortfalls.",
      cost: "2% of deposit amount",
      bestFor: "Experienced investors working with moderately complex deals"
    },
    {
      title: "Premium Protection",
      coverage: "100%",
      description: "Full coverage for your earnest money deposit against nearly all potential risks, including seller non-performance and title issues.",
      cost: "3% of deposit amount",
      bestFor: "Professional investors making large deposits on high-value properties"
    }
  ];
  
  // Visual guides
  const visualGuides = [
    {
      image: "https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      title: "Finding Your Deal",
      description: "Locate an investment property with good potential and negotiate terms with the seller."
    },
    {
      image: "https://images.unsplash.com/photo-1621610868556-12c0bc49f84b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80", 
      title: "Securing with EMD",
      description: "Use our EMD funding to secure the property without tying up your own capital."
    },
    {
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      title: "Conducting Due Diligence",
      description: "Complete inspections and research while your EMD holds the property."
    },
    {
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      title: "Closing the Deal",
      description: "Successfully close the transaction or sell the contract to another investor."
    }
  ];
  
  // Custom sections to pass to the FundingTypePage
  const customSections = (
    <>
      {/* EMD Calculator Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            EMD <span className="text-accent">Calculator</span>
          </h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
            Use our calculator to determine how much earnest money deposit you'll need for your next deal, and how much Domentra can fund for you.
          </p>
          
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-10 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Input Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold mb-4">Enter Your Details</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Purchase Price
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      value={propertyPrice}
                      onChange={(e) => setPropertyPrice(e.target.value)}
                      className="block w-full rounded-md border-gray-300 pl-8 pr-12 focus:border-accent focus:ring-accent"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Earnest Money Deposit Percentage
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <input
                      type="number"
                      value={emdPercent}
                      onChange={(e) => setEmdPercent(e.target.value)}
                      min="0.1"
                      max="20"
                      step="0.1"
                      className="block w-full rounded-md border-gray-300 pr-12 focus:border-accent focus:ring-accent"
                      placeholder="3"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-gray-500 sm:text-sm">%</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Funding Percentage from Domentra
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <input
                      type="number"
                      value={fundingPercent}
                      onChange={(e) => setFundingPercent(e.target.value)}
                      min="0"
                      max="100"
                      className="block w-full rounded-md border-gray-300 pr-12 focus:border-accent focus:ring-accent"
                      placeholder="100"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-gray-500 sm:text-sm">%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Results Section */}
              <div className="bg-primary/5 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Your Results</h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Total Earnest Money Deposit Required:</p>
                    <p className="text-2xl font-bold text-primary">{emdAmount}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Amount Funded by Domentra:</p>
                    <p className="text-2xl font-bold text-accent">{fundingAmount}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Your Out-of-Pocket Cost:</p>
                    <p className="text-2xl font-bold text-gray-700">{outOfPocketAmount}</p>
                  </div>
                  
                  <div className="pt-4 mt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      With Domentra's EMD funding, you can secure properties with minimal cash outlay, preserving your capital for other investments or improvements.
                    </p>
                  </div>
                  
                  <div className="pt-4">
                    <a href="/contact?type=emd" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-accent hover:bg-accent/90">
                      Apply Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Visual Guide Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            EMD Funding <span className="text-accent">Visual Guide</span>
          </h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
            See how our EMD funding process works from start to finish with this visual step-by-step guide.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {visualGuides.map((guide, index) => (
              <div key={index} className="overflow-hidden rounded-lg shadow-lg bg-white">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={guide.image} 
                    alt={guide.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                  />
                  <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold shadow-lg">
                    {index + 1}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold mb-2">{guide.title}</h3>
                  <p className="text-gray-600 text-sm">{guide.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Protection Plans Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            EMD <span className="text-accent">Protection Plans</span>
          </h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
            Our unique EMD protection plans provide peace of mind by safeguarding your earnest money deposits against common deal-breaking scenarios.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {protectionPlans.map((plan, index) => (
              <div 
                key={index} 
                className={`rounded-xl shadow-lg p-8 ${
                  index === 1 ? 'bg-accent text-white ring-4 ring-accent/20 transform md:-translate-y-4' : 'bg-white'
                }`}
              >
                <div className={`inline-flex rounded-full px-3 py-1 text-xs font-medium mb-4 ${
                  index === 1 ? 'bg-white text-accent' : 'bg-accent/10 text-accent'
                }`}>
                  {plan.coverage} Coverage
                </div>
                
                <h3 className={`text-xl font-bold mb-2 ${index === 1 ? 'text-white' : 'text-primary'}`}>
                  {plan.title}
                </h3>
                
                <p className={`text-sm mb-4 ${index === 1 ? 'text-white/90' : 'text-gray-600'}`}>
                  {plan.description}
                </p>
                
                <div className={`border-t ${index === 1 ? 'border-white/20' : 'border-gray-200'} pt-4 mt-4`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm ${index === 1 ? 'text-white/80' : 'text-gray-500'}`}>Cost:</span>
                    <span className="font-medium">{plan.cost}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${index === 1 ? 'text-white/80' : 'text-gray-500'}`}>Best for:</span>
                    <span className="text-sm">{plan.bestFor}</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <a 
                    href="/contact?type=emd" 
                    className={`block w-full text-center py-3 rounded-lg font-medium ${
                      index === 1 
                        ? 'bg-white text-accent hover:bg-gray-50' 
                        : 'bg-accent text-white hover:bg-accent/90'
                    }`}
                  >
                    {index === 1 ? 'Recommended' : 'Select Plan'}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add the EMD Form Section */}
      <section id="apply-form" className="py-20 bg-background">
        <div className="container">
          <EMDForm />
        </div>
      </section>
    </>
  );
  
  return (
    <FundingTypePage 
      title="Earnest Money Deposit Funding"
      subtitle="Secure Properties Without Using Your Capital"
      description="Our EMD funding solutions allow you to lock in promising real estate deals quickly without depleting your cash reserves."
      benefits={benefits}
      process={process}
      faqs={faqs}
      backgroundImage="https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1650&q=80"
      ctaText="Apply for EMD Funding"
      ctaLink="#apply-form"
      customSections={customSections}
    />
  );
};

export default EMD; 