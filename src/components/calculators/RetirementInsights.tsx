"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { 
  ArrowRight, 
  Lightbulb, 
  TrendingUp, 
  Coins, 
  PiggyBank, 
  BarChart3,
  ExternalLink,
  Laptop,
  Smartphone,
  Bitcoin,
  Lock,
  Wallet
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { useQuery } from "@tanstack/react-query";
import { MutualFund, useMarketData } from "@/services/marketDataService";

interface RetirementInsightsProps {
  age: number;
  requiredCorpus: number;
  monthlyInvestment: number;
  yearsUntilRetirement: number;
  expectedReturns: number;
}

interface Recommendation {
  fundId: string;
  fundName: string;
  allocation: number;
  reason: string;
  returns: number;
}

const RetirementInsights = ({
  age,
  requiredCorpus,
  monthlyInvestment,
  yearsUntilRetirement,
  expectedReturns,
}: RetirementInsightsProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("insights");
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const marketDataService = useMarketData();
  
  const { 
    data: mutualFunds,
    isLoading: isLoadingFunds
  } = useQuery({
    queryKey: ['mutualFunds'],
    queryFn: marketDataService.getMutualFunds
  });
  
  const {
    data: retirementCalculators,
    isLoading: isLoadingCalculators
  } = useQuery({
    queryKey: ['retirementCalculators'],
    queryFn: marketDataService.getRetirementCalculators
  });
  
  const {
    data: fintechTools,
    isLoading: isLoadingFintechTools
  } = useQuery({
    queryKey: ['fintechTools'],
    queryFn: marketDataService.getFintechRetirementTools
  });

  const calculateRiskProfile = () => {
    if (age < 30 && yearsUntilRetirement > 25) return "Aggressive";
    if (age < 40 && yearsUntilRetirement > 15) return "Moderately Aggressive";
    if (age < 50 && yearsUntilRetirement > 10) return "Moderate";
    if (age < 60 && yearsUntilRetirement > 5) return "Moderately Conservative";
    return "Conservative";
  };

  const riskProfile = calculateRiskProfile();

  const generateInsights = () => {
    setLoading(true);
    
    setTimeout(() => {
      const newInsights = [];
      
      if (age < 30) {
        newInsights.push("Your early start gives you a significant advantage. Consider allocating more to equity for long-term growth.");
        newInsights.push("With time on your side, you could explore high-growth small-cap funds for a portion of your portfolio.");
        newInsights.push("Consider a 70-30 equity-debt ratio to maximize long-term wealth accumulation while managing volatility.");
        newInsights.push("Look into ELSS funds for tax advantages under Section 80C while building retirement corpus.");
      } else if (age < 45) {
        newInsights.push("You're in your prime earning years. Consider maximizing tax-advantaged retirement accounts like PPF and NPS.");
        newInsights.push("Balance between growth and stability with a 60-40 equity-debt ratio to optimize returns.");
        newInsights.push("Review and update your health insurance coverage as healthcare costs may increase significantly by retirement.");
        newInsights.push("Consider HDFC Retirement Fund or similar target-date funds that automatically adjust risk as you approach retirement.");
      } else {
        newInsights.push("As you approach retirement, consider gradually shifting towards more conservative investments.");
        newInsights.push("Review and maximize employer retirement benefits if available.");
        newInsights.push("Consider a 40-60 equity-debt ratio to protect accumulated wealth while allowing for modest growth.");
        newInsights.push("Look into Senior Citizens Savings Scheme (SCSS) and PM Vaya Vandana Yojana for guaranteed income.");
      }
      
      if (monthlyInvestment < requiredCorpus / (12 * yearsUntilRetirement * 10)) {
        newInsights.push("Your current investment rate may be insufficient. Consider increasing your monthly contribution by at least 20%.");
        newInsights.push("Explore additional income streams to boost retirement savings without compromising lifestyle.");
        newInsights.push("Use the ET Money Retirement Planner to simulate different investment amounts and their impact.");
      }
      
      if (expectedReturns > 14) {
        newInsights.push("Your expected return rate seems optimistic. Consider planning with a more conservative rate of 10-12%.");
        newInsights.push("Create a 'stress test' scenario with lower returns to ensure your plan remains viable in varied market conditions.");
        newInsights.push("The ClearTax Retirement Calculator can help model different return scenarios with tax implications.");
      }
      
      if (yearsUntilRetirement > 20) {
        newInsights.push("With a long investment horizon, consider allocating a portion to international equity for greater diversification.");
        newInsights.push("Platforms like Kuvera and Scripbox can help create and maintain globally diversified portfolios.");
      }
      
      if (requiredCorpus > 5000000) {
        newInsights.push("Your significant corpus goal may benefit from professional financial planning. Consider consulting a certified advisor.");
        newInsights.push("NPS can be a good addition to your retirement strategy for tax benefits and disciplined investing.");
      }
      
      newInsights.push("Diversify across asset classes for better risk management. Consider gold and international exposure.");
      newInsights.push("Review your retirement portfolio quarterly and rebalance annually to maintain optimal asset allocation.");
      newInsights.push("Use robo-advisors like Zerodha Coin or Paytm Money for automated retirement portfolio management.");
      
      setInsights(newInsights);
      generateFundRecommendations();
      setLoading(false);
      
      toast({
        title: "Retirement Insights Generated",
        description: "AI-powered recommendations based on your financial profile.",
      });
    }, 1500);
  };

  const generateFundRecommendations = () => {
    if (!mutualFunds) return;

    let filteredFunds: MutualFund[] = [...mutualFunds];
    
    if (riskProfile === "Aggressive") {
      filteredFunds = filteredFunds.filter(fund => 
        fund.riskLevel === "High" || 
        fund.category === "Small Cap" || 
        fund.category === "Mid Cap"
      );
    } else if (riskProfile === "Moderately Aggressive") {
      filteredFunds = filteredFunds.filter(fund => 
        fund.category === "Mid Cap" || 
        fund.category === "Large & Mid Cap" ||
        fund.category === "Flexi Cap"
      );
    } else if (riskProfile === "Moderate") {
      filteredFunds = filteredFunds.filter(fund => 
        fund.riskLevel === "Moderate" || 
        fund.category === "Hybrid" ||
        fund.category === "Large Cap"
      );
    } else {
      filteredFunds = filteredFunds.filter(fund => 
        fund.riskLevel === "Low" || 
        fund.category === "Debt" ||
        fund.category === "Hybrid" 
      );
    }
    
    filteredFunds.sort((a, b) => b.threeYearReturn - a.threeYearReturn);
    
    const topFunds = filteredFunds.slice(0, 4);
    
    let allocations: number[] = [];
    
    if (riskProfile === "Aggressive") {
      allocations = [40, 30, 20, 10];
    } else if (riskProfile === "Moderately Aggressive") {
      allocations = [35, 30, 20, 15];
    } else if (riskProfile === "Moderate") {
      allocations = [30, 25, 25, 20];
    } else if (riskProfile === "Moderately Conservative") {
      allocations = [30, 25, 25, 20];
    } else {
      allocations = [25, 25, 25, 25];
    }
    
    const newRecommendations: Recommendation[] = topFunds.map((fund, index) => ({
      fundId: fund.id,
      fundName: fund.name,
      allocation: allocations[index],
      reason: getReason(fund, index),
      returns: fund.threeYearReturn
    }));
    
    setRecommendations(newRecommendations);
  };

  const getReason = (fund: MutualFund, index: number) => {
    const reasons = [
      `Top performer in ${fund.category} category with consistent returns over 3-5 years.`,
      `Strong risk-adjusted returns that align with your ${riskProfile.toLowerCase()} risk profile.`,
      `Provides good exposure to ${fund.category} with moderate volatility.`,
      `Adds diversification to your portfolio with stable returns.`
    ];
    
    return reasons[index] || "Recommended based on your retirement goals and risk profile.";
  };

  useEffect(() => {
    if (mutualFunds && mutualFunds.length > 0 && insights.length > 0 && recommendations.length === 0) {
      generateFundRecommendations();
    }
  }, [mutualFunds, insights]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          AI-Powered Retirement Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.length > 0 ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="insights">Insights</TabsTrigger>
              <TabsTrigger value="recommendations">Funds</TabsTrigger>
              <TabsTrigger value="calculators">Calculators</TabsTrigger>
              <TabsTrigger value="fintech">FinTech</TabsTrigger>
              <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
            </TabsList>
            
            <TabsContent value="insights" className="mt-4 space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={
                    riskProfile === "Aggressive" ? "destructive" : 
                    riskProfile === "Conservative" ? "outline" : 
                    "default"
                  }>
                    {riskProfile} Risk Profile
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Based on age {age} and {yearsUntilRetirement} years until retirement
                  </span>
                </div>
                <Progress value={
                  riskProfile === "Aggressive" ? 90 : 
                  riskProfile === "Moderately Aggressive" ? 75 : 
                  riskProfile === "Moderate" ? 50 : 
                  riskProfile === "Moderately Conservative" ? 30 : 
                  15
                } className="h-2" />
              </div>
              
              {insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 mt-0.5 text-blue-500 flex-shrink-0" />
                  <p>{insight}</p>
                </div>
              ))}
              
              <Separator className="my-4" />
              <Button variant="outline" onClick={generateInsights} disabled={loading} className="w-full">
                {loading ? "Analyzing your profile..." : "Refresh Insights"}
              </Button>
            </TabsContent>
            
            <TabsContent value="recommendations" className="mt-4 space-y-4">
              {isLoadingFunds || recommendations.length === 0 ? (
                <div className="py-8 text-center">
                  <PiggyBank className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
                  <p>Loading fund recommendations...</p>
                </div>
              ) : (
                <>
                  <div className="bg-muted/50 p-4 rounded-lg mb-4">
                    <h3 className="font-medium mb-2">Recommended Portfolio Allocation</h3>
                    <div className="flex gap-1 h-6 w-full rounded-full overflow-hidden">
                      {recommendations.map((rec, index) => (
                        <div 
                          key={index} 
                          style={{ width: `${rec.allocation}%` }}
                          className={`
                            ${index === 0 ? 'bg-blue-500' : ''}
                            ${index === 1 ? 'bg-green-500' : ''}
                            ${index === 2 ? 'bg-amber-500' : ''}
                            ${index === 3 ? 'bg-purple-500' : ''}
                          `}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>Based on your {riskProfile} risk profile</span>
                      <span>Optimized for {yearsUntilRetirement} year horizon</span>
                    </div>
                  </div>
                  
                  {recommendations.map((rec, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {index === 0 && <BarChart3 className="h-4 w-4 text-blue-500" />}
                          {index === 1 && <TrendingUp className="h-4 w-4 text-green-500" />}
                          {index === 2 && <Coins className="h-4 w-4 text-amber-500" />}
                          {index === 3 && <PiggyBank className="h-4 w-4 text-purple-500" />}
                          <h4 className="font-medium">{rec.fundName}</h4>
                        </div>
                        <Badge variant="outline">{rec.allocation}%</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{rec.reason}</p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">3-Year Returns:</span>
                        <span className="font-medium text-green-600">{rec.returns.toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </TabsContent>
            
            <TabsContent value="calculators" className="mt-4 space-y-4">
              {isLoadingCalculators ? (
                <div className="py-8 text-center">
                  <Laptop className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
                  <p>Loading popular retirement calculators...</p>
                </div>
              ) : (
                <>
                  <div className="bg-muted/50 p-4 rounded-lg mb-4">
                    <h3 className="font-medium mb-2">India-Specific Retirement Calculators</h3>
                    <p className="text-sm text-muted-foreground">
                      These calculators help you estimate how much you need to save regularly for retirement based on Indian market conditions.
                    </p>
                  </div>
                  
                  {retirementCalculators?.map((calc, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{calc.name}</h4>
                          <p className="text-sm text-muted-foreground">{calc.provider}</p>
                        </div>
                        <a 
                          href={calc.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <span className="text-sm">Visit</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 pl-1">
                        {calc.features.map((feature, idx) => (
                          <li key={idx}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </>
              )}
            </TabsContent>
            
            <TabsContent value="fintech" className="mt-4 space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg mb-4">
                <h3 className="font-medium mb-2">FinTech & Retirement Planning</h3>
                <p className="text-sm text-muted-foreground">
                  Modern fintech platforms are revolutionizing retirement planning with AI-powered tools and robo-advisors.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Robo-Advisors</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-blue-500" />
                          <h4 className="font-medium text-sm">Zerodha's Coin</h4>
                        </div>
                        <p className="text-xs text-muted-foreground pl-6">
                          India's largest discount broker platform with low-cost mutual fund investment options
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <PiggyBank className="h-4 w-4 text-green-500" />
                          <h4 className="font-medium text-sm">Scripbox</h4>
                        </div>
                        <p className="text-xs text-muted-foreground pl-6">
                          AI-driven goal-based investing with automatic portfolio rebalancing for retirement
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Coins className="h-4 w-4 text-amber-500" />
                          <h4 className="font-medium text-sm">Kuvera</h4>
                        </div>
                        <p className="text-xs text-muted-foreground pl-6">
                          Zero commission platform with advanced portfolio analysis and retirement forecasting
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-amber-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Smart Retirement Calculators</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <p className="text-sm">
                        Modern tools that factor in multiple variables for accurate retirement planning:
                      </p>
                      
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <BarChart3 className="h-4 w-4 text-blue-500 mt-0.5" />
                          <span>Dynamic inflation adjustment based on lifestyle choices</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Wallet className="h-4 w-4 text-green-500 mt-0.5" />
                          <span>Healthcare expense projections specific to age and location</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <TrendingUp className="h-4 w-4 text-purple-500 mt-0.5" />
                          <span>Tax optimization strategies integrated into retirement planning</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="border border-dashed p-4 rounded-lg">
                <h4 className="font-medium mb-3">How Robo-Advisors Optimize Your Retirement</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="font-medium mb-1 flex items-center gap-1">
                      <TrendingUp className="h-3.5 w-3.5 text-blue-500" />
                      Portfolio Rebalancing
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Automatic adjustment of asset allocation as you approach retirement age
                    </p>
                  </div>
                  
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="font-medium mb-1 flex items-center gap-1">
                      <BarChart3 className="h-3.5 w-3.5 text-green-500" />
                      Tax-Loss Harvesting
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Optimizes your portfolio for tax efficiency, increasing overall returns
                    </p>
                  </div>
                  
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="font-medium mb-1 flex items-center gap-1">
                      <PiggyBank className="h-3.5 w-3.5 text-amber-500" />
                      Goal Tracking
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Real-time monitoring of progress toward retirement corpus goals
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="blockchain" className="mt-4 space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium mb-1">Blockchain & Digital Assets in Retirement</h3>
                    <p className="text-sm text-muted-foreground">
                      Emerging technologies reshaping retirement planning in India
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-amber-100">Emerging</Badge>
                </div>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Bitcoin className="h-4 w-4 text-amber-500" />
                    Blockchain-Based Pension Systems
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm">
                      While still in early stages in India, blockchain technology offers several advantages for retirement planning:
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-3">
                        <div className="font-medium mb-1 flex items-center gap-1">
                          <Lock className="h-3.5 w-3.5 text-blue-500" />
                          Enhanced Security
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Immutable records protect retirement savings from fraud and unauthorized access
                        </p>
                      </div>
                      
                      <div className="border rounded-lg p-3">
                        <div className="font-medium mb-1 flex items-center gap-1">
                          <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                          Transparent Tracking
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Real-time visibility into pension fund performance and management
                        </p>
                      </div>
                      
                      <div className="border rounded-lg p-3">
                        <div className="font-medium mb-1 flex items-center gap-1">
                          <Coins className="h-3.5 w-3.5 text-amber-500" />
                          Lower Costs
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Reduced administrative expenses through smart contract automation
                        </p>
                      </div>
                      
                      <div className="border rounded-lg p-3">
                        <div className="font-medium mb-1 flex items-center gap-1">
                          <Wallet className="h-3.5 w-3.5 text-purple-500" />
                          Portable Benefits
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Easier transfer of retirement benefits when changing employers
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 mt-2">
                      <h4 className="font-medium text-sm mb-2">Indian Regulatory Landscape</h4>
                      <p className="text-xs text-muted-foreground">
                        While blockchain pension systems are not yet mainstream in India, regulatory frameworks are evolving. The Pension Fund Regulatory and Development Authority (PFRDA) has shown interest in exploring blockchain solutions for the National Pension System (NPS).
                      </p>
                      <div className="mt-2 text-xs text-muted-foreground">
                        <span className="font-medium">Current Status:</span> Exploratory phase, with potential for integration into existing pension frameworks in the coming years.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="border border-dashed p-4 rounded-lg">
                <h4 className="font-medium mb-3">Digital Asset Considerations for Retirement</h4>
                <div className="space-y-3 text-sm">
                  <p>
                    While cryptocurrencies offer potential high returns, they come with significant risks and volatility that may not align with traditional retirement planning goals.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <h5 className="font-medium mb-1">Potential Benefits</h5>
                      <ul className="space-y-1 text-xs">
                        <li className="flex items-start gap-1">
                          <TrendingUp className="h-3 w-3 text-green-500 mt-0.5" />
                          <span>Portfolio diversification beyond traditional assets</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <TrendingUp className="h-3 w-3 text-green-500 mt-0.5" />
                          <span>Hedge against currency devaluation and inflation</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <h5 className="font-medium mb-1">Risk Factors</h5>
                      <ul className="space-y-1 text-xs">
                        <li className="flex items-start gap-1">
                          <TrendingUp className="h-3 w-3 text-red-500 mt-0.5" />
                          <span>High volatility not suitable for near-retirement portfolios</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <TrendingUp className="h-3 w-3 text-red-500 mt-0.5" />
                          <span>Regulatory uncertainty in the Indian context</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <p className="italic text-xs text-muted-foreground mt-2">
                    Note: Financial experts typically recommend limiting digital asset exposure to no more than 5% of your retirement portfolio, especially for those over 40 years of age.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Lightbulb className="h-12 w-12 text-amber-500 mb-4 opacity-80" />
            <h3 className="text-lg font-medium mb-2">Get Personalized Retirement Advice</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Our AI will analyze your retirement profile and provide tailored recommendations to improve your financial future.
            </p>
            <Button onClick={generateInsights} disabled={loading} className="flex items-center gap-2">
              {loading ? "Analyzing your profile..." : "Generate Insights"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RetirementInsights;
