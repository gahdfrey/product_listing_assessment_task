import Head from "next/head";
import { Product } from "../../types/product";

interface MetaTagsProps {
  product?: Product;
}

export default function MetaTags({ product }: MetaTagsProps) {
  const title = product
    ? `${product.name} - E-Shop`
    : "E-Shop - Product Listings";
  const description = product
    ? product.description
    : "Browse our wide range of products";

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta
        property="og:image"
        content={product?.image || "/images/default.jpg"}
      />
      <meta name="robots" content="index, follow" />
    </Head>
  );
}
