import { render, screen, fireEvent } from "@testing-library/react";
import ProductList from "@/components/ProductList";
import { useAuth } from "@/contex/AuthContex";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { CartProvider } from "@/contex/CartContex";

// Mock dependencies
jest.mock("@/contex/AuthContex");
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));
jest.mock("react-toastify");

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
});
