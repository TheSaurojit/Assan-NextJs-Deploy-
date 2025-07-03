"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
// import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";

// Define the form schema
const formSchema = z.object({
  age: z.coerce.number().min(18).max(80, {
    message: "Age must be between 18 and 80",
  }),
  annualIncome: z.coerce.number().min(0, {
    message: "Annual income must be a positive number",
  }),
  workingYearsLeft: z.coerce.number().min(0).max(60, {
    message: "Working years left must be between 0 and 60",
  }),
  expenses: z.coerce.number().min(0, {
    message: "Expenses must be a positive number",
  }),
  savings: z.coerce.number().min(0, {
    message: "Savings must be a positive number",
  }),
  liabilities: z.coerce.number().min(0, {
    message: "Liabilities must be a positive number",
  }),
});

type FormValues = z.infer<typeof formSchema>;

// export default function HlvCalculator() {
//   const [showResults, setShowResults] = useState(false);
//   const [hlvValue, setHlvValue] = useState(0);
//   const [scores, setScores] = useState<{
//     ageScore: number;
//     incomeScore: number;
//     workingYearsScore: number;
//     savingsScore: number;
//     liabilitiesScore: number;
//     overallScore: number;
//   }>({
//     ageScore: 0,
//     incomeScore: 0,
//     workingYearsScore: 0,
//     savingsScore: 0,
//     liabilitiesScore: 0,
//     overallScore: 0,
//   });

//   const form = useForm<FormValues>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       age: 35,
//       annualIncome: 500000,
//       workingYearsLeft: 25,
//       expenses: 300000,
//       savings: 100000,
//       liabilities: 200000,
//     },
//   });

//   const onSubmit = (data: FormValues) => {
//     // Calculate HLV
//     const {
//       age, 
//       annualIncome, 
//       workingYearsLeft,
//       expenses,
//       savings,
//       liabilities
//     } = data;

//     // Calculate HLV using income replacement method
//     // HLV = Annual Income x Working Years Left - Expenses + Savings - Liabilities
//     const hlv = (annualIncome * workingYearsLeft) - expenses + savings - liabilities;
//     setHlvValue(hlv);

//     // Calculate scores for each parameter (scale 300-900 like CIBIL)
//     // Age score (younger is better)
//     const ageScore = Math.max(300, Math.min(900, 900 - ((age - 18) * 10)));
    
//     // Income score (higher is better)
//     const incomeScore = Math.max(300, Math.min(900, 300 + (annualIncome / 20000)));
    
//     // Working years left score (more years is better)
//     const workingYearsScore = Math.max(300, Math.min(900, 300 + (workingYearsLeft * 15)));
    
//     // Savings score (higher is better)
//     const savingsScore = Math.max(300, Math.min(900, 300 + (savings / 10000)));
    
//     // Liabilities score (lower is better)
//     const liabilitiesScore = Math.max(300, Math.min(900, 900 - (liabilities / 10000)));
    
//     // Overall score (average of all parameters)
//     const overallScore = Math.round(
//       (ageScore + incomeScore + workingYearsScore + savingsScore + liabilitiesScore) / 5
//     );

//     setScores({
//       ageScore: Math.round(ageScore),
//       incomeScore: Math.round(incomeScore),
//       workingYearsScore: Math.round(workingYearsScore),
//       savingsScore: Math.round(savingsScore),
//       liabilitiesScore: Math.round(liabilitiesScore),
//       overallScore: Math.round(overallScore),
//     });

//     setShowResults(true);
//     toast({
//       title: "HLV Calculation Complete",
//       description: `Your Human Life Value is ₹${hlv.toLocaleString()}`,
//     });
//   };

//   const getScoreColor = (score: number) => {
//     if (score >= 750) return "text-green-600";
//     if (score >= 650) return "text-yellow-600";
//     if (score >= 500) return "text-orange-500";
//     return "text-red-600";
//   };

//   const getScoreDescription = (score: number) => {
//     if (score >= 750) return "Excellent";
//     if (score >= 650) return "Good";
//     if (score >= 500) return "Fair";
//     return "Poor";
//   };

