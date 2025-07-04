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

interface SipResult {
  totalInvestment: number;
  estimatedReturns: number;
  maturityValue: number;
  yearlyData: Array<{
    year: number;
    investment: number;
    growth: number;
    total: number;
  }>;
}

const SipCalculator = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState(10000);
  const [duration, setDuration] = useState(20);
  const [returnRate, setReturnRate] = useState(12);
  const [sipResult, setSipResult] = useState<SipResult | null>(null);

  useEffect(() => {
    calculateSIP();
  }, [monthlyInvestment, duration, returnRate]);

  const calculateSIP = () => {
    const monthlyRate = returnRate / 12 / 100;
    const months = duration * 12;

    const maturityValue =
      monthlyInvestment *
      ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
      (1 + monthlyRate);

    const totalInvestment = monthlyInvestment * months;
    const estimatedReturns = maturityValue - totalInvestment;

    const yearlyData = [];
    let investedSoFar = 0;
    let currentValue = 0;

    for (let year = 1; year <= duration; year++) {
      const yearlyInvestment = monthlyInvestment * 12;
      investedSoFar += yearlyInvestment;

      const numOfMonths = year * 12;
      currentValue =
        monthlyInvestment *
        ((Math.pow(1 + monthlyRate, numOfMonths) - 1) / monthlyRate) *
        (1 + monthlyRate);

      yearlyData.push({
        year,
        investment: investedSoFar,
        growth: currentValue - investedSoFar,
        total: currentValue,
      });
    }

    setSipResult({
      totalInvestment,
      estimatedReturns,
      maturityValue,
      yearlyData,
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

  const formatYAxisValue = (value: number): string => {
    if (value >= 10000000) {
      return `${(value / 10000000).toFixed(1)}Cr`;
    } else if (value >= 100000) {
      return `${(value / 100000).toFixed(1)}L`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  return (
    <Card className="calculator-card w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-finance-teal">
          SIP Calculator
        </CardTitle>
        <CardDescription>
          Calculate your potential returns from Systematic Investment Plans
          (SIPs)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="monthly-investment" className="finance-label">
                Monthly Investment (₹)
              </Label>
              <Input
                id="monthly-investment"
                type="number"
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                className="finance-input"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="duration" className="finance-label">
                  Duration (Years)
                  <span className="text-lg ml-2 font-semibold">{duration}</span>
                </Label>
              </div>
              <Slider
                id="duration"
                min={1}
                max={40}
                step={1}
                value={[duration]}
                onValueChange={(value: number[]) => setDuration(value[0])}
                className="mt-2"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="return-rate"
                  className="finance-label flex items-center"
                >
                  Expected Return Rate (% p.a.)
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-4 w-4 ml-1 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-64">
                          Equity mutual funds historically deliver 12-15%
                          returns, while debt funds provide 6-8% returns over a
                          long period.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <span className="text-lg ml-2 font-semibold">
                    {returnRate}%
                  </span>
                </Label>
              </div>
              <Slider
                id="return-rate"
                min={4}
                max={18}
                step={0.5}
                value={[returnRate]}
                onValueChange={(value: number[]) => setReturnRate(value[0])}
                className="mt-2"
              />
            </div>
          </div>
        </div>

        {sipResult && (
          <div className="mt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="stat-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Investment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-finance-blue">
                    {formatCurrency(sipResult.totalInvestment)}
                  </div>
                </CardContent>
              </Card>

              <Card className="stat-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Estimated Returns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-finance-teal">
                    {formatCurrency(sipResult.estimatedReturns)}
                  </div>
                </CardContent>
              </Card>

              <Card className="stat-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Maturity Value
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-finance-gold">
                    {formatCurrency(sipResult.maturityValue)}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="h-72 overflow-x-auto">
              <div className="min-w-[700px]">
                <ResponsiveContainer width="100%" height={288}>
                  <AreaChart
                    data={sipResult.yearlyData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 20,
                      bottom: 0,
                    }}
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
                      tickFormatter={formatYAxisValue}
                      label={{
                        value: "Amount (₹)",
                        angle: -90,
                        position: "insideLeft",
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
                      dataKey="investment"
                      name="Investment"
                      stackId="1"
                      stroke="#1e40af"
                      fill="#1e40af40"
                    />
                    <Area
                      type="monotone"
                      dataKey="growth"
                      name="Growth"
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
            This calculator assumes that your monthly investment and return rate
            remain constant throughout the investment period.
          </p>
          <p>
            Actual returns will vary based on market conditions and fund
            performance.
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SipCalculator;
