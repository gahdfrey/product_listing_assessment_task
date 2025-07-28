import { act } from "@testing-library/react";
import { useProductStore } from "../../app/store/productStore";
import { get, set, del } from "idb-keyval";
import { Product } from "../../app/types/product";

jest.mock("idb-keyval", () => ({
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
}));

describe("ProductStore", () => {
  const mockedGet = get as jest.MockedFunction<typeof get>;
  const mockedSet = set as jest.MockedFunction<typeof set>;
  const mockedDel = del as jest.MockedFunction<typeof del>;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockedGet.mockResolvedValue(null);
    mockedSet.mockResolvedValue();
    mockedDel.mockResolvedValue();

    // Reset store state completely
    await act(async () => {
      useProductStore.setState({ products: [] });
    });
  });

  it("initializes with empty products", async () => {
    await act(async () => {
      // Initialize the store
      const state = useProductStore.getState();
      expect(state.products).toEqual([]);
    });
  });

  it("adds a product", async () => {
    const newProduct = {
      name: "New Product",
      description: "Test",
      price: 20,
      category: "Test",
      image: "/images/test.jpg",
    };

    await act(async () => {
      await useProductStore.getState().addProduct(newProduct);
    });

    const products = useProductStore.getState().products;
    expect(products).toHaveLength(1);
    expect(products[0]).toMatchObject({
      name: "New Product",
      price: 20,
      description: "Test",
      category: "Test",
      image: "/images/test.jpg",
    });
    expect(products[0]).toHaveProperty("id");
    expect(products[0]).toHaveProperty("createdAt");
  });

  it("updates a product", async () => {
    const newProduct = {
      name: "Old Product",
      description: "Test",
      price: 20,
      category: "Test",
      image: "/images/test.jpg",
    };

    // Add product first
    await act(async () => {
      await useProductStore.getState().addProduct(newProduct);
    });

    const product = useProductStore.getState().products[0];

    // Update the product
    await act(async () => {
      await useProductStore
        .getState()
        .updateProduct(product.id, { name: "Updated Product", price: 30 });
    });

    const updatedProducts = useProductStore.getState().products;
    expect(updatedProducts).toHaveLength(1);
    expect(updatedProducts[0]).toMatchObject({
      name: "Updated Product",
      price: 30,
      id: product.id,
    });
  });

  it("deletes a product", async () => {
    const newProduct = {
      name: "Product",
      description: "Test",
      price: 20,
      category: "Test",
      image: "/images/test.jpg",
    };

    // Add product first
    await act(async () => {
      await useProductStore.getState().addProduct(newProduct);
    });

    const product = useProductStore.getState().products[0];

    // Delete the product
    await act(async () => {
      await useProductStore.getState().deleteProduct(product.id);
    });

    expect(useProductStore.getState().products).toEqual([]);
  });

  it("clears storage", async () => {
    const newProduct = {
      name: "Product",
      description: "Test",
      price: 20,
      category: "Test",
      image: "/images/test.jpg",
    };

    // Add product first
    await act(async () => {
      await useProductStore.getState().addProduct(newProduct);
    });

    expect(useProductStore.getState().products).toHaveLength(1);

    // Clear storage
    await act(async () => {
      await useProductStore.getState().clearStorage();
    });

    expect(useProductStore.getState().products).toEqual([]);
  });
});
