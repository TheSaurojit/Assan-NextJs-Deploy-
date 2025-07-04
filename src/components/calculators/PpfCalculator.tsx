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
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";

interface PPFResult {
  totalInvestment: number;
  maturityAmount: number;
  yearlyData: Array<{
    year: number;
    balance: number;
    interest: number;
  }>;
}

const PPFCalculator = () => {
  const [annualInvestment, setAnnualInvestment] = useState(150000);
  const [duration, setDuration] = useState(15);
  const [interestRate, setInterestRate] = useState(7.1);
  const [ppfResult, setPpfResult] = useState<PPFResult | null>(null);

  useEffect(() => {
    calculatePPF();
  }, [annualInvestment, duration, interestRate]);

  const calculatePPF = () => {
    let balance = 0;
    let yearlyData = [];
    const rate = interestRate / 100;

    for (let year = 1; year <= duration; year++) {
      balance += annualInvestment;
      const interest = balance * rate;
      balance += interest;

      yearlyData.push({
        year,
        balance,
        interest,
      });
    }

    setPpfResult({
      totalInvestment: annualInvestment * duration,
      maturityAmount: balance,
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
        <CardTitle className="text-2xl font-bold text-finance-teal">
          PPF Calculator
        </CardTitle>
        <CardDescription>
          Estimate the maturity value of your Public Provident Fund (PPF)
          investment.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="annual-investment">Annual Investment (₹)</Label>
              <Input
                id="annual-investment"
                type="number"
                min={500}
                max={150000}
                step={500}
                value={annualInvestment}
                onChange={(e) => setAnnualInvestment(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label>Duration (Years)</Label>
              <Slider
                min={1}
                max={15}
                step={1}
                value={[duration]}
                onValueChange={(value) => setDuration(value[0])}
              />
              <div className="text-sm font-medium">{duration} years</div>
            </div>

            <div className="space-y-2">
              <Label>Interest Rate (% p.a.)</Label>
              <Slider
                min={6}
                max={9}
                step={0.1}
                value={[interestRate]}
                onValueChange={(value) => setInterestRate(value[0])}
              />
              <div className="text-sm font-medium">{interestRate}%</div>
            </div>
          </div>
        </div>

        {ppfResult && (
          <div className="mt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="stat-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Investment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-finance-blue">
                    {formatCurrency(ppfResult.totalInvestment)}
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
                  <div className="text-2xl font-bold text-finance-teal">
                    {formatCurrency(ppfResult.maturityAmount)}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="h-72 overflow-x-auto">
              <div className="min-w-[700px]">
                <ResponsiveContainer width="100%" height={288}>
                  <AreaChart data={ppfResult.yearlyData}>
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
                      dataKey="balance"
                      name="Balance"
                      stroke="#1e40af"
                      fill="#1e40af40"
                    />
                    <Area
                      type="monotone"
                      dataKey="interest"
                      name="Interest Earned"
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
            PPF investments earn tax-free interest and have a 15-year lock-in
            period.
          </p>
          <p>
            The above calculation assumes annual compounding and fixed yearly
            contribution.
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PPFCalculator;
