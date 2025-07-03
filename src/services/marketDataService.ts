
import { useToast } from "@/hooks/use-toast";

// Types for market data
export interface MutualFund {
  id: string;
  name: string;
  category: string;
  oneYearReturn: number;
  threeYearReturn: number;
  fiveYearReturn: number;
  nav: number;
  aum: number; // Assets under management in crores
  expenseRatio: number;
  riskLevel: "Low" | "Moderate" | "High";
  rating: number;
  trending: "up" | "down" | "neutral";
}

export interface StockIndex {
  name: string;
  value: number;
  change: number;
  percentChange: number;
}

// This would connect to real APIs in production
// For demonstration, using realistic mock data with simulated real-time fluctuations
export const fetchMutualFunds = async (): Promise<MutualFund[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Base mutual fund data
  const baseFunds = [
    {
      id: "1",
      name: "SBI Blue Chip Fund",
      category: "Large Cap",
      oneYearReturn: 15.3,
      threeYearReturn: 12.1,
      fiveYearReturn: 10.8,
      nav: 64.82,
      aum: 32456,
      expenseRatio: 1.2,
      riskLevel: "Moderate" as const,
      rating: 5,
      trending: "up" as const
    },
    {
      id: "2",
      name: "HDFC Balanced Advantage Fund",
      category: "Hybrid",
      oneYearReturn: 16.2,
      threeYearReturn: 13.8,
      fiveYearReturn: 11.5,
      nav: 298.75,
      aum: 45678,
      expenseRatio: 1.6,
      riskLevel: "Moderate" as const,
      rating: 5,
      trending: "up" as const
    },
    {
      id: "3",
      name: "Axis Midcap Fund",
      category: "Mid Cap",
      oneYearReturn: 18.7,
      threeYearReturn: 16.2,
      fiveYearReturn: 14.8,
      nav: 87.56,
      aum: 12567,
      expenseRatio: 1.8,
      riskLevel: "High" as const,
      rating: 4,
      trending: "up" as const
    },
    {
      id: "4",
      name: "Mirae Asset Emerging Bluechip",
      category: "Large & Mid Cap",
      oneYearReturn: 19.5,
      threeYearReturn: 17.3,
      fiveYearReturn: 15.8,
      nav: 112.34,
      aum: 23456,
      expenseRatio: 1.7,
      riskLevel: "High" as const,
      rating: 5,
      trending: "up" as const
    },
    {
      id: "5",
      name: "Kotak Small Cap Fund",
      category: "Small Cap",
      oneYearReturn: 22.4,
      threeYearReturn: 19.8,
      fiveYearReturn: 16.7,
      nav: 156.78,
      aum: 10234,
      expenseRatio: 2.0,
      riskLevel: "High" as const,
      rating: 4,
      trending: "up" as const
    },
    {
      id: "6",
      name: "ICICI Prudential Value Discovery",
      category: "Value",
      oneYearReturn: 14.3,
      threeYearReturn: 11.9,
      fiveYearReturn: 10.5,
      nav: 187.92,
      aum: 21345,
      expenseRatio: 1.6,
      riskLevel: "Moderate" as const,
      rating: 4,
      trending: "up" as const
    },
    {
      id: "7",
      name: "Aditya Birla Sun Life Tax Relief 96",
      category: "ELSS",
      oneYearReturn: 17.3,
      threeYearReturn: 14.5,
      fiveYearReturn: 12.6,
      nav: 43.21,
      aum: 9876,
      expenseRatio: 1.9,
      riskLevel: "High" as const,
      rating: 4,
      trending: "up" as const
    },
    {
      id: "8",
      name: "Parag Parikh Flexi Cap Fund",
      category: "Flexi Cap",
      oneYearReturn: 16.8,
      threeYearReturn: 15.2,
      fiveYearReturn: 13.9,
      nav: 56.43,
      aum: 14567,
      expenseRatio: 1.5,
      riskLevel: "Moderate" as const,
      rating: 5,
      trending: "up" as const
    },
    {
      id: "9",
      name: "HDFC Corporate Bond Fund",
      category: "Debt",
      oneYearReturn: 8.4,
      threeYearReturn: 7.6,
      fiveYearReturn: 7.3,
      nav: 26.54,
      aum: 28764,
      expenseRatio: 0.9,
      riskLevel: "Low" as const,
      rating: 4,
      trending: "neutral" as const
    },
    {
      id: "10",
      name: "DSP Nifty 50 Index Fund",
      category: "Index",
      oneYearReturn: 13.8,
      threeYearReturn: 12.3,
      fiveYearReturn: 10.9,
      nav: 16.75,
      aum: 5678,
      expenseRatio: 0.5,
      riskLevel: "Moderate" as const,
      rating: 4,
      trending: "neutral" as const
    },
    // Add more India-specific mutual fund options
    {
      id: "11",
      name: "UTI Nifty Next 50 Index Fund",
      category: "Index",
      oneYearReturn: 14.2,
      threeYearReturn: 13.1,
      fiveYearReturn: 11.5,
      nav: 18.65,
      aum: 4329,
      expenseRatio: 0.4,
      riskLevel: "Moderate" as const,
      rating: 4,
      trending: "up" as const
    },
    {
      id: "12",
      name: "ICICI Prudential Bluechip Fund",
      category: "Large Cap",
      oneYearReturn: 14.8,
      threeYearReturn: 11.9,
      fiveYearReturn: 10.7,
      nav: 72.45,
      aum: 36721,
      expenseRatio: 1.3,
      riskLevel: "Moderate" as const,
      rating: 5,
      trending: "up" as const
    },
    {
      id: "13",
      name: "Franklin India Smaller Companies Fund",
      category: "Small Cap",
      oneYearReturn: 21.7,
      threeYearReturn: 18.4,
      fiveYearReturn: 15.3,
      nav: 88.24,
      aum: 8563,
      expenseRatio: 2.1,
      riskLevel: "High" as const,
      rating: 4,
      trending: "up" as const
    },
    {
      id: "14",
      name: "Canara Robeco Bluechip Equity Fund",
      category: "Large Cap",
      oneYearReturn: 15.6,
      threeYearReturn: 12.8,
      fiveYearReturn: 11.2,
      nav: 42.36,
      aum: 12765,
      expenseRatio: 1.4,
      riskLevel: "Moderate" as const,
      rating: 4,
      trending: "up" as const
    }
  ];
  
  // Simulate real-time data by adding small random fluctuations
  return baseFunds.map(fund => ({
    ...fund,
    oneYearReturn: addRandomFluctuation(fund.oneYearReturn, 0.2),
    threeYearReturn: addRandomFluctuation(fund.threeYearReturn, 0.1),
    fiveYearReturn: addRandomFluctuation(fund.fiveYearReturn, 0.05),
    nav: addRandomFluctuation(fund.nav, 0.05),
    trending: getRandomTrending(fund.trending)
  }));
};

