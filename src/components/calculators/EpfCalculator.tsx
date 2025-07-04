"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
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
  Legend
} from "recharts";

interface EPFResult {
  totalContribution: number;
  interestEarned: number;
  maturityAmount: number;
  yearlyData: Array<{
    year: number;
    balance: number;
    interest: number;
  }>;
}

const EPFCalculator = () => {
  const [basicSalary, setBasicSalary] = useState(25000);
  const [employeePercent, setEmployeePercent] = useState(12);
  const [employerPercent, setEmployerPercent] = useState(12);
  const [interestRate, setInterestRate] = useState(8.15);
  const [duration, setDuration] = useState(20);
  const [epfResult, setEpfResult] = useState<EPFResult | null>(null);

  useEffect(() => {
    calculateEPF();
  }, [basicSalary, employeePercent, employerPercent, interestRate, duration]);

  const calculateEPF = () => {
    let balance = 0;
    let yearlyData = [];
    let totalContribution = 0;
    const monthlyEmployee = (basicSalary * employeePercent) / 100;
    const monthlyEmployer = (basicSalary * employerPercent) / 100;
    const annualContribution = (monthlyEmployee + monthlyEmployer) * 12;
    const rate = interestRate / 100;

    for (let year = 1; year <= duration; year++) {
      balance += annualContribution;
      const interest = balance * rate;
      balance += interest;
      totalContribution += annualContribution;

      yearlyData.push({
        year,
        balance,
        interest,
      });
    }

    setEpfResult({
      totalContribution,
      interestEarned: balance - totalContribution,
      maturityAmount: balance,
      yearlyData
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
        <CardTitle className="text-2xl font-bold text-finance-teal">EPF Calculator</CardTitle>
        <CardDescription>
          Calculate your Employees' Provident Fund (EPF) corpus over time.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Basic Monthly Salary (₹)</Label>
              <Input
                type="number"
                value={basicSalary}
                onChange={(e) => setBasicSalary(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label>Employee Contribution (% of salary)</Label>
              <Slider
                min={0}
                max={20}
                step={1}
                value={[employeePercent]}
                onValueChange={(value) => setEmployeePercent(value[0])}
              />
              <div>{employeePercent}%</div>
            </div>

            <div className="space-y-2">
              <Label>Employer Contribution (% of salary)</Label>
              <Slider
                min={0}
                max={20}
                step={1}
                value={[employerPercent]}
                onValueChange={(value) => setEmployerPercent(value[0])}
              />
              <div>{employerPercent}%</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Interest Rate (% p.a.)</Label>
              <Slider
                min={6}
                max={10}
                step={0.1}
                value={[interestRate]}
                onValueChange={(value) => setInterestRate(value[0])}
              />
              <div>{interestRate}%</div>
            </div>

            <div className="space-y-2">
              <Label>Duration (Years)</Label>
              <Slider
                min={1}
                max={35}
                step={1}
                value={[duration]}
                onValueChange={(value) => setDuration(value[0])}
              />
              <div>{duration} years</div>
            </div>

          </div>
        </div>

        {epfResult && (
          <div className="mt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="stat-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Contribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-finance-blue">
                    {formatCurrency(epfResult.totalContribution)}
                  </div>
                </CardContent>
              </Card>

              <Card className="stat-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Interest Earned</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-finance-teal">
                    {formatCurrency(epfResult.interestEarned)}
                  </div>
                </CardContent>
              </Card>

              <Card className="stat-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Maturity Amount</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-finance-gold">
                    {formatCurrency(epfResult.maturityAmount)}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="h-72 overflow-x-auto">
              <div className="min-w-[700px]">
                <ResponsiveContainer width="100%" height={288}>
                  <AreaChart data={epfResult.yearlyData} margin={{ top: 10, right: 30, left: 50, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottomRight', offset: -10 }} />
                    <YAxis
                      tickFormatter={(value) => formatCurrency(value)}
                      label={{
                        value: "Amount (₹)",
                        angle: -90,
                        position: "insideLeft",
                        dx: -10,
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
          <p>EPF contributions grow with compound interest and include both employee and employer contributions.</p>
          <p>This calculator assumes constant salary and fixed annual compounding.</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EPFCalculator;
