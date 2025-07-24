"use client";

import { FirestoreService } from "@/backend/firebase/firestoreService";
import { ArticleView } from "@/backend/types/types";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<ArticleView[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticles() {
      const list = (await FirestoreService.getAll("Articles")) as ArticleView[];
      const sortedList = list.sort(
        (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()
      );
      setArticles(sortedList);
      setLoading(false);
    }
    fetchArticles();
  }, []);

  const handleDelete = async () => {
    if (selectedId) {
      await FirestoreService.deleteDoc("Articles", selectedId);
      setArticles((prev) => prev.filter((a) => a.id !== selectedId));
      setShowDeleteModal(false);
      setSelectedId(null);
      toast.success("Deleted successfully!");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Articles</h1>

      {loading ? (
        <p>Loading...</p>
      ) : articles.length === 0 ? (
        <p>No articles found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded text-sm sm:text-base">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="py-2 px-4">Title</th>
                <th className="py-2 px-4">Thumbnail</th>
                <th className="py-2 px-4">Published At</th>
                <th className="py-2 px-4">Edit</th>
                <th className="py-2 px-4">Delete</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr
                  key={article.id}
                  className="border-t hover:bg-gray-50 text-xs sm:text-sm"
                >
                  <td className="py-2 px-4 break-words">{article.title}</td>
                  <td className="py-2 px-4">
                    <img
                      src={article.thumbnail}
                      style={{ maxHeight: "150px", maxWidth: "150px" }}
                      alt="Thumbnail"
                      className="max-h-32 w-auto rounded"
                    />
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap">
                    {article.createdAt.toDate().toDateString()}
                  </td>
                  <td className="py-2 px-4 text-center">
                    <Link
                      href={`/admin/article/${article.id}`}
                      className="text-blue-600 hover:underline flex items-center justify-center"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                  </td>
                  <td className="py-2 px-4 text-center">
                    <button
                      onClick={() => {
                        setSelectedId(article.id);
                        setShowDeleteModal(true);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        message="Do you really want to delete this article?"
      />
    </div>
  );
}
