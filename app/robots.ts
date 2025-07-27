export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    },
    sitemap: 'https://dummy-ecommerce-assessment-task.vercel.app/sitemap.xml',
  };
}