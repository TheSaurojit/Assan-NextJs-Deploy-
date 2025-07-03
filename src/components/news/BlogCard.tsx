"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileText, Video, Calendar, Clock, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { Timestamp } from "firebase/firestore";
import Link from "next/link";
import { ArticleView } from "@/backend/types/types";

// interface BlogPost {
//   id: string;
//   title: string;
//   excerpt: string;
//   author: string;
//   authorRole: string;
//   date: string;
//   readTime: string;
//   type: "article" | "video";
//   coverImage: string;
//   tags: string[];
// }

interface NewArticleProps extends ArticleView {
  type: "article" | "video";
}

const BlogCard = ({ blog }: { blog: NewArticleProps }) => {
  const formatDate = (date: Timestamp) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return date.toDate().toLocaleDateString("en-US", options);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
      <Link href={`/article/${blog.id}`}>
        <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow">
          <div className="relative h-48 overflow-hidden">
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              loading="lazy"
            />
            <div className="absolute top-3 left-3">
              <Badge
                className={
                  blog.type === "article" ? "bg-primary" : "bg-purple-600"
                }
              >
                {blog.type === "article" ? (
                  <FileText className="h-3 w-3 mr-1" />
                ) : (
                  <Video className="h-3 w-3 mr-1" />
                )}
                {blog.type === "article" ? "Article" : "Video"}
              </Badge>
            </div>
          </div>

          <CardContent className="pt-6 flex-grow">
            <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(blog.createdAt)}</span>
              {/* <span className="mx-1">•</span> */}
              {/* <Clock className="h-3 w-3" /> */}
              {/* <span>9 min</span> */}
            </div>

            <h3 className="text-xl font-semibold mb-2 line-clamp-2">
              {blog.title}
            </h3>

            <p className="text-muted-foreground mb-4 line-clamp-3">
              {blog.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {/* {blog.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))} */}
            </div>
          </CardContent>

          <CardFooter className="flex justify-between items-center pt-0 pb-4">
            <div className="flex items-center">
              {/* <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src="" />
              <AvatarFallback>{getInitials(blog.author)}</AvatarFallback>
            </Avatar> */}
              <div>
                {/* <p className="text-sm font-medium">{blog.author}</p> */}
                {/* <p className="text-xs text-muted-foreground">{blog.authorRole}</p> */}
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="text-xs font-medium text-primary p-0 h-auto"
            >
              Read More <ArrowUpRight className="ml-1 h-3 w-3" />
            </Button>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
};

export default BlogCard;
