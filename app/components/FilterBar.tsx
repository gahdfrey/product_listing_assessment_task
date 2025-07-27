import { useState } from "react";
import { CATEGORIES } from "../libs/constants";

interface FilterBarProps {
  onFilter: (category: string, priceRange: [number, number]) => void;
}

export default function FilterBar({ onFilter }: FilterBarProps) {
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  return (
    <div className="mb-4 flex gap-4 flex-col sm:flex-row">
      <select
        value={category}
        onChange={(e) => {
          setCategory(e.target.value);
          onFilter(e.target.value, priceRange);
        }}
        className="border p-2 rounded"
      >
        <option value="">All Categories</option>
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <div className="flex gap-2 items-center">
        <label>Price Range:</label>
        <input
          type="number"
          value={priceRange[0]}
          onChange={(e) => {
            const newPriceRange: [number, number] = [
              +e.target.value,
              priceRange[1],
            ];
            setPriceRange(newPriceRange);
            onFilter(category, newPriceRange);
          }}
          className="border p-2 rounded w-24"
          placeholder="Min"
        />
        <input
          type="number"
          value={priceRange[1]}
          onChange={(e) => {
            const newPriceRange: [number, number] = [
              priceRange[0],
              +e.target.value,
            ];
            setPriceRange(newPriceRange);
            onFilter(category, newPriceRange);
          }}
          className="border p-2 rounded w-24"
          placeholder="Max"
        />
      </div>
    </div>
  );
}
