"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import { InfoIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import RetirementChart from "./RetirementChart";
import RetirementCorpusScore from "./RetirementCorpusScore";
import RetirementInsights from "./RetirementInsights";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface RetirementResult {
  requiredCorpus: number;
  monthlyInvestment: number;
  yearlyInvestment: number;
  years: number[];
  investmentData: number[];
  growthData: number[];
}

const RetirementCalculator = () => {
  const { toast } = useToast();
  const [age, setAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [lifeExpectancy, setLifeExpectancy] = useState(85);
  const [currentMonthlyExpense, setCurrentMonthlyExpense] = useState(50000);
  const [inflationRate, setInflationRate] = useState(6);
  const [expectedReturns, setExpectedReturns] = useState(12);
  const [retirementResult, setRetirementResult] =
    useState<RetirementResult | null>(null);
  const [activeTab, setActiveTab] = useState("calculator");

  // Calculate years until retirement
  const yearsUntilRetirement = retirementAge - age;

  // Calculate retirement duration
  const retirementDuration = lifeExpectancy - retirementAge;

  useEffect(() => {
    // Auto-calculate when inputs change
    calculateRetirement();
  }, [
    age,
    retirementAge,
    lifeExpectancy,
    currentMonthlyExpense,
    inflationRate,
    expectedReturns,
  ]);

  const calculateRetirement = () => {
    if (yearsUntilRetirement <= 0) {
      toast({
        title: "Invalid age inputs",
        description: "Retirement age must be greater than current age.",
        variant: "destructive",
      });
      return;
    }

    if (retirementDuration <= 0) {
      toast({
        title: "Invalid age inputs",
        description: "Life expectancy must be greater than retirement age.",
        variant: "destructive",
      });
      return;
    }

    // Calculate future monthly expenses at retirement
    const futureMonthlyExpense =
      currentMonthlyExpense *
      Math.pow(1 + inflationRate / 100, yearsUntilRetirement);

    // Calculate yearly expenses during retirement
    const yearlyExpenseAtRetirement = futureMonthlyExpense * 12;

    // Calculate corpus required at retirement using the 4% rule as a base, adjusted for inflation and returns
    // This is a simplified calculation for demonstration
    const withdrawalRate = Math.max(
      0.04,
      (inflationRate - expectedReturns * 0.7) / 100
    );
    const requiredCorpus = yearlyExpenseAtRetirement / withdrawalRate;

    // Calculate required monthly investment to reach corpus
    const monthlyRate = expectedReturns / 100 / 12;
    const numPayments = yearsUntilRetirement * 12;

    // PMT formula for required monthly investment
    const monthlyInvestment =
      (requiredCorpus * monthlyRate) /
      (Math.pow(1 + monthlyRate, numPayments) - 1);

    // Generate data for the chart
    const years: number[] = [];
    const investmentData: number[] = [];
    const growthData: number[] = [];

    let totalInvestment = 0;
    let currentValue = 0;

    for (let year = 0; year <= yearsUntilRetirement; year++) {
      years.push(year);

      if (year === 0) {
        investmentData.push(0);
        growthData.push(0);
      } else {
        const yearlyInvestment = monthlyInvestment * 12;
        totalInvestment += yearlyInvestment;

        // Calculate growth (compound interest on previous value + new investment)
        const previousValue = currentValue;
        currentValue =
          (previousValue + yearlyInvestment) * (1 + expectedReturns / 100);

        investmentData.push(totalInvestment);
        growthData.push(currentValue);
      }
    }

    setRetirementResult({
      requiredCorpus,
      monthlyInvestment,
      yearlyInvestment: monthlyInvestment * 12,
      years,
      investmentData,
      growthData,
    });
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    } else {
      return `₹${amount.toFixed(2)}`;
    }
  };

  return (
    <Card className="calculator-card w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-finance-blue">
          Retirement Calculator
        </CardTitle>
        <CardDescription>
          Plan your retirement by estimating how much you need to save to
          maintain your lifestyle
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="score">Corpus Score</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="current-age" className="finance-label">
                      Current Age
                      <span className="text-lg ml-2 font-semibold">{age}</span>
                    </Label>
                  </div>
                  <Slider
                    id="current-age"
                    min={18}
                    max={70}
                    step={1}
                    value={[age]}
                    onValueChange={(value: number[]) => setAge(value[0])}
                    className="mt-2"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="retirement-age" className="finance-label">
                      Retirement Age
                      <span className="text-lg ml-2 font-semibold">
                        {retirementAge}
                      </span>
                    </Label>
                  </div>
                  <Slider
                    id="retirement-age"
                    min={45}
                    max={75}
                    step={1}
                    value={[retirementAge]}
                    onValueChange={(value: number[]) =>
                      setRetirementAge(value[0])
                    }
                    className="mt-2"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="life-expectancy"
                      className="finance-label flex items-center"
                    >
                      Life Expectancy
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoIcon className="h-4 w-4 ml-1 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-56">
                              Current life expectancy in India is around 70-75
                              years, but planning for longer ensures financial
                              security.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <span className="text-lg ml-2 font-semibold">
                        {lifeExpectancy}
                      </span>
                    </Label>
                  </div>
                  <Slider
                    id="life-expectancy"
                    min={70}
                    max={100}
                    step={1}
                    value={[lifeExpectancy]}
                    onValueChange={(value: number[]) =>
                      setLifeExpectancy(value[0])
                    }
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="current-monthly-expense"
                    className="finance-label"
                  >
                    Current Monthly Expenses (₹)
                  </Label>
                  <Input
                    id="current-monthly-expense"
                    type="number"
                    value={currentMonthlyExpense}
                    onChange={(e) =>
                      setCurrentMonthlyExpense(Number(e.target.value))
                    }
                    className="finance-input"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="inflation-rate" className="finance-label">
                      Inflation Rate (%)
                      <span className="text-lg ml-2 font-semibold">
                        {inflationRate}%
                      </span>
                    </Label>
                  </div>
                  <Slider
                    id="inflation-rate"
                    min={2}
                    max={10}
                    step={0.5}
                    value={[inflationRate]}
                    onValueChange={(value: number[]) =>
                      setInflationRate(value[0])
                    }
                    className="mt-2"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="expected-returns" className="finance-label">
                      Expected Investment Returns (%)
                      <span className="text-lg ml-2 font-semibold">
                        {expectedReturns}%
                      </span>
                    </Label>
                  </div>
                  <Slider
                    id="expected-returns"
                    min={4}
                    max={18}
                    step={0.5}
                    value={[expectedReturns]}
                    onValueChange={(value: number[]) =>
                      setExpectedReturns(value[0])
                    }
                    className="mt-2"
                  />
                </div>
              </div>
            </div>

            {retirementResult && (
              <div className="mt-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="stat-card">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Required Corpus
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-finance-blue">
                        {formatCurrency(retirementResult.requiredCorpus)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="stat-card">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Monthly Investment
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-finance-teal">
                        {formatCurrency(retirementResult.monthlyInvestment)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="stat-card">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Years to Retirement
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-finance-gold">
                        {yearsUntilRetirement} years
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="w-full overflow-x-auto">
                  <div className="min-w-[700px] ">
                    <RetirementChart
                      years={retirementResult.years}
                      investmentData={retirementResult.investmentData}
                      growthData={retirementResult.growthData}
                    />
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="score" className="mt-4">
            {retirementResult && (
              <RetirementCorpusScore
                age={age}
                retirementAge={retirementAge}
                currentMonthlyExpense={currentMonthlyExpense}
                requiredCorpus={retirementResult.requiredCorpus}
                monthlyInvestment={retirementResult.monthlyInvestment}
              />
            )}

            {!retirementResult && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Complete the calculator to see your retirement corpus score
                </p>
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("calculator")}
                  className="mt-4"
                >
                  Go to Calculator
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="insights" className="mt-4">
            {retirementResult ? (
              <RetirementInsights
                age={age}
                requiredCorpus={retirementResult.requiredCorpus}
                monthlyInvestment={retirementResult.monthlyInvestment}
                yearsUntilRetirement={yearsUntilRetirement}
                expectedReturns={expectedReturns}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Complete the calculator to get AI-powered retirement insights
                </p>
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("calculator")}
                  className="mt-4"
                >
                  Go to Calculator
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-sm text-muted-foreground">
          <p>
            The calculations are based on constant rates of return and
            inflation.
          </p>
          <p>
            Actual results may vary based on market conditions and investment
            choices.
          </p>
        </div>
        <Button onClick={calculateRetirement}>Recalculate</Button>
      </CardFooter>
    </Card>
  );
};

export default RetirementCalculator;
