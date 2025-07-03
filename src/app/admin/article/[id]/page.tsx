"use client";

import { FirestoreService } from "@/backend/firebase/firestoreService";
import {  ArticleCreate, ArticleUpdate, ArticleView } from "@/backend/types/types";
import CKEditorComponent from "@/components/editor/CKEditor";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

export default function EditorPage() {
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [article, setArticle] = useState<ArticleCreate | null>(null);
  const [fetchingArticle, setFetchingArticle] = useState(true);

  const params = useParams();
  const id = params?.id as string | undefined;

  const router = useRouter()

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleEditorChange = (data: string): void => {
    setContent(data);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }
   
    if (!content || content.trim() === "<p></p>") {
      toast.error("Content cannot be empty");
      return;
    }

    setIsLoading(true);

    try {
      const data: ArticleUpdate = {
        title : title,
        description : description,
        thumbnail: thumbnail ? await FirestoreService.uploadFile(thumbnail, "image") : article?.thumbnail!,
        video: videoFile ? await FirestoreService.uploadFile(videoFile, "video") : article?.video!,
        content : content,
      };


      await FirestoreService.updateDoc("Articles", id! , data);
      toast.success("Updated successfully!");

      router.push('/admin/articles')
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!id) {
      setFetchingArticle(false);
      return;
    }

    const fetchArticle = async () => {
      try {
        const data = await FirestoreService.getDoc("Articles", id);
        if (data) {
          setArticle(data as ArticleView);
          setTitle(data.title);
          setDescription(data.description);
          setContent(data.content);
          setPreview(data.thumbnail);
          if (data.video) setVideoPreview(data.video);
        } else {
          setArticle(null);
        }
      } catch (error) {
        console.error("Error fetching article", error);
        setArticle(null);
      } finally {
        setFetchingArticle(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (fetchingArticle) {
    return <p className="text-center mt-10">Loading article...</p>;
  }

  if (!id) {
    return <p className="text-center text-red-500 mt-10">Invalid article ID</p>;
  }

  if (!article) {
    return <p className="text-center text-red-500 mt-10">Article not found</p>;
  }

  return (
    <div className="relative container mx-auto p-4 max-w-4xl space-y-6">
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mt-8 mb-8">
          <label htmlFor="title" className="block font-semibold mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            placeholder="Enter the title"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="mt-8 mb-8">
          <label htmlFor="description" className="block font-semibold mb-1">
            Description
          </label>
          <textarea
            id="description"
            placeholder="Enter a short description"
            rows={3}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Thumbnail Upload */}
        <div className="mt-8 mb-8">
          <label className="block font-semibold mb-1">Thumbnail Image</label>
          <input
            type="file"
            accept="image/*"
            ref={thumbnailInputRef}
            onChange={handleThumbnailChange}
            className="hidden"
          />
          <Button
            type="button"
            onClick={() => thumbnailInputRef.current?.click()}
            className="px-4 py-2"
          >
            {thumbnail ? "Change Image" : "Upload Image"}
          </Button>
          {preview && (
            <img
              src={preview}
              style={{ maxHeight: "300px" }}
              alt="Thumbnail Preview"
              className="mt-4 rounded-md border"
            />
          )}
        </div>

        {/* Video Upload */}
        <div className="mt-8 mb-8">
          <label className="block font-semibold mb-1">Upload Video</label>
          <input
            type="file"
            accept="video/*"
            ref={videoInputRef}
            onChange={handleVideoChange}
            className="hidden"
          />
          <Button
            type="button"
            onClick={() => videoInputRef.current?.click()}
            className="px-4 py-2"
          >
            {videoFile ? "Change Video" : "Upload Video"}
          </Button>
          {videoPreview && (
            <video
              controls
              src={videoPreview}
              style={{ maxHeight: "300px" }}
              className="mt-4 rounded-md border"
            />
          )}
        </div>

        {/* CKEditor */}
        <div className="mt-8 mb-8">
          <label className="block font-semibold mb-1">Content</label>
          <CKEditorComponent
            onChange={handleEditorChange}
            data={content}
            placeholder="Enter your content here..."
          />
        </div>

        {/* Submit */}
        <div className="mt-8 mb-8 flex justify-center">
          <Button
            type="submit"
            className={`px-4 py-2 rounded-md ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
}
