"use client";

import { FirestoreService } from "@/backend/firebase/firestoreService";
import { ArticleView } from "@/backend/types/types";
import { Edit } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";


export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<ArticleView[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      const list = (await FirestoreService.getAll("Articles")) as ArticleView[];

      setArticles(list);

      setLoading(false);
    }

    fetchArticles();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Articles</h1>

      {loading ? (
        <p>Loading...</p>
      ) : articles.length === 0 ? (
        <p>No articles found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="py-2 px-4">Title</th>
                <th className="py-2 px-4">Thumbnail</th>
                <th className="py-2 px-4">Published At</th>
                <th className="py-2 px-4">Edit</th>
                {/* <th className="py-2 px-4">Delete</th> */}
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-4">{article.title}</td>
                  <td>
                    <img
                      src={article.thumbnail}
                      alt=""
                      style={{ height: "200px", paddingTop: "20px" }}
                    />
                  </td>
                  <td className="py-2 px-4">
                    {article.createdAt.toDate().toDateString()}
                  </td>

                  <td>
                    <Link href={`/admin/article/${article.id}`}>
                      <Edit />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
