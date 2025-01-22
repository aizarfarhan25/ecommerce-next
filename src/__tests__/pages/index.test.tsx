import { render, screen } from "@testing-library/react";
import Home from "@/pages/index";
import { useProducts } from "@/hooks/useProducts";

// Mock the hooks
jest.mock("@/hooks/useProducts", () => ({
  useProducts: jest.fn()
}));

// Mock the components
jest.mock("@/components/ProductList", () => ({
  __esModule: true,
  default: function MockProductList({ products }: { products: any[] }) {
    return <div data-testid="product-list">{products.length} products</div>;
  },
}));

jest.mock("@/components/CategoryFilter", () => ({
  __esModule: true,
  default: function MockCategoryFilter() {
    return <div data-testid="category-filter">Category Filter</div>;
  },
}));

jest.mock("@/components/Header", () => ({
  __esModule: true,
  default: () => <div data-testid="header">Header</div>,
}));

jest.mock("@/components/Footer", () => ({
  __esModule: true,
  default: () => <div data-testid="footer">Footer</div>,
}));

describe("Home Page", () => {
  const mockInitialCategories = [
    { id: 1, name: "Category 1" },
    { id: 2, name: "Category 2" }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render loading state initially", () => {
    (useProducts as jest.Mock).mockReturnValue({
      products: [],
      isLoading: true
    });

    const { container } = render(<Home initialCategories={mockInitialCategories} />);
    
    // Verify loading skeleton is rendered
    const skeletonElements = container.getElementsByClassName("animate-pulse");
    expect(skeletonElements.length).toBe(12); // 1 category header + 5 category items + 6 product skeletons
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("should render products and categories when data is loaded", () => {
    const mockProducts = [
      { id: 1, title: "Product 1", price: 100 },
      { id: 2, title: "Product 2", price: 200 }
    ];

    (useProducts as jest.Mock).mockReturnValue({
      products: mockProducts,
      isLoading: false
    });

    render(<Home initialCategories={mockInitialCategories} />);

    expect(screen.getByTestId("product-list")).toBeInTheDocument();
    expect(screen.getByTestId("category-filter")).toBeInTheDocument();
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("should render empty product list when no products are available", () => {
    (useProducts as jest.Mock).mockReturnValue({
      products: [],
      isLoading: false
    });

    render(<Home initialCategories={mockInitialCategories} />);

    expect(screen.getByTestId("product-list")).toBeInTheDocument();
    expect(screen.getByText("0 products")).toBeInTheDocument();
  });
}); 