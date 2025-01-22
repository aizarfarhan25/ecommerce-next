import { render, screen, fireEvent } from "@testing-library/react";
import ProductList from "@/components/ProductList";
import { useAuth } from "@/contex/AuthContex";
import { useRouter } from "next/router";
// import { toast } from "react-toastify";
import { CartProvider } from "@/contex/CartContex";

// Mock dependencies
jest.mock("@/contex/AuthContex");
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

// Perbaikan mock untuk toast
const mockToastSuccess = jest.fn();
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn().mockImplementation((...args) => mockToastSuccess(...args)),
    error: jest.fn()
  }
}));

// Mock CartContext
const mockAddToCart = jest.fn();
jest.mock("@/contex/CartContex", () => ({
  useCart: () => ({
    addToCart: mockAddToCart
  }),
  CartProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Buat wrapper component
const renderWithProviders = (ui: React.ReactElement) => {
  return render(<CartProvider>{ui}</CartProvider>);
};

describe("ProductList", () => {
  const mockProducts = [
    {
      id: 1,
      title: "Test Product",
      price: 100,
      images: ["test.jpg"],
      category: { id: 1, name: "Test Category" },
    },
  ];

  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it("should render products correctly", () => {
    // Mock authenticated user
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true });

    renderWithProviders(<ProductList products={mockProducts} />);

    // Cek apakah produk ditampilkan
    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("$100.00")).toBeInTheDocument();
    expect(screen.getByText("Test Category")).toBeInTheDocument();
  });

  it("should show login button when user is not authenticated", () => {
    // Mock unauthenticated user
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: false });

    renderWithProviders(<ProductList products={mockProducts} />);

    // Cek tombol login
    expect(screen.getByText("Login to Add")).toBeInTheDocument();
  });

  it("should redirect to login page when add to cart clicked while not authenticated", () => {
    // Mock unauthenticated user
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: false });

    renderWithProviders(<ProductList products={mockProducts} />);

    // Klik tombol add to cart
    fireEvent.click(screen.getByText("Login to Add"));

    // Cek redirect ke login kalau semisal usernya belom login
    expect(mockRouter.push).toHaveBeenCalledWith("/login");
  });

  it("should add product to cart when user is authenticated", () => {
    // Mock authenticated user
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true });

    renderWithProviders(<ProductList products={mockProducts} />);

    // Click add to cart button
    fireEvent.click(screen.getByText("Add to Cart"));

    // Verify addToCart was called with correct arguments
    expect(mockAddToCart).toHaveBeenCalledWith(
      {
        id: mockProducts[0].id,
        title: mockProducts[0].title,
        price: mockProducts[0].price,
        image: mockProducts[0].images[0],
        category: mockProducts[0].category,
      },
      1
    );
  });

  it("should show success toast when product is added to cart", () => {
    // Mock authenticated user
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true });

    renderWithProviders(<ProductList products={mockProducts} />);

    // Click add to cart button
    fireEvent.click(screen.getByText("Add to Cart"));

    // Verify success toast was shown
    expect(mockToastSuccess).toHaveBeenCalledWith("Product added to cart");
  });

  it("should navigate to product detail page when clicking on product", () => {
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true });

    renderWithProviders(<ProductList products={mockProducts} />);

    // Find and click the product link
    const productLink = screen.getByRole("link");
    expect(productLink).toHaveAttribute("href", "/product/1");
  });

  it("should render placeholder image when product image is not available", () => {
    const productsWithoutImage = [{
      ...mockProducts[0],
      images: []
    }];
    
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true });

    renderWithProviders(<ProductList products={productsWithoutImage} />);

    // Check if placeholder image is rendered
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "/placeholder.svg");
  });
});
