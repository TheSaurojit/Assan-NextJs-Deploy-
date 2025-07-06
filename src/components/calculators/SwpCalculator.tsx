"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";

interface SWPResult {
  finalValue: number;
  totalWithdrawn: number;
  yearlyData: Array<{
    year: number;
    balance: number;
    withdrawn: number;
  }>;
}

const SWPCalculator = () => {
  const [initialInvestment, setInitialInvestment] = useState(2000000);
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState(10000);
  const [interestRate, setInterestRate] = useState(8);
  const [duration, setDuration] = useState(20);
  const [swpResult, setSwpResult] = useState<SWPResult | null>(null);

  useEffect(() => {
    calculateSWP();
  }, [initialInvestment, monthlyWithdrawal, interestRate, duration]);

  const calculateSWP = () => {
    let balance = initialInvestment;
    const yearlyData = [];
    const monthlyRate = interestRate / 12 / 100;
    let totalWithdrawn = 0;

    for (let year = 1; year <= duration; year++) {
      for (let month = 1; month <= 12; month++) {
        balance = balance * (1 + monthlyRate) - monthlyWithdrawal;
        totalWithdrawn += monthlyWithdrawal;
        if (balance <= 0) {
          balance = 0;
          break;
        }
      }
      yearlyData.push({
        year,
        balance: Math.max(0, balance),
        withdrawn: Math.min(initialInvestment, totalWithdrawn),
      });
      if (balance <= 0) break;
    }

    setSwpResult({
      finalValue: balance,
      totalWithdrawn,
      yearlyData,
    });
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
    return `₹${amount.toFixed(2)}`;
  };

  return (
    <Card className="calculator-card w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-finance-teal">SWP Calculator</CardTitle>
        <CardDescription>
          Estimate your Systematic Withdrawal Plan outcomes over time.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Initial Investment (₹)</Label>
              <Input
                type="number"
                value={initialInvestment}
                onChange={(e) => setInitialInvestment(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label>Monthly Withdrawal (₹)</Label>
              <Input
                type="number"
                value={monthlyWithdrawal}
                onChange={(e) => setMonthlyWithdrawal(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label>Duration (Years)</Label>
              <Slider
                min={1}
                max={40}
                step={1}
                value={[duration]}
                onValueChange={(value) => setDuration(value[0])}
              />
              <div>{duration} years</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Expected Return Rate (% p.a.)</Label>
              <Slider
                min={4}
                max={15}
                step={0.1}
                value={[interestRate]}
                onValueChange={(value) => setInterestRate(value[0])}
              />
              <div>{interestRate}%</div>
            </div>
          </div>
        </div>

        {swpResult && (
          <div className="mt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="stat-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Withdrawn</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-finance-blue">
                    {formatCurrency(swpResult.totalWithdrawn)}
                  </div>
                </CardContent>
              </Card>

              <Card className="stat-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Final Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-finance-teal">
                    {formatCurrency(swpResult.finalValue)}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="h-72 overflow-x-auto">
              <div className="min-w-[700px]">
                <ResponsiveContainer width="100%" height={288}>
                  <AreaChart data={swpResult.yearlyData} margin={{ top: 10, right: 30, left: 50, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottomRight', offset: -10 }} />
                    <YAxis
                      tickFormatter={(value) => formatCurrency(value)}
                      label={{
                        value: "Amount (₹)",
                        angle: -90,
                        position: "insideLeft",
                        dx: -30,
                      }}
                    />
                    <RechartsTooltip
                      formatter={(value: number) => [`₹${value.toLocaleString()}`, ""]}
                      labelFormatter={(label) => `Year ${label}`}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="balance"
                      name="Remaining Balance"
                      stroke="#1e40af"
                      fill="#1e40af40"
                    />
                    <Area
                      type="monotone"
                      dataKey="withdrawn"
                      name="Total Withdrawn"
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
          <p>This calculator assumes a fixed monthly withdrawal and compound interest.</p>
          <p>Returns are calculated monthly and added to the remaining balance.</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SWPCalculator;