//   return (
//     <div className="space-y-6">
//       <Card className="calculator-card">
//         <CardHeader>
//           <CardTitle>Human Life Value Calculator</CardTitle>
//           <CardDescription>
//             Calculate your financial worth based on your income, expenses, and other factors
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Form {@.form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <FormField
//                   control={form.control}
//                   name="age"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Age</FormLabel>
//                       <FormControl>
//                         <Input type="number" placeholder="35" {@.field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="annualIncome"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Annual Income (₹)</FormLabel>
//                       <FormControl>
//                         <Input type="number" placeholder="500000" {@.field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="workingYearsLeft"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Working Years Left</FormLabel>
//                       <FormControl>
//                         <Input type="number" placeholder="25" {@.field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="expenses"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Annual Expenses (₹)</FormLabel>
//                       <FormControl>
//                         <Input type="number" placeholder="300000" {@.field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="savings"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Total Savings (₹)</FormLabel>
//                       <FormControl>
//                         <Input type="number" placeholder="100000" {@.field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="liabilities"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Total Liabilities (₹)</FormLabel>
//                       <FormControl>
//                         <Input type="number" placeholder="200000" {@.field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//               <Button type="submit" className="w-full">Calculate HLV</Button>
//             </form>
//           </Form>
//         </CardContent>
//       </Card>

//       <AlertDialog open={showResults} onOpenChange={setShowResults}>
//         <AlertDialogContent className="max-w-4xl">
//           <AlertDialogHeader>
//             <AlertDialogTitle>Your Human Life Value Results</AlertDialogTitle>
//             <AlertDialogDescription>
//               Based on your inputs, here is your calculated HLV and parameter scores.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
          
//           <div className="my-4">
//             <div className="bg-muted p-4 rounded-lg mb-4">
//               <h3 className="text-xl font-bold mb-2">Your Human Life Value</h3>
//               <p className="text-3xl font-bold text-primary">₹{hlvValue.toLocaleString()}</p>
//               <p className="text-sm text-muted-foreground mt-1">
//                 This represents your financial value based on future income potential and current financial status.
//               </p>
//             </div>

//             <h3 className="text-lg font-semibold mb-3">Your Financial Parameter Scores</h3>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               <div className="border rounded-lg p-3">
//                 <div className="text-sm text-muted-foreground">Age Score</div>
//                 <div className={`text-xl font-bold ${getScoreColor(scores.ageScore)}`}>
//                   {scores.ageScore} - {getScoreDescription(scores.ageScore)}
//                 </div>
//               </div>
              
//               <div className="border rounded-lg p-3">
//                 <div className="text-sm text-muted-foreground">Income Score</div>
//                 <div className={`text-xl font-bold ${getScoreColor(scores.incomeScore)}`}>
//                   {scores.incomeScore} - {getScoreDescription(scores.incomeScore)}
//                 </div>
//               </div>
              
//               <div className="border rounded-lg p-3">
//                 <div className="text-sm text-muted-foreground">Working Years Score</div>
//                 <div className={`text-xl font-bold ${getScoreColor(scores.workingYearsScore)}`}>
//                   {scores.workingYearsScore} - {getScoreDescription(scores.workingYearsScore)}
//                 </div>
//               </div>
              
//               <div className="border rounded-lg p-3">
//                 <div className="text-sm text-muted-foreground">Savings Score</div>
//                 <div className={`text-xl font-bold ${getScoreColor(scores.savingsScore)}`}>
//                   {scores.savingsScore} - {getScoreDescription(scores.savingsScore)}
//                 </div>
//               </div>
              
//               <div className="border rounded-lg p-3">
//                 <div className="text-sm text-muted-foreground">Liabilities Score</div>
//                 <div className={`text-xl font-bold ${getScoreColor(scores.liabilitiesScore)}`}>
//                   {scores.liabilitiesScore} - {getScoreDescription(scores.liabilitiesScore)}
//                 </div>
//               </div>
              
//               <div className="border rounded-lg bg-muted/30 p-3">
//                 <div className="text-sm text-muted-foreground">OVERALL SCORE</div>
//                 <div className={`text-2xl font-bold ${getScoreColor(scores.overallScore)}`}>
//                   {scores.overallScore} - {getScoreDescription(scores.overallScore)}
//                 </div>
//               </div>
//             </div>
            
//             <div className="mt-4 bg-muted/30 p-4 rounded-lg">
//               <h4 className="text-sm font-semibold mb-2">What do these scores mean?</h4>
//               <ul className="text-sm space-y-1">
//                 <li><span className="font-medium text-green-600">750-900:</span> Excellent financial position</li>
//                 <li><span className="font-medium text-yellow-600">650-749:</span> Good financial health</li>
//                 <li><span className="font-medium text-orange-500">500-649:</span> Fair financial status, room for improvement</li>
//                 <li><span className="font-medium text-red-600">300-499:</span> Poor financial health, need significant improvements</li>
//               </ul>
//             </div>
//           </div>

//           <AlertDialogFooter>
//             <AlertDialogAction>Close</AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }


export default function HlvCalculator() {
  return (
    <div>HlvCalculator</div>
  )
}
