import { renderHook } from "@testing-library/react";
import { useProduct } from "@/hooks/useProduct";
import useSWR from "swr";

// mock swr ini supaya tidak melakukan request asli
jest.mock("swr");

describe("useProduct", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch single product successfully", () => {
    const mockProduct = {
      id: 1,
      title: "Test Product",
      price: 100,
      images: ["test.jpg"],
      description: "Test description",
      category: { id: 1, name: "Test Category" },
    };

    // mock response SWR untuk sukses
    (useSWR as jest.Mock).mockReturnValue({
      data: mockProduct,
      error: undefined,
      isLoading: false,
    });

    // render hook berdasarkan id dari productnya
    const { result } = renderHook(() => useProduct("1"));

    // cek hasilnya
    expect(result.current.product).toEqual(mockProduct);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBeUndefined();
  });

  it("should return null when no product id provided", () => {
    // render hook tdk pake ID
    const { result } = renderHook(() => useProduct(""));
    expect(useSWR).toHaveBeenCalledWith(null, expect.any(Function));
  });

  it("should handle loading state", () => {
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
