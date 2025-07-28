import { act } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProductCard from "../../app/components/ProductCard";
import { useProductStore } from "../../app/store/productStore";
import { toast } from "react-toastify";

jest.mock('react-toastify', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

describe('ProductCard', () => {
  const product = {
    id: '1',
    name: 'Soccer Ball',
    description: 'Durable soccer ball.',
    price: 24.99,
    category: 'Sports',
    image: '/images/test.jpg',
    createdAt: new Date().toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useProductStore.setState({
      products: [product],
      deleteProduct: jest.fn().mockResolvedValue(undefined),
    });
  });

  it('renders product details', () => {
    render(<ProductCard product={product} />);
    expect(screen.getByText('Soccer Ball')).toBeInTheDocument();
    // Updated to match the Nigerian Naira symbol
    expect(screen.getByText('₦ 24.99')).toBeInTheDocument();
    expect(screen.getByText('Sports')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Soccer Ball' })).toBeInTheDocument();
  });

  it('calls deleteProduct on delete button click', async () => {
    const deleteProduct = jest.fn().mockResolvedValue(undefined);
    useProductStore.setState({ deleteProduct });
    render(<ProductCard product={product} />);
    await act(async () => {
      fireEvent.click(screen.getByText('Delete'));
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(deleteProduct).toHaveBeenCalledWith('1');
    expect(toast.success).toHaveBeenCalledWith('Soccer Ball deleted successfully!');
  });

  it('shows error toast on delete failure', async () => {
    // Suppress the expected console.error for this test
    const originalError = console.error;
    console.error = jest.fn();

    const deleteProduct = jest.fn().mockRejectedValue(new Error('Delete failed'));
    useProductStore.setState({ deleteProduct });
    render(<ProductCard product={product} />);
    await act(async () => {
      fireEvent.click(screen.getByText('Delete'));
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(toast.error).toHaveBeenCalledWith('Failed to delete Soccer Ball. Please try again.');
    
    // Restore console.error
    console.error = originalError;
  });
});