export const fetchMarketIndices = async (): Promise<StockIndex[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Base index data
  const baseIndices = [
    {
      name: "NIFTY 50",
      value: 23487.65,
      change: 183.45,
      percentChange: 0.79
    },
    {
      name: "SENSEX",
      value: 78342.18,
      change: 612.75,
      percentChange: 0.85
    },
    {
      name: "BANK NIFTY",
      value: 48598.32,
      change: -156.78,
      percentChange: -0.32
    },
    {
      name: "NIFTY MIDCAP 100",
      value: 42785.65,
      change: 345.28,
      percentChange: 0.81
    },
    {
      name: "NIFTY SMALLCAP 100",
      value: 15876.43,
      change: 178.34,
      percentChange: 1.13
    },
    // Add more Indian indices
    {
      name: "NIFTY AUTO",
      value: 19875.23,
      change: 167.34,
      percentChange: 0.85
    },
    {
      name: "NIFTY IT",
      value: 36542.65,
      change: -243.56,
      percentChange: -0.66
    },
    {
      name: "NIFTY PHARMA",
      value: 16429.78,
      change: 112.45,
      percentChange: 0.69
    }
  ];
  
  // Simulate real-time data by adding small random fluctuations
  return baseIndices.map(index => {
    const newPercentChange = addRandomFluctuation(index.percentChange, 0.1);
    const newChange = (newPercentChange * index.value) / 100;
    
    return {
      ...index,
      change: parseFloat(newChange.toFixed(2)),
      percentChange: parseFloat(newPercentChange.toFixed(2))
    };
  });
};

// Helper function to add small random fluctuations to simulate real-time changes
const addRandomFluctuation = (value: number, maxFluctuation: number): number => {
  // Generate random number between -maxFluctuation and +maxFluctuation
  const fluctuation = (Math.random() * maxFluctuation * 2) - maxFluctuation;
  return parseFloat((value + fluctuation).toFixed(2));
};

// Helper to randomly update trending status
const getRandomTrending = (currentTrend: "up" | "down" | "neutral"): "up" | "down" | "neutral" => {
  const random = Math.random();
  
  // 70% chance to keep current trend, 30% to change
  if (random < 0.7) return currentTrend;
  
  // If changing, determine new trend
  if (random < 0.85) return "up";
  if (random < 0.95) return "down";
  return "neutral";
};

