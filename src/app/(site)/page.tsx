

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import FeatureSections from "@/components/ui/FeatureSections";
import { ArrowRight, Calculator, BarChart3, PieChart, LayoutDashboard, BookOpen } from "lucide-react";
import Link from "next/link";

const Index = () => {
  return (
    <>
      
      <main className="flex-1 bg-white text-black">
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-4 bg-gradient-to-br from-finance-blue/10 via-finance-lightBlue/5 to-finance-teal/10">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-finance-blue">
                  Plan Your Dream Retirement Today
                </h1>
                <p className="text-xl text-muted-foreground max-w-md">
                  Our smart tools help you calculate exactly what you need for a comfortable retirement in India. Start your journey to financial freedom now.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Button size="lg" asChild>
                    <Link href="/#retirement-calculator">
                      Start Planning
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/news" className="text-white">
                      Read Financial News
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Happy retired couple" 
                  className="w-full h-auto rounded-lg shadow-lg object-cover"
                />
                <div className="absolute -bottom-6 -right-6 text-white bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg">
                  <div className="text-sm font-medium">Retire with confidence</div>
                  <div className="text-2xl font-bold text-finance-teal">7.2Cr</div>
                  <div className="text-xs text-muted-foreground">Avg. corpus needed</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-finance-blue mb-4">Smart Retirement Planning Tools</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our comprehensive suite of calculators and tools to help you plan every aspect of your retirement journey.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="calculator-card group hover:border-primary/50">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Calculator className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Retirement Calculator</h3>
                  <p className="text-muted-foreground mb-4">
                    Calculate how much you need to save for a comfortable retirement based on your current lifestyle.
                  </p>
                  <Button variant="link" asChild className="mt-auto">
                    <Link href="/#retirement-calculator" className="flex items-center">
                      Try it now <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="calculator-card group hover:border-primary/50">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">SIP Calculator</h3>
                  <p className="text-muted-foreground mb-4">
                    Plan your systematic investments and visualize growth over time with our easy-to-use SIP calculator.
                  </p>
                  <Button variant="link" asChild className="mt-auto">
                    <Link href="/#sip-calculator" className="flex items-center">
                      Try it now <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="calculator-card group hover:border-primary/50">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <PieChart className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Asset Allocation</h3>
                  <p className="text-muted-foreground mb-4">
                    Get personalized recommendations for optimizing your investment portfolio for retirement.
                  </p>
                  <Button variant="link" asChild className="mt-auto">
                    <Link href="/investments" className="flex items-center">
                      Coming soon <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

      <FeatureSections />
      

        {/* CTA Section */}
        <section className="py-16 px-4 bg-finance-blue text-white">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">Start Your Retirement Journey Today</h2>
                <p className="text-lg opacity-90">
                  Create a free account to save your calculations, track your progress, and get personalized retirement planning advice.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Button size="lg" variant="secondary">
                    Create Free Account
                  </Button>
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                    Learn More
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 p-6 rounded-lg">
                  <div className="text-4xl font-bold mb-2">7.2X</div>
                  <div className="text-sm opacity-90">Average growth of retirement corpus with proper planning</div>
                </div>
                <div className="bg-white/10 p-6 rounded-lg">
                  <div className="text-4xl font-bold mb-2">63%</div>
                  <div className="text-sm opacity-90">Indians worry about outliving their retirement savings</div>
                </div>
                <div className="bg-white/10 p-6 rounded-lg">
                  <div className="text-4xl font-bold mb-2">15+</div>
                  <div className="text-sm opacity-90">Years of financial planning expertise</div>
                </div>
                <div className="bg-white/10 p-6 rounded-lg">
                  <div className="text-4xl font-bold mb-2">10K+</div>
                  <div className="text-sm opacity-90">Indians successfully planning retirement with our tools</div>
                </div>
              </div>
            </div>
          </div>
        </section>


      </main>
    </>
  );
};

export default Index;
