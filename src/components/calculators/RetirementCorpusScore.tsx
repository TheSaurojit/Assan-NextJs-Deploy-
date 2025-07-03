"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Award, TrendingUp, AlertTriangle, Shield, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface RetirementCorpusScoreProps {
  age: number;
  retirementAge: number;
  currentMonthlyExpense: number;
  requiredCorpus: number | null;
  monthlyInvestment: number | null;
}

const RetirementCorpusScore = ({
  age,
  retirementAge,
  currentMonthlyExpense,
  requiredCorpus,
  monthlyInvestment,
}: RetirementCorpusScoreProps) => {
  const [score, setScore] = useState<number>(0);
  const [factors, setFactors] = useState<{
    title: string;
    score: number;
    impact: "positive" | "negative" | "neutral";
    description: string;
  }[]>([]);

  // Calculate score based on inputs
  useEffect(() => {
    if (requiredCorpus === null || monthlyInvestment === null) return;

    // Initialize base score
    let baseScore = 550; // Starting point
    const newFactors: {
      title: string;
      score: number;
      impact: "positive" | "negative" | "neutral";
      description: string;
    }[] = [];
    

    // 1. Age factor: Younger age is better for retirement planning
    const ageFactor = Math.max(0, 40 - Math.floor((age - 20) / 2)); // Higher score for younger age
    baseScore += ageFactor;
    newFactors.push({
      title: "Age Factor",
      score: ageFactor,
      impact: ageFactor > 20 ? "positive" : ageFactor > 0 ? "neutral" : "negative",
      description: "Starting retirement planning early significantly improves your score"
    });

    // 2. Years until retirement: More years means more time to save
    const yearsUntilRetirement = retirementAge - age;
    const timeFactor = Math.min(60, yearsUntilRetirement * 3);
    baseScore += timeFactor;
    newFactors.push({
      title: "Time Horizon",
      score: timeFactor,
      impact: timeFactor > 30 ? "positive" : timeFactor > 15 ? "neutral" : "negative",
      description: "Longer time until retirement allows for more wealth accumulation"
    });

    // 3. Savings adequacy: How close is monthly investment to what's needed
    if (monthlyInvestment > 0) {
      // Calculate ideal monthly investment (simplified)
      const yearlySalary = currentMonthlyExpense * 12 * 2; // Assuming expenses are roughly half of income
      const idealMonthlyInvestment = yearlySalary * 0.15; // 15% of income as ideal savings rate
      
      // Calculate savings ratio
      const savingsRatio = Math.min(2, monthlyInvestment / idealMonthlyInvestment);
      const savingsFactor = Math.floor(savingsRatio * 80); // Up to 80 points for savings
      baseScore += savingsFactor;
      
      newFactors.push({
        title: "Savings Rate",
        score: savingsFactor,
        impact: savingsFactor > 40 ? "positive" : savingsFactor > 20 ? "neutral" : "negative",
        description: "Higher monthly investments relative to income improve long-term security"
      });
    }

    // 4. Corpus adequacy: Is the target corpus sufficient based on expenses?
    if (requiredCorpus > 0) {
      const expenseMultiple = requiredCorpus / (currentMonthlyExpense * 12);
      let corpusFactor = 0;
      
      // Industry standard suggests 25-30x annual expenses
      if (expenseMultiple >= 30) {
        corpusFactor = 100;
      } else if (expenseMultiple >= 25) {
        corpusFactor = 80;
      } else if (expenseMultiple >= 20) {
        corpusFactor = 60;
      } else if (expenseMultiple >= 15) {
        corpusFactor = 40;
      } else if (expenseMultiple >= 10) {
        corpusFactor = 20;
      }
      
      baseScore += corpusFactor;
      
      newFactors.push({
        title: "Corpus Adequacy",
        score: corpusFactor,
        impact: corpusFactor > 60 ? "positive" : corpusFactor > 30 ? "neutral" : "negative",
        description: "Target corpus should be at least 25x your annual expenses"
      });
    }

    // 5. Expense management: Lower expenses relative to typical expenses in India
    // Average Indian household monthly expenses ~₹30,000 (adjust for location and lifestyle)
    const expenseRatio = Math.min(3, currentMonthlyExpense / 30000);
    const expenseFactor = Math.max(-40, 40 - Math.floor(expenseRatio * 30));
    baseScore += expenseFactor;
    
    newFactors.push({
      title: "Expense Management",
      score: expenseFactor,
      impact: expenseFactor > 20 ? "positive" : expenseFactor > 0 ? "neutral" : "negative",
      description: "Lower current expenses make it easier to maintain lifestyle in retirement"
    });

    // Ensure score is within reasonable bounds (300-900 like CIBIL)
    const finalScore = Math.max(300, Math.min(900, baseScore));
    
    setScore(finalScore);
    setFactors(newFactors);
  }, [age, retirementAge, currentMonthlyExpense, requiredCorpus, monthlyInvestment]);

  // Get score interpretation
  const getScoreCategory = () => {
    if (score >= 750) return { label: "Excellent", color: "text-green-500" };
    if (score >= 650) return { label: "Good", color: "text-blue-500" };
    if (score >= 550) return { label: "Fair", color: "text-amber-500" };
    if (score >= 450) return { label: "Poor", color: "text-orange-500" };
    return { label: "Very Poor", color: "text-red-500" };
  };

  const getScoreColor = () => {
    if (score >= 750) return "bg-green-500";
    if (score >= 650) return "bg-blue-500";
    if (score >= 550) return "bg-amber-500";
    if (score >= 450) return "bg-orange-500";
    return "bg-red-500";
  };

  // Get improvement suggestions
  const getImprovementSuggestions = () => {
    const suggestions: string[] = [];

    
    // Find the lowest scoring factors
    const sortedFactors = [...factors].sort((a, b) => a.score - b.score);
    const lowestFactors = sortedFactors.slice(0, 2);
    
    lowestFactors.forEach(factor => {
      if (factor.title === "Age Factor" && factor.impact !== "positive") {
        suggestions.push("Consider increasing your monthly investment to compensate for a later start");
      }
      
      if (factor.title === "Time Horizon" && factor.impact !== "positive") {
        suggestions.push("You may need to delay retirement or significantly increase savings rate");
      }
      
      if (factor.title === "Savings Rate" && factor.impact !== "positive") {
        suggestions.push("Try to increase your monthly investment to at least 15% of your income");
      }
      
      if (factor.title === "Corpus Adequacy" && factor.impact !== "positive") {
        suggestions.push("Aim for a retirement corpus of at least 25-30x your annual expenses");
      }
      
      if (factor.title === "Expense Management" && factor.impact !== "positive") {
        suggestions.push("Consider ways to reduce your current expenses to improve retirement readiness");
      }
    });
    
    return suggestions;
  };

  const scoreCategory = getScoreCategory();
  const improvementSuggestions = getImprovementSuggestions();

  return (
    <Card className="retirement-score-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Award className="h-6 w-6 text-finance-gold" />
          Retirement Corpus Score
        </CardTitle>
        <CardDescription>
          Similar to credit scores, this measures your retirement readiness on a scale of 300-900
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score Display */}
        <div className="flex flex-col items-center justify-center py-4">
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 120 120">
              <circle 
                cx="60" 
                cy="60" 
                r="54" 
                fill="none" 
                stroke="#e2e8f0" 
                strokeWidth="12" 
              />
              <circle 
                cx="60" 
                cy="60" 
                r="54" 
                fill="none" 
                stroke={getScoreColor().replace('bg-', 'var(--')}
                strokeWidth="12" 
                strokeDasharray="339.3" 
                strokeDashoffset={339.3 - (339.3 * (score - 300) / 600)} 
                transform="rotate(-90 60 60)" 
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <div className={`text-4xl font-bold ${scoreCategory.color}`}>{score}</div>
              <div className="text-sm font-medium">{scoreCategory.label}</div>
            </div>
          </div>
          
          <div className="flex justify-between w-full max-w-md mt-4 px-4 text-sm text-muted-foreground">
            <span>Poor</span>
            <span>Fair</span>
            <span>Good</span>
            <span>Excellent</span>
          </div>
          <div className="w-full max-w-md h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full grid grid-cols-4">
              <div className="bg-red-400"></div>
              <div className="bg-amber-400"></div>
              <div className="bg-blue-400"></div>
              <div className="bg-green-400"></div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Score Breakdown */}
        <div>
          <h3 className="text-lg font-medium mb-4">Score Factors</h3>
          <div className="space-y-3">
            {factors.map((factor, index) => (
              <div key={index} className="flex flex-col">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="flex items-center gap-2 cursor-help">
                            {factor.title}
                            {factor.impact === "positive" && <TrendingUp className="h-4 w-4 text-green-500" />}
                            {factor.impact === "negative" && <AlertTriangle className="h-4 w-4 text-red-500" />}
                            {factor.impact === "neutral" && <Shield className="h-4 w-4 text-amber-500" />}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>{factor.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Badge 
                    variant={
                      factor.impact === "positive" ? "default" : 
                      factor.impact === "negative" ? "destructive" : "outline"
                    }
                  >
                    {factor.score > 0 ? `+${factor.score}` : factor.score}
                  </Badge>
                </div>
                <Progress 
                  className="h-2 mt-1" 
                  value={Math.max(0, Math.min(100, (factor.score + 50) * 100 / 150))} 
                />
              </div>
            ))}
          </div>
        </div>

        {improvementSuggestions.length > 0 && (
          <>
            <Separator />
            
            {/* Improvement Suggestions */}
            <div>
              <h3 className="text-lg font-medium mb-2">How to Improve Your Score</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                {improvementSuggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-muted-foreground border-t pt-4">
        <div>Based on recommended standards for retirement planning in India</div>
        <Button variant="ghost" size="sm" className="text-xs flex items-center gap-1">
          View detailed report <ArrowRight className="h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RetirementCorpusScore;
