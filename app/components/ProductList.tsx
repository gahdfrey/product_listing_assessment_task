"use client";

import { useState } from "react";
import { useProductStore } from "../store/productStore";
import ProductCard from "./ProductCard";
import FilterBar from "../components/FilterBar";
import { Product } from "../types/product";

export default function ProductList() {
  const { products } = useProductStore();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  const handleFilter = (category: string, priceRange: [number, number]) => {
    const filtered = products.filter(
      (product) =>
        (!category || product.category === category) &&
        product.price >= priceRange[0] &&
        product.price <= priceRange[1]
    );
    setFilteredProducts(filtered);
  };

  return (
    <div>
      <FilterBar onFilter={handleFilter} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="text-gray-500">No products found.</p>
        )}
      </div>
    </div>
  );
}
