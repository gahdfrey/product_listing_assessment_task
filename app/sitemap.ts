import { useProductStore } from '../app/store/productStore';

export default async function sitemap() {
  const products = useProductStore.getState().products;
  const baseUrl = 'https://dummy-ecommerce-assessment-task.vercel.app';

  const productUrls = products.map((product) => ({
    url: `${baseUrl}/products/${product.id}`,
    lastModified: new Date(product.createdAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    ...productUrls,
  ];
}