// Add function to fetch real-time market news (simulation)
export const fetchMarketNews = async (): Promise<{title: string; summary: string; date: string}[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    {
      title: "Markets reach new highs as FII inflows increase",
      summary: "Foreign Institutional Investors have pumped in over ₹15,000 crores in the last week.",
      date: new Date().toISOString().split('T')[0]
    },
    {
      title: "RBI keeps repo rate unchanged at 6.5%",
      summary: "The central bank maintains its stance citing inflation concerns.",
      date: new Date().toISOString().split('T')[0]
    },
    {
      title: "IT sector leads gains amid global tech rally",
      summary: "Indian IT stocks follow global peers higher on AI optimism.",
      date: new Date().toISOString().split('T')[0]
    },
    {
      title: "New pension reforms announced by government",
      summary: "Changes to NPS to offer more flexibility and higher returns for subscribers.",
      date: new Date().toISOString().split('T')[0]
    },
    {
      title: "Retirement planning gains focus among millennials",
      summary: "Financial advisors report surge in retirement planning queries from 25-35 age group.",
      date: new Date().toISOString().split('T')[0]
    }
  ];
};

// Add function to fetch retirement calculator recommendations
export const fetchRetirementCalculators = async (): Promise<{name: string; provider: string; features: string[]; url: string}[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return [
    {
      name: "NPS Retirement Calculator",
      provider: "NSDL",
      features: [
        "Government-approved pension scheme calculator",
        "Tax benefits projection",
        "Tier I and Tier II account simulations"
      ],
      url: "https://npscra.nsdl.co.in"
    },
    {
      name: "HDFC Retirement Calculator",
      provider: "HDFC Life",
      features: [
        "Simple, intuitive inputs for corpus planning",
        "Life expectancy based calculations",
        "Inflation-adjusted projections"
      ],
      url: "https://www.hdfclife.com/retirement-plans/retirement-calculator"
    },
    {
      name: "ET Money Retirement Planner",
      provider: "ET Money",
      features: [
        "Considers lifestyle and inflation factors",
        "Personalized retirement age recommendations",
        "Real-time mutual fund integration"
      ],
      url: "https://www.etmoney.com/tools-and-calculators/retirement-planner"
    },
    {
      name: "ClearTax Retirement Calculator",
      provider: "ClearTax",
      features: [
        "Includes tax impact projections",
        "Post-retirement income planning",
        "Multiple investment scenarios"
      ],
      url: "https://cleartax.in/s/retirement-planning-calculator"
    }
  ];
};

// Add function to fetch fintech retirement tools
export const fetchFintechRetirementTools = async (): Promise<{name: string; category: string; description: string; features: string[]}[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    {
      name: "Zerodha Coin",
      category: "Robo-Advisor",
      description: "Zero-commission direct mutual fund platform with retirement planning tools",
      features: [
        "AI-based investment strategies",
        "Retirement corpus forecasting",
        "Zero commission direct mutual funds",
        "Automated SIP management"
      ]
    },
    {
      name: "Scripbox",
      category: "Digital Wealth Manager",
      description: "Scientific investment approach to long-term wealth creation",
      features: [
        "Personalized retirement planning",
        "Portfolio rebalancing",
        "Tax-optimized investment strategies",
        "Goal-based retirement planning"
      ]
    },
    {
      name: "Kuvera",
      category: "Robo-Advisor",
      description: "Free direct mutual fund platform with advanced retirement planning",
      features: [
        "Goal-based investing",
        "Smart portfolio suggestions",
        "Retirement goal tracking",
        "Real-time portfolio analytics"
      ]
    },
    {
      name: "ETMONEY SmartDeposit",
      category: "Smart Investment",
      description: "Liquid fund investment with returns better than savings account",
      features: [
        "Automated investment management",
        "Instant withdrawal facility",
        "Better returns than FD",
        "Ideal for retirement emergency corpus"
      ]
    },
    {
      name: "Paytm Money",
      category: "Digital Investment Platform",
      description: "One-stop platform for mutual funds, stocks and NPS",
      features: [
        "NPS account management",
        "Direct mutual fund investments",
        "Retirement corpus simulation",
        "Paperless investment process"
      ]
    }
  ];
};

export const useMarketData = () => {
  const { toast } = useToast();
  
  const fetchData = async <T,>(fetcher: () => Promise<T>, errorMessage: string): Promise<T | null> => {
    try {
      return await fetcher();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    }
  };
  
  return {
    getMutualFunds: () => fetchData(() => fetchMutualFunds(), "Failed to fetch mutual funds data"),
    getMarketIndices: () => fetchData(() => fetchMarketIndices(), "Failed to fetch market indices data"),
    getMarketNews: () => fetchData(() => fetchMarketNews(), "Failed to fetch market news"),
    getRetirementCalculators: () => fetchData(() => fetchRetirementCalculators(), "Failed to fetch retirement calculators"),
    getFintechRetirementTools: () => fetchData(() => fetchFintechRetirementTools(), "Failed to fetch fintech retirement tools")
  };
};
