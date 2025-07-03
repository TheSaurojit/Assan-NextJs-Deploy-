
import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, TrendingUp, ShieldCheck, Briefcase, FilePieChart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// Define types for the user profile
interface UserProfile {
  age: number;
  riskProfile: "Conservative" | "Moderate" | "Aggressive";
  hlvScore: number;
  retirementCorpusScore: number;
  monthlyInvestment: number;
}

// Define types for investment recommendations
interface InvestmentOption {
  name: string;
  type: "Mutual Fund" | "ETF" | "Index Fund" | "Debt" | "Hybrid";
  category: string;
  riskLevel: "Low" | "Medium" | "High";
  returns: {
    oneYear: number;
    threeYear: number;
    fiveYear: number;
  };
  minInvestment: number;
  recommendationScore: number;
  allocation: number;
}

// Mock API function to fetch market data
const fetchMarketData = async (): Promise<{ status: string; timestamp: string }> => {
  // In a real scenario, this would be an API call
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        status: "success",
        timestamp: new Date().toLocaleString()
      });
    }, 1000);
  });
};

// Function to generate recommendations based on user profile
const getRecommendations = (profile: UserProfile): InvestmentOption[] => {
  // This would ideally use a real algorithm and real data
  // For now, we'll use mock data with some logic based on the profile
  
  const recommendations: InvestmentOption[] = [];
  
  // Determine portfolio distribution based on risk profile and scores
  let equityPercentage = 0;
  let debtPercentage = 0;
  let hybridPercentage = 0;
  
  if (profile.riskProfile === "Conservative") {
    equityPercentage = 30;
    debtPercentage = 60;
    hybridPercentage = 10;
  } else if (profile.riskProfile === "Moderate") {
    equityPercentage = 50;
    debtPercentage = 30;
    hybridPercentage = 20;
  } else {
    equityPercentage = 70;
    debtPercentage = 20;
    hybridPercentage = 10;
  }
  
  // Adjust based on HLV score (high score = better financial health = more aggressive)
  if (profile.hlvScore > 700) {
    equityPercentage += 10;
    debtPercentage -= 10;
  } else if (profile.hlvScore < 500) {
    equityPercentage -= 10;
    debtPercentage += 10;
  }
  
  // Adjust based on retirement corpus score
  if (profile.retirementCorpusScore > 700) {
    equityPercentage += 5;
    debtPercentage -= 5;
  } else if (profile.retirementCorpusScore < 500) {
    equityPercentage -= 5;
    debtPercentage += 5;
  }
  
  // Mock data for different investment options
  const equityFunds = [
    {
      name: "HDFC Index Fund-NIFTY 50 Plan",
      type: "Index Fund" as const,
      category: "Large Cap",
      riskLevel: "Medium" as const,
      returns: { oneYear: 15.2, threeYear: 12.8, fiveYear: 11.5 },
      minInvestment: 100,
      recommendationScore: 85
    },
    {
      name: "Axis Bluechip Fund",
      type: "Mutual Fund" as const,
      category: "Large Cap",
      riskLevel: "Medium" as const,
      returns: { oneYear: 16.3, threeYear: 13.2, fiveYear: 12.1 },
      minInvestment: 500,
      recommendationScore: 82
    },
    {
      name: "Mirae Asset Emerging Bluechip",
      type: "Mutual Fund" as const,
      category: "Large & Mid Cap",
      riskLevel: "High" as const,
      returns: { oneYear: 18.7, threeYear: 16.5, fiveYear: 15.3 },
      minInvestment: 1000,
      recommendationScore: 88
    },
    {
      name: "UTI Nifty Next 50 Index Fund",
      type: "Index Fund" as const,
      category: "Mid Cap",
      riskLevel: "High" as const,
      returns: { oneYear: 19.5, threeYear: 14.8, fiveYear: 13.2 },
      minInvestment: 500,
      recommendationScore: 80
    }
  ];
  
  const debtFunds = [
    {
      name: "HDFC Corporate Bond Fund",
      type: "Debt" as const,
      category: "Corporate Bond",
      riskLevel: "Low" as const,
      returns: { oneYear: 7.5, threeYear: 6.8, fiveYear: 7.2 },
      minInvestment: 1000,
      recommendationScore: 75
    },
    {
      name: "ICICI Prudential Short Term Fund",
      type: "Debt" as const,
      category: "Short Duration",
      riskLevel: "Low" as const,
      returns: { oneYear: 6.8, threeYear: 6.2, fiveYear: 6.5 },
      minInvestment: 500,
      recommendationScore: 70
    },
    {
      name: "Axis Banking & PSU Debt Fund",
      type: "Debt" as const,
      category: "Banking & PSU",
      riskLevel: "Low" as const,
      returns: { oneYear: 7.2, threeYear: 6.5, fiveYear: 6.8 },
      minInvestment: 1000,
      recommendationScore: 73
    }
  ];
  
  const hybridFunds = [
    {
      name: "HDFC Balanced Advantage Fund",
      type: "Hybrid" as const,
      category: "Balanced Advantage",
      riskLevel: "Medium" as const,
      returns: { oneYear: 12.4, threeYear: 11.2, fiveYear: 10.5 },
      minInvestment: 500,
      recommendationScore: 78
    },
    {
      name: "ICICI Prudential Equity & Debt Fund",
      type: "Hybrid" as const,
      category: "Aggressive Hybrid",
      riskLevel: "Medium" as const,
      returns: { oneYear: 14.2, threeYear: 12.5, fiveYear: 11.8 },
      minInvestment: 1000,
      recommendationScore: 80
    }
  ];
  
  // Assign allocation percentages based on calculated portfolio distribution
  const totalMonthly = profile.monthlyInvestment;
  
  // Equity allocation
  let equityAllocation = Math.round((equityPercentage / 100) * totalMonthly);
  let equityPerFund = Math.floor(equityAllocation / 2); // Allocate to 2 equity funds
  
  // Debt allocation
  let debtAllocation = Math.round((debtPercentage / 100) * totalMonthly);
  let debtPerFund = Math.floor(debtAllocation / 1); // Allocate to 1 debt fund
  
  // Hybrid allocation
  let hybridAllocation = totalMonthly - equityAllocation - debtAllocation;
  
  // Select top funds for each category based on recommendation score and user profile
  // Sort by recommendation score
  const sortedEquity = [...equityFunds].sort((a, b) => b.recommendationScore - a.recommendationScore);
  const sortedDebt = [...debtFunds].sort((a, b) => b.recommendationScore - a.recommendationScore);
  const sortedHybrid = [...hybridFunds].sort((a, b) => b.recommendationScore - a.recommendationScore);
  
  // Pick top funds and assign allocation
  if (profile.riskProfile === "Conservative") {
    // For conservative, prefer lower risk equity
    recommendations.push({
      ...sortedEquity.find(fund => fund.riskLevel !== "High") || sortedEquity[0],
      allocation: equityPerFund
    });
    
    if (equityPercentage > 20) {
      // Add a second equity fund if allocation is significant
      recommendations.push({
        ...sortedEquity.filter(fund => fund.riskLevel !== "High")[1] || sortedEquity[1],
        allocation: equityAllocation - equityPerFund
      });
    }
    
    // Add debt fund
    recommendations.push({
      ...sortedDebt[0],
      allocation: debtAllocation
    });
    
    // Add hybrid fund if allocation is significant
    if (hybridPercentage > 5) {
      recommendations.push({
        ...sortedHybrid[0],
        allocation: hybridAllocation
      });
    }
  } else if (profile.riskProfile === "Moderate") {
    // Mix of different risk levels
    recommendations.push({
      ...sortedEquity[0],
      allocation: equityPerFund
    });
    
    recommendations.push({
      ...sortedEquity[1],
      allocation: equityAllocation - equityPerFund
    });
    
    recommendations.push({
      ...sortedDebt[0],
      allocation: debtAllocation
    });
    
    recommendations.push({
      ...sortedHybrid[0],
      allocation: hybridAllocation
    });
  } else {
    // For aggressive, can include higher risk options
    recommendations.push({
      ...sortedEquity.find(fund => fund.riskLevel === "High") || sortedEquity[0],
      allocation: equityPerFund
    });
    
    recommendations.push({
      ...sortedEquity.filter(fund => fund.name !== recommendations[0].name)[0],
      allocation: equityAllocation - equityPerFund
    });
    
    // Still include some debt for stability
    recommendations.push({
      ...sortedDebt[0],
      allocation: debtAllocation
    });
    
    if (hybridAllocation > 0) {
      recommendations.push({
        ...sortedHybrid[0],
        allocation: hybridAllocation
      });
    }
  }
  
  return recommendations;
};

