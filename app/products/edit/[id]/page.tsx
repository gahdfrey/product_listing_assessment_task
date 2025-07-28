"use client";

import ProductForm from "../../../components/ProductForm";
import { useProductStore } from "../../../store/productStore";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import MetaTags from "../../../components/SEO/MetaTags";
import { use } from "react";

export default function EditProduct({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { products } = useProductStore();
  const router = useRouter();
  const product = products.find((p) => p.id === resolvedParams.id);

  if (!product) {
    notFound();
  }

  return (
    <>
      <MetaTags />
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">Edit Product</h1>
        <ProductForm
          initialProduct={product}
          onSubmit={() => router.push("/")}
        />
      </div>
    </>
  );
}
