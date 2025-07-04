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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { InfoIcon } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip as RechartsTooltip,
} from "recharts";

interface HLVYearlyData {
  year: number;
  income: number;
  presentValue: number;
}

interface HLVResult {
  totalHLV: number;
  totalIncome: number;
  yearlyData: HLVYearlyData[];
}

const HLVCalculator = () => {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [annualIncome, setAnnualIncome] = useState(800000);
  const [growthRate, setGrowthRate] = useState(5);
  const [discountRate, setDiscountRate] = useState(6);
  const [hlvResult, setHlvResult] = useState<HLVResult | null>(null);

  useEffect(() => {
    calculateHLV();
  }, [currentAge, retirementAge, annualIncome, growthRate, discountRate]);

  const calculateHLV = () => {
    const years = retirementAge - currentAge;
    let totalHLV = 0;
    let totalIncome = 0;
    const data: HLVYearlyData[] = [];

    for (let i = 1; i <= years; i++) {
      const projectedIncome = annualIncome * Math.pow(1 + growthRate / 100, i);
      const pv = projectedIncome / Math.pow(1 + discountRate / 100, i);

      totalHLV += pv;
      totalIncome += projectedIncome;

      data.push({
        year: i,
        income: projectedIncome,
        presentValue: pv,
      });
    }

    setHlvResult({ totalHLV, totalIncome, yearlyData: data });
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
    return `₹${amount.toFixed(2)}`;
  };

  return (
    <Card className="calculator-card w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-finance-teal">
          Human Life Value (HLV) Calculator
        </CardTitle>
        <CardDescription>
          Estimate the present value of your future income potential
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-age">Current Age</Label>
              <Input
                id="current-age"
                type="number"
                min={18}
                value={currentAge}
                onChange={(e) => setCurrentAge(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="retirement-age">Retirement Age</Label>
              <Input
                id="retirement-age"
                type="number"
                min={currentAge + 1}
                value={retirementAge}
                onChange={(e) => setRetirementAge(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="annual-income">Current Annual Income (₹)</Label>
              <Input
                id="annual-income"
                type="number"
                value={annualIncome}
                onChange={(e) => setAnnualIncome(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center">
                Growth Rate (% p.a.)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-4 w-4 ml-1 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-64">
                        Expected yearly increase in your income.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <span className="ml-2 font-semibold">{growthRate}%</span>
              </Label>
              <Slider
                min={0}
                max={15}
                step={0.5}
                value={[growthRate]}
                onValueChange={(value) => setGrowthRate(value[0])}
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center">
                Discount Rate (% p.a.)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-4 w-4 ml-1 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-64">
                        Used to calculate the present value (accounts for
                        inflation/risk).
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <span className="ml-2 font-semibold">{discountRate}%</span>
              </Label>
              <Slider
                min={1}
                max={15}
                step={0.5}
                value={[discountRate]}
                onValueChange={(value) => setDiscountRate(value[0])}
              />
            </div>
          </div>
        </div>

        {hlvResult && (
          <div className="mt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="stat-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Future Income
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-finance-blue">
                    {formatCurrency(hlvResult.totalIncome)}
                  </div>
                </CardContent>
              </Card>

              <Card className="stat-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Human Life Value (Present Value)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-finance-teal">
                    {formatCurrency(hlvResult.totalHLV)}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="h-72 overflow-x-auto">
              <div className="min-w-[700px]">
                <ResponsiveContainer width="100%" height={288}>
                  <AreaChart
                    data={hlvResult.yearlyData}
                    margin={{ top: 10, right: 20, left: 40, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="year"
                      label={{
                        value: "Years",
                        position: "insideBottomRight",
                        offset: -10,
                      }}
                    />
                    <YAxis
                      tickFormatter={(value: number) => formatCurrency(value)}
                      label={{
                        value: "Amount (₹)",
                        angle: -90,
                        position: "insideLeft",
                        dx: -25, // try -10 or -15, not too large
                      }}
                    />

                    <RechartsTooltip
                      formatter={(value: number) => [
                        `₹${value.toLocaleString()}`,
                        "",
                      ]}
                      labelFormatter={(label) => `Year ${label}`}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="income"
                      name="Projected Income"
                      stackId="1"
                      stroke="#1e40af"
                      fill="#1e40af40"
                    />
                    <Area
                      type="monotone"
                      dataKey="presentValue"
                      name="Present Value"
                      stackId="1"
                      stroke="#0d9488"
                      fill="#0d948840"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-6">
        <div className="text-sm text-muted-foreground">
          <p>
            This calculator assumes a constant income growth and discount rate
            throughout your working years.
          </p>
          <p>It is intended for estimation purposes only.</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default HLVCalculator;
