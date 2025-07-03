
import RetirementCalculator from "@/components/calculators/RetirementCalculator";
import SipCalculator from "@/components/calculators/SipCalculator";
import HlvCalculator from "@/components/calculators/HlvCalculator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function Investments() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl">Investment Tools</h1>
        <p className="text-lg text-muted-foreground">
          Calculate and plan your investments with our financial tools.
        </p>
      </div>

      <Tabs defaultValue="retirement">
        <TabsList className="grid w-full max-w-xl grid-cols-3">
          <TabsTrigger value="retirement" className="relative">
            Retirement
            <div className="absolute -top-3 -right-1">
              <Badge className="text-xs h-5 bg-amber-500 hover:bg-amber-600">AI</Badge>
              <Badge className="text-xs h-5 ml-1 bg-blue-500 hover:bg-blue-600">New</Badge>
            </div>
          </TabsTrigger>
          <TabsTrigger value="sip">SIP</TabsTrigger>
          <TabsTrigger value="hlv">HLV</TabsTrigger>
        </TabsList>
        <TabsContent value="retirement">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Retirement Planning</CardTitle>
                  <CardDescription>
                    Calculate how much you need to save for a comfortable retirement.
                  </CardDescription>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant="outline" className="text-xs">India-Specific</Badge>
                  <span className="text-xs text-muted-foreground">AI-powered insights</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <RetirementCalculator />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="sip">
          <Card>
            <CardHeader>
              <CardTitle>Systematic Investment Plan</CardTitle>
              <CardDescription>
                Calculate returns on your regular investments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SipCalculator />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="hlv">
          <Card>
            <CardHeader>
              <CardTitle>Human Life Value</CardTitle>
              <CardDescription>
                Calculate your financial worth based on income potential and other factors.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HlvCalculator />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
