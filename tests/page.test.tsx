import { render, screen, fireEvent } from "@testing-library/react";
import { act } from "react";
import Home from "../app/page";
import { useProductStore } from "../app/store/productStore";
import { Product } from "../app/types/product";

describe("Home Page", () => {
  const mockProducts: Product[] = [
    {
      id: "1",
      name: "Soccer Ball",
      description: "Durable soccer ball.",
      price: 24.99,
      category: "Sports",
      image: "/images/test.jpg",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Wireless Headphones",
      description: "Bluetooth headphones.",
      price: 99.99,
      category: "Electronics",
      image: "/images/test2.jpg",
      createdAt: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useProductStore.setState({ products: [] });
  });

  it("shows empty state when no products exist", () => {
    render(<Home />);
    expect(screen.getByText(/No products available/i)).toBeInTheDocument();
    expect(screen.getByText("Add a product")).toHaveAttribute(
      "href",
      "/products/add"
    );
  });

  it("filters products by category", async () => {
    useProductStore.setState({ products: mockProducts });
    render(<Home />);
    await act(async () => {
      fireEvent.change(screen.getByRole("combobox"), {
        target: { value: "Sports" },
      });
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(screen.getByText("Soccer Ball")).toBeInTheDocument();
    expect(screen.queryByText("Wireless Headphones")).not.toBeInTheDocument();
  });

  it("filters products by price range", async () => {
    useProductStore.setState({ products: mockProducts });
    render(<Home />);
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("Min Price"), {
        target: { value: "50" },
      });
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(screen.queryByText("Soccer Ball")).not.toBeInTheDocument();
    expect(screen.getByText("Wireless Headphones")).toBeInTheDocument();
  });

  it("clears filters", async () => {
    useProductStore.setState({ products: mockProducts });
    render(<Home />);
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("Min Price"), {
        target: { value: "50" },
      });
      fireEvent.click(screen.getByText("Clear Filters"));
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(screen.getByText("Soccer Ball")).toBeInTheDocument();
    expect(screen.getByText("Wireless Headphones")).toBeInTheDocument();
  });

  it("shows no products match message when filtered", async () => {
    useProductStore.setState({ products: mockProducts });
    render(<Home />);
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("Min Price"), {
        target: { value: "1000" },
      });
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(
      screen.getByText("No products match the selected filters.")
    ).toBeInTheDocument();
  });
});
