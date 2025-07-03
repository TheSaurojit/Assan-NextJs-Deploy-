"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, TooltipProps } from 'recharts';
import { useToast } from "@/hooks/use-toast";
import { ChartContainer, ChartTooltip } from "../ui/chart";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Info } from "lucide-react";
import { useState } from "react";

interface RetirementChartProps {
  years: number[];
  investmentData: number[];
  growthData: number[];
}

const RetirementChart = ({ years, investmentData, growthData }: RetirementChartProps) => {
  const { toast } = useToast();
  const [selectedDataPoint, setSelectedDataPoint] = useState<{
    year: number;
    total: number;
    investment: number;
    growth: number;
  } | null>(null);
  
  // Format the data for Recharts
  const formattedData = years.map((year, index) => ({
    year: year,
    investment: investmentData[index],
    growth: growthData[index],
    total: investmentData[index] + growthData[index]
  }));

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

  const tooltipFormatter = (value: number) => {
    if (value >= 10000000) {
      return [`₹${(value / 10000000).toFixed(2)} Cr`, ""];
    } else if (value >= 100000) {
      return [`₹${(value / 100000).toFixed(2)} L`, ""];
    } else {
      return [`₹${value.toFixed(0)}`, ""];
    }
  };
  
  const handleChartClick = () => {
    const totalCorpus = formattedData[formattedData.length - 1].total;
    const formattedCorpus = tooltipFormatter(totalCorpus)[0];
    
    toast({
      title: "Projected Retirement Corpus",
      description: `Your estimated retirement corpus will be ${formattedCorpus} by ${formattedData[formattedData.length - 1].year}`,
      duration: 5000,
    });
  };

  // Find the year with maximum growth rate for reference
  const maxGrowthYear = formattedData.reduce((maxYear, current, index, array) => {
    if (index === 0) return maxYear;
    
    const prevGrowth = array[index - 1].growth || 0;
    const currentGrowth = current.growth || 0;
    const growthRate = prevGrowth > 0 ? (currentGrowth - prevGrowth) / prevGrowth : 0;
    
    const maxGrowth = array[maxYear].growth || 0;
    const prevMaxGrowth = maxYear > 0 ? array[maxYear - 1].growth || 0 : 0;
    const maxGrowthRate = prevMaxGrowth > 0 ? (maxGrowth - prevMaxGrowth) / prevMaxGrowth : 0;
    
    return growthRate > maxGrowthRate ? index : maxYear;
  }, 0);

  // Handle point click to show details
  const handlePointClick = (data: any) => {
    setSelectedDataPoint({
      year: data.year,
      total: data.total,
      investment: data.investment,
      growth: data.growth
    });
  };

  // Custom tooltip component with more details
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg">
          <h5 className="font-medium mb-1">Year {label}</h5>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
            <span className="text-muted-foreground">Total:</span>
            <span className="font-medium text-right">{tooltipFormatter(payload[2].value as number)[0]}</span>
            
            <span className="text-muted-foreground">Investment:</span>
            <span className="font-medium text-right">{tooltipFormatter(payload[0].value as number)[0]}</span>
            
            <span className="text-muted-foreground">Growth:</span>
            <span className="font-medium text-right">{tooltipFormatter(payload[1].value as number)[0]}</span>
            
            <span className="text-xs text-muted-foreground col-span-2 mt-1">(Click point for more details)</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative">
      <div className="absolute top-4 right-4 z-10 bg-white/80 dark:bg-slate-800/80 text-xs px-2 py-1 rounded shadow text-muted-foreground flex items-center gap-1">
        <Info size={12} className="opacity-70" />
        Click chart for corpus details
      </div>
      
      <div className="h-[400px]" onClick={handleChartClick}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={formattedData}
            margin={{
              top: 10,
              right: 30,
              left: 20,
              bottom: 0,
            }}
            onClick={(data) => data.activePayload && handlePointClick(data.activePayload[0].payload)}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="year" 
              label={{ 
                value: 'Years', 
                position: 'insideBottomRight', 
                offset: -10 
              }}
            />
            <YAxis 
              tickFormatter={formatYAxisValue}
              label={{ 
                value: 'Amount (₹)', 
                angle: -90, 
                position: 'insideLeft'
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <ReferenceLine 
              x={formattedData[maxGrowthYear]?.year} 
              stroke="#6366f1" 
              strokeDasharray="3 3"
              label={{ 
                value: 'Max Growth', 
                position: 'insideTopRight', 
                fill: '#6366f1',
                fontSize: 12
              }} 
            />
            <Area 
              type="monotone" 
              dataKey="investment" 
              name="Total Investment" 
              stackId="1"
              stroke="#0d9488" 
              fill="#0d948840" 
            />
            <Area 
              type="monotone" 
              dataKey="growth" 
              name="Projected Growth" 
              stackId="1"
              stroke="#1e40af" 
              fill="#1e40af40" 
            />
            <Area 
              type="monotone" 
              dataKey="total" 
              name="Total Corpus" 
              stroke="#6366f1"
              fill="none"
              activeDot={{ r: 6, onClick: handlePointClick }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Detail dialog */}
      {selectedDataPoint && (
        <AlertDialog open={!!selectedDataPoint} onOpenChange={(open: boolean) => {
          if (!open) setSelectedDataPoint(null);
        }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Year {selectedDataPoint.year} Details</AlertDialogTitle>
              <AlertDialogDescription>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="text-muted-foreground text-sm">Total Corpus</div>
                    <div className="text-2xl font-medium text-finance-blue">
                      {tooltipFormatter(selectedDataPoint.total)[0]}
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="text-muted-foreground text-sm">Years Invested</div>
                    <div className="text-2xl font-medium text-finance-blue">
                      {selectedDataPoint.year - formattedData[0].year}
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="text-muted-foreground text-sm">Total Investment</div>
                    <div className="text-2xl font-medium text-finance-teal">
                      {tooltipFormatter(selectedDataPoint.investment)[0]}
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="text-muted-foreground text-sm">Total Growth</div>
                    <div className="text-2xl font-medium text-primary">
                      {tooltipFormatter(selectedDataPoint.growth)[0]}
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-3 rounded-lg col-span-2">
                    <div className="text-muted-foreground text-sm">Growth Percentage</div>
                    <div className="text-2xl font-medium text-primary">
                      {selectedDataPoint.investment > 0 
                        ? `${((selectedDataPoint.growth / selectedDataPoint.investment) * 100).toFixed(1)}%` 
                        : '0%'}
                    </div>
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction>Close</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default RetirementChart;
