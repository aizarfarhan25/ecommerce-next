import { renderHook } from "@testing-library/react";
import { useProduct } from "@/hooks/useProduct";
import useSWR from "swr";

// Mock SWR ini supaya tidak melakukan request asli
jest.mock("swr");

describe("useProduct", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch single product successfully", () => {
    // Mock data produk tunggal
    const mockProduct = {
      id: 1,
      title: "Test Product",
      price: 100,
      images: ["test.jpg"],
      description: "Test description",
      category: { id: 1, name: "Test Category" },
    };

    // Mock response SWR untuk sukses
    (useSWR as jest.Mock).mockReturnValue({
      data: mockProduct,
      error: undefined,
      isLoading: false,
    });

    // Render hook berdasarkan ID dari productnya
    const { result } = renderHook(() => useProduct("1"));

    // Cek hasilnya
    expect(result.current.product).toEqual(mockProduct);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBeUndefined();
  });

  it("should return null when no product id provided", () => {
    // Render hook tanpa ID
    const { result } = renderHook(() => useProduct(""));

    // Harusnya tidak memanggil SWR
    expect(useSWR).toHaveBeenCalledWith(null, expect.any(Function));
  });

  it("should handle loading state", () => {
    // Mock loading state
    (useSWR as jest.Mock).mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
    });

    const { result } = renderHook(() => useProduct("1"));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.product).toBeUndefined();
  });

  it("should handle error state", () => {
    const error = new Error("Failed to fetch product");

    // Mock error state
    (useSWR as jest.Mock).mockReturnValue({
      data: undefined,
      error,
      isLoading: false,
    });

    const { result } = renderHook(() => useProduct("1"));

    expect(result.current.isError).toBe(error);
    expect(result.current.product).toBeUndefined();
  });
});
