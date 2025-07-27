import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { get, set, del } from 'idb-keyval';
import { Product } from '../types/product';


interface ProductState {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => Promise<void>;
  clearStorage: () => Promise<void>;
}

const indexedDBStorage = {
  getItem: async (name: string) => {
    if (typeof indexedDB === 'undefined') {
      return null;
    }
    try {
      const data = await get(name);
      console.log(`IndexedDB getItem ${name}:`, data);
      return data ? JSON.stringify(data) : JSON.stringify({ products: [] });
    } catch (error) {
      console.error(`Error accessing IndexedDB for ${name}:`, error);
      return JSON.stringify({ products: [] });
    }
  },
  setItem: async (name: string, value: string) => {
    if (typeof indexedDB === 'undefined') {
      return;
    }
    try {
      const parsedValue = JSON.parse(value);
      console.log(`IndexedDB setItem ${name}:`, parsedValue);
      await set(name, parsedValue);
    } catch (error) {
      console.error(`Error writing to IndexedDB for ${name}:`, error);
    }
  },
  removeItem: async (name: string) => {
    if (typeof indexedDB === 'undefined') {
      return;
    }
    try {
      console.log(`Removing from IndexedDB: ${name}`);
      await del(name);
    } catch (error) {
      console.error(`Error deleting from IndexedDB: ${name}:`, error);
    }
  },
};

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      products: [], // Initialize empty
      addProduct: (product) => {
        const price = parseFloat(product.price as unknown as string);
        if (isNaN(price) || price < 0) {
          console.error(`Error adding product ${product.name}: invalid price ${product.price}`);
          return;
        }
        if (!product.image) {
          console.error(`Error adding product ${product.name}: image required`);
          return;
        }
        set((state) => {
          const newProduct = {
            ...product,
            id: crypto.randomUUID(),
            price,
            createdAt: new Date().toISOString(),
          };
          console.log('Adding new product:', newProduct);
          return {
            products: [...state.products, newProduct],
          };
        });
      },
      updateProduct: (id: string, updatedProduct) =>
        set((state) => {
          console.log(`Updating product ID: ${id}`, updatedProduct);
          return {
            products: state.products.map((product) =>
              product.id === id
                ? {
                    ...product,
                    ...updatedProduct,
                    price:
                      updatedProduct.price !== undefined
                        ? parseFloat(updatedProduct.price as unknown as string) || product.price
                        : product.price,
                    image: updatedProduct.image || product.image,
                  }
                : product
            ),
          };
        }),
      deleteProduct: async (id: string) => {
        set((state) => {
          console.log(`Deleting product ID: ${id}`);
          const updatedProducts = state.products.filter((product) => product.id !== id);
          console.log('Updated products after deletion:', updatedProducts);
          return { products: updatedProducts };
        });
      },
      clearStorage: async () => {
        if (typeof indexedDB === 'undefined') {
          set({ products: [] });
          return;
        }
        console.log('Clearing IndexedDB product-storage');
        await indexedDB.deleteDatabase('product-storage');
        set({ products: [] });
      },
    }),
    {
      name: 'product-storage',
      storage: createJSONStorage(() => indexedDBStorage),
      partialize: (state) => ({ products: state.products }),
    }
  )
);