import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import Cart from "@/pages/cart";
import { useRouter } from "next/router";
import { useAuth } from "@/contex/AuthContex";
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

describe("Cart Page", () => {
  const mockRouter = {
    push: jest.fn()
  };

  const mockCartItems = [
    {
      id: 1,
      title: "Test Product",
      price: 99.99,
      image: "test.jpg",
      quantity: 2,
      category: { id: 1, name: "Test Category" }
    }
  ];

  const mockCartFunctions = {
    cart: mockCartItems,
    total: 199.98,
    setQuantity: jest.fn(),
    removeFromCart: jest.fn(),
    clearCart: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useAuth as jest.Mock).mockReturnValue({ 
      isAuthenticated: true,
      isLoading: false 
    });
    (useCart as jest.Mock).mockReturnValue(mockCartFunctions);
  });

  it("should redirect to login if not authenticated", () => {
    (useAuth as jest.Mock).mockReturnValue({ 
      isAuthenticated: false,
      isLoading: false 
    });

    render(<Cart />);
    expect(mockRouter.push).toHaveBeenCalledWith("/login");
  });

  it("should show loading state", () => {
    (useAuth as jest.Mock).mockReturnValue({ 
      isAuthenticated: true,
      isLoading: true 
    });

    render(<Cart />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should render empty cart message", () => {
    (useCart as jest.Mock).mockReturnValue({
      ...mockCartFunctions,
      cart: []
    });

    render(<Cart />);
    expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
    expect(screen.getByText("Continue Shopping")).toBeInTheDocument();
  });

  it("should render cart items correctly", () => {
    render(<Cart />);

    expect(screen.getByText(mockCartItems[0].title)).toBeInTheDocument();
    expect(screen.getByText(`$${mockCartItems[0].price}`)).toBeInTheDocument();
    expect(screen.getByText(mockCartItems[0].quantity.toString())).toBeInTheDocument();
    expect(screen.getAllByText(`$${mockCartFunctions.total.toFixed(2)}`)).toHaveLength(2);
  });

  it("should handle quantity changes", () => {
    render(<Cart />);

    const increaseButton = screen.getByText("+");
    const decreaseButton = screen.getByText("-");

    fireEvent.click(increaseButton);
    expect(mockCartFunctions.setQuantity).toHaveBeenCalledWith(mockCartItems[0].id, 3);

    fireEvent.click(decreaseButton);
    expect(mockCartFunctions.setQuantity).toHaveBeenCalledWith(mockCartItems[0].id, 1);
  });

  it("should handle item removal", () => {
    render(<Cart />);

    const removeButton = screen.getByText("Remove");
    fireEvent.click(removeButton);

    expect(mockCartFunctions.removeFromCart).toHaveBeenCalledWith(mockCartItems[0].id);
    expect(toast.success).toHaveBeenCalledWith("Item removed from cart");
  });

  it("should handle purchase", async () => {
    // Setup mocks
    const mockCartFunctions = {
      clearCart: jest.fn(),
      cart: mockCartItems,
      total: 199.98,
      setQuantity: jest.fn(),
      removeFromCart: jest.fn(),
    };
    (useCart as jest.Mock).mockReturnValue(mockCartFunctions);
    
    jest.useFakeTimers();
  
    render(<Cart />);
  
    // klik tombol "Purchase"
    const purchaseButton = screen.getByText("Purchase");
    fireEvent.click(purchaseButton);
  
    // tunggu proses purchase
    expect(screen.getByText("Processing...")).toBeInTheDocument();
  
    // untuk set waktu processing pembelian
    await act(async () => {
      jest.advanceTimersByTime(2000);
    });
  
    // cek modal (pop up)
    const modalTitle = await screen.findByText("Purchase Successful");
    expect(modalTitle).toBeInTheDocument();
  
    // Advance remaining timers
    await act(async () => {
      jest.advanceTimersByTime(3000);
    });
  
    // pastikan cart sudah kosong setelah proses purchase berhasil
    expect(mockCartFunctions.clearCart).toHaveBeenCalled();

    jest.useRealTimers();
  });
}); 