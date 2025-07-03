
import { useEffect, useState } from "react";
import NewsCard from "./NewsCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  source: string;
  imageUrl: string;
  url: string;
  category?: string;
}

interface NewsListProps {
  searchQuery?: string;
  category?: string;
}

const DUMMY_NEWS: NewsItem[] = [
  {
    id: "1",
    title: "RBI Maintains Repo Rate: What It Means for Your Retirement Savings",
    summary: "The Reserve Bank of India has maintained the repo rate at 6.5%. Learn how this affects your fixed deposits, debt funds, and other retirement investments in the current economic climate.",
    date: "2025-04-05",
    source: "Financial Express",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    url: "#",
    category: "retirement"
  },
  {
    id: "2",
    title: "New Tax Benefits for National Pension System (NPS) Contributors",
    summary: "The government has announced additional tax incentives for NPS contributors. Experts suggest this could make NPS a more attractive retirement savings option compared to PPF and EPF for certain taxpayers.",
    date: "2025-03-28",
    source: "Economic Times",
    imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    url: "#",
    category: "retirement"
  },
  {
    id: "3",
    title: "SEBI Introduces New Mutual Fund Categories for Retirement Planning",
    summary: "Securities and Exchange Board of India has introduced specialized retirement mutual fund categories with specific lock-in periods and tax advantages designed for long-term retirement planning.",
    date: "2025-03-15",
    source: "LiveMint",
    imageUrl: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    url: "#",
    category: "investing"
  },
  {
    id: "4",
    title: "How Increasing Life Expectancy is Changing Retirement Planning in India",
    summary: "With average life expectancy in India increasing to 70+ years, financial planners are advising a more robust corpus. This article explores strategies to ensure your savings last through extended retirement years.",
    date: "2025-03-10",
    source: "Forbes India",
    imageUrl: "https://images.unsplash.com/photo-1556742031-c6961e8560b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    url: "#",
    category: "retirement"
  },
  {
    id: "5",
    title: "Digital Gold vs Physical Gold: Which is Better for Retirement Portfolio?",
    summary: "As gold continues to be a favored asset for retirement portfolios in India, experts weigh in on the pros and cons of digital gold instruments compared to traditional physical gold investments.",
    date: "2025-02-25",
    source: "Business Standard",
    imageUrl: "https://images.unsplash.com/photo-1610375461369-d613b564f4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    url: "#",
    category: "investing"
  },
  {
    id: "6",
    title: "New Policy: Senior Citizen Savings Scheme Revised with Higher Interest Rates",
    summary: "The government has announced higher interest rates for the Senior Citizen Savings Scheme (SCSS), making it more attractive for retirees looking for secure fixed-income options.",
    date: "2025-02-12",
    source: "The Hindu",
    imageUrl: "https://images.unsplash.com/photo-1573497161079-f3fd25cc6b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    url: "#",
    category: "policy"
  }
];

const NewsList = ({ searchQuery = "", category }: NewsListProps) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    // Simulate loading news data
    const timer = setTimeout(() => {
      setNews(DUMMY_NEWS);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (news.length > 0) {
      let result = [...news];
      
      if (category && category !== "all") {
        result = result.filter(item => item.category === category);
      }
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(
          item => item.title.toLowerCase().includes(query) || 
                 item.summary.toLowerCase().includes(query)
        );
      }
      
      setFilteredNews(result);
    }
  }, [news, searchQuery, category]);

  // Render loading skeletons
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(3).fill(0).map((_, index) => (
          <div key={index} className="space-y-3">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
            <div className="flex justify-between items-center pt-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredNews.length === 0) {
    return (
      <Alert variant="default" className="bg-muted/50 border-muted">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No news articles found. Try adjusting your search or check back later for updates.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredNews.map((item) => (
        <NewsCard
          key={item.id}
          title={item.title}
          summary={item.summary}
          date={item.date}
          source={item.source}
          imageUrl={item.imageUrl}
          url={item.url}
        />
      ))}
    </div>
  );
};

export default NewsList;
