import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "@/contex/CartContex";
import { ReactNode } from "react";

// Mock useRouter
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const localStorageMock = {
  getItem: jest.fn(() => null),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};
Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("useCart", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <CartProvider>{children}</CartProvider>
  );

  const mockProduct = {
    id: 1,
    title: "Test Product",
    price: 100,
    images: ["test.jpg"],
    category: { id: 1, name: "Test Category" },
  };

  it("should start with empty cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.cart).toHaveLength(0);
    expect(result.current.total).toBe(0);
  });

  it("should add item to cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(
        {
          id: mockProduct.id,
          title: mockProduct.title,
          price: mockProduct.price,
          image: mockProduct.images[0],
          category: mockProduct.category,
        },
        1
      );
    });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0]).toEqual({
      id: mockProduct.id,
      title: mockProduct.title,
      price: mockProduct.price,
      image: mockProduct.images[0],
      quantity: 1,
      category: mockProduct.category,
    });
    expect(result.current.total).toBe(100);
  });

  it("should update quantity of existing item", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(
        {
          id: mockProduct.id,
          title: mockProduct.title,
          price: mockProduct.price,
          image: mockProduct.images[0],
          category: mockProduct.category,
        },
        1
      );
      result.current.setQuantity(mockProduct.id, 2);
    });

    expect(result.current.cart[0].quantity).toBe(2);
    expect(result.current.total).toBe(200);
  });

  it("should remove item from cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(
        {
          id: mockProduct.id,
          title: mockProduct.title,
          price: mockProduct.price,
          image: mockProduct.images[0],
          category: mockProduct.category,
        },
        1
      );
      result.current.removeFromCart(mockProduct.id);
    });

    expect(result.current.cart).toHaveLength(0);
    expect(result.current.total).toBe(0);
  });
});
