"use client";

import { useState } from "react";
import { useProductStore } from "../../store/productStore";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import MetaTags from "../../components/SEO/MetaTags";
import { use } from "react";
import ImageContainer from "@/app/components/ImageContainer";

// Props type for dynamic route
interface ProductPageProps {
  params: Promise<{ id: string }>;
}

const ProductPage = ({ params }: ProductPageProps) => {
  const resolvedParams = use(params);
  const { products } = useProductStore();
  const product = products.find((p) => p.id === resolvedParams.id);

  if (!product) {
    notFound();
  }

  return (
    <>
      <MetaTags product={product} />
      <div className="container mx-auto py-8">
        <Link href="/" className="text-blue-500 mb-4 inline-block">
          Back to Products
        </Link>
        <div className="flex flex-col md:flex-row gap-8 border-1 rounded-sm w-auto p-4">
          <ImageContainer
            src={product.image}
            alt={product.name}
            width={400}
            height={400}
            priority={true}
          />
          <div>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p className="text-gray-600">₦ {product.price.toFixed(2)}</p>
            <p className="text-gray-500">{product.category}</p>
            <p className="mt-4">{product.description}</p>
            <Link
              href={`/products/edit/${product.id}`}
              className="bg-yellow-500 text-white px-4 py-2 rounded mt-4 inline-block"
            >
              Edit Product
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductPage;
