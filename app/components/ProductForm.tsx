"use client";

import { useState } from "react";
import { useProductStore } from "../store/productStore";
import { Product } from "../types/product";
import { CATEGORIES } from "../libs/constants";
import { toast } from "react-toastify";

interface ProductFormProps {
  initialProduct?: Product;
  onSubmit: () => void;
}

export default function ProductForm({
  initialProduct,
  onSubmit,
}: ProductFormProps) {
  const { addProduct, updateProduct } = useProductStore();
  const [formData, setFormData] = useState({
    name: initialProduct?.name || "",
    description: initialProduct?.description || "",
    price: initialProduct?.price?.toString() || "",
    category: initialProduct?.category || "",
    image: initialProduct?.image || "",
  });
  const [file, setFile] = useState<File | null>(null);

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
      setFormData({ ...formData, image: "" }); // Image path set after upload
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(formData.price);
    if (isNaN(price) || price < 0) {
      toast.error("Please enter a valid price.");
      return;
    }
    if (!file && !initialProduct?.image) {
      toast.error("Please select an image file.");
      return;
    }
    let imagePath = initialProduct?.image || "";
    if (file) {
      const formDataToSend = new FormData();
      formDataToSend.append("image", file);
      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formDataToSend,
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || "Upload failed");
        }
        imagePath = result.imagePath;
        console.log("Uploaded image path in ProductForm:", imagePath);
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Failed to upload image.");
        return;
      }
    }
    try {
      if (initialProduct) {
        console.log("Submitting update with image:", imagePath);
        updateProduct(initialProduct.id, {
          ...formData,
          price,
          image: imagePath,
        });
      } else {
        console.log("Submitting add with image:", imagePath);
        addProduct({ ...formData, price, image: imagePath });
      }
      toast.success(
        initialProduct
          ? "Product updated successfully!"
          : "Product added successfully!"
      );
      onSubmit();
    } catch (error) {
      console.error(
        `Failed to ${initialProduct ? "update" : "add"} product:`,
        error
      );
      toast.error(
        `Failed to ${
          initialProduct ? "update" : "add"
        } product. Please try again.`
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Product Name"
        className="border p-2 rounded w-full"
        required
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        className="border p-2 rounded w-full"
        required
      />
      <input
        type="number"
        name="price"
        value={formData.price}
        onChange={handleChange}
        placeholder="Price"
        className="border p-2 rounded w-full"
        min="0"
        step="0.01"
      />
      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        className="border p-2 rounded w-full"
        required
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
          Image (JPEG, JPG, IMG, PNG){" "}
          {initialProduct ? "(optional to replace)" : "(required)"}
        </label>
        <input
          type="file"
          id="image"
          name="image"
          accept=".jpeg,.jpg,.img,.png"
          onChange={handleFileChange}
          className="border p-2 rounded w-full mt-1"
          required={!initialProduct} // HTML required for add case
        />
        {file && (
          <p className="mt-1 text-sm text-gray-600">Selected: {file.name}</p>
        )}
        {initialProduct && formData.image && (
          <p className="mt-1 text-sm text-gray-600">
            Current image: {formData.image}
          </p>
        )}
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {initialProduct ? "Update Product" : "Add Product"}
      </button>
    </form>
  );
}
