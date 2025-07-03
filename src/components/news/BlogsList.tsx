import { useState, useEffect } from "react";
import BlogCard from "./BlogCard";
import { Button } from "@/components/ui/button";
import { FileText, Video, Plus, Filter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { FirestoreService } from "@/backend/firebase/firestoreService";
import { ArticleView } from "@/backend/types/types";
import Link from "next/link";

interface NewArticleProps extends ArticleView {
  type: "article" | "video";
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  type: "article" | "video";
  coverImage: string;
  tags: string[];
}

interface BlogsListProps {
  searchQuery?: string;
}

const DUMMY_BLOGS: BlogPost[] = [
  {
    id: "1",
    title: "Understanding PPF and EPF: Which is Better for Your Retirement?",
    excerpt:
      "A comprehensive comparison between PPF and EPF investment options for long-term retirement planning.",
    author: "Rajesh Kumar",
    authorRole: "Financial Advisor",
    date: "2025-04-02",
    readTime: "8 min read",
    type: "article",
    coverImage:
      "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    tags: ["retirement", "investments", "tax planning"],
  },
  {
    id: "2",
    title: "Video Guide: How to Calculate Your Retirement Corpus",
    excerpt:
      "Step-by-step video tutorial on using retirement calculators effectively for your financial planning.",
    author: "Priya Sharma",
    authorRole: "Certified Financial Planner",
    date: "2025-03-28",
    readTime: "15 min watch",
    type: "video",
    coverImage:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    tags: ["retirement calculator", "financial planning", "video guide"],
  },
  {
    id: "3",
    title: "The Power of Compound Interest: Start Investing Early",
    excerpt:
      "Understanding how time is your greatest ally when it comes to building wealth through investments.",
    author: "Vikram Desai",
    authorRole: "Investment Strategist",
    date: "2025-03-20",
    readTime: "6 min read",
    type: "article",
    coverImage:
      "https://images.unsplash.com/photo-1559526324-593bc073d938?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    tags: ["compound interest", "wealth building", "investments"],
  },
  {
    id: "4",
    title: "Video Tutorial: SIP vs Lumpsum Investment Strategy",
    excerpt:
      "Which investment approach is better for you? This video breaks down the pros and cons of each method.",
    author: "Meena Iyer",
    authorRole: "Portfolio Manager",
    date: "2025-03-15",
    readTime: "12 min watch",
    type: "video",
    coverImage:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    tags: ["SIP", "lumpsum", "investment strategy", "video guide"],
  },
];

const BlogsList = ({ searchQuery = "" }: BlogsListProps) => {
  const [blogs, setBlogs] = useState<NewArticleProps[]>([]);

  const [filteredBlogs, setFilteredBlogs] = useState<NewArticleProps[]>([]);

  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      setFilteredBlogs(
        blogs.filter(
          (blog) =>
            blog.title.toLowerCase().includes(query) ||
            blog.description.toLowerCase().includes(query)
          // blog.tags.some(tag => tag.toLowerCase().includes(query))
        )
      );
    } else {
      setFilteredBlogs(blogs);
    }
  }, [blogs, searchQuery]);

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();

  //   const newBlog: BlogPost = {
  //     id: `${blogs.length + 1}`,
  //     title,
  //     excerpt: content.substring(0, 120) + "...",
  //     author: authorName || "Anonymous",
  //     authorRole: authorRole || "Finance Enthusiast",
  //     date: new Date().toISOString().split("T")[0],
  //     readTime: blogType === "article" ? "5 min read" : "10 min watch",
  //     type: blogType,
  //     coverImage: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  //     tags: ["finance", "investments"]
  //   };

  //   setBlogs([newBlog, ...blogs]);
  //   setOpen(false);

  //   // Reset form
  //   setTitle("");
  //   setContent("");
  //   setBlogType("article");
  //   setVideoUrl("");
  //   setAuthorName("");
  //   setAuthorRole("");

  //   toast({
  //     title: "Blog published!",
  //     description: "Your content has been successfully published.",
  //   });
  // };

  const fetchBlogs = async () => {
    const data = await FirestoreService.getAll("Articles");

    const articles = data as ArticleView[];

    const filteredArticles: NewArticleProps[] = articles.map((article) => ({
      ...article,
      type: article.video == null ? "article" : "video",
    }));

    setBlogs(filteredArticles);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-2xl font-bold mb-4 sm:mb-0">
          Expert Blogs & Video Modules
        </h2>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" /> Filter
          </Button>

          <Link href="/create-article">
          <Button>
            <Plus className="h-4 w-4 mr-2" /> Contribute
          </Button>
          </Link>
        </div>
      </div>

      {filteredBlogs.length === 0 ? (
        <Alert variant="default" className="bg-muted/50 border-muted">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No articles or videos found. Try adjusting your search or be the
            first to contribute!
          </AlertDescription>
        </Alert>
      ) : (
        <Tabs defaultValue="all" className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {filteredBlogs.map((blog, index) => (
                <BlogCard key={index} blog={blog} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="articles">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {filteredBlogs
                .filter((blog) => blog.type === "article")
                .map((blog, index) => (
                  <BlogCard key={index} blog={blog} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="videos">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {filteredBlogs
                .filter((blog) => blog.type === "video")
                .map((blog, index) => (
                  <BlogCard key={index} blog={blog} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default BlogsList;
