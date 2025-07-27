"use client";

import Link from "next/link";
import { useProductStore } from "../store/productStore";
import { toast } from "react-toastify";

export default function Navbar() {
  const clearStorage = useProductStore((state) => state.clearStorage);

  const handleClear = async () => {
    try {
      await clearStorage();
      toast.success("IndexedDB cleared and products reset!");
    } catch (error) {
      console.error("Failed to clear IndexedDB:", error);
      toast.error("Failed to clear IndexedDB.");
    }
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-lg font-bold">
          E-Shop
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/products/add"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Product
          </Link>

          <button
            onClick={handleClear}
            className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer"
          >
            Clear IndexedDB
          </button>
        </div>
      </div>
    </nav>
  );
}
