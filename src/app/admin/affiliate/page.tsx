"use client";

import { useState, FormEvent, useRef, useEffect } from "react";
import { Edit, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FirestoreService } from "@/backend/firebase/firestoreService";
import { AffiliateType } from "@/backend/types/types";
import { Timestamp } from "firebase/firestore";
import { toast } from "react-toastify";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";

export default function page() {
  const [data, setData] = useState<AffiliateType[]>([]);

  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<AffiliateType>>({});

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const openModal = (data: Partial<AffiliateType> = { link: "" }) => {
    setFormData(data);
    setModalOpen(true);
  };

  const closeModal = () => {
    setFormData({ link: "" });
    setModalOpen(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (formData.id) {
        // Edit
      } else {
        // Create
        const newAffiliateType: Partial<AffiliateType> = {
          link: formData.link || "",
          thumbnail: thumbnail
            ? await FirestoreService.uploadFile(thumbnail, "affiliate")
            : "",
          createdAt: Timestamp.now(),
        };

        await FirestoreService.addDoc("Affiliate-Marketing", newAffiliateType);
        toast.success("Created successfully!");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      await getAllMarketing();
      closeModal();
    }
  };

  const handleDelete = async () => {
    if (selectedId) {
      await FirestoreService.deleteDoc("Affiliate-Marketing", selectedId);
      setData((prev) => prev.filter((a) => a.id !== selectedId));

      setShowDeleteModal(false);
      setSelectedId(null);
      toast.success("Deleted successfully!");
    }

  };

  const getAllMarketing = async () => {
    const data = (await FirestoreService.getAll(
      "Affiliate-Marketing"
    )) as AffiliateType[];
    setData(data);
  };

  useEffect(() => {
    getAllMarketing();
  }, []);

return (
  <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
    <div className="mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <h1 className="text-xl sm:text-2xl font-bold">Affiliate Marketing</h1>
        <Button onClick={() => openModal()} className="w-full sm:w-auto">
          Add Data
        </Button>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded shadow">
          <thead className="bg-gray-200 text-gray-600 text-sm sm:text-base">
            <tr>
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Link</th>
              <th className="py-2 px-4">Thumbnail</th>
              <th className="py-2 px-4">Edit</th>
              <th className="py-2 px-4">Delete</th>
            </tr>
          </thead>
          <tbody>
            {data.map((affiliate, idx) => (
              <tr key={idx} className="border-t text-xs sm:text-sm">
                <td className="py-2 px-4">{idx + 1}</td>
                <td className="py-2 px-4 break-all">{affiliate.link}</td>
                <td className="py-2 px-4">
                  <img
                    src={affiliate.thumbnail}
                    style={{ maxHeight: "150px", maxWidth: "150px" }}
                    alt="Thumbnail"
                    className="mt-2 rounded border"
                  />
                </td>
                <td className="py-2 px-4 text-center">
                  <button
                    onClick={() => openModal(affiliate)}
                    className="text-blue-600 hover:underline flex items-center justify-center"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </td>
                <td className="text-center">
                  <button
                    onClick={() => {
                      setSelectedId(affiliate.id);
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-40 z-50 p-4">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              {formData.id ? "Edit Affiliate" : "Add Affiliate"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Link */}
              <div>
                <label className="block mb-1 text-sm font-medium">Link</label>
                <input
                  type="url"
                  value={formData.link || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, link: e.target.value }))
                  }
                  className="w-full px-3 py-2 border rounded text-sm"
                  placeholder="https://example.com"
                  required
                />
              </div>

              {/* Thumbnail Upload */}
              <div className="mt-4">
                <label className="block font-semibold mb-1 text-sm">
                  Thumbnail Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  ref={thumbnailInputRef}
                  onChange={handleThumbnailChange}
                  className="hidden"
                  required={!formData.id}
                />
                <Button
                  type="button"
                  onClick={() => thumbnailInputRef.current?.click()}
                  className="px-4 py-2 w-full sm:w-auto"
                >
                  {thumbnail ? "Change Image" : "Upload Image"}
                </Button>
                {preview && (
                  <img
                    src={preview}
                    style={{ maxHeight: "150px" }}
                    alt="Thumbnail Preview"
                    className="mt-4 rounded-md border"
                  />
                )}
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
                <Button type="button" onClick={closeModal} className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button type="submit" className="w-full sm:w-auto">
                  {formData.id ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        message="Do you really want to delete this affiliate?"
      />
    </div>
  </div>
);

}
