"use client";

import { useState } from "react";
import { useProductStore } from "../app/store/productStore";
import ProductCard from "../app/components/ProductCard";
import { CATEGORIES } from "../app/libs/constants";
import Link from "next/link";

interface Filters {
  category: string;
  minPrice: string;
  maxPrice: string;
}

export default function Home() {
  const products = useProductStore((state) => state.products);
  const [filters, setFilters] = useState<Filters>({
    category: "",
    minPrice: "",
    maxPrice: "",
  });

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setFilters({ category: "", minPrice: "", maxPrice: "" });
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      !filters.category || product.category === filters.category;
    const minPrice = filters.minPrice
      ? parseFloat(filters.minPrice)
      : -Infinity;
    const maxPrice = filters.maxPrice ? parseFloat(filters.maxPrice) : Infinity;
    const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
    return matchesCategory && matchesPrice;
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Filter Products</h2>
        <form className="flex flex-col sm:flex-row gap-4 max-w-lg">
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="border p-2 rounded w-full sm:w-auto"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleFilterChange}
            placeholder="Min Price"
            className="border p-2 rounded w-full sm:w-32"
            min="0"
            step="0.01"
          />
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            placeholder="Max Price"
            className="border p-2 rounded w-full sm:w-32"
            min="0"
            step="0.01"
          />
          <button
            type="button"
            onClick={clearFilters}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Clear Filters
          </button>
        </form>
      </div>
      {products.length === 0 ? (
        <p>
          No products available.{" "}
          <Link href="/products/add" className="text-blue-500 hover:underline">
            Add a product
          </Link>{" "}
          to get started.
        </p>
      ) : filteredProducts.length === 0 ? (
        <p>No products match the selected filters.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