const InvestmentRecommendations: React.FC = () => {
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<UserProfile>({
    age: 35,
    riskProfile: "Moderate",
    hlvScore: 650,
    retirementCorpusScore: 600,
    monthlyInvestment: 10000
  });
  
  const [recommendations, setRecommendations] = useState<InvestmentOption[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Fetch market data
  const { data: marketData, isLoading: isLoadingMarketData } = useQuery({
    queryKey: ["marketData"],
    queryFn: fetchMarketData,
    refetchInterval: 60000, // Refresh every minute
  });
  
  // Generate recommendations
  useEffect(() => {
    const newRecommendations = getRecommendations(userProfile);
    setRecommendations(newRecommendations);
  }, [userProfile]);
  
  const handleProfileUpdate = (field: keyof UserProfile, value: any) => {
    setUserProfile({
      ...userProfile,
      [field]: value
    });
    
    toast({
      title: "Profile updated",
      description: "Your investment recommendations have been refreshed.",
    });
  };
  
  const getRiskClassName = (risk: string) => {
    switch(risk) {
      case "High": return "text-red-500";
      case "Medium": return "text-amber-500";
      case "Low": return "text-green-500";
      default: return "";
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FilePieChart className="h-5 w-5 text-blue-500" />
            Personalized Investment Recommendations
          </CardTitle>
          <CardDescription>
            Tailored investment suggestions based on your profile and market conditions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-muted/50 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Your Investment Profile</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <div>
                <p className="text-sm text-muted-foreground">Age</p>
                <div className="flex items-center gap-2">
                  <select 
                    value={userProfile.age}
                    onChange={(e) => handleProfileUpdate('age', parseInt(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  >
                    {Array.from({ length: 50 }, (_, i) => i + 18).map(age => (
                      <option key={age} value={age}>{age}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Risk Profile</p>
                <div className="flex items-center gap-2">
                  <select 
                    value={userProfile.riskProfile}
                    onChange={(e) => handleProfileUpdate('riskProfile', e.target.value as any)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  >
                    <option value="Conservative">Conservative</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Aggressive">Aggressive</option>
                  </select>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">HLV Score</p>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="300"
                    max="900"
                    step="10"
                    value={userProfile.hlvScore}
                    onChange={(e) => handleProfileUpdate('hlvScore', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <span className={`text-sm font-medium ${
                    userProfile.hlvScore > 700 ? 'text-green-500' : 
                    userProfile.hlvScore > 500 ? 'text-amber-500' : 'text-red-500'
                  }`}>
                    {userProfile.hlvScore}
                  </span>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Retirement Score</p>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="300"
                    max="900"
                    step="10"
                    value={userProfile.retirementCorpusScore}
                    onChange={(e) => handleProfileUpdate('retirementCorpusScore', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <span className={`text-sm font-medium ${
                    userProfile.retirementCorpusScore > 700 ? 'text-green-500' : 
                    userProfile.retirementCorpusScore > 500 ? 'text-amber-500' : 'text-red-500'
                  }`}>
                    {userProfile.retirementCorpusScore}
                  </span>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Monthly Investment</p>
                <div className="flex items-center gap-2">
                  <select
                    value={userProfile.monthlyInvestment}
                    onChange={(e) => handleProfileUpdate('monthlyInvestment', parseInt(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  >
                    <option value="5000">₹5,000</option>
                    <option value="10000">₹10,000</option>
                    <option value="25000">₹25,000</option>
                    <option value="50000">₹50,000</option>
                    <option value="100000">₹1,00,000</option>
                  </select>
                </div>
              </div>
            </div>
            
            {marketData && (
              <div className="mt-4 text-xs text-right text-muted-foreground">
                Market data last updated: {marketData.timestamp}
              </div>
            )}
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="allocation">Allocation</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-4">Recommended Portfolio</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Asset Allocation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span>Equity</span>
                          <div className="flex items-center">
                            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                              <div 
                                className="h-full bg-blue-500 rounded-full" 
                                style={{ width: `${recommendations.filter(r => r.type === 'Mutual Fund' || r.type === 'ETF' || r.type === 'Index Fund').reduce((sum, r) => sum + r.allocation, 0) / userProfile.monthlyInvestment * 100}%` }}
                              />
                            </div>
                            <span className="text-sm">
                              {Math.round(recommendations.filter(r => r.type === 'Mutual Fund' || r.type === 'ETF' || r.type === 'Index Fund').reduce((sum, r) => sum + r.allocation, 0) / userProfile.monthlyInvestment * 100)}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span>Debt</span>
                          <div className="flex items-center">
                            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                              <div 
                                className="h-full bg-green-500 rounded-full" 
                                style={{ width: `${recommendations.filter(r => r.type === 'Debt').reduce((sum, r) => sum + r.allocation, 0) / userProfile.monthlyInvestment * 100}%` }}
                              />
                            </div>
                            <span className="text-sm">
                              {Math.round(recommendations.filter(r => r.type === 'Debt').reduce((sum, r) => sum + r.allocation, 0) / userProfile.monthlyInvestment * 100)}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span>Hybrid</span>
                          <div className="flex items-center">
                            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                              <div 
                                className="h-full bg-purple-500 rounded-full" 
                                style={{ width: `${recommendations.filter(r => r.type === 'Hybrid').reduce((sum, r) => sum + r.allocation, 0) / userProfile.monthlyInvestment * 100}%` }}
                              />
                            </div>
                            <span className="text-sm">
                              {Math.round(recommendations.filter(r => r.type === 'Hybrid').reduce((sum, r) => sum + r.allocation, 0) / userProfile.monthlyInvestment * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Risk Assessment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span>Portfolio Risk</span>
                          <span className={`text-sm font-medium ${
                            userProfile.riskProfile === 'Aggressive' ? 'text-red-500' : 
                            userProfile.riskProfile === 'Moderate' ? 'text-amber-500' : 'text-green-500'
                          }`}>
                            {userProfile.riskProfile}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span>Expected Returns</span>
                          <span className="text-sm font-medium">
                            {recommendations.length > 0 ? 
                              `${(recommendations.reduce((sum, r) => sum + (r.returns.fiveYear * (r.allocation / userProfile.monthlyInvestment)), 0)).toFixed(1)}%` 
                              : '0%'}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span>Time Horizon</span>
                          <span className="text-sm">
                            {userProfile.age < 30 ? 'Long Term' : 
                             userProfile.age < 45 ? 'Medium Term' : 'Short Term'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="details">
              <div className="mt-4 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fund Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Risk</TableHead>
                      <TableHead>1Y Return</TableHead>
                      <TableHead>3Y Return</TableHead>
                      <TableHead>5Y Return</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recommendations.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.type}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell className={getRiskClassName(item.riskLevel)}>{item.riskLevel}</TableCell>
                        <TableCell className="font-medium text-green-500">{item.returns.oneYear}%</TableCell>
                        <TableCell>{item.returns.threeYear}%</TableCell>
                        <TableCell>{item.returns.fiveYear}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <p className="mt-4 text-xs text-muted-foreground">
                  * Returns shown are historical and not guaranteed for future performance.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="allocation">
              <div className="mt-4 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fund Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Monthly Investment</TableHead>
                      <TableHead>Allocation %</TableHead>
                      <TableHead>Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recommendations.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.type}</TableCell>
                        <TableCell>{formatCurrency(item.allocation)}</TableCell>
                        <TableCell>{Math.round(item.allocation / userProfile.monthlyInvestment * 100)}%</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                              <div 
                                className={`h-full ${
                                  item.recommendationScore > 80 ? 'bg-green-500' : 
                                  item.recommendationScore > 70 ? 'bg-amber-500' : 'bg-red-500'
                                } rounded-full`} 
                                style={{ width: `${item.recommendationScore}%` }}
                              />
                            </div>
                            <span className="text-sm">{item.recommendationScore}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-6 flex justify-between items-center">
                  <div className="text-sm">
                    <strong>Total Monthly Investment:</strong> {formatCurrency(userProfile.monthlyInvestment)}
                  </div>
                  <div>
                    <Button>
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Start Investing
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestmentRecommendations;
