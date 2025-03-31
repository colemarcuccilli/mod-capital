import React, { useState } from 'react';
import FundingTypePage from '../components/templates/FundingTypePage';

const Gap: React.FC = () => {
  // Comparison slider state
  const [sliderValue, setSliderValue] = useState<number>(50);
  
  // Handle slider change
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderValue(parseInt(e.target.value));
  };
  
  const benefits = [
    {
      title: "Bridge Financing Gaps",
      description: "Fill the gap between your existing financing and the total project costs."
    },
    {
      title: "Short-Term Solutions",
      description: "Flexible terms from 1 to 12 months to match your project timeline."
    },
    {
      title: "Fast Approval Process",
      description: "Get approved within days, not weeks, to keep your project moving forward."
    },
    {
      title: "Higher Leverage",
      description: "Access up to 90% of the gap amount needed for your real estate project."
    },
    {
      title: "Asset-Based Lending",
      description: "Funding based on the property value, not solely on your credit history."
    },
    {
      title: "Versatile Applications",
      description: "Use for acquisitions, renovations, refinances, or development projects."
    }
  ];
  
  const process = [
    {
      number: 1,
      title: "Identify Your Financing Gap",
      description: "Determine how much additional funding you need to complete your real estate transaction."
    },
    {
      number: 2,
      title: "Submit Project Details",
      description: "Share your property information, existing financing, and detailed business plan with our team."
    },
    {
      number: 3,
      title: "Quick Underwriting",
      description: "Our team evaluates your project and structures a gap funding solution within 48-72 hours."
    },
    {
      number: 4,
      title: "Close and Fund",
      description: "Receive your gap funding quickly to proceed with your real estate transaction or project."
    }
  ];
  
  const faqs = [
    {
      question: "What exactly is gap funding in real estate?",
      answer: "Gap funding provides the capital needed to 'bridge the gap' between your primary financing (like a mortgage or hard money loan) and the total funds required for your real estate project. It's typically short-term financing used until a more permanent solution is secured."
    },
    {
      question: "How fast can I get approved for gap funding?",
      answer: "With Domentra, most gap funding solutions can be approved and funded within 3-5 business days, depending on the complexity of the transaction and the completeness of your documentation."
    },
    {
      question: "What's the maximum amount of gap funding available?",
      answer: "We typically provide gap funding up to 90% of the required gap amount, with loan sizes ranging from $50,000 to $5 million based on the property value and project viability."
    },
    {
      question: "What types of properties qualify for gap funding?",
      answer: "We offer gap funding for residential, commercial, and mixed-use properties. This includes fix-and-flip projects, new construction, multi-family properties, and commercial developments."
    },
    {
      question: "Are there prepayment penalties for paying off gap funding early?",
      answer: "Most of our gap funding solutions come with no prepayment penalties, allowing you to pay off the financing early when you secure permanent financing or complete your exit strategy."
    }
  ];
  
  // Funding scenarios
  const scenarios = [
    {
      id: 'acquisition',
      title: 'Acquisition Gap',
      description: 'Bridge the gap between your down payment and the purchase price to acquire a property at below market value.',
      icon: '🏠',
      color: 'bg-blue-500',
      details: {
        typical: '$50K - $500K',
        term: '3-6 months',
        rate: '8-10%',
        ltv: 'Up to 90%'
      }
    },
    {
      id: 'rehab',
      title: 'Rehab Gap',
      description: 'Fund the difference between your renovation loan and the actual costs to complete your property improvements.',
      icon: '🔨',
      color: 'bg-green-500',
      details: {
        typical: '$25K - $250K',
        term: '3-9 months',
        rate: '9-11%',
        ltv: 'Up to 85%'
      }
    },
    {
      id: 'refinance',
      title: 'Refinance Gap',
      description: 'Cover timing gaps between loans when refinancing or transitioning between lenders on investment properties.',
      icon: '📝',
      color: 'bg-purple-500',
      details: {
        typical: '$100K - $1M',
        term: '1-3 months',
        rate: '7-9%',
        ltv: 'Up to 80%'
      }
    },
    {
      id: 'development',
      title: 'Development Gap',
      description: 'Finance the gap between construction draws to keep your development project on schedule.',
      icon: '🏗️',
      color: 'bg-orange-500',
      details: {
        typical: '$250K - $2M',
        term: '6-12 months',
        rate: '10-12%',
        ltv: 'Up to 75%'
      }
    }
  ];
  
  // Comparison data
  const comparisonData = [
    {
      feature: 'Funding Amount',
      traditional: 'Limited to 70-75% LTV',
      gap: 'Up to 90% combined LTC/LTV'
    },
    {
      feature: 'Approval Timeline',
      traditional: '30-45 days',
      gap: '3-5 business days'
    },
    {
      feature: 'Credit Requirements',
      traditional: 'Excellent credit (700+)',
      gap: 'Flexible (focus on asset)'
    },
    {
      feature: 'Income Verification',
      traditional: 'Extensive documentation',
      gap: 'Minimal or none'
    },
    {
      feature: 'Personal Guarantees',
      traditional: 'Always required',
      gap: 'Often not required'
    },
    {
      feature: 'Prepayment Penalties',
      traditional: 'Common',
      gap: 'Rare or none'
    },
    {
      feature: 'Properties Financed',
      traditional: 'Limited property types',
      gap: 'All investment properties'
    }
  ];
  
  // Calculate investment and ROI values based on slider
  const calculateScenario = () => {
    const propertyValue = 1000000;
    const purchasePrice = 800000;
    const renovationCost = 200000;
    const totalProjectCost = purchasePrice + renovationCost;
    
    // Primary financing covers 75% of purchase price
    const primaryFinancing = purchasePrice * 0.75;
    
    // Calculate how much is covered based on slider value 0-100
    const gapPercentage = sliderValue / 100;
    const gapAmount = (totalProjectCost - primaryFinancing) * gapPercentage;
    const investorContribution = totalProjectCost - primaryFinancing - gapAmount;
    
    // After renovation, property value increases
    const afterRepairValue = propertyValue + (renovationCost * 0.75);
    const equity = afterRepairValue - (primaryFinancing + gapAmount);
    const roi = (equity / investorContribution) * 100;
    
    return {
      propertyValue: propertyValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      totalProjectCost: totalProjectCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      primaryFinancing: primaryFinancing.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      gapAmount: gapAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      investorContribution: investorContribution.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      afterRepairValue: afterRepairValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      equity: equity.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      roi: roi.toFixed(1) + '%'
    };
  };
  
  const scenarioValues = calculateScenario();
  
  // Custom sections to pass to the FundingTypePage
  const customSections = (
    <>
      {/* Funding Scenarios Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Gap Funding <span className="text-accent">Scenarios</span>
          </h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
            Explore different gap funding scenarios and how they can be applied to your real estate investments.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {scenarios.map((scenario) => (
              <div key={scenario.id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className={`${scenario.color} p-4 text-white`}>
                  <div className="flex items-center justify-between">
                    <span className="text-4xl">{scenario.icon}</span>
                    <h3 className="text-xl font-bold">{scenario.title}</h3>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-gray-600 mb-6 min-h-[80px]">{scenario.description}</p>
                  
                  <div className="space-y-3 border-t border-gray-100 pt-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Typical Amount:</span>
                      <span className="font-medium">{scenario.details.typical}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Term:</span>
                      <span className="font-medium">{scenario.details.term}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Rate:</span>
                      <span className="font-medium">{scenario.details.rate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Max LTV:</span>
                      <span className="font-medium">{scenario.details.ltv}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* ROI Calculator/Slider Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Leverage <span className="text-accent">Calculator</span>
          </h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
            See how different levels of gap funding can dramatically impact your return on investment.
          </p>
          
          <div className="bg-gray-50 rounded-xl shadow-lg p-8 max-w-5xl mx-auto">
            <div className="mb-8">
              <p className="text-center text-lg font-semibold mb-6">
                Move the slider to adjust your gap funding percentage:
              </p>
              
              <div className="max-w-md mx-auto">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={sliderValue}
                  onChange={handleSliderChange}
                  className="w-full h-3 accent-accent bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>0% Gap Funding</span>
                  <span>100% Gap Funding</span>
                </div>
                
                <div className="text-center mt-4">
                  <span className="text-2xl font-bold text-accent">{sliderValue}%</span>
                  <span className="text-gray-600"> of gap funded by Domentra</span>
                </div>
              </div>
            </div>
            
            {/* Scenario Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-bold mb-4 text-primary">Project Details:</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property Value:</span>
                    <span className="font-medium">{scenarioValues.propertyValue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Project Cost:</span>
                    <span className="font-medium">{scenarioValues.totalProjectCost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Primary Financing:</span>
                    <span className="font-medium">{scenarioValues.primaryFinancing}</span>
                  </div>
                  <div className="flex justify-between text-accent font-semibold">
                    <span>Gap Funding Amount:</span>
                    <span>{scenarioValues.gapAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Your Contribution:</span>
                    <span className="font-medium">{scenarioValues.investorContribution}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-bold mb-4 text-primary">Investment Results:</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">After Repair Value:</span>
                    <span className="font-medium">{scenarioValues.afterRepairValue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Financing:</span>
                    <span className="font-medium">
                      {(parseInt(scenarioValues.primaryFinancing.replace(/[^0-9.-]+/g, '')) + 
                      parseInt(scenarioValues.gapAmount.replace(/[^0-9.-]+/g, ''))).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Your Equity:</span>
                    <span className="font-medium">{scenarioValues.equity}</span>
                  </div>
                  <div className="flex justify-between text-accent font-semibold">
                    <span>Return on Investment:</span>
                    <span>{scenarioValues.roi}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500 mb-6">
                This calculator provides estimated figures for illustration purposes only. Actual results may vary based on specific project details, market conditions, and financing terms.
              </p>
              <a 
                href="/contact?type=gap" 
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-accent hover:bg-accent/90"
              >
                Apply for Gap Funding
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Comparison Table Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Gap Funding vs. <span className="text-accent">Traditional Financing</span>
          </h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
            See how our gap funding solutions compare to traditional financing options.
          </p>
          
          <div className="overflow-hidden rounded-xl shadow-lg max-w-4xl mx-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="py-4 px-6 text-left">Feature</th>
                  <th className="py-4 px-6 text-center">Traditional Financing</th>
                  <th className="py-4 px-6 text-center bg-accent">Gap Funding</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="py-4 px-6 font-medium">{item.feature}</td>
                    <td className="py-4 px-6 text-center">{item.traditional}</td>
                    <td className="py-4 px-6 text-center font-medium text-accent">{item.gap}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
  
  return (
    <FundingTypePage 
      title="Gap Funding Solutions"
      subtitle="Bridge Your Financial Gaps With Confidence"
      description="Our gap funding provides the missing piece in your real estate financing puzzle, allowing you to complete transactions and maximize opportunities."
      benefits={benefits}
      process={process}
      faqs={faqs}
      backgroundImage="https://images.unsplash.com/photo-1554469384-e58fac937bb4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1650&q=80"
      ctaText="Apply for Gap Funding"
      ctaLink="/contact?type=gap"
      customSections={customSections}
    />
  );
};

export default Gap; 