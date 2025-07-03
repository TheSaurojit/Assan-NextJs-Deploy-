// "use client";

// import { FirestoreService } from "@/backend/firebase/firestoreService";
// import { ArticleView } from "@/backend/types/types";
// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";

// export default function ArticleViewPage() {
//   const { id } = useParams<{ id: string }>();
//   const [article, setArticle] = useState<ArticleView | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!id) return;

//     const fetchArticle = async () => {
//       try {
//         const data = await FirestoreService.getDoc("Articles", id);
//         setArticle(data as ArticleView);
//       } catch (error) {
//         console.error("Failed to fetch article:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchArticle();
//   }, [id]);

//   if (loading) return <p>Loading...</p>;
//   if (!article) return <p>Article not found</p>;

//   return (
//     <div className="max-w-3xl mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">{article.title} </h1>
//       <img
//         src={article.thumbnail}
//         alt="Thumbnail"
//         className="w-full rounded-lg mb-6"
//         style={{ maxHeight: "500px", objectFit: "cover" }}
//       />
//       <p className="text-lg mb-4">{article.description}</p>

//       {article.video && (
//         <video
//           src={article.video}
//           className="w-full rounded-lg mb-6"
//           style={{ maxHeight: "500px", objectFit: "cover" }}
//           controls
//         />
//       )}

//       <div
//         className="prose max-w-none"
//         dangerouslySetInnerHTML={{ __html: article.content }}
//       />
//     </div>
//   );
// }

import { adminDb } from "@/backend/firebase/firebase-admin";
import { ArticleView } from "@/backend/types/types";
import { notFound } from "next/navigation";

interface Props {
  params: { id: string };
}

export async function fetchArticle(id: string): Promise<ArticleView | null> {
  try {
    const docSnap = await adminDb.collection("Articles").doc(id).get();

    if (!docSnap.exists) return null;

    return docSnap.data() as ArticleView;
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
}

export async function generateMetadata({ params }: Props) {
  const id = params.id;

  const article = await fetchArticle(id);

  if (!article) return { title: "Article Not Found" };

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      images: article.thumbnail ? [{ url: article.thumbnail }] : [],
    },
  };
}

export default async function ArticleViewPage({ params }: Props) {
  const id = params.id;

  const article = await fetchArticle(id);

  if (!article) return notFound();

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{article.title}</h1>

      {article.thumbnail && (
        <img
          src={article.thumbnail}
          alt="Thumbnail"
          className="w-full rounded-lg mb-6"
          style={{ maxHeight: "500px", objectFit: "cover" }}
        />
      )}

      <p className="text-lg mb-4">{article.description}</p>

      {article.video && (
        <video
          src={article.video}
          className="w-full rounded-lg mb-6"
          style={{ maxHeight: "500px", objectFit: "cover" }}
          controls
        />
      )}
      
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </div>
  );
}
