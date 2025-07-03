
"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface NewsCardProps {
  title: string;
  summary: string;
  date: string;
  source: string;
  imageUrl: string;
  url: string;
}

const NewsCard = ({ title, summary, date, source, imageUrl, url }: NewsCardProps) => {
  // Format the date to be more readable
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden h-full flex flex-col transition-all duration-200 hover:shadow-md border-opacity-40 hover:border-opacity-100 dark:border-opacity-30">
        <div className="relative h-48 w-full overflow-hidden bg-muted">
          <img 
            src={imageUrl} 
            alt={title} 
            className="h-full w-full object-cover transition-all duration-300 hover:scale-105"
            loading="lazy"
          />
          <Badge className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm text-xs">
            {source}
          </Badge>
        </div>
        <CardHeader className="space-y-1 pb-2">
          <h3 className="text-lg font-bold leading-tight line-clamp-2 group">
            {title}
          </h3>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {summary}
          </p>
        </CardContent>
        <CardFooter className="flex items-center justify-between pt-0 mt-auto">
          <div className="flex items-center text-xs text-muted-foreground">
            <CalendarIcon className="mr-1 h-3 w-3" />
            <time dateTime={date}>{formatDate(date)}</time>
          </div>
          <Button variant="ghost" size="sm" className="p-0 h-auto" asChild>
            <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center text-xs font-medium text-primary">
              Read more <ArrowUpRight className="ml-1 h-3 w-3" />
            </a>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default NewsCard;
