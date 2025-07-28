"use client";

import { useState } from "react";
import { useProductStore } from "../../store/productStore";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CATEGORIES } from "../../libs/constants";

interface FormData {
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
}

const AddProduct: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const addProduct = useProductStore((state) => state.addProduct);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validExtensions = [".jpeg", ".jpg", ".img", ".png"];
      const extension = selectedFile.name
        .slice(selectedFile.name.lastIndexOf("."))
        .toLowerCase();
      if (!validExtensions.includes(extension)) {
        toast.error("Please select a JPEG, JPG, IMG, or PNG file.");
        setFile(null);
        setFormData({ ...formData, image: "" });
        return;
      }
      setFile(selectedFile);
      setFormData({ ...formData, image: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(formData.price);
    if (isNaN(price) || price < 0) {
      toast.error("Please enter a valid price.");
      return;
    }
    if (!file) {
      toast.error("Please select an image file.");
      return;
    }

    setIsCreating(true);
    let imagePath = "";
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("image", file);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataToSend,
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }
      imagePath = result.imagePath;
      console.log("Uploaded image path in AddProduct:", imagePath);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image.");
      setIsCreating(false);
      return;
    }
    try {
      await addProduct({
        name: formData.name,
        description: formData.description,
        price,
        category: formData.category,
        image: imagePath,
      });
      toast.success("Product added successfully!");
      router.push("/");
    } catch (error) {
      console.error("Failed to add product:", error);
      toast.error("Failed to add product.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Add New Product</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="border p-2 rounded"
          required
          disabled={isCreating}
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="border p-2 rounded"
          required
          disabled={isCreating}
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          className="border p-2 rounded"
          min="0"
          step="0.01"
          required
          disabled={isCreating}
        />
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="border p-2 rounded"
          required
          disabled={isCreating}
        >
          <option value="">Select Category</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700"
          >
            Image (JPEG, JPG, IMG, PNG) (required)
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept=".jpeg,.jpg,.img,.png"
            onChange={handleFileChange}
            className="border p-2 rounded w-full mt-1"
            required
            disabled={isCreating}
          />
          {file && (
            <p className="mt-1 text-sm text-gray-600">Selected: {file.name}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isCreating}
          className={`px-4 py-2 rounded text-white ${
            isCreating
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isCreating ? "Creating product..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
