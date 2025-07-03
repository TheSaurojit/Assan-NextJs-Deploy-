"use client";

import NewsList from "@/components/news/NewsList";
import BlogsList from "@/components/news/BlogsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, RefreshCw } from "lucide-react";

const News = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <main className="flex-1 py-10">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="space-y-2 mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Financial News & Insights
          </h1>
          <p className="text-muted-foreground">
            Stay updated with the latest financial news and retirement planning
            insights
          </p>
        </div>

        {/* Search and filter section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Input
              placeholder="Search news and articles..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" title="Filter content">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" title="Refresh content">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="all" className="space-y-8">
          <TabsList className="flex flex-wrap gap-2">
            <TabsTrigger value="all">All Content</TabsTrigger>
            <TabsTrigger value="retirement">Retirement</TabsTrigger>
            <TabsTrigger value="investing">Investing</TabsTrigger>
            <TabsTrigger value="policy">Policy Updates</TabsTrigger>
            <TabsTrigger value="blogs">Expert Blogs</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-10">
            <section>
              <h2 className="text-2xl font-semibold mb-6">Latest News</h2>
              <NewsList searchQuery={searchQuery} />
            </section>
          </TabsContent>

          <TabsContent value="retirement">
            <div className="space-y-10">
              <section>
                <h2 className="text-2xl font-semibold mb-6">Retirement News</h2>
                <NewsList category="retirement" searchQuery={searchQuery} />
              </section>
            </div>
          </TabsContent>

          <TabsContent value="investing">
            <div className="space-y-10">
              <section>
                <h2 className="text-2xl font-semibold mb-6">Investment News</h2>
                <NewsList category="investing" searchQuery={searchQuery} />
              </section>
            </div>
          </TabsContent>

          <TabsContent value="policy">
            <div className="space-y-10">
              <section>
                <h2 className="text-2xl font-semibold mb-6">Policy Updates</h2>
                <NewsList category="policy" searchQuery={searchQuery} />
              </section>
            </div>
          </TabsContent>

          <TabsContent value="blogs">
            <section>
              <BlogsList searchQuery={searchQuery} />
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default News;
