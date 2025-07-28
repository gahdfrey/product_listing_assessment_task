# E-commerce Application Documentation

## Overview

This project is a Next.js-based e-commerce application designed to demonstrate a product catalog with CRUD (Create, Read, Update, Delete) functionality, persisted using IndexedDB. The application features a responsive UI, server-side rendering (SSR) for improved performance and SEO, a custom ImageContainer component with pulse animation for loading states, and product filtering by category and price. The project uses TypeScript for type safety, Zustand for state management, Tailwind CSS for styling, and Jest with React Testing Library for unit tests.

## Key Features

- **Product Management**: Add, edit, delete, and view products stored in IndexedDB.
- **Image Loading**: Custom ImageContainer component with pulse animation and fallback image handling.
- **Filtering**: Filter products by category and price range on the homepage.
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS.
- **Testing**: Comprehensive unit tests for components and store logic.
- **SEO**: Optimized for search engines with SSR and semantic HTML.

## Setup Instructions

### Prerequisites

- **Node.js**: Version 18.x or higher.
- **npm**: Version 8.x or higher.
- **Git**: For cloning the repository.

### Installation

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd ecommerce_assessment_task
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open http://localhost:3000 in your browser to view the application.

4. **Run Tests**:
   ```bash
   npm run test
   ```
   To generate a test coverage report:
   ```bash
   npm run test:coverage
   ```

5. **Build for Production**:
   ```bash
   npm run build
   ```

6. **Start the Production Server**:
   ```bash
   npm start
   ```

## Design Decisions, Optimizations, and Trade-offs

### Design Decisions

- **State Management**: Used Zustand with persist middleware and idb-keyval for client-side storage in IndexedDB, ensuring data persists across sessions without a backend server.
- **Image Loading**: Implemented ImageContainer with a pulse animation (`bg-gray-200 animate-pulse`) for a better UX during image loading, with a fallback image (`/images/front-view-shiny-new-football.jpg`) for error handling.
- **Routing**: Leveraged Next.js App Router for dynamic routes (`/products/[id]`, `/products/edit/[id]`) and static routes (`/`, `/products/add`).
- **Styling**: Used Tailwind CSS for rapid development and responsive design, with utility classes applied directly in components.
- **Type Safety**: Adopted TypeScript with a Product interface (`app/types/product.ts`) for robust type checking across components and store.
- **Testing**: Wrote unit tests with Jest and React Testing Library to cover component rendering, store operations, and user interactions.

### Optimizations

- **SSR Compatibility**: Ensured productStore checks for `typeof indexedDB !== 'undefined'` to avoid SSR errors, initializing an empty state on the server.
- **Image Optimization**: Used `next/image` with fill layout for responsive images and lazy loading, with a fallback image to handle errors gracefully.
- **Performance**: Minimized re-renders in ImageContainer by using `useState` for loading and error states, avoiding unnecessary DOM updates.
- **Testing**: Mocked `next/image`, `next/navigation`, and `idb-keyval` to ensure fast and reliable tests, with `act` and `setTimeout` for async store operations.

### Trade-offs

- **Client-Side Storage**: Chose IndexedDB over a backend API for simplicity, but this limits scalability and data sharing across devices. A backend could be added for multi-user support.
- **Pulse Animation**: Implemented a simple `animate-pulse` class for loading states, which is lightweight but may lack customization compared to a more complex animation library.
- **Testing Scope**: Focused on unit tests for components and store, omitting integration or end-to-end tests to keep the scope manageable. Cypress or Playwright could be added for broader coverage.
- **SEO**: Used SSR for initial page loads, but dynamic client-side filtering may not be indexed by search engines. Pre-rendering filter states could improve SEO further.

## SEO Handling

SEO was handled through the following strategies:

- **Server-Side Rendering (SSR)**: The homepage (`app/page.tsx`) and product detail pages (`app/products/[id]/page.tsx`) use SSR to ensure search engines can crawl product data on initial load. The `useProductStore` is initialized with an empty state on the server to avoid IndexedDB errors.
- **Semantic HTML**: Components like ProductCard use semantic HTML (`<h2>`, `<p>`) for better accessibility and search engine understanding.
- **Meta Tags**: The root layout (`app/layout.tsx`) includes basic meta tags for description and viewport settings. Dynamic meta tags could be added per product page for better SEO.
- **Image Optimization**: The ImageContainer component uses `next/image` with descriptive alt text, improving accessibility and image search rankings.

### Limitations

Client-side filtering (category and price) is not pre-rendered, so filtered states are not indexed. Static Site Generation (SSG) or Incremental Static Regeneration (ISR) could be implemented for filter pages to enhance SEO.

## Running the Application Locally

Follow the Installation steps above to set up the project.
Access the application at http://localhost:3000.

### Test Features

- **Add Products**: Navigate to `/products/add` to create a new product.
- **View Products**: Visit `/` to see the product list, with filtering by category and price.
- **Edit/Delete Products**: Use the "Edit" and "Delete" buttons on each ProductCard.
- **Clear Database**: Click the "Clear Database" button in the header to reset IndexedDB.
- **Pulse Animation**: Add a product with a large image and observe the pulse animation on `/` (200x200px) and `/products/<id>` (400x400px).
