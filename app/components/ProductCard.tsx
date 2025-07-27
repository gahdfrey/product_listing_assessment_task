"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "../types/product";
import { useProductStore } from "../store/productStore";
import { toast } from "react-toastify";
import ImageContainer from "./ImageContainer";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { deleteProduct } = useProductStore();
  const [imageSrc, setImageSrc] = useState(product.image);

  const handleDelete = async () => {
    try {
      await deleteProduct(product.id);
      toast.success(`${product.name} deleted successfully!`);
    } catch (error) {
      console.error(`Failed to delete ${product.name}:`, error);
      toast.error(`Failed to delete ${product.name}. Please try again.`);
    }
  };

  const formattedPrice =
    typeof product.price === "number" && !isNaN(product.price)
      ? `₦ ${product.price.toFixed(2)}`
      : "N/A";

  if (typeof product.price !== "number" || isNaN(product.price)) {
    console.warn(`Invalid price for product ${product.name}: ${product.price}`);
  }

  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
      <ImageContainer
        src={product.image}
        alt={product.name}
        width={200}
        height={200}
        className="mb-4"
      />
      <h2 className="text-lg font-semibold">{product.name}</h2>
      <p className="text-gray-600">{formattedPrice}</p>
      <p className="text-sm text-gray-500">{product.category}</p>
      <div className="flex gap-2 mt-2">
        <Link href={`/products/${product.id}`} className="text-blue-500">
          View Details
        </Link>
        <button
          onClick={handleDelete}
          className="text-red-500 cursor-pointer hover:text-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
