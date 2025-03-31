import React, { useState } from 'react';
import FundingTypePage from '../components/templates/FundingTypePage';
import IconWrapper from '../components/atoms/IconWrapper';

const PrivateMoney: React.FC = () => {
  // State for active loan type tab
  const [activeTab, setActiveTab] = useState<string>('fix-and-flip');
  
  const benefits = [
    {
      title: "Rapid Funding",
      description: "Access private money loans in as little as 7-10 days, versus 30-45 days with conventional lenders."
    },
    {
      title: "Flexible Qualification Criteria",
      description: "Get approved based primarily on the property value and deal strength, not just your credit score."
    },
    {
      title: "Customized Loan Terms",
      description: "Benefit from loan structures tailored to your specific project needs and timeline."
    },
    {
      title: "Higher Leverage Options",
      description: "Finance up to 80-90% of the property value, depending on the project type and location."
    },
    {
      title: "Interest-Only Payments",
      description: "Maximize cash flow with interest-only payment options during the loan term."
    },
    {
      title: "No Limit on Properties",
      description: "Finance unlimited properties without the restrictions imposed by conventional lenders."
    }
  ];
  
  const process = [
    {
      number: 1,
      title: "Submit Your Loan Request",
      description: "Complete our simple application with details about your project, funding needs, and timeline."
    },
    {
      number: 2,
      title: "Property Evaluation",
      description: "Our team assesses the property value and project viability to structure the right loan terms."
    },
    {
      number: 3,
      title: "Lender Matching",
      description: "We connect you with private lenders from our extensive network who specialize in your project type."
    },
    {
      number: 4,
      title: "Loan Closing",
      description: "Receive your funds quickly with our streamlined closing process, often completed in days, not weeks."
    }
  ];
  
  const faqs = [
    {
      question: "What are private money loans?",
      answer: "Private money loans are funding provided by individual investors or private lending companies, rather than traditional financial institutions like banks. These loans typically offer more flexibility, faster funding, and less stringent qualification requirements."
    },
    {
      question: "What types of properties can be funded with private money?",
      answer: "Our private money lenders fund residential, commercial, and mixed-use properties. This includes single-family homes, multi-family apartments, retail spaces, office buildings, industrial properties, and land development projects."
    },
    {
      question: "What are typical interest rates for private money loans?",
      answer: "Interest rates typically range from 7% to 12%, depending on factors such as property type, loan-to-value ratio, borrower experience, and project risk assessment. We always strive to secure the most competitive rates possible."
    },
    {
      question: "What loan terms are available?",
      answer: "Private money loans are generally short to medium-term, ranging from 6 months to 5 years. Most commonly, we arrange 1-2 year terms for renovation projects and 2-3 year terms for stabilized income-producing properties."
    },
    {
      question: "Do I need perfect credit to qualify?",
      answer: "No. While credit is considered, private money lenders focus more on the property's value, your equity position, and the overall strength of the deal. We regularly secure funding for borrowers with past credit challenges."
    },
    {
      question: "How much down payment is required?",
      answer: "Typically, private money loans require 10-20% down payment or equity in the property. However, this varies based on property type, location, and overall deal structure. Some deals may qualify for higher leverage options."
    }
  ];
  
  // Sample loan types and their details
  const loanTypes = [
    {
      id: 'fix-and-flip',
      title: 'Fix & Flip Loans',
      description: 'Short-term financing for purchasing and renovating properties with the intent to sell for profit.',
      terms: {
        ltv: 'Up to 85% of Purchase + 100% of Rehab',
        rates: '8.5% - 11%',
        terms: '6-18 months',
        closingTime: '7-10 business days',
        fees: '1.5-2.5 points',
        minLoan: '$50,000',
        maxLoan: '$2,500,000'
      }
    },
    {
      id: 'rental',
      title: 'Rental Property Loans',
      description: 'Longer-term financing for buy-and-hold investors looking to build a portfolio of income-producing properties.',
      terms: {
        ltv: 'Up to 80% LTV',
        rates: '7.5% - 9.5%',
        terms: '1-5 years',
        closingTime: '10-14 business days',
        fees: '1-2 points',
        minLoan: '$75,000',
        maxLoan: '$5,000,000'
      }
    },
    {
      id: 'commercial',
      title: 'Commercial Property Loans',
      description: 'Financing for retail, office, industrial, and mixed-use properties with flexible terms for investors.',
      terms: {
        ltv: 'Up to 75% LTV',
        rates: '9% - 12%',
        terms: '1-3 years',
        closingTime: '14-21 business days',
        fees: '2-3 points',
        minLoan: '$200,000',
        maxLoan: '$10,000,000'
      }
    },
    {
      id: 'construction',
      title: 'New Construction Loans',
      description: 'Ground-up construction financing for developers building residential or commercial properties.',
      terms: {
        ltv: 'Up to 70% LTC',
        rates: '10% - 13%',
        terms: '12-24 months',
        closingTime: '14-21 business days',
        fees: '2.5-3.5 points',
        minLoan: '$250,000',
        maxLoan: '$7,500,000'
      }
    }
  ];
  
  // Our network of lenders
  const lenders = [
    {
      name: 'Peninsula Capital Partners',
      specialty: 'Residential Fix & Flip',
      experience: '15+ years',
      fundedDeals: '2,500+',
      minLoanSize: '$50,000',
      maxLoanSize: '$2.5M',
      states: 'FL, TX, GA, NC, SC',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80'
    },
    {
      name: 'Highridge Capital Group',
      specialty: 'Multi-Family & Commercial',
      experience: '20+ years',
      fundedDeals: '1,200+',
      minLoanSize: '$200,000',
      maxLoanSize: '$10M',
      states: 'Nationwide',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80'
    },
    {
      name: 'Eastcoast Funding Solutions',
      specialty: 'New Construction',
      experience: '12+ years',
      fundedDeals: '800+',
      minLoanSize: '$250,000',
      maxLoanSize: '$7.5M',
      states: 'East Coast States',
      avatar: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80'
    },
    {
      name: 'Westwood Equity Partners',
      specialty: 'Rental Portfolios',
      experience: '10+ years',
      fundedDeals: '1,500+',
      minLoanSize: '$75,000',
      maxLoanSize: '$5M',
      states: 'West Coast States',
      avatar: 'https://images.unsplash.com/photo-1573497620476-1a0548083c9f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80'
    }
  ];
  
  // Real loan examples
  const loanExamples = [
    {
      type: 'Fix & Flip',
      location: 'Miami, FL',
      purchasePrice: '$575,000',
      rehabCost: '$125,000',
      loanAmount: '$630,000',
      term: '12 months',
      rate: '9.25%',
      points: '2.0',
      arv: '$875,000',
      timeToClose: '8 days',
      image: 'https://images.unsplash.com/photo-1511840831748-5700e0a68ffc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
    },
    {
      type: 'Rental Property Portfolio',
      location: 'Dallas, TX',
      purchasePrice: '$1,200,000',
      rehabCost: '$0',
      loanAmount: '$960,000',
      term: '30 months',
      rate: '8.5%',
      points: '1.5',
      arv: '$1,250,000',
      timeToClose: '12 days',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
    },
    {
      type: 'Commercial Mixed-Use',
      location: 'Chicago, IL',
      purchasePrice: '$2,500,000',
      rehabCost: '$350,000',
      loanAmount: '$2,100,000',
      term: '24 months',
      rate: '10.25%',
      points: '2.5',
      arv: '$3,250,000',
      timeToClose: '18 days',
      image: 'https://images.unsplash.com/photo-1577412647305-991150c7d163?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
    },
    {
      type: 'New Construction',
      location: 'Phoenix, AZ',
      purchasePrice: '$400,000',
      rehabCost: '$950,000',
      loanAmount: '$950,000',
      term: '18 months',
      rate: '11.5%',
      points: '3.0',
      arv: '$1,750,000',
      timeToClose: '21 days',
      image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
    }
  ];
  
  // Custom sections to pass to the FundingTypePage
  const customSections = (
    <>
      {/* Loan Types Section with Tabs */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Private Money <span className="text-accent">Loan Types</span>
          </h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
            Explore our various private money loan options designed for different real estate investment strategies.
          </p>
          
          {/* Tabs Navigation */}
          <div className="flex flex-wrap justify-center mb-10">
            {loanTypes.map((loan) => (
              <button
                key={loan.id}
                className={`px-6 py-3 text-sm font-medium rounded-lg m-1 transition-colors ${
                  activeTab === loan.id 
                    ? 'bg-accent text-white shadow-md' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab(loan.id)}
              >
                {loan.title}
              </button>
            ))}
          </div>
          
          {/* Tab Content */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
            {loanTypes.map((loan) => (
              <div 
                key={loan.id} 
                className={`${activeTab === loan.id ? 'block' : 'hidden'}`}
              >
                <div className="bg-primary text-white p-6">
                  <h3 className="text-2xl font-bold mb-2">{loan.title}</h3>
                  <p>{loan.description}</p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4">
                    <div>
                      <h4 className="text-sm text-gray-500 mb-1">Loan-to-Value</h4>
                      <p className="font-semibold text-primary">{loan.terms.ltv}</p>
                    </div>
                    <div>
                      <h4 className="text-sm text-gray-500 mb-1">Interest Rates</h4>
                      <p className="font-semibold text-primary">{loan.terms.rates}</p>
                    </div>
                    <div>
                      <h4 className="text-sm text-gray-500 mb-1">Loan Terms</h4>
                      <p className="font-semibold text-primary">{loan.terms.terms}</p>
                    </div>
                    <div>
                      <h4 className="text-sm text-gray-500 mb-1">Closing Time</h4>
                      <p className="font-semibold text-primary">{loan.terms.closingTime}</p>
                    </div>
                    <div>
                      <h4 className="text-sm text-gray-500 mb-1">Origination Fees</h4>
                      <p className="font-semibold text-primary">{loan.terms.fees}</p>
                    </div>
                    <div>
                      <h4 className="text-sm text-gray-500 mb-1">Minimum Loan</h4>
                      <p className="font-semibold text-primary">{loan.terms.minLoan}</p>
                    </div>
                    <div>
                      <h4 className="text-sm text-gray-500 mb-1">Maximum Loan</h4>
                      <p className="font-semibold text-primary">{loan.terms.maxLoan}</p>
                    </div>
                    <div className="flex items-end">
                      <a 
                        href={`/contact?type=private-money&loan=${loan.id}`}
                        className="inline-flex items-center text-accent font-medium hover:text-accent/80"
                      >
                        Apply Now
                        <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Lender Network Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Our Private <span className="text-accent">Lender Network</span>
          </h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
            When you work with Domentra, you gain access to our exclusive network of vetted private lenders specializing in various types of real estate investments.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {lenders.map((lender, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                <div className="bg-primary/10 p-6 text-center">
                  <div className="inline-block rounded-full overflow-hidden w-24 h-24 mb-4 border-4 border-white shadow-md">
                    <img 
                      src={lender.avatar} 
                      alt={lender.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-1">{lender.name}</h3>
                  <p className="text-accent font-medium">{lender.specialty}</p>
                </div>
                
                <div className="p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Experience:</span>
                      <span className="font-medium">{lender.experience}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Funded Deals:</span>
                      <span className="font-medium">{lender.fundedDeals}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Loan Range:</span>
                      <span className="font-medium">{lender.minLoanSize} - {lender.maxLoanSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Active In:</span>
                      <span className="font-medium">{lender.states}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">
              These are just a few of the private lenders in our extensive network. We'll match you with the lender that best fits your specific project needs.
            </p>
            <a 
              href="/contact?type=private-money" 
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-accent hover:bg-accent/90"
            >
              Get Matched With a Lender
            </a>
          </div>
        </div>
      </section>
      
      {/* Recent Loan Examples Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Recent <span className="text-accent">Funded Projects</span>
          </h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
            Browse through some of our recently funded private money loans across different property types and investment strategies.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {loanExamples.map((example, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="relative h-64">
                  <img 
                    src={example.image} 
                    alt={example.type} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-0 left-0 bg-accent text-white px-4 py-2 rounded-br-lg font-bold">
                    {example.type}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4">{example.location} Project</h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-500">Purchase Price</p>
                      <p className="font-semibold">{example.purchasePrice}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Rehab Cost</p>
                      <p className="font-semibold">{example.rehabCost}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Loan Amount</p>
                      <p className="font-semibold text-accent">{example.loanAmount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">After Repair Value</p>
                      <p className="font-semibold">{example.arv}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Term / Rate</p>
                      <p className="font-semibold">{example.term} / {example.rate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Closing Time</p>
                      <p className="font-semibold">{example.timeToClose}</p>
                    </div>
                  </div>
                  
                  <div className="text-center pt-2 border-t border-gray-100">
                    <a 
                      href="/contact?type=private-money" 
                      className="text-accent font-medium hover:text-accent/80"
                    >
                      Request Similar Funding
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
  
  return (
    <FundingTypePage 
      title="Private Money Loan Solutions"
      subtitle="Access Flexible, Fast Capital for Your Real Estate Projects"
      description="Our private money loan solutions connect you with our vetted network of private lenders, offering speed, flexibility, and customized terms unavailable from traditional financing sources."
      benefits={benefits}
      process={process}
      faqs={faqs}
      backgroundImage="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1674&q=80"
      ctaText="Apply for Private Money Funding"
      ctaLink="/contact?type=private-money"
      customSections={customSections}
    />
  );
};

export default PrivateMoney; 