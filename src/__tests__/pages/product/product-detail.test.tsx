import { render, screen, fireEvent } from "@testing-library/react";
import ProductDetail from "@/pages/product/[id]";
import { useRouter } from "next/router";
import { useAuth } from "@/contex/AuthContex";
import { useProduct } from "@/hooks/useProduct";
import { useCart } from "@/contex/CartContex";
import { toast } from "react-toastify";

// Mock dependencies
jest.mock("next/router", () => ({
  useRouter: jest.fn()
}));

jest.mock("@/contex/AuthContex", () => ({
  useAuth: jest.fn()
}));

jest.mock("@/contex/CartContex", () => ({
  useCart: jest.fn()
}));

jest.mock("@/hooks/useProduct", () => ({
  useProduct: jest.fn()
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

jest.mock("@/components/Header", () => ({
  __esModule: true,
  default: () => <div data-testid="header">Header</div>
}));

describe("Product Detail Page", () => {
  const mockProduct = {
    id: 1,
    title: "Test Product",
    price: 99.99,
    description: "Test description",
    category: { id: 1, name: "Test Category" },
    images: ["image1.jpg"]
  };

  const mockRouter = {
    query: { id: "1" },
    push: jest.fn()
  };

  const mockAddToCart = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useProduct as jest.Mock).mockReturnValue({
      product: mockProduct,
      isLoading: false
    });
    (useCart as jest.Mock).mockReturnValue({ addToCart: mockAddToCart });
    // Set default auth state
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true });
  });

  it("should render loading state", () => {
    (useProduct as jest.Mock).mockReturnValue({
      product: null,
      isLoading: true
    });
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: false });

    const { container } = render(<ProductDetail />);
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(container.getElementsByClassName("animate-pulse")[0]).toBeInTheDocument();
  });

  it("should render product not found", () => {
    (useProduct as jest.Mock).mockReturnValue({
      product: null,
      isLoading: false
    });
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: false });

    render(<ProductDetail />);
    expect(screen.getByText("Product not found")).toBeInTheDocument();
  });

  it("should render product details correctly", () => {
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: false });

    render(<ProductDetail />);

    expect(screen.getByText(mockProduct.title)).toBeInTheDocument();
    expect(screen.getByText(`$${mockProduct.price}`)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
    expect(screen.getByText(`Category: ${mockProduct.category.name}`)).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", mockProduct.images[0]);
  });

  it("should handle quantity increment and decrement", () => {
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true });

    render(<ProductDetail />);

    const quantity = screen.getByText("1");
    const incrementButton = screen.getByText("+");
    const decrementButton = screen.getByText("-");

    fireEvent.click(incrementButton);
    expect(screen.getByText("2")).toBeInTheDocument();

    fireEvent.click(decrementButton);
    expect(screen.getByText("1")).toBeInTheDocument();

    // Shouldn't go below 1
    fireEvent.click(decrementButton);
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("should redirect to login when not authenticated", () => {
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: false });

    render(<ProductDetail />);

    const addToCartButton = screen.getByRole("button", { name: /login to add to cart/i });
    fireEvent.click(addToCartButton);

    expect(mockRouter.push).toHaveBeenCalledWith("/login");
  });

  it("should add to cart when authenticated", () => {
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true });

    render(<ProductDetail />);

    const addToCartButton = screen.getByRole("button", { name: /add to cart/i });
    fireEvent.click(addToCartButton);

    expect(mockAddToCart).toHaveBeenCalledWith({
      id: mockProduct.id,
      title: mockProduct.title,
      price: mockProduct.price,
      image: mockProduct.images[0],
      quantity: 1,
      category: mockProduct.category
    }, 1);
    expect(toast.success).toHaveBeenCalledWith("Product added to cart");
  });
}); 